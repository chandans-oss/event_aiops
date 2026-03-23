import React, { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { 
    Activity, 
    ArrowUpRight, 
    ArrowDownRight, 
    Zap, 
    AlertTriangle, 
    Clock, 
    ShieldCheck, 
    TrendingUp,
    ChevronRight,
    Search,
    BrainCircuit,
    Workflow,
    RefreshCw,
    Database,
    Layers,
    Target,
    X,
    Info,
    BarChart3
} from 'lucide-react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend
} from 'recharts';
import { cn } from '@/shared/lib/utils';

// --- MOCK DATA ---
const KPI_STATS = [
    { label: 'EVENTS PROCESSED', value: '2,482', trend: '4.9', trendType: 'up', color: '#06B6D4' },
    { label: 'NOISE REDUCED', value: '88.5%', trend: '4.2', trendType: 'up', color: '#10B981' },
    { label: 'ACTIVE INCIDENTS', value: '18', trend: '9.5', trendType: 'down', color: '#F97316' },
    { label: 'MTTR', value: '3.8m', trend: '38.2', trendType: 'down', color: '#3B82F6' },
    { label: 'AUTO-REMEDIATED', value: '72.4%', trend: '7.3', trendType: 'up', color: '#A855F7' },
    { label: 'SLA COMPLIANCE', value: '99.1%', trend: '0.3', trendType: 'up', color: '#10B981' }
];

const PIPELINE_STAGES = [
    { name: 'INGEST', value: '2,482', delta: '+4.9%', sub: '2.4s', color: 'cyan', description: 'Real-time telemetry ingestion from 128 network nodes.' },
    { name: 'NORMALIZE', value: '2,482', delta: '-0.0%', sub: '0.8s', color: 'cyan', conf: '99% conf', description: 'Data transformation and protocol normalization.' },
    { name: 'DEDUPLICATE', value: '1,845', delta: '-25.6%', sub: '1.4s', color: 'emerald', conf: '96% conf', input: '2,482 -> 1,845', description: 'Eliminating redundant signals within a 1-minute window.' },
    { name: 'SUPPRESS', value: '1,212', delta: '-34.3%', sub: '1.1s', color: 'emerald', conf: '93% conf', input: '1,845 -> 1,212', description: 'Filtering out non-actionable maintenance/log noise.' },
    { name: 'CORRELATE', value: '458', delta: '-62.2%', sub: '3.2s', color: 'purple', conf: '91% conf', input: '1,212 -> 458', description: 'Temporal and topological relationship clustering.' },
    { name: 'RCA', value: '118', delta: '-74.2%', sub: '4.5s', color: 'orange', conf: '87% conf', input: '458 -> 118', description: 'AI-driven root cause identification using failure chains.' },
    { name: 'IMPACT', value: '72', delta: '-38.9%', sub: '1.2s', color: 'orange', conf: '84% conf', input: '118 -> 72', description: 'Predictive business and service impact analysis.' },
    { name: 'REMEDIATE', value: '38', delta: '-47.2%', sub: '2.1s', color: 'blue', conf: '92% conf', input: '72 -> 38', description: 'Automated remediation playbooks and script execution.' }
];

const TREND_DATA = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    raw: 1800 + Math.random() * 600,
    deduped: 1200 + Math.random() * 400,
    suppressed: 800 + Math.random() * 200,
    actionable: 100 + Math.random() * 50,
}));

const STAGE_COLORS: Record<string, string> = {
    cyan: '#06B6D4',
    emerald: '#10B981',
    purple: '#A855F7',
    orange: '#F97316',
    blue: '#3B82F6'
};

