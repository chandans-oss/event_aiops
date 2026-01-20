import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockClusters, processingStats } from '@/data/mockData';
import { sampleNetworkEvents } from '@/data/eventsData';
import { SeverityIcon } from '@/components/SeverityIcon';
import { Activity, Target, Wrench, GitBranch } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
  RadialBarChart,
  RadialBar,
  LabelList,
} from 'recharts';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();

  // --- Original Dashboard Data ---

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

  // Pie chart data for event status (Synced with active events)
  const statusData = useMemo(() => {
    const counts = sampleNetworkEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Active', value: counts['Active'] || 0, color: 'hsl(var(--severity-critical))' },
      { name: 'Resolved', value: counts['Resolved'] || 0, color: 'hsl(var(--status-success))' },
      { name: 'Pending', value: counts['Pending'] || 0, color: 'hsl(var(--severity-high))' },
    ].filter(d => d.value > 0);
  }, []);

  // Processing pipeline data (Original)
  const pipelineData = useMemo(() => [
    { name: 'Total', events: processingStats.totalEvents },
    { name: 'Normalized', events: processingStats.normalized },
    { name: 'Deduplicated', events: processingStats.deduplicated },
    { name: 'Suppressed', events: processingStats.suppressed },
    { name: 'Clustered', events: processingStats.clustered },
  ], []);

  // Cluster formation data (Synced with mockClusters timestamps)
  const clusterTimeData = useMemo(() => {
    // Sort clusters by creation time
    const sortedClusters = [...mockClusters].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group by creation time or use as sequence
    return sortedClusters.map(c => ({
      time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clusters: 1, // Individual cluster formation
      events: c.childEvents.length + 1,
      id: c.id
    }));
  }, []);

  // Scatter plot for cluster distribution based on confidence
  const clusterScatterData = useMemo(() => {
    return mockClusters.map((cluster) => ({
      x: (cluster.rca?.confidence || 0.5) * 100,
      y: cluster.childEvents.length + 1,
      z: (cluster.rca?.confidence || 0.5) * 50,
      name: cluster.id,
      severity: cluster.rootEvent.severity,
      confidence: cluster.rca?.confidence || 0.5,
      rootCause: cluster.rca?.rootCause || 'Unknown',
    }));
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

  const handleClusterClick = (clusterId: string) => {
    navigate(`/events?cluster=${clusterId}`);
  };

  const handleRcaClick = (clusterId: string) => {
    // Navigate to events page and trigger RCA sidebar open via query params
    navigate(`/events?cluster=${clusterId}&openSidebar=rca`);
  };


  // Correlation methods data
  const correlationMethodsData = useMemo(() => {
    return [
      { name: 'Temporal', value: 35, color: 'hsl(217, 91%, 60%)' },
      { name: 'Causal', value: 28, color: 'hsl(142, 76%, 36%)' },
      { name: 'GNN', value: 18, color: 'hsl(25, 95%, 53%)' },
      { name: 'Topological', value: 12, color: 'hsl(280, 65%, 60%)' },
      { name: 'Spatial', value: 7, color: 'hsl(48, 96%, 53%)' },
    ];
  }, []);

  const getScatterColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'hsl(0, 84%, 60%)';
      case 'Major': return 'hsl(25, 95%, 53%)';
      case 'Minor': return 'hsl(217, 91%, 60%)';
      default: return 'hsl(220, 9%, 46%)';
    }
  };

  // --- Advanced Derived Data ---

  // MTTR Trend Performance Data
  const mttrTrendData = useMemo(() => [
    { time: '00:00', mttd: 5.2, mttr: 18.5 },
    { time: '04:00', mttd: 4.8, mttr: 15.2 },
    { time: '08:00', mttd: 6.5, mttr: 22.1 },
    { time: '12:00', mttd: 4.1, mttr: 12.8 },
    { time: '16:00', mttd: 3.9, mttr: 10.5 },
    { time: '20:00', mttd: 4.3, mttr: 14.1 },
  ], []);

  // Service Impact Treemap Data
  const serviceImpactData = useMemo(() => {
    const serviceCounts: Record<string, number> = {};
    mockClusters.forEach(c => {
      c.affectedServices.forEach(s => {
        serviceCounts[s] = (serviceCounts[s] || 0) + 1;
      });
    });

    return Object.entries(serviceCounts).map(([name, size]) => ({
      name,
      size,
      value: size,
    })).sort((a, b) => b.size - a.size);
  }, []);

  // Regional Heatmap Radar Data
  const regionalData = useMemo(() => [
    { region: 'North America', critical: 45, major: 30, minor: 20 },
    { region: 'Europe', critical: 32, major: 45, minor: 25 },
    { region: 'Asia Pacific', critical: 20, major: 25, minor: 40 },
    { region: 'South America', critical: 15, major: 20, minor: 35 },
    { region: 'Middle East', critical: 10, major: 15, minor: 20 },
  ], []);

  const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, index, name, value } = props;
    const colors = ['hsl(var(--primary))', 'hsl(25, 95%, 53%)', 'hsl(217, 91%, 60%)', 'hsl(280, 65%, 60%)', 'hsl(142, 76%, 36%)'];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
            strokeOpacity: 0.2,
          }}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 5}
              textAnchor="middle"
              fill="#fff"
              fontSize={11}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              fill="#fff"
              fontSize={9}
              fillOpacity={0.8}
            >
              Impact: {value}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-8 pt-2">

        {/* --- SECTION 2: RCA Diagnostic Intelligence --- */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
            <div>
              <h2 className="text-xl font-black tracking-tight text-foreground uppercase italic">RCA Diagnostic Intelligence</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Global confidence & correlation metrics</p>
            </div>
          </div>

          {/* Root Cause Analysis Confidence Chart - Redesigned */}
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
                                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.id}</span>
                                <Badge className="text-[9px] h-4" style={{ backgroundColor: color, color: '#fff' }}>
                                  {data.severity}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-semibold leading-relaxed text-foreground">
                                  {data.rootCause}
                                </p>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Affected Services</span>
                                  <span className="text-sm font-bold text-primary">{data.impact}</span>
                                </div>
                                <p className="text-[9px] text-primary/70 font-semibold mt-1 flex items-center gap-1 italic">
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

        {/* Top Row - Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Events by Severity */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Events by Status */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Processing Pipeline */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="events" fill="hsl(var(--primary))" fillOpacity={0.8} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Correlation Methods Widget */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events by Correlation Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={correlationMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {correlationMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Events']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Middle Row - Line Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clusters Over Time */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cluster Formation Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clusterTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clusters"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Clusters"
                    />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="hsl(25, 95%, 53%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(25, 95%, 53%)' }}
                      name="Events"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* K-Means Cluster Visualization - Click to navigate */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cluster Distribution by Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Confidence %"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      domain={[0, 100]}
                      label={{ value: 'Confidence %', position: 'bottom', fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Event Count"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      label={{ value: 'Event Count', angle: -90, position: 'left', fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border border-border rounded-lg p-2 text-xs">
                              <p className="font-medium text-foreground">{data.name}</p>
                              <p className="text-muted-foreground">Confidence: {Math.round(data.confidence * 100)}%</p>
                              <p className="text-muted-foreground">Events: {data.y}</p>
                              <p className="text-primary text-[10px] mt-1">Click to view cluster</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      name="Clusters"
                      data={clusterScatterData}
                      onClick={(data) => handleClusterClick(data.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {clusterScatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScatterColor(entry.severity)} fillOpacity={0.7} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-xs">
                  <SeverityIcon severity="Critical" className="h-3 w-3" />
                  <span className="text-muted-foreground">Critical</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <SeverityIcon severity="Major" className="h-3 w-3" />
                  <span className="text-muted-foreground">Major</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <SeverityIcon severity="Minor" className="h-3 w-3" />
                  <span className="text-muted-foreground">Minor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- SECTION 3: Advanced Advanced Decision Support --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {/* MTTR/MTTD Trends Section */}
          <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-severity-critical" />
                Operational Health Trends
              </CardTitle>
              <CardDescription className="text-xs">Mean Time to Detect (MTTD) and Resolve (MTTR) performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mttrTrendData}>
                    <defs>
                      <linearGradient id="colorMttr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="mttr"
                      name="Mean Time To Resolve"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMttr)"
                    />
                    <Area
                      type="monotone"
                      dataKey="mttd"
                      name="Mean Time To Detect"
                      stroke="hsl(25, 95%, 53%)"
                      strokeWidth={3}
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Dependency Impact Treemap */}
          <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-severity-low" />
                Service Impact Treemap
              </CardTitle>
              <CardDescription className="text-xs">Hierarchical visualization of services affected by ongoing incidents</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={serviceImpactData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="hsl(var(--background))"
                    content={<CustomTreemapContent />}
                  >
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border border-border rounded-lg p-2 text-xs">
                              <p className="font-bold">{data.name}</p>
                              <p className="text-muted-foreground">Impact Score: {data.value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regional Event Heatmap - Radar Chart */}
          <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden group lg:col-span-2">
            <CardHeader className="pb-4 border-b border-border/50 bg-secondary/5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-severity-high" />
                Regional Infrastructure Health
              </CardTitle>
              <CardDescription className="text-xs">Multi-dimensional analysis of event types across global regions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={regionalData} cx="50%" cy="50%" outerRadius="80%">
                    <PolarGrid stroke="hsl(var(--border))" opacity={0.5} />
                    <PolarAngleAxis dataKey="region" tick={{ fontSize: 11, fontWeight: 600, fill: 'hsl(var(--foreground))' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 60]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <Radar
                      name="Critical Incidents"
                      dataKey="critical"
                      stroke="hsl(var(--severity-critical))"
                      fill="hsl(var(--severity-critical))"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Major Incidents"
                      dataKey="major"
                      stroke="hsl(var(--severity-high))"
                      fill="hsl(var(--severity-high))"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Minor Issues"
                      dataKey="minor"
                      stroke="hsl(var(--severity-low))"
                      fill="hsl(var(--severity-low))"
                      fillOpacity={0.1}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout >
  );
}
