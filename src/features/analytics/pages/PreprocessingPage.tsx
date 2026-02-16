import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { processingStats } from '@/data/mock/mockData';
import { cn } from '@/shared/lib/utils';
import { Link } from 'react-router-dom';

const processingSteps = [
  { id: 1, name: 'File Validation', status: 'complete', count: 15420 },
  { id: 2, name: 'Timestamp Normalization', status: 'complete', count: 15420 },
  { id: 3, name: 'Field Mapping', status: 'complete', count: 15380 },
  { id: 4, name: 'Data Type Conversion', status: 'active', count: 15380 },
  { id: 5, name: 'Null Handling', status: 'pending', count: 0 },
];

export default function Preprocessing() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [processingProgress, setProcessingProgress] = useState(75);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Pre-Processing</h1>
            <p className="text-muted-foreground">Upload and normalize event data for analysis</p>
          </div>
          <Link to="/clustering">
            <Button className="gap-2 gradient-primary">
              Go to Clustering
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

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
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drag and drop your event files here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
              <Button variant="outline">Browse Files</Button>
            </div>

            {/* Upload Progress */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">events_2026-01-05.xlsx</p>
                    <p className="text-xs text-muted-foreground">15,420 rows • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-status-success" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upload Progress</span>
                  <span className="text-foreground font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Processing Metrics */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Processing Metrics</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-foreground">{processingStats.totalEvents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Events Uploaded</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-status-success">{processingStats.normalized.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Events Normalized</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-severity-critical">{processingStats.errors}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-2xl font-bold text-foreground">{processingProgress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Progress</span>
                <span className="text-foreground font-medium">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>

            {/* Processing Steps */}
            <div className="space-y-3">
              {processingSteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    step.status === 'complete' && "bg-status-success/10 border-status-success/30",
                    step.status === 'active' && "bg-primary/10 border-primary/30",
                    step.status === 'pending' && "bg-secondary/30 border-border/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {step.status === 'complete' && <CheckCircle2 className="h-5 w-5 text-status-success" />}
                    {step.status === 'active' && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                    {step.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />}
                    <span className={cn(
                      "text-sm",
                      step.status === 'pending' && "text-muted-foreground"
                    )}>{step.name}</span>
                  </div>
                  {step.count > 0 && (
                    <Badge variant="secondary">{step.count.toLocaleString()}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Data Preview (First 5 Rows)</h2>
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
                {[
                  { timestamp: '2026-01-05T14:30:00Z', source: 'db-server-01', type: 'DB_CONNECTION_FAILED', severity: 'Critical', message: 'Database connection pool exhausted' },
                  { timestamp: '2026-01-05T14:30:03Z', source: 'api-gateway-01', type: 'API_TIMEOUT', severity: 'High', message: 'API request timeout after 30s' },
                  { timestamp: '2026-01-05T14:30:05Z', source: 'web-server-01', type: 'WEB_5XX_ERROR', severity: 'High', message: 'HTTP 503 Service Unavailable' },
                  { timestamp: '2026-01-05T14:30:08Z', source: 'auth-service-01', type: 'AUTH_FAILURE', severity: 'Medium', message: 'Authentication service unavailable' },
                  { timestamp: '2026-01-05T14:30:10Z', source: 'cache-node-02', type: 'CACHE_MISS', severity: 'Low', message: 'Cache miss rate exceeded threshold' },
                ].map((row, index) => (
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
      </div>
    </MainLayout>
  );
}
