#!/usr/bin/env python3
"""
=============================================================================
Telecom Event Deduplication & Correlation Engine  v6.0
=============================================================================
Hybrid pipeline — addresses all three weaknesses:

  WEAKNESS 1 — LLM Non-Determinism
    Fix: LLM is NEVER used for dedup/corr decisions.
         LLM is used ONLY for explanation after decisions are made.
         Decisions come from deterministic identity + semantic stages.

  WEAKNESS 2 — Semantic Can Mislead (Gi0/1 vs Gi0/2)
    Fix: Candidate search is scoped by (device + resource_name + resource_type)
         BEFORE semantic similarity is computed.
         R1/Gi0/1 and R1/Gi0/2 never enter the same candidate group.

  WEAKNESS 3 — LLM Cost / Latency
    Fix: FAISS vector index for O(log n) candidate search.
         Clustering reduces groups dramatically.
         LLM called once per cluster/group for explanation only.
         50k events -> ~200 clusters -> ~200 LLM calls.

PIPELINE:
  Stage 1  Identity grouping     device + resource_name + resource_type
  Stage 2  Time window buckets   30-min sliding windows per identity group
  Stage 3  FAISS vector search   fast ANN within each bucket
  Stage 4  Cluster formation     connected components from similarity graph
  Stage 5  Dedup decision        deterministic: within-cluster oldest = master
  Stage 6  Correlation graph     cross-resource groups on same device
  Stage 7  LLM explanation       one call per dedup cluster + corr group
=============================================================================
"""

import sys, os, csv, json, logging, argparse, hashlib, warnings
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field
from collections import defaultdict

import requests
import numpy as np

warnings.filterwarnings("ignore")
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)

if hasattr(sys.stdout, "buffer"):
    import io as _io
    sys.stdout = _io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

_fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s - %(message)s")
_sh  = logging.StreamHandler(sys.stdout)
_sh.setFormatter(_fmt)
_fh  = logging.FileHandler("telecom_correlator.log", mode="w", encoding="utf-8")
_fh.setFormatter(_fmt)
logging.basicConfig(level=logging.INFO, handlers=[_sh, _fh])
logger = logging.getLogger("TelecomCorrelator")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
OLLAMA_BASE_URL  = os.getenv("OLLAMA_BASE_URL",    "http://localhost:11434")
OLLAMA_MODEL     = os.getenv("OLLAMA_MODEL",       "llama3")
EMBEDDING_MODEL  = os.getenv("EMBEDDING_MODEL",    "all-MiniLM-L6-v2")
DEDUP_THRESHOLD  = float(os.getenv("DEDUP_THRESHOLD",    "0.88"))
CORR_THRESHOLD   = float(os.getenv("CORR_THRESHOLD",     "0.72"))
TIME_WINDOW_MIN  = int(os.getenv("TIME_WINDOW_MINUTES",  "30"))

LABEL_UNIQUE     = "UNIQUE"
LABEL_DUPLICATE  = "DUPLICATE"
LABEL_CORRELATED = "CORRELATED"

SOURCE_NMS = "nms_event"

# Telecom domain knowledge — injected into LLM system prompt for explanations only
TELECOM_SYSTEM_PROMPT = """You are an expert telecom NOC engineer.
You explain network event deduplication and correlation decisions in clear, concise language.
You understand: NMS authority, interface-level fault identity, severity escalation,
cross-source reporting, recovery/clear events, and cascading fault patterns.
Always be specific — mention device names, interface names, and fault types in your explanations."""


# ===========================================================================
# Data Model
# ===========================================================================
@dataclass
class NormalizedEvent:
    event_id:          str
    source_type:       str
    timestamp:         datetime
    device:            str
    resource_name:     str
    resource_type:     str
    event_type:        str
    severity:          str
    message:           str
    raw_fields:        dict = field(default_factory=dict)

    label:             str   = LABEL_UNIQUE
    duplicate_of:      str   = ""
    dedup_reason:      str   = ""
    dedup_confidence:  float = 0.0
    dedup_sources:     str   = ""   # pipe-separated sources in cluster e.g. "nms_event|syslog"
    dedup_evidence:    str   = ""   # pipe-separated event_ids in cluster

    correlation_group: str   = ""
    corr_reason:       str   = ""
    corr_confidence:   float = 0.0
    corr_sources:      str   = ""   # pipe-separated sources in corr group
    corr_evidence:     str   = ""   # pipe-separated event_ids in corr group

    similarity_score:  float = 0.0
    embedding:         Optional[object] = field(default=None, repr=False)

    def identity_key(self) -> str:
        """
        Primary key for candidate scoping.
        Events with different identity keys NEVER enter the same dedup candidate group.
        Prevents Gi0/1 vs Gi0/2 being compared, and CPU vs Interface being compared.
        """
        return f"{self.device}|{self.resource_name.lower()}|{self.resource_type.lower()}"

    def semantic_text(self) -> str:
        return (
            f"Device:{self.device} Interface:{self.resource_name} "
            f"Type:{self.resource_type} Event:{self.event_type} "
            f"Severity:{self.severity} Source:{self.source_type} "
            f"Message:{self.message}"
        )

    def to_output_dict(self) -> dict:
        return {
            "event_id":          self.event_id,
            "source_type":       self.source_type,
            "timestamp":         self.timestamp.isoformat(),
            "device":            self.device,
            "resource_name":     self.resource_name,
            "resource_type":     self.resource_type,
            "event_type":        self.event_type,
            "severity":          self.severity,
            "message":           self.message,
            "label":             self.label,
            # Dedup columns
            "duplicate_of":      self.duplicate_of,
            "dedup_sources":     self.dedup_sources,
            "dedup_evidence":    self.dedup_evidence,
            "dedup_reason":      self.dedup_reason,
            "dedup_confidence":  f"{self.dedup_confidence:.1f}%",
            # Correlation columns
            "correlation_group": self.correlation_group,
            "corr_sources":      self.corr_sources,
            "corr_evidence":     self.corr_evidence,
            "corr_reason":       self.corr_reason,
            "corr_confidence":   f"{self.corr_confidence:.1f}%",
            # Diagnostic
            "similarity_score":  round(self.similarity_score, 4),
        }


