import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, AlertCircle, Eye, BarChart3, Wrench, Info, Target, GitBranch, Copy, BellOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { EventInfoSidebar } from '@/shared/components/sidebars/EventInfoSidebar';
import { RCASidebar } from '@/features/rca/sidebars/RcaSidebar';
import { ImpactSidebar } from '@/features/impact/sidebars/ImpactSidebar';
import { RemediationSidebar } from '@/features/remediation/sidebars/RemediationSidebar';
import { ProbableCauseSidebar } from '@/features/rca/sidebars/ProbableCauseSidebar';
import { SeverityIcon } from '@/shared/components/common/SeverityIcon';
import { sampleNetworkEvents, getEventStats, NetworkEvent } from '@/features/events/data/eventsData';
import { mockClusters } from '@/data/mock/mockData';
import { Severity } from '@/shared/types';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type SidebarType = 'info' | 'rca' | 'impact' | 'remediation' | 'probable-cause' | null;

const ITEMS_PER_PAGE = 10;

const severityConfig: Record<Severity, { className: string; border: string }> = {
  Critical: { className: 'bg-severity-critical/60 text-foreground', border: 'border-l-severity-critical' },
  Major: { className: 'bg-severity-high/60 text-foreground', border: 'border-l-severity-high' },
  Minor: { className: 'bg-severity-low/60 text-foreground', border: 'border-l-severity-low' },
  Low: { className: 'bg-muted/60 text-foreground', border: 'border-l-muted' },
  Info: { className: 'bg-severity-info/60 text-foreground', border: 'border-l-severity-info' },
};

const labelConfig = {
  Root: { icon: Target, color: 'text-status-success', bg: 'bg-status-success/10', border: 'border-status-success/30', label: 'Root' },
  Child: { icon: GitBranch, color: 'text-severity-info', bg: 'bg-severity-info/10', border: 'border-severity-info/30', label: 'Child (Correlated)' },
  Duplicate: { icon: Copy, color: 'text-severity-medium', bg: 'bg-severity-medium/10', border: 'border-severity-medium/30', label: 'Duplicate' },
  Suppressed: { icon: BellOff, color: 'text-muted-foreground', bg: 'bg-muted/30', border: 'border-border', label: 'Suppressed' },
};

