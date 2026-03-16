import { useState, useEffect } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  Activity,
  Zap,
  Shield,
  Clock,
  Cpu,
  Database,
  Search,
  Settings,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  BarChart3,
  Network
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Link } from "react-router-dom";

const LIVE_INFERENCE_DATA = [
  {
    id: "INF-001",
    timestamp: "10:45:22",
    device: "router-03",
    interface: "Gi0/3/0",
    pattern: "Congestion Buildup",
    prediction: "PACKET_DROP",
    probability: 89.5,
    status: "CRITICAL",
    latency: "45ms",
    cpu_util: "68%"
  },
  {
    id: "INF-002",
    timestamp: "10:45:18",
    device: "switch-02",
    interface: "Eth1/1",
    pattern: "Spike/Recovery",
    prediction: "INTERFACE_FLAP",
    probability: 76.2,
    status: "WARNING",
    latency: "12ms",
    cpu_util: "34%"
  },
  {
    id: "INF-003",
    timestamp: "10:45:15",
    device: "router-01",
    interface: "Gi0/2/0",
    pattern: "Stable Baseline",
    prediction: "NONE",
    probability: 12.4,
    status: "HEALTHY",
    latency: "5ms",
    cpu_util: "22%"
  },
  {
    id: "INF-004",
    timestamp: "10:45:10",
    device: "router-05",
    interface: "Gi0/2/0",
    pattern: "Gradual Rise",
    prediction: "HIGH_UTIL_WARNING",
    probability: 64.8,
    status: "WARNING",
    latency: "28ms",
    cpu_util: "45%"
  },
  {
    id: "INF-005",
    timestamp: "10:45:05",
    device: "switch-04",
    interface: "Eth1/1",
    pattern: "Congestion Buildup",
    prediction: "PACKET_DROP",
    probability: 82.7,
    status: "CRITICAL",
    latency: "38ms",
    cpu_util: "59%"
  }
];

const METRIC_CARDS = [
  { label: "Active Inference", value: "1,280", sub: "/ sec", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Model Confidence", value: "96.4", sub: "% avg", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Processing Latency", value: "12.5", sub: "ms", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Resource Load", value: "42.8", sub: "% total", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" }
];

export default function LiveInferencePage() {
  const [isLive, setIsLive] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    "[10:45:22] INFERENCE ENGINE: router-03 Gi0/3/0 -> Predicted PACKET_DROP (89.5%)",
    "[10:45:18] INFERENCE ENGINE: switch-02 Eth1/1 -> Predicted INTERFACE_FLAP (76.2%)",
    "[10:45:15] INFERENCE ENGINE: router-01 Gi0/2/0 -> Predicted NONE (12.4%)",
    "[10:45:10] INFERENCE ENGINE: router-05 Gi0/2/0 -> Predicted HIGH_UTIL_WARNING (64.8%)",
    "[10:45:05] INFERENCE ENGINE: switch-04 Eth1/1 -> Predicted PACKET_DROP (82.7%)",
    "[10:45:00] SYSTEM: Loading fresh model weights v2.1.0...",
    "[10:44:55] DATA STREAM: Connecting to Kafka broker cluster-1...",
    "[10:44:50] SYSTEM: Live Inference Engine initialized."
  ]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const newLog = `[${time}] INFERENCE POLLING: Checking stream for new events...`;
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <MainLayout>
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <Activity className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Live Inference</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium pl-14">
              Real-time pattern matching and predictive event analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={cn(
                "h-10 px-6 gap-2 font-bold uppercase tracking-widest text-[10px] transition-all duration-500",
                isLive ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" : ""
              )}
            >
              {isLive ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Live Stream Active
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3" />
                  Resume Monitoring
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-primary/20 hover:bg-primary/5" asChild>
              <Link to="/pattern-prediction/model-outputs">
                <Settings className="h-4 w-4 text-primary" />
              </Link>
            </Button>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Database className="h-3 w-3" />
                Inference Stream
              </h2>
              <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary px-2">
                LAST 5 MINUTES
              </Badge>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden backdrop-blur-sm shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity Info</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Inference Result</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {LIVE_INFERENCE_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-primary/5 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{item.device}</span>
                            <span className="text-[9px] font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 border border-border/50">{item.interface}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Network className="h-3 w-3" />
                            <span>{item.pattern}</span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-black tracking-widest h-6 px-3 border-none",
                            item.status === "CRITICAL" ? "bg-rose-500/10 text-rose-500" :
                            item.status === "WARNING" ? "bg-amber-500/10 text-amber-500" :
                            "bg-emerald-500/10 text-emerald-500"
                          )}
                        >
                          {item.prediction}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn(
                            "text-xs font-black tabular-nums",
                            item.probability > 80 ? "text-rose-500" :
                            item.probability > 50 ? "text-amber-500" : "text-emerald-500"
                          )}>
                            {item.probability}%
                          </span>
                          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-1000",
                                item.probability > 80 ? "bg-rose-500" :
                                item.probability > 50 ? "bg-amber-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${item.probability}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Live Logs */}
            <div className="space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-2">
                <Terminal className="h-3 w-3" />
                System Logs
              </h2>
              <Card className="bg-[#0c0c0c] border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500/50" />
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500/50" />
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                  <span className="text-[9px] font-mono text-muted-foreground/60 ml-1 uppercase tracking-widest italic">Inference.Kernel</span>
                </div>
                <ScrollArea className="h-[400px] w-full bg-transparent p-4">
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <div key={i} className="font-mono text-[9px] leading-relaxed break-all transition-all duration-500 animate-in fade-in slide-in-from-left-2">
                        <span className={cn(
                          "opacity-80",
                          log.includes("CRITICAL") || log.includes("Predicted PACKET_DROP") ? "text-rose-400" :
                          log.includes("WARNING") ? "text-amber-400" :
                          log.includes("SYSTEM") ? "text-blue-400" : "text-emerald-400/70"
                        )}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
