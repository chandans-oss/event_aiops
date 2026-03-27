import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Play,
  RotateCcw,
  Settings,
  Database,
  BrainCircuit,
  Activity,
  Clock,
  CheckCircle2, 
  ShieldCheck,
  Cpu,
  Terminal,
  ChevronRight,
  TrendingUp,
  LineChart,
  Target,
  Layers,
  Filter,
  Zap,
  Boxes,
  Workflow,
  GitBranch,
  Monitor,
  Search,
  Heart,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const MODELS = [
  { id: "cross_correlation", name: "CrossCorrelation", type: "Statistical", status: "READY", desc: "Discovering temporal lags and relationships between metrics" },
  { id: "granger_causality", name: "GrangerCausality", type: "Statistical", status: "READY", desc: "Determining directional influence and predictive causality" },
  { id: "pre_event_behavior", name: "PreEventMetricBehaviour", type: "Diagnostic", status: "READY", desc: "Analyzing metric shifts prior to critical events" },
  { id: "pattern_clustering", name: "PatternClustering", type: "Unsupervised", status: "READY", desc: "Grouping similar device behaviors and signatures" },
  { id: "random_forest", name: "RandomForestEventPredictor", type: "Ensemble", status: "READY", desc: "High-accuracy event forecasting and feature weights" },
  { id: "sequence_mining", name: "EventSequenceMining", type: "Mining", status: "READY", desc: "Extracting sequential dependencies and patterns" },
  { id: "anomaly_detection", name: "AnomalyDetection", type: "Unsupervised", status: "READY", desc: "Identifying outliers and localized behavior spikes" },
  { id: "co_occurrence_matrix", name: "EventCoOccurrenceMatrix", type: "Statistical", status: "READY", desc: "Analyzing synergy between concurrent network events" },
  { id: "failure_chain", name: "FailureChainPatterns", type: "Neural", status: "LATEST", desc: "Mapping causal chains from metric drift to root failure" },
];

