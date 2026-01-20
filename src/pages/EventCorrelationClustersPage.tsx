import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/mainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RefreshCw, ZoomIn, ZoomOut, Filter, Info, Layers, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getClusterData } from '@/data/clusterSpecificData'; // Use this for metadata if available
import { sampleNetworkEvents } from '@/data/eventsData';

/* 
  Since framer-motion is not installed, I will use inline styles and CSS transitions 
  or requestAnimationFrame for the visualizations. 
*/

interface Point {
    id: string;
    x: number;
    y: number;
    clusterId: number;
    color: string;
    metadata: any;
    status: 'spawn' | 'moving' | 'settled';
    targetX: number;
    targetY: number;
    isRoot?: boolean;
}

const CLUSTERS = [
    { id: 1, name: 'Database Latency', x: 30, y: 30, color: '#f59e0b', label: 'DB Cluster' }, // Amber
    { id: 2, name: 'Network Timeout', x: 70, y: 30, color: '#ef4444', label: 'Net Cluster' }, // Red
    { id: 3, name: 'Auth Failure', x: 50, y: 70, color: '#3b82f6', label: 'Auth Cluster' }, // Blue
];

export default function EventCorrelationClustersPage() {
    const { clusterId } = useParams();
    const [points, setPoints] = useState<Point[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [stats, setStats] = useState({ total: 0, clustered: 0, noise: 0 });

    // Seed initial points
    useEffect(() => {
        const initialPoints: Point[] = [];
        for (let i = 0; i < 20; i++) {
            initialPoints.push(createRandomPoint());
        }
        setPoints(initialPoints);
    }, []);

    // Live Event Creation Loop
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            if (points.length > 200) {
                // Keep array size manageable
                setPoints(prev => prev.slice(1));
            }
            const newPoint = createRandomPoint();
            setPoints(prev => [...prev, newPoint]);
            setStats(prev => ({ ...prev, total: prev.total + 1 }));
        }, 800);

        return () => clearInterval(interval);
    }, [isPlaying, points.length]);

    // Move points towards centroids
    useEffect(() => {
        if (!isPlaying) return;

        let animationFrameId: number;

        const animate = () => {
            setPoints(prevPoints => {
                return prevPoints.map(point => {
                    if (point.status === 'settled') return point;

                    // Calculate distance to target
                    const dx = point.targetX - point.x;
                    const dy = point.targetY - point.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 1) {
                        return { ...point, status: 'settled', x: point.targetX, y: point.targetY };
                    }

                    // Move 5% of the way
                    const speed = 0.05;
                    return {
                        ...point,
                        x: point.x + dx * speed,
                        y: point.y + dy * speed,
                        status: 'moving'
                    };
                });
            });

            // Check newly settled points to update stats
            // (Simplified by just deriving from points length for visual demo)

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying]);

    function createRandomPoint(): Point {
        const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
        // 5% chance to be a root event if not already present (simplified logic)
        const isRoot = Math.random() > 0.95 && !points.some(p => p.clusterId === cluster.id && p.isRoot);
        const isNoise = !isRoot && Math.random() > 0.9;

        let targetX = cluster.x;
        let targetY = cluster.y;
        let color = cluster.color;

        // Root events stay closer to center, children spread out
        const spread = isRoot ? 2 : 15;
        targetX += (Math.random() - 0.5) * spread;
        targetY += (Math.random() - 0.5) * spread;

        if (isNoise) {
            targetX = Math.random() * 100;
            targetY = Math.random() * 100;
            color = '#9ca3af'; // Gray
        }

        // Generate Correlation Logic Metadata
        const algos = ['DBSCAN', 'Temporal', 'Topological', 'Pattern', 'GNN-Link'];
        const reasons = [
            'Simultaneous occurrence within 50ms window',
            'Downstream dependency failure detected',
            'Shared resource contention (CPU/Mem)',
            'Identical error signature hash',
            'Service mesh propagation path confirmed'
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * 100, // Random start X
            y: Math.random() * 100, // Random start Y
            clusterId: cluster.id,
            color: color,
            status: 'spawn',
            targetX,
            targetY,
            isRoot: isRoot,
            metadata: {
                id: `EVT-${Math.floor(Math.random() * 10000)}`,
                type: cluster.name,
                severity: isRoot ? 'Critical' : (isNoise ? 'Low' : 'Major'),
                timestamp: new Date().toISOString(),
                algo: algos[Math.floor(Math.random() * algos.length)],
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                confidence: 85 + Math.floor(Math.random() * 14),
                rootId: `ROOT-${cluster.id}` // Simulated Root ID
            }
        };
    }

    return (
        <MainLayout>
            <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
                {/* Header */}
                <header className="h-16 px-6 border-b border-border bg-card/50 flex items-center justify-between backdrop-blur z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/events"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Live Logic Clustering
                            </h1>
                            <p className="text-xs text-muted-foreground font-mono">Real-time K-Means Visualization • Cluster {clusterId || 'Global'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-4 text-xs">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Info</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {isPlaying ? 'Pause' : 'Resume'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPoints([])}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden relative">

                    {/* Visualization Area */}
                    <div
                        ref={containerRef}
                        className="flex-1 relative bg-[#0f172a] m-4 rounded-xl border border-white/10 shadow-inner overflow-hidden"
                    >
                        {/* Network Grid and Background */}
                        <div className="absolute inset-0 z-0" style={{
                            backgroundImage: `
                                 linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                                 linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                             `,
                            backgroundSize: '40px 40px'
                        }}></div>

                        {/* Centroids, Cluster Shade Circles, and Root Events */}
                        {CLUSTERS.map(cluster => {
                            // Find the specific Root Event for this cluster if it exists
                            const rootPoint = points.find(p => p.clusterId === cluster.id && p.isRoot);

                            return (
                                <div
                                    key={cluster.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none transition-all duration-1000"
                                    style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                                >
                                    {/* Light Shade Circle for Cluster Area */}
                                    <div
                                        className="rounded-full blur-3xl opacity-20 animate-pulse-slow"
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            backgroundColor: cluster.color,
                                        }}
                                    />

                                    {/* Inner tighter circle */}
                                    <div
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 border border-white/20"
                                        style={{
                                            width: '400px',
                                            height: '400px',
                                            backgroundColor: cluster.color,
                                        }}
                                    />

                                    {/* Centroid Label (only if no root event is visualized yet, or keep as background) */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        {!rootPoint && <Layers className="h-12 w-12 text-white/20 mb-2" />}
                                        <div className="text-white/30 text-xs font-mono uppercase tracking-widest">{cluster.name}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Connecting Lines (Targeting Root Event if available, else Centroid) */}
                        <svg className="absolute inset-0 pointer-events-none z-0 opacity-20">
                            {points.map(point => {
                                const cluster = CLUSTERS.find(c => c.id === point.clusterId);
                                if (!cluster || point.status === 'spawn' || point.isRoot) return null;

                                // Link to the Root Event of this cluster if it exists
                                const rootPoint = points.find(p => p.clusterId === cluster.id && p.isRoot);
                                const targetX = rootPoint ? rootPoint.x : cluster.x;
                                const targetY = rootPoint ? rootPoint.y : cluster.y;

                                return (
                                    <line
                                        key={`line-${point.id}`}
                                        x1={`${point.x}%`}
                                        y1={`${point.y}%`}
                                        x2={`${targetX}%`}
                                        y2={`${targetY}%`}
                                        stroke={cluster.color}
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                    />
                                )
                            })}
                        </svg>

                        {/* Points */}
                        {points.map((point) => (
                            <div
                                key={point.id}
                                className={cn(
                                    "absolute transition-transform duration-75 cursor-pointer z-10 flex items-center justify-center",
                                    point.status === 'spawn' ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                                    hoveredPoint?.id === point.id ? 'z-50 scale-150' : '',
                                    point.isRoot ? 'z-40' : ''
                                )}
                                style={{
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    transition: 'transform 0.3s ease-out, opacity 0.5s ease-in'
                                }}
                                onMouseEnter={() => setHoveredPoint(point)}
                                onMouseLeave={() => setHoveredPoint(null)}
                            >
                                {point.isRoot ? (
                                    // Root Event Visualization (Star/Sun shape)
                                    <div className="relative">
                                        <div className="absolute inset-0 animate-ping rounded-full opacity-75" style={{ backgroundColor: point.color }}></div>
                                        <div
                                            className="relative w-6 h-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white flex items-center justify-center"
                                            style={{ backgroundColor: point.color }}
                                        >
                                            <Zap className="h-3 w-3 text-white fill-white" />
                                        </div>
                                    </div>
                                ) : (
                                    // Child Event Visualization (Diamond)
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-sm rotate-45 shadow-sm border border-white/40",
                                            hoveredPoint?.id === point.id ? 'ring-2 ring-white bg-white' : ''
                                        )}
                                        style={{
                                            backgroundColor: point.color,
                                            boxShadow: `0 0 8px ${point.color}`,
                                        }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Hover Tooltip */}
                        {hoveredPoint && (
                            <div
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left: `${hoveredPoint.x}%`,
                                    top: `${hoveredPoint.y}%`,
                                    transform: 'translate(25px, -50%)' // Move slightly further right to avoid covering cursor
                                }}
                            >
                                <Card className="w-80 bg-slate-900/95 backdrop-blur border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-3 space-y-3">

                                        {/* Tooltip Header */}
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <div className="flex items-center gap-2">
                                                {hoveredPoint.isRoot ? (
                                                    <div className="flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                                        <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                                                        <span className="text-[10px] uppercase font-bold text-emerald-500">Root Cause</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full" style={{ background: hoveredPoint.color }} />
                                                )}
                                                <span className="font-mono text-xs font-bold text-white max-w-[120px] truncate">{hoveredPoint.metadata.id}</span>
                                            </div>
                                            <Badge variant={hoveredPoint.metadata.severity === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px] px-1 h-5">
                                                {hoveredPoint.metadata.severity}
                                            </Badge>
                                        </div>

                                        {/* Basic Info */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-400">Node Type:</span>
                                                <span className="font-medium text-slate-200">{hoveredPoint.metadata.type}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-400">Cluster Group:</span>
                                                <span className="font-medium text-slate-200">{CLUSTERS.find(c => c.id === hoveredPoint.clusterId)?.name}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-400">Time Delta:</span>
                                                <span className="font-mono text-emerald-400">+{Math.floor(Math.random() * 500)}ms</span>
                                            </div>
                                        </div>

                                        {/* Correlation Reasoning (Logic) */}
                                        {!hoveredPoint.isRoot && (
                                            <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                                                <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                                                    <Layers className="h-3 w-3" />
                                                    Correlation Logic
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="bg-slate-800/50 p-1.5 rounded border border-white/5">
                                                        <span className="text-slate-500 block text-[10px]">Algorithm</span>
                                                        <span className="text-slate-300 font-mono">{hoveredPoint.metadata.algo}</span>
                                                    </div>
                                                    <div className="bg-slate-800/50 p-1.5 rounded border border-white/5">
                                                        <span className="text-slate-500 block text-[10px]">Confidence</span>
                                                        <span className="text-emerald-400 font-bold">{hoveredPoint.metadata.confidence}%</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400 leading-snug">
                                                    <span className="text-slate-500">Reason:</span> {hoveredPoint.metadata.reason}
                                                </div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-800/30 p-1 rounded">
                                                    Linked to Root: <span className="text-slate-300 font-mono">{hoveredPoint.metadata.rootId}</span>
                                                </div>
                                            </div>
                                        )}

                                        {hoveredPoint.isRoot && (
                                            <div className="pt-2 mt-2 border-t border-white/10">
                                                <p className="text-xs text-slate-400 leading-snug">
                                                    <span className="text-slate-500">Analysis:</span> Primary failure point identified by topology traversal and first-occurrence timestamp.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                    </div>

                    {/* Stats Sidebar */}
                    <div className="w-80 border-l border-border bg-card/30 p-4 space-y-6 backdrop-blur">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Cluster Metris</h3>
                            <Card className="bg-secondary/20 border-none">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">Total Events</div>
                                    <div className="text-2xl font-bold font-mono">{points.length}</div>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Clusters</h4>

                            {CLUSTERS.map(cluster => {
                                const count = points.filter(p => p.clusterId === cluster.id).length;
                                return (
                                    <div key={cluster.id} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ background: cluster.color }} />
                                                {cluster.name}
                                            </span>
                                            <span className="font-mono">{count}</span>
                                        </div>
                                        {/* Simple bar viz */}
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{
                                                    width: `${(count / Math.max(points.length, 1)) * 100}%`,
                                                    backgroundColor: cluster.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <Zap className="h-4 w-4" />
                                Live Correlation
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Events are currently being ingested and clustered in real-time.
                                Drift detection is active.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
