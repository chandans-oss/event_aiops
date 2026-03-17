import { useState } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Database, 
  Settings2, 
  BrainCircuit, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Play, 
  History,
  Layers,
  Cpu,
  BarChart3
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useNavigate } from "react-router-dom";

export default function AlgoConfigPage() {
  const navigate = useNavigate();
  const [historySize, setHistorySize] = useState("1month");
  const [selectedModels, setSelectedModels] = useState<string[]>(["xcorr", "granger", "rf"]);

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] p-8 font-['Sora',sans-serif]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
                <Settings2 className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.2em] text-[#3B82F6] uppercase font-bold">Training Suite / V3.0</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Training Configuration</h1>
            <p className="text-[#94A3B8] text-sm">Define data scope and model parameters for the algorithmic pipeline.</p>
          </div>
          
          <Button 
            onClick={() => navigate('/algo-training/training')}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-6 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            INITIALIZE TRAINING
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Config Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Data Source Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Database className="w-4 h-4 text-[#3B82F6]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">01. Data Source & Scope</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  onClick={() => setHistorySize("1month")}
                  className={cn(
                    "p-6 bg-[#0F172A]/40 border-white/5 cursor-pointer transition-all hover:bg-[#0F172A]/60 group",
                    historySize === "1month" && "border-[#3B82F6] bg-[#3B82F6]/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <History className={cn("w-8 h-8", historySize === "1month" ? "text-[#3B82F6]" : "text-[#334155]")} />
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[10px]">OPTIMAL</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Standard History</h3>
                  <p className="text-xs text-[#94A3B8] mb-4">Last 30 days of telemetry across all enterprise clusters.</p>
                  <div className="flex items-center gap-4 text-[10px] font-['IBM_Plex_Mono',monospace]">
                    <span className="text-[#3B82F6]">~4,200 windows</span>
                    <span className="text-[#334155]">|</span>
                    <span className="text-[#94A3B8]">Training: ~2.5m</span>
                  </div>
                </Card>

                <Card 
                  onClick={() => setHistorySize("3month")}
                  className={cn(
                    "p-6 bg-[#0F172A]/40 border-white/5 cursor-pointer transition-all hover:bg-[#0F172A]/60 group",
                    historySize === "3month" && "border-[#3B82F6] bg-[#3B82F6]/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Zap className={cn("w-8 h-8", historySize === "3month" ? "text-[#3B82F6]" : "text-[#334155]")} />
                    <Badge variant="outline" className="border-amber-500/20 text-amber-500 text-[10px]">RESOURCE HEAVY</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Deep History</h3>
                  <p className="text-xs text-[#94A3B8] mb-4">Last 90 days for seasonal pattern recognition and long-term drift.</p>
                  <div className="flex items-center gap-4 text-[10px] font-['IBM_Plex_Mono',monospace]">
                    <span className="text-[#3B82F6]">~12,600 windows</span>
                    <span className="text-[#334155]">|</span>
                    <span className="text-[#94A3B8]">Training: ~8.2m</span>
                  </div>
                </Card>
              </div>
            </section>

            {/* 2. Model Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <BrainCircuit className="w-4 h-4 text-[#3B82F6]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">02. Model Architecture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: "xcorr", name: "Cross-Correlation Engine", desc: "Temporal lag discovery between interface metrics." },
                  { id: "granger", name: "Granger Causality", desc: "Directional influence & root cause mapping." },
                  { id: "rf", name: "Random Forest Classifier", desc: "Binary event prediction and feature weighting." },
                  { id: "sequence", name: "Sequence Miner", desc: "Mining n-event transition chains (A -> B -> C)." },
                ].map((model) => (
                  <div 
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                      selectedModels.includes(model.id) 
                        ? "bg-[#3B82F6]/5 border-[#3B82F6]/40 shadow-inner" 
                        : "bg-[#0F172A]/20 border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border",
                      selectedModels.includes(model.id) ? "bg-[#3B82F6]/10 border-[#3B82F6]/20" : "bg-[#1E293B] border-white/5"
                    )}>
                      {selectedModels.includes(model.id) ? <ShieldCheck className="w-5 h-5 text-[#3B82F6]" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#334155]" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{model.name}</h4>
                      <p className="text-[10px] text-[#94A3B8]">{model.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 px-1">Training Pipeline</h2>
            <Card className="p-6 bg-[#0F172A] border-[#334155] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Cpu className="w-24 h-24 text-white" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#94A3B8] border-b border-white/5 pb-2">
                  <span>Input Entities</span>
                  <span className="text-[#3B82F6]">32 Devices</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#94A3B8] border-b border-white/5 pb-2">
                  <span>Temporal Polls</span>
                  <span className="text-[#3B82F6]">1 Minute</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#94A3B8] border-b border-white/5 pb-2">
                  <span>Batch Sequence</span>
                  <span className="text-[#3B82F6]">Sliding (75m)</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-xs font-bold text-white">Estimated Resources</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-[#94A3B8]">
                      <span>Compute Load</span>
                      <span className="text-white">Medium</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-[#3B82F6]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#3B82F6]/5 rounded-xl border border-[#3B82F6]/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#3B82F6]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Model Guarantee</span>
                  </div>
                  <p className="text-[9px] text-[#94A3B8] leading-normal italic">
                    Configured parameters will produce a production-ready weights matrix. 
                    Deployment status: <span className="text-emerald-500 font-bold">READY</span>
                  </p>
                </div>
              </div>
            </Card>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#94A3B8] mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">Last Trained</span>
                <span className="text-xs text-white">March 16, 2026 - 18:42:10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
