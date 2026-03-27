import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { 
  Database, 
  Play, 
  RefreshCw, 
  XCircle, 
  CheckCircle2,
  Info, 
  Sparkles,
  Search,
  Filter,
  Activity,
  Calendar,
  Clock,
  Tag,
  Network,
  MapPin,
  Layers,
  Zap,
  History,
  TrendingUp,
  Snowflake,
  ShieldCheck,
  GitMerge
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { SuppressionSidebar, SuppressionTechnique } from "@/components/suppression/SuppressionSidebar";

// --- Types ---
interface RawEvent {
  id: number;
  raw: string;
  device: string;
  interface: string;
  event_code: string;
  timestamp: string;
  category?: string;
}

interface SuppressionResult {
  id: number;
  is_suppressed: boolean;
  category: string;
  reason: string;
  policy_id?: string;
  logic_details?: any;
}

// --- Mock Data ---
const SAMPLE_EVENTS: RawEvent[] = [
  { id: 1, raw: "Mar 27 02:15:01 Router1 REBOOT detected", device: "Router1", interface: "System", event_code: "SYS_REBOOT", timestamp: "02:15:01" },
  { id: 2, raw: "Mar 27 02:16:10 SW-CORE-1 Te1/1/1 flap", device: "SW-CORE-1", interface: "Te1/1/1", event_code: "IF_FLAP", timestamp: "02:16:10" },
  { id: 3, raw: "Mar 27 02:16:15 SW-CORE-1 Te1/1/1 flap", device: "SW-CORE-1", interface: "Te1/1/1", event_code: "IF_FLAP", timestamp: "02:16:15" },
  { id: 4, raw: "Mar 27 02:16:20 Gateway-HQ CPU high 92%", device: "Gateway-HQ", interface: "CPU", event_code: "PERF_CPU", timestamp: "02:16:20" },
  { id: 5, raw: "Mar 27 02:20:01 Edge-R3 BGP session down", device: "Edge-R3", interface: "BGP", event_code: "BGP_DOWN", timestamp: "02:20:01" },
  { id: 6, raw: "Mar 27 02:20:05 Printer-Floor2 Offline", device: "Printer-Floor2", interface: "Service", event_code: "SRV_OFFLINE", timestamp: "02:20:05" },
];

const TECHNIQUE_CONFIGS: Record<SuppressionTechnique, { label: string, icon: any, desc: string }> = {
  maintenance: { label: "Maintenance Window", icon: Calendar, desc: "Suppresses alerts during scheduled downtime." },
  business_hours: { label: "Business Hours", icon: Clock, desc: "Operating hours logic for non-critical assets." },
  tag_based: { label: "Tag-Based", icon: Tag, desc: "Filtering based on environment and system metadata." },
  parent_child: { label: "Parent-Child", icon: Network, desc: "Root cause analysis via topology dependency." },
  spatial: { label: "Spatial", icon: MapPin, desc: "Regional or local aggregation of concurrent events." },
  dedup_suppress: { label: "Dedup-Based", icon: Layers, desc: "Removal of high-frequency sub-second repeats." },
  time_window: { label: "Time-Window", icon: History, desc: "Suppression of redundant events in a sliding window." },
  flap_detection: { label: "Flap Detection", icon: Activity, desc: "Stability check for oscillating interface states." },
  temporal_cluster: { label: "Temporal Cluster", icon: GitMerge, desc: "Grouping of events occurring in close proximity." },
  dynamic_threshold: { label: "Dynamic Threshold", icon: TrendingUp, desc: "Suppression of events within learned baselines." },
  event_storm: { label: "Event Storm", icon: Zap, desc: "Suppression of known noisy patterns during major incidents." },
  seasonal: { label: "Seasonal", icon: Snowflake, desc: "Recognition of periodic recurring events." },
};

export default function SuppressionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const technique = (searchParams.get('technique') as SuppressionTechnique) || 'maintenance';
  const config = TECHNIQUE_CONFIGS[technique];

  const [events, setEvents] = useState<RawEvent[]>([]);
  const [results, setResults] = useState<Record<number, SuppressionResult>>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTechniqueChange = (newTechnique: SuppressionTechnique) => {
    const params = new URLSearchParams(searchParams);
    params.set('technique', newTechnique);
    setSearchParams(params);
  };

  useEffect(() => {
    setEvents([]);
    setResults({});
    setSelectedEventId(null);
  }, [technique]);

  const loadSamples = () => {
    setEvents(SAMPLE_EVENTS);
    setResults({});
    setSelectedEventId(null);
  };

  const runSuppression = () => {
    if (events.length === 0) return;
    setIsRunning(true);
    
    setTimeout(() => {
      const mockResults: Record<number, SuppressionResult> = {};
      
      events.forEach((evt) => {
        if (technique === 'maintenance' && evt.id === 1) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Maintenance Window", reason: "Event occurred during scheduled maintenance", policy_id: "MW-101", logic_details: { window: "02:00 – 03:00", activeCalendar: "Router1 Maintenance Plan", decision: "Suppressed (Expected behavior)" } };
        } else if (technique === 'business_hours' && evt.id === 6) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Business Hours", reason: "Outside business hours (Non-critical asset)", policy_id: "BH-99", logic_details: { assetType: "Printer", activeHours: "09:00 – 18:00", eventTime: "02:20", decision: "Suppressed / Downgraded" } };
        } else if (technique === 'tag_based' && evt.device.includes("HQ") === false) {
           mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Tag-Based", reason: "Non-production system policy", logic_details: { tags: "env=dev", policy: "Ignore dev alerts", decision: "Suppressed" } };
        } else if (technique === 'parent_child' && evt.id === 5) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Parent-Child", reason: "Downstream impact of parent failure", policy_id: "RCA-402", logic_details: { parentEvent: "Core-R1 LINK_DOWN", topologyPath: "Core-R1 → Edge-R3", decision: "Child event suppressed" } };
        } else if (technique === 'flap_detection' && (evt.id === 2 || evt.id === 3)) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Flap Detection", reason: "Interface instability detected", logic_details: { transitions: "DOWN → UP → DOWN → UP", count: "4 in 10s", action: "Final Alert: FLAPPING DETECTED" } };
        } else if (technique === 'dynamic_threshold' && evt.id === 4) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Dynamic Threshold", reason: "Within normal p95 baseline", logic_details: { currentVal: "92%", baselineP95: "95%", decision: "Suppressed as expected" } };
        } else if (technique === 'event_storm' && (evt.id === 2 || evt.id === 3)) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Event Storm", reason: "Matched post-reboot noise pattern", logic_details: { pattern: "Post-reboot storm", matchedEvents: "IF_FLAP x 100", action: "Aggregated suppression" } };
        } else if (technique === 'seasonal' && evt.id === 1) {
          mockResults[evt.id] = { id: evt.id, is_suppressed: true, category: "Seasonal", reason: "Recurring daily reboot pattern", logic_details: { pattern: "Daily reboot", recurrence: "6:15 AM (approx)", confidence: "92%", decision: "Suppressed" } };
        } else {
          mockResults[evt.id] = { id: evt.id, is_suppressed: false, category: "Active", reason: "Valid operational event" };
        }
      });
      
      setResults(mockResults);
      setIsRunning(false);
    }, 600);
  };

  const selectedResult = selectedEventId ? results[selectedEventId] : null;
  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <SuppressionSidebar 
          activeTechnique={technique} 
          onTechniqueChange={handleTechniqueChange} 
        />
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 space-y-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="glass-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <config.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Suppression Lab: {config.label}</h1>
                    <p className="text-sm text-muted-foreground">{config.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={loadSamples}
                    variant="outline"
                    className="gap-2 bg-secondary/50 border-border/50"
                  >
                    <RefreshCw className={cn("h-4 w-4", events.length > 0 && "text-status-success")} />
                    Load Events
                  </Button>
                  <Button 
                    onClick={runSuppression}
                    disabled={events.length === 0 || isRunning}
                    className="gap-2"
                  >
                    {isRunning ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 fill-primary" />
                    )}
                    Run Suppression
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="flex gap-4">
              <div className={cn(
                "transition-all duration-300",
                selectedEventId ? "w-2/3" : "w-full"
              )}>
                <div className="glass-card rounded-xl overflow-hidden border border-border/50 h-[calc(100vh-220px)] flex flex-col">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Resource</div>
                    <div className="col-span-4">Event Message</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3">Suppression Logic</div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="divide-y divide-border">
                      {events.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50 italic">
                          <Database className="h-10 w-10 mb-2" />
                          <p>Click "Load Events" to test suppression policies.</p>
                        </div>
                      ) : (
                        events.map((evt) => {
                          const result = results[evt.id];
                          return (
                            <div 
                              key={evt.id}
                              onClick={() => setSelectedEventId(evt.id)}
                              className={cn(
                                "grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-secondary/30 items-center",
                                selectedEventId === evt.id && "bg-secondary/50 ring-1 ring-primary/20"
                              )}
                            >
                              <div className="col-span-1 font-mono text-xs text-muted-foreground">#{evt.id}</div>
                              <div className="col-span-2">
                                <p className="text-sm font-semibold">{evt.device}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{evt.interface}</p>
                              </div>
                              <div className="col-span-4 text-xs font-mono text-muted-foreground break-all line-clamp-2">
                                {evt.raw}
                              </div>
                              <div className="col-span-2 text-center">
                                {result ? (
                                  <Badge className={cn(
                                    "text-[10px] tracking-tight py-0 w-24 justify-center font-bold",
                                    result.is_suppressed ? "bg-severity-critical/20 text-severity-critical border-severity-critical/30" : "bg-status-success/20 text-status-success border-status-success/30"
                                  )}>
                                    {result.is_suppressed ? "SUPPRESSED" : "ACTIVE"}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px]">WAITING</Badge>
                                )}
                              </div>
                              <div className="col-span-3 text-xs text-muted-foreground line-clamp-1 italic">
                                {result?.category || "---"}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Explainability Panel */}
              {selectedEventId && (
                <div className="w-1/3 animate-in slide-in-from-right-4 duration-300">
                  <Card className="glass-card h-[calc(100vh-220px)] border border-border/50 flex flex-col">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Suppression Insight
                      </h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEventId(null)} className="h-8 w-8">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <LabelAndValue label="Status" value={
                            <Badge className={cn(
                              "font-bold uppercase tracking-widest",
                              selectedResult?.is_suppressed ? "bg-severity-critical/20 text-severity-critical" : "bg-status-success/20 text-status-success"
                            )}>
                              {selectedResult?.is_suppressed ? "Suppressed" : "Active"}
                            </Badge>
                          } />

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Suppression Reason</p>
                            <p className="text-sm font-semibold leading-relaxed text-foreground bg-primary/5 p-3 rounded-lg border border-primary/20 italic">
                              "{selectedResult?.reason}"
                            </p>
                          </div>

                          <Separator className="bg-border/30" />

                          {/* Technical Trace */}
                          {selectedResult?.logic_details && (
                            <div className="space-y-4">
                               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Internal Logic Trace</p>
                               <div className="bg-secondary/20 p-4 rounded-xl space-y-3 border border-border/50">
                                  {Object.entries(selectedResult.logic_details).map(([key, val]: [string, any]) => (
                                    <div key={key} className="flex flex-col gap-1 border-b border-border/20 last:border-none pb-2 last:pb-0">
                                       <span className="text-[9px] uppercase font-bold text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                       <span className="text-sm font-semibold text-foreground">{val.toString()}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}

                          {selectedResult?.policy_id && (
                             <div className="pt-2">
                               <LabelAndValue label="Matched Policy" value={
                                 <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded border border-border/50">{selectedResult.policy_id}</span>
                               } />
                             </div>
                          )}

                          <div className="space-y-2 pt-4">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">RAW LOG</p>
                            <div className="p-3 bg-black/20 rounded-lg font-mono text-[10px] text-muted-foreground break-all border border-border/50">
                              {selectedEvent?.raw}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-border/30 bg-secondary/10">
                      <div className="flex items-center gap-2 justify-center">
                        <ShieldCheck className="h-4 w-4 text-status-success" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Noise Reduction Success</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function LabelAndValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}
