import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Database, Target, Lightbulb, FileText, Activity, ChevronRight, ArrowRight, Calendar, LayoutGrid, Check, Clock, Zap, Search, BarChart3, Brain, AlertCircle, ArrowLeft, Server, Users, CheckCircle2, Loader2, TrendingUp, History, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainLayout } from '@/components/layout/mainLayout';
import { cn } from '@/lib/utils';
import { mockClusters } from '@/data/mockData';
import { Cluster } from '@/types';

// Pipeline stage definitions
const pipelineStages = [
  { id: 1, name: 'Orchestration', icon: Database, description: 'Gathering metrics, logs & events' },
  { id: 2, name: 'Intent Routing', icon: Target, description: 'Identifying intent patterns' },
  { id: 3, name: 'Hypothesis Scoring', icon: Lightbulb, description: 'Evaluating possible causes' },
  { id: 4, name: 'Situation Builder', icon: FileText, description: 'Building context' },
  { id: 5, name: 'Data Correlation Engine', icon: Search, description: 'Finding similar incidents' },
  { id: 6, name: 'RCA Engine', icon: Activity, description: 'Final analysis' },
];

// Simulated processing state for each cluster
const getClusterProcessingState = (clusterId: string) => {
  // Simulate different stages for different clusters
  const stageMap: Record<string, number> = {
    'CLU-LC-001': 6, // Complete
    'CLU-12345': 5,  // Case Correlation
    'CLU-12346': 6,  // Complete
    'CLU-12347': 4,  // Situation Analysis
    'CLU-12348': 3,  // Hypothesis Scoring
    'CLU-12349': 6,  // Complete
    'CLU-12350': 2,  // Pattern Matching
  };
  return stageMap[clusterId] || 1;
};

// Mock RCA results for completed clusters
const getClusterRCAResult = (cluster: Cluster) => {
  const results: Record<string, any> = {
    'CLU-LC-001': {
      rootCause: 'QoS Congestion',
      description: 'Unscheduled backup traffic from agent-server-01 consuming 35% of link capacity during business hours, causing queue drops and latency spikes.',
      confidence: 93,
      topHypothesis: 'Backup-Induced Congestion',
      matchedSignals: [
        { name: 'Interface Utilization', value: '96%', threshold: '90%', status: 'exceeded' },
        { name: 'Queue Drops', value: '500/min', threshold: '0', status: 'critical' },
        { name: 'DSCP0 Traffic', value: '76%', threshold: '50%', status: 'exceeded' },
      ],
      similarCases: [
        { id: 'NET-2025-001', similarity: 87, resolution: 'QoS shaping applied' },
        { id: 'NET-2025-604', similarity: 85, resolution: 'LLQ for real-time traffic' },
        { id: 'NET-2025-319', similarity: 85, resolution: 'DSCP classification deployed' },
      ],
      recommendations: [
        'Apply QoS shaping to limit backup traffic to 70% capacity',
        'Reschedule backup jobs to off-peak hours (01:00-04:00)',
        'Deploy priority queues for real-time applications',
      ],
    },
    'CLU-12345': {
      rootCause: 'Connection Pool Exhaustion',
      description: 'Database connection leak in payment service causing pool exhaustion and cascading failures across dependent services.',
      confidence: 88,
      topHypothesis: 'Connection Leak',
      matchedSignals: [
        { name: 'Active Connections', value: '100/100', threshold: '80', status: 'critical' },
        { name: 'Connection Wait Time', value: '30s', threshold: '5s', status: 'exceeded' },
        { name: 'Failed Queries', value: '1,240', threshold: '0', status: 'critical' },
      ],
      similarCases: [
        { id: 'DB-2024-892', similarity: 82, resolution: 'Connection pool increased' },
        { id: 'DB-2024-445', similarity: 78, resolution: 'Leak fixed in code' },
      ],
      recommendations: [
        'Restart payment service to release leaked connections',
        'Apply connection pool leak fix from PR #4521',
        'Increase pool size to 150 as interim measure',
      ],
    },
  };

  return results[cluster.id] || {
    rootCause: cluster.rca.rootCause.split(':')[0] || 'Under Analysis',
    description: cluster.rca.rootCause,
    confidence: Math.round(cluster.rca.confidence * 100),
    topHypothesis: cluster.rca.hypotheses[0] || 'Analyzing...',
    matchedSignals: [],
    similarCases: [],
    recommendations: [],
  };
};