# ===========================================================================
# Parsers
# ===========================================================================
class BaseParser:
    SOURCE_TYPE: str = ""

    def _id(self, row: dict, prefix: str) -> str:
        return f"{prefix}-{hashlib.md5(json.dumps(row, sort_keys=True, default=str).encode()).hexdigest()[:10]}"

    def _ts(self, s: str) -> datetime:
        for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S"):
            try:
                return datetime.strptime(s.strip(), fmt)
            except ValueError:
                pass
        raise ValueError(f"Bad timestamp: {s!r}")

    def _delim(self, fp: str) -> str:
        return "\t" if fp.endswith(".tsv") else ","


class NetworkEventParser(BaseParser):
    SOURCE_TYPE = "network_event"

    def parse_file(self, filepath: str):
        events, skipped = [], 0
        with open(filepath, newline="", encoding="utf-8") as f:
            for i, row in enumerate(csv.DictReader(f, delimiter=self._delim(filepath))):
                row = {k.strip(): v.strip() for k, v in row.items() if k}
                try:
                    events.append(NormalizedEvent(
                        event_id=self._id(row, "NET"), source_type=self.SOURCE_TYPE,
                        timestamp=self._ts(row.get("timestamp", "")),
                        device=row.get("device", "").lower().strip(),
                        resource_name=row.get("resource_name", "").lower().strip(),
                        resource_type=row.get("resource_type", ""),
                        event_type=row.get("event_type", ""),
                        severity=row.get("severity", ""),
                        message=row.get("event_msg", ""), raw_fields=row,
                    ))
                except Exception as e:
                    skipped += 1; logger.debug(f"[NET] row {i}: {e}")
        logger.info(f"[NetworkParser] {len(events)} loaded ({skipped} skipped)")
        return events


class NMSEventParser(BaseParser):
    SOURCE_TYPE = "nms_event"

    def parse_file(self, filepath: str):
        events, skipped = [], 0
        with open(filepath, newline="", encoding="utf-8") as f:
            for i, row in enumerate(csv.DictReader(f, delimiter=self._delim(filepath))):
                row = {k.strip(): v.strip() for k, v in row.items() if k}
                try:
                    raw_msg = row.get("alert_msg", "")
                    try:
                        p = json.loads(raw_msg)
                        msg = "; ".join(p) if isinstance(p, list) else str(p)
                    except Exception:
                        msg = raw_msg
                    alarm_id = row.get("alarm_id") or row.get("alaram_id") or self._id(row, "NMS")
                    events.append(NormalizedEvent(
                        event_id=alarm_id, source_type=self.SOURCE_TYPE,
                        timestamp=self._ts(row.get("timestamp", "")),
                        device=row.get("device", "").lower().strip(),
                        resource_name=row.get("resource_name", "").lower().strip(),
                        resource_type=row.get("resource_type", ""),
                        event_type="NMS_ALARM", severity="ALARM",
                        message=msg, raw_fields=row,
                    ))
                except Exception as e:
                    skipped += 1; logger.debug(f"[NMS] row {i}: {e}")
        logger.info(f"[NMSParser] {len(events)} loaded ({skipped} skipped)")
        return events


class SyslogParser(BaseParser):
    SOURCE_TYPE = "syslog"

    def parse_file(self, filepath: str):
        events, skipped = [], 0
        with open(filepath, newline="", encoding="utf-8") as f:
            for i, row in enumerate(csv.DictReader(f, delimiter=self._delim(filepath))):
                row = {k.strip(): v.strip() for k, v in row.items() if k}
                try:
                    events.append(NormalizedEvent(
                        event_id=self._id(row, "SYS"), source_type=self.SOURCE_TYPE,
                        timestamp=self._ts(row.get("timestamp", "")),
                        device=row.get("device", "").lower().strip(),
                        resource_name=row.get("res_name", "").lower().strip(),
                        resource_type="SYSLOG", event_type="SYSLOG",
                        severity=row.get("severity", "").upper(),
                        message=row.get("message", ""), raw_fields=row,
                    ))
                except Exception as e:
                    skipped += 1; logger.debug(f"[SYS] row {i}: {e}")
        logger.info(f"[SyslogParser] {len(events)} loaded ({skipped} skipped)")
        return events


