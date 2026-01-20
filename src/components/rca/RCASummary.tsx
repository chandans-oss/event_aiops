import { ClusterSpecificData } from '@/data/clusterSpecificData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Users, DollarSign, Clock, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RCASummaryProps {
    data: ClusterSpecificData;
    confidence?: number;
    onViewDetailedRCA: () => void;
}

export function RCASummary({ data, confidence = 0.95, onViewDetailedRCA }: RCASummaryProps) {
    return (
        <div className="space-y-6">
            {/* Root Cause Description */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Root Cause Analysis
                    </CardTitle>
                    <CardDescription>
                        {data.rcaMetadata.device} • {new Date(data.rcaMetadata.timestamp).toLocaleString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground text-lg leading-relaxed">
                        {data.rcaSummary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border">
                            <span className="text-muted-foreground text-sm">Severity:</span>
                            <Badge variant={data.rcaMetadata.severity === 'Critical' ? 'destructive' : 'default'}>
                                {data.rcaMetadata.severity}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border">
                            <span className="text-muted-foreground text-sm">Confidence:</span>
                            <span className="font-bold text-primary">{Math.round(confidence * 100)}%</span>
                        </div>

                    </div>
                </CardContent>
            </Card>




            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Incident Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l-2 border-border pl-4 space-y-4 ml-2">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted border border-border" />
                            <p className="text-sm font-medium">Issue Started</p>
                            <p className="text-xs text-muted-foreground">14:00:00 (Est.)</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-orange-500 border border-border" />
                            <p className="text-sm font-medium">Detection & Alerting</p>
                            <p className="text-xs text-muted-foreground">14:02:15 (+2m 15s)</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary border border-border" />
                            <p className="text-sm font-medium">RCA Completed</p>
                            <p className="text-xs text-muted-foreground">14:02:45 (+30s)</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted border border-border animate-pulse" />
                            <p className="text-sm font-medium">Projected Resolution</p>
                            <p className="text-xs text-muted-foreground">14:45:00</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <Button onClick={onViewDetailedRCA} className="gap-2">
                    RCA Analysis Flow
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
