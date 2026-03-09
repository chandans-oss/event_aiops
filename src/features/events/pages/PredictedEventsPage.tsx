import { useState, useMemo } from 'react';
import {
    TrendingUp,
    Search,
    Clock,
    Zap,
    Target,
    ShieldAlert,
    ArrowRight,
    Filter,
    RefreshCw,
    MoreVertical,
    CheckCircle2,
    Table as TableIcon,
    Activity,
    Cpu,
    Database,
    BarChart3,
    X
} from 'lucide-react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { SeverityIcon } from '@/shared/components/common/SeverityIcon';
import { MLExplainabilityPanel, ExplainerMode } from '@/features/analytics/components/MLExplainabilityPanel';
import { cn } from '@/shared/lib/utils';

// --- Types & Mock Data ---

interface PredictedEvent {
    id: string;
    device: string;
    interface: string;
    eventType: string;
    probability: number;
    eta: string;
    confidence: 'High' | 'Medium' | 'Low';
    status: 'Active' | 'Mitigated' | 'Critical';
    severity: 'Critical' | 'Major' | 'Minor';
    model: string;
}

const mockPredictedEvents: PredictedEvent[] = [
    {
        id: 'PRD-1025',
        device: 'Router01',
        interface: 'Gi0/1',
        eventType: 'HIGH_LATENCY',
        probability: 0.91,
        eta: '10 min',
        confidence: 'High',
        status: 'Active',
        severity: 'Critical',
        model: 'RandomForest'
    },
    {
        id: 'PRD-1026',
        device: 'Router01',
        interface: 'Gi0/2',
        eventType: 'PACKET_DROP',
        probability: 0.72,
        eta: '15 min',
        confidence: 'Medium',
        status: 'Active',
        severity: 'Major',
        model: 'RandomForest'
    },
    {
        id: 'PRD-1027',
        device: 'CoreRouter-02',
        interface: 'Te0/0/1',
        eventType: 'INTERFACE_FLAP',
        probability: 0.85,
        eta: '8 min',
        confidence: 'High',
        status: 'Active',
        severity: 'Critical',
        model: 'XGBoost'
    },
    {
        id: 'PRD-1028',
        device: 'EdgeSwitch-05',
        interface: 'Eth1/1',
        eventType: 'BUFFER_BLOAT',
        probability: 0.64,
        eta: '22 min',
        confidence: 'Medium',
        status: 'Active',
        severity: 'Minor',
        model: 'RandomForest'
    },
    {
        id: 'PRED-7005',
        device: 'Core-Router-GW',
        interface: 'Bundle-Ether1',
        eventType: 'TOPOLOGY_ISOLATION',
        probability: 0.94,
        eta: '45 min',
        confidence: 'High',
        status: 'Active',
        severity: 'Critical',
        model: 'GNN-Link'
    }
];

// --- Main Component ---

