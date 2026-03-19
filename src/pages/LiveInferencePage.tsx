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
  { id: 'R-Chain-1', label: 'HIGH_LATENCY', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
  { id: 'R-Chain-2', label: 'HIGH_UTIL_WARNING', sequence: ['cpu_pct', 'crc_errors', 'latency_ms', 'queue_depth', 'util_pct'] },
  { id: 'R-Chain-3', label: 'INTERFACE_FLAP', sequence: ['cpu_pct', 'util_pct', 'crc_errors', 'queue_depth', 'latency_ms'] },
  { id: 'R-Chain-4', label: 'PACKET_DROP', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
];

const SWITCH_CHAINS = [
  { id: 'S-Chain-1', label: 'DEVICE_REBOOT', sequence: ['queue_depth', 'crc_errors', 'latency_ms', 'util_pct', 'cpu_pct'] },
  { id: 'S-Chain-2', label: 'HIGH_UTIL_WARNING', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta', 'util_pct'] },
  { id: 'S-Chain-3', label: 'INTERFACE_FLAP', sequence: ['cpu_pct', 'util_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta'] },
  { id: 'S-Chain-4', label: 'PACKET_DROP', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta', 'util_pct'] },
];

const EVENT_SEQUENCES = [
  "HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP",
  "HIGH_UTIL_WARNING -> PACKET_DROP -> HIGH_LATENCY",
  "HIGH_UTIL_WARNING -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP"
];

const CHAIN_TEMPLATES: Record<string, { label: string, meta: string, steps: any[] }> = {
  'DEVICE_REBOOT': {
    label: 'DEVICE_REBOOT',
    meta: '(seen 2x | 6 pre-event windows)',
    steps: [
      { label: 'QUEUE_DEPTH_FALL', subLabel: 'metric poll', description: 'Significant reduction in processing queue depth' },
      { label: 'CRC_ERRORS_CLEARED', subLabel: 'metric poll', description: 'Zero-state CRC stability reached' },
      { label: 'LATENCY_DROP', subLabel: 'metric poll', description: 'Minimum baseline latency reached' },
      { label: 'UTIL_BASELINE', subLabel: 'metric poll', description: 'Traffic through interface stopped' },
      { label: 'CPU_IDLE', subLabel: 'metric poll', description: 'Control plane processing at minimum' },
      { label: 'REBOOT_TRAP', subLabel: 'SNMP TRAP', description: 'Warm reboot signal detected in stream' }
    ]
  },
  'HIGH_UTIL_WARNING': {
    label: 'HIGH_UTIL_WARNING',
    meta: '(seen 207x | 298 pre-event windows)',
    steps: [
      { label: 'CPU_SPIKE', subLabel: 'metric poll', description: 'Initial CPU load increase' },
      { label: 'CRC_ERRORS_RISE', subLabel: 'metric poll', description: 'Retransmissions detected' },
      { label: 'QUEUE_PRESSURE', subLabel: 'metric poll', description: 'Output queue scaling' },
      { label: 'LATENCY_DRIFT', subLabel: 'metric poll', description: 'Sequential delay increase' },
      { label: 'REBOOT_DELTA_SHIFT', subLabel: 'metric poll', description: 'Uptime verification anomaly' },
      { label: 'UTIL_BREACH', subLabel: 'metric poll', description: 'Utilization threshold exceeded' }
    ]
  },
  'INTERFACE_FLAP': {
    label: 'INTERFACE_FLAP',
    meta: '(seen 146x | 222 pre-event windows)',
    steps: [
      { label: 'CPU_SPIKE', subLabel: 'metric poll', description: 'Initial processing pressure' },
      { label: 'UTIL_SPIKE', subLabel: 'metric poll', description: 'Throughput burst' },
      { label: 'CRC_ERRORS_BREACH', subLabel: 'metric poll', description: 'Physical link errors' },
      { label: 'QUEUE_DEPTH_RISE', subLabel: 'metric poll', description: 'Congestion buildup' },
      { label: 'LATENCY_JITTER', subLabel: 'metric poll', description: 'Unstable response time' },
      { label: 'FLAP_PREDICTION', subLabel: 'SNMP TRAP', description: 'Oscillation imminent - prediction confirmed' }
    ]
  },
  'PACKET_DROP': {
    label: 'PACKET_DROP',
    meta: '(seen 239x | 329 pre-event windows)',
    steps: [
      { label: 'CPU_SPIKE', subLabel: 'metric poll', description: 'Load increase' },
      { label: 'CRC_ERRORS_RISE', subLabel: 'metric poll', description: 'Frame checksum failures' },
      { label: 'QUEUE_DEPTH_LIMIT', subLabel: 'metric poll', description: 'Tail-drop threshold likely' },
      { label: 'LATENCY_PEAK', subLabel: 'metric poll', description: 'Processing delay breach' },
      { label: 'REBOOT_PRECEDES', subLabel: 'metric poll', description: 'Pre-reboot telemetry detected' },
      { label: 'DROP_EVENT', subLabel: 'SNMP TRAP', description: 'Active packet discard detected' }
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
  type: 'PREDICTION' | 'ANOMALY';
  event: string;
  confidence: number;
  pattern?: string;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ANALYZED';
  estimatedWait?: string;
  predictedTime?: string;
}

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

  const [viewMode, setViewMode] = useState<'default' | 'patterns'>('default');
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
      
      // Randomly start a new pattern or progress existing ones
      if (Math.random() > 0.4) {
        const dev = DEVICES[Math.floor(Math.random() * DEVICES.length)];
        const existingIdx = activePatterns.findIndex(p => p.device === dev.n);
        
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
             const nextStep = p.currentStep + 1;
             p.currentStep = nextStep;
             p.steps[nextStep] = {
               status: Math.random() > 0.15 ? 'arrived' : 'gap',
               timestamp: now.toLocaleTimeString(),
               confValue: 0.4 + (Math.random() * 0.5)
             };
             
             const baseConf = CONFIDENCE_JUMPS[nextStep] || p.confidence;
             const gaps = p.steps.filter(s => s.status === 'gap').length;
             p.confidence = Math.max(0, baseConf - (gaps * GAP_PENALTY));
             
             addLog(`KMEANS: Pattern progression detected on ${p.device} [Step ${nextStep + 1}: ${template.steps[nextStep].label}]`);
          }
        }
      }

      setPatternMatches(activePatterns.slice(0, 10));

      setStats(prev => ({
        ...prev,
        predictions: prev.predictions + pCount,
        anomalies: prev.anomalies + aCount,
        patterns: activePatterns.length
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
                    {viewMode === 'default' ? 'Live Inference Stream' : 'Pattern Match Intelligence'}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-[#64748B] uppercase tracking-[0.2em] font-['IBM_Plex_Mono',monospace]">
                      {viewMode === 'default' ? 'Real-time Telemetry Processing' : 'Causal Chain Analysis / V3'}
                    </p>
                    {viewMode === 'patterns' && (
                      <button 
                        onClick={() => setViewMode('default')}
                        className="px-2 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest hover:bg-[#3B82F6]/20 transition-all flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 rotate-180" />
                        Back to Stream
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
                  <div className="text-[8px] text-[#64748B] uppercase font-black mb-1 tracking-widest group-hover:text-[#3DDAB4]/70">Pattern Match</div>
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
              {(stats.polls < 5 || (processingState === 'PROCESSING' && (viewMode === 'default' ? inferences.length === 0 : patternMatches.length === 0))) && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#1E293B]/20 rounded-full flex items-center justify-center mb-6 border border-white/5 relative">
                    <RefreshCw className="w-8 h-8 text-[#3B82F6] animate-spin" />
                    <div className="absolute inset-0 border-4 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin [animation-duration:3s]" />
                  </div>
                  <div className="text-[#3B82F6] font-['IBM_Plex_Mono',monospace] text-[11px] uppercase font-black tracking-[0.3em]">
                    {stats.polls < 5 ? `Booting Intelligence Engine: [${stats.polls}/5 Polls]` : 'Processing Telemetry Stream...'}
                  </div>
                  <p className="text-[9px] text-[#475569] uppercase font-bold mt-3 tracking-widest max-w-sm">
                    Aggregating historical telemetry window to establish standard baseline before inference.
                  </p>
                </div>
              )}

              {stats.polls >= 5 && (viewMode === 'default' ? (
                inferences.map((item, idx) => (
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

                      {/* COL 2: INCIDENT DESCRIPTION */}
                      <div className="col-span-3">
                        <div className="text-[8px] font-black text-[#475569] uppercase mb-1.5 tracking-[0.2em]">Live Inference</div>
                        <div className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#000]/40 border-2 inline-block leading-tight",
                          item.status === 'CRITICAL' ? "text-[#EF4444] border-[#EF4444]/20" :
                            item.status === 'WARNING' ? "text-[#F59E0B] border-[#F59E0B]/20" :
                              "text-[#3B82F6] border-[#3B82F6]/20"
                        )}>
                          {item.event}
                        </div>
                      </div>

                      {/* COL 3: SEVERITY */}
                      <div className="col-span-1 text-center">
                        <div className="text-[8px] font-black text-[#475569] uppercase mb-1.5 tracking-[0.2em] text-center">State</div>
                        <div className="flex justify-center">
                          {item.status === 'CRITICAL' ? (
                            <div className="bg-[#EF4444]/10 text-[#EF4444] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#EF4444]/20 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                              CRIT
                            </div>
                          ) : (
                            <div className="bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#F59E0B]/20 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                              WARN
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COL 4: ETA TAG */}
                      <div className="col-span-2">
                        <div className="text-[8px] font-black text-[#475569] uppercase mb-1.5 tracking-[0.2em] text-center">Lead Time</div>
                        <div className="flex justify-center">
                        {item.type === 'PREDICTION' && item.estimatedWait ? (
                          <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-xl border-2 w-fit",
                            item.estimatedWait.includes('min') && parseInt(item.estimatedWait.match(/\d+/)?.[0] || '60') <= 15
                              ? "bg-[#EF4444]/5 text-[#EF4444] border-[#EF4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-pulse"
                              : "bg-[#3B82F6]/5 text-[#3B82F6] border-[#3B82F6]/20"
                          )}>
                            <Clock className="w-3.5 h-3.5" />
                            {item.estimatedWait}
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-[#475569] italic opacity-40">-- active --</div>
                        )}
                        </div>
                      </div>

                      {/* COL 5: PREDICTED SCHEDULE */}
                      <div className="col-span-2 text-center">
                        <div className="text-[8px] font-black text-[#475569] uppercase mb-1.5 tracking-[0.2em]">Predicted Window</div>
                        <div className="flex justify-center">
                          {item.predictedTime ? (
                            <div className="text-xs font-black text-white flex items-center gap-2 font-['IBM_Plex_Mono',monospace]">
                              <div className="w-2 h-0.5 bg-[#3B82F6]" />
                              {item.predictedTime}
                            </div>
                          ) : (
                            <div className="text-xs font-black text-[#EF4444] flex items-center gap-2 font-['IBM_Plex_Mono',monospace]">
                              <div className="w-2 h-0.5 bg-[#EF4444] animate-pulse" />
                              IMMEDIATE
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COL 6: CONFIDENCE DONUT */}
                      <div className="col-span-1 flex justify-end">
                        <div className="relative w-14 h-14 flex items-center justify-center group/donut">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                            <circle
                              cx="28"
                              cy="28"
                              r="24"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 24}
                              strokeDashoffset={2 * Math.PI * 24 * (1 - item.confidence)}
                              className={cn(
                                "transition-all duration-1000 ease-out",
                                item.confidence > 0.9 ? "text-[#3DDAB4]" :
                                  item.confidence > 0.8 ? "text-[#3B82F6]" : "text-[#F59E0B]"
                              )}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-white tracking-widest">
                              {Math.round(item.confidence * 100)}
                            </span>
                            <span className="text-[7px] font-black text-[#475569] -mt-1 uppercase tracking-widest">Conf</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col gap-[1px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr_40px] gap-4 px-8 py-5 bg-[#0F172A] border-b border-white/5">
                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Device / Interface</div>
                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Pattern - Observed Events</div>
                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] text-center">Confidence</div>
                    <div className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] text-center">Severity</div>
                    <div />
                  </div>

                  {patternMatches.map((pat) => (
                    <div key={pat.id}>
                      <div 
                        className={cn(
                          "grid grid-cols-[1.5fr_3fr_1fr_1fr_40px] gap-4 px-8 py-6 bg-[#0B0F19]/40 hover:bg-[#111827] transition-all items-center group relative cursor-pointer",
                          expandedId === pat.id && "bg-[#111827] border-b border-blue-500/30"
                        )}
                        onClick={() => setExpandedId(expandedId === pat.id ? null : pat.id)}
                      >
                        <div className="absolute left-0 inset-y-0 w-1 bg-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Col 1: Identity */}
                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-10 h-10 rounded-lg border flex items-center justify-center font-black text-[10px] transition-all group-hover:scale-105",
                            pat.prefix === 'NXS' ? "bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]" :
                            pat.prefix === 'ARI' ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]" :
                            pat.prefix === 'ISR' ? "bg-[#06B6D4]/10 border-[#06B6D4]/30 text-[#06B6D4]" :
                            pat.prefix === 'JNX' ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]" :
                            "bg-white/5 border-white/10 text-[#94A3B8]"
                          )}>
                            {pat.prefix}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[15px] font-black text-white tracking-tight leading-none mb-1.5 truncate">{pat.device}</span>
                            <div className="flex items-center gap-2 font-['IBM_Plex_Mono',monospace]">
                              <span className="text-[10px] font-bold text-[#64748B]">{pat.ip}</span>
                              <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-tighter bg-[#3B82F6]/5 px-1.5 py-0.5 rounded border border-[#3B82F6]/10">{pat.interface}</span>
                              <span className="text-[10px] font-bold text-[#475569] truncate max-w-[80px]">{pat.model}</span>
                            </div>
                          </div>
                        </div>

                        {/* Col 2: Events */}
                        <div className="flex items-center gap-2 overflow-hidden">
                          {CHAIN_TEMPLATES[pat.templateId].steps.map((step, sIdx) => {
                            const stepData = pat.steps[sIdx];
                            const status = stepData?.status || 'pending';
                            if (status === 'pending') return null;
                            return (
                              <div key={sIdx} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className={cn(
                                  "px-3 py-1.5 rounded bg-black/30 border text-[9px] font-black uppercase tracking-widest leading-none flex items-center justify-center min-w-[70px]",
                                  status === 'arrived' ? "text-[#3DDAB4] border-[#3DDAB4]/20 shadow-[0_0_10px_rgba(61,218,180,0.05)]" : 
                                  "text-[#F59E0B] border-[#F59E0B]/20 border-dashed"
                                )}>
                                  {step.label.replace('_BREACH', '').replace('_EVENT', '').split('_').slice(0, 2).join(' ')}
                                </div>
                                {sIdx < pat.currentStep && (
                                  <ChevronRight className="w-3.5 h-3.5 text-[#334155] flex-shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Col 3: Confidence */}
                        <div className="flex flex-col items-center gap-2.5">
                          <div className="text-[22px] font-black text-white tabular-nums tracking-tighter leading-none">
                            {(pat.confidence * 100).toFixed(0)}<span className="text-xs ml-0.5 opacity-30">%</span>
                          </div>
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000 ease-out",
                                pat.confidence > 0.6 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                              )}
                              style={{ width: `${pat.confidence * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Col 4: Severity */}
                        <div className="flex justify-center">
                          <div className="px-5 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[10px] font-black text-[#F59E0B] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.1)] leading-none">
                            Predicting
                          </div>
                        </div>

                        {/* Col 5: Arrow */}
                        <div className="flex justify-end pr-2">
                          <ChevronRight className={cn("w-5 h-5 text-[#334155] group-hover:text-white transition-all transform", expandedId === pat.id ? "rotate-90 text-blue-500" : "group-hover:translate-x-1")} />
                        </div>
                      </div>

                      {/* INLINE HORIZONTAL EXPANDER */}
                      <div className={cn(
                        "grid transition-all duration-500 ease-in-out bg-[#0F172A]/40",
                        expandedId === pat.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}>
                        <div className="overflow-hidden">
                          <div className="p-8 px-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
                             <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                               <div className="flex items-center gap-6">
                                 <div className="flex flex-col gap-1">
                                   <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{pat.templateId} Forensic Analysis</span>
                                   <span className="text-xs font-bold text-white uppercase tracking-tight">{CHAIN_TEMPLATES[pat.templateId].meta}</span>
                                 </div>
                                 <div className="h-8 w-px bg-white/10" />
                                 <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#3DDAB4]" />
                                     <span className="text-[9px] font-black text-[#94A3B8] uppercase">Arrived</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                     <span className="text-[9px] font-black text-[#94A3B8] uppercase">Anomalous Gap</span>
                                   </div>
                                 </div>
                               </div>
                               <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest font-['IBM_Plex_Mono',monospace]">Current Sequence Confidence: <span className="text-white">{(pat.confidence * 100).toFixed(0)}%</span></span>
                               </div>
                             </div>

                             <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-6 justify-between">
                                {CHAIN_TEMPLATES[pat.templateId].steps.map((step, sIdx) => {
                                  const stepState = pat.steps[sIdx];
                                  const status = stepState?.status || 'pending';
                                  const isNext = sIdx === pat.currentStep + 1;
                                  
                                  return (
                                    <div key={sIdx} className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-[140px] flex flex-col gap-3 transition-all duration-500",
                                        status === 'pending' && !isNext ? "opacity-20" : "opacity-100"
                                      )}>
                                        <div className="flex flex-col gap-1">
                                          <div className={cn(
                                            "text-[8px] font-black uppercase tracking-widest py-0.5 rounded px-1.5 w-fit",
                                            status === 'arrived' ? "bg-[#3DDAB4]/10 text-[#3DDAB4]" :
                                            status === 'gap' ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                                            isNext ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-white/5 text-[#475569]"
                                          )}>
                                            {step.subLabel}
                                          </div>
                                        </div>

                                        <div className={cn(
                                          "p-3 rounded-xl border flex flex-col gap-2 relative transition-all duration-500 hover:scale-105",
                                          status === 'arrived' ? "bg-white/[0.04] border-[#3DDAB4]/30 shadow-[0_4px_20px_rgba(61,218,180,0.05)]" :
                                          status === 'gap' ? "bg-[#F59E0B]/5 border-[#F59E0B]/30" :
                                          isNext ? "bg-[#3B82F6]/5 border-[#3B82F6]/30 border-dashed animate-pulse" :
                                          "bg-white/[0.02] border-white/5"
                                        )}>
                                          <div className="flex items-center justify-between">
                                             <span className={cn(
                                               "text-[10px] font-black uppercase truncate",
                                               status !== 'pending' || isNext ? "text-white" : "text-[#475569]"
                                             )}>
                                               {step.label.split('_').join(' ')}
                                             </span>
                                             {status === 'arrived' && <CheckCircle2 className="w-3 h-3 text-[#3DDAB4]" />}
                                             {status === 'gap' && <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />}
                                          </div>
                                          
                                          {stepState?.timestamp && (
                                             <div className="text-[8px] font-bold text-[#475569] font-['IBM_Plex_Mono',monospace]">
                                               {stepState.timestamp.split(' ')[0]}
                                             </div>
                                          )}

                                          {status === 'arrived' && stepState?.confValue && (
                                            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mt-1">
                                              <div 
                                                className="h-full bg-[#3DDAB4] transition-all duration-1000" 
                                                style={{ width: `${stepState.confValue * 100}%` }}
                                              />
                                            </div>
                                          )}
                                        </div>

                                        <p className="text-[9px] text-[#475569] font-medium leading-tight">
                                          {isNext ? 'Predicting arrival in next 30s poll interval...' : status === 'gap' ? 'Metric missed window' : status === 'arrived' ? 'Observed in stream' : 'Awaiting baseline'}
                                        </p>
                                      </div>
                                      {sIdx < CHAIN_TEMPLATES[pat.templateId].steps.length - 1 && (
                                        <div className="pt-10">
                                          <ChevronRight className={cn(
                                            "w-4 h-4",
                                            sIdx < pat.currentStep ? "text-[#3DDAB4]" : "text-white/5"
                                          )} />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="flex justify-end pt-2 border-t border-white/5">
                              <button className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                                View Correlation Matrix <ChevronRight className="w-3 h-3" />
                               </button>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ))}
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
      `}</style>
    </MainLayout>
  );
}
