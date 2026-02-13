import React, { useState, useMemo } from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceTopology } from '@/components/topology/serviceTopology';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    BrainCircuit,
    Clock,
    Database,
    Info,
    Layers,
    TrendingUp,
    Zap,
    X,
    ArrowRight,
    Monitor,
    Network,
    History,
    Target,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { cn } from "@/lib/utils";

// Mock data for performance metrics with actual and predicted values
const mockMetricsData = [
    { time: '08:00', actual: 42, predicted: 42 },
    { time: '09:00', actual: 45, predicted: 44 },
    { time: '10:00', actual: 48, predicted: 47 },
    { time: '11:00', actual: 55, predicted: 52 },
    { time: '12:00', actual: 60, predicted: 58 },
    { time: '13:00', actual: 62, predicted: 61 },
    { time: '14:00', actual: null, predicted: 65 },
    { time: '15:00', actual: null, predicted: 68 },
    { time: '16:00', actual: null, predicted: 72 },
    { time: '17:00', actual: null, predicted: 75 },
];

const mockInterfaceData = [
    { time: '08:00', actual: 120, predicted: 120 },
    { time: '09:00', actual: 135, predicted: 130 },
    { time: '10:00', actual: 150, predicted: 145 },
    { time: '11:00', actual: 180, predicted: 170 },
    { time: '12:00', actual: 210, predicted: 200 },
    { time: '13:00', actual: 230, predicted: 225 },
    { time: '14:00', actual: null, predicted: 250 },
    { time: '15:00', actual: null, predicted: 280 },
    { time: '16:00', actual: null, predicted: 310 },
    { time: '17:00', actual: null, predicted: 350 },
];

const NODE_INSIGHTS: Record<string, any> = {
    'api-gateway': {
        actualEvents: [
            { id: 'E1', type: 'Latency Spike', severity: 'critical', time: '10 mins ago', analysis: 'Unusually high processing time for /orders endpoint.', impact: 'Downstream services (order-service) experiencing wait timeouts.', correlation: 'Correlated with database lock in order-db. Pattern matches "Black Friday 2024" event.', recommendation: 'Increase connection pool size or optimize slow queries.' }
        ],
        predictedEvents: [
            { id: 'P1', type: 'Potential Throughput Breach', probability: '85%', evidence: 'Traffic growing at 12% WoW; current headroom is only 5%. Seasonal trend analysis confirms spike.', effect: 'Live effect on API Gateway latency expected to double by 14:00, impacting all web-app users.' }
        ],
        anomalyEvents: [
            { id: 'A1', type: 'Traffic Pattern Anomaly', details: 'Sudden influx of requests from unrecognized IP ranges.', impact: 'Security filters are hitting 90% CPU utilization. Potential DDoS or bot scraping.' }
        ]
    },
    'user-service': {
        actualEvents: [
            { id: 'E2', type: 'Auth Failures', severity: 'high', time: '5 mins ago', analysis: '401 Unauthorized errors spiking on login.', impact: 'User login success rate dropped by 20%.', correlation: 'Historical pattern match found during Auth Service restart (Last seen: Jan 12).', recommendation: 'Verify JWT secret rotation status and redis cache connectivity.' }
        ],
        predictedEvents: [
            { id: 'P2', type: 'Auth Service Degradation', probability: '70%', evidence: 'Thread count in auth-service rising steadily. Memory heap at 88%.', effect: 'Predicted impact on all dependent microservices if threads saturate. Login latency will increase by 4s.' }
        ],
        anomalyEvents: []
    },
    'order-db': {
        actualEvents: [
            { id: 'E3', type: 'Deadlock Detected', severity: 'critical', time: '2 mins ago', analysis: 'Circular wait between update-stock and create-order transactions.', impact: 'Total checkout failure.', correlation: 'Matches pattern seen during Flash Sale event #422. (High Correlation)', recommendation: 'Apply database patch DB-9902 or roll back recent migration.' }
        ],
        predictedEvents: [],
        anomalyEvents: [
            { id: 'A2', type: 'Storage Growth Anomaly', details: 'WAL logs growing 5x faster than normal operations.', impact: 'Disk space exhaustion predicted in 4 hours if current write rate persists.' }
        ]
    },
    'payment-service': {
        actualEvents: [],
        predictedEvents: [
            { id: 'P3', type: 'Third-party API Timeout', probability: '60%', evidence: 'Upstream payment provider (Stripe) reporting regional degradation.', effect: 'Payment processing success rate likely to drop below 90% in the next hour.' }
        ],
        anomalyEvents: [
            { id: 'A3', type: 'Response Time Jitter', details: 'Fluctuation in response times between 50ms and 2000ms.', impact: 'Inconsistent user experience during checkout.' }
        ]
    }
};

