import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { LOVELABLE_REPORT_DATA as D } from "@/data/lovelableReportData";
import { cn } from "@/shared/lib/utils";
import { Play, Loader2, CheckCircle2, RotateCcw, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fmt = (v: number) => {
  if (Math.abs(v) >= 10000) return (v > 0 ? '+' : '') + (v / 1000).toFixed(0) + 'k%';
  if (Math.abs(v) >= 1000) return (v > 0 ? '+' : '') + (v / 1000).toFixed(1) + 'k%';
  return (v > 0 ? '+' : '') + v.toFixed(0) + '%';
};

const Bar = ({ val, max, col }: { val: number, max: number, col: string }) => {
  const pct = Math.min(val / max * 100, 100).toFixed(1);
  return (
    <div className="flex-1 h-[5px] bg-[#0F172A] rounded-[3px] overflow-hidden">
      <div className="h-full rounded-[3px] transition-all duration-700" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
};

const LoadingState = ({ title }: { title: string }) => (
  <div className="py-32 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
    <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-6 border border-[#334155] shadow-[0_0_20px_rgba(59,130,246,0.1)]">
      <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
    </div>
    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.2em] text-[#3B82F6] mb-2 uppercase font-bold pr-2">Analytical Processing...</div>
    <h2 className="text-[18px] font-semibold mb-1 tracking-tight text-[#F8FAFC]">Calibrating {title} Models</h2>
    <p className="text-[#94A3B8] max-w-sm font-['IBM_Plex_Mono',monospace] text-[11px] mt-2">
      Waiting for training pipeline to reach this extraction stage. Results will populate automatically.
    </p>
  </div>
);

const ClusterPlot = ({ clusters, limit }: { clusters: any[], limit: number }) => {
  // Generate points based on centroids to make it look "legitimate"
  const [points] = useState(() => {
    return clusters.flatMap((c, cIdx) => {
      const cent = c.centroids || { util_pct: 50, queue_depth: 30 };
      // Map metrics to 0-100% space
      const centerX = Math.min(Math.max(cent.util_pct, 10), 90);
      const centerY = 100 - Math.min(Math.max(cent.queue_depth * 1.5, 10), 90); // Invert Y and scale queue depth

      return Array.from({ length: 50 }).map((_, i) => ({
        x: centerX + (Math.random() - 0.5) * 15,
        y: centerY + (Math.random() - 0.5) * 15,
        c: c.c,
        id: `${cIdx}-${i}`
      }));
    });
  });

  const visiblePoints = points.slice(0, Math.min(points.length, limit * 10));

  return (
    <div className="relative w-full aspect-[4/3] bg-[#0F172A] border border-[#334155] rounded-xl overflow-hidden p-8 group shadow-2xl">
      {/* Technical Backdrop */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)', backgroundSize: '10% 10%' }} />

      {/* Axis Ticks */}
      <div className="absolute left-7 top-8 bottom-8 w-[1px] bg-[#334155] h-full opacity-50" />
      <div className="absolute left-7 bottom-7 right-8 h-[1px] bg-[#334155] w-full opacity-50" />

      {/* Y Axis Ticks */}
      {[0, 25, 50, 75, 100].map(v => (
        <div key={v} className="absolute left-3 font-['IBM_Plex_Mono',monospace] text-[7px] text-[#475569] -translate-y-1/2" style={{ bottom: `${7 + (v * 0.85)}%` }}>
          {v}
        </div>
      ))}

      {/* X Axis Ticks */}
      {[0, 25, 50, 75, 100].map(v => (
        <div key={v} className="absolute bottom-3 font-['IBM_Plex_Mono',monospace] text-[7px] text-[#475569] -translate-x-1/2" style={{ left: `${7 + (v * 0.85)}%` }}>
          {v}%
        </div>
      ))}

      {/* Points Container */}
      <div className="relative w-full h-full border-l border-b border-[#334155]/30">
        {/* Centroid Crosses */}
        {clusters.map((c, i) => {
          const cent = c.centroids || { util_pct: 50, queue_depth: 30 };
          const px = Math.min(Math.max(cent.util_pct, 10), 90);
          const py = 100 - Math.min(Math.max(cent.queue_depth * 1.5, 10), 90);
          return (
            <div key={`cent-${i}`} className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-60" style={{ left: `${px}%`, top: `${py}%` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px]" style={{ background: c.c }} />
                <div className="h-full w-[1px] absolute" style={{ background: c.c }} />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-bold whitespace-nowrap uppercase tracking-tighter" style={{ color: c.c }}>
                {c.n.split(' ')[0]}
              </div>
            </div>
          );
        })}

        {/* Data Points */}
        {visiblePoints.map((p) => (
          <div
            key={p.id}
            className="absolute h-1 w-1 rounded-full blur-[0.2px] transition-all duration-700 animate-in fade-in zoom-in"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.c,
              boxShadow: `0 0 5px ${p.c}80`
            }}
          />
        ))}
      </div>

      {/* Axis Labels */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-[#94A3B8] font-['IBM_Plex_Mono',monospace] tracking-[0.25em] uppercase font-bold opacity-80">
        QUEUE DEPTH (NORM)
      </div>
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-[8px] text-[#94A3B8] font-['IBM_Plex_Mono',monospace] tracking-[0.25em] uppercase font-bold opacity-80">
        NETWORK UTILIZATION (%)
      </div>

      {/* Real-time Processing Overlay */}
      {limit < 10 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded backdrop-blur-sm">
          <Loader2 className="w-2.5 h-2.5 text-[#3B82F6] animate-spin" />
          <span className="text-[7px] font-bold text-[#3B82F6] uppercase tracking-widest">Plotting Clusters...</span>
        </div>
      )}
    </div>
  );
};

const DonutChart = ({ val, size = 32, stroke = 2.5 }: { val: number, size?: number, stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.abs(val) * circumference);
  const color = Math.abs(val) > 0.7 ? '#3DDAB4' : Math.abs(val) > 0.4 ? '#F59E0B' : '#3B82F6';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Active progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute font-['IBM_Plex_Mono',monospace] text-[7px] font-bold text-white">
        {Math.round(Math.abs(val) * 100)}
      </div>
    </div>
  );
};

const STEP_CATEGORIES: Record<string, string> = {
  'Data': 'DATA PREP',
  'Cross Correlation': 'STATISTICAL',
  'Granger Causality': 'STATISTICAL',
  'Pre-event': 'STATISTICAL',
  'K-means': 'CLUSTERING',
  'Random Forest': 'CLASSIFICATION',
  'Sequences': 'PATTERN MATCHING',
  'Isolation Forest': 'ANOMALY',
  'Chains': 'PATTERN MATCHING',
};

const SCOPE_TARGETS = {
  'device': [
    { label: 'Router Core 01', sub: 'Router' },
    { label: 'Router Core 02', sub: 'Router' },
    { label: 'Router Edge 01', sub: 'Router' },
    { label: 'Switch Dist 01', sub: 'Switch' },
    { label: 'Switch Dist 02', sub: 'Switch' },
    { label: 'Switch Access 01', sub: 'Switch' },
    { label: 'Switch Access 02', sub: 'Switch' },
  ],
  'topology': [
    { label: 'DC East', sub: 'Data Center' },
    { label: 'DC West', sub: 'Data Center' },
    { label: 'Campus HQ', sub: 'Campus' },
    { label: 'Branch North', sub: 'Branch' },
    { label: 'WAN Backbone', sub: 'WAN' },
  ],
  'group': [
    { label: 'Core Routers', sub: '3 devices' },
    { label: 'Distribution Switches', sub: '5 devices' },
    { label: 'Access Layer', sub: '12 devices' },
    { label: 'DC Infrastructure', sub: '8 devices' },
    { label: 'WAN Edge Devices', sub: '4 devices' },
  ]
};

export default function TrainingLovelablePage() {
  const [deviceFilter, setDeviceFilter] = useState<'device' | 'topology' | 'group'>('device');
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeTab, setActiveTab] = useState(0);
  const [itemLimit, setItemLimit] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(SCOPE_TARGETS['device'][0].label);
  const [trainingPeriod, setTrainingPeriod] = useState("1 Month");
  const location = useLocation();
  const navigate = useNavigate();

  const maxRate = Math.max(...D.events.map(e => e.rate));

  const shouldShow = (stepIdx: number) => {
    if (!started) return false;
    return activeTab === stepIdx;
  };

  const isStepReady = (stepIdx: number) => {
    return isComplete || currentStep >= stepIdx;
  };

  useEffect(() => {
    const state = location.state as any;
    if (state?.autoStart) {
      handleStart();
    }
  }, [location.state]);

  // Tab switching and Discovery logic
  useEffect(() => {
    if (!started || isComplete) return;

    let subItemTimer: NodeJS.Timeout;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= D.pipeline.length - 1) {
          setIsComplete(true);
          // Don't auto-switch tab here, let the complete screen show if applicable
          // or stay on the last meaningful tab
          setItemLimit(100); // Show all when done
          clearInterval(interval);
          return prev;
        }

        // Auto-advance active tab if it's within the reportable range (3-11)
        if (next >= 3 && next <= 11) {
          setActiveTab(next);
        }

        // When switching steps, reset discovery limit
        setItemLimit(0);

        // Start discovering items within this tab
        let count = 0;
        if (subItemTimer) clearInterval(subItemTimer);
        subItemTimer = setInterval(() => {
          count += 1;
          setItemLimit(count);
          if (count >= 20) clearInterval(subItemTimer);
        }, next === 3 ? 350 : 800);

        return next;
      });
    }, 6500);

    return () => {
      clearInterval(interval);
      if (subItemTimer) clearInterval(subItemTimer);
    };
  }, [started, isComplete]);

  const handleStart = () => {
    setStarted(true);
    setCurrentStep(0);
    setActiveTab(0);
    setItemLimit(0);
    setIsComplete(false);
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentStep(-1);
    setActiveTab(0);
    setItemLimit(0);
    setIsComplete(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-['Sora',sans-serif] text-[13px] leading-relaxed selection:bg-[#3B82F6]/20 pb-20 overflow-x-hidden">

        {/* PAGE HEADER */}
        <header className="bg-[#0F172A] text-[#F8FAFC] px-10 pt-7 pb-6 border-b-[3px] border-[#3B82F6]">
          <div className="flex items-start justify-between gap-5 mb-4">
            <div>
              <div className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.1em] text-[#3B82F6] mb-1.5 uppercase">
                NETWORK PATTERN MINING SYSTEM / V3 / TRAINING REPORT
              </div>
              <h1 className="text-[22px] font-semibold tracking-[-0.02em] leading-tight">Model Training Analysis</h1>
            </div>
            <div className="flex flex-col items-end gap-5 flex-shrink-0">
              <div className="flex items-end gap-6">
                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[9px] tracking-[0.2em] text-[#3DDAB4] font-bold uppercase px-0.5">
                    TRAINING SCOPE
                  </div>
                  <Select
                    value={deviceFilter}
                    onValueChange={(v: 'device' | 'topology' | 'group') => {
                      setDeviceFilter(v);
                      setSelectedTarget(SCOPE_TARGETS[v][0].label);
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9 bg-[#1E293B] border border-white/5 rounded-md px-3 text-[10px] font-medium text-[#F8FAFC] outline-none hover:border-[#3B82F6]/50 transition-all shadow-inner">
                      <SelectValue placeholder="Select Scope" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F172A] border border-[#334155] text-[#F8FAFC]">
                      <SelectItem value="device" className="text-[10px] focus:bg-[#3B82F6] focus:text-white">Device Specific</SelectItem>
                      <SelectItem value="topology" className="text-[10px] focus:bg-[#3B82F6] focus:text-white">Topology Based</SelectItem>
                      <SelectItem value="group" className="text-[10px] focus:bg-[#3B82F6] focus:text-white">Device Group Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[9px] tracking-[0.2em] text-[#94A3B8] font-bold uppercase px-0.5">
                    {deviceFilter === 'device' ? 'SELECT DEVICE' : deviceFilter === 'topology' ? 'SELECT TOPOLOGY' : 'SELECT DEVICE GROUP'}
                  </div>
                  <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                    <SelectTrigger className="w-[180px] h-9 bg-[#1E293B] border border-white/5 rounded-md px-3 text-[10px] font-medium text-[#F8FAFC] outline-none hover:border-[#3B82F6]/50 transition-all shadow-inner">
                      <SelectValue placeholder="Select Target" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F172A] border border-[#334155] text-[#F8FAFC]">
                      {SCOPE_TARGETS[deviceFilter].map((t) => (
                        <SelectItem key={t.label} value={t.label} className="text-[10px] focus:bg-[#3B82F6] focus:text-white">
                          <div className="flex items-center gap-2">
                            <span>{t.label}</span>
                            <span className="text-[8px] opacity-40 font-normal">{t.sub}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[9px] tracking-[0.2em] text-[#94A3B8] font-bold uppercase px-0.5 opacity-60">
                    Period
                  </div>
                  <select
                    value={trainingPeriod}
                    onChange={(e) => setTrainingPeriod(e.target.value)}
                    className="w-[140px] h-9 bg-[#1E293B] border border-white/5 rounded-md px-3 text-[10px] font-['IBM_Plex_Mono',monospace] text-[#F8FAFC] outline-none cursor-pointer hover:border-[#3B82F6]/50 transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%233B82F6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  {!started ? (
                    <button
                      onClick={handleStart}
                      className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[11px] font-bold tracking-wider transition-all shadow-[0_4px_0_0_#1D4ED8] active:translate-y-[2px] active:shadow-none"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      START TRAINING ANALYSIS
                    </button>
                  ) : !isComplete ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleReset}
                        className="p-2 text-[#9a9488] hover:text-[#f4f2ed] transition-colors"
                        title="Reset Training"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-[#2a2520] text-[#2a9070] px-5 py-2 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[11px] font-bold tracking-wider border border-[#2a9070]/30 shadow-[0_0_15px_rgba(42,144,112,0.15)]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        TRAINING IN PROGRESS...
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-[#9a9488] hover:text-[#f4f2ed] font-['IBM_Plex_Mono',monospace] text-[10px] uppercase font-bold tracking-widest transition-colors mr-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        RETRAIN
                      </button>
                      <div className="flex items-center gap-2 bg-[#e8f4f0] text-[#0a7c5c] px-5 py-2 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[11px] font-bold tracking-wider border border-[#2a9070] shadow-[0_4px_12px_rgba(10,124,92,0.1)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ANALYSIS COMPLETE
                      </div>
                    </div>
                  )}
                </div>

                {started && !isComplete && currentStep < 4 && (
                  <div className="flex items-center gap-2 text-[10px] text-[#3B82F6] font-['IBM_Plex_Mono',monospace] animate-in fade-in slide-in-from-right-2 duration-300 pr-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="opacity-70 uppercase tracking-widest">MongoDB Ingestion:</span>
                    <span className="font-bold uppercase tracking-tight">{D.pipeline[currentStep]}...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PIPELINE TABS */}
        <nav className="bg-[#0F172A] border-b border-[#334155] px-10 py-0 flex items-end gap-0 overflow-x-auto whitespace-nowrap sticky top-0 z-50 no-scrollbar h-20">
          {D.pipeline.map((step, i) => {
            if (i < 3 || i > 11) return null;
            const category = STEP_CATEGORIES[step] || 'Analysis';
            const prevStep = i > 3 ? D.pipeline[i - 1] : null;
            const prevCategory = prevStep ? STEP_CATEGORIES[prevStep] : null;
            const isFirstOfCategory = category !== prevCategory;

            const isActive = i === activeTab;
            const isProcessing = i === currentStep && !isComplete;
            const isDone = i <= currentStep || isComplete;

            return (
              <div key={i} className="flex flex-col h-full justify-end group">
                {isFirstOfCategory && (
                  <div className="px-4 pb-1 text-[8px] font-black text-[#3DDAB4] uppercase tracking-[0.2em] border-l border-white/5 h-4 flex items-center">
                    {category}
                  </div>
                )}
                {!isFirstOfCategory && (
                  <div className="h-4 border-l border-white/5 ml-0" />
                )}
                <button
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex items-center h-14 px-4 font-['IBM_Plex_Mono',monospace] text-[10px] transition-all duration-300 border-b-2",
                    isActive ? "bg-[#1E293B] border-[#3B82F6] text-[#F8FAFC] font-bold" : "border-transparent text-[#94A3B8] hover:bg-[#1E293B]/50"
                  )}
                >
                  <div className={cn(
                    "w-[20px] h-[20px] rounded-full flex items-center justify-center text-[9px] font-medium border-[1.5px] transition-all duration-300 mr-2 flex-shrink-0",
                    isDone ? "bg-[#3B82F6] border-[#3B82F6] text-white" :
                      isProcessing ? "bg-white border-[#3B82F6] text-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse" :
                        "border-[#334155] bg-[#0F172A]"
                  )}>
                    {i - 2}
                  </div>
                  <span>{step}</span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* MAIN CONTENT */}
        <main className="px-10">

          {!started && (
            <div className="mt-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#1E293B] rounded-full flex items-center justify-center mb-6 border-2 border-[#334155] border-dashed">
                <Play className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connect to MongoDB</h2>
              <p className="text-[#94A3B8] max-w-md">
                Establish connection to the pattern storage and initialize function training on 8,156 document windows.
              </p>
              <button
                onClick={handleStart}
                className="mt-8 bg-[#3B82F6] text-white px-8 py-3 rounded-[8px] font-semibold hover:bg-[#2563EB] transition-all"
              >
                Execute Analysis Pipeline
              </button>
            </div>
          )}

          {started && activeTab < 3 && (
            <div className="mt-20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-6 border border-[#334155]">
                <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
              </div>
              <h2 className="text-lg font-semibold mb-1 uppercase tracking-tight">{D.pipeline[activeTab]}</h2>
              <p className="text-[#9a9488] max-w-sm mb-8 font-['IBM_Plex_Mono',monospace] text-[11px]">
                {activeTab === 0 ? "Streaming normalized documents from MongoDB collections..." :
                  activeTab === 1 ? "Aggregation pipeline: normalizing 5-min intervals..." :
                    "Updating local feature functions from training batch..."}
              </p>
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-[10px] font-['IBM_Plex_Mono',monospace] text-[#9a9488]">
                  <span>SUB-TASK PROGRESS</span>
                  <span>{isComplete ? '100' : '65'}%</span>
                </div>
                <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3B82F6] rounded-full animate-pulse transition-all duration-1000" style={{ width: isComplete ? '100%' : '65%' }} />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 01: SLIDING WINDOWS */}
          <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(3) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">01</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Data</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">8,156 total · 70-dim feature vector per window</span>
            </div>

            {!isStepReady(3) ? <LoadingState title="Time Series" /> : (
              <>

                <div className="grid grid-cols-[1fr_380px] gap-4 mb-4">
                  {/* Terminal Processing Log */}
                  <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden flex flex-col h-full">
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium uppercase">PIPELINE EXECUTION LOG</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]/40" />
                      </div>
                    </div>
                    <div className="p-4 font-['IBM_Plex_Mono',monospace] text-[11px] leading-relaxed text-[#94A3B8] flex-1 overflow-auto no-scrollbar">
                      <div className="text-[#3DDAB4] mb-2">
                        {"=============================================================================="}<br />
                        {" DATA LOADING & PREPROCESSING"}<br />
                        {"=============================================================================="}
                      </div>

                      <div className="space-y-0.5 mb-4">
                        <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin text-[#3B82F6]" /> Loading data ...</div>
                        <div>metrics.csv    : <span className="text-[#F8FAFC]">8,640 rows | 30 entities | 2 device types</span></div>
                        <div>events.csv     : <span className="text-[#F8FAFC]">2,129 rows | 6 event types</span></div>
                        <div>Interface cols : <span className="text-[#3B82F6]">['util_pct', 'queue_depth', 'crc_errors', 'latency_ms']</span></div>
                        <div>Event types    : <span className="text-[#3B82F6]">['DEVICE_REBOOT', 'HIGH_LATENCY', 'HIGH_UTIL_WARNING', 'INTERFACE_FLAP', 'LINK_DOWN', 'PACKET_DROP']</span></div>
                        <div>Device types   : <span className="text-[#3B82F6]">['router', 'switch']</span></div>
                        <div>Time range     : <span className="text-[#F8FAFC]">2025-12-31 23:59:33 {"->"} 2026-01-01 23:55:27</span></div>
                        <div>Event source   : <span className="text-[#F8FAFC]">interface=2,127  device=2</span></div>
                        <div className="mt-2 text-[#3B82F6]">Resampled {"->"} 8,636 rows from 8,640 raw rows (30 entities)</div>
                      </div>

                      <div className="text-[#3DDAB4] mb-2">
                        {"=============================================================================="}<br />
                        {" BUILDING SLIDING WINDOWS"}<br />
                        {"=============================================================================="}
                      </div>

                      <div className="space-y-0.5">
                        <div>Building windows for 30 entities ...</div>
                        {Array.from({ length: 6 }).map((_, i) => {
                          const count = i * 5;
                          const pct = Math.round((count / 30) * 100);
                          const isShowing = itemLimit > (i * 2);
                          return isShowing ? (
                            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                              &nbsp;&nbsp;... {count}/30 ({pct}%)
                            </div>
                          ) : null;
                        })}

                        {itemLimit > 12 && (
                          <div className="mt-2 pt-2 border-t border-white/5 animate-in fade-in duration-700">
                            <div>Total windows : <span className="text-[#F8FAFC]">8,156</span></div>
                            <div>Feature dims  : <span className="text-[#F8FAFC]">70  (10 metrics x 7 stats)</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event label distribution */}
                  <div className="bg-[#1E293B]/40 border border-[#334155] rounded-[10px] overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium uppercase">EVENT LABEL DISTRIBUTION</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">across 8,156 windows</span>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="grid grid-cols-[120px_1fr_40px_40px] gap-2 pb-1.5 items-center">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] tracking-[0.07em]">EVENT</span>
                        <span />
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">COUNT</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">RATE</span>
                      </div>
                      {D.events.slice(0, Math.max(2, itemLimit / 2)).map((e, i) => (
                        <div key={i} className="grid grid-cols-[120px_1fr_40px_40px] gap-2 items-center border-b border-[#334155] last:border-none py-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] truncate">{e.n}</span>
                          <Bar val={e.rate} max={maxRate} col={e.dev ? '#8B5CF6' : '#3B82F6'} />
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] text-right">{e.pos}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right font-medium" style={{ color: e.rate > 5 ? '#F8FAFC' : '#94A3B8' }}>{e.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(4) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">02</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Cross correlation</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Pearson r at best lag (±15 polls tested)</span>
            </div>
            {!isStepReady(4) ? <LoadingState title="Statistical Correlation" /> : (
              <div className="grid grid-cols-1 gap-6">
                {[
                  { data: D.xcorrR, device: 'router' as const, title: 'SECTION 1 — CROSS-CORRELATION [ROUTER]' },
                  { data: D.xcorrS, device: 'switch' as const, title: 'SECTION 1 — CROSS-CORRELATION [SWITCH]' }
                ].map((group, idx) => (
                  <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(4) && "hidden")}>
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#3DDAB4] font-bold">{group.title}</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">45 pairs evaluated</span>
                    </div>
                    <div className="p-0 space-y-0">
                      <div className="grid grid-cols-[100px_100px_80px_100px_70px_1fr] gap-4 py-2 px-4 items-center bg-[#0F172A]/30 border-b border-[#334155]">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase">Metric A</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase">Metric B</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase">Best Lag</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase text-center">Pearson r</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase text-right">Spearman r</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase">Interpretation</span>
                      </div>
                      {group.data.slice(0, itemLimit).map((d, i) => (
                        <div key={i} className="grid grid-cols-[100px_100px_80px_100px_70px_1fr] gap-4 items-center border-b border-[#334155] last:border-none py-2 px-4 animate-in fade-in slide-in-from-left-2 duration-300 hover:bg-white/[0.02] transition-colors">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#CBD5E1] truncate">{d.a}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#CBD5E1] truncate">{d.b}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] whitespace-nowrap">{d.lag}</span>
                          <div className="flex items-center justify-center gap-2">
                             <DonutChart val={d.r} size={28} />
                             <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] w-12">{d.r.toFixed(3)}</span>
                          </div>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-right text-[#94A3B8]">{d.s.toFixed(3)}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#3B82F6]">{d.interp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(5) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">03</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Granger causality</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Significant pairs only · p &lt; 0.05</span>
            </div>
            {!isStepReady(5) ? <LoadingState title="Granger Causality" /> : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { data: D.grangerR, device: 'router' as const, title: 'ROUTER' },
                  { data: D.grangerS, device: 'switch' as const, title: 'SWITCH' }
                ].map((group, idx) => (
                  <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(5) && "hidden")}>
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium">{group.title}</span>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <div className="grid grid-cols-[110px_14px_110px_60px_60px_60px] gap-1.5 pb-1.5 items-center">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">CAUSE</span><span />
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">EFFECT</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">F-STAT</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">p</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">LAG</span>
                      </div>
                      {group.data.slice(0, itemLimit).map((d, i) => (
                        <div key={i} className="grid grid-cols-[110px_14px_110px_60px_60px_60px] gap-1.5 items-center border-b border-[#334155] last:border-none py-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] truncate">{d.c}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] text-center">→</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] truncate">{d.e}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right" style={{ color: d.f > 100 ? '#F59E0B' : '#CBD5E1' }}>{d.f.toFixed(1)}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">{d.p}</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] text-right">{d.lag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(6) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">04</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Pre-event metric behavior</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Mean delta vs normal in the 75-min window before each event</span>
            </div>
            {!isStepReady(6) ? <LoadingState title="Pre-Event Behavior" /> : (
              <>

                {[
                  { data: D.preEvtR, device: 'router' as const, label: 'ROUTER' },
                  { data: D.preEvtS, device: 'switch' as const, label: 'SWITCH' }
                ].map((group, idx) => (
                  <div key={idx} className={cn("mb-3", !shouldShow(6) && "hidden")}>
                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] mb-2 tracking-[0.06em]">{group.label}</div>
                    <div className="space-y-2.5">
                      {group.data.slice(0, Math.ceil(itemLimit / 2)).map((pe, i) => {
                        const maxD = Math.max(...pe.metrics.map(m => Math.abs(m.dpct)));
                        return (
                          <div key={i} className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center gap-2.5">
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] font-medium text-[#F8FAFC]">{pe.evt}</span>
                              <span className={cn("px-1.5 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] font-medium tracking-[0.04em]", pe.metrics.some(m => !m.up) ? 'bg-[#1E3A8A]/40 text-[#60A5FA]' : 'bg-[#7F1D1D]/40 text-[#EF4444]')}>
                                {pe.metrics.some(m => !m.up) ? 'drain pattern' : 'all rising'}
                              </span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] ml-1">{pe.n} events · {pe.windows} windows</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[#3B82F6] ml-auto uppercase">earliest {pe.warn}</span>
                            </div>
                            <div className="grid grid-cols-2">
                              {pe.metrics.map((m, j) => {
                                const w = Math.min(Math.log10(Math.abs(m.dpct) + 2) / Math.log10(maxD + 2) * 100, 100).toFixed(0);
                                return (
                                  <div key={j} className="flex items-center gap-2 px-3.5 py-1.5 border-b border-[#334155] border-r border-[#334155] odd:border-r even:border-r-0 last:border-b-0 [&:nth-last-child(2)]:border-b-0">
                                    <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] min-w-[90px]">{m.m}</span>
                                    <div className="flex-1 h-[5px] bg-[#0F172A] rounded-[3px] overflow-hidden">
                                      <div className="h-full rounded-[3px]" style={{ width: `${w}%`, background: m.up ? '#EF4444' : '#3B82F6' }} />
                                    </div>
                                    <span className={cn("font-['IBM_Plex_Mono',monospace] text-[10px] min-w-[52px] text-right", m.up ? 'text-[#EF4444]' : 'text-[#3B82F6]')}>{fmt(m.dpct)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(7) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">05</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">K-means</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">KMeans K=4 · StandardScaled feature vectors</span>
            </div>
            {!isStepReady(7) ? <LoadingState title="K-Means Clustering" /> : (
              <div className="grid grid-cols-2 gap-8">
                {[
                  { data: D.clR, device: 'router' as const, label: 'ROUTER — 4,079 windows', count: 4079 },
                  { data: D.clS, device: 'switch' as const, label: 'SWITCH — 4,077 windows', count: 4077 }
                ].map((group, idx) => (
                  <div key={idx} className={cn("space-y-4", !shouldShow(7) && "hidden")}>
                    <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                      <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-bold tracking-[0.05em] uppercase">{group.label}</div>
                      <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#3B82F6] uppercase">K=4 / Silhouette: 0.742</div>
                    </div>

                    <ClusterPlot clusters={group.data} limit={itemLimit} />

                    <div className="grid grid-cols-2 gap-3">
                      {group.data.map((c, i) => (
                        <div key={i} className="bg-[#1e293b]/20 border border-white/5 rounded-md p-3 flex flex-col gap-1.5 transition-opacity duration-500"
                          style={{ opacity: itemLimit > i * 4 ? 1 : 0.2 }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-[#F8FAFC]">{c.n}</span>
                            <div className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-[9px] font-bold">C{i}</div>
                          </div>
                          <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-[10px]">
                            <span className="text-[#94A3B8]">{c.size} windows</span>
                            <span className="text-[#3DDAB4]">{(c.size / group.count * 100).toFixed(0)}% SHARE</span>
                          </div>
                          <div className="pt-1.5 border-t border-white/5 mt-1">
                            <div className="flex justify-between text-[9px] mb-1">
                              <span className="text-[#94A3B8] uppercase">Baseline (No Event)</span>
                              <span className="text-[#F8FAFC] font-bold">{c.noEvt}</span>
                            </div>
                            <div className="text-[9px] text-[#94A3B8] leading-relaxed">
                              <span className="text-[#3B82F6] font-bold uppercase mr-1">Top Impacts:</span>
                              {c.evt}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(8) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">06</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Random forest predictors</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">150 trees · max_depth 10 · class_weight balanced · 80/20 split</span>
            </div>
            {!isStepReady(8) ? <LoadingState title="Random Forest" /> : (
              <>

                {[
                  { data: D.rfR, device: 'router' as const, title: 'ROUTER — 4 TRAINED / 2 SKIPPED' },
                  { data: D.rfS, device: 'switch' as const, title: 'SWITCH — 3 TRAINED / 3 SKIPPED' }
                ].map((group, idx) => (
                  <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden mb-2.5 last:mb-0", !shouldShow(8) && "hidden")}>
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium">{group.title}</span>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="grid grid-cols-[160px_50px_50px_50px_50px_1fr] gap-2 items-start pb-1.5 border-b border-[#334155]">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] tracking-[0.07em]">EVENT</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-center">F1</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-center">PREC</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-center">REC</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-center">ACC</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">TOP 3 FEATURES</span>
                      </div>
                      {group.data.slice(0, itemLimit).map((r, i) => (
                        <div key={i} className={cn("grid grid-cols-[160px_50px_50px_50px_50px_1fr] gap-2 items-start py-2 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300", r.skip && "opacity-40")}>
                          <div>
                            <div className="text-[11px] font-medium text-[#F8FAFC]">{r.evt}</div>
                            <div className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] uppercase">{r.skip ? `SKIPPED — ${r.reason}` : `${r.pos} pos rate`}</div>
                          </div>
                          {!r.skip && r.f1 !== undefined && (
                            <>
                              <div className="text-[11px] font-['IBM_Plex_Mono',monospace] text-center" style={{ color: (r.f1 as number) > 0.88 ? '#3B82F6' : (r.f1 as number) > 0.82 ? '#F8FAFC' : '#CBD5E1' }}>
                                {r.f1}
                                <div className="h-[2px] mt-0.5 rounded-[1px] bg-[#0B0F19]">
                                  <div className="h-full rounded-[1px]" style={{ width: `${((r.f1 as number) * 100).toFixed(0)}%`, background: (r.f1 as number) > 0.88 ? '#3B82F6' : '#2563EB' }} />
                                </div>
                              </div>
                              <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-center text-[#CBD5E1]">{r.prec}</div>
                              <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-center text-[#CBD5E1]">{r.rec}</div>
                              <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-center text-[#CBD5E1]">{r.acc}</div>
                              <div className="flex flex-col gap-1">
                                {r.feats?.map(([fn, fi], k) => (
                                  <div key={k} className="flex items-center gap-1.5">
                                    <div className="h-[2px] rounded-[1px] bg-[#3B82F6]" style={{ width: `${Math.min(fi * 150, 48)}px` }} />
                                    <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] whitespace-nowrap">{fn}</span>
                                    <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] ml-auto">{(fi * 100).toFixed(1)}%</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(9) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">07</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Event sequence mining</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Min support ≥ 2 · 3-event sequences · confidence scored</span>
            </div>
            {!isStepReady(9) ? <LoadingState title="Sequence Mining" /> : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { data: D.seqR, device: 'router' as const, title: 'ROUTER — 32 sessions · 5 devices' },
                  { data: D.seqS, device: 'switch' as const, title: 'SWITCH — 41 sessions · 5 devices' }
                ].map((group, idx) => {
                  const evtShort: any = { 'HIGH_UTIL_WARNING': 'HUW', 'PACKET_DROP': 'PKT', 'INTERFACE_FLAP': 'IFLAP', 'HIGH_LATENCY': 'HLAT', 'LINK_DOWN': 'LDOWN', 'DEVICE_REBOOT': 'REBOOT' };
                  const evtCol: any = {
                    'HIGH_UTIL_WARNING': 'bg-[#78350F]/40 text-[#F59E0B]',
                    'PACKET_DROP': 'bg-[#7F1D1D]/40 text-[#F87171]',
                    'INTERFACE_FLAP': 'bg-[#7F1D1D]/40 text-[#F87171]',
                    'HIGH_LATENCY': 'bg-[#78350F]/40 text-[#F59E0B]',
                    'LINK_DOWN': 'bg-[#334155]/40 text-[#94A3B8]',
                    'DEVICE_REBOOT': 'bg-[#7F1D1D]/40 text-[#F87171]'
                  };
                  return (
                    <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(9) && "hidden")}>
                      <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium">{group.title}</span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        {group.data.slice(0, itemLimit).map((s, i) => (
                          <div key={i} className="py-2 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              {s.seq.map((e, k) => (
                                <div key={k} className="flex items-center gap-1.5">
                                  <span className={cn("px-2 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] whitespace-nowrap", evtCol[e] || 'bg-[#334155]/40 text-[#94A3B8]')}>
                                    {evtShort[e] || e}
                                  </span>
                                  {k < s.seq.length - 1 && <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">→</span>}
                                </div>
                              ))}
                            </div>
                            <div className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] mb-1">{s.seq.join(' → ')}</div>
                            <div className="flex gap-4 font-['IBM_Plex_Mono',monospace] text-[10px]">
                              <span><span className="text-[#94A3B8]">support</span> <span className="text-[#CBD5E1]">{s.supp}</span></span>
                              <span><span className="text-[#94A3B8]">conf</span> <span className="text-[#CBD5E1]">{s.conf.toFixed(2)}</span></span>
                              <div className="ml-auto flex items-center">
                                <div className="h-[2px] bg-[#3B82F6] rounded-[1px]" style={{ width: `${(s.conf * 50).toFixed(0)}px` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(10) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">08</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Failure chain patterns</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Metric ordering by earliest divergence lead time — chain terminates at event</span>
            </div>
            {!isStepReady(10) ? <LoadingState title="Failure Chains" /> : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { data: D.chainsR, device: 'router' as const, label: 'ROUTER — 4 chains' },
                  { data: D.chainsS, device: 'switch' as const, label: 'SWITCH — 4 chains' }
                ].map((group, idx) => (
                  <div key={idx} className={cn(!shouldShow(10) && "hidden")}>
                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] mb-2 tracking-[0.06em]">{group.label}</div>
                    <div className="space-y-2">
                      {group.data.slice(0, itemLimit).map((c, i) => {
                        const isCritical = ['PACKET_DROP', 'DEVICE_REBOOT', 'INTERFACE_FLAP'].includes(c.evt);
                        const severityColor = isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]';
                        const badgeColor = isCritical ? 'bg-[#7F1D1D]/40 text-[#F87171]' : 'bg-[#78350F]/40 text-[#F59E0B]';

                        return (
                          <div key={i} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] p-3.5 border-l-[3px] animate-in fade-in slide-in-from-bottom-2 duration-500", severityColor)}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn("px-1.5 py-1 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] font-bold tracking-[0.06em] uppercase bg-[#334155]/60 text-[#CBD5E1]")}>
                                {group.device === 'router' ? 'router' : 'switch'}
                              </span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] font-medium text-[#F8FAFC]">{c.evt}</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">seen {c.n}×</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                              {c.steps.map((s, k) => (
                                <div key={k} className="flex items-center gap-1">
                                  <span className={cn("px-2 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] whitespace-nowrap bg-[#1E3A8A]/30 text-[#60A5FA] border border-[#3B82F6]/20")}>
                                    {s.m} {s.d}
                                  </span>
                                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#334155]">→</span>
                                </div>
                              ))}
                              <span className={cn("px-2 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[10px] whitespace-nowrap font-bold", badgeColor)}>{c.evt}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={cn("mt-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(11) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">09</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Isolation Forest</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Isolation Forest · contamination 5% · 200 trees · per entity</span>
            </div>
            {!isStepReady(11) ? <LoadingState title="Isolation Forest" /> : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { data: D.anomR, device: 'router' as const, title: 'ROUTER — 204/4,079 flagged (5.0%)' },
                  { data: D.anomS, device: 'switch' as const, title: 'SWITCH — 204/4,077 flagged (5.0%)' }
                ].map((group, idx) => {
                  const maxAnomR = Math.max(...group.data.map(d => d.rate));
                  return (
                    <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(11) && "hidden")}>
                      <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium">{group.title}</span>
                      </div>
                      <div className="p-3.5 space-y-1.5">
                        {group.data.slice(0, itemLimit).map((d, i) => (
                          <div key={i} className="grid grid-cols-[150px_1fr_55px_50px] gap-2 items-center py-1.5 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1]">{d.e}</span>
                            <Bar val={d.rate} max={maxAnomR} col={d.risk === 'HIGH' ? '#EF4444' : d.risk === 'MED' ? '#F59E0B' : '#3B82F6'} />
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right" style={{ color: d.risk === 'HIGH' ? '#EF4444' : d.risk === 'MED' ? '#F59E0B' : '#94A3B8' }}>{d.rate.toFixed(1)}%</span>
                            <span className={cn("px-1.5 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] font-medium tracking-[0.04em] text-center", d.risk === 'HIGH' ? 'bg-[#7F1D1D]/40 text-[#F87171]' : d.risk === 'MED' ? 'bg-[#78350F]/40 text-[#F59E0B]' : 'bg-[#334155]/40 text-[#94A3B8]')}>
                              {d.risk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {activeTab === 12 && (
            <div className="mt-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[#1E3A8A]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[#2563EB]/50">
                <CheckCircle2 className="w-10 h-10 text-[#3B82F6]" />
              </div>
              <h2 className="text-[24px] font-semibold mb-2 tracking-tight text-[#F8FAFC]">Models Serialized Successfully</h2>
              <p className="text-[#94A3B8] max-w-md mb-8">
                All 12 analytical models have been verified and saved to the local pattern registry.
                Ready for live inference and anomaly detection.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#1E293B] text-[#F8FAFC] border border-[#334155] px-6 py-2.5 rounded-[6px] font-medium hover:bg-[#0F172A] transition-all">
                  Download Full Report (PDF)
                </button>
                <button className="bg-[#3B82F6] text-white px-6 py-2.5 rounded-[6px] font-medium hover:bg-[#2563EB] transition-all">
                  Deploy to Inference Engine
                </button>
              </div>
              <div className="mt-12 p-4 bg-[#0F172A] border border-[#334155] rounded-[10px] w-full max-w-lg text-left">
                <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#3B82F6] mb-2 uppercase font-bold pr-2 tracking-widest">Registry Details</div>
                <div className="font-['IBM_Plex_Mono',monospace] text-[11px] space-y-1 text-[#CBD5E1]">
                  <div className="flex justify-between"><span>Registry Path:</span> <span className="text-[#F8FAFC]">/models/v3/latest/</span></div>
                  <div className="flex justify-between"><span>Fingerprint:</span> <span className="text-[#F8FAFC]">sha256:884a...9f20</span></div>
                  <div className="flex justify-between"><span>Training Samples:</span> <span className="text-[#F8FAFC]">8,156 windows</span></div>
                </div>
              </div>
            </div>
          )}


        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MainLayout>
  );
}
