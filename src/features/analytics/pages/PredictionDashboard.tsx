import React, { useState, MouseEvent } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Activity, RefreshCw, Maximize, AlertCircle, TrendingUp, AlertTriangle, MonitorPlay, Zap, ArrowRight, X, Info, BrainCircuit, ActivitySquare, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// --- DATA DEFINITIONS ---
const topologies: Record<string, any> = {
    enterprise: {
        nodes: [
            { id: 'CORE-RTR-01', x: 400, y: 150, type: 'router', status: 'critical', predicted: false },
            { id: 'CORE-RTR-02', x: 500, y: 150, type: 'router', status: 'normal', predicted: false },
            { id: 'FW-01', x: 300, y: 250, type: 'firewall', status: 'warning', predicted: false },
            { id: 'FW-02', x: 600, y: 250, type: 'firewall', status: 'normal', predicted: false },
            { id: 'LB-PRIMARY', x: 450, y: 320, type: 'loadbalancer', status: 'warning', predicted: true, reason: 'Traffic spike indicative of imminent congestion threshold breach' },
            { id: 'EDGE-SW-05', x: 250, y: 400, type: 'switch', status: 'critical', predicted: true, reason: 'Buffer utilization predicted to exceed 95% within 10 minutes' },
            { id: 'DIST-SW-03', x: 450, y: 400, type: 'switch', status: 'warning', predicted: false },
            { id: 'DIST-SW-04', x: 650, y: 400, type: 'switch', status: 'normal', predicted: false },
            { id: 'ACCESS-SW-12', x: 200, y: 500, type: 'switch', status: 'normal', predicted: false },
            { id: 'ACCESS-SW-13', x: 350, y: 500, type: 'switch', status: 'normal', predicted: false },
            { id: 'ACCESS-SW-14', x: 550, y: 500, type: 'switch', status: 'normal', predicted: false },
            { id: 'ACCESS-SW-15', x: 700, y: 500, type: 'switch', status: 'normal', predicted: false }
        ],
        links: [
            { source: 'CORE-RTR-01', target: 'CORE-RTR-02', status: 'normal', predicted: false },
            { source: 'CORE-RTR-01', target: 'FW-01', status: 'normal', predicted: false },
            { source: 'CORE-RTR-02', target: 'FW-02', status: 'normal', predicted: false },
            { source: 'FW-01', target: 'LB-PRIMARY', status: 'warning', predicted: false },
            { source: 'FW-02', target: 'LB-PRIMARY', status: 'normal', predicted: false },
            { source: 'LB-PRIMARY', target: 'EDGE-SW-05', status: 'critical', predicted: false },
            { source: 'LB-PRIMARY', target: 'DIST-SW-03', status: 'warning', predicted: false },
            { source: 'LB-PRIMARY', target: 'DIST-SW-04', status: 'normal', predicted: false },
            { source: 'EDGE-SW-05', target: 'DIST-SW-03', status: 'critical', predicted: true, reason: 'Historical correlation: 88% chance of cascade failure propagation along this link' },
            { source: 'EDGE-SW-05', target: 'ACCESS-SW-12', status: 'warning', predicted: false },
            { source: 'EDGE-SW-05', target: 'ACCESS-SW-13', status: 'normal', predicted: false },
            { source: 'DIST-SW-03', target: 'ACCESS-SW-13', status: 'normal', predicted: false },
            { source: 'DIST-SW-03', target: 'ACCESS-SW-14', status: 'normal', predicted: true, reason: 'Predicted BGP route flap instability pushing excess traffic' },
            { source: 'DIST-SW-04', target: 'ACCESS-SW-14', status: 'normal', predicted: false },
            { source: 'DIST-SW-04', target: 'ACCESS-SW-15', status: 'normal', predicted: false }
        ]
    },
    cloud: {
        nodes: [
            { id: 'VPN-GW-01', x: 300, y: 100, type: 'router', status: 'normal', predicted: false },
            { id: 'VPN-GW-02', x: 600, y: 100, type: 'router', status: 'normal', predicted: false },
            { id: 'CLOUD-LB-AWS', x: 200, y: 220, type: 'loadbalancer', status: 'normal', predicted: false },
            { id: 'CLOUD-LB-AZURE', x: 450, y: 220, type: 'loadbalancer', status: 'warning', predicted: true, reason: 'Connection drop rate escalating dynamically toward SLA violation limit' },
            { id: 'CLOUD-LB-GCP', x: 700, y: 220, type: 'loadbalancer', status: 'normal', predicted: false },
            { id: 'K8S-MASTER-1', x: 250, y: 350, type: 'server', status: 'normal', predicted: false },
            { id: 'K8S-MASTER-2', x: 400, y: 350, type: 'server', status: 'normal', predicted: false },
            { id: 'K8S-MASTER-3', x: 550, y: 350, type: 'server', status: 'warning', predicted: false },
            { id: 'WORKER-NODE-1', x: 150, y: 480, type: 'server', status: 'normal', predicted: false },
            { id: 'WORKER-NODE-2', x: 300, y: 480, type: 'server', status: 'normal', predicted: false },
            { id: 'WORKER-NODE-3', x: 450, y: 480, type: 'server', status: 'critical', predicted: false },
            { id: 'WORKER-NODE-4', x: 600, y: 480, type: 'server', status: 'normal', predicted: false },
            { id: 'WORKER-NODE-5', x: 750, y: 480, type: 'server', status: 'normal', predicted: false },
            { id: 'DB-PRIMARY', x: 300, y: 550, type: 'database', status: 'warning', predicted: true, reason: 'Deadlock frequency rising; predictive cluster failure within 30m' },
            { id: 'DB-REPLICA', x: 600, y: 550, type: 'database', status: 'normal', predicted: false }
        ],
        links: [
            { source: 'VPN-GW-01', target: 'CLOUD-LB-AWS', status: 'normal', predicted: false },
            { source: 'VPN-GW-01', target: 'CLOUD-LB-AZURE', status: 'warning', predicted: false },
            { source: 'VPN-GW-02', target: 'CLOUD-LB-AZURE', status: 'normal', predicted: false },
            { source: 'VPN-GW-02', target: 'CLOUD-LB-GCP', status: 'normal', predicted: false },
            { source: 'CLOUD-LB-AWS', target: 'K8S-MASTER-1', status: 'normal', predicted: false },
            { source: 'CLOUD-LB-AZURE', target: 'K8S-MASTER-2', status: 'warning', predicted: true, reason: 'Consistent with historical load balancer cascading routing errors' },
            { source: 'CLOUD-LB-GCP', target: 'K8S-MASTER-3', status: 'normal', predicted: false },
            { source: 'K8S-MASTER-1', target: 'WORKER-NODE-1', status: 'normal', predicted: false },
            { source: 'K8S-MASTER-1', target: 'WORKER-NODE-2', status: 'normal', predicted: false },
            { source: 'K8S-MASTER-2', target: 'WORKER-NODE-2', status: 'normal', predicted: false },
            { source: 'K8S-MASTER-2', target: 'WORKER-NODE-3', status: 'critical', predicted: false },
            { source: 'K8S-MASTER-3', target: 'WORKER-NODE-4', status: 'normal', predicted: false },
            { source: 'K8S-MASTER-3', target: 'WORKER-NODE-5', status: 'normal', predicted: false },
            { source: 'WORKER-NODE-2', target: 'DB-PRIMARY', status: 'warning', predicted: false },
            { source: 'WORKER-NODE-3', target: 'DB-PRIMARY', status: 'critical', predicted: true, reason: 'I/O wait pattern matches impending storage cluster latency spike event' },
            { source: 'DB-PRIMARY', target: 'DB-REPLICA', status: 'normal', predicted: false }
        ]
    },
    edge: {
        nodes: [
            { id: 'CENTRAL-DC', x: 450, y: 150, type: 'datacenter', status: 'normal', predicted: false },
            { id: 'EDGE-POP-01', x: 250, y: 280, type: 'router', status: 'warning', predicted: true },
            { id: 'EDGE-POP-02', x: 450, y: 280, type: 'router', status: 'normal', predicted: false },
            { id: 'EDGE-POP-03', x: 650, y: 280, type: 'router', status: 'normal', predicted: false },
            { id: 'CDN-CACHE-1', x: 150, y: 420, type: 'server', status: 'warning', predicted: false },
            { id: 'CDN-CACHE-2', x: 350, y: 420, type: 'server', status: 'normal', predicted: false },
            { id: 'CDN-CACHE-3', x: 550, y: 420, type: 'server', status: 'critical', predicted: false },
            { id: 'CDN-CACHE-4', x: 750, y: 420, type: 'server', status: 'normal', predicted: false },
            { id: 'IOT-GW-1', x: 200, y: 540, type: 'gateway', status: 'normal', predicted: false },
            { id: 'IOT-GW-2', x: 700, y: 540, type: 'gateway', status: 'normal', predicted: false }
        ],
        links: [
            { source: 'CENTRAL-DC', target: 'EDGE-POP-01', status: 'warning', predicted: false },
            { source: 'CENTRAL-DC', target: 'EDGE-POP-02', status: 'normal', predicted: false },
            { source: 'CENTRAL-DC', target: 'EDGE-POP-03', status: 'normal', predicted: false },
            { source: 'EDGE-POP-01', target: 'CDN-CACHE-1', status: 'warning', predicted: true },
            { source: 'EDGE-POP-01', target: 'CDN-CACHE-2', status: 'normal', predicted: false },
            { source: 'EDGE-POP-02', target: 'CDN-CACHE-2', status: 'normal', predicted: false },
            { source: 'EDGE-POP-02', target: 'CDN-CACHE-3', status: 'critical', predicted: false },
            { source: 'EDGE-POP-03', target: 'CDN-CACHE-3', status: 'normal', predicted: false },
            { source: 'EDGE-POP-03', target: 'CDN-CACHE-4', status: 'normal', predicted: false },
            { source: 'CDN-CACHE-1', target: 'IOT-GW-1', status: 'normal', predicted: false },
            { source: 'CDN-CACHE-4', target: 'IOT-GW-2', status: 'normal', predicted: false }
        ]
    },
    hybrid: {
        nodes: [
            { id: 'MPLS-PE-01', x: 300, y: 120, type: 'router', status: 'normal', predicted: false },
            { id: 'MPLS-PE-02', x: 600, y: 120, type: 'router', status: 'normal', predicted: false },
            { id: 'SD-WAN-HUB', x: 450, y: 230, type: 'router', status: 'warning', predicted: true, reason: 'IPSec tunnel keepalive failures rising beyond stable baseline' },
            { id: 'BRANCH-FW-1', x: 200, y: 350, type: 'firewall', status: 'normal', predicted: false },
            { id: 'BRANCH-FW-2', x: 400, y: 350, type: 'firewall', status: 'warning', predicted: false },
            { id: 'BRANCH-FW-3', x: 600, y: 350, type: 'firewall', status: 'normal', predicted: false },
            { id: 'BRANCH-FW-4', x: 800, y: 350, type: 'firewall', status: 'normal', predicted: false },
            { id: 'LAN-SW-1', x: 150, y: 480, type: 'switch', status: 'normal', predicted: false },
            { id: 'LAN-SW-2', x: 300, y: 480, type: 'switch', status: 'normal', predicted: false },
            { id: 'LAN-SW-3', x: 450, y: 480, type: 'switch', status: 'critical', predicted: false },
            { id: 'LAN-SW-4', x: 600, y: 480, type: 'switch', status: 'warning', predicted: false },
            { id: 'LAN-SW-5', x: 750, y: 480, type: 'switch', status: 'normal', predicted: false },
            { id: 'WIFI-AP-1', x: 250, y: 560, type: 'accesspoint', status: 'normal', predicted: false },
            { id: 'WIFI-AP-2', x: 650, y: 560, type: 'accesspoint', status: 'normal', predicted: false }
        ],
        links: [
            { source: 'MPLS-PE-01', target: 'SD-WAN-HUB', status: 'normal', predicted: false },
            { source: 'MPLS-PE-02', target: 'SD-WAN-HUB', status: 'normal', predicted: false },
            { source: 'SD-WAN-HUB', target: 'BRANCH-FW-1', status: 'normal', predicted: false },
            { source: 'SD-WAN-HUB', target: 'BRANCH-FW-2', status: 'warning', predicted: true, reason: 'Jitter thresholds prediction exceeded based on current network degradation' },
            { source: 'SD-WAN-HUB', target: 'BRANCH-FW-3', status: 'normal', predicted: false },
            { source: 'SD-WAN-HUB', target: 'BRANCH-FW-4', status: 'normal', predicted: false },
            { source: 'BRANCH-FW-1', target: 'LAN-SW-1', status: 'normal', predicted: false },
            { source: 'BRANCH-FW-1', target: 'LAN-SW-2', status: 'normal', predicted: false },
            { source: 'BRANCH-FW-2', target: 'LAN-SW-2', status: 'warning', predicted: false },
            { source: 'BRANCH-FW-2', target: 'LAN-SW-3', status: 'critical', predicted: false },
            { source: 'BRANCH-FW-3', target: 'LAN-SW-4', status: 'normal', predicted: false },
            { source: 'BRANCH-FW-4', target: 'LAN-SW-5', status: 'normal', predicted: false },
            { source: 'LAN-SW-2', target: 'WIFI-AP-1', status: 'normal', predicted: false },
            { source: 'LAN-SW-4', target: 'WIFI-AP-2', status: 'normal', predicted: false }
        ]
    }
};

