import { useState, useMemo } from 'react';
import {
    ShieldAlert,
    Search,
    Activity,
    ArrowRight,
    Filter,
    RefreshCw,
    Clock,
    Zap,
    LineChart as LineChartIcon,
    BarChart3,
    X,
    Target,
    BrainCircuit,
    Eye,
    AlertTriangle,
    History,
    Cpu,
    Database
} from 'lucide-react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';
import { MLExplainabilityPanel } from '@/features/analytics/components/MLExplainabilityPanel';
import { cn } from '@/shared/lib/utils';

// --- Types & Mock Data ---

interface Anomaly {
    id: string;
    device: string;
    interface: string;
    metric: string;
    value: number;
    expected: number;
    score: number;
    severity: 'Critical' | 'Major' | 'Minor';
    timestamp: string;
    status: 'Detected' | 'Analyzing' | 'Resolved';
    algo: string;
}

const mockAnomalies: Anomaly[] = [
    {
        id: 'ANOM-4021',
        device: 'Router01',
        interface: 'Gi0/1',
        metric: 'latency_ms',
        value: 65,
        expected: 10,
        score: -0.68,
        severity: 'Critical',
        timestamp: '10:15:00',
        status: 'Detected',
        algo: 'Isolation Forest'
    },
    {
        id: 'ANOM-4022',
        device: 'Router01',
        interface: 'Gi0/2',
        metric: 'cpu_pct',
        value: 85,
        expected: 40,
        score: -0.52,
        severity: 'Major',
        timestamp: '10:14:30',
        status: 'Analyzing',
        algo: 'Isolation Forest'
    },
    {
        id: 'ANOM-4023',
        device: 'Switch-NA-05',
        interface: 'Te1/1/1',
        metric: 'queue_depth',
        value: 46,
        expected: 5,
        score: -0.74,
        severity: 'Critical',
        timestamp: '10:12:00',
        status: 'Detected',
        algo: 'DBSCAN'
    },
    {
        id: 'ANOM-4024',
        device: 'Edge-FW-WA',
        interface: 'outside',
        metric: 'session_count',
        value: 4500,
        expected: 1200,
        score: -0.45,
        severity: 'Major',
        timestamp: '10:10:00',
        status: 'Detected',
        algo: 'DBSCAN'
    }
];

const mockHistoricalData = [
    { time: '09:00', actual: 8, baseline: 8 },
    { time: '09:15', actual: 10, baseline: 9 },
    { time: '09:30', actual: 9, baseline: 8 },
    { time: '09:45', actual: 12, baseline: 9 },
    { time: '10:00', actual: 11, baseline: 8 },
    { time: '10:15', actual: 65, baseline: 10 }, // Anomaly spike
];

// --- Main Component ---

