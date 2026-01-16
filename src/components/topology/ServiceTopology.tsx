import { useState, useCallback, useMemo } from 'react';
import { Server, Database, Globe, Shield, Cpu, HardDrive, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ServiceNode {
  id: string;
  name: string;
  type: 'api' | 'database' | 'web' | 'auth' | 'compute' | 'storage';
  status: 'healthy' | 'degraded' | 'critical' | 'impacted';
  x: number;
  y: number;
  connections: string[];
  metrics?: {
    latency?: string;
    errorRate?: string;
    throughput?: string;
  };
}

interface ServiceTopologyProps {
  affectedServices?: string[];
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

const defaultNodes: ServiceNode[] = [
  { id: 'web-app', name: 'Web App', type: 'web', status: 'healthy', x: 400, y: 50, connections: ['api-gateway'], metrics: { latency: '45ms', errorRate: '0.1%' } },
  { id: 'mobile-app', name: 'Mobile App', type: 'web', status: 'healthy', x: 600, y: 50, connections: ['api-gateway'], metrics: { latency: '120ms', errorRate: '0.3%' } },
  { id: 'api-gateway', name: 'API Gateway', type: 'api', status: 'healthy', x: 500, y: 150, connections: ['auth-service', 'user-service', 'order-service'], metrics: { latency: '12ms', throughput: '5K/s' } },
  { id: 'auth-service', name: 'Auth Service', type: 'auth', status: 'healthy', x: 300, y: 250, connections: ['user-db'], metrics: { latency: '25ms', errorRate: '0%' } },
  { id: 'user-service', name: 'User Service', type: 'api', status: 'healthy', x: 500, y: 250, connections: ['user-db', 'cache'], metrics: { latency: '35ms', errorRate: '0.2%' } },
  { id: 'order-service', name: 'Order Service', type: 'api', status: 'healthy', x: 700, y: 250, connections: ['order-db', 'payment-service'], metrics: { latency: '55ms', errorRate: '0.5%' } },
  { id: 'payment-service', name: 'Payment Service', type: 'api', status: 'healthy', x: 800, y: 350, connections: ['payment-db'], metrics: { latency: '180ms', errorRate: '0.1%' } },
  { id: 'user-db', name: 'User DB', type: 'database', status: 'healthy', x: 350, y: 380, connections: [], metrics: { latency: '5ms' } },
  { id: 'order-db', name: 'Order DB', type: 'database', status: 'healthy', x: 600, y: 380, connections: [], metrics: { latency: '8ms' } },
  { id: 'payment-db', name: 'Payment DB', type: 'database', status: 'healthy', x: 800, y: 450, connections: [], metrics: { latency: '6ms' } },
  { id: 'cache', name: 'Redis Cache', type: 'storage', status: 'healthy', x: 500, y: 380, connections: [], metrics: { latency: '1ms' } },
];

const getIcon = (type: ServiceNode['type']) => {
  switch (type) {
    case 'api': return Server;
    case 'database': return Database;
    case 'web': return Globe;
    case 'auth': return Shield;
    case 'compute': return Cpu;
    case 'storage': return HardDrive;
    default: return Server;
  }
};

const getStatusColor = (status: ServiceNode['status']) => {
  switch (status) {
    case 'healthy': return 'bg-status-success border-status-success/50 text-status-success';
    case 'degraded': return 'bg-severity-high border-severity-high/50 text-severity-high';
    case 'critical': return 'bg-severity-critical border-severity-critical/50 text-severity-critical animate-pulse-glow';
    case 'impacted': return 'bg-severity-medium border-severity-medium/50 text-severity-medium';
    default: return 'bg-muted border-border text-muted-foreground';
  }
};

const getNodeBg = (status: ServiceNode['status']) => {
  switch (status) {
    case 'healthy': return 'bg-card hover:bg-secondary/50';
    case 'degraded': return 'bg-severity-high/10 hover:bg-severity-high/20';
    case 'critical': return 'bg-severity-critical/10 hover:bg-severity-critical/20 ring-2 ring-severity-critical/50';
    case 'impacted': return 'bg-severity-medium/10 hover:bg-severity-medium/20';
    default: return 'bg-card hover:bg-secondary/50';
  }
};

export function ServiceTopology({ affectedServices = [], onNodeClick, className }: ServiceTopologyProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = useMemo(() => {
    return defaultNodes.map(node => ({
      ...node,
      status: affectedServices.includes(node.name) || affectedServices.includes(node.id)
        ? (affectedServices[0] === node.name || affectedServices[0] === node.id ? 'critical' : 'impacted') as ServiceNode['status']
        : node.status
    }));
  }, [affectedServices]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    onNodeClick?.(nodeId);
  }, [selectedNode, onNodeClick]);

  // Generate connection lines
  const connections = useMemo(() => {
    const lines: { from: ServiceNode; to: ServiceNode; isAffected: boolean }[] = [];
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode) {
          const isAffected = 
            (node.status === 'critical' || node.status === 'impacted') &&
            (targetNode.status === 'critical' || targetNode.status === 'impacted');
          lines.push({ from: node, to: targetNode, isAffected });
        }
      });
    });
    return lines;
  }, [nodes]);

  return (
    <div className={cn("relative w-full h-[500px] bg-secondary/20 rounded-xl border border-border overflow-hidden", className)}>
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 flex gap-3 flex-wrap">
        <Badge variant="outline" className="gap-1.5 bg-card/80 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-status-success" />
          Healthy
        </Badge>
        <Badge variant="outline" className="gap-1.5 bg-card/80 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-severity-medium" />
          Impacted
        </Badge>
        <Badge variant="outline" className="gap-1.5 bg-card/80 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-severity-critical" />
          Critical
        </Badge>
      </div>

      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity="0.5" />
          </marker>
          <marker
            id="arrowhead-affected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--severity-critical))" opacity="0.8" />
          </marker>
        </defs>
        {connections.map((conn, index) => {
          const isHighlighted = 
            hoveredNode === conn.from.id || 
            hoveredNode === conn.to.id ||
            selectedNode === conn.from.id ||
            selectedNode === conn.to.id;
          
          return (
            <line
              key={index}
              x1={conn.from.x}
              y1={conn.from.y + 20}
              x2={conn.to.x}
              y2={conn.to.y - 20}
              stroke={conn.isAffected ? 'hsl(var(--severity-critical))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isHighlighted ? 3 : conn.isAffected ? 2 : 1}
              strokeOpacity={isHighlighted ? 1 : 0.4}
              strokeDasharray={conn.isAffected ? "5,5" : undefined}
              markerEnd={conn.isAffected ? "url(#arrowhead-affected)" : "url(#arrowhead)"}
              className="transition-all duration-200"
            />
          );
        })}
      </svg>

      {/* Service Nodes */}
      {nodes.map((node) => {
        const Icon = getIcon(node.type);
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        const isConnected = hoveredNode && (
          nodes.find(n => n.id === hoveredNode)?.connections.includes(node.id) ||
          node.connections.includes(hoveredNode)
        );

        return (
          <Tooltip key={node.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={cn(
                  "absolute flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 -translate-x-1/2 -translate-y-1/2",
                  getNodeBg(node.status),
                  isSelected && "ring-2 ring-primary scale-110",
                  (isHovered || isConnected) && "scale-105 z-20",
                  !isHovered && !isConnected && !isSelected && "opacity-90"
                )}
                style={{ left: node.x, top: node.y }}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg border-2",
                  getStatusColor(node.status).replace('text-', 'border-').split(' ')[1],
                  node.status === 'critical' && "animate-pulse"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    node.status === 'healthy' && "text-status-success",
                    node.status === 'degraded' && "text-severity-high",
                    node.status === 'critical' && "text-severity-critical",
                    node.status === 'impacted' && "text-severity-medium",
                  )} />
                </div>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{node.name}</span>
                {node.status !== 'healthy' && (
                  <div className="absolute -top-1 -right-1">
                    {node.status === 'critical' ? (
                      <AlertCircle className="h-4 w-4 text-severity-critical" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-severity-medium" />
                    )}
                  </div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{node.name}</span>
                  <Badge variant={node.status === 'healthy' ? 'secondary' : 'destructive'} className="text-xs">
                    {node.status}
                  </Badge>
                </div>
                {node.metrics && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {node.metrics.latency && <div>Latency: {node.metrics.latency}</div>}
                    {node.metrics.errorRate && <div>Error Rate: {node.metrics.errorRate}</div>}
                    {node.metrics.throughput && <div>Throughput: {node.metrics.throughput}</div>}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Selected Node Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-lg border border-border p-4 w-64 shadow-lg animate-fade-in">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            const Icon = getIcon(node.type);
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">{node.name}</span>
                  </div>
                  <Badge variant={node.status === 'healthy' ? 'secondary' : 'destructive'}>
                    {node.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Type: {node.type}</p>
                  {node.metrics?.latency && <p>Latency: {node.metrics.latency}</p>}
                  {node.metrics?.errorRate && <p>Error Rate: {node.metrics.errorRate}</p>}
                  {node.metrics?.throughput && <p>Throughput: {node.metrics.throughput}</p>}
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Connections: {node.connections.length > 0 ? node.connections.join(', ') : 'None'}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
