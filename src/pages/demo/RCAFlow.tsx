import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Target, Lightbulb, FileText, Search, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const rcaSteps = [
  {
    id: 1,
    name: 'Orchestration',
    icon: Database,
    description: 'Gathering metrics, logs, events, and topology data from multiple sources',
    status: 'complete',
    details: ['Metrics collection', 'Log aggregation', 'Event normalization', 'Topology discovery'],
  },
  {
    id: 2,
    name: 'Intent Routing',
    icon: Target,
    description: 'Matching events against intent library to identify potential failure patterns',
    status: 'complete',
    details: ['Intent matching', 'Pattern recognition', 'Keyword extraction', 'Signal mapping'],
  },
  {
    id: 3,
    name: 'Hypothesis Scoring',
    icon: Lightbulb,
    description: 'Evaluating possible root causes based on evidence and historical data',
    status: 'complete',
    details: ['Prior probability', 'Signal matching', 'Log pattern analysis', 'Confidence scoring'],
  },
  {
    id: 4,
    name: 'Situation Builder',
    icon: FileText,
    description: 'Building contextual understanding of the incident and affected systems',
    status: 'active',
    details: ['Context assembly', 'Impact assessment', 'Timeline construction', 'Dependency mapping'],
  },
  {
    id: 5,
    name: 'Data Correlation Engine',
    icon: Search,
    description: 'Correlating events across time, topology, and causality',
    status: 'pending',
    details: ['Temporal correlation', 'Topological analysis', 'Causal inference', 'GNN modeling'],
  },
  {
    id: 6,
    name: 'RCA Engine',
    icon: Activity,
    description: 'Final root cause analysis and recommendation generation',
    status: 'pending',
    details: ['Root cause identification', 'Confidence calculation', 'Remediation suggestions', 'Report generation'],
  },
];

export default function RCAFlow() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RCA Pipeline Flow</h1>
          <p className="text-muted-foreground">Visualization of the Root Cause Analysis processing pipeline</p>
        </div>

        {/* Pipeline Visualization */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {rcaSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex flex-col items-center min-w-[120px]",
                  )}>
                    <div className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all",
                      step.status === 'complete' && "bg-status-success/20 border-status-success",
                      step.status === 'active' && "bg-primary/20 border-primary animate-pulse",
                      step.status === 'pending' && "bg-muted/30 border-border",
                    )}>
                      <Icon className={cn(
                        "h-7 w-7",
                        step.status === 'complete' && "text-status-success",
                        step.status === 'active' && "text-primary",
                        step.status === 'pending' && "text-muted-foreground",
                      )} />
                    </div>
                    <p className={cn(
                      "mt-2 text-sm font-medium text-center",
                      step.status === 'pending' && "text-muted-foreground",
                    )}>
                      {step.name}
                    </p>
                    <Badge variant={step.status === 'complete' ? 'default' : step.status === 'active' ? 'secondary' : 'outline'} className="mt-1">
                      {step.status}
                    </Badge>
                  </div>
                  {index < rcaSteps.length - 1 && (
                    <ArrowRight className={cn(
                      "h-6 w-6 mx-4",
                      step.status === 'complete' ? "text-status-success" : "text-muted-foreground",
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rcaSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} className={cn(
                "glass-card border-l-4",
                step.status === 'complete' && "border-l-status-success",
                step.status === 'active' && "border-l-primary",
                step.status === 'pending' && "border-l-border",
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "h-5 w-5",
                      step.status === 'complete' && "text-status-success",
                      step.status === 'active' && "text-primary",
                      step.status === 'pending' && "text-muted-foreground",
                    )} />
                    <CardTitle className="text-base">{step.name}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={cn(
                          "h-3 w-3",
                          step.status === 'complete' && "text-status-success",
                          step.status === 'active' && "text-primary",
                          step.status === 'pending' && "text-muted-foreground",
                        )} />
                        <span className={step.status === 'pending' ? "text-muted-foreground" : "text-foreground"}>
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
