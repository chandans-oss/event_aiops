
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import {
    Zap,
    Activity,
    Clock,
    ArrowRight,
    GitCommit,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    History
} from 'lucide-react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { cn } from '@/shared/lib/utils';

// --- Types ---

type PatternType = 'sequence' | 'metric';
type PatternStatus = 'active' | 'learning' | 'draft' | 'discarded';

interface HistoricalIncident {
    id: string;
    timestamp: string;
    device: string;
    duration: string;
    outcome: string;
}

interface Pattern {
    id: string;
    name: string;
    type: PatternType;
    status: PatternStatus;
    confidence: number;
    occurrences: number;
    lastSeen: string;
    description: string;
    sequence?: string[];
    metricTemplate?: any[];
    prediction?: {
        if: string;
        then: string;
        probability: number;
    };
    history: HistoricalIncident[];
}

// --- Mock Data ---

const PATTERNS: Pattern[] = [
    {
        id: 'PAT-SEQ-001',
        name: 'Switch Congestion Cascade',
        type: 'sequence',
        status: 'active',
        confidence: 92,
        occurrences: 12,
        lastSeen: '2 hours ago',
        description: 'High CPU utilization on Aggregation switches typically precedes queue drops and downstream latency spikes within 5 minutes.',
        sequence: ['CPU_HIGH', 'QUEUE_DROP', 'LATENCY_HIGH'],
        prediction: {
            if: 'CPU_HIGH + QUEUE_DROP',
            then: 'LATENCY_HIGH (Downstream)',
            probability: 85
        },
        history: [
            { id: 'INC-1023', timestamp: 'Today, 10:00 AM', device: 'Agg-SW1', duration: '5m', outcome: 'Verified' },
            { id: 'INC-0988', timestamp: 'Yesterday, 02:15 PM', device: 'Agg-SW2', duration: '4m', outcome: 'Verified' },
            { id: 'INC-0842', timestamp: 'Oct 24, 09:10 AM', device: 'Core-R1', duration: '8m', outcome: 'Verified' },
            { id: 'INC-0755', timestamp: 'Oct 22, 06:05 PM', device: 'Agg-SW3', duration: '6m', outcome: 'Verified' },
            { id: 'INC-0611', timestamp: 'Oct 20, 10:30 PM', device: 'Agg-SW1', duration: '5m', outcome: 'Verified' },
        ]
    },
    {
        id: 'PAT-MET-002',
        name: 'Interface Instability Precursor',
        type: 'metric',
        status: 'learning',
        confidence: 88,
        occurrences: 8,
        lastSeen: '5 hours ago',
        description: 'Gradual increase in interface utilization > 80% combined with rising buffer usage reliably predicts packet drops and eventual link flap.',
        metricTemplate: [
            { time: '0m', util: 50, buffer: 10, errors: 0 },
            { time: '3m', util: 62, buffer: 20, errors: 0 },
            { time: '6m', util: 75, buffer: 45, errors: 2 },
            { time: '9m', util: 89, buffer: 68, errors: 7 },
            { time: '12m', util: 94, buffer: 85, errors: 15 },
            { time: '15m', util: 98, buffer: 92, errors: 45, event: 'PACKET_DROP' },
        ],
        prediction: {
            if: 'Util > 85% + Buffer Rise',
            then: 'PACKET_DROP -> LINK_FLAP',
            probability: 78
        },
        history: [
            { id: 'INC-1105', timestamp: 'Today, 08:30 AM', device: 'Edge-R5', duration: '15m', outcome: 'Predicted' },
            { id: 'INC-1042', timestamp: 'Yesterday, 11:20 AM', device: 'Edge-R2', duration: '12m', outcome: 'Verified' },
            { id: 'INC-0921', timestamp: 'Oct 25, 04:15 PM', device: 'Edge-R5', duration: '18m', outcome: 'Verified' },
        ]
    }
];

// --- Components ---

