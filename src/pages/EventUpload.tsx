import { useState, useMemo } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, ArrowRight, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProcessingPipelineStepper, PipelineStage } from '@/components/upload/ProcessingPipelineStepper';
import { ClusterCard } from '@/components/dashboard/ClusterCard';
import { mockClusters, processingStats } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function EventUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [processingStage, setProcessingStage] = useState<'idle' | 'preprocessing' | 'clustering' | 'rca' | 'remediation' | 'complete'>('complete');

  const previewData = [
    { timestamp: '2026-01-05T14:30:00Z', source: 'db-server-01', type: 'DB_CONNECTION_FAILED', severity: 'Critical', message: 'Database connection pool exhausted' },
    { timestamp: '2026-01-05T14:30:03Z', source: 'api-gateway-01', type: 'API_TIMEOUT', severity: 'High', message: 'API request timeout after 30s' },
    { timestamp: '2026-01-05T14:30:05Z', source: 'web-server-01', type: 'WEB_5XX_ERROR', severity: 'High', message: 'HTTP 503 Service Unavailable' },
    { timestamp: '2026-01-05T14:30:08Z', source: 'auth-service-01', type: 'AUTH_FAILURE', severity: 'Medium', message: 'Authentication service unavailable' },
    { timestamp: '2026-01-05T14:30:10Z', source: 'cache-node-02', type: 'CACHE_MISS', severity: 'Low', message: 'Cache miss rate exceeded threshold' },
  ];

  // Pipeline stages with counts from processingStats
  const pipelineStages: PipelineStage[] = useMemo(() => {
    const getStatus = (stageId: string): 'pending' | 'active' | 'complete' => {
      if (processingStage === 'complete') return 'complete';
      if (processingStage === 'idle') return 'pending';

      const stageOrder = ['preprocessing', 'clustering', 'rca', 'remediation'];
      const currentIndex = stageOrder.indexOf(processingStage);
      const stageIndex = stageOrder.indexOf(stageId);

      if (stageIndex < currentIndex) return 'complete';
      if (stageIndex === currentIndex) return 'active';
      return 'pending';
    };

    return [
      {
        id: 'preprocessing',
        label: 'Event Pre-Processing',
        status: getStatus('preprocessing'),
        count: processingStats.normalized
      },
      {
        id: 'clustering',
        label: 'Event Clustering',
        status: getStatus('clustering'),
        count: processingStats.clustered
      },
      {
        id: 'rca',
        label: 'RCA & Impact',
        status: getStatus('rca'),
        count: mockClusters.length
      },
      {
        id: 'remediation',
        label: 'Remediation',
        status: getStatus('remediation'),
        count: mockClusters.filter(c => c.status === 'Resolved').length
      },
    ];
  }, [processingStage]);

  const handleFileUpload = () => {
    // Simulate processing flow
    setProcessingStage('preprocessing');
    setTimeout(() => setProcessingStage('clustering'), 1500);
    setTimeout(() => setProcessingStage('rca'), 3000);
    setTimeout(() => setProcessingStage('remediation'), 4500);
    setTimeout(() => setProcessingStage('complete'), 6000);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Upload & Processing</h1>
            <p className="text-muted-foreground">Upload event data files for analysis and clustering</p>
          </div>
          {processingStage === 'complete' && (
            <Link to="/">
              <Button className="gap-2 gradient-primary">
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Processing Pipeline Stepper */}
        <ProcessingPipelineStepper stages={pipelineStages} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Events</h2>

            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload();
              }}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drag and drop your event files here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
              <Button variant="outline" onClick={handleFileUpload}>Browse Files</Button>
            </div>

            {/* Uploaded File */}
            <div className="mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-status-success/10 border border-status-success/30">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-status-success" />
                  <div>
                    <p className="font-medium text-foreground">events_2026-01-05.xlsx</p>
                    <p className="text-xs text-muted-foreground">{processingStats.totalEvents.toLocaleString()} rows • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-status-success" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Column Mapping Preview */}
            <div className="mt-6">
              <h3 className="font-medium text-foreground mb-3">Column Mapping</h3>
              <div className="space-y-2">
                {['timestamp', 'source', 'alert_type', 'severity', 'message'].map((col) => (
                  <div key={col} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                    <span className="text-sm text-muted-foreground capitalize">{col.replace('_', ' ')}</span>
                    <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/30">
                      ✓ Mapped
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Progress */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Processing Progress</h2>

            <div className="space-y-4 mb-6">
              {[
                { name: 'Upload', progress: 100, status: 'complete' as const },
                { name: 'Pre-Processing', progress: processingStage === 'preprocessing' ? 75 : (processingStage === 'idle' ? 0 : 100), status: processingStage === 'preprocessing' ? 'in_progress' as const : (processingStage === 'idle' ? 'pending' as const : 'complete' as const) },
                { name: 'Clustering', progress: processingStage === 'clustering' ? 60 : (['preprocessing', 'idle'].includes(processingStage) ? 0 : 100), status: processingStage === 'clustering' ? 'in_progress' as const : (['preprocessing', 'idle'].includes(processingStage) ? 'pending' as const : 'complete' as const) },
                { name: 'RCA & Impact', progress: processingStage === 'rca' ? 50 : (['preprocessing', 'clustering', 'idle'].includes(processingStage) ? 0 : 100), status: processingStage === 'rca' ? 'in_progress' as const : (['preprocessing', 'clustering', 'idle'].includes(processingStage) ? 'pending' as const : 'complete' as const) },
              ].map((stage) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {stage.status === 'complete' && <CheckCircle2 className="h-4 w-4 text-status-success" />}
                      {stage.status === 'in_progress' && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                      {stage.status === 'pending' && <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />}
                      <span className="text-sm text-foreground">{stage.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{stage.progress}%</span>
                  </div>
                  <Progress value={stage.progress} className="h-2" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-foreground">{processingStats.totalEvents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-status-success">{processingStats.clustered}</p>
                <p className="text-sm text-muted-foreground">Clusters Created</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-severity-high">{processingStats.deduplicated.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Deduplicated</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-severity-critical">{processingStats.errors}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1">
                Export Results
              </Button>
              <Button className="flex-1 gradient-primary">
                Save as Project
              </Button>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Data Preview (First 5 Rows)</h2>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Source</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Alert Type</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Severity</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="p-3 font-mono text-xs">{row.timestamp}</td>
                    <td className="p-3">{row.source}</td>
                    <td className="p-3">{row.type}</td>
                    <td className="p-3">
                      <Badge className={cn(
                        row.severity === 'Critical' && "bg-severity-critical",
                        row.severity === 'High' && "bg-severity-high",
                        row.severity === 'Medium' && "bg-severity-medium",
                        row.severity === 'Low' && "bg-severity-low",
                      )}>
                        {row.severity}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results - Clustered Events */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Clustered Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockClusters.slice(0, 3).map((cluster) => (
              <ClusterCard
                key={cluster.id}
                cluster={cluster}
                onRCAClick={() => { }}
                onImpactClick={() => { }}
                onRemediationClick={() => { }}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
