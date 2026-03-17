import { useState, useEffect } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { LOVELABLE_REPORT_DATA as D } from "@/data/lovelableReportData";
import { cn } from "@/shared/lib/utils";
import { 
  Play, 
  Loader2, 
  CheckCircle2, 
  RotateCcw, 
  Activity, 
  Cpu, 
  Zap,
  Terminal,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Settings2,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

/**
 * Custom components for the Algo Training simulation
 */
const Bar = ({ val, max, col }: { val: number, max: number, col: string }) => {
  const pct = Math.min(val / max * 100, 100).toFixed(1);
  return (
    <div className="flex-1 h-[5px] bg-[#0F172A] rounded-[3px] overflow-hidden">
      <div className="h-full rounded-[3px] transition-all duration-700" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
};

export default function AlgoTrainingPage() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeTab, setActiveTab] = useState(0);
  const [itemLimit, setItemLimit] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  // Tab switching and Discovery logic
  useEffect(() => {
    if (!started || isComplete) return;

    let subItemTimer: NodeJS.Timeout;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= 12) { // Total pipeline steps
          setIsComplete(true);
          setActiveTab(3); // Default to Windows tab when done
          setItemLimit(100); 
          clearInterval(interval);
          return prev;
        }
        
        setActiveTab(next);
        setItemLimit(0);
        setGlobalProgress((next / 12) * 100);
        
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
    setGlobalProgress(5);
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentStep(-1);
    setActiveTab(0);
    setItemLimit(0);
    setIsComplete(false);
    setGlobalProgress(0);
  };

  const shouldShow = (type: 'router' | 'switch' | 'both', stepIdx: number) => {
    if (!started) return false;
    if (activeTab !== stepIdx && !isComplete) return false; 
    if (isComplete && activeTab !== stepIdx) return false; 
    return true;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-['Sora',sans-serif] text-[13px] leading-relaxed selection:bg-[#3B82F6]/20 pb-20 overflow-x-hidden">
        
        {/* Cinematic Header */}
        <header className="bg-[#0F172A] px-10 pt-10 pb-10 border-b border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/30">
                      <Cpu className="w-6 h-6 text-[#3B82F6]" />
                   </div>
                   <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Live Training Pipeline</h1>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[9px] font-bold border-[#3B82F6]/20 text-[#3B82F6] uppercase tracking-widest">Active Run / ENG-09</Badge>
                        <span className="text-[#94A3B8] text-[10px] font-['IBM_Plex_Mono',monospace]">30 Entities · 150 Target Features</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Central Global Progress (Mobile Hidden) */}
              <div className="hidden lg:flex items-center gap-6 bg-black/40 px-8 py-4 rounded-2xl border border-white/5 shadow-2xl">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-1">Global Health</span>
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                       <span className="text-lg font-black text-white">99.2<span className="text-sm opacity-40">%</span></span>
                    </div>
                 </div>
                 <div className="w-[1px] h-10 bg-white/10" />
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-1">Pipeline Status</span>
                    <div className="flex items-center gap-2">
                       {isComplete ? (
                         <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                       ) : started ? (
                         <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />
                       ) : (
                         <Zap className="w-4 h-4 text-[#3B82F6]" />
                       )}
                       <span className="text-sm font-bold text-white uppercase tracking-tighter">
                          {isComplete ? 'Execution Finished' : started ? 'Processing Batch' : 'Standby'}
                       </span>
                    </div>
                 </div>
              </div>

              {!started ? (
                <Button onClick={handleStart} className="px-10 py-7 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-black italic uppercase tracking-tighter text-lg shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all hover:scale-[1.03] active:scale-[0.97] gap-3">
                  <Play className="w-6 h-6 fill-current" />
                  Run Sequence
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="border-[#334155] text-[#94A3B8] hover:bg-white/5 gap-2">
                  <RotateCcw className="w-4 h-4" />
                  TERMINATE
                </Button>
              )}
           </div>

           {/* Global Pipeline Loading Bar */}
           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
              <div className="h-full bg-[#3B82F6] shadow-[0_0_15px_#3B82F6] transition-all duration-1000" style={{ width: `${globalProgress}%` }} />
           </div>
        </header>

        {/* Content Area */}
        <div className="max-w-[1440px] mx-auto px-10 py-10">
           {!started && (
              <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in duration-1000">
                 <div className="relative mb-10">
                    <div className="w-32 h-32 bg-[#3B82F6]/5 rounded-full flex items-center justify-center border border-[#3B82F6]/20 animate-pulse">
                       <Zap className="w-12 h-12 text-[#3B82F6]" />
                    </div>
                    <div className="absolute inset-0 border-2 border-[#3B82F6]/10 rounded-full animate-ping" />
                 </div>
                 <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic mb-4">Awaiting Signal</h2>
                 <p className="text-[#94A3B8] text-center max-w-md">Initialize the training sequence to process historical telemetry through the causality engine.</p>
              </div>
           )}

           {started && (
             <div className="animate-in fade-in duration-700">
               {/* Tab Navigation */}
               <nav className="flex gap-1 bg-[#111827] p-1.5 rounded-xl border border-white/5 mb-10 overflow-x-auto">
                 {[
                   { id: 3, label: 'Windows', icon: Zap },
                   { id: 4, label: 'Correlations', icon: Activity },
                   { id: 5, label: 'Granger Causality', icon: BrainCircuit },
                   { id: 6, label: 'Anomaly Search', icon: TrendingUp },
                   { id: 7, label: 'Clustering', icon: Settings2 },
                   { id: 8, label: 'RF Importance', icon: Terminal },
                   { id: 9, label: 'Sequences', icon: ChevronRight },
                   { id: 10, label: 'System Faults', icon: Zap },
                   { id: 11, label: 'Failure Chains', icon: Zap }
                 ].map((t, idx) => {
                   const isActive = activeTab === t.id;
                   const isDone = currentStep > t.id || isComplete;
                   const isProcessing = currentStep === t.id && !isComplete;
                   
                   return (
                     <button
                       key={t.id}
                       onClick={() => isDone && setActiveTab(t.id)}
                       className={cn(
                         "flex items-center gap-2.5 px-5 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all relative group shrink-0",
                         isActive ? "bg-[#3B82F6] text-white shadow-lg" : isDone ? "text-[#94A3B8] hover:bg-white/[0.03]" : "text-[#334155] cursor-not-allowed opacity-50"
                       )}
                     >
                       <t.icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : isDone ? "text-[#3B82F6]" : "text-[#334155]")} />
                       {idx + 1}. {t.label}
                       {isProcessing && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/40 animate-pulse" />}
                       {isDone && !isActive && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-[#111827]" />}
                     </button>
                   );
                 })}
               </nav>

               {/* TAB 3: WINDOWS */}
               <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", activeTab !== 3 && "hidden")}>
                  <div className="flex flex-col gap-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h2 className="text-lg font-bold text-white flex items-center gap-3">
                              <Zap className="w-5 h-5 text-[#3B82F6]" />
                              Temporal Sliding Windows
                           </h2>
                           <Card className="p-8 bg-[#0F172A] border-[#334155] overflow-hidden relative group">
                              <div className="space-y-4">
                                 {D.events.slice(0, itemLimit).map((ev, i) => (
                                    <div key={i} className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
                                       <span className="text-[10px] font-mono text-[#94A3B8] w-20 leading-none uppercase">WINDOW-{String(i+1).padStart(2, '0')}</span>
                                       <div className="flex-1 h-10 bg-black/40 rounded-lg relative flex items-center border border-white/5 overflow-hidden p-1">
                                          <div className="absolute inset-0 opacity-20 pointer-events-none">
                                             <div className="h-full w-full bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                          </div>
                                          <div className="h-full bg-[#3B82F6]/20 border-l-2 border-[#3B82F6] flex items-center justify-between px-4 transition-all duration-1000 shadow-lg relative z-10" style={{ marginLeft: `${i * 4}%`, width: "70%" }}>
                                             <span className="text-[9px] font-black text-[#3B82F6] tracking-tighter uppercase">{ev.n}</span>
                                             <div className="flex-1 mx-6 h-1 bg-white/5 rounded-full overflow-hidden relative">
                                                <div className="absolute inset-0 bg-[#3B82F6] opacity-40" style={{ width: '85%' }} />
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </Card>
                        </div>
                        <div className="bg-[#3B82F6]/5 p-8 rounded-3xl border border-[#3B82F6]/10 flex flex-col justify-center">
                           <BrainCircuit className="w-12 h-12 text-[#3B82F6] mb-6 opacity-40" />
                           <h3 className="text-xl font-bold text-white mb-4 italic tracking-tighter">Feature Ingestion Logic</h3>
                           <p className="text-[#94A3B8] leading-relaxed mb-6">
                              The system is currently aggregating 75-minute batches with a 1-minute step interval. This produces a dense overlapping sequence used for temporal causality mapping.
                           </p>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                 <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Batch Entropy</span>
                                 <span className="text-lg font-black text-white">0.942</span>
                              </div>
                              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                 <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Inference Lag</span>
                                 <span className="text-lg font-black text-white">12ms</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               {/* TAB 5+: CAUSALITY / FAILURE CHAINS - SIMULATED RESULTS */}
               <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", activeTab < 4 && "hidden")}>
                  {activeTab === 11 ? (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       {D.chainsR.slice(0, itemLimit).map((c, i) => {
                          const isCritical = ['PACKET_DROP', 'DEVICE_REBOOT', 'INTERFACE_FLAP'].includes(c.evt);
                          const severityColor = isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]';
                          const badgeColor = isCritical ? 'bg-[#7F1D1D]/40 text-[#F87171]' : 'bg-[#78350F]/40 text-[#F59E0B]';
                          return (
                            <div key={i} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] p-5 border-l-[3px] animate-in slide-in-from-left-4 duration-500", severityColor)}>
                               <div className="flex items-center gap-3 mb-4">
                                  <Badge className={badgeColor}>ROUTER</Badge>
                                  <span className="font-bold text-white tracking-tight">{c.evt}</span>
                                  <span className="ml-auto text-[10px] text-[#94A3B8] font-mono">SEEN {c.n}X</span>
                               </div>
                               <div className="flex flex-wrap items-center gap-2">
                                  {c.steps.map((s, k) => (
                                    <div key={k} className="flex items-center gap-2">
                                       <span className="px-2 py-1 bg-black/20 border border-white/5 rounded text-[10px] font-mono text-[#3B82F6]">{s.m} {s.d}</span>
                                       <ChevronRight className="w-3 h-3 text-[#334155]" />
                                    </div>
                                  ))}
                                  <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", badgeColor)}>{c.evt}</span>
                               </div>
                            </div>
                          )
                       })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                       <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin mb-4" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Streaming tab data into visualization layer...</span>
                    </div>
                  )}
               </section>

               {isComplete && activeTab === 12 && (
                  <div className="mt-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                     <div className="w-24 h-24 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#3B82F6]/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <CheckCircle2 className="w-12 h-12 text-[#3B82F6]" />
                     </div>
                     <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-4">Training Finalized</h2>
                     <p className="text-[#94A3B8] max-w-lg mb-8 leading-relaxed">
                        The algorithmic model has been verified against historical baselines. Performance metrics are now available for review in the results dashboard.
                     </p>
                     <Button 
                       onClick={() => handleReset()}
                       className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 px-8 py-6 rounded-xl font-bold italic uppercase tracking-tighter"
                     >
                       RECALIBRATE ENGINE
                     </Button>
                  </div>
               )}
             </div>
           )}
        </div>
      </div>
    </MainLayout>
  );
}
