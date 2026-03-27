import { useState, useEffect } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  ChevronLeft,
  Settings,
  History,
  Monitor,
  Activity,
  Database,
  Terminal,
  Clock,
  Cpu,
  Zap,
  ShieldCheck,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

// Mock data generator for 75 minutes
const generateMinuteData = (device: string) => {
  return Array.from({ length: 75 }, (_, i) => {
    const minute = 75 - i;
    const probability = Math.floor(Math.random() * 40) + (minute < 10 ? 50 : 20);
    const status = probability > 80 ? "Critical" : probability > 60 ? "Warning" : "Healthy";

    return {
      t: `T-${minute}m`,
      timestamp: new Date(Date.now() - minute * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      polled_value: (Math.random() * 100).toFixed(2),
      model_output: probability > 50 ? "AnomalyDetected" : "Nominal",
      confidence: probability,
      status: status,
      load: (Math.random() * 20 + 40).toFixed(1) + "%"
    };
  });
};

const DEVICES = ["router-03", "switch-02", "router-01", "router-05", "switch-04"];

export default function ModelOutputsPage() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [data] = useState(generateMinuteData(selectedDevice));

  const [activeBatches, setActiveBatches] = useState([
    { id: "Batch 104", start: "10:52 AM", end: "12:07 PM", color: "bg-cyan-500/30", text: "text-cyan-400", offset: "0%" },
    { id: "Batch 105", start: "10:53 AM", end: "12:08 PM", color: "bg-emerald-500/30", text: "text-emerald-400", offset: "5%" },
    { id: "Batch 106", start: "10:54 AM", end: "12:09 PM", color: "bg-purple-500/30", text: "text-purple-400", offset: "10%" },
    { id: "Batch 107", start: "10:55 AM", end: "12:10 PM", color: "bg-amber-500/30", text: "text-amber-400", offset: "15%" },
    { id: "Batch 108", start: "10:56 AM", end: "12:11 PM", color: "bg-blue-600/30", text: "text-blue-400", offset: "20%" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBatches(prev => {
        const lastBatch = prev[prev.length - 1];
        const lastBatchNum = parseInt(lastBatch.id.split(" ")[1]);
        const lastStartTime = new Date(`2026-03-16 ${lastBatch.start}`);
        const newStartTime = new Date(lastStartTime.getTime() + 60000);
        const newEndTime = new Date(newStartTime.getTime() + 75 * 60000);

        const newBatch = {
          id: `Batch ${lastBatchNum + 1}`,
          start: newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end: newEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: lastBatch.color,
          text: lastBatch.text,
          offset: `${Math.min(parseFloat(lastBatch.offset) + 5, 40)}%`
        };

        return [...prev.slice(1), newBatch];
      });
    }, 60000); // 1 minute interval

    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                <Link to="/pattern-prediction/live-inference">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">EngineConfiguration</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium pl-24">
              Detailed Model Analysis & 75-Minute Window Diagnostic
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">TargetEntity</span>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="w-[180px] bg-card/50 border-primary/20 font-bold h-10">
                  <SelectValue placeholder="Select Device" />
                </SelectTrigger>
                <SelectContent>
                  {DEVICES.map(d => (
                    <SelectItem key={d} value={d} className="font-medium">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-primary/20 mt-5">
              <Filter className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>

        {/* Window Sliding Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Zap className="h-3 w-3" />
                LiveWindowInference: {selectedDevice}
              </h2>
              <Badge variant="outline" className="text-[9px] font-bold border-emerald-500/20 text-emerald-500 animate-pulse uppercase tracking-widest">
                RealTimePollingActive
              </Badge>
            </div>
            <Card className="p-8 bg-[#0a0a0a] border-white/5 space-y-6 overflow-hidden relative group">
            {activeBatches.map((batch, i) => (
              <div key={batch.id} className="flex items-center gap-4 group/batch animate-in slide-in-from-right-4 duration-500">
                <span className="text-[9px] font-mono text-muted-foreground/50 w-20 leading-none uppercase">{batch.id}</span>
                <div className="flex-1 h-10 bg-white/5 rounded-lg relative flex items-center border border-white/5 overflow-hidden p-1">
                  {/* Loading/Filling Track */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="h-full w-full" style={{ background: `linear-gradient(90deg, transparent, ${batch.text.replace('text-', '')}, transparent)`, backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
                  </div>

                  <div
                    className={cn("h-full rounded-md flex items-center justify-between px-4 border-l-2 border-l-primary/50 transition-all duration-1000 shadow-lg relative z-10", batch.color)}
                    style={{
                      marginLeft: batch.offset,
                      width: "70%",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[9px] font-black tracking-tighter whitespace-nowrap", batch.text)}>{batch.start}</span>
                      <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse" />
                    </div>

                    {/* Filling Bar Effect */}
                    <div className="flex-1 mx-6 h-1 w-full bg-black/20 rounded-full overflow-hidden relative">
                      <div className={cn("absolute inset-0 opacity-40", batch.color)} style={{ width: '85%', borderRadius: 'inherit' }} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>

                    <span className={cn("text-[9px] font-black tracking-tighter whitespace-nowrap", batch.text)}>{batch.end}</span>
                  </div>
                </div>
              </div>
            ))}

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/5">
            {[
              { label: "Window=75m", color: "bg-cyan-500" },
              { label: "Poll=1m", color: "bg-amber-500" },
              { label: "DirectDeviceStream", color: "bg-emerald-500" },
              { label: "ZeroAggregation", color: "bg-purple-500" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-sm", item.color)} />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-2 pt-1">
          <Filter className="h-3 w-3" />
          ActiveFeatures
        </h2>
        <Card className="p-5 bg-gradient-to-b from-white/5 to-transparent border-white/5 space-y-4">
          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed border-b border-white/5 pb-3">
            Model is extracting following metrics from {selectedDevice}:
          </p>
          <div className="space-y-4">
            {[
              { key: 'util_pct', name: 'InterfaceUtilization', unit: '%', desc: 'Current load vs capacity' },
              { key: 'queue_depth', name: 'BufferQueueDepth', unit: 'pkts', desc: 'Congestion indicator' },
              { key: 'crc_errors', name: 'CrcErrorRate', unit: 'err/s', desc: 'Physical layer integrity' },
              { key: 'latency_ms', name: 'InternalLatency', unit: 'ms', desc: 'Kernel processing time' },
            ].map((metric) => (
              <div key={metric.key} className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-foreground uppercase tracking-tighter italic">{metric.key}</span>
                  <Badge variant="outline" className="text-[8px] bg-primary/5 text-primary border-primary/20">{metric.unit}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase opacity-80">{metric.name}</p>
                  <p className="text-[8px] text-muted-foreground/40 italic">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <ShieldCheck className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Validation Mode</span>
          </div>
          <p className="text-[8px] text-orange-400/60 font-medium leading-normal italic">
            All telemetry is verified for schema compliance before inference ingestion.
          </p>
        </div>
      </div>
    </div>

        {/* Diagnostic Grid */ }
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    {/* Quick Stats Sidebar */}
    <div className="space-y-6">
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 px-2">
        <Monitor className="h-3 w-3" />
        ModelContext
      </h2>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/10 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-border pb-2">
            <span>Window Size</span>
            <span className="text-foreground">75 Minutes</span>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-border pb-2">
            <span>Polling Rate</span>
            <span className="text-foreground">60 Seconds</span>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-border pb-2">
            <span>Total Data Points</span>
            <span className="text-foreground">4,500</span>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-border pb-2">
            <span>Engine Latency</span>
            <span className="text-emerald-500">12ms</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
            <Database className="mr-2 h-3 w-3" />
            Flush Cache
          </Button>
          <Button className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">
            <Zap className="mr-2 h-3 w-3" />
            Recalibrate
          </Button>
        </div>
      </Card>

      <div className="rounded-2xl bg-[#0a0a0a] p-4 border border-white/5 space-y-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest italic text-emerald-500/80">ActiveProtections</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-[8px] bg-emerald-500/5 text-emerald-500 border-emerald-500/20">Drift Detect</Badge>
          <Badge variant="outline" className="text-[8px] bg-blue-500/5 text-blue-500 border-blue-500/20">Auto-Scaling</Badge>
        </div>
      </div>
    </div>

    {/* Main Time Window Table */}
    <div className="lg:col-span-3 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <History className="h-3 w-3" />
          ObservabilityWindow75Min
        </h2>
        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest">
          LAST UPDATED: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden backdrop-blur-sm shadow-2xl">
        <ScrollArea className="h-[600px] w-full">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border/50 bg-[#121212]/90 backdrop-blur-xl">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">RelativeTime</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">PolledRawData</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">ModelIntelligence</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right whitespace-nowrap">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-all group border-l-2 border-l-transparent hover:border-l-primary">
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-black tabular-nums text-muted-foreground group-hover:text-primary">{item.t}</span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground/70">
                    {item.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[11px] font-black tabular-nums">{item.polled_value} <span className="text-[9px] opacity-40 font-normal">units</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-black tracking-widest px-2 py-0 border-none h-6",
                        item.status === "Critical" ? "bg-rose-500/10 text-rose-500" :
                          item.status === "Warning" ? "bg-amber-500/10 text-amber-500" :
                            "bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {item.model_output}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "text-[10px] font-black tabular-nums",
                        item.confidence > 80 ? "text-rose-500" :
                          item.confidence > 50 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {item.confidence}%
                      </span>
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div className={cn(
                          "h-full transition-all duration-1000",
                          item.confidence > 80 ? "bg-rose-500" :
                            item.confidence > 50 ? "bg-amber-500" : "bg-emerald-500"
                        )} style={{ width: `${item.confidence}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <Activity className="h-4 w-4 text-primary animate-pulse" />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Real-time visualization of model inference history. Each row represents a 60-second polling interval synchronized across global clusters.
        </p>
      </div>
    </div>
  </div>
      </div >
    </MainLayout >
  );
}