const STATUS_COLORS: Record<string, string> = {
    normal: '#10b981', // Tailwind emerald-500
    warning: '#f59e0b', // Tailwind amber-500
    critical: '#ef4444', // Tailwind red-500
    info: '#3b82f6'     // Tailwind blue-500
};

const NODE_TYPES: Record<string, { size: number, icon: string }> = {
    router: { size: 20, icon: 'R' },
    switch: { size: 18, icon: 'S' },
    firewall: { size: 20, icon: 'F' },
    loadbalancer: { size: 19, icon: 'L' },
    server: { size: 17, icon: 'Sv' },
    database: { size: 18, icon: 'DB' },
    datacenter: { size: 22, icon: 'DC' },
    gateway: { size: 18, icon: 'G' },
    accesspoint: { size: 16, icon: 'AP' }
};

export default function PredictionDashboard() {
    const [currentTopology, setCurrentTopology] = useState('enterprise');
    const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, type: string, node?: string | null }>({ visible: false, x: 0, y: 0, type: 'topology', node: null });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeTopo = topologies[currentTopology];

    // Handlers
    const handleContextMenu = (e: React.MouseEvent, type: string, node?: string | null) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            type,
            node
        });
    };

    const closeContextMenu = () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const selectTimeline = (period: string) => {
        toast.info(`Training initiated for ${contextMenu.node || 'entire topology'}. Timeline: ${period}`);
        closeContextMenu();
    };

    const selectML = (algo: string) => {
        toast.success(`Training ${contextMenu.node || 'network'} using ${algo} in background...`);
        closeContextMenu();
    };

    const viewDetails = () => {
        toast(`Viewing details for ${contextMenu.node || 'network'}...`);
        closeContextMenu();
    };

    return (
        <MainLayout>
            <style dangerouslySetInnerHTML={{
                __html: `
                .pulse-circle { animation: pulse 2s ease-in-out infinite; }
                .link-dotted { stroke-dasharray: 5, 5; animation: dash-link 20s linear infinite; }
                .node-blinking circle { animation: node-blink 1.5s ease-in-out infinite; }
                @keyframes dash-link { to { stroke-dashoffset: -1000; } }
                @keyframes node-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; filter: saturate(2) brightness(1.5); } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.9); } }
            `}} />

            <div className="p-6 space-y-6 max-w-[1920px] mx-auto animate-in fade-in duration-500 min-h-screen" onClick={closeContextMenu}>

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                NetOps Intelligence
                            </h1>
                            <Badge variant="outline" className="ml-2 text-[10px] h-5 px-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-circle"></div>
                                SYSTEM ACTIVE
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Network topology graph and active intelligence predictions
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <Select value={currentTopology} onValueChange={setCurrentTopology}>
                            <SelectTrigger className="w-[280px] bg-card/40 border-border/50 font-mono text-sm">
                                <SelectValue placeholder="Select topology" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="enterprise">Enterprise Data Center (12 nodes)</SelectItem>
                                <SelectItem value="cloud">Multi-Cloud Infrastructure (15 nodes)</SelectItem>
                                <SelectItem value="edge">Edge Computing Network (10 nodes)</SelectItem>
                                <SelectItem value="hybrid">Hybrid WAN Architecture (14 nodes)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">

                    {/* TOPOLOGY CANVAS */}
                    <Card className="border-border/50 bg-card/40 relative overflow-hidden group rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <MonitorPlay className="h-5 w-5 text-primary" /> Network Topology
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/30 font-mono gap-1">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> ML TRAINING
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 relative" onContextMenu={(e) => handleContextMenu(e, 'topology')}>
                            <div className="h-[500px] w-full bg-background/50 relative overflow-auto custom-scrollbar">
                                <svg className="min-w-[900px] min-h-[650px] w-full h-full" id="topologySvg">
                                    {/* Links */}
                                    {activeTopo.links.map((link: any, i: number) => {
                                        const src = activeTopo.nodes.find((n: any) => n.id === link.source);
                                        const tgt = activeTopo.nodes.find((n: any) => n.id === link.target);
                                        return (
                                            <line
                                                key={`link-${i}`} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                                                stroke={STATUS_COLORS[link.status]}
                                                className={`stroke-2 transition-all duration-300 ${link.predicted ? 'link-dotted' : ''}`}
                                            >
                                                <title>{`${link.source} → ${link.target} (${link.status.toUpperCase()})${link.predicted && link.reason ? `\n\nAI Prediction Context:\n${link.reason}` : ''}`}</title>
                                            </line>
                                        );
                                    })}
                                    {/* Nodes */}
                                    {activeTopo.nodes.map((node: any, i: number) => (
                                        <g
                                            key={`node-${i}`}
                                            className={`cursor-pointer ${node.predicted ? 'node-blinking' : ''}`}
                                            transform={`translate(${node.x}, ${node.y})`}
                                            onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, 'node', node.id); }}
                                            onClick={() => toast(`Node: ${node.id} | Status: ${node.status}`)}
                                        >
                                            <circle r={NODE_TYPES[node.type].size} fill={STATUS_COLORS[node.status]} stroke="hsl(var(--background))" strokeWidth="2" className="transition-all hover:brightness-125" />
                                            <title>{`${node.id} (${node.status.toUpperCase()})${node.predicted && node.reason ? `\n\nAI Prediction Context:\n${node.reason}` : ''}`}</title>
                                            <text y={NODE_TYPES[node.type].size + 16} textAnchor="middle" className="text-[11px] font-mono fill-foreground pointer-events-none drop-shadow-md">
                                                {node.id}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 bg-background/90 backdrop-blur rounded-lg p-3 border border-border/50">
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><div className="w-4 h-1 rounded-sm bg-emerald-500"></div> Normal</div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><div className="w-4 h-1 rounded-sm bg-amber-500"></div> Warning</div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><div className="w-4 h-1 rounded-sm bg-red-500"></div> Critical</div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><div className="w-4 h-0 border-t-[3px] border-dotted border-muted-foreground"></div> Predicted Link</div>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><div className="w-3 h-3 rounded-full border-2 border-muted-foreground animate-pulse flex-shrink-0"></div> Predicted Node</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SYSTEM SUMMARY OVERVIEW */}
                    <Card className="border-border/50 bg-card/40 flex flex-col rounded-xl h-full">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <ActivitySquare className="h-5 w-5 text-primary" /> System Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="grid grid-cols-2 gap-4 mb-auto">
                                <div className="py-5 px-4 rounded-xl bg-secondary/30 border border-border/50 text-center flex flex-col items-center justify-center transition-colors hover:bg-secondary/50">
                                    <div className="text-4xl font-black text-emerald-500 mb-2 drop-shadow-sm">24</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Nodes</div>
                                </div>
                                <div className="py-5 px-4 rounded-xl bg-secondary/30 border border-border/50 text-center flex flex-col items-center justify-center transition-colors hover:bg-secondary/50">
                                    <div className="text-4xl font-black text-amber-500 mb-2 drop-shadow-sm">8</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Predictions</div>
                                </div>
                                <div className="py-5 px-4 rounded-xl bg-secondary/30 border border-border/50 text-center flex flex-col items-center justify-center transition-colors hover:bg-secondary/50">
                                    <div className="text-4xl font-black text-red-500 mb-2 drop-shadow-sm">3</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Anomalies</div>
                                </div>
                                <div className="py-5 px-4 rounded-xl bg-secondary/30 border border-border/50 text-center flex flex-col items-center justify-center transition-colors hover:bg-secondary/50">
                                    <div className="text-4xl font-black text-blue-500 mb-2 drop-shadow-sm">12</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Patterns</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/50">
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">ML Model Status</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-mono flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-emerald-400" /> Random Forest</span>
                                        <span className="text-emerald-500 font-semibold">91.8% ACC</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-mono flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-emerald-400" /> Isolation Forest</span>
                                        <span className="text-emerald-500 font-semibold">89.5% ACC</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-mono flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-emerald-400" /> KMeans Clustering</span>
                                        <span className="text-emerald-500 font-semibold">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-mono flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-emerald-400" /> Granger Causality</span>
                                        <span className="text-emerald-500 font-semibold">Active</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PREDICTIONS */}
                    <Card className="border-border/50 bg-card/40 rounded-xl flex flex-col h-full">
                        <CardHeader className="flex justify-between flex-row items-center">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <TrendingUp className="h-5 w-5 text-primary" /> Predictions (Time Series)
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-7 w-7 mt-0" onClick={() => setSidebarOpen(true)}><ArrowRight className="w-4 h-4 text-muted-foreground hover:text-foreground" /></Button>
                        </CardHeader>
                        <CardContent className="pt-0 overflow-y-auto max-h-[460px] custom-scrollbar flex flex-col gap-3">
                            <div className="bg-muted/30 border border-border border-l-4 border-l-red-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">CORE-RTR-01 → EDGE-SW-05</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">+18m</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Link capacity approaching threshold. Predicted: <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">95% util</Badge> based on traffic growth pattern.
                                </p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-amber-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">EDGE-SW-05</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">+24m</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">High packet loss probability. Correlation detected with buffer exhaustion pattern.</p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-blue-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">FW-01 → CORE-RTR-02</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">+35m</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">Connection flap predicted. Historical pattern matches <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">BGP instability</Badge> signature.</p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-amber-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">LB-PRIMARY</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">+42m</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">CPU threshold breach forecast. Current trend: <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">68% → 92%</Badge> within hour.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ANOMALIES */}
                    <Card className="border-border/50 bg-card/40 rounded-xl flex flex-col h-full">
                        <CardHeader className="flex justify-between flex-row items-center">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <AlertTriangle className="h-5 w-5 text-primary" /> Anomalies Detected
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-7 w-7 mt-0" onClick={() => setSidebarOpen(true)}><ArrowRight className="w-4 h-4 text-muted-foreground hover:text-foreground" /></Button>
                        </CardHeader>
                        <CardContent className="pt-0 overflow-y-auto max-h-[460px] custom-scrollbar flex flex-col gap-3">
                            <div className="bg-muted/30 border border-border border-l-4 border-l-red-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">CORE-RTR-01</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">NOW</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">Unusual traffic pattern detected. Volume spike: <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">2.4GB/s → 8.7GB/s</Badge> in 90 seconds.</p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-red-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">EDGE-SW-05 → DIST-SW-03</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">2m ago</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">Latency anomaly. Mean latency deviation: <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">+450ms</Badge> (6.2σ).</p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-amber-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">FW-01</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">5m ago</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">Session table growth rate anomaly. Isolation Forest detected outlier behavior.</p>
                            </div>
                            <div className="bg-muted/30 border border-border border-l-4 border-l-amber-500 rounded-lg p-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono font-bold text-[13px]">LB-PRIMARY</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">8m ago</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">Request distribution imbalance. Backend pool utilization: <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-none px-1 py-0">45%, 78%, 12%</Badge></p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CORRELATION PATTERNS */}
                    <Card className="border-border/50 bg-card/40 rounded-xl flex flex-col h-full">
                        <CardHeader className="flex justify-between flex-row items-center">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <Zap className="h-5 w-5 text-primary" /> Correlation Patterns
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-7 w-7 mt-0" onClick={() => setSidebarOpen(true)}><ArrowRight className="w-4 h-4 text-muted-foreground hover:text-foreground" /></Button>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-4 overflow-y-auto max-h-[460px] custom-scrollbar flex flex-col gap-5">

                            {/* Pattern 1 */}
                            <details className="group" open>
                                <summary className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none hover:text-foreground transition-colors p-2 -mx-2 rounded-lg hover:bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Link Flap Pattern
                                    </div>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:-rotate-180" />
                                </summary>
                                <div className="flex flex-col gap-3 border-l-2 border-border/40 pl-4 ml-1.5 relative mt-2 mb-2">
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">1. link_util <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                50% → 90% <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+4m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">2. buffer_util <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                20% → 85% <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+2m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold flex gap-1">3. crc_errors <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                0 → 70 <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+5m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold flex gap-1">4. packet_loss <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                0% → 5% <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+1m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-background"></div>
                                        <div className="bg-border/30 border border-red-500/20 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-border/50 cursor-default">
                                            <div className="font-mono text-xs font-bold text-red-400 flex gap-1">5. interface_flap <span className="text-red-500">!</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                UP → DOWN <Badge variant="outline" className="text-[8px] px-1 py-0 bg-red-500/10 text-red-500 border-none animate-pulse">EVENT</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <div className="h-px bg-border/40 w-full"></div>

                            {/* Pattern 2 */}
                            <details className="group">
                                <summary className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none hover:text-foreground transition-colors p-2 -mx-2 rounded-lg hover:bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Control Plane Pattern
                                    </div>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:-rotate-180" />
                                </summary>
                                <div className="flex flex-col gap-3 border-l-2 border-border/40 pl-4 ml-1.5 relative mt-2 mb-2">
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">1. cpu_util <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                60% → 99% <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+8m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">2. bgp_keepalive_miss <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                0 → 2 <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+1m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-background"></div>
                                        <div className="bg-border/30 border border-red-500/20 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-border/50 cursor-default">
                                            <div className="font-mono text-xs font-bold text-red-400">3. bgp_session_drop <span className="text-red-500">!</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                ESTAB → IDLE <Badge variant="outline" className="text-[8px] px-1 py-0 bg-red-500/10 text-red-500 border-none animate-pulse">EVENT</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <div className="h-px bg-border/40 w-full"></div>

                            {/* Pattern 3 */}
                            <details className="group">
                                <summary className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none hover:text-foreground transition-colors p-2 -mx-2 rounded-lg hover:bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Optical Drop Pattern
                                    </div>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:-rotate-180" />
                                </summary>
                                <div className="flex flex-col gap-3 border-l-2 border-border/40 pl-4 ml-1.5 relative mt-2 mb-2">
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">1. rx_power_dbm <span className="text-blue-500">↓</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                -5.2 → -14.8 <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+12m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-background"></div>
                                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-muted/50 cursor-default">
                                            <div className="font-mono text-xs font-bold">2. crc_errors <span className="text-amber-500">↑</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                0 → 1450 <Badge variant="outline" className="text-[8px] px-1 py-0 bg-amber-500/10 text-amber-500 border-none">+25m</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-background"></div>
                                        <div className="bg-border/30 border border-red-500/20 rounded-lg p-2.5 flex justify-between items-center transition-colors hover:bg-border/50 cursor-default">
                                            <div className="font-mono text-xs font-bold text-red-400">3. link_flap <span className="text-red-500">!</span></div>
                                            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                                                UP → DOWN <Badge variant="outline" className="text-[8px] px-1 py-0 bg-red-500/10 text-red-500 border-none animate-pulse">EVENT</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CUSTOM CONTEXT MENU */}
            {contextMenu.visible && (
                <div
                    className="fixed z-50 bg-card border border-border shadow-md rounded-lg p-1.5 min-w-[200px] animate-in slide-in-from-top-2"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-semibold flex items-center gap-2 mb-1">
                        <ActivitySquare className="h-3 w-3" /> Actions for {contextMenu.node || 'Topology'}
                    </div>
                    <div className="h-px bg-border/60 my-1" />
                    <div className="custom-menu-group group relative">
                        <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors flex justify-between items-center group">
                            Time Window <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <div className="absolute left-[95%] top-0 bg-card border border-border shadow-md rounded-lg p-1 min-w-[150px] hidden group-hover:block ml-2 animate-in slide-in-from-left-2">
                            <button onClick={() => selectTimeline('1week')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">1 Week Back</button>
                            <button onClick={() => selectTimeline('15days')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">15 Days</button>
                            <button onClick={() => selectTimeline('1month')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">1 Month</button>
                        </div>
                    </div>
                    <div className="custom-menu-group group relative">
                        <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors flex justify-between items-center group">
                            Train Algorithm <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <div className="absolute left-[95%] top-0 bg-card border border-border shadow-md rounded-lg p-1 min-w-[180px] hidden group-hover:block ml-2 animate-in slide-in-from-left-2">
                            <button onClick={() => selectML('Random Forest')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">Random Forest Predictor</button>
                            <button onClick={() => selectML('Isolation Forest')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">Isolation Forest</button>
                            <button onClick={() => selectML('KMeans')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">KMeans Clustering</button>
                            <button onClick={() => selectML('Granger Causality')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">Granger Causality</button>
                            <button onClick={() => selectML('Sequence Mining')} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md">Event Sequence Mining</button>
                        </div>
                    </div>
                    <div className="h-px bg-border/60 my-1" />
                    <button onClick={viewDetails} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md transition-colors flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" /> View Raw Metrics
                    </button>
                </div>
            )}

            {/* IMPACT SIDEBAR */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-[450px] bg-card border-l border-border shadow-2xl z-[101] animate-in slide-in-from-right flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500" /> Impact Analysis</h2>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Impacted Services</h3>
                                <div className="space-y-3">
                                    <div className="bg-muted/20 border-l-4 border-l-blue-500 rounded-md p-3">
                                        <div className="font-bold text-sm mb-1">E-Commerce Platform</div>
                                        <div className="text-xs text-muted-foreground font-mono">Latency +340ms | Users: 12,450</div>
                                    </div>
                                    <div className="bg-muted/20 border-l-4 border-l-blue-500 rounded-md p-3">
                                        <div className="font-bold text-sm mb-1">API Gateway</div>
                                        <div className="text-xs text-muted-foreground font-mono">Throughput -35% | Requests: 4.2K/s</div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Blast Radius</h3>
                                <div className="space-y-3">
                                    <div className="bg-muted/20 border-l-4 border-l-amber-500 rounded-md p-3 justify-between flex items-center">
                                        <div>
                                            <div className="font-bold text-sm mb-1">Enterprise Tier</div>
                                            <div className="text-xs text-muted-foreground">SLA Breach Warning</div>
                                        </div>
                                        <Badge variant="outline">47 Accounts</Badge>
                                    </div>
                                    <div className="bg-muted/20 border-l-4 border-l-red-500 rounded-md p-3 justify-between flex items-center">
                                        <div>
                                            <div className="font-bold text-sm mb-1">Premium Cluster</div>
                                            <div className="text-xs text-muted-foreground">Performance Degradation</div>
                                        </div>
                                        <Badge variant="outline">2,340 Users</Badge>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Propagation Matrix</h3>
                                <div className="flex flex-col gap-4 border-l border-border/50 pl-4 ml-2 relative">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <div className="text-sm font-bold">CORE-RTR-01</div>
                                        <div className="text-xs text-muted-foreground">Initial Source (T+0)</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                        <div className="text-sm font-bold">EDGE-SW-05</div>
                                        <div className="text-xs text-muted-foreground">Buffer Overflow (T+4m)</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                        <div className="text-sm font-bold">DIST-SW-03</div>
                                        <div className="text-xs text-muted-foreground">Latency Spike (T+6m)</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        <div className="text-sm font-bold">ACCESS Nodes</div>
                                        <div className="text-xs text-muted-foreground">Downstream Impact (T+8m)</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
}
