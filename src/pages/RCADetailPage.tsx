import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, FileText, Zap, ChevronRight, CheckCircle2, Activity, Search,
    GitBranch, Database, Brain, Target, Layers, Network
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getClusterData } from '@/data/clusterSpecificData';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

    const renderStepData = () => {
        if (!activeStep) return null;

        const output = activeStep.details.rawOutput ? JSON.parse(activeStep.details.rawOutput) : null;

        return (
            <div className="space-y-6">
                {/* Step Description */}
                <div className="p-6 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {(() => {
                                const Icon = stepIcons[activeTab] || Activity;
                                return <Icon className="h-4 w-4" />;
                            })()}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">{activeStep.name}</h3>
                            <p className="text-xs text-muted-foreground italic">"{activeStep.description}"</p>
                        </div>
                    </div>

                    {activeStep.details.bulletPoints && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {activeStep.details.bulletPoints.map((point, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{point}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Metadata Grid */}
                {activeStep.details.metadata && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Execution Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(activeStep.details.metadata).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">{key}</p>
                                        <p className="text-xs font-mono font-bold truncate">{Array.isArray(value) ? value[0] : value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Special Visualizations */}
                {activeStep.id === 'orchestration' && output?.signals && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Signal Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="text-xs font-semibold">Metric</TableHead>
                                            <TableHead className="text-xs font-semibold text-right">Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(output.signals[Object.keys(output.signals)[0]]).map(([k, v]: [string, any]) => (
                                            <TableRow key={k}>
                                                <TableCell className="text-xs font-mono">{k}</TableCell>
                                                <TableCell className="text-xs font-bold text-right">{v}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeStep.id === 'planner-llm' && output?.steps && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">Diagnostic Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {output.steps.map((s: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate">{s.tool}</p>
                                            <p className="text-[10px] text-muted-foreground italic">{s.why}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Remedy Recommendations - Show on last step */}
                {activeTab === steps.length - 1 && clusterData.remediationSteps && clusterData.remediationSteps.length > 0 && (
                    <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Recommended Remediation Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {clusterData.remediationSteps.slice(0, 3).map((remedy, i) => (
                                    <div key={remedy.id} className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold mb-1">{remedy.action}</p>
                                            <p className="text-xs text-muted-foreground">{remedy.description}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant={remedy.automated ? "default" : "secondary"} className="text-[9px]">
                                                    {remedy.automated ? "Automated" : "Manual"}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">Phase: {remedy.phase}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="p-6 space-y-6 bg-background min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">AI-Driven Root Cause Analysis</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <span className="font-mono text-primary">{clusterData.clusterId}</span>
                                <span>•</span>
                                <span>{clusterData.rcaMetadata.rootEventType.replace(/_/g, ' ')}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Process Flow Visualization */}
                <Card className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                            {steps.map((step, index) => {
                                const Icon = stepIcons[index] || Activity;
                                const isActive = activeTab === index;
                                return (
                                    <div key={step.id} className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => setActiveTab(index)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all min-w-[140px] relative",
                                                isActive
                                                    ? "bg-primary/5 border-primary shadow-sm"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-lg flex items-center justify-center relative",
                                                isActive ? "bg-primary text-white" : "bg-emerald-500 text-white"
                                            )}>
                                                {isActive ? (
                                                    <Icon className="h-5 w-5" />
                                                ) : (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className={cn(
                                                    "text-[10px] font-semibold leading-tight",
                                                    isActive ? "text-primary" : "text-foreground"
                                                )}>
                                                    {step.name}
                                                </p>
                                            </div>
                                        </button>
                                        {index < steps.length - 1 && (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveTab(index)}
                            className={cn(
                                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                activeTab === index
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {step.name}
                        </button>
                    ))}
                </div>

                {/* Active Step Content */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8">
                        {renderStepData()}
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">

                        {/* Data Evidence */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Database className="h-4 w-4 text-primary" />
                                    Data Evidence
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {clusterData.dataEvidence.map((evidence, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-semibold">{evidence.source}</p>
                                                <Badge variant="secondary" className="text-[9px]">
                                                    {evidence.relevance}%
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                {evidence.samples.slice(0, 2).map((sample, sIdx) => (
                                                    <p key={sIdx} className="text-[10px] font-mono text-muted-foreground truncate bg-muted/30 px-2 py-1 rounded">
                                                        {sample}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