# ===========================================================================
# Semantic Engine  (with optional FAISS acceleration)
# ===========================================================================
class SemanticEngine:
    def __init__(self, model_name: str = EMBEDDING_MODEL):
        logger.info(f"[Semantic] Loading: {model_name}")
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)
        self._faiss_available = self._check_faiss()
        logger.info(f"[Semantic] Ready  |  FAISS: {'yes' if self._faiss_available else 'no (pip install faiss-cpu)'}")

    @staticmethod
    def _check_faiss() -> bool:
        try:
            import faiss
            return True
        except ImportError:
            return False

    def embed_all(self, texts: list) -> np.ndarray:
        return self.model.encode(
            texts, batch_size=128,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

    @staticmethod
    def cosine(a: np.ndarray, b: np.ndarray) -> float:
        return float(np.dot(a, b))

    def build_index(self, embeddings: np.ndarray):
        """Build FAISS index for fast ANN search. Falls back to numpy if unavailable."""
        if not self._faiss_available:
            return None
        import faiss
        dim   = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)   # inner product == cosine on L2-normalised vecs
        index.add(embeddings.astype(np.float32))
        return index

    def search_index(self, index, query: np.ndarray, k: int, threshold: float):
        """
        Return (indices, scores) of top-k neighbours above threshold.
        Falls back to numpy dot product if FAISS unavailable.
        """
        if index is not None:
            import faiss
            scores, idxs = index.search(
                query.reshape(1, -1).astype(np.float32), k
            )
            mask = scores[0] >= threshold
            return idxs[0][mask].tolist(), scores[0][mask].tolist()
        else:
            return [], []   # fallback handled by caller


# ===========================================================================
# Ollama LLM Client  (explanation only — never makes decisions)
# ===========================================================================
class OllamaClient:
    def __init__(self, base_url: str = OLLAMA_BASE_URL, model: str = OLLAMA_MODEL):
        self.base_url = base_url.rstrip("/")
        self.model    = model
        self._check()

    def _check(self):
        try:
            resp   = requests.get(f"{self.base_url}/api/tags", timeout=5)
            models = [m["name"] for m in resp.json().get("models", [])]
            if any(self.model in m for m in models):
                logger.info(f"[LLM] Connected — {self.model}")
            else:
                logger.warning(f"[LLM] Model '{self.model}' not found. Run: ollama pull {self.model}")
        except Exception as e:
            logger.warning(f"[LLM] Cannot reach Ollama: {e}")

    def generate(self, prompt: str, max_tokens: int = 250) -> str:
        try:
            resp = requests.post(
                f"{self.base_url}/api/generate",
                json={"model": self.model, "prompt": prompt, "stream": False,
                      "system": TELECOM_SYSTEM_PROMPT,
                      "options": {"num_predict": max_tokens, "temperature": 0.0}},
                timeout=120,
            )
            resp.raise_for_status()
            return resp.json().get("response", "").strip()
        except Exception as e:
            logger.error(f"[LLM] Error: {e}")
            return ""

    @staticmethod
    def parse_json(text: str) -> dict:
        try:
            s = text.find("{"); e = text.rfind("}") + 1
            if s >= 0 and e > s:
                return json.loads(text[s:e])
        except Exception:
            pass
        return {}


# ===========================================================================
# Stage 1+2: Identity Grouper
# Groups events by (device, resource_name, resource_type) + time window.
# This is the primary scoping gate — events outside same identity key
# NEVER compete for deduplication with each other.
# ===========================================================================
class IdentityGrouper:
    """
    Produces identity buckets:
      key = (device, resource_name, resource_type)
      Each bucket contains events sorted by timestamp.

    Within each bucket, events are further split into 30-min windows
    to limit comparison scope.
    """

    def __init__(self, window_min: int = TIME_WINDOW_MIN):
        self.window = timedelta(minutes=window_min)

    def group(self, events: list) -> dict:
        """
        Returns:
          {identity_key: [list of events sorted by timestamp]}
        """
        buckets: dict[str, list] = defaultdict(list)
        for e in events:
            buckets[e.identity_key()].append(e)
        for key in buckets:
            buckets[key].sort(key=lambda e: e.timestamp)
        logger.info(f"[IdentityGrouper] {len(events)} events -> "
                    f"{len(buckets)} identity groups")
        return buckets

    def time_windows(self, events: list) -> list:
        """
        Split a sorted event list into overlapping 30-min windows.
        Returns list of windows (each = list of events).
        """
        if not events:
            return []
        windows = []
        i = 0
        while i < len(events):
            anchor = events[i].timestamp
            window = [e for e in events[i:]
                      if (e.timestamp - anchor) <= self.window]
            if len(window) >= 2:
                windows.append(window)
            # Advance to first event outside this window
            next_i = i + 1
            while next_i < len(events) and \
                    (events[next_i].timestamp - anchor) <= self.window:
                next_i += 1
            i = next_i
        return windows


