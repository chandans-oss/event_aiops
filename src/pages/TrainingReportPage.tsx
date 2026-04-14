import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  RotateCcw,
  Network as NetworkIcon,
  Cpu,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Search,
  Trash2,
  Calendar,
  Zap,
  CheckCircle2,
  ChevronRight,
  Database,
  Clock,
  Info,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Grid
} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { storedReports } from "@/data/trainingReportData";
import { LOVELABLE_REPORT_DATA as D } from "@/data/lovelableReportData";
import { cn, formatMetricLabel as formatLabel } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const colors = ['#3B82F6', '#8B5CF6', '#3DDAB4', '#F59E0B', '#EF4444', '#EC4899'];

// Local formatLabel removed, using centralized formatMetricLabel via import

const Bar = ({ val, max, col }: { val: number, max: number, col: string }) => {
  const pct = Math.min(val / max * 100, 100).toFixed(1);
  return (
    <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
      <div className="h-full rounded-[3px] transition-all duration-700" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
};

const DonutChart = ({ val, size = 32 }: { val: number, size?: number }) => {
  const circ = 2 * Math.PI * (size / 2 - 4);
  const stroke = circ * (1 - val);
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="transparent" stroke="#3B82F6" strokeWidth="3" strokeDasharray={circ} strokeDashoffset={stroke} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
    </div>
  );
};

