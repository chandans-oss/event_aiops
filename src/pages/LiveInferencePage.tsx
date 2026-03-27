import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  Activity,
  Zap,
  Shield,
  Clock,
  Cpu,
  Database,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Network,
  Layers,
  Search,
  CheckCircle2,
  Box,
  Binary,
  Microscope,
  Cpu as CpuIcon,
  Info,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

// --- MOCK DATA & CONSTANTS ---

const MODELS = [
  { name: 'iso_router.pkl', type: 'Anomaly' },
  { name: 'iso_switch.pkl', type: 'Anomaly' },
  { name: 'kmeans_router.pkl', type: 'Pattern' },
  { name: 'kmeans_switch.pkl', type: 'Pattern' },
  { name: 'rf_router_HIGH_LATENCY.pkl', type: 'RF' },
  { name: 'rf_router_HIGH_UTIL_WARNING.pkl', type: 'RF' },
  { name: 'rf_router_INTERFACE_FLAP.pkl', type: 'RF' },
  { name: 'rf_router_PACKET_DROP.pkl', type: 'RF' },
  { name: 'rf_switch_HIGH_UTIL_WARNING.pkl', type: 'RF' },
  { name: 'rf_switch_INTERFACE_FLAP.pkl', type: 'RF' },
  { name: 'rf_switch_PACKET_DROP.pkl', type: 'RF' },
  { name: 'scaler_router.pkl', type: 'Scaler' },
  { name: 'scaler_switch.pkl', type: 'Scaler' },
];

