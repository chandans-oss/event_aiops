
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import {
    Zap,
    Activity,
    Clock,
    ArrowRight,
    BrainCircuit,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Cpu,
    Network,
    Server,
    Search,
    Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface LiveEvent {
    id: string;
    timestamp: string;
    device: string;
    type: string;
    severity: 'Normal' | 'Warning' | 'Major' | 'Critical';
    message: string;
}

interface ActiveMatch {
    patternId: string;
    patternName: string;
    confidence: number;
    matchedSteps: string[];
    nextStepPrediction: string;
    predictionProb: number;
    relatedEvents: string[]; // IDs
}

// --- Mock Data ---

const STREAM_EVENTS: LiveEvent[] = [
    { id: 'EVT-101', timestamp: '10:59:55', device: 'Agg-SW4', type: 'METRIC_UPDATE', severity: 'Normal', message: 'CPU Util: 45%' },
    { id: 'EVT-102', timestamp: '11:00:00', device: 'Agg-SW4', type: 'CPU_HIGH', severity: 'Warning', message: 'CPU Utilization > 85% sustained' },
    { id: 'EVT-103', timestamp: '11:00:05', device: 'Core-R1', type: 'BGP_KEEPALIVE', severity: 'Normal', message: 'Neighbor 10.1.1.2 Up' },
    { id: 'EVT-104', timestamp: '11:01:12', device: 'Agg-SW4', type: 'QUEUE_DROP', severity: 'Major', message: 'Output Queue Drops detected on Gi0/1' },
];

export function CorrelationExplorer() {
    const [stream, setStream] = useState<LiveEvent[]>([]);
    const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    // Simulation Effect
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // Reset
        setStream([]);
        setActiveMatch(null);

        const runSimulation = () => {
            // Step 1: Initial Normal Events
            setTimeout(() => setStream(prev => [STREAM_EVENTS[0]]), 500);

            // Step 2: First Pattern Trigger (CPU_HIGH)
            setTimeout(() => setStream(prev => [STREAM_EVENTS[1], ...prev]), 2000);

            // Step 3: Noise
            setTimeout(() => setStream(prev => [STREAM_EVENTS[2], ...prev]), 3500);

            // Step 4: Second Pattern Trigger (QUEUE_DROP) -> MATCH DETECTED
            setTimeout(() => {
                setStream(prev => [STREAM_EVENTS[3], ...prev]);
                setActiveMatch({
                    patternId: 'PAT-SEQ-001',
                    patternName: 'Switch Congestion Cascade',
                    confidence: 92,
                    matchedSteps: ['CPU_HIGH', 'QUEUE_DROP'],
                    nextStepPrediction: 'LATENCY_HIGH',
                    predictionProb: 85,
                    relatedEvents: ['EVT-102', 'EVT-104']
                });
            }, 6000);
        };

        runSimulation();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500">

            {/* Column 1: Live Event Stream */}
            <Card className="lg:col-span-1 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm h-full overflow-hidden">
                <CardHeader className="p-4 border-b border-border/50 pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary animate-pulse" />
                            Live Ingest Stream
                        </CardTitle>
                        <Badge variant="outline" className="font-mono text-[10px] animate-pulse">LIVE</Badge>
                    </div>
                    <CardDescription className="text-xs">
                        Real-time metrics & events processing
                    </CardDescription>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-0 bg-secondary/5">
                    <div className="flex flex-col">
                        {stream.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground h-full">
                                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                <span className="text-xs">Connecting to stream...</span>
                            </div>
                        )}
                        {stream.map((evt, idx) => {
                            const isPatternMatch = activeMatch?.relatedEvents.includes(evt.id);
                            return (
                                <div
                                    key={evt.id}
                                    className={cn(
                                        "p-3 border-b border-border/50 transition-all duration-500 animate-in slide-in-from-top-2",
                                        isPatternMatch ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/50 border-l-4 border-l-transparent",
                                        idx === 0 ? "shadow-sm" : "opacity-80 scale-95 origin-top"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] px-1 h-4 font-normal",
                                                evt.severity === 'Critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                    evt.severity === 'Major' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                        evt.severity === 'Warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                            "text-primary"
                                            )}
                                        >
                                            {evt.type}
                                        </Badge>
                                        <span className="font-mono text-[10px] text-muted-foreground">{evt.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium mb-0.5">
                                        {evt.device.includes('SW') ? <Server className="h-3 w-3 text-muted-foreground" /> : <Network className="h-3 w-3 text-muted-foreground" />}
                                        {evt.device}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-tight">{evt.message}</p>

                                    {isPatternMatch && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-medium animate-in fade-in">
                                            <BrainCircuit className="h-3 w-3" />
                                            Matched: {activeMatch?.patternName}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Column 2 & 3: Active Inference Engine */}
            <div className="lg:col-span-2 flex flex-col gap-6">

                {/* 1. Pattern Matching Status */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
                    <CardHeader className="p-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider">Active Pattern Matching</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {activeMatch ? (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

                                {/* Match Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">Pattern Detected</Badge>
                                        <h3 className="text-xl font-bold text-foreground">
                                            {activeMatch.patternName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            System detected a high-confidence match ({activeMatch.confidence}%) based on live event sequence.
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">{activeMatch.confidence}%</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Confidence</div>
                                    </div>
                                </div>

                                {/* Sequence Visualization */}
                                <div className="relative pt-4 pb-8">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full z-0" />
                                    <div className="relative z-10 flex justify-between w-full max-w-2xl mx-auto">

                                        {/* Step 1: CPU_HIGH */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs Font-bold">CPU_HIGH</div>
                                                <div className="text-[10px] text-muted-foreground">Agg-SW4</div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex flex-col items-center justify-center h-10">
                                            <span className="text-[10px] text-muted-foreground bg-background px-1">~1m 12s</span>
                                        </div>

                                        {/* Step 2: QUEUE_DROP */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background animate-pulse">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-primary">QUEUE_DROP</div>
                                                <div className="text-[10px] text-muted-foreground">Agg-SW4</div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex flex-col items-center justify-center h-10">
                                            <div className="animate-pulse flex space-x-1">
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                            </div>
                                        </div>

                                        {/* Step 3: PREDICTION */}
                                        <div className="flex flex-col items-center gap-2 opacity-60">
                                            <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground border-2 border-dashed border-primary/50 flex items-center justify-center ring-4 ring-background">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold font-mono">{activeMatch.nextStepPrediction}</div>
                                                <div className="text-[10px] text-muted-foreground">Predicted</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                                <Search className="h-8 w-8 animate-pulse opacity-50" />
                                <div className="text-sm">Scanning live stream for behavioral patterns...</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Predictive Inference & Actions */}
                <div className="grid grid-cols-2 gap-6 flex-1">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Predictive Insight
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            {activeMatch ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-medium">Likelihood of {activeMatch.nextStepPrediction}</span>
                                            <span className="text-lg font-bold text-emerald-500">{activeMatch.predictionProb}%</span>
                                        </div>
                                        <Progress value={activeMatch.predictionProb} className="h-2 bg-secondary" indicatorClassName="bg-emerald-500" />
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Based on historical precedents (5 occurrences), <strong className="text-foreground">LATENCY_HIGH</strong> is expected on downstream devices within <strong className="text-foreground">2-3 minutes</strong>.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground italic">Waiting for pattern match...</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Auto-Correlation Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            {activeMatch ? (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2 text-xs">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5" />
                                        <span>Correlated <strong>2 events</strong> into Incident <strong>#INC-LIVE-001</strong></span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5" />
                                        <span>Tagged as <strong>Congestion</strong> (Bias: High)</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs opacity-75">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                                        <span>Monitoring for Downstream Latency...</span>
                                    </div>
                                    <Button size="sm" className="w-full mt-2 h-7 text-xs">View Incident #INC-LIVE-001</Button>
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground italic">No active actions.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