const AnomalyHeatMap = ({ data }: { data: any[] }) => {
  const metrics = [
    { key: 'cpu', label: 'CPU Util' },
    { key: 'mem', label: 'Mem Util' },
    { key: 'lat', label: 'Latency' },
    { key: 'qd', label: 'Buffer Util' },
    { key: 'crc', label: 'CRC Errors' }
  ];

  return (
    <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-[#EF4444] font-bold uppercase">Resource Anomaly Heat Map</span>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> HIGH
          </div>
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> MED
          </div>
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-[#94A3B8] font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3DDAB4] shadow-[0_0_8px_rgba(61,218,180,0.4)]" /> NORMAL
          </div>
        </div>
      </div>
      <div className="p-4 overflow-x-auto no-scrollbar">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-2 mb-3 px-2">
            <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] opacity-40 uppercase font-black pr-2 tracking-widest">Entity Identifier</div>
            {metrics.map(m => (
              <div key={m.key} className="text-center font-['IBM_Plex_Mono',monospace] text-[9px] text-[#F8FAFC] opacity-40 font-black uppercase tracking-widest">{m.label}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {data.map((d, i) => (
              <div key={i} className="grid grid-cols-[160px_repeat(5,1fr)] gap-1.5 items-center group/row animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] truncate pr-3 border-r border-white/5 font-bold">{d.e}</div>
                {metrics.map(m => {
                  const val = d.metrics?.[m.key] || 0;
                  const severity = val > 10 ? 'HIGH' : val > 5 ? 'MED' : val > 2 ? 'LOW' : 'NONE';
                  const color = severity === 'HIGH' ? '#EF4444' : severity === 'MED' ? '#F59E0B' : severity === 'LOW' ? '#3DDAB4' : '#1e293b';
                  const opacity = severity === 'HIGH' ? '0.8' : severity === 'MED' ? '0.6' : severity === 'LOW' ? '0.4' : '0.2';

                  return (
                    <div key={m.key} className="h-8 rounded-[3px] border border-white/5 transition-all duration-300 relative" style={{ background: color, opacity }}>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FailureChainsReport = ({ chains }: { chains: any[] }) => {
  return (
    <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-xl animate-in fade-in duration-500">
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-[1fr_120px] gap-4 px-4 py-2 bg-[#0F172A]/40 border-b border-[#334155]">
          <span className="text-[10px] font-black text-[#F8FAFC] tracking-[0.15em]">Causal Chain Breakdown</span>
          <span className="text-[12px] font-black text-[#F8FAFC] tracking-[0.15em]">Confidence</span>
        </div>

        {chains.map((c, i) => {
          const isCritical = ['PACKET_DROP', 'DEVICE_REBOOT', 'INTERFACE_FLAP'].includes(c.evt.toUpperCase().replace(' ', '_'));
          const severityColor = isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]';
          const badgeColor = isCritical ? 'bg-[#7F1D1D]/40 text-[#F87171]' : 'bg-[#78350F]/40 text-[#F59E0B]';
          const confVal = Math.min(0.72 + (c.n / 1000) * 0.28, 0.99);
          return (
            <div key={i} className={cn("grid grid-cols-[1fr_120px] gap-4 items-center px-4 py-4 bg-[#0F172A]/20 border border-[#334155] rounded-lg border-l-4 group hover:border-[#3B82F6]/30 transition-all shadow-lg", severityColor)}>
              <div className="flex flex-wrap items-center gap-y-3 gap-x-1.5 min-w-0">
                {c.steps.map((s: any, k: number) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className="flex flex-col gap-0.5 font-['IBM_Plex_Mono',monospace]">
                      <span className="text-[9px] text-[#94A3B8] font-bold opacity-60 uppercase">Step 0{k + 1}</span>
                      <div className="px-2 py-1.5 rounded-md bg-[#0F172A]/80 border border-white/5 flex items-center gap-2 shadow-inner">
                        <span className="text-[12px] text-[#F8FAFC] font-bold whitespace-nowrap">{formatLabel(s.m)}</span>
                        <span className={cn("font-bold text-[12px]", s.d === '↑' ? 'text-rose-400' : 'text-emerald-400')}>{s.d}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center px-1 min-w-[24px] opacity-30 mt-3">
                      <span className="text-[9px] font-black text-[#60A5FA] mb-0.5">{s.lag}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-0.5 font-['IBM_Plex_Mono',monospace]">
                  <span className="text-[9px] text-[#F87171] font-bold opacity-60 uppercase">Final Impact</span>
                  <div className={cn("px-2.5 py-1.5 rounded-md text-[12px] font-black shadow-xl border border-white/5 tracking-wide", badgeColor)}>
                    {formatLabel(c.evt)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center border-l border-white/5 h-full justify-center pl-2">
                <DonutChart val={confVal} size={32} />
                <span className="text-[12px] font-black mt-1 text-[#3B82F6] font-['IBM_Plex_Mono',monospace]">{(confVal * 100).toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrainingReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [search, setSearch] = useState('');
  const [reportMeta, setReportMeta] = useState<any>(null);

  useEffect(() => {
     const saved = localStorage.getItem('analytical_training_reports');
     let all = [...storedReports];
     if (saved) {
       try {
         const dynamic = JSON.parse(saved);
         all = [...all, ...dynamic];
       } catch (e) {}
     }

     const found = all.find(r => r.id === reportId);
     if (found) {
       setReportMeta(found);
     }
  }, [reportId]);

  const handleExportJSON = () => {
    const combined = { 
      reportId: reportId,
      timestamp: new Date().toISOString(),
      metadata: reportMeta,
      analysis: D 
    };
    const blob = new Blob([JSON.stringify(combined, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportMeta?.name || 'analytical_report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] pb-20 font-sans">
      {/* Header Section */}
      <div className="bg-[#1e293b]/40 border-b border-white/5 px-10 py-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[#3B82F6] mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-[0.3em] uppercase opacity-60">Verified Model Repository</span>
                <h1 className="text-[34px] font-black tracking-tighter leading-none mt-1">
                  {reportMeta?.name || 'Analytical Intelligence Report'}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6">
               <div className="flex items-center gap-2.5 bg-[#0F172A]/60 px-4 py-2.5 rounded-xl border border-white/5">
                  <Calendar className="w-4 h-4 text-[#55848B]" />
                  <span className="text-[12px] font-black text-[#94A3B8]">{reportMeta?.date || 'N/A'}</span>
               </div>
               <div className="flex items-center gap-2.5 bg-[#0F172A]/60 px-4 py-2.5 rounded-xl border border-white/5">
                  <Target className="w-4 h-4 text-[#3DDAB4]" />
                  <span className="text-[12px] font-black text-[#94A3B8]">SCOPE: {reportMeta?.dataPeriod || 'NETWORK CORE'}</span>
               </div>
               <div className="flex items-center gap-2.5 bg-[#0F172A]/60 px-4 py-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-[12px] font-black text-[#94A3B8]">DUR: {reportMeta?.duration || '1 Month'}</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/pattern-prediction/training')}
              className="h-12 bg-transparent border-white/10 text-[#F8FAFC] hover:bg-white/5 gap-2 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Analysis
            </Button>
            <Button 
              onClick={handleExportJSON}
              className="h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2 px-8 rounded-xl font-black shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              Download Full Artifact
            </Button>
          </div>
        </div>
      </div>

      {/* Main Analysis Tabs */}
      <div className="max-w-[1600px] mx-auto px-10 mt-10">
        <Tabs defaultValue="supervised" className="w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'dataprep', label: 'Data Prep' },
                { id: 'supervised', label: 'Supervised ML' },
                { id: 'timeseries', label: 'Time-Series' },
                { id: 'clustering', label: 'Clustering' },
                { id: 'timelag', label: 'Time-Lag' },
                { id: 'causal', label: 'Causal Correlation' },
                { id: 'sequence', label: 'Sequence Mining' },
                { id: 'cooccurrence', label: 'Co-Occurrence' },
                { id: 'failures', label: 'Failure Chains' }
              ].map(t => (
                <TabsTrigger 
                  key={t.id}
                  value={t.id} 
                  className="px-6 py-4 data-[state=active]:bg-[#1E293B] data-[state=active]:text-[#3B82F6] rounded-t-xl rounded-b-none text-[#94A3B8] text-[11px] font-black tracking-[0.1em] uppercase transition-all"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="min-h-[600px]">
            {/* DATA PREP TAB */}
            <TabsContent value="dataprep" className="animate-in fade-in duration-500 mt-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1e293b]/40 border border-[#334155] p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <Database className="w-5 h-5 text-[#3DDAB4]" />
                        <span className="text-[12px] font-black text-[#F8FAFC]/60 uppercase tracking-widest">Windows Processed</span>
                     </div>
                     <div className="text-4xl font-black text-white">{reportMeta?.windows || '8,156'}</div>
                     <div className="text-[10px] text-[#3DDAB4] font-bold mt-2 font-mono">100% SUCCESS RATE</div>
                  </div>
                  <div className="bg-[#1e293b]/40 border border-[#334155] p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-5 h-5 text-[#3B82F6]" />
                        <span className="text-[12px] font-black text-[#F8FAFC]/60 uppercase tracking-widest">Events Captured</span>
                     </div>
                     <div className="text-4xl font-black text-white">4.2K</div>
                     <div className="text-[10px] text-[#3B82F6] font-bold mt-2 font-mono">6 UNIQUE CATEGORIES</div>
                  </div>
                  <div className="bg-[#1e293b]/40 border border-[#334155] p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <Layers className="w-5 h-5 text-[#8B5CF6]" />
                        <span className="text-[12px] font-black text-[#F8FAFC]/60 uppercase tracking-widest">Feature Matrix</span>
                     </div>
                     <div className="text-4xl font-black text-white">64D</div>
                     <div className="text-[10px] text-[#8B5CF6] font-bold mt-2 font-mono">NORMALIZED SIGNAL SET</div>
                  </div>
                  <div className="bg-[#1e293b]/40 border border-[#334155] p-6 rounded-2xl">
                     <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-[#F59E0B]" />
                        <span className="text-[12px] font-black text-[#F8FAFC]/60 uppercase tracking-widest">Execution Time</span>
                     </div>
                     <div className="text-4xl font-black text-white">{reportMeta?.execTime || '67.7s'}</div>
                     <div className="text-[10px] text-[#F59E0B] font-bold mt-2 font-mono">ENGINE OPTIMIZED</div>
                  </div>
               </div>
               
               <div className="mt-8 bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-6">
                  <h3 className="text-[14px] font-black text-[#94A3B8] uppercase tracking-widest mb-6">Distribution of Target Events</h3>
                  <div className="space-y-6">
                     {D.events.map((e, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between items-center text-[12px] font-bold">
                              <span className="text-white">{formatLabel(e.n)}</span>
                              <span className="text-[#3B82F6] font-black">{e.pos} Occurrences ({(e.rate).toFixed(1)}%)</span>
                           </div>
                           <DonutChart val={e.rate / 15} size={28} />
                           {/* Simplified bar for distribution */}
                           <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                              <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${Math.min(e.rate * 8, 100)}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </TabsContent>

            {/* SUPERVISED ML TAB */}
            <TabsContent value="supervised" className="p-0 mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {D.rfR.filter(rf => !rf.skip).map((rf, i) => (
                    <div key={i} className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Target className="w-24 h-24" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] border border-[#3B82F6]/20">
                            <Target className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-[16px] font-black text-white uppercase tracking-widest">{formatLabel(rf.evt)}</div>
                            <div className="text-[11px] text-[#94A3B8] font-bold font-mono">Classifier: Random Forest</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-3xl font-black text-[#3DDAB4] tabular-nums">{(rf.f1! * 100).toFixed(1)}%</div>
                          <div className="text-[10px] font-black text-[#475569] uppercase tracking-widest">F1-Score</div>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <div className="text-[10px] font-black text-[#94A3B8] tracking-widest uppercase mb-2 font-mono flex items-center gap-2">
                           <Activity className="w-3 h-3" /> Top Contributing Signals
                        </div>
                        {rf.feats?.map(([feat, score], idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-[12px] font-bold">
                              <span className="text-[#F8FAFC]">{formatLabel(feat)}</span>
                              <span className="text-[#3B82F6] font-black">Importance Index: {(score * 100).toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                              <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${Math.min(score * 500, 100)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </TabsContent>

            {/* TIME SERIES TAB */}
            <TabsContent value="timeseries" className="p-0 mt-0">
                <div className="space-y-10">
                   <AnomalyHeatMap data={D.anomR} />
                   
                   <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-8">
                      <h3 className="text-[16px] font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                         <TrendingUp className="w-5 h-5 text-[#EF4444]" />
                         Pre-Event Metric Deviations
                      </h3>
                      <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-[#334155]">
                              <th className="text-left py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Target Failure</th>
                              <th className="text-left py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Trigger Signal</th>
                              <th className="text-right py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Baseline</th>
                              <th className="text-right py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Pre-Event</th>
                              <th className="text-right py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Shift %</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#334155]/30">
                            {D.preEvtR.map((pe, i) => pe.metrics.slice(0, 3).map((m, midx) => (
                              <tr key={`${i}-${midx}`} className="group hover:bg-white/5 transition-colors">
                                {midx === 0 && (
                                  <td rowSpan={3} className="py-4 px-4 font-black text-[13px] text-white border-r border-[#334155]/50">
                                    {formatLabel(pe.evt)}
                                  </td>
                                )}
                                <td className="py-4 px-4 text-[12px] font-bold text-[#3B82F6]">{formatLabel(m.m)}</td>
                                <td className="py-4 px-4 text-right text-[12px] font-mono text-[#94A3B8]">{m.normal}</td>
                                <td className="py-4 px-4 text-right text-[12px] font-mono font-bold text-white">{m.pre}</td>
                                <td className={cn("py-4 px-4 text-right text-[12px] font-black", m.up ? 'text-[#EF4444]' : 'text-[#3B82F6]')}>
                                  {m.up ? '+' : ''}{m.dpct}%
                                </td>
                              </tr>
                            )))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                </div>
            </TabsContent>

            {/* CLUSTERING TAB */}
            <TabsContent value="clustering" className="p-0 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {D.clR.map((cl, i) => (
                     <div key={i} className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-8 hover:border-[#3B82F6]/40 transition-all">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                             <div className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ background: cl.c }} />
                             <span className="text-[18px] font-black text-white tracking-widest uppercase">{cl.n}</span>
                          </div>
                          <div className="bg-[#0F172A] px-4 py-2 rounded-xl border border-white/5">
                             <div className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Share</div>
                             <div className="text-2xl font-black text-[#3B82F6] tabular-nums">{((cl.size/cl.total)*100).toFixed(1)}%</div>
                          </div>
                       </div>
                       
                       <div className="space-y-5">
                          {cl.centroids && Object.entries(cl.centroids).map(([k, v], idx) => (
                            <div key={k} className="space-y-2">
                               <div className="flex justify-between text-[11px] font-bold text-[#94A3B8] uppercase">
                                  <span>{formatLabel(k)}</span>
                                  <span className="text-white font-mono">{v.toFixed(2)}</span>
                               </div>
                               <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-1000" style={{ background: cl.c, width: `${v}%` }} />
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="mt-8 p-4 bg-[#0F172A]/40 rounded-xl border border-white/5">
                          <div className="text-[10px] font-black text-[#EF4444] uppercase tracking-widest mb-1 font-mono">Dominant Correlated Failure</div>
                          <div className="text-[12px] text-white font-bold leading-relaxed">{cl.evt.split('|')[0]}</div>
                       </div>
                     </div>
                   ))}
                </div>
            </TabsContent>

            {/* TIME LAG TAB */}
            <TabsContent value="timelag" className="p-0 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {D.xcorrR.slice(0, 9).map((xc, i) => (
                     <div key={i} className="bg-[#1e293b]/40 border border-[#334155] p-6 rounded-2xl relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all">
                        <div className="flex flex-col items-center gap-6 text-center">
                           <div className="text-[14px] font-black text-white uppercase tracking-widest">{formatLabel(xc.a)} & {formatLabel(xc.b)}</div>
                           <div className="relative w-40 h-40 flex items-center justify-center">
                              <svg viewBox="0 0 200 200" className="w-full h-full">
                                 <circle cx="80" cy="100" r="60" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 2" />
                                 <circle cx="120" cy="100" r="60" fill="#3DDAB4" fillOpacity="0.1" stroke="#3DDAB4" strokeWidth="2" strokeDasharray="4 2" />
                                 <text x="100" y="95" textAnchor="middle" className="font-['IBM_Plex_Mono',monospace] font-black fill-white" fontSize="12">Corr {(xc.r * 100).toFixed(0)}%</text>
                                 <text x="100" y="120" textAnchor="middle" className="font-['IBM_Plex_Mono',monospace] font-black fill-[#3DDAB4]" fontSize="11">Lag {xc.lag}</text>
                              </svg>
                           </div>
                           <div className="text-[10px] text-[#94A3B8] font-bold font-mono tracking-tight">{xc.interp}</div>
                        </div>
                     </div>
                   ))}
                </div>
            </TabsContent>

            {/* CAUSAL TAB */}
            <TabsContent value="causal" className="p-0 mt-0">
               <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-[#0F172A] border-b border-[#334155]">
                     <h3 className="text-[14px] font-black text-white uppercase tracking-widest">Granger Causality Matrix</h3>
                  </div>
                  <div className="p-0">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-[#0F172A]/40">
                              <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Cause Signal</th>
                              <th className="px-6 py-4 text-center text-[#94A3B8] w-20">
                                 <ArrowRight className="w-4 h-4 mx-auto" />
                              </th>
                              <th className="px-6 py-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Effect Event</th>
                              <th className="px-6 py-4 text-center text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">F-Statistic</th>
                              <th className="px-6 py-4 text-center text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">P-Value</th>
                              <th className="px-6 py-4 text-center text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Optimal Lag</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                           {D.grangerR.map((g, i) => (
                              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                 <td className="px-6 py-4 text-[13px] font-bold text-[#3B82F6]">{formatLabel(g.c)}</td>
                                 <td className="px-6 py-4 text-center opacity-30">
                                    <ChevronRight className="w-4 h-4 mx-auto" />
                                 </td>
                                 <td className="px-6 py-4 text-[13px] font-bold text-white">{formatLabel(g.e)}</td>
                                 <td className="px-6 py-4 text-center text-[13px] font-black text-[#F59E0B]">{g.f.toFixed(1)}</td>
                                 <td className="px-6 py-4 text-center text-[12px] font-black text-[#3DDAB4]">{g.p}</td>
                                 <td className="px-6 py-4 text-center text-[12px] font-black text-[#94A3B8]">{g.lag}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </TabsContent>

            {/* SEQUENCE TAB */}
            <TabsContent value="sequence" className="p-0 mt-0">
               <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-[1fr_110px_110px] gap-4 px-6 py-3 bg-[#0F172A] border border-white/5 rounded-xl">
                    <span className="text-[11px] font-black text-[#94A3B8] tracking-[0.1em] uppercase">Time-Ordered Sequence Flow</span>
                    <span className="text-[11px] font-black text-[#94A3B8] tracking-[0.1em] uppercase text-center">Frequency</span>
                    <span className="text-[11px] font-black text-[#94A3B8] tracking-[0.1em] uppercase text-center">Confidence</span>
                  </div>

                  {D.seqR.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1fr_110px_110px] gap-4 items-center px-6 py-5 bg-[#0F172A]/20 border border-white/5 rounded-xl hover:border-[#3B82F6]/30 transition-all">
                      <div className="flex flex-wrap items-center gap-2">
                        {s.seq.map((e, k) => (
                          <div key={k} className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-white/10 font-bold text-[11px] text-white whitespace-nowrap shadow-sm">
                              {formatLabel(e)}
                            </span>
                            {k < s.seq.length - 1 && (
                              <div className="flex flex-col items-center opacity-40">
                                <ChevronRight className="w-4 h-4 text-[#3B82F6]" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-center font-mono font-black text-[#F8FAFC]">
                        {s.supp} sessions
                      </div>
                      <div className="flex flex-col items-center justify-center border-l border-white/5 pl-2">
                        <DonutChart val={s.conf} size={28} />
                        <span className="text-[12px] font-black mt-1 text-[#3B82F6] font-mono">{(s.conf * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* CO-OCCURRENCE TAB */}
            <TabsContent value="cooccurrence" className="p-0 mt-0">
                <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                       <h3 className="text-[14px] font-black text-white uppercase tracking-widest">Event Co-occurrence Lift Analysis</h3>
                       <span className="text-[11px] text-[#94A3B8] font-black uppercase tracking-widest font-mono">N=4,079 WINDOWS</span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {D.coocR.map((d, i) => (
                              <div key={i} className="grid grid-cols-[1fr_20px_1fr_60px_60px] gap-4 items-center p-4 bg-[#0F172A]/40 border border-white/5 rounded-xl hover:bg-[#1E293B] transition-all">
                                 <span className="font-bold text-[12px] text-white truncate">{formatLabel(d.a)}</span>
                                 <span className="text-[#3B82F6] font-black text-center">&</span>
                                 <span className="font-bold text-[12px] text-white truncate">{formatLabel(d.b)}</span>
                                 <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-[#94A3B8] font-bold">COUNT</span>
                                    <span className="text-[12px] font-black text-white">{d.n}</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-[#94A3B8] font-bold">LIFT</span>
                                    <span className={cn("text-[13px] font-black", d.lift > 1.01 ? 'text-[#3DDAB4]' : 'text-white')}>{d.lift.toFixed(2)}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                    </div>
                </div>
            </TabsContent>

            {/* FAILURE CHAINS TAB */}
            <TabsContent value="failures" className="p-0 mt-0">
                <FailureChainsReport chains={D.chainsR} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

       {/* Footer / Meta Log */}
       <div className="max-w-[1600px] mx-auto px-10 mt-12 py-8 border-t border-white/5">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#475569]">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  AUTH ID: CRT-LOV-{reportId?.slice(-4).toUpperCase() || 'N/A'}
               </div>
               <span>VERIFIED: {new Date().toLocaleDateString()}</span>
               <span>SYSTEM: ANTIGRAVITY AI ENGINE v4.2</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/5 rounded-lg border border-[#3B82F6]/10">
               <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
               <span className="text-[11px] font-black text-[#3B82F6] tracking-[0.1em] uppercase">Authenticated Analytical Registry</span>
            </div>
         </div>
       </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TrainingReportPage;