export default function AnomalyDetectionPage() {
    const [selectedAnomId, setSelectedAnomId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAnomalies = useMemo(() => {
        return mockAnomalies.filter(a =>
            a.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.metric.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const selectedAnom = useMemo(() => {
        return mockAnomalies.find(a => a.id === selectedAnomId) || mockAnomalies[0];
    }, [selectedAnomId]);

    const selectedAnomalyData = useMemo(() => {
        const isIF = selectedAnom.algo === 'Isolation Forest';

        return {
            context: {
                device: selectedAnom.device,
                interface: selectedAnom.interface,
                vendor: "Cisco Systems",
                eventType: selectedAnom.metric.toUpperCase() + "_ANOMALY",
                detectionType: selectedAnom.algo + " Engine",
                timestamp: "2026-03-04 10:15:00"
            },
            metrics: {
                [selectedAnom.metric]: selectedAnom.value,
                baseline: selectedAnom.expected,
                util_pct: 82,
                queue_depth: 42,
                cpu_pct: 60,
                memory_util_pct: 62
            },
            features: [
                { name: "latency_zscore", value: Math.abs(selectedAnom.score * 10) },
                { name: "metric_delta", value: selectedAnom.value - selectedAnom.expected },
                { name: "util_moving_avg", value: 74 }
            ],
            modelDecision: {
                model: selectedAnom.algo,
                details: isIF ? {
                    score: selectedAnom.score,
                    pathLength: (selectedAnom.score < -0.4 ? 4.2 : 7.8),
                    expectedPath: 7.2,
                    trees: 100,
                    contamination: 0.05
                } : {
                    eps: 0.5,
                    minSamples: 5,
                    clusterId: 4,
                    density: "High",
                    noiseRatio: 0.02
                },
                importance: [
                    { name: selectedAnom.metric, importance: 0.65 },
                    { name: "queue_depth", importance: 0.20 },
                    { name: "cpu_pct", importance: 0.15 }
                ]
            },
            trainingMetadata: {
                datasetSize: 12400,
                featureCount: 12,
                trainingDate: "2026-02-28",
                metrics: {
                    accuracy: 0.94,
                    precision: 0.82,
                    recall: 0.88,
                    f1: 0.85
                }
            },
            pipeline: [
                { stage: "Stream Ingestion", time: "10:15:00", status: "complete" as const },
                { stage: "Normalization", time: "10:15:01", status: "complete" as const },
                { stage: "Outlier Scoring", time: "10:15:01", status: "complete" as const },
                { stage: "Cluster Evaluation", time: "10:15:02", status: "complete" as const },
                { stage: "Anomaly Dashboard", time: "10:15:02", status: "complete" as const }
            ]
        };
    }, [selectedAnom]);

    return (
        <MainLayout>
            <div className="p-6 space-y-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Behavioral Anomaly Detection</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Real-time outlier detection using unsupervised Isolation Forest models
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <History className="h-4 w-4" /> Baseline History
                        </Button>
                        <Button size="sm" className="gradient-primary gap-2">
                            <Zap className="h-4 w-4" /> Detection Settings
                        </Button>
                    </div>
                </div>

                {/* Top Grid: Main Table and Selected Info */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Anomalies Grid */}
                    <Card className={cn(
                        "border-border/50 bg-card/20 backdrop-blur-sm overflow-hidden transition-all duration-500",
                        selectedAnomId ? "xl:col-span-5" : "xl:col-span-12"
                    )}>
                        <CardHeader className="py-4 border-b border-border/40 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                                <Activity className="h-4 w-4 text-primary" />
                                Detected Outliers
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Filter outliers..."
                                    className="h-8 pl-8 text-xs bg-background/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-secondary/30">
                                    <TableRow className="hover:bg-transparent border-border/40">
                                        <TableHead className="text-[10px] font-bold uppercase py-2">Device / IF</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase py-2">Metric</TableHead>
                                        {!selectedAnomId && (
                                            <>
                                                <TableHead className="text-[10px] font-bold uppercase py-2">Observed</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase py-2">Expected</TableHead>
                                            </>
                                        )}
                                        <TableHead className="text-right text-[10px] font-bold uppercase py-2 pr-4">Anomaly Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAnomalies.map((anom) => (
                                        <TableRow
                                            key={anom.id}
                                            className={cn(
                                                "cursor-pointer transition-colors border-border/20 group",
                                                selectedAnomId === anom.id ? "bg-amber-500/10 hover:bg-amber-500/20" : "hover:bg-muted/50"
                                            )}
                                            onClick={() => setSelectedAnomId(anom.id === selectedAnomId ? null : anom.id)}
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight">{anom.device}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{anom.interface}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase shadow-sm">
                                                    {anom.metric.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            {!selectedAnomId && (
                                                <>
                                                    <TableCell className="font-mono text-xs font-bold text-foreground">
                                                        {anom.value}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                                        {anom.expected}
                                                    </TableCell>
                                                </>
                                            )}
                                            <TableCell className="text-right pr-4">
                                                <div className="inline-flex flex-col items-end gap-1">
                                                    <span className={cn(
                                                        "font-bold text-sm font-mono",
                                                        anom.score < -0.6 ? "text-red-500" : "text-amber-500"
                                                    )}>
                                                        {anom.score}
                                                    </span>
                                                    <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                                                        <div className={cn(
                                                            "h-full transition-all duration-1000",
                                                            anom.score < -0.6 ? "bg-red-500" : "bg-amber-500"
                                                        )} style={{ width: `${Math.abs(anom.score) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Detailed Explanation and Chart */}
                    {selectedAnomId && (
                        <div className="xl:col-span-7 space-y-6 animate-in slide-in-from-right-10 duration-500">

                            {/* Historical Context Chart */}
                            <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
                                <CardHeader className="py-3 bg-secondary/20 border-b border-border/40 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <LineChartIcon className="h-4 w-4 text-primary" />
                                            Metric Deviation: {selectedAnom.metric}
                                        </CardTitle>
                                        <CardDescription className="text-[10px]">Comparing observed values against 30-day dynamic baseline</CardDescription>
                                    </div>
                                    <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                                        +{Math.round(((selectedAnom.value - selectedAnom.expected) / selectedAnom.expected) * 100)}% Deviation
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-4 pt-6 h-[220px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={mockHistoricalData}>
                                            <defs>
                                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="actual"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorActual)"
                                                animationDuration={1500}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="baseline"
                                                stroke="#94a3b8"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                            />
                                            <ReferenceLine y={selectedAnom.expected} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Expected', position: 'top', fill: '#10b981', fontSize: 10 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Explainability Panel */}
                            <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden border-l-4 border-l-amber-500/50">
                                <CardHeader className="py-3 border-b border-border/40 bg-secondary/10 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="h-5 w-5 text-amber-500" />
                                        <CardTitle className="text-sm font-bold">Anomaly Explanation Engine</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedAnomId(null)} className="h-7 w-7 p-0 rounded-full">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0 overflow-y-auto max-h-[600px]">
                                    <MLExplainabilityPanel mode="anomaly" data={selectedAnomalyData} />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Live Processing Pipeline Monitoring */}
                {!selectedAnomId && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-6 duration-700 delay-200">
                        <StatsPanel label="Inference Engine" value="Isolation Forest" icon={Cpu} color="text-primary" />
                        <StatsPanel label="Samples Proc." value="1.2M / day" icon={Database} color="text-blue-500" />
                        <StatsPanel label="Proc. Latency" value="45 ms" icon={Clock} color="text-amber-500" />
                        <StatsPanel label="Confidence" value="96.5%" icon={Target} color="text-emerald-500" />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

function StatsPanel({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    return (
        <Card className="border-border/50 bg-card/40 overflow-hidden relative group hover:bg-secondary/40 transition-colors">
            <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", color)}>
                <Icon className="h-12 w-12" />
            </div>
            <CardContent className="p-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-foreground">{value}</p>
            </CardContent>
        </Card>
    );
}
