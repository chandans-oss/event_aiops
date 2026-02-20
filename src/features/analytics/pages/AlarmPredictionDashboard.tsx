
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table';
import { Activity, TrendingUp, AlertTriangle, MonitorPlay, Zap, RefreshCw, Layers } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';

// Use more neutral/app-themed colors instead of aggressive cyan
const THEME = {
    primary: '#3b82f6', // blue-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444',  // red-500
    neutral: '#64748b'  // slate-500
};

const initialData = [
    { time: '10:00', util: 24, queue: 2, crc: 0 },
    { time: '10:05', util: 28, queue: 3, crc: 0 },
    { time: '10:10', util: 25, queue: 2, crc: 0 },
    { time: '10:15', util: 32, queue: 5, crc: 0 },
    { time: '10:20', util: 30, queue: 4, crc: 0 },
    { time: '10:25', util: 35, queue: 6, crc: 0 },
    { time: '10:30', util: 38, queue: 8, crc: 0 },
    { time: '10:35', util: 42, queue: 10, crc: 0 },
];

export default function AlarmPredictionDashboard() {
    const [data, setData] = useState(initialData);
    const [isLive, setIsLive] = useState(true);

    // Simulate live data updates
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setData(prev => {
                const last = prev[prev.length - 1];
                const [hour, checkMinute] = last.time.split(':').map(Number);

                // Advance time by 5 mins
                let newMinute = checkMinute + 5;
                let newHour = hour;
                if (newMinute >= 60) {
                    newMinute -= 60;
                    newHour = (newHour + 1) % 24;
                }
                const newTime = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;

                // Generate next values with some drift/logic
                // If high, maybe fluctuate or drop slightly (remediation?) or stay high (critical)
                // Let's make it fluctuate around high values to keep it critical
                const baseUtil = last.util > 90 ? 90 : last.util;
                const newUtil = Math.min(100, Math.max(50, baseUtil + (Math.random() * 10 - 3))); // Trend up generally

                const newQueue = Math.min(100, Math.max(0, newUtil - 10 + (Math.random() * 5))); // Correlated
                const newCrc = Math.min(20, Math.max(0, last.crc + (newUtil > 90 ? 1 : Math.random() > 0.8 ? 1 : 0))); // Accumulate if high util

                const newPoint = {
                    time: newTime,
                    util: Math.round(newUtil),
                    queue: Math.round(newQueue),
                    crc: Math.round(newCrc)
                };

                return [...prev.slice(1), newPoint]; // Keep window size constant
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, [isLive]);

    const getStatus = (util: number, crc: number) => {
        if (util > 90 || crc > 10) return { label: 'CRITICAL', color: 'bg-red-500/15 text-red-500 border-red-500/20' };
        if (util > 80 || crc > 5) return { label: 'WARNING', color: 'bg-orange-500/15 text-orange-500 border-orange-500/20' };
        if (util > 70 || crc > 0) return { label: 'WATCH', color: 'bg-amber-500/15 text-amber-500 border-amber-500/20' };
        return { label: 'NORMAL', color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' };
    };

    return (
        <MainLayout>
            <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
                {/* Header Section matching PatternDetail style */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Alarm Prediction Dashboard</h1>
                            <Badge variant="outline" className="text-[10px] h-5 px-2 bg-primary/10 text-primary border-primary/20 animate-pulse">
                                LIVE
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Real-time interface telemetry and anomaly forecast for <span className="font-mono text-foreground font-medium">R5-Gi0/1</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsLive(!isLive)}
                            className={isLive ? "bg-primary/10 text-primary border-primary/20" : ""}
                        >
                            {isLive ? <MonitorPlay className="mr-2 h-4 w-4" /> : <Layers className="mr-2 h-4 w-4" />}
                            {isLive ? 'Live Monitoring' : 'Paused'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setData(initialData)}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">

                    {/* Left Panel: Metrics Table (App Styled) */}
                    <Card className="lg:col-span-5 flex flex-col h-full border-border/60 shadow-sm">
                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    Raw Metrics Window (Last 40 min)
                                </CardTitle>
                                <span className="text-xs text-muted-foreground font-mono">T-Minus window</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <div className="overflow-auto h-full">
                                <Table>
                                    <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                                        <TableRow className="hover:bg-transparent border-border/40">
                                            <TableHead className="w-[80px] text-xs font-semibold">TIME</TableHead>
                                            <TableHead className="text-xs font-semibold text-right">UTIL %</TableHead>
                                            <TableHead className="text-xs font-semibold text-right">QUEUE %</TableHead>
                                            <TableHead className="text-xs font-semibold text-right">CRC ERR</TableHead>
                                            <TableHead className="w-[100px] text-xs font-semibold text-right pr-6">STATUS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...data].reverse().map((row, idx) => {
                                            const status = getStatus(row.util, row.crc);
                                            return (
                                                <TableRow key={idx} className="border-border/40 hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-mono text-xs text-muted-foreground">{row.time}</TableCell>
                                                    <TableCell className="font-mono text-xs text-right font-medium">{row.util}</TableCell>
                                                    <TableCell className="font-mono text-xs text-right text-muted-foreground">{row.queue}</TableCell>
                                                    <TableCell className={`font-mono text-xs text-right font-medium ${row.crc > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                        {row.crc}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-4">
                                                        <Badge variant="outline" className={`text-[10px] font-bold h-5 px-2 py-0 border ${status.color}`}>
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Panel: Chart (App Styled) */}
                    <Card className="lg:col-span-7 flex flex-col h-full border-border/60 shadow-sm relative overflow-hidden">
                        {/* Ambient background glow for high severity */}
                        {data[data.length - 1].util > 85 && (
                            <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none animate-pulse" />
                        )}

                        <CardHeader className="pb-2 border-b border-border/40 bg-muted/20 z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Live Metrics Analysis
                                </CardTitle>
                                {/* Legend */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 shadow-sm transition-all hover:bg-blue-500/15">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Util %</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/15">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-500 tracking-wide uppercase">Queue %</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 shadow-sm transition-all hover:bg-red-500/15">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 tracking-wide uppercase">CRC Errors</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 min-h-0 z-10">
                            <div className="w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={[0, 100]}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={[0, 20]}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--popover))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: '12px',
                                                color: 'hsl(var(--popover-foreground))'
                                            }}
                                            itemStyle={{ paddingTop: '2px', paddingBottom: '2px' }}
                                            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
                                        />
                                        <ReferenceLine y={90} yAxisId="left" stroke={THEME.danger} strokeDasharray="3 3" label={{ value: 'CRITICAL', position: 'right', fill: THEME.danger, fontSize: 10 }} />

                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="util"
                                            stroke={THEME.primary}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4, fill: THEME.primary }}
                                            animationDuration={1000}
                                        />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="queue"
                                            stroke={THEME.warning}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4, fill: THEME.warning }}
                                            animationDuration={1000}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="crc"
                                            stroke={THEME.danger}
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            dot={{ r: 3, fill: THEME.danger, strokeWidth: 0 }}
                                            activeDot={{ r: 5 }}
                                            animationDuration={1000}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
