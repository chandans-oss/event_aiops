
import {
    X,
    TrendingUp,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Activity,
    MoreHorizontal,
    PlayCircle,
    AlertTriangle,
    ShieldCheck,
    ArrowLeft,
    List,
    Server,
    Globe,
    Database
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Pattern, PatternOccurrence } from './PatternData';
import { useState, useEffect, Fragment } from 'react';

// --- Simulation Logic ---

const getChartConfig = (type: 'congestion' | 'cpu_spike' | 'device_cpu_saturation' | 'link_physical_degradation' | 'firewall_overload' | 'qoe_jitter') => {
    if (type === 'cpu_spike') {
        return {
            metric1: { name: 'CPU Usage %', color: '#ef4444' }, // Red
            metric2: { name: 'Control Pkt Loss', color: '#f59e0b' }, // Amber
            metric3: { name: 'BGP State (1=Up)', color: '#3b82f6' } // Blue
        };
    }
    if (type === 'device_cpu_saturation') {
        return {
            metric1: { name: 'CPU Utilization', color: '#ef4444' },
            metric2: { name: 'Ping Loss %', color: '#f59e0b' },
            metric3: { name: 'Node State', color: '#3b82f6' }
        };
    }
    if (type === 'link_physical_degradation') {
        return {
            metric1: { name: 'Input Errors', color: '#f59e0b' },
            metric2: { name: 'Frame Discards', color: '#ef4444' },
            metric3: { name: 'Link Flaps', color: '#10b981' }
        };
    }
    if (type === 'firewall_overload') {
        return {
            metric1: { name: 'Sessions', color: '#3b82f6' },
            metric2: { name: 'FW CPU %', color: '#ef4444' },
            metric3: { name: 'Latency (ms)', color: '#f59e0b' }
        };
    }
    if (type === 'qoe_jitter') {
        return {
            metric1: { name: 'Jitter (ms)', color: '#3b82f6' },
            metric2: { name: 'Latency Var', color: '#f59e0b' },
            metric3: { name: 'Drops', color: '#ef4444' }
        };
    }
    return {
        metric1: { name: 'Utilization %', color: '#3b82f6' }, // Blue
        metric2: { name: 'Queue Depth', color: '#f59e0b' }, // Amber
        metric3: { name: 'Errors', color: '#ef4444' } // Red
    };
};

const generateSimulationData = (type: 'congestion' | 'cpu_spike' | 'device_cpu_saturation' | 'link_physical_degradation' | 'firewall_overload' | 'qoe_jitter') => {
    const data = [];
    for (let i = 0; i <= 20; i++) {
        let m1, m2, m3;

        // Common organic noise component (more significant)
        const organicNoise = () => (Math.random() - 0.5) * 12; // +/- 6% variance
        const drift = Math.sin(i * 0.8) * 8; // Cyclic load pattern

        if (type === 'cpu_spike') {
            // Metric 1: CPU (Spikes at t=8)
            // Base fluctuates comfortably around 15-35%
            const baseCPU = 25 + drift;
            const spike = i > 8 ? 60 : 0;
            m1 = Math.max(5, Math.min(100, baseCPU + spike + organicNoise()));

            // Metric 2: Control Packet Loss (Starts at t=10)
            // Occasional baseline jitter (0-2%) before failure
            const baseLoss = Math.random() > 0.8 ? Math.random() * 2 : 0;
            const lossSpike = i > 10 ? (i - 10) * 8 + Math.random() * 10 : 0;
            m2 = Math.min(100, baseLoss + lossSpike);

            // Metric 3: BGP State (Binary)
            m3 = i > 14 ? 0 : 1;
        } else if (type === 'device_cpu_saturation') {
            m1 = Math.max(0, Math.min(100, 45 + drift + (i * 2.5)));
            m2 = i > 10 ? (i - 10) * 12 + organicNoise() : 0;
            m3 = i > 15 ? 0 : 1;
        } else if (type === 'link_physical_degradation') {
            m1 = i > 5 ? (i - 5) * 45 + (Math.random() * 20) : Math.random() * 5;
            m2 = i > 8 ? (i - 8) * 15 + organicNoise() : 0;
            m3 = i > 12 ? Math.floor(Math.random() * 3) : 0;
        } else if (type === 'firewall_overload') {
            m1 = 1500 + drift * 100 + (Math.pow(i, 2.7) * 40);
            m2 = Math.min(100, 30 + (i * 3.5) + organicNoise());
            m3 = i > 10 ? 10 + Math.pow(i - 10, 2) * 5 : 10;
        } else if (type === 'qoe_jitter') {
            m1 = 2 + (i * 1.5) + organicNoise() * 0.5;
            m2 = 5 + Math.pow(i, 1.2) + organicNoise();
            m3 = i > 12 ? (i - 12) * 5 : 0;
        } else {
            // Congestion
            // Metric 1: Utilization (Fluctuates heavily with load)
            const utilBase = 45 + drift;
            const utilRise = 45 / (1 + Math.exp(-0.8 * (i - 8))); // Steeper rise
            m1 = Math.max(10, Math.min(100, utilBase + utilRise + organicNoise()));

            // Metric 2: Queue Depth (Correlated with Util but bursty)
            const queueBase = Math.max(0, drift * 0.5 + organicNoise()); // 0-10 range roughly
            const queueRise = i > 8 ? (i - 8) * 5 : 0;
            m2 = Math.max(0, Math.min(100, queueBase + queueRise + organicNoise()));

            // Metric 3: Errors (CRC)
            // Occasional glitches before saturation
            const errorBase = Math.random() > 0.9 ? 1 : 0;
            const errorRise = i > 14 ? (i - 14) * 1.5 + Math.random() : 0;
            m3 = Math.floor(Math.max(0, errorBase + errorRise));
        }

        data.push({
            time: `T+${i}m`,
            metric1: Math.round(m1),
            metric2: Math.round(m2),
            metric3: Math.round(m3)
        });
    }
    return data;
};

