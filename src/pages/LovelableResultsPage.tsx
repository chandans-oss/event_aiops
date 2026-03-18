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
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storedReports as initialReports } from '@/data/trainingReportData';

export default function LovelableResultsPage() {
  const navigate = useNavigate();
  // Load reports from localStorage and merge with initialReports
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('analytical_training_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure we don't duplicate the initial hardcoded report if it's already in saved
        const existingIds = new Set(parsed.map((r: any) => r.id));
        const uniqueInitial = initialReports.filter(r => !existingIds.has(r.id));
        return [...parsed, ...uniqueInitial].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (e) {
        return initialReports;
      }
    }
    return initialReports;
  });

  // Sync back to localStorage when reports change (e.g. on delete)
  useEffect(() => {
    localStorage.setItem('analytical_training_reports', JSON.stringify(reports));
  }, [reports]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this analytical report? This action cannot be undone.')) {
      setReports(reports.filter(r => r.id !== id));
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
              <span className="text-[10px] font-bold tracking-tighter text-[#3DDAB4]">SYSTEM SYNCED</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 no-scrollbar">
          <section className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Reports Section */}
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-8">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">01</span>
              <span className="text-[16px] font-bold tracking-tight uppercase tracking-[0.05em]">Analytical Training Reports</span>
            </div>
            <div className="bg-[#1E293B]/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Data Period</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Windows</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider">Exec Time</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#3B82F6]/10 rounded-lg group-hover:bg-[#3B82F6]/20 transition-colors">
                              <FileText className="w-4 h-4 text-[#3B82F6]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-white truncate max-w-[180px]" title={report.name}>{report.name}</span>
                              <span className="text-[9px] text-[#475569] font-mono">{report.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-[#94A3B8] font-medium">{report.date}</td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] text-[#CBD5E1] bg-[#1E293B] px-2 py-0.5 rounded border border-white/5">{report.duration}</span>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-[#94A3B8]">{report.dataPeriod}</td>
                        <td className="px-6 py-4 text-[11px] text-[#CBD5E1] font-mono">{report.windows}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">{report.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-[#94A3B8]">{report.execTime}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('/pattern-prediction/training-lovelable')}
                              className="p-2 bg-white/5 hover:bg-[#3B82F6] hover:text-white rounded-lg transition-all text-[#94A3B8]"
                              title="View Detailed Analytics"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 bg-white/5 hover:bg-[#3DDAB4] hover:text-[#0F172A] rounded-lg transition-all text-[#94A3B8]"
                              title="Download JSON"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="p-2 bg-white/5 hover:bg-[#EF4444] hover:text-white rounded-lg transition-all text-[#94A3B8]"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assets Grid Section */}
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3DDAB4]/50 mb-8">
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#94A3B8]">02</span>
              <span className="text-[16px] font-bold tracking-tight">COMPILED PATTERNS & ML BINARIES</span>
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
                        {m.name}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider font-bold opacity-70">
                          {m.type}
                        </span>
                        <div className="flex font-['Inter',sans-serif]">
                          <span className="text-[8px] font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20 uppercase tracking-tighter shadow-sm">
                            {m.device}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart Component */}
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
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MainLayout>
  );
}
