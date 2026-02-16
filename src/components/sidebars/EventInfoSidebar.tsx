import { X, Info, CheckCircle2, AlertTriangle, Shield, GitBranch, Copy, BellOff, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NetworkEvent } from '@/data/eventsData';
import { cn } from '@/lib/utils';

interface EventInfoSidebarProps {
  event: NetworkEvent;
  onClose: () => void;
}

const labelConfig = {
  Root: { icon: Target, color: 'text-status-success', bg: 'bg-status-success/10', border: 'border-status-success/30' },
  Child: { icon: GitBranch, color: 'text-severity-info', bg: 'bg-severity-info/10', border: 'border-severity-info/30' },
  Duplicate: { icon: Copy, color: 'text-severity-medium', bg: 'bg-severity-medium/10', border: 'border-severity-medium/30' },
  Suppressed: { icon: BellOff, color: 'text-muted-foreground', bg: 'bg-muted/30', border: 'border-border' },
};

export function EventInfoSidebar({ event, onClose }: EventInfoSidebarProps) {
  const navigate = useNavigate();
  const label = event.label || 'Child';
  const config = labelConfig[label];
  const LabelIcon = config.icon;

  return (
    <div className="fixed inset-y-0 right-0 w-[40%] max-w-xl bg-card border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className={cn("p-2 rounded-lg", config.bg, config.border, "border")}>
            <LabelIcon className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Event Classification</h2>
            <p className="text-sm text-muted-foreground">{event.event_id}</p>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Event Details */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Event Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Device</span>
              <span className="text-sm font-medium text-foreground">{event.device}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Event Code</span>
              <Badge variant="outline">{event.event_code}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Severity</span>
              <Badge className={cn(
                event.severity === 'Critical' && "bg-severity-critical",
                event.severity === 'Major' && "bg-severity-high",
                event.severity === 'Minor' && "bg-severity-low",
                event.severity === 'Low' && "bg-muted",
              )}>
                {event.severity}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Timestamp</span>
              <span className="text-sm font-mono text-foreground">{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm text-foreground">{event.site} / {event.region} / {event.rack}</span>
            </div>
            {event.clusterId && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cluster ID</span>
                <Badge variant="outline" className="font-mono">{event.clusterId}</Badge>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Message</span>
            <p className="text-sm text-foreground mt-1">{event.message}</p>
          </div>
        </div>

        {/* Classification Label */}
        <div className={cn("rounded-xl p-4 border", config.bg, config.border)}>
          <div className="flex items-center gap-3 mb-3">
            <LabelIcon className={cn("h-6 w-6", config.color)} />
            <div>
              <h3 className="font-semibold text-foreground">{label} Event</h3>
              <p className="text-sm text-muted-foreground">
                {label === 'Root' && 'Identified as the root cause of a cluster'}
                {label === 'Child' && 'Correlated event within a cluster'}
                {label === 'Duplicate' && 'Duplicate of an existing event'}
                {label === 'Suppressed' && 'Suppressed based on defined rules'}
              </p>
            </div>
          </div>
        </div>

        {/* Classification Reasoning */}
        {event.classificationReason && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Classification Reasoning
            </h3>

            <div className="space-y-4">
              {/* Applied Rule */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Applied Rule</span>
                </div>
                <p className="text-sm font-semibold text-primary">{event.classificationReason.rule}</p>
              </div>

              {/* Explanation */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Explanation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.classificationReason.description}
                </p>
              </div>

              {/* Confidence Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Confidence Score</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round(event.classificationReason.confidence * 100)}%
                  </span>
                </div>
                <Progress
                  value={event.classificationReason.confidence * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Rule Details based on label */}
        {label !== 'Child' && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-severity-high" />
              {label === 'Duplicate' && 'Deduplication Details'}
              {label === 'Suppressed' && 'Suppression Details'}
              {label === 'Root' && 'Root Cause Analysis'}
            </h3>

            <div className="space-y-3">
              {label === 'Duplicate' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    This event was marked as a duplicate because it matches an existing event based on the following criteria:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Same device ({event.device})</li>
                    <li>Same event type ({event.event_code})</li>
                    <li>Within time window of 5 minutes</li>
                    <li>Similar severity level</li>
                  </ul>
                  <div className="mt-3 p-3 rounded-lg bg-severity-medium/10 border border-severity-medium/30">
                    <p className="text-sm text-severity-medium">
                      <strong>Impact:</strong> This event has been consolidated to reduce alert fatigue and noise in the monitoring system.
                    </p>
                  </div>
                </>
              )}

              {label === 'Suppressed' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    This event was suppressed based on the following rule:
                  </p>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {event.classificationReason?.rule || 'Business Hours Suppression'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Events matching this criteria are suppressed to prevent unnecessary alerts during specified conditions.
                    </p>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-severity-info/10 border border-severity-info/30">
                    <p className="text-sm text-severity-info">
                      <strong>Note:</strong> Suppressed events are still logged but do not trigger active alerts or notifications.
                    </p>
                  </div>
                </>
              )}

              {label === 'Root' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    This event has been identified as the root cause based on:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>First event in the correlation timeline</li>
                    <li>Upstream position in network topology</li>
                    <li>Cascading failure pattern analysis</li>
                    <li>Intent-based hypothesis scoring</li>
                  </ul>
                  <div className="mt-3 p-3 rounded-lg bg-status-success/10 border border-status-success/30">
                    <p className="text-sm text-status-success">
                      <strong>Action Required:</strong> RCA, Impact Analysis, and Remediation are available for this event.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-3">
          {/* Footer actions removed as per request */}
        </div>
      </div>
    </div>
  );
}