# ===========================================================================
# Stage 3+4: Semantic Clusterer
# Within each identity+time bucket, builds similarity graph
# and finds connected components (clusters).
# ===========================================================================
class SemanticClusterer:
    """
    For each identity+window bucket:
      - Embed all events (or reuse existing embeddings)
      - Build pairwise similarity graph (FAISS or numpy)
      - Find connected components above threshold
      - Each component = one dedup cluster

    This stage produces DETERMINISTIC clusters given fixed embeddings.
    No LLM involved.
    """

    def __init__(self, sem: SemanticEngine, threshold: float = DEDUP_THRESHOLD):
        self.sem       = sem
        self.threshold = threshold

    def cluster_bucket(self, events: list) -> list:
        """
        Returns list of clusters. Each cluster = list of NormalizedEvent.
        Single-event lists are not returned (no dedup needed).
        """
        if len(events) < 2:
            return []

        # Embed if not already done
        for e in events:
            if e.embedding is None:
                e.embedding = self.sem.embed_all([e.semantic_text()])[0]

        embs = np.array([e.embedding for e in events], dtype=np.float32)
        n    = len(events)

        # Build similarity graph: edge if cosine >= threshold
        adj: dict[int, set] = defaultdict(set)

        # Use FAISS if available, else numpy
        index = self.sem.build_index(embs)
        if index is not None:
            for i in range(n):
                neighbours, scores = self.sem.search_index(
                    index, embs[i], k=min(n, 20), threshold=self.threshold
                )
                for j, score in zip(neighbours, scores):
                    if i != j:
                        adj[i].add(j)
                        adj[j].add(i)
                        events[j].similarity_score = max(
                            events[j].similarity_score, float(score))
        else:
            # numpy fallback: O(n²) — fine for small buckets
            sim_matrix = embs @ embs.T
            for i in range(n):
                for j in range(i + 1, n):
                    if sim_matrix[i, j] >= self.threshold:
                        adj[i].add(j)
                        adj[j].add(i)
                        events[j].similarity_score = max(
                            events[j].similarity_score, float(sim_matrix[i, j]))

        # Find connected components
        visited    = set()
        components = []
        for start in range(n):
            if start in visited:
                continue
            component = []
            stack     = [start]
            while stack:
                node = stack.pop()
                if node in visited:
                    continue
                visited.add(node)
                component.append(node)
                stack.extend(adj[node] - visited)
            if len(component) >= 2:
                components.append([events[idx] for idx in component])

        return components


# ===========================================================================
# Stage 5: Dedup Decision (Deterministic)
# Given a cluster, picks master and marks duplicates.
# NO LLM — pure deterministic logic on structured fields.
# ===========================================================================
class DedupDecider:
    """
    Deterministic master selection within a cluster:

    Priority for master:
      1. NMS event (always authoritative if present)
      2. Highest severity event
      3. Earliest timestamp

    All other events in cluster = DUPLICATE of master.

    Confidence score = based on similarity + source diversity (no LLM).
    """

    SEVERITY_RANK = {
        "critical": 5, "major": 4, "alarm": 4,
        "minor": 3, "warning": 2,
        "informational": 1, "info": 1, "notice": 1,
    }

    def pick_master(self, cluster: list) -> NormalizedEvent:
        # Priority 1: NMS event
        nms_events = [e for e in cluster if e.source_type == SOURCE_NMS]
        if nms_events:
            # Among NMS events, pick highest severity then earliest
            return min(nms_events, key=lambda e: (
                -self.SEVERITY_RANK.get(e.severity.lower(), 1), e.timestamp
            ))
        # Priority 2: highest severity, then earliest
        return min(cluster, key=lambda e: (
            -self.SEVERITY_RANK.get(e.severity.lower(), 1), e.timestamp
        ))

    def compute_confidence(self, cluster: list, master: NormalizedEvent) -> float:
        """
        Deterministic confidence:
          base     = avg similarity score of cluster members
          +bonus   for NMS being master (more authoritative)
          +bonus   for multi-source agreement
        """
        scores       = [e.similarity_score for e in cluster if e.similarity_score > 0]
        avg_sim      = (sum(scores) / len(scores)) if scores else self.SEVERITY_RANK.get(
            master.severity.lower(), 1) / 5.0
        n_sources    = len({e.source_type for e in cluster})
        nms_bonus    = 8.0 if master.source_type == SOURCE_NMS else 0.0
        source_bonus = min(12.0, (n_sources - 1) * 6.0)
        return round(min(98.0, avg_sim * 78.0 + nms_bonus + source_bonus), 1)

    def apply(self, cluster: list) -> NormalizedEvent:
        """Mark duplicates in cluster. Returns the master event."""
        master     = self.pick_master(cluster)
        confidence = self.compute_confidence(cluster, master)
        for e in cluster:
            if e.event_id == master.event_id:
                continue
            e.label            = LABEL_DUPLICATE
            e.duplicate_of     = master.event_id
            e.dedup_confidence = confidence
            # Reason will be filled by LLM in Stage 7
            e.dedup_reason     = (
                f"Clustered with master {master.event_id} "
                f"(sim={e.similarity_score:.3f}, conf={confidence:.1f}%)"
            )
        return master


