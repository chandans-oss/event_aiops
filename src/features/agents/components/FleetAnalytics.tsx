
import { Card, CardContent } from "@/shared/components/ui/card";
import {
    Activity,
    Bot,
    Cpu,
    Database,
    Zap,
    TrendingUp,
    Server,
    ShieldCheck
} from "lucide-react";
import { fleetMetrics } from "../data/fleetData";
import { cn } from "@/shared/lib/utils";

// Mini Sparkline component
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 100;
    const height = 40;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]"
            />
        </svg>
    );
};

export function FleetAnalytics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Active Agents */}
            <Card className="glass-card border-border/50 overflow-hidden group">
                <CardContent className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Fleet Capacity</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-black text-foreground">{fleetMetrics.activeAgents}</h4>
                            <span className="text-xs text-status-success font-bold">/ {fleetMetrics.totalAgents}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-status-success" /> 92% Nodes Healthy
                        </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                        <Server className="h-6 w-6 text-primary" />
                    </div>
                </CardContent>
            </Card>

            {/* Average CPU */}
            <Card className="glass-card border-border/50 overflow-hidden group">
                <CardContent className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Compute Load</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-black text-foreground">{fleetMetrics.avgCpu}%</h4>
                            <div className="text-[10px] text-status-success font-bold flex items-center">
                                <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 12%
                            </div>
                        </div>
                        <div className="mt-4">
                            <Sparkline data={[10, 15, 12, 18, 14, 20, 16, 12]} color="#10b981" />
                        </div>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                        <Cpu className="h-6 w-6 text-indigo-400" />
                    </div>
                </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card className="glass-card border-border/50 overflow-hidden group">
                <CardContent className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Memory Matrix</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl font-black text-foreground">{fleetMetrics.avgMemory}%</h4>
                            <span className="text-[10px] text-muted-foreground">Optimal</span>
                        </div>
                        <div className="mt-4">
                            <Sparkline data={[40, 42, 38, 45, 48, 44, 46, 44]} color="#6366f1" />
                        </div>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                        <Database className="h-6 w-6 text-purple-400" />
                    </div>
                </CardContent>
            </Card>

            {/* Ingestion Rate */}
            <Card className="glass-card border-border/50 overflow-hidden group">
                <CardContent className="p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Data Throughput</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-2xl font-black text-foreground whitespace-nowrap">{fleetMetrics.totalIngestion}</h4>
                        </div>
                        <p className="text-[10px] text-status-success font-bold mt-2 flex items-center gap-1">
                            <Zap className="h-2.5 w-2.5" /> High Bandwidth Mode
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
