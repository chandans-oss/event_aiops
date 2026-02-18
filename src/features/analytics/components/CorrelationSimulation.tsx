
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Slider } from '@/shared/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import {
    Activity,
    ArrowRight,
    BrainCircuit,
    RefreshCw,
    TrendingUp,
    Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// --- Types ---

interface SimulationState {
    utilization: number;
    bufferUtil: number;
    crcErrors: number;
}

interface SimulationEvent {
    id: string;
    timestamp: string;
    type: string;
    message: string;
    severity: 'Critical' | 'Major' | 'Warning' | 'Info';
}

interface PredictedEvent {
    id: string;
    timestamp: string;
    event: string;
    confidence: number;
    reason: string;
}

interface LinkProfile {
    id: string;
    name: string;
    ip: string;
    type: 'WAN' | 'Backbone' | 'Access';
    predictionTarget: 'Packet Drop' | 'Link Down';
}

const LINKS: LinkProfile[] = [
    { id: 'LNK-001', name: 'Primary WAN Uplink', ip: '203.0.113.45', type: 'WAN', predictionTarget: 'Packet Drop' },
    { id: 'LNK-002', name: 'Secure Backbone A', ip: '198.51.100.12', type: 'Backbone', predictionTarget: 'Link Down' },
    { id: 'LNK-003', name: 'Backup Link East', ip: '192.0.2.88', type: 'WAN', predictionTarget: 'Packet Drop' },
];

const THRESHOLDS = {
    util: { warning: 35, critical: 80, eventType: 'UTIL_HIGH', message: 'Interface Utilization > 80%' },
    buffer: { warning: 15, critical: 70, eventType: 'BUFF_HIGH', message: 'Buffer Utilization Spike > 70%' },
    crc: { warning: 0, critical: 10, eventType: 'CRC_ERR', message: 'CRC Errors Increasing' }
};