# ===========================================================================
# Stage 6: Correlation Graph
# Groups UNIQUE events across different resources on the same device.
# ===========================================================================
class CorrelationGrouper:
    """
    After dedup, groups remaining UNIQUE events on the same device that are
    semantically related (even across different interfaces/resources).
    These represent cascading faults or related conditions.

    Unlike dedup, correlation does NOT enforce resource_name identity —
    that's intentional: CPU high + interface down on same device CAN be correlated.

    Confidence = avg similarity + source diversity + time proximity.
    """

    def __init__(self, sem: SemanticEngine, threshold: float = CORR_THRESHOLD,
                 window_min: int = TIME_WINDOW_MIN):
        self.sem       = sem
        self.threshold = threshold
        self.window    = timedelta(minutes=window_min)
        self._ctr      = 0

    def run(self, events: list) -> list:
        unique = [e for e in events if e.label == LABEL_UNIQUE]
        logger.info(f"[Correlation] {len(unique)} unique events to correlate ...")

        by_device: dict[str, list] = defaultdict(list)
        for e in unique:
            by_device[e.device].append(e)

        groups = []
        for device, dev_events in by_device.items():
            dev_events.sort(key=lambda e: e.timestamp)
            device_groups = self._cluster_device(dev_events)
            groups.extend(device_groups)
            logger.info(f"[Correlation] {device}: {len(device_groups)} group(s)")

        logger.info(f"[Correlation] Total: {len(groups)} correlation group(s)")
        return groups

    def _cluster_device(self, events: list) -> list:
        """
        Single-linkage clustering within time window across all resources on device.
        Returns list of groups (each group = list of events with >= 2 members).
        """
        if len(events) < 2:
            return []

        embs    = np.array([e.embedding for e in events], dtype=np.float32)
        n       = len(events)
        visited = set()
        groups  = []

        for i, anchor in enumerate(events):
            if i in visited:
                continue
            group  = [i]
            scores = []
            visited.add(i)

            for j, cand in enumerate(events):
                if j == i or j in visited:
                    continue
                dt = abs((cand.timestamp - anchor.timestamp).total_seconds())
                if dt > self.window.total_seconds():
                    continue
                score = self.sem.cosine(embs[i], embs[j])
                if score >= self.threshold:
                    group.append(j)
                    scores.append(score)
                    visited.add(j)
                    cand.similarity_score = max(cand.similarity_score, score)

            if len(group) >= 2:
                groups.append(([events[idx] for idx in group], scores))

        return groups

    def label(self, groups: list) -> list:
        """Assign correlation group IDs. Returns list of group dicts for LLM."""
        result = []
        for group_events, scores in groups:
            self._ctr += 1
            grp_id = f"CORR-GRP-{self._ctr:04d}"

            avg_sim      = (sum(scores) / len(scores)) if scores else self.threshold
            n_sources    = len({e.source_type   for e in group_events})
            n_resources  = len({e.resource_name for e in group_events})
            source_bonus = min(12.0, (n_sources   - 1) * 6.0)
            res_bonus    = min(8.0,  (n_resources  - 1) * 4.0)
            confidence   = round(min(95.0, avg_sim * 75.0 + source_bonus + res_bonus), 1)

            for e in group_events:
                e.correlation_group = grp_id
                e.corr_confidence   = confidence
                if e.label == LABEL_UNIQUE:
                    e.label = LABEL_CORRELATED

            result.append({
                "group_id":   grp_id,
                "events":     group_events,
                "confidence": confidence,
            })
        return result