const getMetricsChart = (data: any[], color: string, label: string, unit: string) => (
    <div className="h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.2)" />
                <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}${unit}`}
                />
                <RechartsTooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="actual"
                    stroke={color}
                    fillOpacity={1}
                    fill={`url(#color${label})`}
                    strokeWidth={2}
                    name={`Actual ${label}`}
                    animationDuration={1500}
                />
                <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke={color}
                    strokeDasharray="5 5"
                    fill="transparent"
                    strokeWidth={2}
                    name={`Predicted ${label}`}
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const Topology = () => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const activeInsights = useMemo(() => {
        if (!selectedNodeId) return null;
        return NODE_INSIGHTS[selectedNodeId] || {
            actualEvents: [],
            predictedEvents: [],
            anomalyEvents: [],
            generic: true
        };
    }, [selectedNodeId]);

    return (
        <MainLayout>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
                {/* Main Content Area */}
                <div className={cn(
                    "flex-1 p-6 transition-all duration-500 ease-in-out",
                    selectedNodeId ? "pr-[450px]" : "pr-6"
                )}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Service Topology Intelligence</h1>
                            <p className="text-muted-foreground">Interactive dependency mapping and proactive insights.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="h-8 gap-1.5 px-3 bg-card/50">
                                <span className="flex h-2 w-2 rounded-full bg-status-success animate-pulse" />
                                Real-time Analysis Active
                            </Badge>
                            <div className="h-8 w-px bg-border mx-2" />
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                        AI
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Card className="border border-border/50 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden h-[calc(100vh-180px)]">
                        <CardHeader className="pb-2 border-b border-border/10 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Network className="h-4 w-4 text-primary" />
                                    Cluster Deployment View
                                </CardTitle>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                                        <div className="w-3 h-0.5 bg-primary rounded-full" /> Actual State
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                                        <div className="w-3 h-0.5 border-t-2 border-dashed border-primary/60" /> Predicted Trend
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-full p-0 relative">
                            <ServiceTopology
                                className="border-none rounded-none h-full bg-transparent"
                                onNodeClick={(id) => setSelectedNodeId(id)}
                            />
                            {!selectedNodeId && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                                    <Info className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-medium">Click on a device to see deep insights</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Insights Sidebar */}
                <div className={cn(
                    "fixed top-[64px] right-0 bottom-0 w-[450px] bg-card/95 backdrop-blur-xl border-l border-border transition-all duration-500 transform shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.1)] z-40",
                    selectedNodeId ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-muted/50 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 shadow-inner">
                                    <BrainCircuit className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg leading-tight capitalize tracking-tight">{selectedNodeId?.replace('-', ' ')}</h2>
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" /> Intelligence Hub
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedNodeId(null)}
                                className="p-2 hover:bg-muted rounded-xl transition-all active:scale-95"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                <Tabs defaultValue="events" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                                        <TabsTrigger value="events" className="text-xs rounded-lg py-2 data-[state=active]:shadow-sm">Events</TabsTrigger>
                                        <TabsTrigger value="predict" className="text-xs rounded-lg py-2 data-[state=active]:shadow-sm">Predictions</TabsTrigger>
                                        <TabsTrigger value="metrics" className="text-xs rounded-lg py-2 data-[state=active]:shadow-sm">Metrics</TabsTrigger>
                                    </TabsList>

                                    {/* EVENTS TAB */}
                                    <TabsContent value="events" className="mt-0 space-y-6 outline-none">
                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-1 rounded-full bg-status-success" />
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Actual Events</h3>
                                                </div>
                                                <Badge variant="secondary" className="text-[10px]">{activeInsights?.actualEvents.length} Active</Badge>
                                            </div>

                                            {activeInsights?.actualEvents.length > 0 ? (
                                                activeInsights.actualEvents.map((evt: any) => (
                                                    <Card key={evt.id} className="bg-muted/30 border-none shadow-none mb-4 overflow-hidden group hover:bg-muted/50 transition-colors">
                                                        <div className={cn(
                                                            "absolute left-0 top-0 bottom-0 w-1.5",
                                                            evt.severity === 'critical' ? 'bg-severity-critical' : 'bg-severity-high'
                                                        )} />
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <Badge variant="outline" className={cn(
                                                                    "text-[10px] h-5 font-bold",
                                                                    evt.severity === 'critical' ? 'bg-severity-critical/10 text-severity-critical' : 'bg-severity-high/10 text-severity-high'
                                                                )}>
                                                                    {evt.severity.toUpperCase()}
                                                                </Badge>
                                                                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                                                    <Clock className="h-3 w-3" /> {evt.time}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-bold text-base mb-3 text-foreground">{evt.type}</h4>
                                                            <div className="space-y-3">
                                                                <div className="bg-background/60 p-3 rounded-xl text-xs shadow-sm border border-border/50">
                                                                    <p className="text-primary font-bold mb-1.5 flex items-center gap-1.5 text-[11px]">
                                                                        <Target className="h-3.5 w-3.5" /> Event Analysis
                                                                    </p>
                                                                    <p className="text-foreground/90 leading-relaxed font-medium">{evt.analysis}</p>
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    <div className="bg-background/40 p-3 rounded-xl text-xs border-l-2 border-primary/50">
                                                                        <p className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-tighter">Impact Analysis</p>
                                                                        <p className="text-foreground/80 leading-relaxed">{evt.impact}</p>
                                                                    </div>
                                                                    <div className="bg-background/40 p-3 rounded-xl text-xs border-l-2 border-orange-500/50">
                                                                        <p className="text-muted-foreground font-bold mb-1 text-[10px] uppercase tracking-tighter flex items-center gap-1">
                                                                            <History className="h-3 w-3" /> Historical Pattern Correlation
                                                                        </p>
                                                                        <p className="text-foreground/80 leading-relaxed italic">{evt.correlation}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-primary/10 p-3 rounded-xl text-xs border border-primary/20 shadow-sm shadow-primary/5">
                                                                    <p className="text-primary font-black mb-1.5 flex items-center gap-1.5 text-[11px] uppercase">
                                                                        <Zap className="h-3.5 w-3.5 fill-primary" /> AI Recommendation
                                                                    </p>
                                                                    <p className="text-foreground/90 font-bold italic leading-relaxed">"{evt.recommendation}"</p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                                                    <div className="h-12 w-12 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-3">
                                                        <CheckCircle2 className="h-6 w-6 text-status-success" />
                                                    </div>
                                                    <p className="text-sm font-bold text-foreground">Operational Status: Healthy</p>
                                                    <p className="text-xs text-muted-foreground mt-1">No active critical events detected.</p>
                                                </div>
                                            )}
                                        </section>

                                        <section>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-5 w-1 rounded-full bg-amber-500" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Anomaly Insights</h3>
                                            </div>
                                            {activeInsights?.anomalyEvents.length > 0 ? (
                                                activeInsights.anomalyEvents.map((anom: any) => (
                                                    <Card key={anom.id} className="bg-amber-500/5 border border-amber-500/10 shadow-none mb-4 overflow-hidden rounded-xl">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                                <h4 className="font-bold text-sm text-foreground">{anom.type}</h4>
                                                            </div>
                                                            <p className="text-xs text-foreground/70 mb-3 leading-relaxed">{anom.details}</p>
                                                            <div className="bg-background/60 p-2.5 rounded-lg border border-amber-500/20">
                                                                <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Impact Analysis (TBD)</p>
                                                                <p className="text-xs font-medium">{anom.impact}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground text-center py-6 italic bg-muted/10 rounded-xl">Baseline consistency maintained. No anomalies detected.</p>
                                            )}
                                        </section>
                                    </TabsContent>

                                    {/* PREDICTIONS TAB */}
                                    <TabsContent value="predict" className="mt-0 space-y-6 outline-none">
                                        <div className="bg-primary/10 p-5 rounded-2xl border border-primary/20 relative overflow-hidden shadow-xl shadow-primary/5">
                                            <div className="absolute top-[-30px] right-[-30px] opacity-[0.05] rotate-12">
                                                <BrainCircuit className="h-32 w-32" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles className="h-4 w-4 text-primary fill-primary/30" />
                                                <h3 className="text-sm font-black text-primary uppercase tracking-tight">Predictive Intelligence</h3>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Advanced ML models projecting future system states from telemetry streams.</p>

                                            <div className="space-y-6">
                                                {activeInsights?.predictedEvents.length > 0 ? (
                                                    activeInsights.predictedEvents.map((pred: any) => (
                                                        <div key={pred.id} className="space-y-4 pb-6 border-b border-primary/10 last:border-0 last:pb-0">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                                    {pred.type}
                                                                </h4>
                                                                <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] px-2 font-black tracking-tighter">{pred.probability} CONFIDENCE</Badge>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div>
                                                                    <p className="text-[10px] text-primary/70 font-black uppercase mb-1.5 flex items-center gap-1 underline underline-offset-4 decoration-primary/30">
                                                                        Evidence Analysis
                                                                    </p>
                                                                    <div className="p-3 bg-background/80 rounded-xl text-xs border border-primary/10 shadow-inner italic leading-relaxed">
                                                                        "{pred.evidence}"
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-status-success/70 font-black uppercase mb-1.5 flex items-center gap-1 underline underline-offset-4 decoration-status-success/30">
                                                                        Predicted Live Effect on Topology
                                                                    </p>
                                                                    <div className="flex items-start gap-3 text-xs p-3 bg-status-success/5 rounded-xl border border-status-success/10 text-foreground/90 leading-relaxed font-medium">
                                                                        <Activity className="h-4 w-4 text-status-success mt-0.5 shrink-0" />
                                                                        {pred.effect}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-4 shadow-inner border border-border/20">
                                                            <Layers className="h-7 w-7 text-muted-foreground opacity-20" />
                                                        </div>
                                                        <p className="text-sm font-bold text-foreground">Forecast: Stable</p>
                                                        <p className="text-xs text-muted-foreground mt-1">No critical degradations predicted in the next 12h.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                                <Monitor className="h-3 w-3" /> Model Telemetry
                                            </p>
                                            <div className="flex items-center justify-between text-[11px] mb-1">
                                                <span className="text-muted-foreground">Historical R² Score</span>
                                                <span className="font-bold text-primary">0.94</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-muted-foreground">Seasonal seasonality detection</span>
                                                <span className="font-bold text-status-success">Enabled</span>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* METRICS TAB */}
                                    <TabsContent value="metrics" className="mt-0 space-y-8 outline-none pb-6">
                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <Monitor className="h-3.5 w-3.5" /> Device Performance Analysis
                                                </h3>
                                                <Badge className="text-[10px] bg-status-success/10 text-status-success border-none hover:bg-status-success/10 font-bold">
                                                    OPTIMAL
                                                </Badge>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-card glass p-4 rounded-2xl border border-border/50 shadow-sm">
                                                    <p className="text-xs font-bold text-foreground mb-1">CPU Utilization (%)</p>
                                                    <p className="text-[10px] text-muted-foreground mb-2">Trend analysis predicts 8% growth in peak load.</p>
                                                    {getMetricsChart(mockMetricsData, 'hsl(var(--primary))', 'CPU', '%')}
                                                </div>
                                                <div className="bg-card glass p-4 rounded-2xl border border-border/50 shadow-sm">
                                                    <p className="text-xs font-bold text-foreground mb-1">Memory Utilization (GB)</p>
                                                    <p className="text-[10px] text-muted-foreground mb-2">Stable growth pattern matching baseline.</p>
                                                    {getMetricsChart(mockMetricsData, '#22c55e', 'Memory', 'GB')}
                                                </div>
                                            </div>
                                        </section>

                                        <Separator className="my-2 opacity-50" />

                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <ArrowRight className="h-3.5 w-3.5 rotate-45" /> Interface Bandwidth & Latency
                                                </h3>
                                                <Badge className="text-[10px] bg-amber-500/10 text-amber-500 border-none hover:bg-amber-500/10 font-bold">
                                                    WARNING
                                                </Badge>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-card glass p-4 rounded-2xl border border-border/50 shadow-sm">
                                                    <p className="text-xs font-bold text-foreground mb-1">Ingress Bandwidth (Mbps)</p>
                                                    <p className="text-[10px] text-muted-foreground mb-2">Traffic exceeding seasonal baseline by 15%.</p>
                                                    {getMetricsChart(mockInterfaceData, '#f59e0b', 'Bandwidth', 'M')}
                                                </div>
                                                <div className="bg-card glass p-4 rounded-2xl border border-border/50 shadow-sm">
                                                    <p className="text-xs font-bold text-foreground mb-1">Network Latency (ms)</p>
                                                    <p className="text-[10px] text-muted-foreground mb-2">Projected breach of 250ms SLA in 2 hours.</p>
                                                    {getMetricsChart(mockInterfaceData, '#ef4444', 'Latency', 'ms')}
                                                </div>
                                            </div>
                                        </section>

                                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 shadow-inner">
                                            <p className="text-[10px] text-primary font-black flex items-center gap-1.5 mb-2 uppercase tracking-tight">
                                                <BarChart3 className="h-3 w-3" /> Future Trend Forecast
                                            </p>
                                            <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                                "Forecasting models indicate a potential network congestion scenario between 14:00 - 16:00. Interface bandwidth is likely to peak at 350Mbps, triggering a warning state."
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ScrollArea>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-border bg-muted/40 backdrop-blur-md">
                            <div className="flex gap-3">
                                <button className="flex-1 text-xs font-black py-3 px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 uppercase tracking-tighter">
                                    <Activity className="h-4 w-4" /> Full Diagnostic View
                                </button>
                                <button className="text-xs font-bold py-3 px-4 border border-border rounded-xl hover:bg-muted transition-all active:scale-95 flex items-center justify-center">
                                    <Layers className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Topology;
