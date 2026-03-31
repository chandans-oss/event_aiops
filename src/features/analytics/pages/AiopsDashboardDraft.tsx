import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { mockClusters, processingStats } from '@/data/mock/mockData';
import { sampleNetworkEvents } from '@/features/events/data/eventsData';
import { Activity, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

export default function AiopsDashboardDraft() {
  const navigate = useNavigate();

  // Pie chart data for events by severity (Synced with active events)
  const severityData = useMemo(() => {
    const counts = sampleNetworkEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Critical', value: counts['Critical'] || 0, color: 'hsl(var(--severity-critical))' },
      { name: 'Major', value: counts['Major'] || 0, color: 'hsl(var(--severity-high))' },
      { name: 'Minor', value: counts['Minor'] || 0, color: 'hsl(var(--severity-medium))' },
      { name: 'Low', value: counts['Low'] || 0, color: 'hsl(var(--severity-low))' },
    ].filter(d => d.value > 0);
  }, []);

  // Top 5 Events by Service Impact
  const eventImpactData = useMemo(() => {
    return mockClusters
      .map((cluster) => ({
        id: cluster.id,
        name: cluster.id.replace('CLU-', 'EVT-'),
        impact: cluster.affectedServices.length,
        rootCause: cluster.rca?.rootCause || 'Unknown',
        severity: cluster.rootEvent.severity,
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
  }, []);

  const handleRcaClick = (clusterId: string) => {
    navigate(`/events?cluster=${clusterId}&openSidebar=rca`);
  };

  const getScatterColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'hsl(0, 84%, 60%)';
      case 'Major': return 'hsl(25, 95%, 53%)';
      case 'Minor': return 'hsl(217, 91%, 60%)';
      default: return 'hsl(220, 9%, 46%)';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8 pt-2">
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground">Event Analytics (Draft)</h2>
            </div>
          </div>

          <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Event Impact Analysis
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Top 5 events by number of affected services
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">
                  Top {eventImpactData.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={eventImpactData}
                    layout="vertical"
                    margin={{ left: 20, right: 40, top: 0, bottom: 0 }}
                    barGap={8}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} opacity={0.6} />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      width={60}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const color = getScatterColor(data.severity);
                          return (
                            <div className="bg-card/95 border border-border rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[240px]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider">{data.id}</span>
                                <Badge className="text-[9px] h-4" style={{ backgroundColor: color, color: '#fff' }}>
                                  {data.severity}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-semibold leading-relaxed text-foreground">
                                  {data.rootCause}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                  <span className="text-[10px] text-muted-foreground font-medium">Affected Services</span>
                                  <span className="text-sm font-bold text-primary">{data.impact}</span>
                                </div>
                                <p className="text-[9px] text-primary/70 font-semibold mt-1 flex items-center gap-1 ">
                                  <Activity className="h-3 w-3" />
                                  Click to open RCA Workspace
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="impact"
                      radius={[0, 6, 6, 0]}
                      barSize={24}
                      onClick={(data) => handleRcaClick(data.id)}
                      style={{ cursor: 'pointer' }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {eventImpactData.map((entry, index) => {
                        let fillColor = 'hsl(var(--primary))';
                        if (entry.severity === 'Critical') fillColor = 'hsl(var(--severity-critical))';
                        else if (entry.severity === 'Major') fillColor = 'hsl(var(--severity-high))';
                        else if (entry.severity === 'Minor') fillColor = 'hsl(var(--severity-medium))';

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={fillColor}
                            className="transition-all duration-300 hover:brightness-110 opacity-100"
                          />
                        );
                      })}
                      <LabelList
                        dataKey="impact"
                        position="right"
                        offset={10}
                        style={{ fill: 'hsl(var(--foreground))', fontSize: '10px', fontWeight: 'bold', opacity: 0.8 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
