# Event Analytics: Master AIOps Technical Manual

## 1. System Overview & Architecture
The Event Analytics platform is a high-performance AIOps solution for modern infrastructure observability. It leverages **React 18** and **TypeScript** for a scalable, feature-driven frontend, and integrates with advanced AI/ML engines for automated diagnosis.

### 1.1 Technical Stack
- **Framework**: React 18+ (Vite-powered)
- **State Management**: TanStack Query (Async Server State), localStorage persistence for training configurations.
- **Data Visualizations**: Recharts and Chart.js for real-time telemetry and analytical reporting.
- **Design System**: Tailwind CSS (Styling), Radix UI (Accessible Primitives), Framer Motion (Animations).

---

## 2. Navigation & Module Mapping (`LeftSidebar.tsx`)
The platform is organized into four primary operational layers, orchestrated by a stateful navigation system.

### 2.1 The Intelligence Layer (Dashboards)
- **AIOps Dashboard (`/`)**: Main situational awareness hub (Root Cause, SLA Risk, Capacity).
- **Topology Dashboard (`/dashboard/prediction`)**: Visualizes logical dependency chains.
- **ROI/KPI Dashboard (`/dashboard/kpi`)**: Tracks economic and operational efficiency metrics.

### 2.2 The Operational Layer (Events)
- **Events View (`/events`)**: High-velocity real-time list with advanced filtering.
- **Event Processing**: Dedicated labs for **Deduplication**, **Suppression**, and **Bulk Processing**.

### 2.3 The Optimization Layer (Admin)
- **Configuration (`/admin`)**: System-wide settings and general platform configuration.
- **Correlation Patterns (`/correlation`)**: Human-in-the-loop rule definition and behavior pattern management.
- **AI Training & Results**: Workflow for configuring, training, and analyzing ML models.

### 2.4 The Innovation Layer (Playground)
- **RCA Playground**: Simulated environment for validating the 7-step analysis pipeline.
- **Advanced Processing**: Discovery and testing for sub-second noise reduction.

---

## 3. The 7-Step RCA Pipeline Logic
Root Cause Analysis is executed as a structured sequence of intelligence steps:
1.  **Orchestration**: Direct ingestion of NMS trigger events, enriched with real-time telemetry (CPU, Memory, Errors).
2.  **Intent Router**: Uses a Pattern Matching library to classify events into categories (Performance, Thermal, Security).
3.  **Hypothesis Scorer**: Evaluates a library of probabilistic hypotheses, weighted by Signal Scores (numeric) and Log Scores (textual).
4.  **Situation Builder**: Assembles a human-readable situational context card for LLM processing.
5.  **Planner LLM**: Generates a custom investigation plan (SNMP, Logs, Config Checks) to validate hypothesis.
6.  **Data Correlator**: Semantic similarity matching using vector embeddings against the Knowledge Base (KB).
7.  **RCA Engine**: Final consolidated output with **Root Cause**, **Confidence Score**, and **Remediation** steps.

---

## 4. AI/ML Algorithmic Engine Details
The platform's predictive core uses an ensemble of statistical and ensemble models:
- **Statistical Analytics**:
  - **Cross Correlation**: Measures temporal lags between metrics (e.g., CRC errors lagging behind Buffer growth).
  - **Granger Causality**: Determines directional influence (statistical "causality") between telemetry feeds.
- **Predictive Models**:
  - **Random Forest Predictors**: High-precision models (exported as `.pkl` artifacts) for specific failure types (e.g., `rf_router_PACKET_DROP.pkl`).
  - **Neural Failure Chains**: Maps the "Drift to Failure" sequence (e.g., `CPU Rise -> CRC Burst -> Buffer Full -> SLA Breach`).
- **Pattern Match Intelligence**:
  - Uses confidence-jump logic to track a starting event through a multi-step sequence until a failure is predicted before it occurs.

---

## 5. Noise Reduction & Intelligence Primitives
### 5.1 Deduplication Logic
- **Exact & Structured**: Bit-level SHA256 and field-level `{Device, IF, Code}` signatures.
- **Similarity & Semantic**: Fuzzy textual matching (TF-IDF + Cosine) and context-aware LLM embeddings.
- **State Transition**: Suppressing alerts if the physical operational state hasn't changed.

### 5.2 Suppression Logic
- **Topology Dependency**: Automatically suppressing downstream "symptom" events if the physical root (Parent) is failing.
- **Flap Detection**: Monitoring oscillation frequency for interface state changes.
- **Dynamic Thresholding**: Using learned **p95 baselines** to suppress noise that falls within normal behavioral ranges.

---

## 6. Knowledge Base (KB) & Remediation
The system maintains a living repository of historical RCA cases.
- **Case Retrieval**: When a situation is identified, the system performs a similarity search against the KB.
- **Remediation Feedback**: Successful fix strategies from the KB are directly suggested in the final RCA output, closing the automated loop.

---
*Manual Version: 1.0.0 | Generated for AIOps Operations Team*
