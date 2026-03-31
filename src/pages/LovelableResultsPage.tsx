import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { cn } from '@/shared/lib/utils';
import {
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Database,
  Clock,
  Layers,
  RefreshCcw,
  Search,
  ChevronRight,
  Trash2,
  Calendar,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storedReports } from "@/data/trainingReportData";

const formatLabel = (str: string) =>
  str.replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^\w|\s\w|\(\w)/g, m => m.toUpperCase());

export default function LovelableResultsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('analytical_training_reports');
    let dynamicReports = [];
    if (saved) {
      try {
        dynamicReports = JSON.parse(saved);
      } catch (e) {
        dynamicReports = [];
      }
    }
    // Combine static and dynamic, ensuring unique IDs
    const all = [...dynamicReports];
    storedReports.forEach(sr => {
      if (!all.some(a => a.id === sr.id)) {
        all.push(sr);
      }
    });
    setReports(all);
  }, []);

  const handleDelete = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    
    // Only update localStorage for dynamic reports
    const saved = localStorage.getItem('analytical_training_reports');
    if (saved) {
      try {
        const dynamic = JSON.parse(saved);
        const filteredDynamic = dynamic.filter((r: any) => r.id !== id);
        localStorage.setItem('analytical_training_reports', JSON.stringify(filteredDynamic));
      } catch (e) {}
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-[#0F172A] text-white font-sans overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0F172A]/80 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2DD4BF] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight">Training Report & Model Repository</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#3DDAB4] animate-pulse" />
              <span className="text-[10px] font-bold tracking-tighter text-[#3DDAB4]">System Synced</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 01 — Compiled Patterns & ML Binaries */}
            <section>
              <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3DDAB4]/50 mb-8">
                <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">01</span>
                <span className="text-[16px] font-bold tracking-tight">Compiled Patterns & Ml Binaries</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { name: 'iso_router.pkl', size: '2.3 MB', type: 'Anomaly Isolation', device: 'Router', accuracy: 0.94, col: '#EF4444' },
                  { name: 'iso_switch.pkl', size: '2.2 MB', type: 'Anomaly Isolation', device: 'Switch', accuracy: 0.93, col: '#F59E0B' },
                  { name: 'kmeans_router.pkl', size: '18 KB', type: 'Cluster Centroids', device: 'Router', accuracy: 0.88, col: '#3B82F6' },
                  { name: 'kmeans_switch.pkl', size: '16 KB', type: 'Cluster Centroids', device: 'Switch', accuracy: 0.89, col: '#3B82F6' },
                  { name: 'rf_router_HIGH_LATENCY.pkl', size: '767 KB', type: 'RF Classifier', device: 'Router', accuracy: 0.96, col: '#3DDAB4' },
                  { name: 'rf_router_HIGH_UTIL_WARNING.pkl', size: '812 KB', type: 'RF Classifier', device: 'Router', accuracy: 0.95, col: '#3DDAB4' },
                  { name: 'rf_router_INTERFACE_FLAP.pkl', size: '788 KB', type: 'RF Classifier', device: 'Router', accuracy: 0.97, col: '#3DDAB4' },
                  { name: 'rf_router_PACKET_DROP.pkl', size: '824 KB', type: 'RF Classifier', device: 'Router', accuracy: 0.96, col: '#3DDAB4' },
                  { name: 'rf_switch_HIGH_UTIL_WARNING.pkl', size: '792 KB', type: 'RF Classifier', device: 'Switch', accuracy: 0.94, col: '#3DDAB4' },
                  { name: 'rf_switch_INTERFACE_FLAP.pkl', size: '756 KB', type: 'RF Classifier', device: 'Switch', accuracy: 0.98, col: '#3DDAB4' },
                  { name: 'rf_switch_PACKET_DROP.pkl', size: '851 KB', type: 'RF Classifier', device: 'Switch', accuracy: 0.96, col: '#3DDAB4' },
                  { name: 'scaler_router.pkl', size: '4 KB', type: 'Normalization', device: 'Router', accuracy: 1.0, col: '#94A3B8' },
                  { name: 'scaler_switch.pkl', size: '4 KB', type: 'Normalization', device: 'Switch', accuracy: 1.0, col: '#94A3B8' },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="bg-[#1E293B]/60 border border-white/10 rounded-xl p-4 hover:border-[#3B82F6]/40 hover:bg-[#1E293B]/80 transition-all duration-300 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2 min-w-0 pr-4">
                        <div className="text-[12px] font-bold text-white font-['Inter',sans-serif] leading-tight break-words" title={m.name}>
                          {formatLabel(m.name)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] text-[#94A3B8] tracking-wider font-bold opacity-70">
                            {formatLabel(m.type)}
                          </span>
                          <div className="flex font-['Inter',sans-serif]">
                            <span className="text-[8px] font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20 tracking-tighter shadow-sm">
                              {formatLabel(m.device)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="14" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle
                            cx="16" cy="16" r="14" fill="transparent" stroke={m.accuracy > 0.9 ? '#10B981' : '#3B82F6'}
                            strokeWidth="3" strokeDasharray={`${m.accuracy * 88} 88`} strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-black text-white">{(m.accuracy * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02 — Generated Reports & Analytical Registries */}
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-8">
                <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">02</span>
                <span className="text-[16px] font-bold tracking-tight">Generated Reports & Analytical Registries</span>
              </div>

              <div className="bg-[#1E293B]/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#64748B]">Report Metadata</th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#64748B]">Scope</th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#64748B]">Windows</th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#64748B]">Latency</th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#64748B] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-['IBM_Plex_Mono',monospace]">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20 text-[#3B82F6]">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-white group-hover:text-[#3B82F6] transition-colors">{formatLabel(report.name)}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-[#55848B]" />
                                <span className="text-[10px] text-[#55848B] font-bold">{report.date}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-black text-[#F8FAFC] tracking-tighter">{formatLabel(report.dataPeriod)}</span>
                            <span className="text-[9px] text-[#475569] font-black">{report.duration} Period</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Database className="w-3 h-3 text-[#3DDAB4]" />
                            <span className="text-[11px] font-black text-[#3DDAB4]">{report.windows}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-[#F59E0B]" />
                            <span className="text-[11px] font-black text-[#F59E0B]">{report.execTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/pattern-prediction/report/${report.id}`)}
                              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-all"
                              title="Open Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#10B981] hover:border-[#10B981] transition-all" title="Download JSON">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#EF4444] hover:border-[#EF4444] transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reports.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-40">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#64748B] flex items-center justify-center">
                              <RefreshCcw className="w-6 h-6 animate-spin" />
                            </div>
                            <span className="text-[12px] font-black tracking-[0.3em] font-['IBM_Plex_Mono',monospace]">Awaiting Analytical Sync...</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MainLayout>
  );
}
