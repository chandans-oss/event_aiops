import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, AlertCircle, Activity, CheckCircle2, Clock, Eye, BarChart3, Wrench, ChevronRight, Copy, BellOff, GitBranch, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MainLayout } from '@/components/layout/MainLayout';
import { RCASidebar } from '@/components/sidebars/RCASidebar';
import { ImpactSidebar } from '@/components/sidebars/ImpactSidebar';
import { RemediationSidebar } from '@/components/sidebars/RemediationSidebar';
import { ChildEventsSidebar } from '@/components/sidebars/ChildEventsSidebar';
import { SeverityIcon } from '@/components/SeverityIcon';
import { mockClusters, processingStats } from '@/data/mockData';
import { Cluster, Severity, ClusterStatus } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type SidebarType = 'rca' | 'impact' | 'remediation' | 'children' | null;

const severityConfig: Record<Severity, { className: string; border: string }> = {
  Critical: { className: 'bg-severity-critical/60 text-foreground', border: 'border-l-severity-critical' },
  Major: { className: 'bg-severity-high/60 text-foreground', border: 'border-l-severity-high' },
  Minor: { className: 'bg-severity-low/60 text-foreground', border: 'border-l-severity-low' },
  Low: { className: 'bg-muted/60 text-foreground', border: 'border-l-muted' },
  Info: { className: 'bg-severity-info/60 text-foreground', border: 'border-l-severity-info' },
};