export default function PredictedEventsPage() {
    const [activeTab, setActiveTab] = useState('operational');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPredictions = useMemo(() => {
        return mockPredictedEvents.filter(p =>
            p.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.eventType.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const selectedEvent = useMemo(() => {
        return mockPredictedEvents.find(e => e.id === selectedEventId) || mockPredictedEvents[0];
    }, [selectedEventId]);

    const getExplainabilityData = (event: PredictedEvent) => {
        const isGNN = event.model === 'GNN-Link';
        const isXGB = event.model === 'XGBoost';
        const isRF = event.model === 'RandomForest';

        const baseContext = {
            device: event.device,
            interface: event.interface,
            vendor: event.device.includes('Router') ? "Cisco Systems" : "Juniper Networks",
            eventType: event.eventType,
            detectionType: isGNN ? "Topological GNN Prediction" : "AI Prediction",
            timestamp: "2026-03-04 10:15:00"
        };

        const baseMetrics = {
            util_pct: 82,
            queue_depth: 42,
            crc_errors: 12,
            latency_ms: 55,
            cpu_pct: 60,
            mem_util_pct: 62
        };

        const baseFeatures = [
            { name: "util_pct_mean", value: 72 },
            { name: "util_pct_max", value: 86 },
            { name: "queue_depth_mean", value: 30 },
            { name: "crc_errors_mean", value: 9 },
            { name: "latency_mean", value: 42 },
            { name: "cpu_mean", value: 55 },
            { name: "queue_depth_max", value: 46 }
        ];

        let modelDecision;
        if (isGNN) {
            modelDecision = {
                model: "GNN-Link",
                details: {
                    adjacencyWeight: 0.88,
                    layers: 3,
                    hops: 4,
                    loss: 0.0023
                },
                importance: [
                    { name: "Neighbor Node Centrality", importance: 0.45 },
                    { name: "Topological Proximity", importance: 0.35 },
                    { name: "Path Redundancy", importance: 0.20 }
                ]
            };
        } else if (isXGB) {
            modelDecision = {
                model: "XGBoost",
                details: {
                    probability: event.probability,
                    gain: 42.5,
                    cover: 120.2
                },
                importance: [
                    { name: "latency_trend", importance: 0.45 },
                    { name: "util_spike_count", importance: 0.25 },
                    { name: "error_delta", importance: 0.20 },
                    { name: "cpu_load", importance: 0.10 }
                ]
            };
        } else {
            modelDecision = {
                model: "Random Forest",
                details: {
                    probability: event.probability,
                    votes: { [event.eventType]: Math.round(150 * event.probability), "NORMAL": Math.round(150 * (1 - event.probability)) },
                    totalTrees: 150
                },
                importance: [
                    { name: "queue_depth_max", importance: 0.34 },
                    { name: "util_pct_max", importance: 0.28 },
                    { name: "latency_mean", importance: 0.17 },
                    { name: "crc_errors_mean", importance: 0.12 },
                    { name: "cpu_mean", importance: 0.09 }
                ]
            };
        }

        return {
            context: baseContext,
            metrics: baseMetrics,
            windowConfig: { pollInterval: 5, windowSize: 15 },
            features: baseFeatures,
            modelDecision: modelDecision,
            trainingMetadata: {
                datasetSize: isGNN ? 120000 : 8160,
                featureCount: isGNN ? 12 : 70,
                trainingDate: "2026-03-01",
                metrics: {
                    accuracy: 0.94,
                    precision: 0.91,
                    recall: 0.88,
                    f1: 0.89
                }
            },
            pipeline: [
                { stage: "Telemetry Ingestion", time: "10:15:00", status: "complete" as const },
                { stage: "Feature Engineering", time: "10:15:02", status: "complete" as const },
                { stage: "Model Inference", time: "10:15:03", status: "complete" as const },
                { stage: "Event Generation", time: "10:15:03", status: "complete" as const },
                { stage: "Dashboard Update", time: "10:15:04", status: "complete" as const }
            ]
        };
    };

    const selectedEventData = useMemo(() => {
        return getExplainabilityData(selectedEvent);
    }, [selectedEvent]);

    return (
        <MainLayout>
            <div className="p-6 space-y-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Operational AI Forecast</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Predicted network events based on real-time telemetry and behavioral patterns
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1">
                            <TabsTrigger value="operational" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                <Activity className="h-4 w-4" /> Operational
                            </TabsTrigger>
                            <TabsTrigger value="training" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                <Database className="h-4 w-4" /> Model Info
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <Tabs value={activeTab} className="mt-0">

                    {/* Operational View: Table + Explainer */}
                    <TabsContent value="operational" className="mt-0 space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                            {/* Prediction Table */}
                            <div className={cn(
                                "transition-all duration-500",
                                selectedEventId ? "xl:col-span-5" : "xl:col-span-12"
                            )}>
                                <Card className="border-border/50 bg-card/20 backdrop-blur-sm overflow-hidden h-full">
                                    <CardHeader className="py-4 border-b border-border/40 flex flex-row items-center justify-between">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <TableIcon className="h-4 w-4 text-muted-foreground" />
                                            Predicted Events
                                        </CardTitle>
                                        <div className="relative w-64">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input
                                                placeholder="Search devices..."
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
                                                    <TableHead className="w-[120px] text-[10px] font-bold uppercase">Device</TableHead>
                                                    <TableHead className="text-[10px] font-bold uppercase">Event</TableHead>
                                                    {!selectedEventId && (
                                                        <>
                                                            <TableHead className="text-[10px] font-bold uppercase">Probability</TableHead>
                                                            <TableHead className="text-[10px] font-bold uppercase">ETA</TableHead>
                                                        </>
                                                    )}
                                                    <TableHead className="text-right text-[10px] font-bold uppercase pr-4">AI Score</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredPredictions.map((event) => (
                                                    <TableRow
                                                        key={event.id}
                                                        className={cn(
                                                            "cursor-pointer transition-colors border-border/20 group",
                                                            selectedEventId === event.id ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/50"
                                                        )}
                                                        onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                                                    >
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">{event.device}</span>
                                                                <span className="text-[10px] text-muted-foreground font-mono">{event.interface}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium text-xs text-foreground uppercase tracking-wider">{event.eventType.replace('_', ' ')}</span>
                                                                <Badge className="w-fit text-[9px] h-3.5 px-1.5 py-0" variant={event.severity === 'Critical' ? 'destructive' : 'secondary'}>
                                                                    {event.severity}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        {!selectedEventId && (
                                                            <>
                                                                <TableCell>
                                                                    <div className="flex flex-col gap-1.5 w-24">
                                                                        <div className="flex justify-between text-[10px] font-bold">
                                                                            <span>PROB.</span>
                                                                            <span>{Math.round(event.probability * 100)}%</span>
                                                                        </div>
                                                                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                                                            <div className="h-full bg-primary" style={{ width: `${event.probability * 100}%` }} />
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                                                                        <Clock className="h-3 w-3" />
                                                                        {event.eta}
                                                                    </div>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        <TableCell className="text-right pr-4">
                                                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-secondary/50 border border-border/50 group-hover:border-primary/50 transition-colors">
                                                                <ArrowRight className={cn(
                                                                    "h-3.5 w-3.5 transition-transform",
                                                                    selectedEventId === event.id ? "rotate-90 text-primary" : "text-muted-foreground group-hover:text-primary"
                                                                )} />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Explainer Panel Container */}
                            {selectedEventId && (
                                <div className="xl:col-span-7 animate-in slide-in-from-right-10 duration-500">
                                    <Card className="border-border/50 bg-card/20 backdrop-blur-md overflow-hidden flex flex-col h-full border-l-4 border-l-primary/50">
                                        <CardHeader className="py-4 border-b border-border/40 bg-secondary/20 flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/20 rounded-lg">
                                                    <Cpu className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-bold">Prediction Explainability: {selectedEvent.id}</CardTitle>
                                                    <CardDescription className="text-xs">Deep dive into ML Computation & Decision Path</CardDescription>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedEventId(null)} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-1 overflow-y-auto">
                                            <MLExplainabilityPanel mode="prediction" data={selectedEventData} />
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Model Info View: Stats & Training details */}
                    <TabsContent value="training" className="mt-0 space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Training Stats Card */}
                            <Card className="lg:col-span-1 border-border/50 bg-card/40">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-primary" />
                                        Model Performance
                                    </CardTitle>
                                    <CardDescription>RandomForest Production v2.4</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <ScoreCard label="Accuracy" score={0.91} />
                                        <ScoreCard label="Precision" score={0.88} />
                                        <ScoreCard label="Recall" score={0.85} />
                                        <ScoreCard label="F1 Score" score={0.86} />
                                    </div>

                                    <Separator className="bg-border/30" />

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase">Dataset Metadata</h4>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Samples</span>
                                            <span className="font-mono font-bold">8,160 Windows</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Features Extracted</span>
                                            <span className="font-mono font-bold">70 Dimensions</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Training Horizon</span>
                                            <span className="font-mono font-bold">Last 30 Days</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Confusion Matrix Visualization */}
                            <Card className="lg:col-span-2 border-border/50 bg-card/40">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold">Confusion Matrix Analysis</CardTitle>
                                    <CardDescription>Actual vs Predicted distribution on test subset (20% holdout)</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center p-8">
                                    <div className="relative border-2 border-border/40 rounded-xl overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 left-0 bottom-0 w-12 bg-secondary/50 flex items-center justify-center border-r border-border/40">
                                            <span className="rotate-[-90deg] whitespace-nowrap text-[10px] font-black tracking-widest text-muted-foreground uppercase">ACTUAL</span>
                                        </div>
                                        <div className="pl-12">
                                            <div className="h-12 bg-secondary/50 flex flex-row border-b border-border/40">
                                                <div className="flex-1 flex items-center justify-center border-r border-border/40">
                                                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">PREDICTED EVENT</span>
                                                </div>
                                                <div className="flex-1 flex items-center justify-center">
                                                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">PREDICTED NORMAL</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="flex-1 p-8 bg-primary/10 flex flex-col items-center border-r border-border/40">
                                                    <span className="text-4xl font-black text-primary drop-shadow-sm">420</span>
                                                    <span className="text-[10px] font-bold text-primary/70 uppercase mt-2">True Positive</span>
                                                </div>
                                                <div className="flex-1 p-8 bg-destructive/5 flex flex-col items-center">
                                                    <span className="text-4xl font-black text-destructive/40 opacity-70">70</span>
                                                    <span className="text-[10px] font-bold text-destructive/70 uppercase mt-2">False Negative</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row border-t border-border/40">
                                                <div className="flex-1 p-8 bg-amber-500/5 flex flex-col items-center border-r border-border/40">
                                                    <span className="text-4xl font-black text-amber-500/40 opacity-70">90</span>
                                                    <span className="text-[10px] font-bold text-amber-500/70 uppercase mt-2">False Positive</span>
                                                </div>
                                                <div className="flex-1 p-8 bg-emerald-500/10 flex flex-col items-center">
                                                    <span className="text-4xl font-black text-emerald-500 drop-shadow-sm">1500</span>
                                                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase mt-2">True Negative</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </MainLayout>
    );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
    return (
        <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 text-center">
            <p className="text-2xl font-black text-foreground">{Math.round(score * 100)}%</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
        </div>
    );
}

function PipelineStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-mono font-bold text-foreground">{value}</span>
        </div>
    );
}
