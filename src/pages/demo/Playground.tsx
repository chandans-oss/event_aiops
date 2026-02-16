import { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Play, RotateCcw, Lightbulb, Target, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const sampleEvents = `evt_001,Dist-R3,LINK_DOWN,2025-12-26T10:00:00Z,critical,Gi1/0/1 interface down
evt_002,Edge-S7,LINK_DOWN,2025-12-26T10:00:02Z,critical,Uplink to Dist-R3 failed
evt_003,Edge-S7,BGP_NEIGHBOR_DOWN,2025-12-26T10:00:05Z,major,BGP session with Dist-R3 lost
evt_004,App-Srv-01,CONNECTION_TIMEOUT,2025-12-26T10:00:10Z,minor,Database connection failed`;

export default function Playground() {
  const [eventInput, setEventInput] = useState(sampleEvents);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    clusters: number;
    rootCause: string;
    confidence: number;
    hypotheses: { name: string; score: number }[];
  } | null>(null);

  const handleProcess = () => {
    setIsProcessing(true);
    setResults(null);

    setTimeout(() => {
      setResults({
        clusters: 1,
        rootCause: 'Network link failure on Dist-R3 (Gi1/0/1) causing cascading failures downstream',
        confidence: 0.92,
        hypotheses: [
          { name: 'H_LINK_FAILURE', score: 0.92 },
          { name: 'H_CABLE_FAULT', score: 0.78 },
          { name: 'H_PORT_ERROR', score: 0.65 },
        ],
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setEventInput(sampleEvents);
    setResults(null);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RCA Playground</h1>
          <p className="text-muted-foreground">Test the RCA engine with sample events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Event Input
              </CardTitle>
              <CardDescription>
                Enter events in CSV format: event_id, device, event_code, timestamp, severity, message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="Enter events here..."
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-3">
                <Button onClick={handleProcess} disabled={isProcessing} className="gap-2 gradient-primary">
                  <Play className="h-4 w-4" />
                  {isProcessing ? 'Processing...' : 'Run Analysis'}
                </Button>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Root cause analysis output
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results && !isProcessing && (
                <div className="text-center py-12 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run analysis to see results</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Processing events...</p>
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-status-success" />
                      <span className="font-semibold text-foreground">Root Cause Identified</span>
                    </div>
                    <p className="text-sm text-foreground">{results.rootCause}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <Badge variant="default" className="bg-status-success">
                        {Math.round(results.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Hypothesis Ranking</h4>
                    <div className="space-y-2">
                      {results.hypotheses.map((hyp, idx) => (
                        <div key={hyp.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{idx + 1}</Badge>
                            <span className="text-sm font-medium text-foreground">{hyp.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  idx === 0 ? "bg-status-success" : "bg-primary/60"
                                )}
                                style={{ width: `${hyp.score * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {Math.round(hyp.score * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>{results.clusters} cluster(s) identified from {eventInput.split('\n').filter(l => l.trim()).length} events</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