const ROUTER_CHAINS = [
  { id: 'R-Chain-1', label: 'HighLatency', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
  { id: 'R-Chain-2', label: 'HighUtilWarning', sequence: ['cpu_pct', 'crc_errors', 'latency_ms', 'queue_depth', 'util_pct'] },
  { id: 'R-Chain-3', label: 'InterfaceFlap', sequence: ['cpu_pct', 'util_pct', 'crc_errors', 'queue_depth', 'latency_ms'] },
  { id: 'R-Chain-4', label: 'PacketDrop', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
];

const SWITCH_CHAINS = [
  { id: 'S-Chain-1', label: 'DeviceReboot', sequence: ['queue_depth', 'crc_errors', 'latency_ms', 'util_pct', 'cpu_pct'] },
  { id: 'S-Chain-2', label: 'HighUtilWarning', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta', 'util_pct'] },
  { id: 'S-Chain-3', label: 'InterfaceFlap', sequence: ['cpu_pct', 'util_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta'] },
  { id: 'S-Chain-4', label: 'PacketDrop', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta', 'util_pct'] },
];

const EVENT_SEQUENCES = [
  "HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP",
  "HIGH_UTIL_WARNING -> PACKET_DROP -> HIGH_LATENCY",
  "HIGH_UTIL_WARNING -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP"
];

const CHAIN_TEMPLATES: Record<string, { label: string, meta: string, steps: any[] }> = {
  'HighLatencyValidated': {
    label: 'HighLatency',
    meta: '(seen 289x | confidence: 0.72)',
    steps: [
      { label: 'CpuSpike', subLabel: 'R1:router', description: 'Root cause: Router CPU rising above 0.01%/min' },
      { label: 'CrcErrors', subLabel: 'SW1:access', description: 'Sequence check: CRC errors jump 10min later' },
      { label: 'BufferUtil', subLabel: 'SW2:dist', description: 'Cascade: Distribution buffer filling' },
      { label: 'LatencyRise', subLabel: 'FW1:firewall', description: 'Result: Edge latency breach' }
    ]
  },
  'DeviceReboot': {
    label: 'DeviceReboot',
    meta: '(seen 2x | 6 pre-event windows)',
    steps: [
      { label: 'QueueDepthFall', subLabel: 'metric poll', description: 'Significant reduction in processing queue depth' },
      { label: 'CrcErrorsCleared', subLabel: 'metric poll', description: 'Zero-state CRC stability reached' },
      { label: 'LatencyDrop', subLabel: 'metric poll', description: 'Minimum baseline latency reached' },
      { label: 'UtilBaseline', subLabel: 'metric poll', description: 'Traffic through interface stopped' },
      { label: 'CpuIdle', subLabel: 'metric poll', description: 'Control plane processing at minimum' },
      { label: 'RebootTrap', subLabel: 'SNMP TRAP', description: 'Warm reboot signal detected in stream' }
    ]
  },
  'HighUtilWarning': {
    label: 'HighUtilWarning',
    meta: '(observed in 532 sessions)',
    steps: [
      { label: 'CpuPctRise', subLabel: '3m lag', description: 'Initial CPU load increase detected' },
      { label: 'CrcErrorsRise', subLabel: '4m lag', description: 'Link layer retransmissions peaking' },
      { label: 'LatencyMsRise', subLabel: '6m lag', description: 'Application response delay confirmed' },
      { label: 'QueueDepthRise', subLabel: '2m lag', description: 'Hardware buffer pressure building' },
      { label: 'UtilPctRise', subLabel: '1m lag', description: 'Link capacity threshold breach' }
    ]
  },
  'InterfaceFlap': {
    label: 'InterfaceFlap',
    meta: '(observed in 146 sessions)',
    steps: [
      { label: 'LinkUtilRise', subLabel: 'root cause', description: 'Burst traffic on physical link' },
      { label: 'BufferUtilRise', subLabel: 'sequence 02', description: 'Queue occupancy rise' },
      { label: 'CrcErrorsRise', subLabel: 'sequence 03', description: 'Incremental CRC error count' },
      { label: 'PacketLossRise', subLabel: 'sequence 04', description: 'Inbound packet discard detected' },
      { label: 'FlapEvent', subLabel: 'impact', description: 'Oscillation imminent - link down/up' }
    ]
  },
  'PacketDrop': {
    label: 'PacketDrop',
    meta: '(observed in 493 sessions)',
    steps: [
      { label: 'CpuPctRise', subLabel: '4m lag', description: 'Processing pressure detected' },
      { label: 'CrcErrorsRise', subLabel: '2m lag', description: 'Checksum failure increase' },
      { label: 'QueueDepthRise', subLabel: '1m lag', description: 'Tail-drop threshold likely' },
      { label: 'LatencyMsRise', subLabel: '5m lag', description: 'Sequential delay drift' },
      { label: 'UtilPctRise', subLabel: '3m lag', description: 'Active packet discard impact' }
    ]
  }
};

const CONFIDENCE_JUMPS = [0.32, 0.55, 0.74, 0.89, 1.0, 1.0];
const GAP_PENALTY = 0.12;

const DEVICES = [
  { n: "router-01", i: "Gi0/1/0", t: 'ROUTER', p: 'NXS', ip: '10.10.1.2', m: 'Nexus 9336C' },
  { n: "router-02", i: "Gi0/3/0", t: 'ROUTER', p: 'ARI', ip: '10.20.3.5', m: '7050CX3-32S' },
  { n: "router-03", i: "Gi0/1/0", t: 'ROUTER', p: 'ISR', ip: '172.16.0.1', m: '4451-X' },
  { n: "switch-01", i: "Eth1/1", t: 'SWITCH', p: 'JNX', ip: '10.20.2.1', m: 'MX204' },
  { n: "switch-02", i: "Eth1/2", t: 'SWITCH', p: 'CSW', ip: '10.10.1.1', m: 'Catalyst 9300' },
  { n: "firewall-01", i: "Eth1/1", t: 'FIREWALL', p: 'FW1', ip: '10.50.1.5', m: 'Firepower 4110' },
];

interface PatternStep {
  status: 'arrived' | 'gap' | 'pending';
  timestamp?: string;
  confValue?: number;
}

interface PatternMatchItem {
  id: string;
  device: string;
  deviceType: string;
  prefix: string;
  ip: string;
  model: string;
  interface: string;
  timestamp: string;
  currentStep: number;
  confidence: number;
  templateId: string;
  steps: PatternStep[];
}

interface InferenceItem {
  id: string;
  timestamp: string;
  device: string;
  interface: string;
  type: 'PREDICTION' | 'ANOMALY' | 'PROGRESSIVE';
  event: string;
  confidence: number;
  pattern?: string;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ANALYZED' | 'WATCH';
  estimatedWait?: string;
  predictedTime?: string;
}

const PROGRESSIVE_TIMELINE = [
  {
    poll: 'T-60min',
    clock: '21:50',
    status: 'WATCH',
    statusMsg: 'NEW: Step 2 just confirmed',
    matchedSteps: 2,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.36,
    summary: "2 of 4 steps matched — WATCH issued",
    description: "R1's CPU has been climbing fast for the past 75 minutes (slope=0.269%/min). SW1's CRC errors have also exploded (delta=179.9) at exactly the expected 10-minute lag. Steps 3 and 4 metrics are actually rising too, but the lag timing windows are not yet open. The system recognises this as a real chain beginning. First WATCH alert issued. The operator should note the R1 CPU spike and begin monitoring.",
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.2692, threshold: 0.01, last: 53.93, range: [20, 90], status: 'matched', formula: 'slope=0.269 ≥ 0.01 ✓ | last=53.9% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 179.9100, threshold: 2.0, last: 181.81, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=179.9 ≥ 2.0 ✓ | last=181.8 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.2266, threshold: 0.03, last: 33.02, range: [10, 98], status: 'pending', lagInfo: 'lag NOT met: elapsed=10min, expected=20±3min — 10min short' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 0.1803, threshold: 0.05, last: 34.34, range: [5, 500], status: 'pending', lagInfo: 'lag NOT met: elapsed=20min, expected=30±3min — 10min short' },
    ]
  },
  {
    poll: 'T-50min',
    clock: '22:00',
    status: 'WATCH',
    statusMsg: 'WATCH maintained',
    matchedSteps: 2,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.36,
    summary: "2 of 4 steps — WATCH maintained, cascade intensifying",
    description: "CRC errors at SW1 have grown further to 231.9. R1's CPU continues climbing (now at 62%). SW2's buffer and FW1's latency are both rising (slopes 0.244 and 0.447 respectively) but the lag windows are not yet open. Score stable at 0.36 — same 2 steps confirmed. The cascade is deepening but the pattern engine correctly waits for timing alignment.",
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.3807, threshold: 0.01, last: 62.09, range: [20, 90], status: 'matched', formula: 'slope=0.381 ≥ 0.01 ✓ | last=62.1% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 231.5700, threshold: 2.0, last: 231.9, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=231.6 ≥ 2.0 ✓ | last=231.9 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.2438, threshold: 0.03, last: 41.54, range: [10, 98], status: 'pending', lagInfo: 'lag NOT met: elapsed=10min — waiting for 20min mark' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 0.4471, threshold: 0.05, last: 56.03, range: [5, 500], status: 'pending', lagInfo: 'lag NOT met: elapsed=20min — waiting for 30min mark' },
    ]
  },
  {
    poll: 'T-30min',
    clock: '22:20',
    status: 'WARN',
    statusMsg: 'NEW: Step 3 just confirmed',
    matchedSteps: 3,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.54,
    summary: "3 of 4 steps — WARN! SW2 buffer confirmed at 20-min lag",
    description: "SW2's buffer utilisation is now at 59.55%, rising at 0.448%/min, and exactly 20 minutes have elapsed since Step 1 started (within the ±3min tolerance). Step 3 confirmed. Score jumps to 0.54. WARN issued. Only FW1's latency lag window remains closed. The operator should now page on-call: HIGH_LATENCY expected in ~30 minutes.",
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.5796, threshold: 0.01, last: 71.64, range: [20, 90], status: 'matched', formula: 'slope=0.580 ≥ 0.01 ✓ | last=71.6% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 291.2100, threshold: 2.0, last: 292.39, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=291.2 ≥ 2.0 ✓ | last=292.4 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.4477, threshold: 0.03, last: 59.55, range: [10, 98], status: 'matched', lag: '20min', formula: 'slope=0.448 ≥ 0.03 ✓ | last=59.6% ∈ [10,98] ✓ | lag=20min ✓' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 1.4015, threshold: 0.05, last: 114.2, range: [5, 500], status: 'pending', lagInfo: 'lag NOT met: elapsed=20min, expected=30±3min — 10min short' },
    ]
  },
  {
    poll: 'T-20min',
    clock: '22:30',
    status: 'WARN',
    statusMsg: 'WARN maintained, FW1 latency almost there',
    matchedSteps: 3,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.54,
    summary: "3 of 4 steps — WARN maintained, FW1 latency almost there",
    description: "FW1's latency slope is now 1.930ms/min — an enormous rate of rise. The absolute value is 144ms. Every condition for Step 4 is met except the lag: elapsed time since Step 1 is 25 minutes but the window opens at 30 ± 3min. Just 2 minutes away from the confirmation window. Cascade is fully visible and unstoppable at this point.",
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.5155, threshold: 0.01, last: 71.48, range: [20, 90], status: 'matched', formula: 'slope=0.516 ≥ 0.01 ✓ | last=71.5% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 265.7600, threshold: 2.0, last: 308.04, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=265.8 ≥ 2.0 ✓ | last=308.0 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.5840, threshold: 0.03, last: 64.0, range: [10, 98], status: 'matched', lag: '20min', formula: 'slope=0.584 ≥ 0.03 ✓ | last=64.0% ∈ [10,98] ✓ | lag=20min ✓' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 1.9298, threshold: 0.05, last: 144.23, range: [5, 500], status: 'pending', lagInfo: 'lag NOT met: elapsed=25min, expected=30±3min — 2min short!' },
    ]
  },
  {
    poll: 'T-10min',
    clock: '22:40',
    status: 'CRITICAL',
    statusMsg: 'NEW: Step 4 just confirmed',
    matchedSteps: 4,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.72,
    summary: "ALL 4 steps confirmed — CRITICAL alert! 10 minutes before failure",
    description: "FW1's latency slope is 2.389ms/min (latency at 174ms and rising). All four conditions are met including the lag: exactly 30 minutes have elapsed since Step 1 (within ±3min tolerance). Score = 0.72 ≥ 0.70 threshold. CRITICAL alert fires. The operator has approximately 10 minutes to reroute traffic away from FW1 before latency reaches 219ms at T+0.",
    hasAlert: true,
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.4427, threshold: 0.01, last: 74.05, range: [20, 90], status: 'matched', formula: 'slope=0.443 ≥ 0.01 ✓ | last=74.1% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 214.0500, threshold: 2.0, last: 315.52, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=214.1 ≥ 2.0 ✓ | last=315.5 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.6871, threshold: 0.03, last: 70.5, range: [10, 98], status: 'matched', lag: '20min', formula: 'slope=0.687 ≥ 0.03 ✓ | last=70.5% ∈ [10,98] ✓ | lag=20min ✓' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 2.3887, threshold: 0.05, last: 174.11, range: [5, 500], status: 'matched', lag: '30min', formula: 'slope=2.389 ≥ 0.05 ✓ | last=174.1ms ∈ [5,500] ✓ | lag=30min ✓' },
    ]
  },
  {
    poll: 'T+0min (PEAK)',
    clock: '22:50',
    status: 'CRITICAL',
    matchedSteps: 4,
    totalSteps: 4,
    confidence: 0.72,
    score: 0.72,
    summary: "Peak moment — HIGH_LATENCY event reached (FW1 latency = 219ms)",
    description: "The failure has arrived. FW1:latency_ms peaked at 194.91ms in this window (the actual peak of 219ms is at T+0min). The pattern was correctly identified and a CRITICAL alert was issued 10 minutes earlier. R1:cpu_pct is at 73.71% (still elevated). SW1:crc_errors at 318.84 (maximum of the episode). SW2:buffer_util at 69.4%. The cascade is at full intensity.",
    hasAlert: true,
    steps: [
      { id: 1, device: 'R1', metric: 'cpu_pct', feature: 'slope', actual: 0.5112, threshold: 0.01, last: 73.71, range: [20, 90], status: 'matched', formula: 'slope=0.511 ≥ 0.01 ✓ | last=73.7% ∈ [20,90] ✓' },
      { id: 2, device: 'SW1', metric: 'crc_errors', feature: 'delta', actual: 318.84, threshold: 2.0, last: 318.84, range: [0, 500], status: 'matched', lag: '10min', formula: 'delta=318.8 ≥ 2.0 ✓ | last=318.8 ∈ [0,500] ✓ | lag=10min ✓' },
      { id: 3, device: 'SW2', metric: 'buffer_util', feature: 'slope', actual: 0.694, threshold: 0.03, last: 69.4, range: [10, 98], status: 'matched', lag: '20min', formula: 'slope=0.694 ≥ 0.03 ✓ | last=69.4% ∈ [10,98] ✓ | lag=20min ✓' },
      { id: 4, device: 'FW1', metric: 'latency_ms', feature: 'slope', actual: 2.389, threshold: 0.05, last: 219.0, range: [5, 500], status: 'matched', lag: '30min', formula: 'slope=2.389 ≥ 0.05 ✓ | last=219.0ms ∈ [5,500] ✓ | lag=30min ✓' },
    ]
  }
];

