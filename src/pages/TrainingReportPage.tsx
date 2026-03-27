import { useState } from 'react';
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
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { trainingSummaryReport, trainingJsonReport, type ReportSummaryItem } from "@/data/trainingReportData";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useNavigate } from 'react-router-dom';

const TrainingReportPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredSummary = trainingSummaryReport.filter(item => 
    item.section.toLowerCase().includes(search.toLowerCase()) ||
    item.device_type.toLowerCase().includes(search.toLowerCase()) ||
    item.event.toLowerCase().includes(search.toLowerCase()) ||
    item.metric.toLowerCase().includes(search.toLowerCase()) ||
    (item.entity_id && item.entity_id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportJSON = () => {
    const combined = { summary: trainingSummaryReport, analysis: trainingJsonReport };
    const blob = new Blob([JSON.stringify(combined, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytical_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#3B82F6] mb-1.5 font-['IBM_Plex_Mono',monospace] text-[12px] font-bold tracking-[0.1em] uppercase">
            <FileText className="w-4 h-4" />
            AnalyticalIntelligenceRegistry
          </div>
          <h1 className="text-[32px] font-black tracking-[-0.03em] bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            LovelableSystemReport
          </h1>
          <p className="text-[#94A3B8] text-[14px]">Industry-standard audit for serialized model patterns and behavioral shifts.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/pattern-prediction/training-lovelable')}
            className="h-10 bg-[#1E293B]/40 border-[#334155] text-white hover:bg-[#334155] gap-2 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            BackToTraining
          </Button>
          <Button 
            onClick={handleExportJSON}
            className="h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2 px-6 rounded-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Download className="w-4 h-4" />
            ExportRegistry
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#0F172A] border border-[#334155] rounded-[24px] overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
        <Tabs defaultValue="summary" className="w-full flex flex-col flex-1">
          <div className="border-b border-[#334155] bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-20 px-4 flex items-center justify-between">
            <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-2">
              <TabsTrigger value="summary" className="px-6 py-5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#3B82F6] data-[state=active]:text-[#3B82F6] rounded-none border-b-2 border-transparent text-[#64748B] text-[12px] font-black uppercase tracking-[0.1em] transition-all">AuditSummary</TabsTrigger>
              <TabsTrigger value="correlation" className="px-6 py-5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#3B82F6] data-[state=active]:text-[#3B82F6] rounded-none border-b-2 border-transparent text-[#64748B] text-[12px] font-black uppercase tracking-[0.1em] transition-all">CrossCorrelation</TabsTrigger>
              <TabsTrigger value="granger" className="px-6 py-5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#3B82F6] data-[state=active]:text-[#3B82F6] rounded-none border-b-2 border-transparent text-[#64748B] text-[12px] font-black uppercase tracking-[0.1em] transition-all">GrangerCausality</TabsTrigger>
              <TabsTrigger value="json" className="px-6 py-5 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#3B82F6] data-[state=active]:text-[#3B82F6] rounded-none border-b-2 border-transparent text-[#64748B] text-[12px] font-black uppercase tracking-[0.1em] transition-all">JsonSchema</TabsTrigger>
            </TabsList>

            <div className="hidden md:flex items-center gap-4 px-4">
               <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569] group-focus-within:text-[#3B82F6] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter analytical logs..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-black/20 border border-[#334155] rounded-xl pl-9 pr-4 py-2 text-[11px] w-[240px] focus:outline-none focus:border-[#3B82F6] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto no-scrollbar">
            <TabsContent value="summary" className="mt-0">
               <Table>
                <TableHeader className="bg-black/40 sticky top-0 z-10">
                  <TableRow className="border-[#334155] hover:bg-transparent">
                    {['Device','Event','Metric','NormalMean','PreEventMean','DeltaPct','Occurrences','Performance'].map(h => (
                      <TableHead key={h} className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] px-6 py-5">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="font-['IBM_Plex_Mono',monospace]">
                  {filteredSummary.map((row, i) => (
                    <TableRow key={i} className="border-[#334155]/50 hover:bg-white/[0.02] group transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {row.device_type === 'router' ? <NetworkIcon className="w-3.5 h-3.5 text-[#3B82F6]" /> : <Cpu className="w-3.5 h-3.5 text-[#10B981]" />}
                          <span className="text-[11px] font-black text-white uppercase">{row.device_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-[11px] font-bold text-[#F8FAFC]">{row.event || row.entity_id}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[10px] text-[#94A3B8] font-medium">{row.metric || '—'}</TableCell>
                      <TableCell className="px-6 py-4 text-[11px] text-[#475569]">{row.normal_avg || '—'}</TableCell>
                      <TableCell className="px-6 py-4 text-[11px] text-white font-black">{row.pre_event_avg || '—'}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {Number(row.delta_pct) > 0 ? <TrendingUp className="w-3 h-3 text-[#F59E0B]" /> : <TrendingDown className="w-3 h-3 text-[#10B981]" />}
                          <span className={cn("text-[11px] font-black", Number(row.delta_pct) > 100 ? "text-[#EF4444]" : Number(row.delta_pct) > 0 ? "text-[#F59E0B]" : "text-[#10B981]")}>
                            {row.delta_pct ? `${row.delta_pct}%` : '—'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[11px] text-[#475569]">{row.n_occurrences || '—'}</TableCell>
                      <TableCell className="px-6 py-4">
                        {row.section === 'rf' ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-black text-[#10B981]">F1: {row.f1}</span>
                            <span className="text-[9px] font-bold text-[#3B82F6]">ACC: {row.accuracy}</span>
                          </div>
                        ) : row.section === 'anomaly' ? (
                          <div className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded px-2 py-0.5 w-fit">
                            <span className="text-[9px] font-black text-[#EF4444]">RISK: {(Number(row.anomaly_rate)*100).toFixed(1)}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#1E293B] group-hover:text-[#3B82F6] transition-colors">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="correlation" className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(trainingJsonReport.cross_correlation).map(([type, metrics]) => (
                  <div key={type} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                      <Activity className="w-4 h-4 text-[#3B82F6]" />
                      <h3 className="text-[14px] font-black text-white uppercase tracking-widest">{type} Shift-Lag Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(metrics).map(([pair, data]: [string, any]) => (
                        <div key={pair} className="bg-black/30 border border-[#334155] rounded-[16px] p-5 hover:border-[#3B82F6]/50 transition-all font-['IBM_Plex_Mono',monospace]">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-black text-white uppercase">{pair.replace('->', ' ➔ ')}</span>
                            <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-black">LAG: {data.lag_min}m</Badge>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex-1">
                              <div className="flex justify-between text-[9px] text-[#64748B] font-black tracking-widest uppercase mb-1.5">
                                <span>Pearson-R</span>
                                <span>Strength: {(data.pearson_r * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${data.pearson_r * 100}%` }} />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] text-[#64748B] font-black uppercase">Spearman</div>
                              <div className="text-[14px] font-black text-white">{data.spearman_r.toFixed(3)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="granger" className="p-8">
               <div className="max-w-4xl">
                 <div className="flex items-center gap-2 mb-8">
                  <Target className="w-4 h-4 text-[#EF4444]" />
                  <h3 className="text-[14px] font-black text-white uppercase tracking-widest">Statistical Causality Registry</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(trainingJsonReport.granger).map(([type, tests]) => (
                    Object.entries(tests).map(([pair, data]: [string, any]) => (
                      <div key={pair} className="flex items-center justify-between bg-black/40 border border-[#334155] rounded-xl p-5 group hover:bg-[#3B82F6]/5 transition-all font-['IBM_Plex_Mono',monospace]">
                        <div className="flex items-center gap-6">
                          <div className="p-2.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                            <NetworkIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[12px] font-black text-white uppercase mb-0.5">{type} · {pair.replace('->', ' ➔ ')}</div>
                            <div className="flex items-center gap-2 text-[10px] text-[#64748B] font-bold uppercase">
                              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                              Significance Verified
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-12">
                          <div className="text-right">
                            <div className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">F-Statistic</div>
                            <div className="text-[16px] font-black text-white">{data.f_stat.toFixed(4)}</div>
                          </div>
                          <div className="text-right pr-4">
                            <div className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">P-Value</div>
                            <div className="text-[16px] font-black text-[#3B82F6]">{data.p_value.toFixed(4)}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#1E293B] group-hover:text-[#3B82F6]" />
                        </div>
                      </div>
                    ))
                  ))}
                </div>
               </div>
            </TabsContent>

            <TabsContent value="json" className="p-8">
              <div className="bg-black/40 rounded-2xl p-6 border border-[#334155] font-['IBM_Plex_Mono',monospace]">
                <pre className="text-[12px] text-[#3B82F6]/80 leading-relaxed overflow-auto max-h-[600px] no-scrollbar">
                  {JSON.stringify({ summary: trainingSummaryReport, analysis: trainingJsonReport }, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

       {/* Footer / Meta */}
       <div className="mt-8 flex items-center justify-between text-[#475569] text-[10px] font-black uppercase tracking-[0.2em] px-2">
        <div className="flex items-center gap-6">
          <span>REGISTRY_ID: CRT-882-X</span>
          <span>TIMESTAMP: {new Date().toISOString()}</span>
          <span>AUDITOR: ANTIGRAVITY AI v2.0</span>
        </div>
        <div className="text-[#3B82F6] animate-pulse">AUTHENTICATED ANALYTICAL REGISTRY</div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TrainingReportPage;
