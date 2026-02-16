import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    ArrowLeft, CheckCircle2, Activity, GitBranch, Database, Brain, Target, Layers, Network, ArrowRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getClusterData } from '@/features/rca/data/clusterData';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export default function RCADetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const clusterData = getClusterData(id || 'CLU-LC-001');
    const [activeTab, setActiveTab] = useState(0);

    if (!clusterData) {
        return (
            <MainLayout>
                <div className="p-12 text-center text-muted-foreground">
                    RCA Data not found for ID: {id}
                    <Button asChild className="mt-4"><Link to="/events">Back to Events</Link></Button>
                </div>
            </MainLayout>
        );
    }

    const steps = clusterData.rcaProcessSteps;
    const activeStep = steps[activeTab];
    const stepIcons = [Activity, GitBranch, Target, Brain, Layers, Database, Network];

    return (
        <MainLayout>
            <div className="h-screen flex flex-col overflow-hidden">
                {/* Fixed Compact Header */}
                <div className="shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate('/events')}>
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </Button>
                            <div>
                                <h1 className="text-base font-bold leading-tight">RCA Analysis Flow</h1>
                                <p className="text-[10px] text-muted-foreground">
                                    <span className="font-mono">{id}</span> • {clusterData.rootCause?.split(':')[0]}
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-[10px] px-2 py-0.5 font-bold">
                            {((clusterData.confidence || 0) * 100).toFixed(0)}% Conf
                        </Badge>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Sidebar - Pipeline Steps */}
                    <div className="w-48 shrink-0 border-r border-border/50 bg-muted/20 overflow-y-auto">
                        <div className="p-3 space-y-1.5">
                            {steps.map((step, index) => {
                                const Icon = stepIcons[index] || Activity;
                                const isActive = index === activeTab;
                                const isComplete = index < activeTab || step.status === 'complete';

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => setActiveTab(index)}
                                        className={cn(
                                            "w-full flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                                            isActive
                                                ? "border-primary bg-primary/10 shadow-sm"
                                                : isComplete
                                                    ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                                                    : "border-border bg-background hover:bg-muted/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-all",
                                            isActive
                                                ? "bg-primary text-white"
                                                : isComplete
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-muted text-muted-foreground"
                                        )}>
                                            {isComplete && !isActive ? (
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            ) : (
                                                <Icon className="h-3.5 w-3.5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-[10px] font-bold leading-tight truncate",
                                                isActive ? "text-primary" : isComplete ? "text-emerald-700" : "text-foreground/70"
                                            )}>
                                                {step.name}
                                            </p>
                                            {isActive && (
                                                <p className="text-[8px] text-muted-foreground truncate">{step.description}</p>
                                            )}
                                        </div>
                                        {isActive && <ArrowRight className="h-3 w-3 text-primary shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Content Area - Step Details */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {activeStep?.details.sections ? (
                            <div className="grid grid-cols-3 gap-2 auto-rows-min">
                                {activeStep.details.sections.map((section, idx) => {
                                    const isTable = section.type === 'table';
                                    const isLongList = section.type === 'list' && (section.content as string[]).length > 5;
                                    const colSpan = isTable || isLongList ? 'col-span-3' : 'col-span-1';

                                    return (
                                        <Card key={idx} className={cn("border border-border/40 shadow-sm", colSpan)}>
                                            <CardHeader className="pb-1.5 px-2.5 pt-2 bg-muted/30 border-b border-border/20">
                                                <CardTitle className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                                                    {section.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2.5">
                                                {/* KV Type */}
                                                {section.type === 'kv' && (
                                                    <div className="space-y-2">
                                                        {Object.entries(section.content as Record<string, string>).map(([k, v]) => (
                                                            <div key={k} className="space-y-0.5">
                                                                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wide">{k}</p>
                                                                <p className="text-[11px] font-semibold text-foreground leading-tight">{v}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Scored List */}
                                                {section.type === 'scored-list' && (
                                                    <div className="space-y-2">
                                                        {(section.content as any[]).map((item, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <div className="flex justify-between items-center gap-2">
                                                                    <span className="font-bold text-[10px] text-foreground truncate">{item.label}</span>
                                                                    <Badge variant="outline" className="text-[8px] h-3.5 font-mono px-1 border-primary/30 bg-primary/10 text-primary font-bold shrink-0">
                                                                        {item.displayScore}
                                                                    </Badge>
                                                                </div>
                                                                <div className="h-1 w-full bg-secondary/40 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn("h-full transition-all duration-500",
                                                                            item.score >= 80 ? "bg-emerald-500" :
                                                                                item.score >= 50 ? "bg-amber-500" : "bg-primary"
                                                                        )}
                                                                        style={{ width: `${Math.min(item.score, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* List */}
                                                {section.type === 'list' && (
                                                    <div className="space-y-0.5 max-h-[140px] overflow-y-auto">
                                                        {(section.content as string[]).map((item, i) => (
                                                            <div key={i} className="flex items-start gap-1.5 text-[10px] py-0.5">
                                                                <div className="h-1 w-1 rounded-full bg-primary mt-1 shrink-0" />
                                                                <span className="text-foreground/80 leading-snug">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Text */}
                                                {section.type === 'text' && (
                                                    <p className="text-[10px] text-foreground/90 leading-relaxed">
                                                        {section.content as string}
                                                    </p>
                                                )}

                                                {/* Table */}
                                                {section.type === 'table' && section.columns && (
                                                    <div className="border border-border/30 rounded overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                                    {section.columns.map((col) => (
                                                                        <TableHead key={col.key} className={cn("text-[9px] font-bold h-6 py-0.5 px-2", col.align === 'right' ? "text-right" : "")}>
                                                                            {col.label}
                                                                        </TableHead>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {(section.content as Record<string, any>[]).map((row, rIdx) => (
                                                                    <TableRow key={rIdx} className="hover:bg-muted/10">
                                                                        {section.columns!.map((col) => (
                                                                            <TableCell key={col.key} className={cn("text-[10px] py-1 px-2", col.align === 'right' ? "text-right font-mono" : "")}>
                                                                                {col.key === 'match' || col.key === 'score' ? (
                                                                                    <Badge variant="secondary" className={cn("text-[8px] font-bold px-1 py-0",
                                                                                        parseInt(row[col.key]) > 80 ? "text-emerald-700 bg-emerald-100" : "text-amber-700 bg-amber-100"
                                                                                    )}>
                                                                                        {row[col.key]}
                                                                                    </Badge>
                                                                                ) : (
                                                                                    <span className="text-foreground/90">{row[col.key]}</span>
                                                                                )}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-8">No data available for this step</div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
