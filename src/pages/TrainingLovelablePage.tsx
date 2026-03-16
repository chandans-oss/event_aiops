import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { LOVELABLE_REPORT_DATA as D } from "@/data/lovelableReportData";
import { cn } from "@/shared/lib/utils";
import { Play, Loader2, CheckCircle2, RotateCcw } from "lucide-react";

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

export default function TrainingLovelablePage() {
  const [deviceFilter, setDeviceFilter] = useState<'both' | 'router' | 'switch'>('both');
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeTab, setActiveTab] = useState(0);
  const [itemLimit, setItemLimit] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [trainingPeriod, setTrainingPeriod] = useState("1 Month");
  const location = useLocation();

  const heights = [14, 16, 13, 18, 20, 16, 22, 24, 26, 30, 32, 28, 34, 36, 38, 15, 13];
  const maxRate = Math.max(...D.events.map(e => e.rate));

  const shouldShow = (type: 'router' | 'switch' | 'both', stepIdx: number) => {
    if (!started) return false;
    if (activeTab !== stepIdx && !isComplete) return false; 
    if (isComplete && activeTab !== stepIdx) return false; 
    if (deviceFilter === 'both') return true;
    return deviceFilter === type;
  };

  useEffect(() => {
    if (location.state?.autoStart) {
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
          setActiveTab(3); // Default to Windows tab when done
          setItemLimit(100); // Show all when done
          clearInterval(interval);
          return prev;
        }
        
        // When switching tabs, reset discovery limit
        setActiveTab(next);
        setItemLimit(0);
        
        // Start discovering items within this tab
        let count = 0;
        if (subItemTimer) clearInterval(subItemTimer);
        subItemTimer = setInterval(() => {
           count += 1;
           setItemLimit(count);
           if (count >= 20) clearInterval(subItemTimer); // Increased for windowing
        }, next === 3 ? 150 : 400); // Faster for windowing animation

        return next;
      });
    }, 4500); // Much longer tab duration (4.5s) for deliberate analysis

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
              <p className="text-[12px] text-[#94A3B8] mt-1">
                Router × 15 entities · Switch × 15 entities · 2026-03-12 17:00:23 · Duration 68.4s
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <div className="flex flex-col items-end gap-1 font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">
                <span>Mode: <strong className="text-[#3B82F6]">RETRAIN</strong></span>
                <span>Window: <strong className="text-[#3B82F6]">75 min</strong> (15 polls)</span>
                <span>Lookahead: <strong className="text-[#3B82F6]">10 min</strong> (2 polls)</span>
                <span>Features: <strong className="text-[#3B82F6]">70</strong> (10 × 7 stats)</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <select 
                    value={trainingPeriod}
                    onChange={(e) => setTrainingPeriod(e.target.value)}
                    className="bg-[#1E293B] border border-[#3B82F6]/30 rounded-[4px] px-3 py-1.5 text-[10px] font-['IBM_Plex_Mono',monospace] text-[#F8FAFC] outline-none cursor-pointer hover:border-[#3B82F6] transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%233B82F6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}
                  >
                    <option value="1 Month">History: 1 Month</option>
                    <option value="3 Months">History: 3 Months</option>
                  </select>

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
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex border border-[#334155] rounded-[6px] overflow-hidden w-fit">
              {(['both', 'router', 'switch'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDeviceFilter(type)}
                  className={cn(
                    "px-4 py-1.5 font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] transition-all",
                    deviceFilter === type ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} {type !== 'both' ? 'only' : ''}
                </button>
              ))}
            </div>
            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">Filter sections by device type</span>
          </div>
        </header>

        {/* PIPELINE TABS */}
        <nav className="bg-[#0F172A] border-b border-[#334155] px-10 py-0 flex items-center gap-0 overflow-x-auto whitespace-nowrap sticky top-0 z-50 no-scrollbar">
          {D.pipeline.map((step, i) => {
            if (i < 3 || i > 11) return null; // Unhidden index 3 (Windows)
            const isActive = i === activeTab;
            const isProcessing = i === currentStep && !isComplete;
            const isDone = i <= currentStep || isComplete;
            return (
              <button 
                key={i} 
                onClick={() => (isDone || isComplete) && setActiveTab(i)}
                disabled={!isDone && !isComplete}
                className={cn(
                  "flex items-center h-14 px-4 font-['IBM_Plex_Mono',monospace] text-[10px] transition-all duration-300 border-b-2",
                  isActive ? "bg-[#1E293B] border-[#3B82F6] text-[#F8FAFC] font-bold" : "border-transparent text-[#94A3B8] hover:bg-[#1E293B]/50",
                  !isDone && !isComplete && "opacity-40 cursor-not-allowed"
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
          <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 3) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">01</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Sliding windows</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">8,156 total · 70-dim feature vector per window</span>
            </div>
            
            <div className="grid grid-cols-[1fr_380px] gap-4 mb-4">
              {/* Window construction */}
              <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium uppercase">HOW EACH WINDOW IS BUILT</span>
                  <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#3B82F6]">extract → label → train</span>
                </div>
                <div className="p-4 relative">
                  {/* COMPREHENSIVE OVERLAP BATCH VISUALIZATION */}
                  <div className="bg-[#1a1814] p-5 rounded-[6px] space-y-2 mb-4 border border-[#2a9070]/30 shadow-inner">
                    {[
                      { id: "001", t: "1:00 —— 2:15 AM", c: "#00CFD5", o: 0 },
                      { id: "002", t: "1:05 —— 2:20 AM", c: "#10B981", o: 5 },
                      { id: "003", t: "1:10 —— 2:25 AM", c: "#8B5CF6", o: 10 },
                      { id: "004", t: "1:15 —— 2:30 AM", c: "#F59E0B", o: 15 },
                      { id: "N",   t: "T+0 —— T+75min", c: "#3B82F6", o: 25 },
                    ].map((b, i) => (
                      <div key={i} className={cn(
                        "grid grid-cols-[60px_1fr] gap-3 items-center transition-all duration-700",
                        itemLimit > (i * 3) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      )}>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#9a9488] tracking-tighter">Batch {b.id}</span>
                        <div className="relative h-6 bg-[#2a2520] rounded-[3px] border border-[#2a9070]/10 overflow-hidden">
                          <div 
                            className="absolute h-full flex items-center px-3 transition-all duration-1000 ease-out"
                            style={{ 
                              left: `${b.o}%`, 
                              width: '65%', 
                              backgroundColor: `${b.c}25`, // 15% opacity
                              borderLeft: `2px solid ${b.c}`,
                              color: b.c
                            }}
                          >
                            <span className="font-['IBM_Plex_Mono',monospace] text-[8px] font-bold tracking-widest whitespace-nowrap">
                              {b.t}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-6 font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-[1px]" /> 15 polls = 75 min (feature window)</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#2563EB] rounded-[1px]" /> 2 polls = 10 min (lookahead → label)</span>
                  </div>
                  <hr className="border-t border-[#334155] my-3.5" />
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                    Each window extracts <span className="text-[#3B82F6] font-bold">last · mean · max · min · std · slope · range</span> for all 10 metrics → <span className="text-[#F8FAFC] font-bold">70-dim vector</span>. Lookahead checks if a network event fires in the next 10 min → label <span className="px-1.5 bg-[#1E3A8A]/40 text-[#60A5FA] rounded-[2px] font-bold">1</span> or <span className="px-1.5 bg-[#1E293B] text-[#94A3B8] rounded-[2px] font-bold">0</span>.
                  </p>
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
                  {D.events.map((e, i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr_40px_40px] gap-2 items-center border-b border-[#334155] last:border-none py-1.5">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] truncate">{e.n}</span>
                      <Bar val={e.rate} max={maxRate} col={e.dev ? '#8B5CF6' : '#3B82F6'} />
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] text-right">{e.pos}</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right font-medium" style={{ color: e.rate > 5 ? '#F8FAFC' : '#94A3B8' }}>{e.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DATA BRANCHING / BATCHING DETAILS */}
            <div className="p-4 bg-[#0F172A] rounded-[8px] border border-[#334155] flex items-center justify-between animate-in fade-in zoom-in duration-700">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/30 shadow-inner">
                   <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                 </div>
                 <div>
                   <div className="font-['IBM_Plex_Mono',monospace] text-[11px] font-bold text-[#F8FAFC] tracking-tight">DATA BATCHING IN PROGRESS</div>
                   <div className="text-[10px] text-[#94A3B8]">Dividing {trainingPeriod} history into local document branches...</div>
                 </div>
               </div>
               <div className="flex gap-12 font-['IBM_Plex_Mono',monospace] text-[10px]">
                 <div><span className="text-[#94A3B8] mr-2">POLL INTERVAL:</span> <span className="text-[#F8FAFC] font-bold">1 MIN GAP</span></div>
                 <div><span className="text-[#94A3B8] mr-2">BATCH RESOLUTION:</span> <span className="text-[#F8FAFC] font-bold">75 MINUTES</span></div>
                 <div><span className="text-[#94A3B8] mr-2">DB SOURCE:</span> <span className="text-[#3B82F6] font-bold underline">MONGODB.V3</span></div>
               </div>
            </div>
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 4) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">02</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Cross-correlation</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Pearson r at best lag (±15 polls tested)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { data: D.xcorrR, device: 'router' as const, title: 'ROUTER — TOP PAIRS' },
                { data: D.xcorrS, device: 'switch' as const, title: 'SWITCH — TOP PAIRS' }
              ].map((group, idx) => (
                <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(group.device, 4) && "hidden")}>
                  <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#CBD5E1] font-medium">{group.title}</span>
                    <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">45 pairs evaluated</span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <div className="grid grid-cols-[1fr_55px_70px_80px] gap-2 pb-1 items-center">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">PAIR (A leads B)</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] text-right">r</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8]">LAG</span>
                      <span />
                    </div>
                    {group.data.slice(0, itemLimit).map((d, i) => (
                      <div key={i} className="grid grid-cols-[1fr_55px_70px_80px] gap-2 items-center border-b border-[#334155] last:border-none py-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#CBD5E1] truncate">{d.a} → {d.b}</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right" style={{ color: d.r > 0.95 ? '#60A5FA' : d.r > 0.8 ? '#F8FAFC' : '#CBD5E1' }}>{d.r.toFixed(3)}</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] whitespace-nowrap">{d.lag}</span>
                        <Bar val={d.r} max={1} col={d.r > 0.95 ? '#3B82F6' : '#2563EB'} />
                      </div>
                    ))}
                    {group.data.length > itemLimit && (
                      <div className="flex items-center gap-2 pt-2 text-[#94A3B8] font-['IBM_Plex_Mono',monospace] text-[9px] animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> DISCOVERING PAIRS...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 5) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">03</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Granger causality</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Significant pairs only · p &lt; 0.05</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { data: D.grangerR, device: 'router' as const, title: 'ROUTER' },
                { data: D.grangerS, device: 'switch' as const, title: 'SWITCH' }
              ].map((group, idx) => (
                <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(group.device, 5) && "hidden")}>
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
                    {group.data.length > itemLimit && (
                      <div className="flex items-center gap-2 pt-2 text-[#94A3B8] font-['IBM_Plex_Mono',monospace] text-[9px] animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> TESTING CAUSALITY...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 6) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">04</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Pre-event metric behavior</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Mean delta vs normal in the 75-min window before each event</span>
            </div>

            {[
              { data: D.preEvtR, device: 'router' as const, label: 'ROUTER' },
              { data: D.preEvtS, device: 'switch' as const, label: 'SWITCH' }
            ].map((group, idx) => (
              <div key={idx} className={cn("mb-3", !shouldShow(group.device, 6) && "hidden")}>
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
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 7) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">05</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Pattern clustering</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">KMeans K=4 · StandardScaled feature vectors</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { data: D.clR, device: 'router' as const, label: 'ROUTER — 4,079 windows' },
                { data: D.clS, device: 'switch' as const, label: 'SWITCH — 4,077 windows' }
              ].map((group, idx) => (
                <div key={idx} className={cn(!shouldShow(group.device, 7) && "hidden")}>
                  <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] mb-2 tracking-[0.06em]">{group.label}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {group.data.slice(0, itemLimit).map((c, i) => (
                      <div key={i} className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] p-3 border-t-[3px] animate-in fade-in zoom-in duration-300" style={{ borderTopColor: c.c }}>
                        <div className="text-[12px] font-semibold mb-0.5 text-[#F8FAFC]">{c.n}</div>
                        <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] mb-2">Cluster {i} · {(c.size / c.total * 100).toFixed(0)}% of windows</div>
                        <div className="h-1 bg-[#0F172A] rounded-[2px] mb-2 overflow-hidden">
                          <div className="h-full rounded-[2px] transition-all duration-700" style={{ width: `${(c.size / c.total * 100).toFixed(1)}%`, background: c.c }} />
                        </div>
                        <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8] mb-1.5">
                          <span>{c.size} windows</span><span>{c.noEvt} no-event</span>
                        </div>
                        <div className="text-[10px] text-[#CBD5E1]">Top: {c.evt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 8) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">06</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Random forest predictors</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">150 trees · max_depth 10 · class_weight balanced · 80/20 split</span>
            </div>

            {[
              { data: D.rfR, device: 'router' as const, title: 'ROUTER — 4 TRAINED / 2 SKIPPED' },
              { data: D.rfS, device: 'switch' as const, title: 'SWITCH — 3 TRAINED / 3 SKIPPED' }
            ].map((group, idx) => (
              <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden mb-2.5 last:mb-0", !shouldShow(group.device, 8) && "hidden")}>
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
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 9) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">07</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Event sequence mining</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Min support ≥ 2 · 3-event sequences · confidence scored</span>
            </div>
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
                  <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(group.device, 9) && "hidden")}>
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
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 10) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">08</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Anomaly detection</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Isolation Forest · contamination 5% · 200 trees · per entity</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { data: D.anomR, device: 'router' as const, title: 'ROUTER — 204/4,079 flagged (5.0%)' },
                { data: D.anomS, device: 'switch' as const, title: 'SWITCH — 204/4,077 flagged (5.0%)' }
              ].map((group, idx) => {
                const maxAnomR = Math.max(...group.data.map(d => d.rate));
                return (
                  <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden", !shouldShow(group.device, 10) && "hidden")}>
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
          </section>

          <section className={cn("mt-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow('both', 11) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">09</span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">Failure chain patterns</span>
              <span className="text-[11px] text-[#94A3B8] ml-auto">Metric ordering by earliest divergence lead time — chain terminates at event</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { data: D.chainsR, device: 'router' as const, label: 'ROUTER — 4 chains' },
                { data: D.chainsS, device: 'switch' as const, label: 'SWITCH — 4 chains' }
              ].map((group, idx) => (
                <div key={idx} className={cn(!shouldShow(group.device, 11) && "hidden")}>
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