export default function Events() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const clusterId = searchParams.get('cluster');
    const sidebarToOpen = searchParams.get('openSidebar') as SidebarType;

    if (clusterId) {
      // Find the root event for this cluster
      const rootEvent = sampleNetworkEvents.find(e => e.clusterId === clusterId && e.label === 'Root');
      if (rootEvent) {
        setSelectedEvent(rootEvent);
        if (sidebarToOpen) {
          setActiveSidebar(sidebarToOpen);
        }
      }
    }
  }, [searchParams]);

  const filteredEvents = useMemo(() => {
    return sampleNetworkEvents.filter((event) => {
      // Cluster filter from query params
      const clusterIdParam = searchParams.get('cluster');
      if (clusterIdParam && event.clusterId !== clusterIdParam) {
        return false;
      }

      // Status filter
      if (!showResolved && event.status === 'Resolved') return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = event.event_id.toLowerCase().includes(query);
        const matchesDevice = event.device.toLowerCase().includes(query);
        const matchesCode = event.event_code.toLowerCase().includes(query);
        const matchesMessage = event.message.toLowerCase().includes(query);
        if (!matchesId && !matchesDevice && !matchesCode && !matchesMessage) return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && event.severity !== severityFilter) {
        return false;
      }

      // Label filter
      if (labelFilter !== 'all' && event.label !== labelFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, severityFilter, labelFilter, showResolved, searchParams]);

  const stats = useMemo(() => getEventStats(sampleNetworkEvents), []);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, severityFilter, labelFilter, showResolved, searchParams]);

  const openSidebar = (type: SidebarType, event: NetworkEvent) => {
    setSelectedEvent(event);
    setActiveSidebar(type);
  };

  const closeSidebar = () => {
    setActiveSidebar(null);
    setSelectedEvent(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('cluster');
    newParams.delete('openSidebar');
    setSearchParams(newParams, { replace: true });
  };

  const currentCluster = useMemo(() => {
    if (!selectedEvent?.clusterId) return null;
    return mockClusters.find(c => c.id === selectedEvent.clusterId) || null;
  }, [selectedEvent]);

  const openRemediationFromRCA = () => {
    setActiveSidebar('remediation');
  };

  useEffect(() => {
    const handleOpenRemediation = () => {
      setActiveSidebar('remediation');
    };
    document.addEventListener('open-remediation', handleOpenRemediation);
    return () => document.removeEventListener('open-remediation', handleOpenRemediation);
  }, []);

  const backToRCA = () => {
    setActiveSidebar('rca');
  };

  const clearClusterFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('cluster');
    newParams.delete('openSidebar');
    setSearchParams(newParams, { replace: true });
    setActiveSidebar(null);
    setSelectedEvent(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setLabelFilter('all');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = searchQuery || severityFilter !== 'all' || labelFilter !== 'all';

  // Get cluster for root events
  const getClusterForEvent = (event: NetworkEvent) => {
    if ((event.label === 'Root' || event.label === 'Child') && event.clusterId) {
      return mockClusters.find(c => c.id === event.clusterId);
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by event ID, device, code, or message..."
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

            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>
                <SelectItem value="Root">Root</SelectItem>
                <SelectItem value="Child">Child (Correlated)</SelectItem>
                <SelectItem value="Duplicate">Duplicate</SelectItem>
                <SelectItem value="Suppressed">Suppressed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              <Switch
                id="show-resolved"
                checked={showResolved}
                onCheckedChange={setShowResolved}
              />
              <Label htmlFor="show-resolved" className="text-sm text-muted-foreground">
                Show Resolved (History)
              </Label>
            </div>

            {searchParams.get('cluster') && (
              <Badge
                variant="secondary"
                className="gap-2 bg-primary/20 text-primary border-primary/30 py-1.5 px-3 animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <Target className="h-3 w-3" />
                Cluster Filter: {searchParams.get('cluster')}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors"
                  onClick={clearClusterFilter}
                />
              </Badge>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}

            <div className="ml-auto">
              <Badge variant="outline" className="text-muted-foreground">
                {filteredEvents.length} events
              </Badge>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-2">Event ID / Device</div>
                <div className="col-span-1">Severity</div>
                <div className="col-span-2">Event Message</div>
                <div className="col-span-2">Event Code</div>
                <div className="col-span-1">Event Label</div>
                <div className="col-span-1">Timestamp</div>
                <div className="col-span-3">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {paginatedEvents.map((event) => {
                  const severity = severityConfig[event.severity];
                  const label = event.label || 'Child';
                  const labelCfg = labelConfig[label];
                  const LabelIcon = labelCfg.icon;
                  const isRootEvent = event.label === 'Root';
                  const cluster = getClusterForEvent(event);
                  const eventTime = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true });

                  return (
                    <div
                      key={event.event_id}
                      className={cn(
                        "grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-all border-l-4 cursor-pointer",
                        severity.border,
                        event.status === 'Resolved' && "opacity-60"
                      )}
                      onClick={() => openSidebar('info', event)}
                    >
                      {/* Event ID / Device */}
                      <div className="col-span-2 flex flex-col justify-center">
                        <p className="font-mono text-sm font-medium text-foreground">{event.event_id}</p>
                        <p className="text-xs text-muted-foreground">{event.device}</p>
                        <p className="text-xs text-muted-foreground">{event.site} / {event.rack}</p>
                      </div>

                      {/* Severity */}
                      <div className="col-span-1 flex items-center">
                        <Badge className={cn("gap-1", severity.className)}>
                          <SeverityIcon severity={event.severity} className="h-3 w-3" />
                          {event.severity}
                        </Badge>
                      </div>

                      {/* Message */}
                      <div className="col-span-2 flex items-center">
                        <p className="text-sm text-muted-foreground truncate">{event.message}</p>
                      </div>

                      {/* Event Code */}
                      <div className="col-span-2 flex items-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.event_code}
                        </Badge>
                      </div>

                      {/* Label */}
                      <div className="col-span-1 flex items-center">
                        <Badge variant="outline" className={cn("gap-1 text-xs", labelCfg.bg, labelCfg.border)}>
                          <LabelIcon className={cn("h-3 w-3", labelCfg.color)} />
                          <span className={labelCfg.color}>{label}</span>
                        </Badge>
                      </div>

                      {/* Timestamp */}
                      <div className="col-span-1 flex items-center">
                        <p className="text-xs text-muted-foreground">{eventTime}</p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={event.label === 'Root' ? 'default' : 'outline'}
                          className={cn(
                            "gap-1 text-xs",
                            event.label === 'Root' ? "bg-status-success hover:bg-status-success/90" : "opacity-50"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (event.label === 'Root') openSidebar('probable-cause', event);
                          }}
                          disabled={event.label !== 'Root'}
                        >
                          <Eye className="h-3 w-3" />
                          RCA/Impact
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredEvents.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>

      {/* Sidebars */}
      {activeSidebar && selectedEvent && (
        <>
          <div
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={closeSidebar}
          />

          {activeSidebar === 'info' && (
            <EventInfoSidebar event={selectedEvent} onClose={closeSidebar} />
          )}

          {activeSidebar === 'rca' && currentCluster && (
            <RCASidebar
              cluster={currentCluster}
              onClose={closeSidebar}
              onOpenRemediation={openRemediationFromRCA}
              onBack={() => setActiveSidebar('probable-cause')}
            />
          )}

          {activeSidebar === 'impact' && currentCluster && (
            <ImpactSidebar
              cluster={currentCluster}
              onClose={closeSidebar}
            />
          )}

          {activeSidebar === 'remediation' && currentCluster && (
            <RemediationSidebar
              cluster={currentCluster}
              onClose={closeSidebar}
              onBack={backToRCA}
            />
          )}

          {activeSidebar === 'probable-cause' && currentCluster && (
            <ProbableCauseSidebar
              cluster={currentCluster}
              onClose={closeSidebar}
              onSelectCause={() => setActiveSidebar('rca')}
            />
          )}
        </>
      )}
    </MainLayout>
  );
}