const REPORTS = {
  default: `
==============================================================================
 NETWORK PATTERN MINING SYSTEM  v3.4.2
==============================================================================

  Run started      : 2026-04-12 17:00:23
  Metrics          : ./data/metrics.csv
  Events           : ./data/events.csv
  Device metrics   : ./data/device_metrics.csv
  Device map       : ./data/interface_device_map.csv
  Mode             : RETRAIN (overwriting existing models)

  Run config:
    Poll interval  : 5 min
    Window size    : 15 polls = 75 min
    Lookahead      : 2 polls = 10 min
    Clusters (K)   : 4
    RF trees       : 150
    Min seq support: 2
    Min seq lift   : 1.5

==============================================================================
 DATA LOADING & PREPROCESSING
==============================================================================

  Loading data ...
  metrics.csv    : 8,640 rows | 30 entities | 2 device types
  events.csv     : 2,129 rows | 6 event types
  Interface cols : ['util_pct', 'queue_depth', 'crc_errors', 'latency_ms']
  Event types    : ['DEVICE_REBOOT', 'HIGH_LATENCY', 'HIGH_UTIL_WARNING', 'INTERFACE_FLAP', 'LINK_DOWN', 'PACKET_DROP']
  Device types   : ['router', 'switch']
  Time range     : 2025-12-31 23:59:33 -> 2026-01-01 23:55:27
  Event source   : interface=2,127  device=2

  Resampled -> 8,636 rows from 8,640 raw rows (30 entities)

==============================================================================
 BUILDING SLIDING WINDOWS
==============================================================================

  Building windows for 30 entities ...
    ... 0/30 (0%)
    ... 10/30 (33%)
    ... 20/30 (67%)
    ... 30/30 (100%)
                                                  
  Total windows : 8,156

==============================================================================
 SECTION 1 — CROSS-CORRELATION [ROUTER]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.7516      0.7159  queue_depth LEADS util_pct by 5 min
  util_pct               crc_errors                   -2 polls     0.7381      0.7158  crc_errors LEADS util_pct by 10 min
  util_pct               latency_ms                   -1 polls     0.7530      0.7235  latency_ms LEADS util_pct by 5 min
  util_pct               cpu_pct                      +0 polls     0.7830      0.7541  simultaneous

==============================================================================
 SECTION 2 — GRANGER CAUSALITY [ROUTER]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +2 polls   63.183     0.000000  *** SIGNIFICANT ***
  util_pct               crc_errors                   +3 polls   34.934     0.000000  *** SIGNIFICANT ***
  queue_depth            crc_errors                   +1 polls  289.313     0.000000  *** SIGNIFICANT ***

==============================================================================
 SECTION 3 — PRE-EVENT METRIC BEHAVIOUR
==============================================================================

  Event Type            Metric                  Trend (T-15)    Max Drift   Confidence
  ------------------------------------------------------------------------------
  HIGH_LATENCY          cpu_pct                 Steep Rise      +28.4%      0.94
  PACKET_DROP           queue_depth             Oscillating     +122.1%     0.89
  INTERFACE_FLAP        temp_c                  Stable          +1.2%       0.99

==============================================================================
 SECTION 4 — PATTERN CLUSTERING (K=4)
==============================================================================

  Cluster ID    Size    Density    Dominant Metric    Behavior Label
  ------------------------------------------------------------------------------
  CL-01         1,240   0.82       util_pct           High Load / Normal
  CL-02         452     0.65       crc_errors         Congestive Loss
  CL-03         98      0.44       latency_ms         Bufferbloat Signature
  CL-04         6,366   0.94       cpu_pct            Baseline / Idle
  
==============================================================================
 SECTION 5 — RANDOM FOREST EVENT PREDICTOR [ROUTER]
==============================================================================

  Event                         Pos Rate  Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  HIGH_LATENCY                      8.4%     0.962      0.732   0.870  0.795  OK
  HIGH_UTIL_WARNING                17.6%     0.958      0.824   0.972  0.892  OK
  PACKET_DROP                      16.1%     0.968      0.862   0.954  0.906  OK

==============================================================================
 SECTION 6 — EVENT SEQUENCE MINING
==============================================================================

  Rule ID    Sequence                                          Support   Lift   Conf
  ------------------------------------------------------------------------------
  SEQ-01     [HIGH_UTIL] -> [HIGH_LATENCY] -> [PACKET_DROP]    0.12      2.41   0.88
  SEQ-02     [INTERFACE_FLAP] -> [LINK_DOWN]                   0.08      4.12   0.92

==============================================================================
 SECTION 7 — ANOMALY DETECTION (ISOLATION FOREST)
==============================================================================

  Anomalies Detected: 142 (1.7% of total windows)
  Top Feature Impact: ['util_pct', 'cpu_pct', 'queue_depth']
  Avg Anomaly Score: 0.76

==============================================================================
 SECTION 8 — EVENT CO-OCCURANCE MATRIX
==============================================================================

  Event A               Event B               Count    Jaccard Coeff
  ------------------------------------------------------------------------------
  HIGH_LATENCY          PACKET_DROP           1,102    0.68
  HIGH_UTIL             CPU_SPIKE             844      0.72
  LINK_DOWN             DEVICE_REBOOT         14       0.12

==============================================================================
 SECTION 10 — FAILURE CHAIN PATTERNS [ROUTER]
==============================================================================

  Chain 1  [HIGH_LATENCY]
  cpu_pct ↑  →  crc_errors ↑  →  queue_depth ↑  →  latency_ms ↑  →  util_pct ↑  →  HIGH_LATENCY

  Chain 2  [PACKET_DROP]
  cpu_pct ↑  →  crc_errors ↑  →  queue_depth ↑  →  latency_ms ↑  →  util_pct ↑  →  PACKET_DROP

==============================================================================
 FINAL SUMMARY — ALL ALGORITHMS
==============================================================================
  Models saved to : /opt/pattern_mining_code/models/
  Duration: 68.4s
  Status: DONE
==============================================================================
  `
};

const BATCHES = [
  { id: 'BATCH-01', start: '10:00', end: '11:15', color: 'bg-primary/20', text: 'text-primary', offset: '0%' },
  { id: 'BATCH-02', start: '10:01', end: '11:16', color: 'bg-amber-500/20', text: 'text-amber-500', offset: '5%' },
  { id: 'BATCH-03', start: '10:02', end: '11:17', color: 'bg-emerald-500/20', text: 'text-emerald-500', offset: '10%' },
  { id: 'BATCH-04', start: '10:03', end: '11:18', color: 'bg-indigo-500/20', text: 'text-indigo-500', offset: '15%' },
  { id: 'BATCH-05', start: '10:04', end: '11:19', color: 'bg-rose-500/20', text: 'text-rose-500', offset: '20%' },
];

const METRICS_LIST = [
  { name: "util_pct", category: "Interface", unit: "%" },
  { name: "queue_depth", category: "Interface", unit: "pkts" },
  { name: "crc_errors", category: "Interface", unit: "cnt" },
  { name: "latency_ms", category: "Interface", unit: "ms" },
  { name: "cpu_pct", category: "Device", unit: "%" },
  { name: "mem_util_pct", category: "Device", unit: "%" },
  { name: "temp_c", category: "Device", unit: "°C" },
  { name: "fan_speed", category: "Device", unit: "rpm" },
];