export function BehavioralPatternAnalysis() {
    const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-500">

            {/* Left Sidebar: Pattern List */}
            <Card className="w-80 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
                <CardHeader className="p-4 border-b border-border/50">
                    <CardTitle className="text-base flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                        Behavioral Patterns
                    </CardTitle>
                    <CardDescription className="text-xs">
                        AI-discovered correlations from historical data
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {PATTERNS.map(pattern => (
                            <div
                                key={pattern.id}
                                onClick={() => setSelectedPattern(pattern)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all hover:bg-secondary/40",
                                    selectedPattern.id === pattern.id
                                        ? "bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20"
                                        : "bg-card border-border/30"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] px-1.5 h-5 font-normal capitalize",
                                            pattern.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                pattern.status === 'learning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""
                                        )}
                                    >
                                        {pattern.status}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{pattern.lastSeen}</span>
                                </div>
                                <h4 className="text-sm font-medium leading-tight mb-1">{pattern.name}</h4>
                                <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {pattern.occurrences} Cases
                                    </div>
                                    <div className="font-mono text-primary font-medium">
                                        {pattern.confidence}% Conf.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t border-border/50 bg-secondary/10">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        Review New Patterns (2)
                    </Button>
                </div>
            </Card>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">

                {/* Header Card */}
                <Card className="shrink-0 border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="p-4 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold">{selectedPattern.name}</h2>
                                <Badge variant="secondary" className="font-mono text-xs">{selectedPattern.id}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-3xl">{selectedPattern.description}</p>

                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">Type:</span>
                                    <Badge variant="outline" className="capitalize">{selectedPattern.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">Confidence Score:</span>
                                    <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${selectedPattern.confidence}%` }}
                                        />
                                    </div>
                                    <span className="font-medium">{selectedPattern.confidence}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">Historical Support:</span>
                                    <span className="font-medium text-foreground">{selectedPattern.occurrences} Verified Incidents</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">Discard</Button>
                            <Button size="sm" className="gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                {selectedPattern.status === 'active' ? 'Enabled' : 'Approve Pattern'}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Main Content Area */}
                <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                    <Tabs defaultValue="definition" className="h-full flex flex-col">
                        <div className="border-b border-border/50 px-4">
                            <TabsList className="bg-transparent h-12 w-full justify-start gap-4">
                                <TabsTrigger value="definition" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 border-b-2 border-transparent">
                                    <GitCommit className="h-4 w-4 mr-2" /> Pattern Definition
                                </TabsTrigger>
                                <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 border-b-2 border-transparent">
                                    <History className="h-4 w-4 mr-2" /> Historical Evidence
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1">
                            <TabsContent value="definition" className="m-0 p-6 space-y-8">

                                {/* 1. Visualization Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pattern Signature</h3>

                                    {selectedPattern.type === 'sequence' ? (
                                        <div className="flex items-center gap-4 bg-secondary/20 p-8 rounded-xl border border-border/50 justify-center overflow-x-auto">
                                            {selectedPattern.sequence?.map((step, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={cn(
                                                            "h-16 w-16 rounded-full flex items-center justify-center border-2 text-[10px] font-bold text-center shadow-lg",
                                                            i === 0 ? "bg-red-500/10 border-red-500 text-red-500" :
                                                                i === selectedPattern.sequence!.length - 1 ? "bg-primary/10 border-primary text-primary" :
                                                                    "bg-secondary border-muted-foreground/30 text-muted-foreground"
                                                        )}>
                                                            {step}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-mono">Step {i + 1}</span>
                                                    </div>
                                                    {i < selectedPattern.sequence!.length - 1 && (
                                                        <div className="flex flex-col items-center -mt-6">
                                                            <span className="text-[9px] text-muted-foreground mb-1">~2-3 min</span>
                                                            <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-[300px] w-full bg-card rounded-xl border border-border/50 p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={selectedPattern.metricTemplate} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                                    <YAxis yAxisId="left" label={{ value: 'Util %', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 10 }} />
                                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Errors', angle: 90, position: 'insideRight' }} tick={{ fontSize: 10 }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                                        labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                                    />
                                                    <Legend />
                                                    <Area yAxisId="left" type="monotone" dataKey="util" fill="hsl(var(--primary))" fillOpacity={0.1} stroke="hsl(var(--primary))" strokeWidth={2} name="Utilization %" />
                                                    <Line yAxisId="left" type="monotone" dataKey="buffer" stroke="#f59e0b" strokeWidth={2} name="Buffer %" dot={false} />
                                                    <Line yAxisId="right" type="step" dataKey="errors" stroke="#ef4444" strokeWidth={2} name="CRC Errors" dot={false} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>

                                <Separator className="bg-border/50" />

                                {/* 2. Prediction Insight */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Predictive Inference</h3>
                                    <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
                                        <div className="flex items-start gap-4">
                                            <Zap className="h-5 w-5 text-primary mt-1" />
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    If the system detects <span className="text-primary font-bold">{selectedPattern.prediction?.if}</span>...
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm">
                                                        It predicts <span className="text-foreground font-bold">{selectedPattern.prediction?.then}</span> with <span className="text-emerald-500 font-bold">{selectedPattern.prediction?.probability}% probability</span>.
                                                    </p>
                                                </div>
                                                <p className="text-xs text-muted-foreground italic mt-2">
                                                    "Based on historical patterns, a {selectedPattern.sequence ? selectedPattern.sequence[selectedPattern.sequence.length - 1] : 'Failure'} event is likely to follow within the next few minutes."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </TabsContent>

                            <TabsContent value="history" className="m-0 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Historical Occurrences ({selectedPattern.history.length})</h3>
                                        <Button variant="outline" size="sm" className="h-8 text-xs">
                                            <Activity className="h-3 w-3 mr-2" />
                                            Drill Down
                                        </Button>
                                    </div>

                                    <div className="border border-border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase font-medium">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-semibold">Incident ID</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Time Detected</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Primary Device</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Duration</th>
                                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/50">
                                                {selectedPattern.history.map((incident) => (
                                                    <tr key={incident.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-primary">{incident.id}</td>
                                                        <td className="px-4 py-3 text-foreground/80">{incident.timestamp}</td>
                                                        <td className="px-4 py-3 font-mono text-foreground/70">{incident.device}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{incident.duration}</td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-500 border-emerald-500/20">
                                                                {incident.outcome}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        * This pattern was identified by analyzing over 12,000 historical events across 45 observed incidents.
                                    </p>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