const statusConfig: Record<string, string> = {
  Active: 'bg-severity-critical/20 text-severity-critical border-severity-critical/30',
  Resolved: 'bg-status-success/20 text-status-success border-status-success/30',
  Pending: 'bg-severity-medium/20 text-severity-medium border-severity-medium/30',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null);

  const navigateToRCA = (cluster: Cluster) => {
    navigate(`/rca-impact?cluster=${cluster.id}`);
  };

  const filteredClusters = useMemo(() => {
    return mockClusters.filter((cluster) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = cluster.id.toLowerCase().includes(query);
        const matchesType = cluster.rootEvent.alertType.toLowerCase().includes(query);
        const matchesService = cluster.affectedServices.some(s => s.toLowerCase().includes(query));
        if (!matchesId && !matchesType && !matchesService) return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && cluster.rootEvent.severity !== severityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && cluster.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, severityFilter, statusFilter]);

  const openSidebar = (type: SidebarType, cluster: Cluster) => {
    setSelectedCluster(cluster);
    setActiveSidebar(type);
  };

  const closeSidebar = () => {
    setActiveSidebar(null);
    setSelectedCluster(null);
  };

  const openRemediationFromRCA = () => {
    setActiveSidebar('remediation');
  };

  const backToRCA = () => {
    setActiveSidebar('rca');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setStatusFilter('all');
    setTimeFilter('24h');
  };

  const hasActiveFilters = searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || timeFilter !== '24h';

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-critical/20">
                <AlertCircle className="h-5 w-5 text-severity-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockClusters.filter(c => c.status === 'Active').length}
                </p>
                <p className="text-xs text-muted-foreground">Active Clusters</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {processingStats.totalEvents.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-high/20">
                <Clock className="h-5 w-5 text-severity-high" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(processingStats.totalEvents / mockClusters.length)}
                </p>
                <p className="text-xs text-muted-foreground">Avg Cluster Size</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-critical/20">
                <AlertCircle className="h-5 w-5 text-severity-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockClusters.filter(c => c.rootEvent.severity === 'Critical').length}
                </p>
                <p className="text-xs text-muted-foreground">Critical Severity</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/20">
                <CheckCircle2 className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((mockClusters.filter(c => c.status === 'Resolved').length / mockClusters.length) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Analysis KPIs */}
        <div className="glass-card rounded-xl p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Event Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/20">
                  <Target className="h-5 w-5 text-status-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-xs text-muted-foreground">Root Events</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-info/20">
                  <GitBranch className="h-5 w-5 text-severity-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">33</p>
                  <p className="text-xs text-muted-foreground">Correlated</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-medium/20">
                  <Copy className="h-5 w-5 text-severity-medium" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-xs text-muted-foreground">Duplicates</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Suppressed</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-critical/20">
                  <AlertCircle className="h-5 w-5 text-severity-critical" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">16</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">44</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by cluster ID, incident type, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[120px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1h</SelectItem>
                <SelectItem value="6h">Last 6h</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}

            <div className="ml-auto">
              <Badge variant="outline" className="text-muted-foreground">
                {filteredClusters.length} clusters
              </Badge>
            </div>
          </div>
        </div>

        {/* Cluster Grid - Rectangle Table View */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="col-span-3">Cluster / Issue</div>
            <div className="col-span-1">Severity</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Events / Labels</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-3">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredClusters.map((cluster) => {
              const severity = severityConfig[cluster.rootEvent.severity];
              const createdTime = formatDistanceToNow(new Date(cluster.createdAt), { addSuffix: true });

              return (
                <div
                  key={cluster.id}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-all cursor-pointer border-l-4",
                    severity.border
                  )}
                  onClick={() => openSidebar('children', cluster)}
                >
                  {/* Cluster / Issue */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                      cluster.rootEvent.severity === 'Critical' && "bg-severity-critical/20",
                      cluster.rootEvent.severity === 'Major' && "bg-severity-high/20",
                      cluster.rootEvent.severity === 'Minor' && "bg-severity-low/20",
                      cluster.rootEvent.severity === 'Low' && "bg-muted/20",
                    )}>
                      <AlertCircle className={cn(
                        "h-5 w-5",
                        cluster.rootEvent.severity === 'Critical' && "text-severity-critical",
                        cluster.rootEvent.severity === 'Major' && "text-severity-high",
                        cluster.rootEvent.severity === 'Minor' && "text-severity-low",
                        cluster.rootEvent.severity === 'Low' && "text-muted-foreground",
                      )} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {cluster.rootEvent.alertType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{cluster.rootEvent.message}</p>
                      <p className="text-xs font-mono text-muted-foreground">{cluster.id}</p>
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="col-span-1 flex items-center">
                    <Badge className={cn("gap-1", severity.className)}>
                      <SeverityIcon severity={cluster.rootEvent.severity} className="h-3 w-3" />
                      {cluster.rootEvent.severity}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <Badge variant="outline" className={statusConfig[cluster.status]}>
                      {cluster.status}
                    </Badge>
                  </div>

                  {/* Events / Labels */}
                  <div className="col-span-2 flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{cluster.childEvents.length + 1 + (cluster.duplicateCount || 0) + (cluster.suppressedCount || 0)} events</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs gap-1 bg-primary/10 text-primary border-primary/30">
                        <Target className="h-2.5 w-2.5" />
                        Root
                      </Badge>
                      {cluster.childEvents.length > 0 && (
                        <Badge variant="outline" className="text-xs gap-1 bg-severity-info/10 text-severity-info border-severity-info/30">
                          <GitBranch className="h-2.5 w-2.5" />
                          {cluster.childEvents.length} Child
                        </Badge>
                      )}
                      {(cluster.duplicateCount || 0) > 0 && (
                        <Badge variant="outline" className="text-xs gap-1 bg-severity-medium/10 text-severity-medium border-severity-medium/30">
                          <Copy className="h-2.5 w-2.5" />
                          {cluster.duplicateCount} Dup
                        </Badge>
                      )}
                      {(cluster.suppressedCount || 0) > 0 && (
                        <Badge variant="outline" className="text-xs gap-1 bg-muted/50 text-muted-foreground border-border">
                          <BellOff className="h-2.5 w-2.5" />
                          {cluster.suppressedCount} Supp
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Created */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-sm text-foreground">{createdTime}</p>
                    <p className="text-xs text-muted-foreground">Duration: {cluster.duration}</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1 text-xs"
                      onClick={() => openSidebar('rca', cluster)}
                    >
                      <Eye className="h-3 w-3" />
                      Full RCA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs hover:bg-severity-high/10 hover:text-severity-high hover:border-severity-high/50"
                      onClick={() => openSidebar('impact', cluster)}
                    >
                      <BarChart3 className="h-3 w-3" />
                      Impact
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs hover:bg-status-success/10 hover:text-status-success hover:border-status-success/50"
                      onClick={() => openSidebar('remediation', cluster)}
                    >
                      <Wrench className="h-3 w-3" />
                      Remediation
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredClusters.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No clusters found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Sidebars */}
      {activeSidebar === 'rca' && selectedCluster && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={closeSidebar} />
          <RCASidebar
            cluster={selectedCluster}
            onClose={closeSidebar}
            onOpenRemediation={openRemediationFromRCA}
          />
        </>
      )}
      {activeSidebar === 'impact' && selectedCluster && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={closeSidebar} />
          <ImpactSidebar cluster={selectedCluster} onClose={closeSidebar} />
        </>
      )}
      {activeSidebar === 'remediation' && selectedCluster && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={closeSidebar} />
          <RemediationSidebar
            cluster={selectedCluster}
            onClose={closeSidebar}
            onBack={backToRCA}
          />
        </>
      )}
      {activeSidebar === 'children' && selectedCluster && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={closeSidebar} />
          <ChildEventsSidebar cluster={selectedCluster} onClose={closeSidebar} />
        </>
      )}
    </MainLayout>
  );
}
