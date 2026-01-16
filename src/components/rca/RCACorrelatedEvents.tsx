import { ClusterSpecificData } from '@/data/clusterSpecificData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, GitBranch, Layers, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RCACorrelatedEventsProps {
    data: ClusterSpecificData;
}

const getCorrelationStrategy = (reason: string) => {
    const strategies: Record<string, string> = {
        'Direct Resource Overlap': 'Topological Hierarchy Mapping',
        'Network Congestion Propagation': 'Service Dependency Path Analytics',
        'Resource Contention': 'Co-located Resource Contention Logic',
        'Temporal & Topological Proximity': 'Spatiotemporal Clustering Engine',
        'Impact Propagation': 'Graph-Based Blast Radius Analysis'
    };
    return strategies[reason] || 'Pattern Matching Engine';
};

export function RCACorrelatedEvents({ data }: RCACorrelatedEventsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <Card className="bg-secondary/10 border-primary/20">
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-primary">
                            <Layers className="h-4 w-4" />
                            Correlation Intelligence
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-[10px] bg-background/50">Temporal Multi-window (±5s)</Badge>
                            <Badge variant="outline" className="text-[10px] bg-background/50">Topological Centrality</Badge>
                            <Badge variant="outline" className="text-[10px] bg-background/50">Service Dependency Graph</Badge>
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">ML Similarity Model v4.2 (95%)</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                    {/* Root Event - Visualized as Parent */}
                    <div className="relative pl-6 border-l-2 border-primary/50">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background ring-2 ring-primary/20" />
                        <Card className="border-primary/30 shadow-sm bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <Badge className="mb-2 bg-primary hover:bg-primary text-[10px] h-5">Root Cause</Badge>
                                        <h4 className="font-bold text-base text-foreground tracking-tight">{data.rcaMetadata.rootEventType.replace(/_/g, ' ')}</h4>
                                    </div>
                                    <Badge variant="outline" className="font-mono bg-background text-[10px] tabular-nums">{data.rcaMetadata.rootEventId}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground/80">{data.rcaMetadata.device}</span>
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                    <span>Monitoring Active</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Child Events */}
                    {data.correlatedChildEvents.map((event, index) => (
                        <div key={event.id} className="relative pl-6 border-l-2 border-border/50 ml-2">
                            <div className="absolute -left-[2px] top-8 w-4 h-[2px] bg-border/50" /> {/* Branch line */}
                            <div className="relative">
                                <Card className="hover:bg-secondary/30 transition-all duration-200 border-border/50 hover:border-primary/20 group">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                                                    <AlertCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-sm group-hover:text-foreground transition-colors">{event.alertType.replace(/_/g, ' ')}</h4>
                                                        <Badge variant="secondary" className={cn(
                                                            "text-[9px] px-1.5 py-0 h-4 uppercase font-bold tracking-tighter",
                                                            event.severity === 'Critical' && "bg-red-500/10 text-red-500 border border-red-500/20",
                                                            event.severity === 'Major' && "bg-orange-500/10 text-orange-500 border border-orange-500/20",
                                                            event.severity === 'Minor' && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                                                        )}>{event.severity}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{event.source}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-mono text-muted-foreground tabular-nums flex items-center justify-end gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                                <div className="text-[10px] text-primary font-bold mt-1 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 inline-block">
                                                    {Math.round(event.correlationScore * 100)}% CONFIDENCE
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <div className="bg-muted/30 p-2 rounded border border-border/50">
                                                <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
                                                    <GitBranch className="h-3 w-3" />
                                                    Correlation Reason
                                                </div>
                                                <div className="text-xs font-medium text-foreground/80">{event.correlationReason}</div>
                                            </div>
                                            <div className="bg-primary/5 p-2 rounded border border-primary/10 border-dashed">
                                                <div className="text-[9px] text-primary uppercase font-semibold mb-1 flex items-center gap-1">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    Inference Strategy
                                                </div>
                                                <div className="text-xs font-bold text-primary/90">{getCorrelationStrategy(event.correlationReason)}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

