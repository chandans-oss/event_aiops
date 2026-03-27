import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";
import { 
  Database, 
  Layers, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sliders,
  Sparkles,
  Target,
  MessageSquare,
  Network,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { DedupSidebar, Technique } from "@/components/dedup/DedupSidebar";

// --- Types ---
interface RawEvent {
  id: number;
  raw: string;
  device: string;
  interface: string;
  event_code: string;
  timestamp: string;
}

interface DedupResult {
  id: number;
  is_duplicate: boolean;
  group_id: string;
  reason: string;
  confidence?: number;
  matched_with?: number;
  logic_details?: any;
}

// --- Mock Data ---
const SAMPLE_EVENTS: RawEvent[] = [
  { id: 1, raw: "Mar 27 10:01:01 Router1 Gi0/1 down", device: "Router1", interface: "Gi0/1", event_code: "LINK_DOWN", timestamp: "10:01:01" },
  { id: 2, raw: "Mar 27 10:01:02 Router1 Gi0/1 down", device: "Router1", interface: "Gi0/1", event_code: "LINK_DOWN", timestamp: "10:01:02" },
  { id: 3, raw: "Mar 27 10:01:05 Router1 Gi0/1 down", device: "Router1", interface: "Gi0/1", event_code: "LINK_DOWN", timestamp: "10:01:05" },
  { id: 4, raw: "Mar 27 10:01:10 SW-CORE-1 Te1/1/1 flap", device: "SW-CORE-1", interface: "Te1/1/1", event_code: "IF_FLAP", timestamp: "10:01:10" },
  { id: 5, raw: "Mar 27 10:01:12 SW-CORE-1 Te1/1/1 flap detected", device: "SW-CORE-1", interface: "Te1/1/1", event_code: "IF_FLAP", timestamp: "10:01:12" },
  { id: 6, raw: "Mar 27 10:01:15 Router1 Gi0/2 down", device: "Router1", interface: "Gi0/2", event_code: "LINK_DOWN", timestamp: "10:01:15" },
];

const TECHNIQUE_CONFIGS: Record<Technique, { label: string, icon: any, desc: string }> = {
  exact: { label: "Exact Match", icon: Target, desc: "Bit-by-bit identical raw log string comparison." },
  structured: { label: "Structured Exact", icon: Layers, desc: "Matches based on key fields: {Device, Interface, Code}." },
  state: { label: "State Transition", icon: RefreshCw, desc: "Suppresses repeated states without a transition." },
  template: { label: "Template-Based", icon: MessageSquare, desc: "Normalizes logs into templates before matching." },
  similarity: { label: "Similarity-Based", icon: Sliders, desc: "Uses TF-IDF + Cosine distance for fuzzy text matching." },
  semantic: { label: "Semantic-Based", icon: BrainCircuit, desc: "Uses LLM embeddings to cluster contextually identical events." },
};

export default function DeduplicationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const technique = (searchParams.get('technique') as Technique) || 'exact';
  const config = TECHNIQUE_CONFIGS[technique];

  const [events, setEvents] = useState<RawEvent[]>([]);
  const [results, setResults] = useState<Record<number, DedupResult>>({});
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTechniqueChange = (newTechnique: Technique) => {
    const params = new URLSearchParams(searchParams);
    params.set('technique', newTechnique);
    setSearchParams(params);
  };

  // Reset when technique changes
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

  const runDedup = () => {
    if (events.length === 0) return;
    setIsRunning(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockResults: Record<number, DedupResult> = {};
      
      events.forEach((evt, idx) => {
        if (idx === 0) {
          mockResults[evt.id] = { id: evt.id, is_duplicate: false, group_id: "G-101", reason: "First unique occurrence in window." };
        } else if (technique === 'exact' && (evt.id === 2 || evt.id === 3)) {
          mockResults[evt.id] = { id: evt.id, is_duplicate: true, group_id: "G-101", reason: "Same raw log detected", logic_details: { logic: "SHA256 hash matched", matchedWith: 1, confidence: 1.0 } };
        } else if (technique === 'structured' && evt.device === "Router1" && evt.event_code === "LINK_DOWN") {
          const isFirst = evt.id === 1;
          mockResults[evt.id] = { 
            id: evt.id, is_duplicate: !isFirst, group_id: "G-STRUCT", 
            reason: isFirst ? "Initial state anchor" : "Same logical signature match",
            logic_details: { signature: `{${evt.device}, ${evt.interface}, ${evt.event_code}}`, matchedWith: 1 }
          };
        } else if (technique === 'similarity' && evt.id === 5) {
          mockResults[evt.id] = { 
            id: evt.id, is_duplicate: true, group_id: "G-SIM", 
            reason: "High similarity score",
            confidence: 0.91, matched_with: 4, 
            logic_details: { method: "TF-IDF + Cosine Similarity", score: 0.91, matchedContent: events[3].raw }
          };
        } else if (technique === 'semantic' && (evt.id === 5 || evt.id === 6)) {
          mockResults[evt.id] = { 
            id: evt.id, is_duplicate: true, group_id: "G-SEM", 
            reason: "Contextual semantic meaning",
            confidence: 0.94, matched_with: idx > 0 ? events[0].id : undefined,
            logic_details: { embedding: "Ada-002 Vector Cluster", cluster: "Cluster-12", insight: "Port failure domain." }
          };
        } else if (technique === 'state' && (evt.id === 2 || evt.id === 3)) {
          mockResults[evt.id] = { 
            id: evt.id, is_duplicate: true, group_id: "G-STATE", 
            reason: "No state transition",
            logic_details: { prevState: "DOWN", currentState: "DOWN", action: "Ignored heartbeat" }
          };
        } else if (technique === 'template' && evt.id === 6) {
          mockResults[evt.id] = { 
            id: evt.id, is_duplicate: true, group_id: "G-TPL", 
            reason: "Template variation match",
            logic_details: { template: "Interface {X} down", matchedResource: "Gi0/2", matchedWith: 1 }
          };
        } else {
          mockResults[evt.id] = { id: evt.id, is_duplicate: false, group_id: `G-${evt.id}`, reason: "Unique event context." };
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
        <DedupSidebar 
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
                    <h1 className="text-xl font-bold text-foreground">Dedup Lab: {config.label}</h1>
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
                    Load Sample Events
                  </Button>
                  <Button 
                    onClick={runDedup}
                    disabled={events.length === 0 || isRunning}
                    className="gap-2"
                  >
                    {isRunning ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                    Run Deduplication
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Interface */}
            <div className="flex gap-4">
              <div className={cn(
                "transition-all duration-300",
                selectedEventId ? "w-2/3" : "w-full"
              )}>
                <div className="glass-card rounded-xl overflow-hidden border border-border/50 h-[calc(100vh-220px)] flex flex-col">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Device/Interface</div>
                    <div className="col-span-4">Original Message</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-3">Reasoning</div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="divide-y divide-border">
                      {events.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50 italic">
                          <Database className="h-10 w-10 mb-2" />
                          <p>No events loaded for this logic.</p>
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
                              <div className="col-span-1 font-mono text-xs">{evt.id}</div>
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
                                    "text-[10px] tracking-tight py-0 w-20 justify-center",
                                    result.is_duplicate ? "bg-severity-critical/20 text-severity-critical border-severity-critical/30" : "bg-status-success/20 text-status-success border-status-success/30"
                                  )}>
                                    {result.is_duplicate ? "DUPLICATE" : "UNIQUE"}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px]">PENDING</Badge>
                                )}
                              </div>
                              <div className="col-span-3 text-xs text-muted-foreground line-clamp-1 italic">
                                {result?.reason || "Awaiting processing..."}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Right Panel */}
              {selectedEventId && (
                <div className="w-1/3 animate-in slide-in-from-right-4 duration-300">
                  <Card className="glass-card h-[calc(100vh-220px)] border border-border/50 flex flex-col">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Event Insight
                      </h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEventId(null)} className="h-8 w-8">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      <div className="p-6 space-y-6">
                        <div className="space-y-4">
                          <div>
                            <LabelAndValue label="Status" value={
                              <Badge className={cn(
                                "font-bold uppercase tracking-widest",
                                selectedResult?.is_duplicate ? "bg-severity-critical/20 text-severity-critical" : "bg-status-success/20 text-status-success"
                              )}>
                                {selectedResult?.is_duplicate ? "Duplicate" : "Unique"}
                              </Badge>
                            } />
                          </div>
                          
                          <div>
                            <LabelAndValue label="Technique" value={config.label} />
                          </div>

                          <Separator className="bg-border/30" />

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Reasoning</p>
                            <p className="text-sm font-semibold leading-relaxed text-foreground bg-primary/5 p-3 rounded-lg border border-primary/20 italic">
                              "{selectedResult?.reason}"
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">RAW PAYLOAD</p>
                            <div className="p-4 bg-secondary/30 rounded-lg font-mono text-[11px] text-muted-foreground break-all border border-border/50 leading-relaxed">
                              {selectedEvent?.raw}
                            </div>
                          </div>

                          {/* Logic Specific details */}
                          {selectedResult?.logic_details && (
                            <div className="space-y-4 mt-6">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Internal Trace</p>
                              <div className="bg-secondary/20 p-4 rounded-xl space-y-3 border border-border/50">
                                {Object.entries(selectedResult.logic_details).map(([key, val]: [string, any]) => (
                                  <div key={key} className="flex justify-between items-start text-xs border-b border-border/20 last:border-none pb-2 mb-2 last:pb-0 last:mb-0">
                                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-mono text-foreground text-right">{val.toString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedResult?.confidence && (
                            <div className="pt-4">
                                <LabelAndValue 
                                  label="Confidence Score" 
                                  value={`${(selectedResult.confidence * 100).toFixed(0)}%`} 
                                />
                                <div className="h-1.5 w-full bg-secondary rounded-full mt-2">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${selectedResult.confidence * 100}%` }} />
                                </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
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