export default function TrainingPage() {
  const navigate = useNavigate();
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ text: string, timestamp: string, traceId: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [timeline, setTimeline] = useState("3m");
  const logEndRef = useRef<HTMLDivElement>(null);

  const [modelStatuses, setModelStatuses] = useState<Record<string, 'pending' | 'active' | 'done'>>({});

  const startTraining = () => {
    navigate("/pattern-prediction/training/analysis/cross_correlation", { state: { autoStart: true } });
  };

  useEffect(() => {
    if (logs.length > 0) {
      const scrollTimeout = setTimeout(() => {
        logEndRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 50);
      return () => clearTimeout(scrollTimeout);
    }
  }, [logs]);

  return (
    <MainLayout>
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                <BrainCircuit className="h-5 w-5 text-orange-500" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">ModelTraining</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timeline Dropdown */}
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Timeline</span>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger className="w-[160px] bg-card/50 border-white/10 font-bold h-10 text-[10px] uppercase">
                  <SelectValue placeholder="SelectDataRange" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="1m" className="text-[10px] uppercase font-bold">Last 1 Month</SelectItem>
                  <SelectItem value="3m" className="text-[10px] uppercase font-bold">Last 3 Months</SelectItem>
                  <SelectItem value="6m" className="text-[10px] uppercase font-bold">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => navigate("/pattern-prediction/training-lovelable", { state: { autoStart: true } })}
              className="bg-[#2a9070] hover:bg-[#237a5f] text-white font-black uppercase tracking-widest h-10 px-6 text-[11px] rounded-xl shadow-lg shadow-[#2a9070]/20 mt-5 border-b-4 border-[#1a6a52]"
            >
              <Heart className="mr-2 h-3.5 w-3.5 fill-current" />
              LovelableV3
            </Button>

            <Button
              onClick={startTraining}
              disabled={isTraining}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest h-10 px-6 text-[11px] rounded-xl shadow-lg shadow-orange-500/20 mt-5"
            >
              {isTraining ? (
                <>
                  <Activity className="mr-2 h-3.5 w-3.5 animate-spin" />
                  TRAINING...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                  StartTraining
                </>
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 hover:bg-white/5 transition-all hover:border-orange-500/30 mt-5">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[360px] bg-[#080808] border-l border-white/5 p-0 sm:max-w-[360px] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent">
                    <SheetHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg">
                          <Settings className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="text-left">
                          <SheetTitle className="text-lg font-black uppercase italic tracking-tighter text-foreground">
                            EngineConfig
                          </SheetTitle>
                          <SheetDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            v3.4.2 Optimized Runtime
                          </SheetDescription>
                        </div>
                      </div>
                    </SheetHeader>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8">
                      {[
                        {
                          title: "TemporalParameters",
                          icon: Clock,
                          items: [
                            { label: "Poll interval", value: "5 min", desc: "Collection frequency" },
                            { label: "Window size", value: "75 min", desc: "Historical look-back" },
                            { label: "Lookahead", value: "10 min", desc: "Prediction horizon" },
                          ]
                        },
                        {
                          title: "AlgorithmicLogic",
                          icon: Layers,
                          items: [
                            { label: "Clusters (K)", value: "4", desc: "Pattern count" },
                            { label: "RF trees", value: "150", desc: "Ensemble depth" },
                          ]
                        },
                        {
                          title: "MiningThresholds",
                          icon: Filter,
                          items: [
                            { label: "Min support", value: "2", desc: "Min occurrence" },
                            { label: "Min lift", value: "1.5", desc: "Significance factor" },
                          ]
                        }
                      ].map((section, idx) => (
                        <div key={idx} className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-1.5">
                            <section.icon className="h-3 w-3 text-orange-500" />
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">{section.title}</h4>
                          </div>

                          <div className="grid gap-4 px-1">
                            {section.items.map((config, i) => (
                              <div key={i} className="group space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{config.label}</span>
                                  <span className="text-[10px] font-black text-foreground tabular-nums bg-white/5 px-2 py-0.5 rounded border border-white/5">{config.value}</span>
                                </div>
                                <p className="text-[8px] text-muted-foreground/30 font-medium italic leading-none">{config.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

          {/* Column 1: Live Telemetry Ingestion (Left) */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5" />
                TelemetryIngestion
              </h2>
              <Badge variant="outline" className="text-[8px] font-bold border-orange-500/20 text-orange-500 animate-pulse uppercase tracking-widest h-5">
                PollingActive
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 italic">SlidingWindowBatches75mContext</h3>
              <Card className="p-5 bg-card/30 border-white/5 space-y-4 h-fit overflow-hidden relative">
                <div className="space-y-3">
                  {BATCHES.map((batch, i) => (
                    <div key={batch.id} className="flex flex-col gap-1 first:mt-0 mt-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-widest">{batch.id}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[8px] font-black", batch.text)}>{batch.start}</span>
                          <span className="text-[8px] font-black text-muted-foreground/40">/</span>
                          <span className={cn("text-[8px] font-black", batch.text)}>{batch.end}</span>
                        </div>
                      </div>
                      <div className="h-8 bg-white/5 rounded-md relative flex items-center border border-white/10 overflow-hidden p-1 shadow-inner">
                        <div
                          className={cn("h-full rounded-[4px] flex items-center border-l-2 transition-all duration-1000", batch.color.replace('20', '40'), batch.id === 'BATCH-01' ? 'border-primary' : 'border-white/20')}
                          style={{
                            marginLeft: batch.offset,
                            width: "75%",
                          }}
                        >
                          <div className="absolute inset-x-0 h-[1px] bg-white/10 opacity-30" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40 pt-4 mt-2 border-t border-white/5">
                  <div className="h-1 w-1 bg-primary rounded-full animate-bounce" />
                  <div className="text-[7px] font-black uppercase tracking-widest">New batches append here</div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 italic">MonitoredMetricStreams</h3>
              <div className="grid grid-cols-2 gap-2 px-1">
                {METRICS_LIST.map((metric, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-2 rounded-lg flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-foreground/80 tracking-tight">{metric.name}</span>
                      <span className="text-[7px] font-bold text-muted-foreground/40 uppercase">{metric.category}</span>
                    </div>
                    <Badge variant="outline" className="text-[7px] h-3.5 px-1.5 border-white/5 opacity-50 font-mono">{metric.unit}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Algorithm Pipeline (Right) */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Workflow className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">AlgorithmPipeline</h2>
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-300px)] min-h-[500px] pr-4">
              <div className="space-y-3 pb-8">
                {MODELS.map((model) => (
                  <Card
                    key={model.id}
                    onClick={() => navigate(`/pattern-prediction/training/analysis/${model.id}`)}
                    className={cn(
                      "p-5 cursor-pointer transition-all duration-300 border-white/5 group relative overflow-hidden",
                      modelStatuses[model.id] === 'active' ? "bg-primary/10 border-primary/40 shadow-2xl shadow-primary/10" : "bg-card/20 hover:bg-white/5 hover:border-white/10"
                    )}
                  >
                    {modelStatuses[model.id] === 'active' && (
                        <div className="absolute top-0 right-0 p-2">
                             <Activity className="h-3 w-3 text-primary animate-pulse" />
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center border transition-colors",
                            modelStatuses[model.id] === 'active' ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/5 group-hover:bg-primary/20"
                          )}>
                            {modelStatuses[model.id] === 'done' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                                <GitBranch className={cn("h-3.5 w-3.5", modelStatuses[model.id] === 'active' ? "text-primary animate-spin" : "text-muted-foreground")} />
                            )}
                          </div>
                          <div>
                            <span className={cn(
                                "text-[11px] font-black uppercase tracking-tighter transition-colors",
                                modelStatuses[model.id] === 'active' ? "text-primary" : "text-foreground"
                            )}>
                              {model.name}
                            </span>
                          </div>
                        </div>
                        {modelStatuses[model.id] === 'active' ? (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[7px] h-3.5 px-2 uppercase font-black tracking-widest animate-pulse">Training...</Badge>
                        ) : (
                            <Badge variant="outline" className="text-[7px] h-3.5 px-2 uppercase border-white/10 font-black tracking-widest">{model.type}</Badge>
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 leading-relaxed font-medium">
                        {model.desc}
                      </p>
                    </div>
                  </Card>
                ))}

                <div className="flex flex-col items-center gap-3 py-6 opacity-30">
                  <div className="h-8 w-[1px] bg-gradient-to-b from-primary to-transparent" />
                  <div className="h-2 w-2 rounded-full border border-primary" />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-x-6">
            {[
              { label: "CUDA V12.1", color: "bg-emerald-500", icon: Cpu },
              { label: "Temporal Buffer", color: "bg-blue-500", icon: Clock },
              { label: "Auto-Commit", color: "bg-purple-500", icon: ShieldCheck },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors">
                <item.icon className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className={cn("h-1.5 w-1.5 rounded-sm", item.color)} />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">{item.label}</span>
              </div>
            ))}
          </div>

          <Button variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 h-9 px-5 opacity-50 hover:opacity-100 transition-all">
            <RotateCcw className="mr-2 h-3 w-3" />
            ResetEngineCache
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
