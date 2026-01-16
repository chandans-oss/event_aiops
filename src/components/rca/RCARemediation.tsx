import { ClusterSpecificData, RemediationStep } from '@/data/clusterSpecificData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, CheckSquare, BookOpen, AlertTriangle, Timer, ShieldCheck, Undo2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RCARemediationProps {
    data: ClusterSpecificData;
}

export function RCARemediation({ data }: RCARemediationProps) {
    const automatedSteps = data.remediationSteps.filter(s => s.automated);
    const manualSteps = data.remediationSteps.filter(s => !s.automated);

    return (
        <div className="space-y-6">
            {/* Top Summary */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Timer className="h-6 w-6 text-primary mb-2" />
                        <div className="text-xl font-bold">~15 min</div>
                        <div className="text-xs text-muted-foreground">Est. Resolution</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <ShieldCheck className="h-6 w-6 text-status-success mb-2" />
                        <div className="text-xl font-bold">Low Risk</div>
                        <div className="text-xs text-muted-foreground">Correction Impact</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Undo2 className="h-6 w-6 text-muted-foreground mb-2" />
                        <div className="text-xl font-bold">Auto</div>
                        <div className="text-xs text-muted-foreground">Rollback Available</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="automated" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="automated">1. Automated</TabsTrigger>
                    <TabsTrigger value="guided">2. Guided Steps</TabsTrigger>
                    <TabsTrigger value="knowledge">3. Vendor KB</TabsTrigger>
                </TabsList>

                <TabsContent value="automated" className="space-y-4 mt-4">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        <p className="text-sm text-foreground">These actions are pre-validated and safe to execute automatically.</p>
                    </div>
                    {automatedSteps.map(step => (
                        <RemediationStepCard key={step.id} step={step} />
                    ))}
                </TabsContent>

                <TabsContent value="guided" className="space-y-4 mt-4">
                    <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <p className="text-sm text-muted-foreground">Follow these steps if automated remediation fails or is skipped.</p>
                    </div>
                    {manualSteps.map(step => (
                        <RemediationStepCard key={step.id} step={step} mode="manual" />
                    ))}
                </TabsContent>

                <TabsContent value="knowledge" className="space-y-4 mt-4">
                    <ScrollArea className="h-[400px]">
                        {data.remediationKB.map((kb, idx) => (
                            <Card key={idx} className="mb-4 hover:bg-secondary/20 cursor-pointer transition-colors">
                                <CardContent className="p-4 flex items-start gap-4">
                                    <BookOpen className="h-6 w-6 text-primary mt-1" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-foreground hover:underline">{kb.title}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{kb.relevance}% Match</Badge>
                                            <span className="text-xs text-muted-foreground truncate max-w-[300px]">{kb.url}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">Open</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function RemediationStepCard({ step, mode = 'auto' }: { step: RemediationStep, mode?: 'auto' | 'manual' }) {
    return (
        <Card>
            <CardHeader className="py-3 bg-secondary/30">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold">{step.action}</CardTitle>
                    <Badge variant={step.automated ? "default" : "secondary"}>
                        {step.automated ? "Automated" : "Manual"}
                    </Badge>
                </div>
                <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {step.command && (
                    <div className="bg-black/90 p-3 rounded-md font-mono text-xs text-green-400 overflow-x-auto">
                        {step.command}
                    </div>
                )}
                {mode === 'auto' && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                            <Play className="h-3 w-3" /> Execute
                        </Button>
                    </div>
                )}
                {mode === 'manual' && step.verification && (
                    <div className="mt-2 bg-secondary/20 p-3 rounded text-sm">
                        <p className="font-semibold mb-1 flex items-center gap-2">
                            <CheckSquare className="h-3 w-3" /> Validation
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {step.verification.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
