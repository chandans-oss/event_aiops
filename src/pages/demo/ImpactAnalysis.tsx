import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Users, Server, Zap, TrendingDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const impactMetrics = [
  { label: 'Affected Users', value: '2,500', icon: Users, change: '+15%', severity: 'high' },
  { label: 'Impacted Services', value: '8', icon: Server, change: '+3', severity: 'medium' },
  { label: 'Network Latency', value: '350ms', icon: Zap, change: '+280%', severity: 'critical' },
  { label: 'Error Rate', value: '12.5%', icon: TrendingDown, change: '+11.2%', severity: 'high' },
];

const affectedServices = [
  { name: 'API Gateway', status: 'degraded', impact: 85, users: 1200 },
  { name: 'Web Application', status: 'degraded', impact: 75, users: 800 },
  { name: 'Database Primary', status: 'critical', impact: 95, users: 2500 },
  { name: 'Auth Service', status: 'degraded', impact: 60, users: 500 },
  { name: 'Payment Service', status: 'healthy', impact: 20, users: 150 },
  { name: 'Notification Service', status: 'healthy', impact: 15, users: 100 },
];

const timeline = [
  { time: '10:00:00', event: 'Link failure detected on Dist-R3', severity: 'critical' },
  { time: '10:00:02', event: 'Upstream failure propagated to Edge-S7', severity: 'critical' },
  { time: '10:00:05', event: 'BGP session dropped', severity: 'major' },
  { time: '10:00:10', event: 'Application timeouts started', severity: 'minor' },
  { time: '10:00:15', event: 'Route withdrawal detected on Core-R1', severity: 'warning' },
];

export default function ImpactAnalysis() {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Impact Analysis</h1>
          <p className="text-muted-foreground">Visualize the blast radius and service impact</p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className={cn(
                "glass-card border-l-4",
                metric.severity === 'critical' && "border-l-severity-critical",
                metric.severity === 'high' && "border-l-severity-high",
                metric.severity === 'medium' && "border-l-severity-medium",
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      metric.severity === 'critical' && "bg-severity-critical/20",
                      metric.severity === 'high' && "bg-severity-high/20",
                      metric.severity === 'medium' && "bg-severity-medium/20",
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        metric.severity === 'critical' && "text-severity-critical",
                        metric.severity === 'high' && "text-severity-high",
                        metric.severity === 'medium' && "text-severity-medium",
                      )} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-severity-critical">
                    {metric.change}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Affected Services */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Affected Services
              </CardTitle>
              <CardDescription>Service health and impact levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {affectedServices.map((service) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{service.name}</span>
                        <Badge variant={
                          service.status === 'critical' ? 'destructive' :
                          service.status === 'degraded' ? 'secondary' : 'outline'
                        }>
                          {service.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{service.users} users</span>
                    </div>
                    <Progress 
                      value={service.impact} 
                      className={cn(
                        "h-2",
                        service.impact > 80 && "[&>div]:bg-severity-critical",
                        service.impact > 50 && service.impact <= 80 && "[&>div]:bg-severity-high",
                        service.impact <= 50 && "[&>div]:bg-severity-medium",
                      )}
                    />
                    <p className="text-xs text-muted-foreground text-right">{service.impact}% impacted</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Timeline */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Impact Timeline
              </CardTitle>
              <CardDescription>Sequence of events and propagation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        item.severity === 'critical' && "bg-severity-critical",
                        item.severity === 'major' && "bg-severity-high",
                        item.severity === 'minor' && "bg-severity-low",
                        item.severity === 'warning' && "bg-severity-medium",
                      )} />
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-muted-foreground">{item.time}</span>
                        <Badge variant="outline" className={cn(
                          item.severity === 'critical' && "border-severity-critical text-severity-critical",
                          item.severity === 'major' && "border-severity-high text-severity-high",
                          item.severity === 'minor' && "border-severity-low text-severity-low",
                          item.severity === 'warning' && "border-severity-medium text-severity-medium",
                        )}>
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blast Radius Visualization */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-severity-critical" />
              Blast Radius Summary
            </CardTitle>
            <CardDescription>Overall impact assessment of the incident</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-xl bg-severity-critical/10 border border-severity-critical/30">
                <p className="text-4xl font-bold text-severity-critical">3</p>
                <p className="text-sm text-muted-foreground mt-1">Critical Services</p>
              </div>
              <div className="p-6 rounded-xl bg-severity-high/10 border border-severity-high/30">
                <p className="text-4xl font-bold text-severity-high">5</p>
                <p className="text-sm text-muted-foreground mt-1">Degraded Services</p>
              </div>
              <div className="p-6 rounded-xl bg-status-success/10 border border-status-success/30">
                <p className="text-4xl font-bold text-status-success">12</p>
                <p className="text-sm text-muted-foreground mt-1">Healthy Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
