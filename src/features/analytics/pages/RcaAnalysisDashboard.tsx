import React from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Search,
    ArrowRight,
    Flame,
    BarChart3,
    PieChart,
    Calendar,
    Activity,
    Zap,
    BrainCircuit,
    Workflow,
    History,
    TrendingUp,
    ShieldAlert,
    Clock,
    Sparkles,
    Cpu,
    Bell,
    FileWarning,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { cn } from '@/shared/lib/utils';

// --- MOCK DATA ---
const CONTRIBUTION_DATA = [
    { name: 'Event Suppression', value: 35, color: '#06B6D4' },
    { name: 'Deduplication', value: 18, color: '#10B981' },
    { name: 'Correlation Engine', value: 24, color: '#8B5CF6' },
    { name: 'RCA Engine', value: 15, color: '#F97316' },
    { name: 'Auto Remediation', value: 12, color: '#3B82F6' },
];

const TREND_DATA = [
    { month: 'Jul', suppression: 20, dedup: 12, correlation: 18, rca: 10, remediation: 5 },
    { month: 'Aug', suppression: 24, dedup: 14, correlation: 20, rca: 12, remediation: 7 },
    { month: 'Sep', suppression: 28, dedup: 16, correlation: 22, rca: 15, remediation: 9 },
    { month: 'Oct', suppression: 32, dedup: 18, correlation: 25, rca: 18, remediation: 11 },
    { month: 'Nov', suppression: 35, dedup: 20, correlation: 28, rca: 20, remediation: 13 },
    { month: 'Dec', suppression: 38, dedup: 22, correlation: 32, rca: 22, remediation: 15 },
    { month: 'Jan', suppression: 42, dedup: 25, correlation: 35, rca: 25, remediation: 18 },
];

const RCAS_PER_DAY = [
    { day: 'Mon', value: 48 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 65 },
    { day: 'Thu', value: 58 },
    { day: 'Fri', value: 72 },
    { day: 'Sat', value: 35 },
    { day: 'Sun', value: 28 },
];

const ROOT_CAUSES = [
    { name: 'Link Flap', value: 842, color: '#06B6D4' },
    { name: 'Power Outage', value: 615, color: '#10B981' },
    { name: 'Config Drift', value: 520, color: '#8B5CF6' },
    { name: 'Capacity Exhaustion', value: 455, color: '#F97316' },
    { name: 'Software Bug', value: 390, color: '#EF4444' },
];

const TYPE_DISTRIBUTION = [
    { name: 'Network', value: 42, color: '#06B6D4' },
    { name: 'Compute', value: 25, color: '#10B981' },
    { name: 'Application', value: 18, color: '#F59E0B' },
    { name: 'Database', value: 10, color: '#EF4444' },
    { name: 'Platform', value: 5, color: '#8B5CF6' },
];

