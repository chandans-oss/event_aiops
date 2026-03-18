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
  Cpu as CpuIcon
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
  { id: 'R-Chain-1', label: 'DEVICE_REBOOT', sequence: ['queue_depth', 'latency_ms'] },
  { id: 'R-Chain-2', label: 'HIGH_LATENCY', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct', 'reboot_delta'] },
  { id: 'R-Chain-3', label: 'HIGH_UTIL_WARNING', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
  { id: 'R-Chain-4', label: 'INTERFACE_FLAP', sequence: ['cpu_pct', 'util_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'reboot_delta'] },
  { id: 'R-Chain-5', label: 'PACKET_DROP', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
];

const SWITCH_CHAINS = [
  { id: 'S-Chain-1', label: 'HIGH_UTIL_WARNING', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
  { id: 'S-Chain-2', label: 'INTERFACE_FLAP', sequence: ['util_pct', 'cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms'] },
  { id: 'S-Chain-3', label: 'PACKET_DROP', sequence: ['cpu_pct', 'crc_errors', 'queue_depth', 'latency_ms', 'util_pct'] },
];

const EVENT_SEQUENCES = [
  "HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP",
  "HIGH_UTIL_WARNING -> PACKET_DROP -> HIGH_LATENCY",
  "HIGH_UTIL_WARNING -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_LATENCY -> INTERFACE_FLAP",
  "PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP"
];

const DEVICES = [
  { n: "router-01", i: "Gi0/1/0", t: 'ROUTER' },
  { n: "router-02", i: "Gi0/3/0", t: 'ROUTER' },
  { n: "router-03", i: "Gi0/1/0", t: 'ROUTER' },
  { n: "switch-01", i: "Eth1/1", t: 'SWITCH' },
  { n: "switch-02", i: "Eth1/2", t: 'SWITCH' },
];

interface InferenceItem {
  id: string;
  timestamp: string;
  device: string;
  interface: string;
  type: 'PREDICTION' | 'ANOMALY' | 'PATTERN_MATCH';
  event: string;
  confidence: number;
  pattern?: string;
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ANALYZED';
}

export default function LiveInferencePage() {
  const [isLive, setIsLive] = useState(true);
  const [inferences, setInferences] = useState<InferenceItem[]>([]);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SYSTEM: Inference Engine v3.0 initialized.`,
    `[${new Date().toLocaleTimeString()}] MODELS: 13 binary artifacts (.pkl) loaded into memory.`,
    `[${new Date().toLocaleTimeString()}] DATA: Kafka stream established at 1-min poll interval.`,
  ]);
  const [processingState, setProcessingState] = useState<'IDLE' | 'POLLING' | 'PROCESSING'>('IDLE');

  const [stats, setStats] = useState({
    anomalies: 0,
    predictions: 0,
    patterns: 0,
    polls: 0
  });

  const [slidingWindows, setSlidingWindows] = useState<{ id: string, startTime: string, endTime: string, color: string }[]>([]);

  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const runParallelInference = () => {
    setProcessingState('PROCESSING');
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
        if (rand > 0.6) { // Prediction: Forecasting using Device-Specific Chains
          const chains = dev.t === 'ROUTER' ? ROUTER_CHAINS : SWITCH_CHAINS;
          const chain = chains[Math.floor(Math.random() * chains.length)];
          item = {
            id: `INF-${Date.now()}-${i}`,
            timestamp: new Date().toLocaleTimeString(),
            device: dev.n,
            interface: dev.i,
            type: 'PREDICTION',
            event: chain.label,
            confidence: 0.85 + Math.random() * 0.1,
            pattern: `Chain Match ${chain.id}: ${chain.sequence.slice(0, 3).join('->')} ↑`,
            status: rand > 0.8 ? 'CRITICAL' : 'WARNING'
          };
          pCount++;
          addLog(`RF_MODEL [${dev.t}]: ${item.device} following ${chain.id} sequence -> Predicted ${item.event}`);
        } else if (rand > 0.3) { // Anomaly: Isolation Forest Discovery
          const triggerMetric = ['cpu_pct', 'util_pct', 'queue_depth', 'latency_ms', 'crc_errors'][Math.floor(Math.random() * 5)];
          item = {
            id: `INF-${Date.now()}-${i}`,
            timestamp: new Date().toLocaleTimeString(),
            device: dev.n,
            interface: dev.i,
            type: 'ANOMALY',
            event: 'ABNORMAL_BEHAVIOR',
            confidence: 0.9 + Math.random() * 0.08,
            pattern: `Trigger: ${triggerMetric} spike detected`,
            status: 'CRITICAL'
          };
          aCount++;
          addLog(`ISO_FOREST [${dev.t}]: High outlier score on ${item.device} [Primary Trigger: ${triggerMetric}]`);
        } else { // Pattern Match: Frequent Event Sequences identified in training
          const fullSeq = EVENT_SEQUENCES[Math.floor(Math.random() * EVENT_SEQUENCES.length)];
          const events = fullSeq.split(' -> ');
          item = {
            id: `INF-${Date.now()}-${i}`,
            timestamp: new Date().toLocaleTimeString(),
            device: dev.n,
            interface: dev.i,
            type: 'PATTERN_MATCH',
            event: events[events.length - 1], // Single Event for Heading
            confidence: 0.95 + Math.random() * 0.04,
            pattern: fullSeq, // Full Sequence for Sub-text
            status: 'ANALYZED'
          };
          patCount++;
          addLog(`SEQ_MINING [${dev.t}]: ${item.device} confirms frequent sequence [${fullSeq}]`);
        }

        // Push all inferences to the grid (Predictions, Anomalies, and Analyzed Patterns)
        newInferences.push(item);
      }

      // Add fresh 75-min window (Sliding Rectangle logic)
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

      setStats(prev => ({
        ...prev,
        predictions: prev.predictions + pCount,
        anomalies: prev.anomalies + aCount,
        patterns: prev.patterns + patCount
      }));
      setInferences(prev => [...newInferences, ...prev].slice(0, 20));
      setProcessingState('IDLE');
    }, 1500);
  };

  // 1-Minute Interval Polling
  useEffect(() => {
    if (!isLive) return;

    // Initial run
    setStats(prev => ({ ...prev, polls: prev.polls + 1 }));
    runParallelInference();

    const pollInterval = setInterval(() => {
      addLog("ENGINE: 1-minute interval reached. Polling fresh telemetry window...");
      setStats(prev => ({ ...prev, polls: prev.polls + 1 }));
      setProcessingState('POLLING');
      setTimeout(runParallelInference, 1000);
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [isLive]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-['Sora',sans-serif] text-[13px] overflow-x-hidden selection:bg-[#3B82F6]/30">

        {/* TOP STATUS BAR */}
        <div className="bg-[#0F172A] border-b border-white/5 px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isLive ? "bg-[#3DDAB4] animate-pulse" : "bg-[#64748B]")} />
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] uppercase font-bold tracking-widest text-[#3DDAB4]">
                {isLive ? 'Live Simulation Active' : 'Simulation Paused'}
              </span>
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
              onClick={() => setIsLive(!isLive)}
              className={cn(
                "px-4 py-1.5 rounded-md font-['IBM_Plex_Mono',monospace] text-[9px] font-bold uppercase tracking-wider transition-all border",
                isLive
                  ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 hover:bg-[#3B82F6]/20"
                  : "bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10"
              )}
            >
              {isLive ? 'PAUSE ENGINE' : 'RESUME ENGINE'}
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          <div className="space-y-8">
            {/* INFERENCE GRID HEADER */}

            {/* INFERENCE GRID HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center border border-[#3B82F6]/20">
                  <CpuIcon className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Live Inference Stream</h1>
                  <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest font-['IBM_Plex_Mono',monospace]">Parallel Processing Pipeline / V3</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-white/5 min-w-[100px]">
                  <div className="text-[9px] text-[#94A3B8] uppercase font-bold mb-1 tracking-tighter">ANOMALIES</div>
                  <div className="text-lg font-black tracking-tighter tabular-nums text-[#EF4444]">{stats.anomalies}</div>
                </div>
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-white/5 min-w-[100px]">
                  <div className="text-[9px] text-[#94A3B8] uppercase font-bold mb-1 tracking-tighter">PREDICTIONS</div>
                  <div className="text-lg font-black tracking-tighter tabular-nums text-[#3B82F6]">{stats.predictions}</div>
                </div>
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-white/5 min-w-[100px]">
                  <div className="text-[9px] text-[#94A3B8] uppercase font-bold mb-1 tracking-tighter">PATTERN MATCH</div>
                  <div className="text-lg font-black tracking-tighter tabular-nums text-[#3DDAB4]">{stats.patterns}</div>
                </div>
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-white/5 min-w-[100px]">
                  <div className="text-[9px] text-[#94A3B8] uppercase font-bold mb-1 tracking-tighter">POLLS</div>
                  <div className="text-lg font-black tracking-tighter tabular-nums text-white">{stats.polls}</div>
                </div>
              </div>
            </div>

            {/* LIVE FEED GRID LIST */}
            <div className="grid grid-cols-1 gap-4">
              {processingState === 'PROCESSING' && inferences.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
                  <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <RefreshCw className="w-6 h-6 text-[#3B82F6] animate-spin" />
                  </div>
                  <div className="text-[#3B82F6] font-['IBM_Plex_Mono',monospace] text-[10px] uppercase font-black">Parallel Model Execution...</div>
                </div>
              )}

              {inferences.map((item, idx) => (
                <Card
                  key={item.id}
                  className={cn(
                    "bg-[#1e293b]/30 border border-white/5 rounded-xl p-5 hover:bg-[#1e293b]/50 transition-all duration-300 group overflow-hidden relative",
                    idx === 0 && "border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                  )}
                >
                  {idx === 0 && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6]" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        item.type === 'PREDICTION' ? "bg-[#3B82F6]/10" :
                          item.type === 'ANOMALY' ? "bg-[#EF4444]/10" : "bg-[#3DDAB4]/10"
                      )}>
                        {item.type === 'PREDICTION' && <Box className="w-5 h-5 text-[#3B82F6]" />}
                        {item.type === 'ANOMALY' && <AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
                        {item.type === 'PATTERN_MATCH' && <CheckCircle2 className="w-5 h-5 text-[#6366F1]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[14px] font-bold text-white tracking-tight">{item.device}</span>
                          <span className="text-[9px] font-black text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">
                            {item.interface}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.timestamp}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="uppercase font-bold tracking-widest">{item.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className={cn(
                          "text-[12px] font-black uppercase tracking-widest",
                          item.status === 'CRITICAL' ? "text-[#EF4444]" :
                            item.status === 'WARNING' ? "text-[#F59E0B]" :
                              "text-[#6366F1]"
                        )}>
                          {item.event}
                        </div>
                        {item.type === 'PATTERN_MATCH' ? (
                          <div className="text-[10px] text-[#94A3B8] font-medium italic mt-0.5">
                            Matches: {item.pattern} (Recognized)
                          </div>
                        ) : item.pattern && (
                          <div className="text-[10px] text-[#94A3B8] font-medium italic mt-0.5">
                            Matches: {item.pattern}
                          </div>
                        )}
                      </div>

                      <div className="w-32 flex flex-col items-end gap-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[14px] font-black tracking-tighter text-white">{(item.confidence * 100).toFixed(1)}</span>
                          <span className="text-[9px] text-[#94A3B8] font-bold">%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full animate-in slide-in-from-left duration-1000",
                              item.confidence > 0.9 && item.type !== 'PATTERN_MATCH' ? "bg-[#3DDAB4]" :
                                item.type === 'PATTERN_MATCH' ? "bg-[#6366F1]" :
                                  item.confidence > 0.8 ? "bg-[#3B82F6]" : "bg-[#F59E0B]"
                            )}
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* SLIDING WINDOW RECTANGLES - NOW IN SIDEBAR */}
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
                          backgroundColor: `${win.color}35`, // Increased opacity
                          borderColor: win.color,
                          color: win.color,
                          opacity: 0.6 + (idx * 0.1) // Higher base visibility
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

              <ScrollArea className="h-[600px] bg-[#0c0c0c]/80 backdrop-blur-md">
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
            <Card className="bg-[#1E293B]/20 border border-white/5 rounded-2xl p-5 space-y-4 max-h-[400px] overflow-auto no-scrollbar">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] flex items-center gap-2 sticky top-0 bg-[#141b2b] pb-2">
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
