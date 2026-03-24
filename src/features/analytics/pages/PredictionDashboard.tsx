import React, { useState, MouseEvent } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { 
    Activity, 
    Maximize, 
    AlertCircle, 
    TrendingUp, 
    AlertTriangle, 
    MonitorPlay, 
    Zap, 
    ArrowRight, 
    X, 
    Info, 
    BrainCircuit, 
    ActivitySquare, 
    ChevronDown,
    Cpu,
    Network,
    Gauge,
    Timer,
    History,
    Router,
    Shield,
    Server,
    Database,
    Cloud,
    Wifi,
    CheckCircle2,
    Clock,
    Search,
    ListTree,
    Workflow,
    Terminal,
    Settings,
    ShieldCheck,
    ChevronRight,
    Play,
    TimerReset,
    ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

// --- DATA DEFINITIONS ---
const topologies: Record<string, any> = {
    enterprise: {
        nodes: [
            { id: 'CORE-RTR-01', x: 400, y: 150, type: 'router', status: 'critical', predicted: false, anomalies: [{ metric: 'CPU_LOAD', value: '98%', spike: '+42%', legend: 'Sustained peak detected' }, { metric: 'MEMORY_USAGE', value: '92%', spike: '+15%', legend: 'Buffer pressure rising' }] },
            { id: 'CORE-RTR-02', x: 500, y: 150, type: 'router', status: 'normal', predicted: false },
            { id: 'FW-01', x: 300, y: 250, type: 'firewall', status: 'warning', predicted: false },
            { id: 'FW-02', x: 600, y: 250, type: 'firewall', status: 'normal', predicted: false },
            { id: 'LB-PRIMARY', x: 450, y: 320, type: 'loadbalancer', status: 'warning', predicted: true, reason: 'Traffic spike indicative of imminent congestion threshold breach', anomalies: [{ metric: 'LINK_UTIL', value: '88%', spike: '+28%', legend: 'Traffic surge on primary' }] },
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
};

const STATUS_COLORS: Record<string, string> = {
    normal: '#10b981', 
    warning: '#f59e0b', 
    critical: '#ef4444', 
    info: '#3b82f6'
};

const NODE_TYPES: Record<string, { size: number, icon: any }> = {
    router: { size: 24, icon: Router },
    switch: { size: 22, icon: Network },
    firewall: { size: 24, icon: Shield },
    loadbalancer: { size: 23, icon: Cpu },
    server: { size: 21, icon: Server },
    database: { size: 22, icon: Database },
    datacenter: { size: 26, icon: Cloud },
    gateway: { size: 22, icon: Zap },
    accesspoint: { size: 20, icon: Wifi }
};

// --- INVESTIGATION TIMELINE DATA ---
const INVESTIGATION_TIMELINE = [
    { 
        id: 1, 
        status: 'MISSED', 
        type: 'MISSED · METRIC', 
        label: 'LINK_UTIL_BREACH', 
        time: '12:53:47 PM', 
        desc: 'Expected window passed — event not observed', 
        detail: 'Link saturation drives buffer pressure', 
        penalty: '-8% confidence penalty', 
        color: '#F97316',
        meta_status: 'GAP DETECTED'
    },
    { 
        id: 2, 
        status: 'ARRIVED', 
        type: 'TRAP · SYSLOG', 
        label: 'HIGH_CPU_TRAP', 
        time: '12:53:45 PM', 
        detail: 'arrived at 12:53:45 PM', 
        color: '#10B981', 
        confirmed: true,
        meta_status: 'CONFIRMED'
    },
    { 
        id: 3, 
        status: 'ARRIVED', 
        type: 'METRIC · POLL', 
        label: 'BUFFER_UTIL_BREACH', 
        time: '12:53:48 PM', 
        detail: '72% arrived at 12:53:48 PM', 
        color: '#10B981', 
        confirmed: true,
        meta_status: 'CONFIRMED'
    },
    { 
        id: 4, 
        status: 'ARRIVED', 
        type: 'METRIC · POLL', 
        label: 'CRC_ERRORS_BREACH', 
        time: '12:53:56 PM', 
        detail: 'arrived at 12:53:56 PM', 
        color: '#10B981', 
        confirmed: true,
        meta_status: 'CONFIRMED'
    },
    { 
        id: 5, 
        status: 'ARRIVED', 
        type: 'TRAP · SYSLOG', 
        label: 'PACKET_DROP_EVENT', 
        time: '12:53:59 PM', 
        detail: 'arrived at 12:53:59 PM', 
        color: '#10B981', 
        confirmed: true,
        meta_status: 'CONFIRMED'
    },
    { 
        id: 6, 
        status: 'PREDICTED', 
        type: 'PREDICTED · TRAP', 
        label: 'INTERFACE_FLAP', 
        time: '01:02:40 PM', 
        desc: 'All precursors active — flap is imminent', 
        horizon: '1s', 
        sub: '~60s / 1 poll', 
        color: '#F97316', 
        next: true,
        meta_status: 'NEXT EVENT'
    },
];

const REMEDIATION_STEPS = [
    { id: 'rem-1', title: 'Isolate Neighbor AS-65102', description: 'Shut down peering on interface Gi0/0/1 to stop routing loop propagation.', complexity: 'High', automated: false, icon: Router },
    { id: 'rem-2', title: 'Rollback BGP Policy', description: 'Revert to version 2 (stable) of EXT-ROUTE-MAP policies.', complexity: 'Medium', automated: true, icon: History },
    { id: 'rem-3', title: 'Execute Soft-Reset', description: 'Initiate soft-reset of IBGP peering sessions to refresh adjacency table.', complexity: 'Low', automated: true, icon: Zap },
    { id: 'rem-4', title: 'Shift Traffic via redundant paths', description: 'Adjust OSPF weights to push traffic through backup DIST-SW-04 link.', complexity: 'Medium', automated: false, icon: Network }
];

export default function PredictionDashboard() {
    const [currentTopology, setCurrentTopology] = useState('enterprise');
    const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, type: string, node?: string | null }>({ visible: false, x: 0, y: 0, type: 'topology', node: null });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarView, setSidebarView] = useState<'timeline' | 'remediation'>('timeline');
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const activeTopo = topologies[currentTopology] || topologies.enterprise;

    const handleNodeClick = (node: any) => {
        if (node.predicted || node.anomalies) {
            setSelectedNode(node);
            setSidebarView('timeline');
            setSidebarOpen(true);
        } else {
            toast(`Node: ${node.id} | Status: ${node.status}`);
        }
    };

    return (
        <MainLayout>
            <style dangerouslySetInnerHTML={{
                __html: `
                .pulse-ring { 
                    animation: pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite; 
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    80%, 100% { transform: scale(2.5); opacity: 0; }
                }
                .anomaly-glow { 
                    filter: drop-shadow(0 0 8px currentcolor);
                    animation: glow-breathe 2.5s ease-in-out infinite; 
                }
                @keyframes glow-breathe {
                    0%, 100% { filter: drop-shadow(0 0 5px currentcolor); opacity: 0.9; }
                    50% { filter: drop-shadow(0 0 20px currentcolor); opacity: 1; }
                }
                .link-pulse {
                    stroke-dasharray: 8, 4;
                    animation: dash-flow 30s linear infinite;
                }
                @keyframes dash-flow {
                    to { stroke-dashoffset: -1000; }
                }
                .critical-blink {
                    animation: flash-red 1s steps(2, start) infinite;
                }
                @keyframes flash-red {
                    to { visibility: hidden; }
                }
            `}} />

            <div className="p-6 space-y-6 max-w-[1920px] mx-auto animate-in fade-in duration-500 min-h-screen">

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-foreground italic uppercase">
                                NetOps Intelligence
                            </h1>
                            <Badge variant="outline" className="ml-2 text-[10px] h-5 px-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex gap-1.5 items-center font-black italic">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-circle"></div>
                                AI ENGINE ACTIVE
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
                            Real-time structural topology and predictive analytics pipeline
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <Select value={currentTopology} onValueChange={setCurrentTopology}>
                            <SelectTrigger className="w-[300px] bg-card/60 border-border/40 font-black text-[11px] uppercase tracking-wider h-10 italic">
                                <SelectValue placeholder="Select topology" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0F172A] border-white/10">
                                <SelectItem value="enterprise">Enterprise Data Center [E-12]</SelectItem>
                                <SelectItem value="cloud">Cloud Infrastructure [C-15]</SelectItem>
                                <SelectItem value="edge">Edge Compute Network [X-10]</SelectItem>
                                <SelectItem value="hybrid">Hybrid WAN Mesh [H-14]</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* TOPOLOGY CANVAS */}
                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-border/50 bg-[#111827]/40 relative overflow-hidden group rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-white/[0.02] py-3">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-foreground">
                                <MonitorPlay className="h-4 w-4 text-blue-500" /> structural Topology graph
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 relative">
                            <div className="h-[520px] w-full bg-black/20 relative overflow-auto custom-scrollbar">
                                <svg className="min-w-[900px] min-h-[600px] w-full h-full">
                                    {/* Links */}
                                    {activeTopo.links.map((link: any, i: number) => {
                                        const src = activeTopo.nodes.find((n: any) => n.id === link.source);
                                        const tgt = activeTopo.nodes.find((n: any) => n.id === link.target);
                                        return (
                                            <line
                                                key={`link-${i}`} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                                                stroke={STATUS_COLORS[link.status]}
                                                className={cn(
                                                    "stroke-2 transition-all duration-300",
                                                    link.predicted && "link-pulse",
                                                    link.status === 'critical' && "stroke-[3px]"
                                                )}
                                                strokeOpacity={link.status === 'normal' ? 0.3 : 0.8}
                                            />
                                        );
                                    })}
                                    {/* Nodes */}
                                    {activeTopo.nodes.map((node: any, i: number) => {
                                        const IconComp = NODE_TYPES[node.type].icon;
                                        const size = NODE_TYPES[node.type].size;
                                        const isHighPriority = node.predicted || node.status === 'critical';
                                        
                                        return (
                                            <g
                                                key={`node-${i}`}
                                                className="cursor-pointer group"
                                                transform={`translate(${node.x}, ${node.y})`}
                                                onClick={() => handleNodeClick(node)}
                                            >
                                                {/* Pulse Ring for predicted nodes */}
                                                {node.predicted && (
                                                    <circle 
                                                        r={size * 1.5} 
                                                        fill="none" 
                                                        stroke={STATUS_COLORS[node.status]} 
                                                        strokeWidth="2" 
                                                        className="pulse-ring" 
                                                    />
                                                )}
                                                
                                                {/* Node main body */}
                                                <circle 
                                                    r={size} 
                                                    fill={STATUS_COLORS[node.status]} 
                                                    stroke="#0B0F19" 
                                                    strokeWidth="2" 
                                                    className={cn(
                                                        "transition-all hover:scale-110",
                                                        isHighPriority && "anomaly-glow"
                                                    )}
                                                    style={{ color: STATUS_COLORS[node.status] }}
                                                />

                                                {/* Icon */}
                                                <foreignObject x={-size/2} y={-size/2} width={size} height={size} style={{ pointerEvents: 'none' }}>
                                                    <div className={cn(
                                                        "flex items-center justify-center w-full h-full",
                                                        node.status === 'critical' && "critical-blink"
                                                    )}>
                                                        <IconComp className="text-white w-[70%] h-[70%]" strokeWidth={2.5} />
                                                    </div>
                                                </foreignObject>
                                                
                                                <text 
                                                    y={size + 18} 
                                                    textAnchor="middle" 
                                                    className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest pointer-events-none transition-colors",
                                                        isHighPriority ? "fill-white" : "fill-slate-500"
                                                    )}
                                                >
                                                    {node.id}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* FLOATING LEGEND */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-4 p-4 rounded-xl bg-[#0F172A]/90 border border-white/10 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-2 duration-700 pointer-events-none overflow-hidden max-w-[280px]">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                                    
                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Diagnostic Legend</h4>
                                        
                                        {/* Row 1: Status */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 pb-3 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Normal</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Warning</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Critical</span>
                                            </div>
                                        </div>

                                        {/* Row 2: Prediction Visuals */}
                                        <div className="space-y-2.5 pb-3 border-b border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3.5 h-3.5 rounded-full border border-orange-500 relative flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping opacity-75" />
                                                </div>
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Predicted Anomaly <span className="text-orange-500 ml-1">· ML-Target</span></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-0.5">
                                                    <div className="w-1 h-0.5 bg-blue-500" />
                                                    <div className="w-1 h-0.5 bg-blue-500/20" />
                                                    <div className="w-1 h-0.5 bg-blue-500" />
                                                </div>
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Predictive Link <span className="text-blue-500 ml-1">· Path Risk</span></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Real-time Anomaly <span className="text-red-500 ml-1">· Active</span></span>
                                            </div>
                                        </div>

                                        {/* Row 3: Node Icons */}
                                        <div className="grid grid-cols-2 gap-2 pt-1 opacity-70">
                                            <div className="flex items-center gap-2">
                                                <Router className="w-3 h-3 text-slate-400" />
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Router</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Network className="w-3 h-3 text-slate-400" />
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Switch</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-3 h-3 text-slate-400" />
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Firewall</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Cpu className="w-3 h-3 text-slate-400" />
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Balancer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* PREDICTION INVESTIGATION SIDEBAR */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-[800px] bg-[#0F172A] border-l border-white/5 shadow-2xl z-[101] animate-in slide-in-from-right flex flex-col overflow-hidden font-['Sora']">
                        
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#111827]/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2.5 rounded-xl border", sidebarView === 'timeline' ? "bg-amber-500/10 border-amber-500/20" : "bg-blue-500/10 border-blue-500/20")}>
                                    {sidebarView === 'timeline' ? <Activity className="w-5 h-5 text-amber-500" /> : <ShieldAlert className="w-5 h-5 text-blue-500" />}
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none mb-1">
                                        {selectedNode?.id} {sidebarView === 'timeline' ? 'Prediction flow' : 'Remediation Engine'}
                                    </h2>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                                        {sidebarView === 'timeline' ? 'Structural Trace Analysis' : 'Automated Recovery Protocol'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {sidebarView === 'remediation' && (
                                    <Button variant="ghost" size="sm" onClick={() => setSidebarView('timeline')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5">
                                        <History className="w-3.5 h-3.5 mr-2" /> View Trace
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5 h-10 w-10 rounded-xl">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto bg-[#0B0F19] custom-scrollbar">
                            {sidebarView === 'timeline' ? (
                                <div className="p-0">
                                    {/* Anomaly Metrics Highlight (Vivid) */}
                                    {selectedNode?.anomalies && (
                                        <div className="px-8 py-8 bg-gradient-to-b from-red-500/10 to-transparent border-b border-white/5">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Badge className="bg-red-500 text-white border-none text-[10px] font-black italic tracking-widest px-3 py-1">REAL-TIME ANOMALIES DETECTED</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedNode.anomalies.map((anom: any, idx: number) => (
                                                    <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                                            <ActivitySquare className="w-8 h-8 text-red-500" />
                                                        </div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{anom.metric}</span>
                                                            <span className="text-sm font-black text-red-500 animate-pulse">{anom.spike} spike</span>
                                                        </div>
                                                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{anom.value}</div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase italic">{anom.legend}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="px-8 pt-8 pb-4">
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 italic">Sequential Trace Analysis</h4>
                                        </div>
                                        {/* Left Connecting Line */}
                                        <div className="absolute left-[40px] top-[100px] bottom-0 w-[2px] bg-gradient-to-b from-orange-500/40 via-emerald-500/40 to-orange-500/40" />
                                        
                                        <div className="flex flex-col">
                                        {INVESTIGATION_TIMELINE.map((event, idx) => (
                                            <div key={event.id} className="relative flex min-h-[140px] border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group">
                                                
                                                {/* Left Column (Icons) */}
                                                <div className="w-[80px] flex-shrink-0 flex items-center justify-center relative">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full border-2 bg-[#0B0F19] z-10 flex items-center justify-center transition-all group-hover:scale-110",
                                                        event.status === 'MISSED' ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : 
                                                        event.status === 'ARRIVED' ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : 
                                                        "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                                    )}>
                                                        {event.status === 'MISSED' && <span className="text-lg font-black text-orange-500/70">?</span>}
                                                        {event.status === 'ARRIVED' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                        {event.status === 'PREDICTED' && <span className="text-lg font-black text-orange-500">6</span>}
                                                    </div>
                                                </div>

                                                {/* Center Column (Content) */}
                                                <div className="flex-1 py-6 px-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge variant="outline" className={cn(
                                                           "bg-white/[0.03] border-white/5 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest",
                                                           event.status === 'MISSED' ? "text-orange-400" : "text-slate-400"
                                                        )}>
                                                            {event.type}
                                                        </Badge>
                                                    </div>
                                                    <h3 className={cn(
                                                        "text-lg font-black tracking-tight mb-1",
                                                        event.status === 'MISSED' || event.status === 'PREDICTED' ? "text-orange-500/90" : "text-emerald-500/90"
                                                    )}>
                                                        {event.label}
                                                    </h3>
                                                    <p className="text-[12px] text-slate-400 font-bold leading-tight mb-1">{event.desc || (event.status === 'ARRIVED' ? 'Confirmed by neighbor router traps' : '')}</p>
                                                    
                                                    {event.detail && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {event.status === 'ARRIVED' && <div className="w-3 h-[2px] bg-emerald-500/30" />}
                                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{event.detail}</p>
                                                        </div>
                                                    )}

                                                    {event.penalty && (
                                                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-500 uppercase tracking-widest italic">
                                                            {event.penalty}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Column (Status & Time) */}
                                                <div className="w-[200px] flex-shrink-0 py-6 px-8 flex flex-col items-end justify-start">
                                                    <h4 className={cn(
                                                        "text-xl font-black italic tracking-tighter leading-none mb-1",
                                                        event.status === 'MISSED' ? "text-orange-500" : event.status === 'ARRIVED' ? "text-emerald-500" : "text-orange-500 text-3xl"
                                                    )}>
                                                        {event.status === 'PREDICTED' ? event.horizon : event.status}
                                                    </h4>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] text-slate-500 font-mono font-bold">{event.status === 'MISSED' ? `window: ${event.time}` : `@ ${event.time}`}</span>
                                                        <Badge className={cn(
                                                            "mt-2 text-[10px] font-black border-none px-2 py-0.5",
                                                            event.status === 'MISSED' ? "bg-orange-500/20 text-orange-500" : 
                                                            event.status === 'ARRIVED' ? "bg-emerald-500/20 text-emerald-500" : "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                                                        )}>
                                                            {event.meta_status}
                                                        </Badge>
                                                        {event.status === 'PREDICTED' && (
                                                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2">{event.sub}</span>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 space-y-8">
                                    {/* Predicted RCA Summary */}
                                    <div className="relative p-8 rounded-2xl bg-[#111827]/40 border border-white/5 overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4">
                                            <ShieldCheck className="w-12 h-12 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px] font-black tracking-[0.2em] px-3 py-1 uppercase">Predicted Root Cause</Badge>
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic tracking-tight mb-6">BGP Neighbor Adjacency Instability (Loop)</h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Level</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-3xl font-black text-emerald-500 italic">94.2%</div>
                                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-[94.2%]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Risk</span>
                                                <div className="text-3xl font-black text-amber-500 italic uppercase">Critical</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remediation Steps */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2 mb-6">
                                            <div className="h-px flex-1 bg-white/5" />
                                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Automated Remediation path</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        
                                        {REMEDIATION_STEPS.map((step, idx) => (
                                            <div key={step.id} className="relative flex gap-6 p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                                                        <step.icon className="w-6 h-6 text-blue-400/80" />
                                                    </div>
                                                    {idx < REMEDIATION_STEPS.length - 1 && <div className="w-px flex-1 bg-white/10 mt-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="text-[15px] font-black text-white italic tracking-wide">{step.title}</h5>
                                                        {step.automated && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase italic">
                                                                < Zap className="w-2.5 h-2.5 fill-current" /> Auto-Sync
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-4">{step.description}</p>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                step.complexity === 'High' ? 'bg-red-500' : step.complexity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                                            )} />
                                                            <span className="text-[11px] font-black text-slate-500 uppercase">{step.complexity} COMPLEXITY</span>
                                                        </div>
                                                        <div className="text-[11px] font-black text-slate-600 uppercase">Est. Time: ~45s</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Footer */}
                        <div className="p-8 border-t border-white/5 bg-[#111827]/80 backdrop-blur-md">
                            {sidebarView === 'timeline' ? (
                                <Button 
                                    onClick={() => setSidebarView('remediation')}
                                    className="w-full bg-[#F97316] hover:bg-[#EA580C] text-black font-black text-[13px] uppercase tracking-[0.2em] italic py-8 transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] group"
                                >
                                    <ShieldAlert className="w-5 h-5 mr-3" /> remediate <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            ) : (
                                <div className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[13px] uppercase tracking-[0.2em] italic h-14 shadow-[0_0_30px_rgba(37,99,235,0.4)] group">
                                        Execute Recovery <Play className="w-4 h-4 ml-3 fill-current transition-transform group-hover:scale-110" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
}

// Helper for conditional class merging
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