export default function RCAImpact() {
  const [searchParams] = useSearchParams();
  const clusterId = searchParams.get('cluster');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(clusterId);
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'timeline'>('overview');

  // Get clusters that are being processed (Active or Pending)
  const processingClusters = useMemo(() => {
    return mockClusters.filter(c => c.status === 'Active' || c.status === 'Pending');
  }, []);

  // Get the selected cluster
  const selectedCluster = useMemo(() => {
    if (!selectedClusterId) return null;
    return mockClusters.find(c => c.id === selectedClusterId) || null;
  }, [selectedClusterId]);

  const getStageStatus = (clusterStage: number, stageId: number) => {
    if (stageId < clusterStage) return 'complete';
    if (stageId === clusterStage) return 'active';
    return 'pending';
  };

  // Timeline data for clusters
  const timelineData = useMemo(() => {
    return processingClusters.map(cluster => {
      const currentStage = getClusterProcessingState(cluster.id);
      const startTime = new Date(cluster.createdAt);
      const stages = pipelineStages.map((stage, index) => {
        const stageTime = new Date(startTime.getTime() + (index * 2 * 60 * 1000)); // 2 min per stage
        return {
          ...stage,
          time: stageTime,
          status: getStageStatus(currentStage, stage.id),
        };
      });
      return { cluster, stages, currentStage };
    }).sort((a, b) => new Date(b.cluster.createdAt).getTime() - new Date(a.cluster.createdAt).getTime());
  }, [processingClusters]);

  // Render timeline view
  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Processing Timeline</h2>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {processingClusters.length} incidents
          </Badge>
        </div>

        {/* Timeline Header */}
        <div className="flex mb-4 pl-[200px]">
          {pipelineStages.map((stage) => {
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{stage.name}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline Rows */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 pr-4">
            {timelineData.map(({ cluster, stages, currentStage }) => {
              const isComplete = currentStage === 6;
              return (
                <div
                  key={cluster.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg border cursor-pointer transition-all",
                    isComplete
                      ? "bg-status-success/5 border-status-success/30 hover:bg-status-success/10"
                      : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
                  )}
                  onClick={() => {
                    setSelectedClusterId(cluster.id);
                    setViewMode('detail');
                  }}
                >
                  {/* Cluster Info */}
                  <div className="w-[200px] shrink-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{cluster.id}</span>
                      <Badge className={cn(
                        "text-[10px] px-1.5 py-0",
                        cluster.rootEvent.severity === 'Critical' && "bg-severity-critical",
                        cluster.rootEvent.severity === 'Major' && "bg-severity-high",
                        cluster.rootEvent.severity === 'Minor' && "bg-severity-low",
                      )}>
                        {cluster.rootEvent.severity}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {cluster.rootEvent.alertType.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {/* Stage Progress */}
                  <div className="flex-1 flex items-center">
                    {stages.map((stage, index) => (
                      <div key={stage.id} className="flex-1 flex items-center">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-all mx-auto",
                          stage.status === 'complete' && "bg-status-success",
                          stage.status === 'active' && "bg-primary",
                          stage.status === 'pending' && "bg-muted"
                        )}>
                          {stage.status === 'complete' ? (
                            <Check className="h-4 w-4 text-background" />
                          ) : stage.status === 'active' ? (
                            <Loader2 className="h-4 w-4 text-background animate-spin" />
                          ) : (
                            <span className="text-xs text-muted-foreground">{stage.id}</span>
                          )}
                        </div>
                        {index < stages.length - 1 && (
                          <div className={cn(
                            "flex-1 h-0.5 mx-1",
                            stage.status === 'complete' ? "bg-status-success" : "bg-border"
                          )} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="w-[100px] text-right shrink-0">
                    {isComplete ? (
                      <Badge className="bg-status-success">Complete</Badge>
                    ) : (
                      <Badge variant="outline" className="text-primary border-primary/30">
                        Stage {currentStage}/6
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  // Render the overview with all processing clusters
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {processingClusters.filter(c => getClusterProcessingState(c.id) < 6).length}
              </p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/20">
              <CheckCircle2 className="h-5 w-5 text-status-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {processingClusters.filter(c => getClusterProcessingState(c.id) === 6).length}
              </p>
              <p className="text-xs text-muted-foreground">RCA Complete</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-critical/20">
              <AlertCircle className="h-5 w-5 text-severity-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {processingClusters.filter(c => c.rootEvent.severity === 'Critical').length}
              </p>
              <p className="text-xs text-muted-foreground">Critical Priority</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">89%</p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Pipeline Overview */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Active RCA Processing</h2>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Real-time
          </Badge>
        </div>

        {/* Cluster Processing Cards */}
        <div className="space-y-4">
          {processingClusters.map((cluster) => {
            const currentStage = getClusterProcessingState(cluster.id);
            const isComplete = currentStage === 6;
            const rcaResult = getClusterRCAResult(cluster);
            const progressPercent = (currentStage / 6) * 100;

            return (
              <div
                key={cluster.id}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer",
                  isComplete
                    ? "bg-status-success/5 border-status-success/30 hover:bg-status-success/10"
                    : "bg-secondary/30 border-border/50 hover:bg-secondary/50",
                  selectedClusterId === cluster.id && "ring-2 ring-primary"
                )}
                onClick={() => {
                  setSelectedClusterId(cluster.id);
                  setViewMode('detail');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      cluster.rootEvent.severity === 'Critical' && "bg-severity-critical/20",
                      cluster.rootEvent.severity === 'Major' && "bg-severity-high/20",
                      cluster.rootEvent.severity === 'Minor' && "bg-severity-low/20",
                    )}>
                      {isComplete ? (
                        <CheckCircle2 className="h-6 w-6 text-status-success" />
                      ) : (
                        <Loader2 className={cn(
                          "h-6 w-6 animate-spin",
                          cluster.rootEvent.severity === 'Critical' && "text-severity-critical",
                          cluster.rootEvent.severity === 'Major' && "text-severity-high",
                          cluster.rootEvent.severity === 'Minor' && "text-severity-low",
                        )} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{cluster.id}</span>
                        <Badge className={cn(
                          "text-xs",
                          cluster.rootEvent.severity === 'Critical' && "bg-severity-critical",
                          cluster.rootEvent.severity === 'Major' && "bg-severity-high",
                          cluster.rootEvent.severity === 'Minor' && "bg-severity-low",
                        )}>
                          {cluster.rootEvent.severity}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground">{cluster.rootEvent.alertType.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isComplete ? (
                      <div>
                        <p className="text-2xl font-bold text-status-success">{rcaResult.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-foreground">{pipelineStages[currentStage - 1]?.name}</p>
                        <p className="text-xs text-muted-foreground">Stage {currentStage} of 6</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <Progress value={progressPercent} className={cn("h-2", isComplete && "[&>div]:bg-status-success")} />
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-between">
                  {pipelineStages.map((stage) => {
                    const status = getStageStatus(currentStage, stage.id);
                    const StageIcon = stage.icon;
                    return (
                      <div key={stage.id} className="flex flex-col items-center gap-1">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                          status === 'complete' && "bg-status-success/20",
                          status === 'active' && "bg-primary/20",
                          status === 'pending' && "bg-muted/50"
                        )}>
                          {status === 'complete' ? (
                            <Check className="h-4 w-4 text-status-success" />
                          ) : status === 'active' ? (
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                          ) : (
                            <StageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] text-center max-w-[60px] leading-tight",
                          status === 'complete' && "text-status-success",
                          status === 'active' && "text-primary font-medium",
                          status === 'pending' && "text-muted-foreground"
                        )}>
                          {stage.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Result Preview for Complete */}
                {isComplete && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Root Cause: {rcaResult.rootCause}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{rcaResult.description}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render detailed view for selected cluster
  const renderDetail = () => {
    if (!selectedCluster) return null;

    const currentStage = getClusterProcessingState(selectedCluster.id);
    const isComplete = currentStage === 6;
    const rcaResult = getClusterRCAResult(selectedCluster);

    return (
      <div className="space-y-6">
        {/* Back Button & Cluster Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('overview')} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">{selectedCluster.id}</span>
            <Badge className={cn(
              selectedCluster.rootEvent.severity === 'Critical' && "bg-severity-critical",
              selectedCluster.rootEvent.severity === 'Major' && "bg-severity-high",
            )}>
              {selectedCluster.rootEvent.severity}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Summary */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl shrink-0",
                  selectedCluster.rootEvent.severity === 'Critical' && "bg-severity-critical/20",
                  selectedCluster.rootEvent.severity === 'Major' && "bg-severity-high/20",
                )}>
                  <AlertCircle className={cn(
                    "h-7 w-7",
                    selectedCluster.rootEvent.severity === 'Critical' && "text-severity-critical",
                    selectedCluster.rootEvent.severity === 'Major' && "text-severity-high",
                  )} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {selectedCluster.rootEvent.alertType.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-muted-foreground">{selectedCluster.rootEvent.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-foreground">{selectedCluster.childEvents.length + 1}</p>
                  <p className="text-xs text-muted-foreground">Related Events</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-foreground">{selectedCluster.affectedServices.length}</p>
                  <p className="text-xs text-muted-foreground">Services Affected</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-severity-critical">{selectedCluster.affectedUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Users Impacted</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-foreground">{selectedCluster.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>

            {/* Root Cause Analysis Result */}
            {isComplete ? (
              <>
                {/* Root Cause Card */}
                <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-status-success/10 via-transparent to-primary/5 border-status-success/30">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-status-success" />
                    <h3 className="font-semibold text-foreground">Root Cause Identified</h3>
                    <Badge className="bg-status-success ml-auto">{rcaResult.confidence}% Confidence</Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 mb-4">
                    <p className="text-lg font-bold text-foreground mb-2">{rcaResult.rootCause}</p>
                    <p className="text-muted-foreground">{rcaResult.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Top Hypothesis:</span>
                    <Badge variant="outline">{rcaResult.topHypothesis}</Badge>
                  </div>
                </div>

                {/* Key Indicators */}
                {rcaResult.matchedSignals.length > 0 && (
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Key Indicators
                    </h3>
                    <div className="grid gap-3">
                      {rcaResult.matchedSignals.map((signal: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              signal.status === 'critical' && "bg-severity-critical",
                              signal.status === 'exceeded' && "bg-severity-high",
                            )} />
                            <span className="text-foreground">{signal.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm font-bold text-foreground">{signal.value}</span>
                              <span className="text-xs text-muted-foreground ml-2">/ {signal.threshold}</span>
                            </div>
                            <Badge variant="outline" className={cn(
                              signal.status === 'critical' && "bg-severity-critical/10 text-severity-critical border-severity-critical/30",
                              signal.status === 'exceeded' && "bg-severity-high/10 text-severity-high border-severity-high/30",
                            )}>
                              {signal.status === 'critical' ? 'Critical' : 'Exceeded'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {rcaResult.recommendations.length > 0 && (
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-status-success" />
                      Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      {rcaResult.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-status-success/10 border border-status-success/20">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-status-success text-background text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-foreground">{rec}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link to={`/remediation?cluster=${selectedCluster.id}`}>
                        <Button className="gap-2">
                          Start Remediation
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Processing State */
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <div>
                    <h3 className="font-semibold text-foreground">Analysis in Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently at Stage {currentStage}: {pipelineStages[currentStage - 1]?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pipelineStages.map((stage) => {
                    const status = getStageStatus(currentStage, stage.id);
                    const StageIcon = stage.icon;
                    return (
                      <div key={stage.id} className={cn(
                        "flex items-center gap-4 p-4 rounded-lg transition-all",
                        status === 'complete' && "bg-status-success/10 border border-status-success/30",
                        status === 'active' && "bg-primary/10 border border-primary/30",
                        status === 'pending' && "bg-muted/30 border border-border/50 opacity-50"
                      )}>
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          status === 'complete' && "bg-status-success/20",
                          status === 'active' && "bg-primary/20",
                          status === 'pending' && "bg-muted"
                        )}>
                          {status === 'complete' ? (
                            <Check className="h-5 w-5 text-status-success" />
                          ) : status === 'active' ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          ) : (
                            <StageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            status === 'complete' && "text-status-success",
                            status === 'active' && "text-primary",
                            status === 'pending' && "text-muted-foreground"
                          )}>
                            {stage.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                        {status === 'complete' && (
                          <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/30">
                            Complete
                          </Badge>
                        )}
                        {status === 'active' && (
                          <Badge className="bg-primary animate-pulse">Processing...</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Similar Cases */}
            {isComplete && rcaResult.similarCases.length > 0 && (
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Similar Past Incidents
                </h3>
                <div className="space-y-3">
                  {rcaResult.similarCases.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm text-primary">{c.id}</span>
                        <Badge variant="outline" className="text-xs">{c.similarity}% match</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.resolution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Affected Services */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Affected Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCluster.affectedServices.map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Events */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Related Events
              </h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-2">
                  {[selectedCluster.rootEvent, ...selectedCluster.childEvents].map((event, i) => (
                    <div key={event.id} className={cn(
                      "p-2 rounded-lg text-sm",
                      i === 0 ? "bg-severity-critical/10 border border-severity-critical/30" : "bg-secondary/30"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{event.severity}</Badge>
                        {i === 0 && <Badge variant="outline" className="text-xs bg-primary/10 text-primary">Root</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{event.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Root Cause Analysis</h1>
            <p className="text-muted-foreground">
              {viewMode === 'overview' && 'Monitor RCA processing across all active incidents'}
              {viewMode === 'timeline' && 'View processing stages across all incidents'}
              {viewMode === 'detail' && 'Detailed analysis for selected incident'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {viewMode !== 'detail' && (
              <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setViewMode('overview')}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setViewMode('timeline')}
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </Button>
              </div>
            )}
            <Link to="/remediation">
              <Button className="gap-2 gradient-primary">
                Go to Remediation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'timeline' && renderTimeline()}
        {viewMode === 'detail' && renderDetail()}
      </div>
    </MainLayout>
  );
}