# ===========================================================================
# Stage 7: LLM Explainer  (explanation only — decisions already made)
# ===========================================================================
class LLMExplainer:
    """
    Called AFTER all dedup and correlation decisions are made deterministically.
    Sole job: write human-readable reasons + confirm/adjust confidence scores.

    LLM call budget:
      1 call per dedup cluster  (master + its duplicates)
      1 call per correlation group
    """

    def __init__(self, llm: OllamaClient):
        self.llm = llm

    # ------------------------------------------------------------------
    def explain_dedup_clusters(self, events: list):
        """One LLM call per duplicate cluster."""
        id_map   = {e.event_id: e for e in events}
        clusters: dict[str, list] = defaultdict(list)
        for e in events:
            if e.label == LABEL_DUPLICATE and e.duplicate_of in id_map:
                clusters[e.duplicate_of].append(e)

        total = len(clusters)
        for idx, (master_id, dups) in enumerate(clusters.items(), 1):
            master    = id_map[master_id]
            cluster   = [master] + dups
            sources   = sorted({e.source_type for e in cluster})
            evidence  = [e.event_id for e in cluster]
            src_str   = "|".join(sources)
            evid_str  = "|".join(evidence)

            logger.info(f"[LLM-Dedup] {idx}/{total}: master={master_id} "
                        f"| sources={sources} | {len(dups)} dup(s) ...")
            prompt = self._dedup_prompt(master, dups, sources)
            raw    = self.llm.generate(prompt, max_tokens=300)
            result = self.llm.parse_json(raw)

            reason      = result.get("reason", "").strip()
            conf        = float(result.get("confidence_pct", 0) or 0)
            llm_sources = result.get("sources", sources)
            llm_evids   = result.get("evidence_events", evidence)

            if not reason:
                src_human = ", ".join(sources)
                reason = (
                    f"Interface {master.resource_name} fault on {master.device} "
                    f"detected by {src_human} within the same time window. "
                    f"Master event: {master.source_type} ({master.severity})."
                )

            final_src  = "|".join(sorted(set(llm_sources))) if llm_sources else src_str
            final_evid = "|".join(llm_evids) if llm_evids else evid_str

            for d in dups:
                d.dedup_reason     = reason
                d.dedup_confidence = conf if 0 < conf <= 100 else d.dedup_confidence
                d.dedup_sources    = final_src
                d.dedup_evidence   = final_evid

    # ------------------------------------------------------------------
    def explain_corr_groups(self, groups: list):
        """One LLM call per correlation group."""
        total = len(groups)
        for idx, grp in enumerate(groups, 1):
            grp_id   = grp["group_id"]
            members  = grp["events"]
            sources  = sorted({e.source_type   for e in members})
            evidence = [e.event_id for e in members]
            src_str  = "|".join(sources)
            evid_str = "|".join(evidence)

            logger.info(f"[LLM-Corr] {idx}/{total}: {grp_id} "
                        f"| sources={sources} | {len(members)} events ...")
            prompt = self._corr_prompt(members, sources)
            raw    = self.llm.generate(prompt, max_tokens=300)
            result = self.llm.parse_json(raw)

            reason      = result.get("correlation_explanation", "").strip()
            conf        = float(result.get("confidence_pct", 0) or 0)
            llm_sources = result.get("sources", sources)
            llm_evids   = result.get("evidence_events", evidence)

            if not reason:
                srcs   = ", ".join(sources)
                ifaces = ", ".join(sorted({e.resource_name for e in members}))
                reason = (f"Correlated events on {members[0].device} "
                          f"across interfaces [{ifaces}] detected by {srcs}.")

            final_src  = "|".join(sorted(set(llm_sources))) if llm_sources else src_str
            final_evid = "|".join(llm_evids) if llm_evids else evid_str

            for e in members:
                e.corr_reason     = reason
                e.corr_confidence = conf if 0 < conf <= 100 else grp["confidence"]
                e.corr_sources    = final_src
                e.corr_evidence   = final_evid

    # ------------------------------------------------------------------
    @staticmethod
    def _dedup_prompt(master: NormalizedEvent, dups: list, sources: list) -> str:
        cluster   = [master] + dups
        evidence  = [e.event_id for e in cluster]
        dup_lines = "\n".join(
            f"  [{i+1}] event_id={d.event_id} | source={d.source_type} "
            f"| type={d.event_type} | sev={d.severity} "
            f"| sim={d.similarity_score:.3f} | {d.message[:110]}"
            for i, d in enumerate(dups)
        )
        src_reliability = {
            "nms_event":      "authoritative (NMS alarm)",
            "network_event":  "reliable (device telemetry)",
            "syslog":         "informational (syslog)",
        }
        src_notes = " | ".join(
            f"{s}: {src_reliability.get(s, 'monitoring')}" for s in sources
        )
        return f"""These telecom network events were identified as duplicates by semantic clustering.

MASTER EVENT (authoritative — highest priority source):
  event_id  : {master.event_id}
  source    : {master.source_type}
  device    : {master.device}
  interface : {master.resource_name} ({master.resource_type})
  event     : {master.event_type} | {master.severity}
  message   : {master.message}

DUPLICATE EVENTS ({len(dups)}):
{dup_lines}

SOURCES INVOLVED IN THIS CLUSTER:
  {src_notes}
  Cross-source count: {len(sources)} monitoring system(s) detected this fault.

Write a clear 1-2 sentence reason explaining WHY these events are duplicates.
Your reason MUST explicitly name the sources that detected the fault
(e.g. "detected by NMS alarm, syslog, and network telemetry").
Mention the device name, interface, and fault type.

Confidence guide:
  95-100 : Same alarm_id OR same source+event_type repeat
  85-94  : Fault confirmed by NMS + at least one other source
  70-84  : Cross-source agreement, high semantic similarity
  50-69  : Single source or moderate similarity

Respond ONLY with valid JSON:
{{
  "reason": "The link failure on <device>/<interface> was detected by <sources> within the same time window...",
  "sources": {json.dumps(sources)},
  "evidence_events": {json.dumps(evidence)},
  "confidence_pct": <0-100>
}}"""

    # ------------------------------------------------------------------
    @staticmethod
    def _corr_prompt(members: list, sources: list) -> str:
        lines     = "\n".join(
            f"  [{i+1}] event_id={e.event_id} | src={e.source_type} "
            f"| {e.timestamp.strftime('%H:%M:%S')} "
            f"| iface={e.resource_name} | {e.event_type} | {e.severity} | {e.message[:100]}"
            for i, e in enumerate(members)
        )
        device    = members[0].device
        ifaces    = sorted({e.resource_name for e in members})
        evidence  = [e.event_id for e in members]
        time_span = int((members[-1].timestamp - members[0].timestamp).total_seconds() / 60)
        src_reliability = {
            "nms_event":     "authoritative (NMS alarm)",
            "network_event": "reliable (device telemetry)",
            "syslog":        "informational (syslog)",
        }
        src_notes = " | ".join(
            f"{s}: {src_reliability.get(s, 'monitoring')}" for s in sources
        )
        return f"""These telecom network events were grouped as correlated by semantic clustering.

Device          : {device}
Interfaces      : {", ".join(ifaces)}
Time span       : {time_span} minute(s)
Sources present : {", ".join(sources)}
Source details  : {src_notes}

EVENTS:
{lines}

Based on your telecom NOC expertise:
1. Explain in 1-2 sentences what common fault or network condition links these events.
   Your explanation MUST explicitly name which monitoring sources detected the fault
   (e.g. "confirmed by NMS alarm, network telemetry, and syslog").
   Mention device, interface(s), fault type, and time window.
2. Assign a confidence score (0-100).

Confidence guide:
  90-100 : Clear causal chain confirmed by multiple authoritative sources
  75-89  : Strong evidence from 2+ sources on same device
  55-74  : Possibly related, single source or indirect evidence
  below 55: Weak correlation

Respond ONLY with valid JSON:
{{
  "correlation_explanation": "The fault on <device> was detected by <sources>...",
  "sources": {json.dumps(sources)},
  "evidence_events": {json.dumps(evidence)},
  "confidence_pct": <0-100>
}}"""


