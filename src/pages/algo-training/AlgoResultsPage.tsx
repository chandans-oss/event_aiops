import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { 
  BarChart3, 
  Target, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap,
  TrendingDown,
  ChevronRight,
  Database,
  Cpu
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function AlgoResultsPage() {
  const models = [
    { name: "Causality Engine", type: "Statistical", acc: 98.4, f1: 0.96, trend: "+2.1%", drift: "Low", status: "STABLE" },
    { name: "Predictive Forest", type: "Ensemble", acc: 94.2, f1: 0.91, trend: "+0.8%", drift: "Med", status: "VERIFIED" },
    { name: "Sequence Miner", type: "Pattern", acc: 89.7, f1: 0.88, trend: "-1.2%", drift: "High", status: "DEGRADED" },
    { name: "Anomaly Iso-Engine", type: "Isolation", acc: 96.1, f1: 0.94, trend: "+4.5%", drift: "Low", status: "OPTIMAL" },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] p-8 font-['Sora',sans-serif]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-10">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                   <Target className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-white italic uppercase">Training Insights</h1>
             </div>
             <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
                Comprehensive performance metrics and validation scoring for the latest algorithmic deployment. Analysis based on 32.4k telemetry points.
             </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Latest Benchmark</span>
                <span className="text-2xl font-black text-white italic">94.8<span className="text-[#3B82F6] opacity-60">%</span></span>
             </div>
             <Button className="bg-[#3B82F6] hover:bg-[#2563EB] px-8 py-6 rounded-xl font-black italic uppercase tracking-tighter text-base shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all gap-2">
                <ShieldCheck className="w-5 h-5" />
                Push to Production
             </Button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           {[
             { label: "Signal Density", val: "4.8k", unit: "pts/m", icon: Activity, color: "text-blue-500" },
             { label: "Predictive Lift", val: "+12.4", unit: "%", icon: TrendingUp, color: "text-emerald-500" },
             { label: "Resource Cost", val: "32", unit: "ms", icon: Cpu, color: "text-amber-500" },
           ].map((m, i) => (
             <Card key={i} className="p-6 bg-[#0F172A] border-white/5 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
                   <m.icon className="w-24 h-24 text-white" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                   <div className={cn("p-2 rounded-lg bg-black/40", m.color)}>
                      <m.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{m.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tracking-tighter">{m.val}</span>
                   <span className="text-xs font-bold text-[#3B82F6] opacity-60 uppercase">{m.unit}</span>
                </div>
             </Card>
           ))}
        </div>

        {/* Model Performance List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] px-1 mb-6 flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
                 Model Performance Matrix
              </h2>
              
              <div className="space-y-3">
                 {models.map((m, i) => (
                    <Card key={i} className="p-5 bg-black/20 border-white/5 hover:border-[#3B82F6]/30 transition-all group">
                       <div className="flex items-center justify-between grow">
                          <div className="flex items-center gap-5 w-1/3">
                             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", 
                               m.status === 'OPTIMAL' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                               m.status === 'DEGRADED' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-[#1E293B] border-white/5'
                             )}>
                                <Zap className={cn("w-5 h-5", 
                                  m.status === 'OPTIMAL' ? 'text-emerald-500' : 
                                  m.status === 'DEGRADED' ? 'text-rose-500' : 'text-[#3B82F6]'
                                )} />
                             </div>
                             <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-white group-hover:text-[#3B82F6] transition-colors">{m.name}</h3>
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">{m.type}</span>
                                   <span className={cn("px-1.5 py-0.5 rounded-[3px] text-[8px] font-black border", 
                                     m.status === 'DEGRADED' ? "border-rose-500/20 text-rose-500 bg-rose-500/5" : "border-[#3B82F6]/20 text-[#3B82F6] bg-[#3B82F6]/5"
                                   )}>{m.status}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between w-2/3">
                             <div className="text-center">
                                <span className="text-[9px] font-bold text-[#94A3B8] uppercase block mb-0.5">Accuracy</span>
                                <span className="text-sm font-black text-white">{m.acc}%</span>
                             </div>
                             <div className="text-center">
                                <span className="text-[9px] font-bold text-[#94A3B8] uppercase block mb-0.5">F1 Score</span>
                                <span className="text-sm font-black text-white">{m.f1}</span>
                             </div>
                             <div className="text-center">
                                <span className="text-[9px] font-bold text-[#94A3B8] uppercase block mb-0.5">Trend</span>
                                <div className={cn("flex items-center gap-1 text-xs font-bold", m.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                                   {m.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                   {m.trend}
                                </div>
                             </div>
                             <Button variant="ghost" size="icon" className="text-[#334155] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10">
                                <ChevronRight className="w-5 h-5" />
                             </Button>
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#94A3B8] px-1 mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                 Validation Log
              </h2>
              <Card className="p-6 bg-[#0F172A] border-[#334155] h-[480px] flex flex-col">
                 <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-4">
                    <Database className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Post-Training Audit</span>
                 </div>
                 <div className="flex-1 font-['IBM_Plex_Mono',monospace] text-[10px] space-y-3 leading-relaxed text-[#94A3B8] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-white"><span className="opacity-40">[]</span> INITIALIZING VALIDATION SEQUENCE...</p>
                    <p><span className="text-emerald-500 opacity-60">PASS</span> SHAP values computed for top 50 features.</p>
                    <p><span className="text-emerald-500 opacity-60">PASS</span> Feature drift below 5% threshold.</p>
                    <p><span className="text-[#3B82F6] opacity-60">INFO</span> Correlation baseline updated (+3.4s lag).</p>
                    <p className="text-white"><span className="opacity-40">[]</span> GENERATING DECISION BOUNDARIES...</p>
                    <p><span className="text-emerald-500 opacity-60">PASS</span> Cross-validation k=10 confirmed f1=0.96.</p>
                    <p><span className="text-amber-500 opacity-60">WARN</span> Model "Sequence Miner" showing low support on edge cases.</p>
                    <p><span className="text-emerald-500 opacity-60">PASS</span> Latency benchmark (99th pctl) = 45ms.</p>
                    <div className="h-px bg-white/5 my-4" />
                    <p className="text-white font-bold">READY FOR DEPLOYMENT / VERSION 3.0.4-BETA</p>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