interface PatternDetailProps {
    pattern: Pattern;
    onClose: () => void;
}

export function PatternDetail({ pattern, onClose }: PatternDetailProps) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'simulation'>('overview');
    const [manualInputs, setManualInputs] = useState({ metric1: 0, metric2: 0, metric3: 0 });
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [expandedOccurrenceId, setExpandedOccurrenceId] = useState<string | null>(null);
    const [dynamicPredictions, setDynamicPredictions] = useState(pattern.predictedEvents);
    const [timeFilter, setTimeFilter] = useState<'7D' | '1M' | '3M' | '6M' | 'ALL'>('ALL');

    const chartConfig = getChartConfig(pattern.simulationType || 'congestion');

    const filterOccurrences = (occurrences: PatternOccurrence[]) => {
        if (timeFilter === 'ALL') return occurrences;

        const now = new Date('2026-02-19'); // metadata timestamp
        const cutoff = new Date(now);

        switch (timeFilter) {
            case '7D': cutoff.setDate(now.getDate() - 7); break;
            case '1M': cutoff.setMonth(now.getMonth() - 1); break;
            case '3M': cutoff.setMonth(now.getMonth() - 3); break;
            case '6M': cutoff.setMonth(now.getMonth() - 6); break;
        }

        return occurrences.filter(occ => {
            const occDate = new Date(occ.timestamp);
            return occDate >= cutoff;
        });
    };

    const filteredOccurrences = pattern.occurrences ? filterOccurrences(pattern.occurrences) : [];

    // Initialize with some historical context, but allow manual extension
    useEffect(() => {
        // Start with a smaller subset of data for the "Live" feel
        const initialData = generateSimulationData(pattern.simulationType || 'congestion').slice(0, 5);
        setChartData(initialData);
        // Initialize inputs with the last values
        if (initialData.length > 0) {
            const last = initialData[initialData.length - 1];
            setManualInputs({
                metric1: Math.round(last.metric1),
                metric2: Math.round(last.metric2),
                metric3: Math.round(last.metric3)
            });
        }
    }, [pattern]);

    // Real-time prediction analysis based on LATEST CHART DATA (Committed)
    useEffect(() => {
        if (activeTab === 'simulation') {
            // Only show predictions if user has explicitly pushed data
            if (!hasUserInteracted || chartData.length === 0) {
                setDynamicPredictions([]);
                return;
            }

            const latestPoint = chartData[chartData.length - 1];
            const simType = pattern.simulationType || 'congestion';

            // Raw inputs
            const m1 = latestPoint.metric1; // Util or CPU (0-100)
            const m2 = latestPoint.metric2; // Queue or Loss (0-100)
            const m3 = latestPoint.metric3; // Errors or BGP State (count or binary)

            const activeEvents: any[] = [];

            if (simType === 'cpu_spike') {
                // CPU Spike Logic
                // Thresholds: CPU > 50% starts warnings
                // Critical: CPU > 85% OR BGP State = 0 (Down)

                const isBgpDown = m3 === 0;

                if (m1 > 50 || isBgpDown || m2 > 5) {
                    // Filter events based on severity/stage
                    pattern.predictedEvents?.forEach(event => {
                        let shouldShow = false;
                        let prob = 0.1;

                        if (event.name === 'BGP_SESSION_DOWN') {
                            // Only show if BGP is actually threatened
                            if (m1 > 85 || isBgpDown) shouldShow = true;
                            // Prob jumps if Down
                            prob = isBgpDown ? 0.95 : (m1 / 100);
                        } else {
                            // Other events (Route Withdrawal etc)
                            shouldShow = true;
                            // Probability
                            prob = 0.4 + (m1 * 0.005);
                        }

                        if (shouldShow) {
                            activeEvents.push({
                                ...event,
                                probability: Math.min(0.99, Math.max(0.1, prob))
                            });
                        }
                    });
                }

            } else {
                // Congestion Logic (User's primary focus)
                // "prediction comes only when all three values start increase"
                // Interactive gating:
                // Stage 1: Traffic rising (Util > 40 AND Queue > 10) -> Packet Drop
                // Stage 2: Saturation (Util > 80 OR Errors > 0) -> Link Flap

                const isTrafficRising = m1 > 40 && m2 > 10;
                const isSaturated = m1 > 80 || m3 > 2;

                if (isTrafficRising) {
                    pattern.predictedEvents?.forEach(event => {
                        let shouldShow = false;
                        let prob = 0;

                        if (event.name === 'INTERFACE_FLAP') {
                            // Only show Link Flap in Stage 2 (Saturation)
                            if (isSaturated) {
                                shouldShow = true;
                                // Probability driven by Errors (m3) and saturation
                                prob = 0.6 + (m3 * 0.05) + ((m1 - 80) * 0.01);
                            }
                        } else {
                            // PACKET_DROP / Threshold Exceeded
                            // Show immediately in Stage 1
                            shouldShow = true;
                            // Probability starts at 50% and scales with Util
                            prob = 0.5 + ((m1 - 40) * 0.01) + (m2 * 0.002);
                        }

                        if (shouldShow) {
                            activeEvents.push({
                                ...event,
                                probability: Math.min(0.99, Math.max(0.1, prob))
                            });
                        }
                    });
                }
            }

            setDynamicPredictions(activeEvents);
        } else {
            setDynamicPredictions(pattern.predictedEvents);
        }
    }, [chartData, hasUserInteracted, activeTab, pattern.predictedEvents, pattern.simulationType]);

    const injectTelemetry = () => {
        setHasUserInteracted(true);

        let nextIndex = 0;
        if (chartData.length > 0) {
            const lastTime = chartData[chartData.length - 1].time;
            // format "T+10m"
            const match = lastTime.match(/T\+(\d+)m/);
            if (match) nextIndex = parseInt(match[1]) + 1;
        } else {
            nextIndex = 0;
        }

        const newPoint = {
            time: `T+${nextIndex}m`,
            metric1: Number(manualInputs.metric1),
            metric2: Number(manualInputs.metric2),
            metric3: Number(manualInputs.metric3)
        };

        setChartData(prev => {
            const newData = [...prev, newPoint];
            // Keep only last 20 points to prevent overcrowding
            if (newData.length > 20) return newData.slice(newData.length - 20);
            return newData;
        });
    };

    const currentSimStep = chartData[chartData.length - 1] || { metric1: 0, metric2: 0, metric3: 0 };

    // Helper for Logic Step Colors
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return "bg-blue-500/10 text-blue-500";
            case 'amber': return "bg-amber-500/10 text-amber-500";
            case 'red': return "bg-red-500/10 text-red-500";
            default: return "bg-secondary/10 text-foreground";
        }
    };

    // Helper for Event Badge Colors
    const getEventBadgeStyles = (severity: string) => {
        const s = severity.toLowerCase();
        if (s === 'critical' || s === 'high') return "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20";
        if (s === 'major' || s === 'medium') return "bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 border-orange-500/20";
        if (s === 'warning' || s === 'low') return "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20";
        return "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/20";
    };

    const getPredictionValueColor = (probability: number) => {
        if (probability > 0.8) return "text-red-500";
        if (probability > 0.5) return "text-orange-500";
        return "text-blue-500";
    };


    // Notification State
    const [notification, setNotification] = useState<any | null>(null);

    // Effect to trigger notification on new predictions
    useEffect(() => {
        if (dynamicPredictions.length > 0) {
            // Priority list for critical events
            const criticalEvents = ['INTERFACE_FLAP', 'BGP_SESSION_DOWN', 'LINK_DOWN'];

            // Find highest priority event (Critical > High Probability)
            const topEvent = dynamicPredictions.reduce((prev, current) => {
                const isPrevCritical = criticalEvents.includes(prev.name);
                const isCurrCritical = criticalEvents.includes(current.name);

                // If current is critical and previous is not, switch to current
                if (isCurrCritical && !isPrevCritical) return current;
                // If previous is critical and current is not, keep previous
                if (!isCurrCritical && isPrevCritical) return prev;

                // If both are same priority tier, use probability
                return (prev.probability < current.probability) ? current : prev; // Fixed comparison to ensure max probability
            });

            // Only notify if probability is significant
            if (topEvent.probability > 0.4) {
                setNotification(topEvent);
                // Notification duration
                const timer = setTimeout(() => setNotification(null), 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [dynamicPredictions]);

    if (activeTab === 'simulation') {
        return (
            <div className="h-full flex flex-col bg-background animate-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                {/* Notification Toast */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="absolute top-20 right-4 z-50 pointer-events-none"
                        >
                            <div className="bg-background/95 backdrop-blur border border-emerald-500/30 shadow-lg shadow-emerald-500/10 rounded-xl p-4 flex gap-4 w-80">
                                <div className={`p-2 rounded-lg bg-emerald-500/10 h-fit`}>
                                    <AlertTriangle className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className={`text-[10px] px-2 py-0 h-4 ${getEventBadgeStyles(notification.severity)}`}>
                                            {notification.name}
                                        </Badge>
                                        <span className="text-xs font-bold text-emerald-500">{Math.round(notification.probability * 100)}%</span>
                                    </div>
                                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{notification.subtitle}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="border-b border-border/50 p-4 flex items-center justify-between bg-card/50">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setActiveTab('overview')} className="hover:bg-accent hover:text-accent-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight leading-none">Simulation Mode</h2>
                            <p className="text-xs text-muted-foreground mt-1">Interactive Pattern Lab: {pattern.name}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
                        Exit Simulation
                    </Button>
                </div>

                <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
                    {/* Left Panel: Chart & Predictions */}
                    <div className="col-span-9 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                        {/* Chart */}
                        <Card className="border-border/50 bg-card/40 min-h-[400px]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-muted-foreground">Real-time Telemetry & Response</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] pb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                        <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                            itemStyle={{ padding: 0 }}
                                        />
                                        <Line type="monotone" dataKey="metric1" stroke={chartConfig.metric1.color} strokeWidth={2} name={chartConfig.metric1.name} dot={true} isAnimationActive={false} />
                                        <Line type="monotone" dataKey="metric2" stroke={chartConfig.metric2.color} strokeWidth={2} name={chartConfig.metric2.name} dot={true} isAnimationActive={false} />
                                        <Line type="step" dataKey="metric3" stroke={chartConfig.metric3.color} strokeWidth={2} name={chartConfig.metric3.name} dot={true} isAnimationActive={false} />
                                        <ReferenceLine x={chartData[chartData.length - 1]?.time} stroke="white" strokeDasharray="3 3" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Predicted Events (Moved Here) */}
                        <Card className="flex-1 border-l-4 border-l-emerald-500 bg-emerald-500/5">
                            <CardHeader className="pb-2 py-3 border-b border-border/10">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Predicted Impact Log
                                    </CardTitle>
                                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">Live Analysis</span>
                                </div>
                            </CardHeader>
                            <CardContent className="py-4">
                                {((activeTab === 'simulation' && !hasUserInteracted) ? [] : dynamicPredictions)?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed border-border/30 rounded-xl h-full">
                                        <Activity className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-xs">Push telemetry data to generate impact predictions.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(activeTab === 'simulation' && !hasUserInteracted ? [] : dynamicPredictions)?.map((event, idx) => (
                                            <div key={idx} className={`relative bg-background/80 p-4 rounded-xl border border-emerald-500/20 shadow-sm transition-all duration-300 ${idx === 0 ? 'ring-1 ring-emerald-500/30' : 'opacity-90'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 h-5 ${getEventBadgeStyles(event.severity)}`}>
                                                        {event.name}
                                                    </Badge>
                                                    <div className="text-right">
                                                        <span className={`text-2xl font-bold leading-none ${getPredictionValueColor(event.probability)}`}>
                                                            {Math.round(event.probability * 100)}%
                                                        </span>
                                                        <div className="text-[10px] text-muted-foreground uppercase opacity-70 mt-1">Probability</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-base font-semibold text-foreground">{event.title}</div>
                                                    <div className="text-xs text-muted-foreground leading-snug">{event.subtitle}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Controls (Moved Here) */}
                    <div className="col-span-3 h-full overflow-y-auto">
                        <Card className="border-border/50 bg-card/40 h-full">
                            <CardHeader className="pb-2 py-3 border-b border-border/50">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Telemetry Injection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col gap-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                        {chartConfig.metric1.name}
                                        <span className="text-foreground font-mono bg-secondary/30 px-2 py-0.5 rounded">{manualInputs.metric1}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100" step="1"
                                        value={manualInputs.metric1}
                                        onChange={(e) => setManualInputs(prev => ({ ...prev, metric1: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                        {chartConfig.metric2.name}
                                        <span className="text-foreground font-mono bg-secondary/30 px-2 py-0.5 rounded">{manualInputs.metric2}</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100" step="1"
                                        value={manualInputs.metric2}
                                        onChange={(e) => setManualInputs(prev => ({ ...prev, metric2: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                        {chartConfig.metric3.name} (CRC)
                                        <span className="text-foreground font-mono bg-secondary/30 px-2 py-0.5 rounded">{manualInputs.metric3}</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="20" step="1"
                                        value={manualInputs.metric3}
                                        onChange={(e) => setManualInputs(prev => ({ ...prev, metric3: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                </div>

                                <div className="pt-6 mt-auto">
                                    <Button onClick={injectTelemetry} className="w-full" size="lg">
                                        <PlayCircle className="mr-2 h-5 w-5" />
                                        Push Data Point
                                    </Button>
                                    <div className="mt-4 text-[10px] text-center text-muted-foreground">
                                        {manualInputs.metric3 > 5 ? 'High CRC Detected due to inputs' : 'Ready to inject next time step'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm animate-in slide-in-from-right-4 duration-300">

            {/* Header */}
            <div className="border-b border-border/50 p-4 flex items-center justify-between bg-card/50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-accent hover:text-accent-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight leading-none">{pattern.name}</h2>
                                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] h-5">
                                    {pattern.confidence * 100}% Conf.
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    {pattern.domain}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    {pattern.seenCount} seen
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {pattern.lastSeen}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('simulation')}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Open Simulation
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Metric Visualization & Explanation */}
                    <div className="space-y-4">

                        {/* Consolidated Analytical Intelligence Section */}
                        <Card className="border-border/50 bg-card/40 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col">
                                    <div className="p-6 bg-background/20">
                                        {/* Header with styled line */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                                                Incident Progression Lifecycle
                                            </div>
                                            <div className="h-[1px] flex-grow bg-muted-foreground/10" />
                                        </div>

                                        <div className="flex items-stretch gap-3">
                                            {(() => {
                                                const behavioralSteps = pattern.steps.filter(s => s.name !== 'Critical Breach').map(s => ({
                                                    ...s,
                                                    description: s.description.replace('cross', '>').replace('->', '->')
                                                }));
                                                const outcomeSteps = pattern.predictedEvents.map(evt => ({
                                                    name: evt.name,
                                                    description: '', // Removing probability values
                                                    delay: '(EVENT)'
                                                }));

                                                const allFlowItems = [...behavioralSteps, ...outcomeSteps];

                                                return allFlowItems.map((item, idx) => {
                                                    const isOutcome = idx >= behavioralSteps.length;

                                                    return (
                                                        <Fragment key={idx}>
                                                            {/* Segmented Block Container */}
                                                            <div className="flex-1 flex flex-col items-center">
                                                                {/* The Block Div */}
                                                                <div className={`w-full border border-border/40 rounded-lg p-3 min-h-[60px] flex flex-col justify-center transition-all hover:bg-muted/5 group ${isOutcome ? 'bg-primary/5 border-primary/20' : 'bg-card/30'}`}>
                                                                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tight text-center truncate w-full">
                                                                        {item.name}
                                                                    </div>
                                                                    {item.description && (
                                                                        <div className="text-[10px] text-blue-400 font-bold text-center mt-1">
                                                                            ({item.description})
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Timing Pill & Connection at Bottom */}
                                                                {idx < allFlowItems.length - 1 && (
                                                                    <div className="relative w-full h-10 flex items-center mt-2">
                                                                        <div className="absolute left-[85%] translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/40 bg-muted/20 backdrop-blur-sm whitespace-nowrap z-10">
                                                                            <Clock className="h-2.5 w-2.5 text-primary/40" />
                                                                            <span className="text-[9px] font-bold text-primary/70 uppercase">
                                                                                {allFlowItems[idx + 1].delay}
                                                                            </span>
                                                                        </div>
                                                                        {/* Joining line */}
                                                                        <div className="w-[120%] h-[1px] bg-muted-foreground/10" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Centered Arrow Flow */}
                                                            {idx < allFlowItems.length - 1 && (
                                                                <div className="flex items-center justify-center h-[60px] opacity-40">
                                                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                                </div>
                                                            )}
                                                        </Fragment>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Historical Occurrences */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                <List className="h-4 w-4" />
                                Historical Occurrences
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-0.5 bg-secondary/20 p-0.5 rounded-md border border-border/50">
                                    {(['7D', '1M', '3M', '6M', 'ALL'] as const).map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setTimeFilter(tf)}
                                            className={`text-[10px] px-2 py-1 rounded transition-all ${timeFilter === tf
                                                ? 'bg-background shadow-sm text-primary font-medium'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                                                }`}
                                        >
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                                <Badge variant="secondary" className="font-mono text-[10px] h-6 px-2">
                                    {filteredOccurrences.length} Occurrences
                                </Badge>
                            </div>
                        </div>
                        <div className="border border-border/50 rounded-lg overflow-hidden bg-card/40 divide-y divide-border/50">
                            {filteredOccurrences.map((occurrence) => {
                                const isExpanded = expandedOccurrenceId === occurrence.id;
                                return (
                                    <div key={occurrence.id} className="group transition-colors bg-card/20">
                                        {/* Occurrence Header */}
                                        <div
                                            className="flex items-center gap-4 p-3 hover:bg-secondary/10 cursor-pointer select-none"
                                            onClick={() => setExpandedOccurrenceId(isExpanded ? null : occurrence.id)}
                                        >
                                            <div className={`p-1.5 rounded-md border transition-colors ${isExpanded ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/20 border-border/50 text-muted-foreground'}`}>
                                                {isExpanded ? <List className="h-4 w-4" /> : <List className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold truncate">{occurrence.timestamp}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Activity className="h-3 w-3" />
                                                        {occurrence.events.length} Events
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden bg-background/30 border-t border-border/30"
                                                >
                                                    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

                                                        {/* Left Column: Event Sequence (Simplified) */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground mb-1">
                                                                <List className="h-3 w-3" /> Event Sequence
                                                            </div>
                                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                {occurrence.events.length > 0 ? (
                                                                    occurrence.events.map((evidence, idx) => (
                                                                        <div key={idx} className="relative flex items-center gap-3 p-3 bg-card/50 border border-border/50 rounded-lg hover:bg-secondary/10 transition-colors">
                                                                            {/* Severity Strip */}
                                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${evidence.severity === 'Critical' ? 'bg-red-500' :
                                                                                evidence.severity === 'Major' ? 'bg-orange-500' : 'bg-amber-500'
                                                                                }`} />

                                                                            {/* Content */}
                                                                            <div className="flex-1 pl-2 min-w-0">
                                                                                <div className="flex justify-between items-start">
                                                                                    <span className="text-sm font-medium text-foreground truncate">{evidence.title}</span>
                                                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                                                        {evidence.timestamp.split(' ').slice(3).join(' ')}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                                                                    <span className="text-foreground/80 font-medium">{evidence.alertValue}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                                                                                    <Globe className="h-3 w-3 opacity-70" />
                                                                                    <span className="truncate max-w-[150px]">{evidence.nodeName}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="p-4 text-center text-xs text-muted-foreground italic">No discrete events recorded.</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Column: Multivariate Chart */}
                                                        <div>
                                                            {occurrence.metricData && occurrence.metricData.length > 0 ? (
                                                                <div className="space-y-3 h-full">
                                                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground mb-1">
                                                                        <TrendingUp className="h-3 w-3" />
                                                                        Multivariate Analysis <span className="normal-case opacity-50 font-normal">| {pattern.simulationType === 'congestion' ? 'Utilization vs Buffer vs Errors' : 'CPU vs BGP State'}</span>
                                                                    </div>
                                                                    <div className="h-[250px] w-full bg-card/40 border border-border/50 rounded-lg p-2">
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                            <LineChart data={occurrence.metricData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                                                                                <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} stroke="#666" />
                                                                                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#666" />
                                                                                <RechartsTooltip
                                                                                    contentStyle={{ backgroundColor: 'rgb(20, 25, 40)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px' }}
                                                                                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                                                                />
                                                                                {pattern.simulationType === 'congestion' ? (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} dot={false} name="Utilization %" activeDot={{ r: 4 }} />
                                                                                        <Line type="monotone" dataKey="drops" stroke="#ef4444" strokeWidth={2} dot={false} name="Buffer Util (Drops)" />
                                                                                        <Line type="monotone" dataKey="errors" stroke="#f59e0b" strokeWidth={2} dot={false} name="CRC Errors" />
                                                                                    </>
                                                                                ) : pattern.simulationType === 'device_cpu_saturation' ? (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="cpuUtil" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU %" />
                                                                                        <Line type="monotone" dataKey="pingLoss" stroke="#f59e0b" strokeWidth={2} dot={false} name="Ping Loss %" />
                                                                                    </>
                                                                                ) : pattern.simulationType === 'link_physical_degradation' ? (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="inErrors" stroke="#f59e0b" strokeWidth={2} dot={false} name="In Errors" />
                                                                                        <Line type="monotone" dataKey="discards" stroke="#ef4444" strokeWidth={2} dot={false} name="Discards" />
                                                                                    </>
                                                                                ) : pattern.simulationType === 'firewall_overload' ? (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} name="Sessions" />
                                                                                        <Line type="monotone" dataKey="fwCpu" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU %" />
                                                                                        <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} name="Latency" />
                                                                                    </>
                                                                                ) : pattern.simulationType === 'qoe_jitter' ? (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="jitter" stroke="#3b82f6" strokeWidth={2} dot={false} name="Jitter" />
                                                                                        <Line type="monotone" dataKey="latencyVar" stroke="#f59e0b" strokeWidth={2} dot={false} name="Latency Var" />
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU %" />
                                                                                        <Line type="step" dataKey="bgpState" stroke="#3b82f6" strokeWidth={2} dot={false} name="BGP State" />
                                                                                    </>
                                                                                )}
                                                                            </LineChart>
                                                                        </ResponsiveContainer>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic border border-dashed border-border/50 rounded-lg">
                                                                    No metric data available.
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