export function CorrelationSimulation({ onBack }: { onBack: () => void }) {
    const [selectedLink, setSelectedLink] = useState<string>(LINKS[0].id);
    const [simState, setSimState] = useState<SimulationState>({
        utilization: 30, // Initial safe values
        bufferUtil: 10,
        crcErrors: 0
    });

    const activeLink = LINKS.find(l => l.id === selectedLink) || LINKS[0];

    // Refs for accessing current state inside interval without triggering re-renders
    const stateRef = useRef(simState);
    const activeLinkRef = useRef(activeLink);

    // Update refs whenever state changes
    useEffect(() => {
        stateRef.current = simState;
        activeLinkRef.current = activeLink;
    }, [simState, activeLink]);

    // Initial History
    const [history, setHistory] = useState<any[]>(() => {
        const initial = [];
        const now = Date.now();
        for (let i = 19; i >= 0; i--) {
            initial.push({
                time: new Date(now - i * 1000).toLocaleTimeString(),
                utilization: 30,
                bufferUtil: 10,
                crcErrors: 0
            });
        }
        return initial;
    });

    const [events, setEvents] = useState<SimulationEvent[]>([]);
    const [predictions, setPredictions] = useState<PredictedEvent[]>([]);

    // Chart Configuration with Explicit Colors (Fixing empty plot issue)
    const chartConfig = {
        utilization: { label: "Utilization (%)", color: "#3b82f6" }, // Blue-500
        bufferUtil: { label: "Buffer (%)", color: "#f59e0b" },    // Amber-500
        crcErrors: { label: "CRC Errors", color: "#ef4444" },     // Red-500
    };

    // Main Simulation Loop (1-second tick)
    useEffect(() => {
        const interval = setInterval(() => {
            const currentState = stateRef.current;
            const currentLink = activeLinkRef.current;
            const timestamp = new Date().toLocaleTimeString();

            // 1. Update Chart History
            setHistory(prev => {
                const newPoint = {
                    time: timestamp,
                    utilization: currentState.utilization,
                    bufferUtil: currentState.bufferUtil,
                    crcErrors: currentState.crcErrors
                };
                return [...prev.slice(1), newPoint];
            });

            // 2. Check Events
            const checkThreshold = (val: number, threshold: number, type: string, msg: string, sev: 'Warning' | 'Major' | 'Critical') => {
                if (val > threshold) {
                    setEvents(prev => {
                        // Debounce: don't add if EXACT SAME event type exists in last 1 second
                        const recent = prev[0];
                        if (recent && recent.type === type && (Date.now() - parseInt(recent.id.split('-')[1])) < 1000) {
                            return prev;
                        }
                        return [{
                            id: `EVT-${Date.now()}-${type}`,
                            timestamp,
                            type,
                            message: msg,
                            severity: sev
                        }, ...prev].slice(0, 50);
                    });
                }
            };

            // Mapping thresholds to severities per user request for "Critical Level"
            // Util > 80 is Critical. Buffer > 70 is Major. CRC > 10 is Critical.
            checkThreshold(currentState.utilization, THRESHOLDS.util.critical, THRESHOLDS.util.eventType, THRESHOLDS.util.message, 'Critical');
            checkThreshold(currentState.bufferUtil, THRESHOLDS.buffer.critical, THRESHOLDS.buffer.eventType, THRESHOLDS.buffer.message, 'Major');
            checkThreshold(currentState.crcErrors, THRESHOLDS.crc.critical, THRESHOLDS.crc.eventType, THRESHOLDS.crc.message, 'Critical');

            // 3. Predictions logic (High Sensitivity)
            const isPatternMatching =
                currentState.utilization > THRESHOLDS.util.warning &&
                currentState.bufferUtil > THRESHOLDS.buffer.warning &&
                currentState.crcErrors > THRESHOLDS.crc.warning;

            if (isPatternMatching) {
                setPredictions(prev => {
                    const lastPred = prev[0];
                    if (!lastPred || (Date.now() - parseInt(lastPred.id.split('-')[1])) > 3000) {
                        return [{
                            id: `PRED-${Date.now()}`,
                            timestamp,
                            event: currentLink.predictionTarget,
                            confidence: 75 + Math.floor(Math.random() * 20),
                            reason: `Correlated Rise: Util(${currentState.utilization}%) + Buffer(${currentState.bufferUtil}%) + CRC(${currentState.crcErrors})`
                        }, ...prev].slice(0, 20);
                    }
                    return prev;
                });
            }

        }, 1000); // 1 second tick

        return () => clearInterval(interval);
    }, []);

    const handleReset = () => {
        setSimState({ utilization: 30, bufferUtil: 10, crcErrors: 0 });
        setEvents([]);
        setPredictions([]);
        // Reset history to clean state
        const initial = [];
        const now = Date.now();
        for (let i = 19; i >= 0; i--) {
            initial.push({
                time: new Date(now - i * 1000).toLocaleTimeString(),
                utilization: 30,
                bufferUtil: 10,
                crcErrors: 0
            });
        }
        setHistory(initial);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-right-4 duration-500 gap-6 p-1">

            {/* Header / Nav */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                            Scenario Playground
                        </h2>
                        <p className="text-sm text-muted-foreground">Interactive sandbox: Adjust metrics to verify correlation & prediction logic.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedLink} onValueChange={(val) => { setSelectedLink(val); handleReset(); }}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select Link" />
                        </SelectTrigger>
                        <SelectContent>
                            {LINKS.map(link => (
                                <SelectItem key={link.id} value={link.id}>
                                    <span className="font-mono mr-2 text-muted-foreground">{link.ip}</span>
                                    {link.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">

                {/* LEFT: Controls (Playground) */}
                <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
                    <CardHeader className="shrink-0">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Signal Generators
                        </CardTitle>
                        <CardDescription className="text-xs">Adjust sliders to simulate live telemetry changes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 flex-1 overflow-y-auto">

                        {/* Utilization */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Link Utilization</label>
                                <span className={cn("font-mono text-sm", simState.utilization > THRESHOLDS.util.critical ? "text-red-500" : "text-primary")}>
                                    {simState.utilization.toFixed(0)}%
                                </span>
                            </div>
                            <Slider
                                value={[simState.utilization]}
                                max={100}
                                step={1}
                                onValueChange={(val) => setSimState({ ...simState, utilization: val[0] })}
                                className="[&>.relative>.bg-primary]:bg-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>0%</span>
                                <span>Warn: {THRESHOLDS.util.warning}</span>
                                <span>Crit: {THRESHOLDS.util.critical}</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Buffer */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Buffer Usage</label>
                                <span className={cn("font-mono text-sm", simState.bufferUtil > THRESHOLDS.buffer.critical ? "text-orange-500" : "text-primary")}>
                                    {simState.bufferUtil.toFixed(0)}%
                                </span>
                            </div>
                            <Slider
                                value={[simState.bufferUtil]}
                                max={100}
                                step={1}
                                onValueChange={(val) => setSimState({ ...simState, bufferUtil: val[0] })}
                                className="[&>.relative>.bg-primary]:bg-amber-500"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>0%</span>
                                <span>Warn: {THRESHOLDS.buffer.warning}</span>
                                <span>Crit: {THRESHOLDS.buffer.critical}</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* CRC Errors */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">CRC Error Rate</label>
                                <span className={cn("font-mono text-sm", simState.crcErrors > THRESHOLDS.crc.critical ? "text-red-600" : "text-primary")}>
                                    {simState.crcErrors.toFixed(0)}
                                </span>
                            </div>
                            <Slider
                                value={[simState.crcErrors]}
                                max={100}
                                step={1}
                                onValueChange={(val) => setSimState({ ...simState, crcErrors: val[0] })}
                                className="[&>.relative>.bg-primary]:bg-red-500"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>0</span>
                                <span>Warn: {THRESHOLDS.crc.warning}</span>
                                <span>Crit: {THRESHOLDS.crc.critical}</span>
                                <span>100+</span>
                            </div>
                        </div>

                        <div className="pt-8 space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleReset}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset Signals
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* MIDDLE: Charts */}
                <Card className="col-span-6 border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
                    <CardHeader className="pb-2 shrink-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Real-time Telemetry
                            </CardTitle>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Utilization</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Buffer</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>CRC</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 w-full p-0">
                        {/* ChartContainer provides context for Tooltips and theming */}
                        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} hide />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="bufferUtil" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="crcErrors" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* RIGHT: Events & Prediction */}
                <div className="col-span-3 flex flex-col gap-6 h-full overflow-hidden">

                    {/* 1. Generated Events (From Thresholds) */}
                    <Card className="flex flex-col flex-1 min-h-0 border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2 border-b border-border/50 shrink-0">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Threshold Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            <div className="flex flex-col">
                                {events.length === 0 && (
                                    <div className="p-8 text-center text-xs text-muted-foreground italic opacity-50">
                                        No critical threshold violations.
                                    </div>
                                )}
                                {events.map((evt) => (
                                    <div
                                        key={evt.id}
                                        className={cn(
                                            "p-3 border-b border-border/50 text-xs animate-in fade-in slide-in-from-top-1 duration-300",
                                            evt.severity === 'Critical' ? "bg-red-500/10 border-l-4 border-l-red-500" :
                                                evt.severity === 'Major' ? "bg-orange-500/10 border-l-4 border-l-orange-500" :
                                                    "bg-secondary/10 border-l-4 border-l-blue-500"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">{evt.type}</span>
                                            <span className="font-mono text-[10px] opacity-70">{evt.timestamp}</span>
                                        </div>
                                        <p className="opacity-90">{evt.message}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Predicted Events (From Patterns) */}
                    <Card className="flex flex-col flex-1 min-h-0 border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2 border-b border-border/50 shrink-0">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Predicted Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            <div className="flex flex-col">
                                {predictions.length === 0 && (
                                    <div className="p-8 text-center text-xs text-muted-foreground italic opacity-50">
                                        No predictive patterns matched.
                                    </div>
                                )}
                                {predictions.map((pred) => (
                                    <div
                                        key={pred.id}
                                        className="p-3 border-b border-border/50 text-xs bg-emerald-500/5 border-l-4 border-l-emerald-500 animate-in fade-in slide-in-from-top-1 duration-300"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-emerald-600">PREDICTION: {pred.event}</span>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 text-emerald-600 border-emerald-200">
                                                {pred.confidence}% Conf
                                            </Badge>
                                        </div>
                                        <p className="opacity-70 italic mb-1">{pred.reason}</p>
                                        <span className="font-mono text-[10px] opacity-50">{pred.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
