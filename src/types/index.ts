// Event & Cluster Types
export type Severity = 'Critical' | 'Major' | 'Minor' | 'Low' | 'Info';
export type ClusterStatus = 'Active' | 'Resolved' | 'Pending';
export type ProcessingStage = 'preprocessing' | 'clustering' | 'rca-impact' | 'remediation';

export type EventLabel = 'Root' | 'Child' | 'Duplicate' | 'Suppressed';

export interface Event {
  id: string;
  alertType: string;
  source: string;
  severity: Severity;
  timestamp: string;
  message: string;
  correlationScore?: number;
  label?: EventLabel;
}

export interface RCA {
  rootCause: string;
  confidence: number;
  hypotheses: string[];
}

export interface Cluster {
  id: string;
  rootEvent: Event;
  childEvents: Event[];
  affectedServices: string[];
  affectedUsers: number;
  status: ClusterStatus;
  createdAt: string;
  duration: string;
  rca: RCA;
  duplicateCount?: number;
  suppressedCount?: number;
}

// Rule Types
export type DeduplicationRuleType = 'same_alert_type' | 'same_severity' | 'same_error_message' | 'same_event_multi_source';
export type SuppressionRuleType = 'business_hours' | 'user_defined_time' | 'assets_maintenance';
export type CorrelationRuleType = 'causal' | 'temporal' | 'spatial' | 'topological' | 'gnn';

export interface BaseRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: 'active' | 'inactive';
  createdAt: string;
  modifiedAt: string;
}

export interface DeduplicationRule extends BaseRule {
  type: DeduplicationRuleType;
  config: {
    matchCriteria?: string[];
    timeWindowValue?: number;
    timeWindowUnit?: 'seconds' | 'minutes' | 'hours';
    groupBy?: string[];
  };
}

export interface SuppressionRule extends BaseRule {
  type: SuppressionRuleType;
  affectedDevices: string[];
  config: {
    schedule?: {
      start: string;
      end: string;
      recurring?: boolean;
    };
    businessHours?: {
      days: string[];
      startTime: string;
      endTime: string;
    };
  };
}

export interface CorrelationRule extends BaseRule {
  type: CorrelationRuleType;
  mlEnabled: boolean;
  gnnEnabled: boolean;
  config: {
    relationships?: Array<{
      cause: string;
      effect: string;
      timeWindow: number;
      confidence: number;
    }>;
    groupingCriteria?: string[];
    traceDepth?: number;
    timeWindowValue?: number;
    timeWindowUnit?: 'seconds' | 'minutes' | 'hours';
  };
}

// Knowledge Base Types
export interface KBArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  tags: string[];
  linkedIntents: string[];
  lastUpdated: string;
  effectiveness: number;
}

// Intent Types - Enhanced
export interface IntentSignal {
  metric: string;
  op: string;
  value: number;
  weight: number;
}

export interface IntentLogPattern {
  keyword: string;
  weight: number;
}

export interface IntentHypothesis {
  id: string;
  description: string;
  signals: IntentSignal[];
  log_patterns: IntentLogPattern[];
}

export interface Intent {
  id: string;
  name: string;
  subIntent: string;
  domain: string;
  function: string;
  description: string;
  keywords: string[];
  hypotheses: string[] | IntentHypothesis[];
  signals: IntentSignal[];
  situation_desc?: string;
}

export interface IntentFull {
  _id?: { $oid: string };
  id: string;
  intent: string;
  subintent: string;
  domain: string;
  function: string;
  description: string;
  keywords: string[];
  signals: IntentSignal[];
  hypotheses: IntentHypothesis[];
  situation_desc: string;
}

export interface IntentCategory {
  id: string;
  name: string;
  domain: string;
  subcategories: IntentSubcategory[];
}

export interface IntentSubcategory {
  id: string;
  name: string;
  function: string;
  intentCount: number;
}

// Auto Remediation Types
export interface RemediationPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

// Processing Statistics
export interface ProcessingStats {
  totalEvents: number;
  normalized: number;
  deduplicated: number;
  suppressed: number;
  clustered: number;
  errors: number;
}

// Flow Stage
export interface FlowStage {
  id: ProcessingStage;
  label: string;
  status: 'complete' | 'active' | 'pending';
  count: number;
  path: string;
}