# ===========================================================================
# Report Writer
# ===========================================================================
class ReportWriter:
    COLS = [
        "event_id", "source_type", "timestamp", "device",
        "resource_name", "resource_type", "event_type", "severity", "message",
        "label",
        # Dedup
        "duplicate_of",
        "dedup_sources",
        "dedup_evidence",
        "dedup_reason",
        "dedup_confidence",
        # Correlation
        "correlation_group",
        "corr_sources",
        "corr_evidence",
        "corr_reason",
        "corr_confidence",
        # Diagnostic
        "similarity_score",
    ]

    def write_csv(self, events: list, path: str):
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=self.COLS)
            w.writeheader()
            for e in events:
                w.writerow(e.to_output_dict())
        logger.info(f"[Report] -> {path} ({len(events)} rows)")

    def print_summary(self, events: list):
        total = len(events)
        uniq  = sum(1 for e in events if e.label == LABEL_UNIQUE)
        dups  = sum(1 for e in events if e.label == LABEL_DUPLICATE)
        corr  = sum(1 for e in events if e.label == LABEL_CORRELATED)
        grps  = len({e.correlation_group for e in events if e.correlation_group})

        print("\n" + "=" * 68)
        print("  TELECOM EVENT PIPELINE  v6.0  (Deterministic + Semantic + LLM)")
        print("=" * 68)
        print(f"  Total      : {total}")
        print(f"  UNIQUE     : {uniq}")
        print(f"  DUPLICATE  : {dups}  (labelled, not deleted)")
        print(f"  CORRELATED : {corr}")
        print(f"  Corr groups: {grps}")

        if dups:
            print(f"\n  DUPLICATES (first 10):")
            shown = 0
            for e in events:
                if e.label != LABEL_DUPLICATE: continue
                print(f"\n    {e.event_id}")
                print(f"      Source / Device  : {e.source_type} | {e.device}/{e.resource_name}")
                print(f"      Duplicate of     : {e.duplicate_of}")
                print(f"      Confidence       : {e.dedup_confidence:.1f}%  "
                      f"Similarity: {e.similarity_score:.4f}")
                print(f"      Sources involved : {e.dedup_sources.replace('|', ' + ')}")
                print(f"      Evidence IDs     : {e.dedup_evidence[:120]}")
                print(f"      Reason           : {e.dedup_reason[:130]}")
                shown += 1
                if shown >= 10: break

        if grps:
            print(f"\n  CORRELATION GROUPS:")
            seen = set()
            for e in sorted(events, key=lambda x: x.correlation_group):
                if not e.correlation_group or e.correlation_group in seen: continue
                seen.add(e.correlation_group)
                members = [x for x in events if x.correlation_group == e.correlation_group]
                print(f"\n  {e.correlation_group}  "
                      f"({len(members)} events | {e.device} | conf={e.corr_confidence:.1f}%)")
                print(f"    Sources  : {e.corr_sources.replace('|', ' + ')}")
                print(f"    Evidence : {e.corr_evidence[:120]}")
                print(f"    Reason   : {e.corr_reason[:150]}")
                for m in members[:5]:
                    print(f"    [{m.label:<11}] [{m.source_type:<14}] "
                          f"[{m.resource_name:<12}] {m.event_type:<20} {m.message[:45]}")
                if len(members) > 5:
                    print(f"    ... and {len(members)-5} more")
        print("=" * 68 + "\n")


