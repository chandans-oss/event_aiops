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
// Rule Types
export type DeduplicationRuleType = 'exact_match' | 'time_window' | 'source_based';
export type SuppressionRuleType = 'maintenance' | 'business_hours' | 'reboot_pattern' | 'time_based';
export type CorrelationRuleType = 'temporal' | 'spatial' | 'topological' | 'causal_rule_based' | 'ml_gnn_refinement' | 'llm_semantic' | 'dynamic_rule';

export interface BaseRule {
  id: string;
  name: string;
  description: string;
  priority?: number;
  status: 'active' | 'inactive';
  frequency?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface DeduplicationRule extends BaseRule {
  type: DeduplicationRuleType;
  timeWindow: number;
  fields: string[];
  matchCount?: number;
  // Legacy config support if needed, but we are moving to flat properties mostly
  config?: any;
}

export interface SuppressionRule extends BaseRule {
  type: SuppressionRuleType;
  affectedDevices?: string[];
  schedule: Record<string, any>;
  suppressCount?: number;
  config?: any;
}

export interface CorrelationRule extends BaseRule {
  type: CorrelationRuleType;
  mlEnabled: boolean;
  gnnEnabled: boolean;
  config: Record<string, any>;
}

// Knowledge Base Types
export interface KBArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string; // Brief summary
  problem: string;
  area: string;
  remedyItems: string[];
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
  logPatterns: IntentLogPattern[];
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
  situationDesc?: string;
}

export interface IntentFull {
  _id?: { $oid: string };
  id: string;
  intent: string;
  subIntent: string;
  domain: string;
  function: string;
  description: string;
  keywords: string[];
  signals: IntentSignal[];
  hypotheses: IntentHypothesis[];
  situationDesc: string;
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