const AUTO_REMEDIATION_DATA = {
    stats: [
        { label: 'Total Attempts', value: '6,648', icon: Zap, color: '#3b82f6' },
        { label: 'Success Rate', value: '88%', icon: CheckCircle2, color: '#10b981' },
        { label: 'Failed Attempts', value: '798', icon: XCircle, color: '#ef4444' },
        { label: 'MTTR Saved', value: '63%', icon: Clock, color: '#f59e0b' },
    ],
    topFixes: [
        { name: 'Auto-restart hung services', value: 85, color: '#10B981' },
        { name: 'DNS cache flush', value: 65, color: '#10B981' },
        { name: 'Certificate rotation', value: 45, color: '#06B6D4' },
        { name: 'Load balancer drain', value: 35, color: '#F59E0B' },
        { name: 'Memory limit adjustment', value: 25, color: '#F59E0B' },
    ],
    manualFailures: [
        { name: 'DB failover timeout', count: 312, severity: 'CRITICAL', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
        { name: 'Config rollback conflict', count: 246, severity: 'HIGH', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
        { name: 'Network partition recovery', count: 240, severity: 'HIGH', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    ]
};

const HEATMAP_DATA = [
    [2, 3, 1, 4, 2],
    [5, 4, 6, 3, 7],
    [12, 15, 18, 14, 20],
    [18, 22, 25, 20, 28],
    [15, 18, 20, 16, 22],
    [8, 10, 12, 9, 14],
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

const getHeatmapColor = (val: number) => {
    if (val < 5) return 'bg-[#1E293B]/40 border-white/5';
    if (val < 10) return 'bg-emerald-500/20 border-emerald-500/30';
    if (val < 15) return 'bg-amber-500/30 border-amber-500/40 text-amber-200';
    if (val < 25) return 'bg-orange-500/40 border-orange-500/50 text-orange-100';
    return 'bg-red-500/50 border-red-500/60 text-white';
};

export default function RcaAnalysisDashboard() {
    const [activeSection, setActiveSection] = React.useState<string | null>(null);

    return (
        <MainLayout>
            <div className="p-6 space-y-8 bg-[#0B0F19] min-h-screen text-slate-200 font-['Sora',sans-serif]">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
                            <Workflow className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight underline decoration-blue-500/50 underline-offset-8">Rca Analysis <span className="text-blue-400">Dashboard</span></h1>
                        </div>
                    </div>
                </div>

                {/* 1. AI FEATURE CONTRIBUTION - REDESIGNED & ACTIONABLE */}
                <Card className="bg-[#111827]/60 border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Horizontal Bar Chart Section */}
                            <div className="lg:col-span-5 space-y-8">
                                <div>
                                    <h4 className="text-[15px] font-black text-white tracking-tight mb-1">RCA Engine Efficiency</h4>
                                    <p className="text-[9px] font-bold text-slate-600 tracking-[0.1em] mb-6">Mttr Saved (%)</p>
                                </div>
                                <div className="h-[300px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={CONTRIBUTION_DATA}
                                            layout="vertical"
                                            margin={{ left: 100, right: 40 }}
                                            onMouseMove={(state: any) => {
                                                if (state.activeLabel) setActiveSection(state.activeLabel);
                                            }}
                                            onMouseLeave={() => setActiveSection(null)}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize="10"
                                                tick={{ fill: '#94A3B8', fontWeight: 'bold', fontSize: 10 }}
                                                width={100}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-[#0F172A] border border-white/10 p-3 rounded-xl shadow-2xl">
                                                                <p className="text-[10px] font-black text-slate-500 mb-1">{data.name}</p>
                                                                <p className="text-xl font-black text-white">{data.value}% <span className="text-[10px] text-emerald-500">gain</span></p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28} className="cursor-pointer">
                                                {CONTRIBUTION_DATA.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        fillOpacity={activeSection === entry.name ? 1 : 0.6}
                                                        className="transition-all duration-300"
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {CONTRIBUTION_DATA.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveSection(item.name)}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                                                activeSection === item.name
                                                    ? "bg-white/10 border-white/20 shadow-lg -translate-y-0.5"
                                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentcolor]" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] font-black text-slate-400 tracking-tight truncate">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Improvement Trend Line Chart Section */}
                            <div className="lg:col-span-7 space-y-8">
                                <div>
                                    <h4 className="text-[15px] font-black text-white tracking-tight mb-1">Accuracy Over Time</h4>
                                    <p className="text-[9px] font-bold text-slate-600 tracking-[0.1em] mb-6">Diagnostic Precision</p>
                                </div>
                                <div className="h-[320px] bg-white/[0.01] rounded-2xl p-4 border border-white/5">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gSuppress" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} /><stop offset="95%" stopColor="#06B6D4" stopOpacity={0} /></linearGradient>
                                                <linearGradient id="gDedup" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                                                <linearGradient id="gCorr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient>
                                                <linearGradient id="gRca" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} /><stop offset="95%" stopColor="#A855F7" stopOpacity={0} /></linearGradient>
                                                <linearGradient id="gRem" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.03} />
                                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 'bold' }} />
                                            <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 'bold' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)' }}
                                                labelStyle={{ color: '#94A3B8', fontWeight: 'black', fontSize: '10px', marginBottom: '4px' }}
                                            />
                                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'black', letterSpacing: '0.05em' }} />
                                            <Area type="monotone" dataKey="suppression" name="Suppression" stroke="#06B6D4" fill="url(#gSuppress)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="dedup" name="Dedup" stroke="#10B981" fill="url(#gDedup)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="correlation" name="Correlation" stroke="#F59E0B" fill="url(#gCorr)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="rca" name="Rca" stroke="#A855F7" fill="url(#gRca)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="remediation" name="Remediation" stroke="#EF4444" fill="url(#gRem)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>                {/* 2. RCA ANALYTICS (Full Width) */}
                <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-xl shadow-xl">

                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* RCAs Per Day (Full depth) */}
                            <div className="space-y-4">
                                <span className="text-[14px] font-black text-white tracking-tight mb-4 block">Daily RCAs</span>
                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={RCAS_PER_DAY}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Root Causes */}
                            <div className="space-y-8">
                                <span className="text-[14px] font-black text-white tracking-tight mb-8 block">Common Root Causes</span>
                                <div className="space-y-6">
                                    {[
                                        { label: 'INTERFACE_FLAP', value: 842 },
                                        { label: 'DEVICE_REBOOT', value: 615 },
                                        { label: 'LINK_DOWN', value: 520 },
                                        { label: 'HIGH_LATENCY', value: 455 },
                                        { label: 'PACKET_DROP', value: 398 },
                                        { label: 'HIGH_UTIL_WARNING', value: 245 }
                                    ].map((rc, idx) => (
                                        <div key={idx} className="group cursor-pointer">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[13px] font-black text-white group-hover:text-blue-400 transition-colors tracking-wide">{rc.label.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</span>
                                                <span className="text-[10px] font-mono text-slate-500">{rc.value}</span>
                                            </div>
                                            <div className="h-1 w-full bg-[#1F2937] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#06B6D4] transition-all group-hover:brightness-125" style={{ width: `${(rc.value / 1000) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Distribution Pie */}
                            <div className="space-y-4">
                                <span className="text-[14px] font-black text-white tracking-tight mb-4 block">RCA Categories</span>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={TYPE_DISTRIBUTION}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {TYPE_DISTRIBUTION.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px' }} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                {TYPE_DISTRIBUTION.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">{item.name} ({item.value}%)</span>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. INCIDENT HEATMAP (Full Width) */}
                <Card className="bg-[#111827]/60 border-white/5 backdrop-blur-xl shadow-xl">
                    <CardHeader className="py-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-[11px] font-black tracking-[0.2em] text-white">Incident Intensity Map</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="overflow-x-auto custom-scrollbar">
                            <div className="min-w-[800px]">
                                <div className="grid grid-cols-6 gap-3">
                                    <div />
                                    {DAYS.map(d => <div key={d} className="text-[10px] font-black text-slate-400 text-center tracking-widest p-2">{d}</div>)}

                                    {HOURS.map((h, rowIdx) => (
                                        <React.Fragment key={h}>
                                            <div className="text-[10px] font-black text-slate-500 flex items-center justify-end pr-6 tracking-widest">{h}</div>
                                            {HEATMAP_DATA[rowIdx].map((val, colIdx) => (
                                                <div
                                                    key={`${rowIdx}-${colIdx}`}
                                                    className={cn(
                                                        "h-14 rounded-xl border flex items-center justify-center text-[12px] font-black transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl group relative overflow-hidden",
                                                        getHeatmapColor(val)
                                                    )}
                                                >
                                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <span className="z-10">{val}</span>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-500 tracking-widest">Low Intensity</span>
                                <div className="flex gap-3">
                                    {[2, 8, 14, 22, 28].map(v => (
                                        <div key={v} className={cn("w-6 h-6 rounded-lg border border-white/5 shadow-inner", getHeatmapColor(v))} title={`Activity: ${v}`} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-500 tracking-widest">High Intensity</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. AUTO-REMEDIATION PERFORMANCE */}
                <div className="space-y-6 pb-12">
                    <div className="flex items-center gap-3 px-1">
                        <div className="h-8 w-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        <h2 className="text-xl font-black tracking-tight text-white">Automation Performance Analytics</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: KPI Cards */}
                        <Card className="lg:col-span-4 border-white/5 bg-[#111827]/60 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between">
                            <div className="grid grid-cols-2 gap-4">
                                {AUTO_REMEDIATION_DATA.stats.map((stat, i) => (
                                    <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl group hover:bg-white/[0.05] transition-all">
                                        <div className="flex items-center gap-2 mb-2">
                                            <stat.icon size={14} style={{ color: stat.color }} />
                                            <span className="text-[10px] font-bold text-slate-500">{stat.label}</span>
                                        </div>
                                        <div className="text-2xl font-black text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500">Overall Success</span>
                                    <span className="text-xs font-black text-emerald-400">88%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all" style={{ width: '88%' }} />
                                </div>
                            </div>
                        </Card>

                        {/* Middle Column: Top Fixes */}
                        <Card className="lg:col-span-4 border-white/5 bg-[#111827]/60 backdrop-blur-xl shadow-2xl">
                            <CardHeader className="py-4 border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-[15px] font-black text-white">Top Automated Fixes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={AUTO_REMEDIATION_DATA.topFixes}
                                            layout="vertical"
                                            margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
                                        >
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                axisLine={false}
                                                tickLine={false}
                                                width={120}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                                                {AUTO_REMEDIATION_DATA.topFixes.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Right Column: Failures */}
                        <Card className="lg:col-span-4 border-white/5 bg-[#111827]/60 backdrop-blur-xl shadow-2xl">
                            <CardHeader className="py-4 border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-[15px] font-black text-white">Manual Intervention Required</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {AUTO_REMEDIATION_DATA.manualFailures.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-white/10 transition-all">
                                        <div className="space-y-1">
                                            <div className="text-[13px] font-bold text-white">{item.name}</div>
                                            <div className="text-[10px] text-slate-500">{item.count} occurrences</div>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[9px] font-black tracking-widest px-2 py-0.5", item.color)}>
                                            {item.severity}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