export default function KpiDashboard() {
    const [selectedStage, setSelectedStage] = useState<any>(null);

    return (
        <MainLayout>
            <div className="p-6 space-y-8 bg-[#0B0F19] min-h-screen text-slate-200 font-['Sora',sans-serif] relative">
                
                {/* HEADER */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
                            <Activity className="h-6 w-6 text-[#3B82F6]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">KPI Dashboard</h1>
                            <p className="text-slate-400 text-[11px] font-bold tracking-[0.2em] uppercase">Intelligence Performance Metrics & Pipeline Efficiency</p>
                        </div>
                    </div>
                </div>

                {/* 1. TOP KPI BAND */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {KPI_STATS.map((kpi, idx) => (
                        <Card key={idx} className="bg-[#111827]/50 border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: kpi.color }} />
                            <CardContent className="p-5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{kpi.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-2xl font-black tracking-tighter text-white" style={{ color: kpi.color }}>{kpi.value}</h3>
                                    <div className={cn(
                                        "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full border",
                                        kpi.trendType === 'up' ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20" : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
                                    )}>
                                        {kpi.trendType === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                        {kpi.trend}% <span className="text-[8px] opacity-60 ml-1">vs prev</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 2. EVENT PROCESSING PIPELINE */}
                <Card className="bg-[#111827]/50 border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02] py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
                                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Event Processing Pipeline</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Engine Status</span>
                                <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 text-[9px] px-2 py-0">LIVE •</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 overflow-x-auto">
                        <div className="flex items-center gap-3 min-w-[1200px]">
                            {PIPELINE_STAGES.map((stage, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex-1 min-w-[140px] group cursor-pointer" onClick={() => setSelectedStage(stage)}>
                                        <div className={cn(
                                            "p-4 rounded-xl bg-[#0F172A] border transition-all duration-300 relative overflow-hidden",
                                            "border-white/5 hover:border-white/40 hover:-translate-y-1 shadow-lg active:scale-95"
                                        )}>
                                            {/* Glow Effect */}
                                            <div className="absolute top-0 right-0 w-12 h-12 -mr-6 -mt-6 rounded-full opacity-10 blur-xl transition-all group-hover:opacity-30" style={{ backgroundColor: STAGE_COLORS[stage.color] }} />
                                            
                                            <div className="space-y-3 relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{stage.name}</p>
                                                    <Info className="h-3 w-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black tracking-tighter text-white" style={{ color: STAGE_COLORS[stage.color] }}>{stage.value}</span>
                                                    {stage.input && <span className="text-[8px] text-slate-500 font-mono mt-0.5">{stage.input}</span>}
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className={cn(
                                                            "text-[9px] font-bold", 
                                                            stage.delta.startsWith('-') ? "text-[#10B981]" : "text-[#F97316]"
                                                        )}>{stage.delta}</span>
                                                        <span className={cn(
                                                            "text-[10px] font-black",
                                                            stage.delta.startsWith('-') ? "text-[#10B981]" : "text-[#F97316]"
                                                        )}>
                                                            {stage.delta.startsWith('-') ? <ArrowDownRight className="inline h-2.5 w-2.5" /> : <ArrowUpRight className="inline h-2.5 w-2.5" />}
                                                            {stage.delta.replace('-', '').replace('+', '')}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        {stage.conf && <div className="text-[8px] text-slate-500 font-bold uppercase">{stage.conf}</div>}
                                                        <div className="text-[10px] text-slate-400 font-mono">{stage.sub}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {idx < PIPELINE_STAGES.length - 1 && (
                                        <div className="flex-shrink-0">
                                            <ChevronRight className="h-5 w-5 text-slate-700" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. TREND CHART */}
                <Card className="bg-[#111827]/50 border-white/5 h-[450px]">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02] py-4">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Event Volume Trend (24H)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TREND_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradientRaw" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradientDeduped" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#475569" 
                                    fontSize="10" 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tick={{ fill: '#64748B', fontWeight: 'bold' }}
                                />
                                <YAxis 
                                    stroke="#475569" 
                                    fontSize="10" 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => Math.floor(val).toString()}
                                    tick={{ fill: '#64748B', fontWeight: 'bold' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0F172A', 
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ padding: '2px 0' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle" 
                                    wrapperStyle={{ 
                                        paddingTop: '30px', 
                                        fontSize: '10px', 
                                        fontWeight: 'black', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }} 
                                />
                                <Area type="monotone" dataKey="raw" name="Raw Events" stroke="#06B6D4" fill="url(#gradientRaw)" strokeWidth={3} />
                                <Area type="monotone" dataKey="deduped" name="Deduped" stroke="#10B981" fill="url(#gradientDeduped)" strokeWidth={2} />
                                <Area type="monotone" dataKey="suppressed" name="Suppressed" stroke="#A855F7" fill="transparent" strokeWidth={2} />
                                <Area type="monotone" dataKey="actionable" name="Actionable" stroke="#F97316" fill="transparent" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* --- PIPELINE NODE MODAL --- */}
                {selectedStage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
                            onClick={() => setSelectedStage(null)} 
                        />
                        
                        {/* Modal Content - Constrained and Scrollable */}
                        <Card className="relative w-full max-w-3xl max-h-[90vh] bg-[#0F172A] border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col font-['Sora',sans-serif]">
                            <div className="absolute top-0 left-0 w-full h-1 shrink-0" style={{ backgroundColor: STAGE_COLORS[selectedStage.color] }} />
                            
                            <CardHeader className="flex flex-row items-center justify-between py-6 shrink-0 bg-white/[0.02] border-b border-white/5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] font-black tracking-widest bg-white/5 border-white/10">PIPELINE NODE</Badge>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[selectedStage.color] }} />
                                    </div>
                                    <CardTitle className="text-2xl font-black italic tracking-tight text-white uppercase">{selectedStage.name} ANALYSIS</CardTitle>
                                    <CardDescription className="text-slate-400 font-bold text-xs uppercase tracking-wider">{selectedStage.description}</CardDescription>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    onClick={() => setSelectedStage(null)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </CardHeader>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                        <CardContent className="p-0">
                            {selectedStage.name === 'DEDUPLICATE' ? (
                                <div className="space-y-8">
                                    {/* DEDUP STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL DEDUPED</p>
                                            <p className="text-2xl font-black text-[#06B6D4]">835.4K</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">EFFICIENCY</p>
                                            <p className="text-2xl font-black text-[#10B981]">67.0%</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">METHODS</p>
                                            <p className="text-2xl font-black text-[#A855F7]">4</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Method Distribution Chart */}
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Method Distribution</p>
                                            <div className="h-[280px] w-full flex items-center justify-center relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Hash-based', value: 45, color: '#06B6D4' },
                                                                { name: 'Signature', value: 28, color: '#10B981' },
                                                                { name: 'Sliding Window', value: 15, color: '#A855F7' },
                                                                { name: 'Flap Detection', value: 12, color: '#F97316' }
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={100}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            stroke="none"
                                                        >
                                                            {[ '#06B6D4', '#10B981', '#A855F7', '#F97316' ].map((color, index) => (
                                                                <Cell key={`cell-${index}`} fill={color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                {/* Labels */}
                                                <div className="absolute left-0 bottom-0 space-y-2">
                                                    {[
                                                        { name: 'Hash-based', val: '45%', color: '#06B6D4' },
                                                        { name: 'Signature', val: '28%', color: '#10B981' },
                                                        { name: 'Sliding Window', val: '15%', color: '#A855F7' },
                                                        { name: 'Flap Detection', val: '12%', color: '#F97316' }
                                                    ].map((item) => (
                                                        <div key={item.name} className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                            <span className="text-[10px] font-bold text-slate-400 w-24">{item.name}</span>
                                                            <span className="text-[10px] font-black text-white">{item.val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Noisy Devices */}
                                        <div className="space-y-6">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Top Noisy Devices</p>
                                            <div className="space-y-4">
                                                {[
                                                    { name: 'edge-rt-03', val: '85%' },
                                                    { name: 'core-sw-01', val: '88.7%' },
                                                    { name: 'fw-ext-02', val: '86.9%' },
                                                    { name: 'lb-prod-01', val: '84.3%' },
                                                    { name: 'dns-01', val: '90.4%' }
                                                ].map((device) => (
                                                    <div key={device.name} className="space-y-1.5">
                                                        <div className="flex justify-between items-center px-1">
                                                            <span className="text-[11px] font-black text-slate-300 font-mono tracking-tight uppercase italic">{device.name}</span>
                                                            <span className="text-[11px] font-black text-[#10B981]">{device.val}</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <div 
                                                                className="h-full bg-cyan-500/80 rounded-full" 
                                                                style={{ width: device.val }} 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'SUPPRESS' ? (
                                <div className="space-y-8">
                                    {/* SUPPRESS STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL SUPPRESSED</p>
                                            <p className="text-2xl font-black text-[#F97316]">313.9K</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SUPPRESSION RATE</p>
                                            <p className="text-2xl font-black text-[#10B981]">76.1%</p>
                                        </div>
                                    </div>

                                    {/* SUPPRESS Chart */}
                                    <div className="space-y-6">
                                        <div className="h-[250px] w-full bg-[#111827]/30 rounded-xl p-6 border border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    layout="vertical" 
                                                    data={[
                                                        { name: 'Policy-Based', value: 124000, color: '#06B6D4', pct: '39.6%' },
                                                        { name: 'Topology-Based', value: 89000, color: '#10B981', pct: '28.4%' },
                                                        { name: 'Noise Reduction', value: 52000, color: '#A855F7', pct: '16.8%' },
                                                        { name: 'Threshold-Based', value: 31000, color: '#F97316', pct: '10%' },
                                                        { name: 'Pattern-Based', value: 16000, color: '#3B82F6', pct: '5.1%' }
                                                    ]} 
                                                    margin={{ left: 40, right: 40 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" fontSize={10} width={100} tick={{ fill: '#64748B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}
                                                    />
                                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                        {[ '#06B6D4', '#10B981', '#A855F7', '#F97316', '#3B82F6' ].map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Legend Bottom */}
                                        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                                            {[
                                                { name: 'Policy-Based', val: '39.6%', color: '#06B6D4' },
                                                { name: 'Topology-Based', val: '28.4%', color: '#10B981' },
                                                { name: 'Noise Reduction', val: '16.8%', color: '#A855F7' },
                                                { name: 'Threshold-Based', val: '10%', color: '#F97316' },
                                                { name: 'Pattern-Based', val: '5.1%', color: '#3B82F6' }
                                            ].map((item) => (
                                                <div key={item.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                        <span className="text-[11px] font-bold text-slate-400">{item.name}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-white">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'CORRELATE' ? (
                                <div className="space-y-8">
                                    {/* CORRELATE STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL CORRELATIONS</p>
                                            <p className="text-2xl font-black text-[#A855F7]">42.8K</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AVG. CLUSTER SIZE</p>
                                            <p className="text-2xl font-black text-white">4.2</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CLUSTERING CONF.</p>
                                            <p className="text-2xl font-black text-[#10B981]">91%</p>
                                        </div>
                                    </div>

                                    {/* Correlation Engine Distribution */}
                                    <div className="space-y-6">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Correlation Strategy Distribution</p>
                                        <div className="h-[300px] w-full bg-[#111827]/30 rounded-xl p-6 border border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    layout="vertical" 
                                                    data={[
                                                        { name: 'Causal Analysis', value: 12400, color: '#06B6D4' },
                                                        { name: 'Temporal Pattern', value: 8900, color: '#10B981' },
                                                        { name: 'Topological Logic', value: 7200, color: '#A855F7' },
                                                        { name: 'LLM Insights', value: 5800, color: '#F97316' },
                                                        { name: 'Dynamic Rules', value: 4500, color: '#3B82F6' },
                                                        { name: 'Static Rules', value: 4000, color: '#6366F1' }
                                                    ]} 
                                                    margin={{ left: 60, right: 40 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" fontSize={10} width={120} tick={{ fill: '#64748B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}
                                                    />
                                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                        {[ '#06B6D4', '#10B981', '#A855F7', '#F97316', '#3B82F6', '#6366F1' ].map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Strategy Footer */}
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                                            {[
                                                { name: 'Causal', pct: '28%', color: '#06B6D4' },
                                                { name: 'Temporal', pct: '21%', color: '#10B981' },
                                                { name: 'Topological', pct: '17%', color: '#A855F7' },
                                                { name: 'LLM-Based', pct: '14%', color: '#F97316' },
                                                { name: 'Dynamic', pct: '11%', color: '#3B82F6' },
                                                { name: 'Static', pct: '9%', color: '#6366F1' }
                                            ].map((item) => (
                                                <div key={item.name} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-white">{item.pct}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'INGEST' ? (
                                <div className="space-y-8">
                                    {/* Analysis Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE THROUGHPUT</p>
                                            <p className="text-xl font-black text-white">{selectedStage.value} events/min</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AVG LATENCY</p>
                                            <p className="text-xl font-black text-white">{selectedStage.sub}</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE CONFIDENCE</p>
                                            <p className="text-xl font-black text-emerald-500">{selectedStage.conf || '100% conf'}</p>
                                        </div>
                                    </div>

                                    {/* Multivariate Chart */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity Ingestion Performance (Multivariate)</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#EF4444]" /><span className="text-[8px] font-black text-slate-400 uppercase">Critical</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><span className="text-[8px] font-black text-slate-400 uppercase">Major</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]" /><span className="text-[8px] font-black text-slate-400 uppercase">Minor</span></div>
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] py-0">STABLE</Badge>
                                            </div>
                                        </div>
                                        <div className="h-[280px] w-full bg-[#111827]/30 rounded-xl p-4 border border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={TREND_DATA.slice(0, 12)}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                    <XAxis dataKey="time" fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                    <YAxis fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                                                    />
                                                    <Line type="monotone" dataKey="raw" stroke="#EF4444" strokeWidth={3} dot={false} name="Critical" />
                                                    <Line type="monotone" dataKey="deduped" stroke="#F59E0B" strokeWidth={2.5} dot={false} name="Major" />
                                                    <Line type="monotone" dataKey="suppressed" stroke="#3B82F6" strokeWidth={2} dot={false} name="Minor" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'NORMALIZE' ? (
                                <div className="space-y-8">
                                    {/* NORMALIZE STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MAPPING ACCURACY</p>
                                            <p className="text-2xl font-black text-[#10B981]">99.8%</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SCHEMAS APPLIED</p>
                                            <p className="text-2xl font-black text-[#3B82F6]">42</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TRANSFORM TIME</p>
                                            <p className="text-2xl font-black text-[#A855F7]">0.8ms</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Protocol Distribution */}
                                        <div className="space-y-6">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Inbound Protocol Distribution</p>
                                            <div className="space-y-4">
                                                {[
                                                    { name: 'JSON / Webhook', val: '42%', color: '#06B6D4' },
                                                    { name: 'Syslog (RFC5424)', val: '28%', color: '#10B981' },
                                                    { name: 'SNMP Traps', val: '18%', color: '#F97316' },
                                                    { name: 'Netflow / IPFIX', val: '12%', color: '#3B82F6' }
                                                ].map((proto) => (
                                                    <div key={proto.name} className="space-y-1.5">
                                                        <div className="flex justify-between items-center px-1">
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase">{proto.name}</span>
                                                            <span className="text-[11px] font-black text-white">{proto.val}</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full rounded-full transition-all duration-1000" 
                                                                style={{ width: proto.val, backgroundColor: proto.color }} 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Standardization Trend */}
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Standardization Accuracy Trend</p>
                                            <div className="h-[200px] w-full bg-[#111827]/30 rounded-xl p-4 border border-white/5">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={TREND_DATA.slice(0, 12)}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                        <XAxis dataKey="time" hide />
                                                        <YAxis hide domain={[95, 100]} />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#0F172A', border: 'none', fontSize: '10px' }}
                                                        />
                                                        <Area 
                                                            type="stepAfter" 
                                                            dataKey="raw" 
                                                            stroke="#10B981" 
                                                            fill="#10B981" 
                                                            fillOpacity={0.1} 
                                                            strokeWidth={2} 
                                                            name="Accuracy %"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                <p className="text-[10px] font-bold text-emerald-500/80 uppercase">All inbound telemetry compliant with OCSF v1.1 Schema</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'RCA' ? (
                                <div className="space-y-8">
                                    {/* RCA STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">INCIDENTS ANALYZED</p>
                                            <p className="text-2xl font-black text-[#F97316]">1,452</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MEAN TIME TO RCA</p>
                                            <p className="text-2xl font-black text-white">4.5s</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">IDENTIFICATION ACC.</p>
                                            <p className="text-2xl font-black text-[#10B981]">87%</p>
                                        </div>
                                    </div>                                    {/* Failure Origin Distribution */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Incident Root Cause Distribution</p>
                                            <div className="h-[300px] w-full bg-[#111827]/30 rounded-xl p-6 border border-white/5">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart 
                                                        layout="vertical" 
                                                        data={[
                                                            { name: 'Networking Logic', value: 420, color: '#06B6D4' },
                                                            { name: 'Hardware Failure', value: 310, color: '#EF4444' },
                                                            { name: 'Configuration Drift', value: 280, color: '#F59E0B' },
                                                            { name: 'Software Bug', value: 190, color: '#A855F7' },
                                                            { name: 'External Resource', value: 140, color: '#3B82F6' },
                                                            { name: 'Traffic Overload', value: 112, color: '#6366F1' }
                                                        ]} 
                                                        margin={{ left: 60, right: 40 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                                                        <XAxis type="number" hide />
                                                        <YAxis dataKey="name" type="category" fontSize={10} width={120} tick={{ fill: '#64748B', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                        <Tooltip 
                                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}
                                                        />
                                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                                                            {[ '#06B6D4', '#EF4444', '#F59E0B', '#A855F7', '#3B82F6', '#6366F1' ].map((color, index) => (
                                                                <Cell key={`cell-${index}`} fill={color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Temporal Remediation Efficiency (7D)</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">RCA</span></div>
                                                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">REMED</span></div>
                                                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AUTO</span></div>
                                                </div>
                                            </div>
                                            <div className="h-[300px] w-full bg-[#111827]/30 rounded-xl p-4 border border-white/5">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart 
                                                        data={[
                                                            { day: 'Mon', found: 140, remed: 120, auto: 95 },
                                                            { day: 'Tue', found: 165, remed: 150, auto: 110 },
                                                            { day: 'Wed', found: 120, remed: 105, auto: 82 },
                                                            { day: 'Thu', found: 190, remed: 175, auto: 145 },
                                                            { day: 'Fri', found: 210, remed: 195, auto: 160 },
                                                            { day: 'Sat', found: 95, remed: 88, auto: 72 },
                                                            { day: 'Sun', found: 82, remed: 75, auto: 65 }
                                                        ]}
                                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                        <XAxis 
                                                            dataKey="day" 
                                                            fontSize={10} 
                                                            tick={{ fill: '#64748B', fontWeight: 'bold' }} 
                                                            axisLine={false} 
                                                            tickLine={false} 
                                                        />
                                                        <YAxis 
                                                            fontSize={10} 
                                                            tick={{ fill: '#64748B', fontWeight: 'bold' }} 
                                                            axisLine={false} 
                                                            tickLine={false} 
                                                        />
                                                        <Tooltip 
                                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                                                        />
                                                        <Bar dataKey="found" name="RCA Found" fill="#F97316" radius={[2, 2, 0, 0]} barSize={12} />
                                                        <Bar dataKey="remed" name="Remediated" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={12} />
                                                        <Bar dataKey="auto" name="Auto-Remediated" fill="#10B981" radius={[2, 2, 0, 0]} barSize={12} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'IMPACT' ? (
                                <div className="space-y-8">
                                    {/* IMPACT STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">DEVICES AFFECTED</p>
                                            <p className="text-2xl font-black text-white">124</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SERVICES IMPACTED</p>
                                            <p className="text-2xl font-black text-[#F59E0B]">12</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MTTI (IMPACT DETECT)</p>
                                            <p className="text-2xl font-black text-[#A855F7]">1.2s</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Affected Devices Trend */}
                                        <div className="space-y-6">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Temporal Device Exposure (24H)</p>
                                            <div className="h-[280px] w-full bg-[#111827]/30 rounded-xl p-6 border border-white/5">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={TREND_DATA.slice(0, 12)}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                        <XAxis dataKey="time" fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                        <YAxis fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                                                        />
                                                        <Area 
                                                            type="monotone" 
                                                            dataKey="actionable" 
                                                            name="Impacted Devices" 
                                                            stroke="#F97316" 
                                                            fill="#F97316" 
                                                            fillOpacity={0.1} 
                                                            strokeWidth={3} 
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Service Impact Breakdown */}
                                        <div className="space-y-6">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Service Disruption Profile</p>
                                            <div className="space-y-4">
                                                {[
                                                    { name: 'Critical (Core Routing)', val: '85%', color: '#EF4444' },
                                                    { name: 'Business-Essential (Storage)', val: '42%', color: '#F59E0B' },
                                                    { name: 'Standard (Dev/Test)', val: '12%', color: '#3B82F6' },
                                                    { name: 'External API Gateway', val: '8%', color: '#A855F7' }
                                                ].map((service) => (
                                                    <div key={service.name} className="space-y-1.5">
                                                        <div className="flex justify-between items-center px-1">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-tight">{service.name}</span>
                                                            <span className="text-[10px] font-black text-white">{service.val} exposure</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <div 
                                                                className="h-full rounded-full" 
                                                                style={{ width: service.val, backgroundColor: service.color }} 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Blast Radius Warning</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                                                    Current failure chain indicates potential impact to secondary distribution layer in the next 15 minutes if unmitigated.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedStage.name === 'REMEDIATE' ? (
                                <div className="space-y-8">
                                    {/* REMEDIATE STATS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">TOTAL REMEDIATIONS</p>
                                            <p className="text-2xl font-black text-[#A855F7]">2,842</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SUCCESS RATE</p>
                                            <p className="text-2xl font-black text-[#10B981]">94.2%</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">MTTR (AUTO)</p>
                                            <p className="text-2xl font-black text-white">2.1s</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Remediation Delivery Profile (7D)</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 align-middle">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Manual Resolution</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 align-middle">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Autonomous Playbook</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-[320px] w-full bg-[#111827]/30 rounded-xl p-6 border border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart 
                                                    data={[
                                                        { day: 'Mon', manual: 42, auto: 124 },
                                                        { day: 'Tue', manual: 38, auto: 135 },
                                                        { day: 'Wed', manual: 45, auto: 118 },
                                                        { day: 'Thu', manual: 52, auto: 156 },
                                                        { day: 'Fri', manual: 48, auto: 142 },
                                                        { day: 'Sat', manual: 24, auto: 84 },
                                                        { day: 'Sun', manual: 20, auto: 76 }
                                                    ]}
                                                    margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                    <XAxis 
                                                        dataKey="day" 
                                                        fontSize={11} 
                                                        tick={{ fill: '#64748B', fontWeight: 'bold' }} 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                    />
                                                    <YAxis 
                                                        fontSize={11} 
                                                        tick={{ fill: '#64748B', fontWeight: 'bold' }} 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                                                    />
                                                    <Bar dataKey="manual" name="Manual Resolution" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={25} />
                                                    <Bar dataKey="auto" name="Autonomous Playbook" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                            <Zap className="h-4 w-4 text-blue-500" />
                                            <p className="text-[10px] font-bold text-blue-500/80 uppercase">Autonomous remediation currently handling 74% of incident volume across the environment.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Analysis Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE THROUGHPUT</p>
                                            <p className="text-xl font-black text-white">{selectedStage.value} events/min</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">AVG LATENCY</p>
                                            <p className="text-xl font-black text-white">{selectedStage.sub}</p>
                                        </div>
                                        <div className="bg-[#1E293B]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE CONFIDENCE</p>
                                            <p className="text-xl font-black text-emerald-500">{selectedStage.conf || '100% conf'}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Chart */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4 text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Node Performance (60m Window)</span>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] py-0">STABLE</Badge>
                                        </div>
                                        <div className="h-[250px] w-full bg-[#111827]/30 rounded-xl p-4 border border-white/5">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={TREND_DATA.slice(0, 12)}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                    <XAxis dataKey="time" fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                    <YAxis fontSize="9" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="raw" 
                                                        stroke={STAGE_COLORS[selectedStage.color]} 
                                                        fill={STAGE_COLORS[selectedStage.color]} 
                                                        fillOpacity={0.15} 
                                                        strokeWidth={3} 
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </div>
                        </Card>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
