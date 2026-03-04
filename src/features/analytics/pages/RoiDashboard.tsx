
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table';
import {
    Activity,
    Zap,
    AlertTriangle,
    Clock,
    Search,
    BrainCircuit,
    TrendingUp,
    BarChart3,
    Filter,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Layers,
    ShieldCheck,
    Target,
    Workflow
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from 'recharts';
import {
    ROI_SUMMARY,
    COMPARISON_DATA,
    WATERFALL_DATA,
    EFFECTIVENESS_DATA,
    RADAR_DATA,
    TREND_DATA,
    NOISE_REDUCTION_PIE,
    FUNNEL_DATA
} from '../data/roiData';

const iconMap: Record<string, any> = {
    Activity,
    Zap,
    AlertTriangle,
    Clock,
    Search,
    BrainCircuit
};

const THEME = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    neutral: '#64748b'
};

export default function RoiDashboard() {
    return (
        <MainLayout>
            <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Intelligence ROI & Impact</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Quantifying the operational value of correlation, suppression, and AI-driven RCA. Comparing the current intelligent state vs. raw event baseline.
                    </p>
                </div>

                {/* 1. KPI Band */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {ROI_SUMMARY.map((kpi, idx) => {
                        const Icon = iconMap[kpi.icon];
                        return (
                            <Card key={idx} className="border-border/60 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all shadow-sm group">
                                <CardContent className="p-4 pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-1.5 bg-muted/50 rounded-md group-hover:bg-primary/10 transition-colors">
                                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] font-bold h-5 border-none ${kpi.trend === 'up'
                                                ? 'bg-emerald-500/15 text-emerald-500'
                                                : 'bg-blue-500/15 text-blue-500'
                                                }`}
                                        >
                                            {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                            {kpi.improvement}%
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <h3 className="text-2xl font-bold">{kpi.after}{kpi.unit}</h3>
                                            <span className="text-xs text-muted-foreground/60 line-through">from {kpi.before}{kpi.unit}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 2. Side-by-Side Comparison */}
                    <Card className="lg:col-span-4 border-border/60 bg-card/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Direct Impact Comparison
                            </CardTitle>
                            <CardDescription className="text-xs">Intelligence-driven state vs Raw Baseline Performance</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={COMPARISON_DATA} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" fontSize={11} axisLine={false} tickLine={false} width={80} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
                                    <Bar dataKey="before" name="Baseline (Raw)" fill={THEME.neutral} radius={[0, 4, 4, 0]} barSize={20} />
                                    <Bar dataKey="after" name="Optimized (Intelligent)" fill={THEME.primary} radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 3. Role of Each Process (Waterfall Representation) */}
                    <Card className="lg:col-span-8 border-border/60 bg-card/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Workflow className="h-4 w-4 text-purple-500" />
                                MTTR Reduction Contribution Path
                            </CardTitle>
                            <CardDescription className="text-xs">How each intelligence layer shaves time off the incident resolution chain</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={WATERFALL_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="process" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'MTTR (min)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[1].payload;
                                            return (
                                                <div className="bg-popover border border-border p-2 rounded-lg shadow-md text-xs">
                                                    <p className="font-bold">{data.process}</p>
                                                    <p className="text-primary">Impact: -{data.value} min</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Bar dataKey="start" stackId="a" fill="transparent" />
                                    <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
                                        {WATERFALL_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 4. Effectiveness Table */}
                    <Card className="lg:col-span-7 border-border/60 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                    Correlation Effectiveness Scorecard
                                </div>
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Overall Score: 82/100</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-border/40">
                                        <TableHead className="text-[10px] font-bold uppercase py-2">Correlation Type</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center py-2">Noise Red.</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center py-2">MTTD Red.</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center py-2">MTTR Red.</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-center py-2">RCA Accuracy</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase text-right pr-6 py-2">Value Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {EFFECTIVENESS_DATA.map((row) => (
                                        <TableRow key={row.id} className="border-border/40 hover:bg-muted/10 transition-colors">
                                            <TableCell className="font-medium py-3 text-sm">{row.type}</TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="text-xs font-mono">{row.noiseReduction}%</span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="text-xs font-mono text-blue-400">-{row.mttdReduction}%</span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="text-xs font-mono text-emerald-400">-{row.mttrReduction}%</span>
                                            </TableCell>
                                            <TableCell className="text-center py-3">
                                                <span className="text-xs">{row.rcaAccuracy}%</span>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${row.valueScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold w-6">{row.valueScore}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* 5. Radar Chart */}
                    <Card className="lg:col-span-5 border-border/60 bg-card/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4 text-warning" />
                                Logic Performance Balance
                            </CardTitle>
                            <CardDescription className="text-xs">Multi-dimensional comparison of different correlation engines</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                                    <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="ML / GNN" dataKey="ML_GNN" stroke={THEME.success} fill={THEME.success} fillOpacity={0.4} />
                                    <Radar name="Topological" dataKey="Topological" stroke={THEME.secondary} fill={THEME.secondary} fillOpacity={0.3} />
                                    <Radar name="Temporal" dataKey="Temporal" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.2} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                                    <Legend iconType="diamond" wrapperStyle={{ fontSize: '10px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 6. Temporal Trend: Alerts Before vs After */}
                    <Card className="lg:col-span-8 border-border/60 bg-card/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Volume Compression Trend
                            </CardTitle>
                            <CardDescription className="text-xs">Real-time alert volume vs processed intelligent event stream over last 24h</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TREND_DATA} margin={{ left: -10, right: 10, top: 10 }}>
                                    <defs>
                                        <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={THEME.neutral} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={THEME.neutral} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="plainline" />
                                    <Area type="monotone" dataKey="before" name="Raw Alert Volume" stroke={THEME.neutral} fillOpacity={1} fill="url(#colorBefore)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="after" name="Actionable Stream" stroke={THEME.primary} fillOpacity={1} fill="url(#colorAfter)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 7. % Noise Reduction Pie */}
                    <Card className="lg:col-span-4 border-border/60 bg-card/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4 text-blue-400" />
                                Noise Efficiency Ratio
                            </CardTitle>
                            <CardDescription className="text-xs">Actionable vs Correlated Alert Composition</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex flex-col items-center justify-center">
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={NOISE_REDUCTION_PIE}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="#1a1c2e"
                                            strokeWidth={2}
                                        >
                                            {NOISE_REDUCTION_PIE.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex gap-6 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Suppressed (75%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-warning" />
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Actionable (25%)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 8. Funnel Compression Analysis */}
                    <Card className="lg:col-span-8 border-border/60 bg-card/40 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Filter className="h-4 w-4 text-primary" />
                                Event Funnel Compression
                            </CardTitle>
                            <CardDescription className="text-xs">Analyzing the reduction from raw events to verified actionable incidents</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-4 relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 px-10 pb-6 pointer-events-none">
                                {FUNNEL_DATA.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-full border-b border-white/5 last:border-0 flex items-center justify-center"
                                        style={{
                                            height: `${100 / FUNNEL_DATA.length}%`,
                                            width: `${100 - (idx * 15)}%`,
                                            maxWidth: '90%',
                                            transition: 'all 0.5s ease-out',
                                            backgroundColor: `${item.color}22`,
                                            borderLeft: `3px solid ${item.color}`,
                                            borderRight: `3px solid ${item.color}`,
                                            marginBottom: '2px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <div className="flex flex-col items-center pointer-events-auto">
                                            <span className="text-[10px] font-bold uppercase tracking-tighter text-foreground/70">{item.name}</span>
                                            <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 9. Overall Value Score & RCA Accuracy */}
                    <Card className="lg:col-span-4 border-border/60 bg-card/40 flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                Intelligence Confidence Band
                            </CardTitle>
                            <CardDescription className="text-xs">Accuracy metrics for generated Root Cause Analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center gap-10 p-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                                        <BrainCircuit className="h-3.5 w-3.5" />
                                        RCA Accuracy (Verified)
                                    </span>
                                    <span className="text-sm font-bold text-emerald-500">88%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '88%' }} />
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[9px] text-muted-foreground italic truncate max-w-[180px]">Based on 142 resolved incidents</span>
                                    <Badge variant="outline" className="text-[9px] h-4 py-0 border-emerald-500/30 text-emerald-400">+5% vs Last Q</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-center">
                                    <div className="text-[20px] font-bold text-primary mb-1">3.5m</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Avg Diagnosis Time</div>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-center">
                                    <div className="text-[20px] font-bold text-orange-400 mb-1">4.2m</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Predictive Lead Time</div>
                                </div>
                            </div>

                            <div className="pt-2 bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-4 rounded-2xl border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center font-bold text-lg text-primary">0.82</div>
                                    <div className="flex-1">
                                        <div className="text-[11px] font-bold uppercase tracking-tight">Composite Value Score</div>
                                        <div className="text-[10px] text-muted-foreground line-clamp-1 italic">Efficiency normalized across 5 KPI dimensions.</div>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

