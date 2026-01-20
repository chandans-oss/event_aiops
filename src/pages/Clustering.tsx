import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, GitBranch, Clock, MapPin, Cpu, ArrowRight, CheckCircle2, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChildEventsSidebar } from '@/components/sidebars/ChildEventsSidebar';
import { mockClusters, processingStats } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Cluster } from '@/types';

const correlationStrategies = [
  { id: 'temporal', name: 'Temporal Correlation', icon: Clock, active: true, matches: 245 },
  { id: 'causal', name: 'Causal Correlation', icon: GitBranch, active: true, matches: 128 },
  { id: 'spatial', name: 'Spatial Correlation', icon: MapPin, active: true, matches: 89 },
  { id: 'topological', name: 'Topological Correlation', icon: Network, active: true, matches: 156 },
  { id: 'gnn', name: 'GNN (Graph Neural Network)', icon: Cpu, active: true, matches: 312 },
];

export default function Clustering() {
  const navigate = useNavigate();
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [showChildEvents, setShowChildEvents] = useState(false);

  const openClusterDetails = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setShowChildEvents(true);
  };

  const navigateToRCA = (cluster: Cluster) => {
    navigate(`/rca-impact?cluster=${cluster.id}`);
  };

  const closeClusterDetails = () => {
    setShowChildEvents(false);
    setSelectedCluster(null);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Clustering</h1>
            <p className="text-muted-foreground">View how events are grouped using correlation strategies</p>
          </div>
          <Link to="/rca-impact">
            <Button className="gap-2 gradient-primary">
              Go to RCA & Impact
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 hover-lift">
            <p className="text-3xl font-bold text-foreground">{mockClusters.length}</p>
            <p className="text-sm text-muted-foreground">Active Clusters</p>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <p className="text-3xl font-bold text-foreground">{Math.round(processingStats.totalEvents / mockClusters.length)}</p>
            <p className="text-sm text-muted-foreground">Avg Cluster Size</p>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <p className="text-3xl font-bold text-foreground">42</p>
            <p className="text-sm text-muted-foreground">Non-Correlated</p>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <p className="text-3xl font-bold text-primary">0.87</p>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Correlation Strategies */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Active Strategies
              </h2>
              <div className="space-y-3">
                {correlationStrategies.map((strategy) => {
                  const StrategyIcon = strategy.icon;
                  return (
                    <div
                      key={strategy.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                        strategy.active
                          ? "bg-primary/10 border-primary/30"
                          : "bg-secondary/30 border-border/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          strategy.active ? "bg-primary/20" : "bg-muted"
                        )}>
                          <StrategyIcon
                            className={cn(
                              "h-5 w-5",
                              strategy.active ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{strategy.name}</p>
                          <p className="text-xs text-muted-foreground">{strategy.matches} matches</p>
                        </div>
                      </div>
                      <Badge variant={strategy.active ? "default" : "secondary"}>
                        {strategy.active ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cluster Visualization */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Formed Clusters</h2>
              <div className="space-y-4">
                {mockClusters.slice(0, 4).map((cluster) => (
                  <div
                    key={cluster.id}
                    className="p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer"
                    onClick={() => openClusterDetails(cluster)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          cluster.rootEvent.severity === 'Critical' && "bg-severity-critical/20",
                          cluster.rootEvent.severity === 'Major' && "bg-severity-high/20",
                          cluster.rootEvent.severity === 'Minor' && "bg-severity-low/20",
                        )}>
                          <Network className={cn(
                            "h-5 w-5",
                            cluster.rootEvent.severity === 'Critical' && "text-severity-critical",
                            cluster.rootEvent.severity === 'Major' && "text-severity-high",
                            cluster.rootEvent.severity === 'Minor' && "text-severity-low",
                          )} />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-muted-foreground">{cluster.id}</p>
                          <p className="font-medium text-foreground">{cluster.rootEvent.alertType.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{Math.round(cluster.rca.confidence * 100)}%</p>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                    </div>

                    {/* Cluster Tree */}
                    <div className="pl-6 border-l-2 border-primary/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-primary/30" />
                        <Badge variant="destructive" className="text-xs">{cluster.rootEvent.severity}</Badge>
                        <span className="text-sm text-foreground">{cluster.rootEvent.source}</span>
                        <Badge variant="outline" className="text-xs">Root</Badge>
                      </div>
                      {cluster.childEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-border" />
                          <Badge variant="secondary" className="text-xs">{event.severity}</Badge>
                          <span className="text-sm text-muted-foreground">{event.source}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((event.correlationScore || 0) * 100)}%)
                          </span>
                        </div>
                      ))}
                      {cluster.childEvents.length > 2 && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <div className="w-3 h-0.5 bg-border" />
                          + {cluster.childEvents.length - 2} more events
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Causal</Badge>
                        <Badge variant="outline">Topological</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="default" className="gap-1" onClick={(e) => { e.stopPropagation(); navigateToRCA(cluster); }}>
                          <Eye className="h-3 w-3" />
                          Full RCA
                        </Button>
                        <Button size="sm" variant="ghost" className="text-primary" onClick={(e) => { e.stopPropagation(); openClusterDetails(cluster); }}>
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Child Events Sidebar */}
      {showChildEvents && selectedCluster && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={closeClusterDetails} />
          <ChildEventsSidebar cluster={selectedCluster} onClose={closeClusterDetails} />
        </>
      )}
    </MainLayout>
  );
}