# ===========================================================================
# Full Pipeline Orchestrator
# ===========================================================================
class EventCorrelationPipeline:
    PARSERS = {
        "network": NetworkEventParser,
        "nms":     NMSEventParser,
        "syslog":  SyslogParser,
    }

    def __init__(self):
        self.sem      = SemanticEngine(EMBEDDING_MODEL)
        self.llm      = OllamaClient(OLLAMA_BASE_URL, OLLAMA_MODEL)
        self.reporter = ReportWriter()

    def load(self, source_files: dict) -> list:
        all_events = []
        for src, path in source_files.items():
            if not path: continue
            if not Path(path).exists():
                logger.error(f"File not found: {path}"); continue
            cls = self.PARSERS.get(src.lower())
            if not cls:
                logger.error(f"Unknown source '{src}'"); continue
            all_events.extend(cls().parse_file(path))
        logger.info(f"[Pipeline] Loaded: {len(all_events)} events")
        return all_events

    def run(self, source_files: dict, output_path: str = "enriched_events.csv"):
        import time
        t0 = time.time()
        logger.info("[Pipeline] Starting v6.0 ...")

        # Load
        events = self.load(source_files)
        if not events:
            logger.error("[Pipeline] No events loaded.")
            return

        # Batch embed all events once
        logger.info(f"[Pipeline] Embedding {len(events)} events ...")
        texts = [e.semantic_text() for e in events]
        embs  = self.sem.embed_all(texts)
        for i, e in enumerate(events):
            e.embedding = embs[i]

        # Stage 1+2: Identity grouping
        grouper  = IdentityGrouper(TIME_WINDOW_MIN)
        identity_buckets = grouper.group(events)

        # Stage 3+4: Semantic clustering per identity bucket
        clusterer   = SemanticClusterer(self.sem, DEDUP_THRESHOLD)
        all_clusters = []
        for key, bucket_events in identity_buckets.items():
            windows = grouper.time_windows(bucket_events)
            for window in windows:
                clusters = clusterer.cluster_bucket(window)
                all_clusters.extend(clusters)

        logger.info(f"[Pipeline] {len(all_clusters)} dedup cluster(s) found")

        # Stage 5: Deterministic dedup decisions
        decider = DedupDecider()
        for cluster in all_clusters:
            decider.apply(cluster)

        dups   = sum(1 for e in events if e.label == LABEL_DUPLICATE)
        unique = sum(1 for e in events if e.label == LABEL_UNIQUE)
        logger.info(f"[Pipeline] After dedup: {unique} UNIQUE | {dups} DUPLICATE")

        # Stage 6: Correlation grouping
        corr_grouper = CorrelationGrouper(self.sem, CORR_THRESHOLD, TIME_WINDOW_MIN)
        corr_groups  = corr_grouper.run(events)
        labelled     = corr_grouper.label(corr_groups)
        logger.info(f"[Pipeline] {len(labelled)} correlation group(s)")

        # Stage 7: LLM explanation (decisions already final — LLM only writes reasons)
        explainer = LLMExplainer(self.llm)
        if dups:
            logger.info("[Pipeline] LLM: writing dedup explanations ...")
            explainer.explain_dedup_clusters(events)
        if labelled:
            logger.info("[Pipeline] LLM: writing correlation explanations ...")
            explainer.explain_corr_groups(labelled)

        # Output
        self.reporter.write_csv(events, output_path)
        self.reporter.print_summary(events)
        logger.info(f"[Pipeline] Done in {time.time()-t0:.1f}s -> {output_path}")
        return events


# ===========================================================================
# CLI
# ===========================================================================
def main():
    global OLLAMA_MODEL, OLLAMA_BASE_URL, DEDUP_THRESHOLD, CORR_THRESHOLD, TIME_WINDOW_MIN

    p = argparse.ArgumentParser(
        description="Telecom Event Pipeline v6.0 — Deterministic + Semantic + LLM",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Pipeline stages:
  1  Identity grouping     (device + resource_name + resource_type)
  2  Time window buckets   (30-min sliding windows)
  3  FAISS semantic search (within identity+time buckets)
  4  Cluster formation     (connected components)
  5  Dedup decision        (deterministic: NMS > severity > timestamp)
  6  Correlation graph     (cross-resource, same device)
  7  LLM explanation       (reason + confidence, never makes decisions)

Example:
  python telecom_event_correlator.py --network data/network_events.csv --nms data/nms_events.csv --syslog data/syslogs.csv --output data/enriched_events.csv
        """
    )
    p.add_argument("--network",         help="Network events CSV/TSV")
    p.add_argument("--nms",             help="NMS alarm events CSV/TSV")
    p.add_argument("--syslog",          help="Syslog events CSV/TSV")
    p.add_argument("--output",          default="enriched_events.csv")
    p.add_argument("--model",           default=OLLAMA_MODEL)
    p.add_argument("--ollama-url",      default=OLLAMA_BASE_URL)
    p.add_argument("--dedup-threshold", type=float, default=DEDUP_THRESHOLD,
                   help=f"Semantic similarity threshold for dedup clustering (default: {DEDUP_THRESHOLD})")
    p.add_argument("--corr-threshold",  type=float, default=CORR_THRESHOLD,
                   help=f"Semantic threshold for correlation grouping (default: {CORR_THRESHOLD})")
    p.add_argument("--time-window",     type=int,   default=TIME_WINDOW_MIN,
                   help=f"Time window in minutes (default: {TIME_WINDOW_MIN})")
    args = p.parse_args()

    if not any([args.network, args.nms, args.syslog]):
        p.print_help()
        sys.exit(1)

    OLLAMA_MODEL    = args.model
    OLLAMA_BASE_URL = args.ollama_url
    DEDUP_THRESHOLD = args.dedup_threshold
    CORR_THRESHOLD  = args.corr_threshold
    TIME_WINDOW_MIN = args.time_window

    source_files = {k: v for k, v in
                    {"network": args.network, "nms": args.nms,
                     "syslog": args.syslog}.items() if v}

    EventCorrelationPipeline().run(source_files, args.output)


if __name__ == "__main__":
    main()