export default function LiveInferencePage() {
  const [isLive, setIsLive] = useState(true);
  const [inferences, setInferences] = useState<InferenceItem[]>([]);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SYSTEM: Inference Engine v3.0 initialized.`,
    `[${new Date().toLocaleTimeString()}] MODELS: 13 binary artifacts (.pkl) loaded into memory.`,
    `[${new Date().toLocaleTimeString()}] DATA: Kafka stream established at 1-min poll interval.`,
  ]);
  const [processingState, setProcessingState] = useState<'IDLE' | 'POLLING' | 'PROCESSING' | 'PAUSED'>('PAUSED');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [viewMode, setViewMode] = useState<'default' | 'patterns' | 'progressive'>('default');
  const [patternMatches, setPatternMatches] = useState<PatternMatchItem[]>([]);
  const [stats, setStats] = useState({
    anomalies: 0,
    predictions: 0,
    patterns: 0,
    polls: 0
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [slidingWindows, setSlidingWindows] = useState<{ id: string, startTime: string, endTime: string, color: string }[]>([]);

  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // POLL CYCLE EFFECT
  useEffect(() => {
    if (processingState === 'PAUSED') return;

    // Initial run
    if (stats.polls === 0 && processingState === 'IDLE') {
      runParallelInference();
    }

    const interval = setInterval(() => {
      runParallelInference();
    }, 30000); // 30 second simulation poll

    return () => clearInterval(interval);
  }, [processingState, stats.polls]); // Added stats.polls to dependency array

  const runParallelInference = () => {
    setProcessingState('PROCESSING');

    // Increment poll count first
    const currentPollCount = stats.polls + 1;
    setStats(prev => ({ ...prev, polls: currentPollCount }));

    // Add fresh 75-min window (Sliding Rectangle logic) - Always update
    const now = new Date();
    const past = new Date(now.getTime() - 75 * 60000);
    const COLORS = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#3B82F6'];
    const newWindow = {
      id: `WIN-${Date.now()}`,
      startTime: past.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setSlidingWindows(prev => [newWindow, ...prev].slice(0, 5));

    // WARM-UP LOGIC: No predictions/patterns until poll 5
    if (currentPollCount < 5) {
      addLog(`ENGINE: Data aggregation in progress [${currentPollCount}/5]`);
      setProcessingState('IDLE');
      return;
    }

    addLog(`ENGINE: Sending telemetry batch to ${MODELS.length} models in parallel...`);

    // Simulate some delay for "processing"
    setTimeout(() => {
      const newInferences: InferenceItem[] = [];

      // Randomly generate results for some devices
      const count = Math.floor(Math.random() * 3) + 1;
      let pCount = 0;
      let aCount = 0;
      let patCount = 0;

      for (let i = 0; i < count; i++) {
        const dev = DEVICES[Math.floor(Math.random() * DEVICES.length)];
        const rand = Math.random();

        let item: InferenceItem;
        if (rand > 0.5) { // Prediction: Forecasting using Device-Specific Chains
          const chains = dev.t === 'ROUTER' ? ROUTER_CHAINS : SWITCH_CHAINS;
          const chain = chains[Math.floor(Math.random() * chains.length)];
          const waitMinutes = [5, 10, 15, 20, 30, 45, 60, 90][Math.floor(Math.random() * 8)];
          const now = new Date();
          const pTime = new Date(now.getTime() + waitMinutes * 60000);
          item = {
            id: `INF-${Date.now()}-${i}`,
            timestamp: now.toLocaleTimeString(),
            device: dev.n,
            interface: dev.i,
            type: 'PREDICTION',
            event: chain.label,
            confidence: 0.85 + Math.random() * 0.1,
            status: rand > 0.8 ? 'CRITICAL' : 'WARNING',
            estimatedWait: waitMinutes >= 60 ? `in ~${Math.floor(waitMinutes / 60)} hr${waitMinutes >= 120 ? 's' : ''}` : `in ~${waitMinutes} mins`,
            predictedTime: pTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
          };
          pCount++;
          addLog(`RF_MODEL [${dev.t}]: Predicted ${item.event} on ${item.device} (${item.estimatedWait})`);
        } else { // Anomaly: Isolation Forest Discovery
          const triggerMetric = ['cpu_pct', 'util_pct', 'queue_depth', 'latency_ms', 'crc_errors'][Math.floor(Math.random() * 5)];
          const description = `${triggerMetric.replace('_', ' ').toUpperCase()} SPIKE DETECTED`;
          item = {
            id: `INF-${Date.now()}-${i}`,
            timestamp: new Date().toLocaleTimeString(),
            device: dev.n,
            interface: dev.i,
            type: 'ANOMALY',
            event: description,
            confidence: 0.9 + Math.random() * 0.08,
            status: 'CRITICAL'
          };
          aCount++;
          addLog(`ISO_FOREST [${dev.t}]: Anomalous ${triggerMetric} detected on ${item.device} (Confidence: ${item.confidence})`);
        }

        // Push all inferences to the grid (Predictions, Anomalies, and Analyzed Patterns)
        newInferences.push(item);
      }

      // Handle Pattern Matches
      const activePatterns: PatternMatchItem[] = [...patternMatches];

      // Ensure our asked pattern is always present as a 6th row row for demonstration
      const rootPatternExist = activePatterns.find(p => p.id === 'PAT-LATENCY-ROOT');
      if (!rootPatternExist && currentPollCount >= 5) {
          const fwDev = DEVICES.find(d => d.p === 'FW1') || DEVICES[0];
          const template = CHAIN_TEMPLATES['HIGH_LATENCY_VALIDATED'];
          const nowTime = new Date().toLocaleTimeString();
          
          const staticPattern: PatternMatchItem = {
            id: 'PAT-LATENCY-ROOT',
            device: fwDev.n,
            deviceType: fwDev.t,
            prefix: (fwDev as any).p,
            ip: (fwDev as any).ip,
            model: (fwDev as any).m,
            templateId: 'HIGH_LATENCY_VALIDATED',
            interface: fwDev.i,
            timestamp: nowTime,
            currentStep: 2, // At Step 3 (BUFFER_UTIL)
            confidence: 0.72,
            steps: template.steps.map((_, i) => ({
              status: i <= 2 ? 'arrived' : 'pending',
              timestamp: i <= 2 ? nowTime : undefined,
              confValue: i <= 2 ? 0.72 : undefined
            }))
          };
          activePatterns.push(staticPattern);
      }

      // Randomly start a new pattern or progress existing ones
      if (Math.random() > 0.4) {
          const dev = DEVICES[Math.floor(Math.random() * (DEVICES.length - 1))]; // Exclude FW1 from random churn to keep row stable
          const existingIdx = activePatterns.findIndex(p => p.device === dev.n && p.id !== 'PAT-LATENCY-ROOT');

        if (existingIdx === -1) {
          // New Pattern
          const templates = Object.keys(CHAIN_TEMPLATES);
          const tId = templates[Math.floor(Math.random() * templates.length)];
          const template = CHAIN_TEMPLATES[tId];

          const newPattern: PatternMatchItem = {
            id: `PAT-${Date.now()}`,
            device: dev.n,
            deviceType: dev.t,
            prefix: (dev as any).p,
            ip: (dev as any).ip,
            model: (dev as any).m,
            templateId: tId,
            interface: dev.i,
            timestamp: now.toLocaleTimeString(),
            currentStep: 0,
            confidence: CONFIDENCE_JUMPS[0],
            steps: template.steps.map((_, i) => ({
              status: i === 0 ? 'arrived' : 'pending',
              timestamp: i === 0 ? now.toLocaleTimeString() : undefined,
              confValue: i === 0 ? 0.32 + (Math.random() * 0.05) : undefined
            }))
          };
          activePatterns.unshift(newPattern);
          patCount++;
          addLog(`KMEANS: New sequential pattern matching started on ${dev.n} [Sequence: ${tId}]`);
        } else {
          // Progress existing
          const p = activePatterns[existingIdx];
          const template = CHAIN_TEMPLATES[p.templateId];
          if (p.currentStep < template.steps.length - 1) {
            // Support skipping steps (out of order arrival)
            const maxJump = Math.min(2, template.steps.length - 1 - p.currentStep);
            const jump = Math.random() > 0.85 ? maxJump : 1; // 15% chance to jump
            const targetStep = p.currentStep + jump;

            // Mark intermediate steps as gap if we jumped
            for (let i = p.currentStep + 1; i < targetStep; i++) {
              p.steps[i] = {
                status: 'gap',
                timestamp: now.toLocaleTimeString(),
                confValue: 0
              };
            }

            // Mark target step as arrived
            p.currentStep = targetStep;
            p.steps[targetStep] = {
              status: 'arrived',
              timestamp: now.toLocaleTimeString(),
              confValue: 0.4 + (Math.random() * 0.5)
            };

            const baseConf = CONFIDENCE_JUMPS[targetStep] || p.confidence;
            const gaps = p.steps.filter(s => s?.status === 'gap').length;
            p.confidence = Math.max(0, baseConf - (gaps * GAP_PENALTY));

            addLog(`KMEANS: Pattern ${jump > 1 ? 'JUMP' : 'progression'} detected on ${p.device} [Step ${targetStep + 1}: ${template.steps[targetStep].label}]`);
          }
        }
      }

      let currentProgressions = patCount; // Start with the new patterns created this cycle
      // If we progressed existing patterns, count those too
      if (Math.random() > 0.4 && activePatterns.length > 0) {
        // In the current logic, we only potentially do ONE progression or ONE new pattern per cycle.
        // Let's make it more realistic by allowing multiple matches per cycle if polls are high.
        currentProgressions += Math.floor(Math.random() * 2);
      }

      setPatternMatches(activePatterns.slice(0, 10));

      setStats(prev => ({
        ...prev,
        predictions: prev.predictions + pCount,
        anomalies: prev.anomalies + aCount,
        patterns: prev.patterns + currentProgressions,
        polls: currentPollCount
      }));
      setInferences(prev => [...newInferences, ...prev].slice(0, 20));
      setProcessingState('IDLE');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-['Sora',sans-serif] text-[13px] overflow-x-hidden selection:bg-[#3B82F6]/30">

        {/* TOP STATUS BAR */}
        <div className="bg-[#0F172A] border-b border-white/5 px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", processingState === 'PROCESSING' ? "bg-[#3DDAB4] animate-pulse" : "bg-[#64748B]")} />
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] uppercase font-bold tracking-widest text-[#3DDAB4]">
                {stats.polls < 5 ? `DATA_AGGREGATION_PHASE: [${stats.polls}/5]` : 'LIVE_INFERENCE_ENGINE_ACTIVE'}
              </span>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 hover:bg-white/5 rounded transition-colors group"
                title="View Buffer & Kernel"
              >
                <Info className="w-3.5 h-3.5 text-[#3B82F6] group-hover:text-[#3DDAB4]" />
              </button>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[10px] text-[#94A3B8] font-medium uppercase font-['IBM_Plex_Mono',monospace]">
                Last Poll: {inferences[0]?.timestamp || '--:--:--'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (stats.polls === 0 && processingState === 'PAUSED') {
                  setProcessingState('IDLE'); // This will trigger the useEffect immediately
                } else {
                  setProcessingState(processingState === 'PAUSED' ? 'PROCESSING' : 'PAUSED');
                }
              }}
              className={cn(
                "px-5 py-2 rounded-lg font-['IBM_Plex_Mono',monospace] text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                processingState !== 'PAUSED'
                  ? "bg-[#3B82F6] text-white border-[#3B82F6]/50 hover:bg-[#2563EB] hover:scale-105"
                  : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20 hover:scale-105"
              )}
            >
              {stats.polls === 0 && processingState === 'PAUSED' ? 'START ENGINE' : (processingState !== 'PAUSED' ? 'PAUSE ENGINE' : 'RESUME ENGINE')}
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 gap-8 max-w-[1200px] mx-auto">

          <div className="space-y-8">
            {/* INFERENCE GRID HEADER */}

            {/* INFERENCE GRID HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-2xl flex items-center justify-center border border-[#3B82F6]/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <Layers className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    {viewMode === 'default' ? 'LiveInferenceStream' : 'PatternMatchIntelligence'}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    {viewMode === 'patterns' && (
                      <button
                        onClick={() => setViewMode('default')}
                        className="px-2 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest hover:bg-[#3B82F6]/20 transition-all flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 rotate-180" />
                        BackToStream
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="bg-[#111827] px-5 py-3 rounded-xl border border-white/5 min-w-[90px] text-center">
                  <div className="text-[8px] text-[#64748B] uppercase font-black mb-1 tracking-widest">Anomalies</div>
                  <div className="text-xl font-black tracking-tighter tabular-nums text-[#EF4444]">{stats.anomalies}</div>
                </div>
                <div className="bg-[#111827] px-5 py-3 rounded-xl border border-white/5 min-w-[90px] text-center">
                  <div className="text-[8px] text-[#64748B] uppercase font-black mb-1 tracking-widest">Predictions</div>
                  <div className="text-xl font-black tracking-tighter tabular-nums text-[#3B82F6]">{stats.predictions}</div>
                </div>
                <button
                  onClick={() => setViewMode('patterns')}
                  className={cn(
                    "px-5 py-3 rounded-xl border transition-all text-center group",
                    viewMode === 'patterns' ? "bg-[#3DDAB4]/10 border-[#3DDAB4]/40" : "bg-[#111827] border-white/5 hover:border-[#3DDAB4]/30"
                  )}
                >
                  <div className="text-[8px] text-[#64748B] uppercase font-black mb-1 tracking-widest group-hover:text-[#3DDAB4]/70">PatternMatch</div>
                  <div className="text-xl font-black tracking-tighter tabular-nums text-[#3DDAB4]">{stats.patterns}</div>
                </button>
                <div className="bg-[#111827] px-5 py-3 rounded-xl border border-white/5 min-w-[90px] text-center">
                  <div className="text-[8px] text-[#64748B] uppercase font-black mb-1 tracking-widest">Polls</div>
                  <div className="text-xl font-black tracking-tighter tabular-nums text-[#3DDAB4]">{stats.polls}</div>
                </div>
              </div>
            </div>

            {/* LIVE FEED GRID LIST */}
            <div className="grid grid-cols-1 gap-6">
              {stats.polls < 5 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#1E293B]/20 rounded-full flex items-center justify-center mb-6 border border-white/5 relative">
                    <RefreshCw className="w-8 h-8 text-[#3B82F6] animate-spin" />
                  </div>
                  <div className="text-[#3B82F6] font-['IBM_Plex_Mono',monospace] text-[11px] uppercase font-black tracking-[0.3em]">
                    StabilizingWindowIntelligence...
                  </div>
                  <p className="text-[9px] text-[#475569] uppercase font-bold mt-3 tracking-widest max-w-sm italic">
                    Engine needs 5 polled windows to activate inference validation.
                  </p>
                </div>
              )}

              {stats.polls >= 5 && viewMode === 'default' && (
                <div className="grid grid-cols-1 gap-6">
                  {inferences.map((item, idx) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "bg-[#111827]/40 border border-white/5 rounded-2xl p-6 hover:bg-[#111827]/60 transition-all duration-300 group overflow-hidden relative",
                        idx === 0 && "border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.05)]"
                      )}
                    >
                      {idx === 0 && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B82F6]" />
                      )}

                      <div className="grid grid-cols-12 items-center gap-6">
                        {/* COL 1: IDENTITY */}
                        <div className="col-span-3 flex items-center gap-4">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center border-2 flex-shrink-0 transition-transform group-hover:scale-105",
                            item.type === 'PREDICTION' ? "bg-[#3B82F6]/5 border-[#3B82F6]/20" :
                              "bg-[#EF4444]/5 border-[#EF4444]/20"
                          )}>
                            {item.type === 'PREDICTION' && <Box className="w-5 h-5 text-[#3B82F6]" />}
                            {item.type === 'ANOMALY' && <AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white whitespace-nowrap tracking-tight">{item.device}</span>
                              <span className="text-[9px] font-black text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {item.interface}
                              </span>
                            </div>
                            <div className="text-[9px] font-bold text-[#475569] flex items-center gap-1.5 mt-1 uppercase tracking-tight font-['IBM_Plex_Mono',monospace]">
                              <Clock className="w-3 h-3" />
                              {item.timestamp}
                            </div>
                          </div>
                        </div>

                        {/* COL 2: INCIDENT DESCRIPTION & STEPPER */}
                        <div className="col-span-8 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#000]/40 border-2 inline-block leading-tight",
                              item.status === 'CRITICAL' ? "text-[#EF4444] border-[#EF4444]/20" :
                                item.status === 'WARNING' ? "text-[#F59E0B] border-[#F59E0B]/20" :
                                  "text-[#3B82F6] border-[#3B82F6]/20"
                            )}>
                              {item.event}
                            </div>
                            {item.type === 'PREDICTION' && item.estimatedWait && (
                              <div className={cn(
                                "flex items-center gap-2 text-[9px] font-black px-2 py-1 rounded-md border",
                                item.estimatedWait.includes('min') && parseInt(item.estimatedWait.match(/\d+/)?.[0] || '60') <= 15
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)] animate-pulse"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              )}>
                                <Clock className="w-3 h-3" />
                                ETA: {item.estimatedWait}
                              </div>
                            )}
                          </div>

                          {/* Conditional View: Pattern Stepper vs Individual RF Prediction */}
                          {item.type === 'PREDICTION' && (
                            item.id.length % 2 === 0 ? (
                              /* Pattern Match Stepper View */
                              <div className="relative pt-2 pb-1 overflow-x-auto no-scrollbar">
                                <div className="flex items-start gap-1">
                                  {[1, 2, 3, 4].map((stepIdx) => {
                                    const totalSteps = 4;
                                    const matchedCount = Math.round(item.confidence * totalSteps);
                                    const isMatched = stepIdx <= matchedCount;
                                    const isNext = stepIdx === matchedCount + 1;

                                    return (
                                      <div key={stepIdx} className="flex-1 min-w-[120px]">
                                        <div className="flex items-center w-full mb-2">
                                          <div className={cn("h-1 flex-1 rounded-l-full", stepIdx === 1 ? "bg-transparent" : (isMatched ? "bg-[#10B981]" : "bg-white/5"))} />
                                          <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black border-2 flex-shrink-0 transition-all",
                                            isMatched ? "bg-[#10B981] border-[#10B981] text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                              isNext ? "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B] animate-pulse" :
                                                "bg-white/5 border-white/10 text-white/20"
                                          )}>
                                            {isMatched ? '✓' : stepIdx}
                                          </div>
                                          <div className={cn("h-1 flex-1 rounded-r-full", stepIdx === totalSteps ? "bg-transparent" : (isMatched && stepIdx < matchedCount ? "bg-[#10B981]" : "bg-white/5"))} />
                                        </div>
                                        <div className="text-center">
                                          <div className={cn(
                                            "text-[8px] font-black uppercase tracking-tighter truncate",
                                            isMatched ? "text-[#10B981]" : isNext ? "text-[#F59E0B]" : "text-white/20"
                                          )}>
                                            {stepIdx === 1 ? 'CPU_SPIKE' : stepIdx === 2 ? 'CRC_ERRORS' : stepIdx === 3 ? 'BUFFER_UTIL' : 'LATENCY_MS'}
                                          </div>
                                          {isMatched && (
                                            <div className="text-[7px] text-[#475569] font-bold mt-0.5">CONFIRMED</div>
                                          )}
                                          {isNext && (
                                            <div className="text-[7px] text-[#F59E0B]/70 font-bold mt-0.5 animate-pulse">PREDICTED</div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              /* Individual RF Predictions show no extra detail to keep flow clean */
                              null
                            )
                          )}
                        </div>

                        {/* COL 3: SCORE & CONFIDENCE */}
                        <div className="col-span-1 flex flex-col items-center justify-center gap-2 border-l border-white/5">
                          <div className="text-[8px] font-black text-[#64748B] uppercase tracking-[0.2em]">Confidence</div>
                          <div className="relative w-12 h-12 flex items-center justify-center group/donut">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="21" stroke="#1f2937" strokeWidth="3" fill="transparent" />
                              <circle
                                cx="24"
                                cy="24"
                                r="21"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 21}
                                strokeDashoffset={2 * Math.PI * 21 * (1 - item.confidence)}
                                className={cn(
                                  "transition-all duration-1000 ease-out",
                                  item.confidence > 0.9 ? "text-[#3DDAB4]" :
                                    item.confidence > 0.8 ? "text-[#3B82F6]" : "text-[#F59E0B]"
                                )}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-black text-white tracking-widest">
                                {Math.round(item.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {stats.polls >= 5 && viewMode === 'patterns' && (
                <div className="flex flex-col gap-[1px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Table Header */}
                  <div className="flex items-center px-8 py-4 bg-[#0F172A] border-b border-white/5 font-['IBM_Plex_Mono',monospace] text-[9px] text-[#64748B] uppercase tracking-[0.07em]">
                    <div style={{ width: '200px', flexShrink: 0 }}>device</div>
                    <div style={{ flex: 1 }}>pattern chain</div>
                    <div style={{ width: '88px', textAlign: 'right' }}>confidence</div>
                    <div style={{ width: '80px', textAlign: 'center' }}>status</div>
                    <div style={{ width: '14px' }} />
                  </div>

                  {patternMatches.map((pat) => {
                    const sev = pat.confidence >= 0.9 ? 'r' : pat.confidence >= 0.7 ? 'o' : 'y';
                    const isOp = expandedId === pat.id;
                    const bclr = sev === 'r' ? '#ef4444' : sev === 'o' ? '#f59e0b' : '#3b82f6';
                    const isCf = pat.currentStep >= CHAIN_TEMPLATES[pat.templateId].steps.length - 1;

                    return (
                      <div key={pat.id} className={cn("border-b border-white/5 bg-[#0B0F19]/40 hover:bg-[#111827] transition-all group", isOp && "bg-[#111827]")}>
                        <div
                          className="flex items-center gap-[9px] px-8 py-3 cursor-pointer"
                          onClick={() => setExpandedId(isOp ? null : pat.id)}
                        >
                          {/* device cell */}
                          <div className="w-[200px] flex-shrink-0">
                            <span className={cn("di", `di-${pat.prefix.toLowerCase().charAt(0)}`)}>{pat.prefix.substring(0, 3)}</span>
                            <span className="dh font-['IBM_Plex_Mono',monospace] text-[10px] font-bold text-white">{pat.device.split('.')[0]}</span>
                            <div className="dm font-['IBM_Plex_Mono',monospace] text-[8px] color-[#7f8ea3] mt-1 flex items-center gap-[4px] pl-[28px] opacity-60">
                              <span className="dip">{pat.ip}</span>
                              <span className="dif text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/10 rounded px-1">{pat.interface}</span>
                            </div>
                          </div>

                          {/* chain pills */}
                          <div className="flex-1 overflow-hidden flex items-center gap-[2px]">
                            {CHAIN_TEMPLATES[pat.templateId].steps.map((step, i) => {
                              const stepData = pat.steps[i];
                              const st = i <= pat.currentStep ? (stepData?.status || 'arrived') : (i === pat.currentStep + 1 ? 'nxt' : 'fut');
                              const cls = `mp mp-${st === 'arrived' ? 'ok' : st}`;
                              const lbl = step.label.replace(/_BREACH|_TRAP|_EVENT/g, '');
                              return (
                                <span key={i} className="flex items-center">
                                  <span className={cls}>{lbl}</span>
                                  {i < CHAIN_TEMPLATES[pat.templateId].steps.length - 1 && <span className="marr text-[#233044] text-[8px] px-0.5">›</span>}
                                </span>
                              );
                            })}
                          </div>

                          {/* right */}
                          <div className="w-[88px] flex-shrink-0 text-right">
                            <div className={cn("rn font-['IBM_Plex_Mono',monospace] text-[13px] font-bold", sev === 'r' ? 'text-[#ef4444]' : sev === 'o' ? 'text-[#f59e0b]' : 'text-[#3b82f6]')}>
                              {Math.round(pat.confidence * 100)}%
                            </div>
                            <div className="rb w-[52px] h-[2px] bg-[#1c2b3e] rounded-[1px] overflow-hidden mt-[3px] ml-auto">
                              <div className="rf h-full transition-all duration-700" style={{ width: `${pat.confidence * 100}%`, background: bclr }}></div>
                            </div>
                          </div>

                          <div className="w-[80px] flex-shrink-0 text-center">
                            <span className={cn("sp text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", `sp-${sev}`)}>
                              {isCf ? 'CONFIRMED' : 'PREDICTING'}
                            </span>
                          </div>

                          <div className={cn("ec w-[14px] flex-shrink-0 text-[#3d5066] transition-transform", isOp && "rotate-90 text-blue-500")}>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* DETAIL */}
                        {isOp && (
                          <div className="det bg-[#0b0f1a] border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                            {/* horizontal stepper container */}
                            <div className="stpr px-8 py-10 pb-6 bg-[#0b0f1a] overflow-x-auto no-scrollbar">
                              <div className="stpr-h text-[9px] text-[#7f8ea3] font-['IBM_Plex_Mono',monospace] mb-8 flex items-center gap-2 sticky left-0">
                                <div className="stpr-dot w-1 h-1 rounded-full" style={{ background: bclr }}></div>
                                {isCf ? 'full pattern matched — sequence confirmed' : `predicting ${pat.templateId.toLowerCase()} · ${CHAIN_TEMPLATES[pat.templateId].steps.length - (pat.currentStep + 1)} steps remaining`}
                              </div>

                              <div className="flex items-start">
                                {CHAIN_TEMPLATES[pat.templateId].steps.map((step, i) => {
                                  const stepState = pat.steps[i];
                                  const st = i <= pat.currentStep ? (stepState?.status || 'arrived') : (i === pat.currentStep + 1 ? 'nxt' : 'fut');
                                  const isArrived = st === 'arrived';
                                  const isGap = st === 'gap';
                                  const isNxt = st === 'nxt';
                                  const isCfN = i === CHAIN_TEMPLATES[pat.templateId].steps.length - 1 && isArrived;

                                  const pOk = i > 0 && (pat.steps[i - 1]?.status === 'arrived' || (i - 1 <= pat.currentStep && !pat.steps[i - 1]));
                                  const pGap = i > 0 && pat.steps[i - 1]?.status === 'gap';

                                  const cLeft = i === 0 ? 'cn' : (pOk ? 'cg' : (pGap ? 'cg2' : (i === pat.currentStep + 1 ? 'cy2' : 'cd')));
                                  const cRight = i === CHAIN_TEMPLATES[pat.templateId].steps.length - 1 ? 'cn' : (isArrived && i < pat.currentStep ? 'cg' : (isGap ? 'cg2' : (isNxt ? 'cy2' : 'cd')));

                                  const hasVal = step.label.includes('UTIL') || step.label.includes('ERRORS') || step.label.includes('DROP') || step.label.includes('CPU');
                                  const mVal = step.label.includes('UTIL') ? `${Math.round(80 + Math.random() * 5)}%` : 'TRIGGERED';

                                  return (
                                    <div key={i} className="flex flex-col items-center min-w-[170px] flex-shrink-0 group">
                                      {/* Node & Lines Row */}
                                      <div className="w-full flex items-center h-[24px] mb-4">
                                        <div className={cn("h-[2px] flex-1", cLeft)}></div>
                                        <div className={cn("sn w-[20px] h-[20px] rounded-full flex items-center justify-center text-[8px] font-bold border-2 mx-2 flex-shrink-0 transition-transform group-hover:scale-110",
                                          isCfN ? "sn-cf" : isArrived ? "sn-ok" : isGap ? "sn-gap" : isNxt ? "sn-nxt" : "sn-fut")}>
                                          {isArrived ? '✓' : isGap ? '' : i + 1}
                                        </div>
                                        <div className={cn("h-[2px] flex-1", cRight)}></div>
                                      </div>

                                      {/* Content below line */}
                                      <div className="flex flex-col items-center text-center px-4 w-full">
                                        {!isGap && (
                                          <div className={cn("ec2 text-[7px] px-1.5 py-0.5 rounded mb-1.5 font-['IBM_Plex_Mono',monospace] uppercase tracking-wider",
                                            isArrived ? (step.subLabel.includes('TRAP') ? 'ec-t' : 'ec-m') : isNxt ? 'ec-p' : 'ec-m')}>
                                            {isArrived ? (step.subLabel || 'METRIC POLL') : isNxt ? 'PREDICTED' : 'PENDING'}
                                          </div>
                                        )}
                                        <div className={cn("sl text-[10px] font-bold font-['IBM_Plex_Mono',monospace] tracking-tight mb-2 h-[24px] flex items-center justify-center leading-tight line-clamp-2",
                                          isCfN ? "sl-cf" : isArrived ? "sl-ok" : isGap ? "sl-gap" : isNxt ? "sl-nxt" : "sl-fut")}>
                                          {step.label.split('_').join(' ')}
                                        </div>

                                        {isArrived && (
                                          <div className="flex flex-col items-center gap-1.5 animate-in slide-in-from-top-1 duration-500">
                                            {hasVal && (
                                              <span className="text-[8px] font-black bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 px-1.5 py-0.5 rounded uppercase">
                                                {mVal}
                                              </span>
                                            )}
                                            <div className="flex items-center gap-2">
                                              <span className="text-[8px] text-[#10B981] font-bold uppercase tracking-wider">arrived</span>
                                              <span className="text-[8px] text-[#475569] font-['IBM_Plex_Mono',monospace]">{stepState?.timestamp?.split(' ')[0] || '--'}</span>
                                            </div>
                                            <span className="px-1.5 py-0.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-[2px] text-[7.5px] font-bold uppercase tracking-widest mt-0.5">confirmed</span>
                                          </div>
                                        )}

                                        {isNxt && (
                                          <div className="flex flex-col items-center gap-1.5 animate-pulse duration-1000">
                                            <div className="text-[12px] font-black text-[#f59e0b] font-['IBM_Plex_Mono',monospace]">~2s</div>
                                            <span className="px-1.5 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 rounded-[2px] text-[8px] font-bold uppercase tracking-widest">NEXT EVENT</span>
                                          </div>
                                        )}

                                        {isGap && (
                                          <div className="flex flex-col items-center opacity-30">
                                            <div className="text-[9px] font-bold text-[#475569] italic uppercase">MISSED</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OVERLAY SIDEBAR */}
        <div
          className={cn(
            "fixed inset-0 z-[100] transition-opacity duration-300",
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />

          <div
            className={cn(
              "absolute right-0 inset-y-0 w-[450px] bg-[#0F172A] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out transform p-6 flex flex-col gap-8",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
                  <Activity className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Stream Analysis Buffer</h2>
                  <p className="text-[10px] text-[#94A3B8] font-['IBM_Plex_Mono',monospace] uppercase tracking-widest">Real-time Kernel Status</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#94A3B8]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
              {/* SLIDING WINDOW RECTANGLES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Sliding Interpretation Buffer
                  </h2>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                    <span className="text-[8px] font-bold text-[#94A3B8] uppercase">75m Window</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {slidingWindows.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-8 border border-dashed border-white/5 rounded animate-pulse" />
                    ))
                  ) : (
                    [...slidingWindows].reverse().map((win, idx) => (
                      <div key={win.id} className="relative h-9 rounded-md border border-white/5 bg-[#000]/60 overflow-hidden">
                        <div
                          className="absolute inset-y-0.5 rounded flex items-center px-4 transition-all duration-1000 border-l-[4px] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                          style={{
                            left: `${idx * 3.5}%`,
                            width: '84%',
                            backgroundColor: `${win.color}35`,
                            borderColor: win.color,
                            color: win.color,
                            opacity: 0.6 + (idx * 0.1)
                          }}
                        >
                          <div className="font-['IBM_Plex_Mono',monospace] text-[9.5px] font-black flex items-center justify-between w-full">
                            <span className="opacity-90">{win.startTime}</span>
                            <div className="flex-1 mx-3 h-[1px] bg-current opacity-30" />
                            <span>{win.endTime}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PARALLEL MONITOR PANEL */}
              <Card className="bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F8FAFC]">Parallel Engine Kernel</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3DDAB4]/40 animate-pulse" />
                  </div>
                </div>

                <ScrollArea className="h-[400px] bg-[#0c0c0c]/80 backdrop-blur-md">
                  <div className="p-5 space-y-2.5">
                    {logs.map((log, i) => (
                      <div key={i} className="font-['IBM_Plex_Mono',monospace] text-[10px] leading-relaxed break-all animate-in fade-in slide-in-from-left-2 duration-500">
                        <span className={cn(
                          log.includes('CRITICAL') || log.includes('Anomaly') ? "text-[#EF4444]" :
                            log.includes('Predicted') ? "text-[#3B82F6]" :
                              log.includes('SYSTEM') ? "text-[#94A3B8]" : "text-[#3DDAB4]"
                        )}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </ScrollArea>
              </Card>

              {/* MODEL LOAD MONITOR */}
              <Card className="bg-[#1E293B]/20 border border-white/5 rounded-2xl p-5 space-y-4 max-h-[300px] overflow-auto no-scrollbar">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] flex items-center gap-2 sticky top-0 bg-[#0F172A] pb-2">
                  <Binary className="w-4 h-4" />
                  Active Artifact Registry ({MODELS.length})
                </h3>
                <div className="space-y-3">
                  {MODELS.map((m, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          m.type === 'Anomaly' ? "bg-[#EF4444]" :
                            m.type === 'Pattern' ? "bg-[#3DDAB4]" :
                              m.type === 'RF' ? "bg-[#3B82F6]" : "bg-[#94A3B8]"
                        )} />
                        <span className="text-[10px] font-medium text-[#CBD5E1] font-['IBM_Plex_Mono',monospace] group-hover:text-white transition-colors truncate max-w-[180px]" title={m.name}>
                          {m.name}
                        </span>
                      </div>
                      <span className="text-[8px] font-black uppercase text-[#94A3B8] opacity-50">
                        {m.type}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#3DDAB4]" />
                <span className="text-[10px] font-bold text-[#3DDAB4] uppercase tracking-tighter">Inference Stream Live</span>
              </div>
              <Badge variant="outline" className="text-[8px] bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20">v3.0.4-LTS</Badge>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        
        .di{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:3px;font-family:'IBM_Plex_Mono',monospace;font-size:8px;font-weight:600;flex-shrink:0;margin-right:6px;vertical-align:middle;}
        .di-c{background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.15);}
        .di-j{background:rgba(16,185,129,.09);color:#10b981;border:1px solid rgba(16,185,129,.15);}
        .di-a{background:rgba(245,158,11,.09);color:#f59e0b;border:1px solid rgba(245,158,11,.15);}
        .di-n{background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.15);}
        .di-s{background:rgba(6,186,212,.09);color:#06b6d4;border:1px solid rgba(6,186,212,.15);}
        .di-r{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.15);}
        .di-i{background:rgba(139,92,246,.12);color:#8b5cf6;border:1px solid rgba(139,92,246,.15);}

        .mp{font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 5px;border-radius:3px;white-space:nowrap;flex-shrink:0;}
        .mp-ok{background:rgba(16,185,129,.09);color:rgba(110,231,183,.9);border:1px solid rgba(16,185,129,.15);}
        .mp-gap{background:rgba(255,255,255,.01);color:#233044;border:1px solid #1c2b3e;opacity:.5;}
        .mp-nxt{background:rgba(245,158,11,.07);color:rgba(252,211,77,.9);border:1px dashed rgba(245,158,11,.25);animation:mpN 1.6s infinite;}
        .mp-fut{background:transparent;color:#233044;border:1px solid #1c2b3e;}
        @keyframes mpN{0%,100%{opacity:.55}50%{opacity:1}}
        
        .sp-y{background:rgba(59,130,246,.09);color:#3b82f6;border:1px solid rgba(59,130,246,.16);}
        .sp-o{background:rgba(245,158,11,.09);color:#f59e0b;border:1px solid rgba(245,158,11,.16);}
        .sp-r{background:rgba(239,68,68,.09);color:#ef4444;border:1px solid rgba(239,68,68,.16);}

        .cg{background:rgba(16,185,129,.38);}
        .cg2{background:rgba(16,185,129,.12);}
        .cy2{background:rgba(245,158,11,.4);}
        .cd{background:#1c2b3e;}
        .cn{background:transparent;}
        
        .sn-ok{background:rgba(16,185,129,0.12);border:1.5px solid #10b981;color:#10b981;}
        .sn-gap{background:transparent;border:1.5px solid #283852;color:transparent;}
        .sn-nxt{background:rgba(245,158,11,.07);border:1.5px dashed #f59e0b;color:#f59e0b;animation:nxA 1.5s infinite;}
        .sn-fut{background:transparent;border:1.5px solid #223044;color:#233044;}
        .sn-cf{background:rgba(239,68,68,0.1);border:1.5px solid #ef4444;color:#ef4444;}
        @keyframes nxA{0%,100%{opacity:.6}50%{opacity:1}}

        .ec-m{background:rgba(59,130,246,.07);color:rgba(96,165,250,.75);border:1px solid rgba(59,130,246,.1);}
        .ec-t{background:rgba(139,92,246,.06);color:rgba(196,181,253,.75);border:1px solid rgba(139,92,246,.1);}
        .ec-p{background:rgba(239,68,68,.05);color:rgba(252,165,165,.65);border:1px solid rgba(239,68,68,.08);}

        .spill-ok{background:rgba(16,185,129,.07);color:#10b981;border:1px solid rgba(16,185,129,.1);}
        .spill-nxt{background:rgba(245,158,11,.07);color:#f59e0b;border:1px solid rgba(245,158,11,.1);}
        .spill-fut{background:transparent;color:#233044;border:1px solid #1c2b3e;}
        .spill-cf{background:rgba(239,68,68,.08);color:#ef4444;border:1px solid rgba(239,68,68,.12);}
      `}</style>
    </MainLayout>
  );
}
