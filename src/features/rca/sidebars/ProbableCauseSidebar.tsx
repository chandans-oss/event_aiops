
import { useState, useMemo } from 'react';
import { X, ArrowRight, Brain, AlertTriangle, Target, LineChart, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Cluster } from '@/shared/types';
import { getProbableCauses, ProbableCause } from '@/features/rca/data/clusterData';
import { cn } from '@/shared/lib/utils';

interface ProbableCauseSidebarProps {
    cluster: Cluster;
    onClose: () => void;
    onSelectCause: (causeId: string) => void;
}

export function ProbableCauseSidebar({ cluster, onClose, onSelectCause }: ProbableCauseSidebarProps) {
    const causes = useMemo(() => cluster?.id ? getProbableCauses(cluster.id) : [], [cluster]);

    if (!cluster) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[70%] bg-background border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                        <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Root Causes Analysis</h2>
                        <p className="text-sm text-muted-foreground font-mono">{cluster.id}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-6">
                    {causes.map((cause, index) => (
                        <div
                            key={cause.id}
                            className={cn(
                                "group relative overflow-hidden rounded-xl border border-border bg-card p-1 transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer flex flex-col h-full",
                                index === 0 && "border-primary/40 shadow-md ring-1 ring-primary/20"
                            )}
                            onClick={() => onSelectCause(cause.id)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative p-5 space-y-4 flex flex-col h-full">
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{cause.title}</h3>
                                        {index === 0 && <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 whitespace-nowrap">Top Hit</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{cause.description}</p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-muted-foreground">Confidence Score</span>
                                        <span className={cn(
                                            "font-bold",
                                            cause.confidence > 0.8 ? "text-status-success" : cause.confidence > 0.5 ? "text-yellow-500" : "text-muted-foreground"
                                        )}>
                                            {(cause.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <Progress value={cause.confidence * 100} className="h-2"
                                        indicatorClassName={cn(
                                            cause.confidence > 0.8 ? "bg-status-success" : cause.confidence > 0.5 ? "bg-yellow-500" : "bg-muted-foreground"
                                        )}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
                                    <div className="flex flex-wrap gap-1.5">
                                        {cause.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2 ml-auto group-hover:bg-primary group-hover:text-primary-foreground">
                                        Analyze <ChevronRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
