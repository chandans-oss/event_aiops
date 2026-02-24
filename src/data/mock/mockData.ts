import { Cluster, DeduplicationRule, SuppressionRule, CorrelationRule, KBArticle, Intent, FlowStage, IntentFull } from '@/shared/types';
// Force refresh


// ============= Link Congestion Use Case Data =============

// Link Congestion Intent Definition (Full)
export const linkCongestionIntent: IntentFull = {
  _id: { $oid: '69381e8e2c85e919f6139300' },
  id: 'performance.congestion',
  intent: 'performance',
  subIntent: 'congestion',
  domain: 'Network',
  function: 'Link Layer',
  description: 'Interface congestion detected with high utilization and queue drops',
  keywords: ['congestion', 'queue drop', 'buffer full', 'tail drop', 'backup', 'rsync'],
  signals: [
    { metric: 'utilizationPercent', op: '>', value: 90, weight: 0.5 },
    { metric: 'outDiscards', op: '>', value: 0, weight: 0.4 }
  ],
  hypotheses: [
    {
      id: 'H_QOS_CONGESTION',
      description: 'QOS_CONGESTION - High utilization and queue discards',
      signals: [
        { metric: 'utilizationPercent', op: '>', value: 90, weight: 0.5 },
        { metric: 'outDiscards', op: '>', value: 0, weight: 0.4 }
      ],
      logPatterns: [
        { keyword: 'tail drop', weight: 0.3 },
        { keyword: 'buffer full', weight: 0.3 },
        { keyword: 'queue full', weight: 0.3 }
      ]
    },
    {
      id: 'H_PEAK_TRAFFIC',
      description: 'Peak-hour usage causing congestion',
      signals: [
        { metric: 'utilizationPercent', op: '>', value: 85, weight: 0.4 }
      ],
      logPatterns: [
        { keyword: 'traffic spike', weight: 0.2 }
      ]
    },
    {
      id: 'H_BACKUP_TRAFFIC',
      description: 'Backup using default DSCP0 traffic',
      signals: [
        { metric: 'trafficDscp0Percent', op: '>', value: 50, weight: 0.4 },
        { metric: 'utilizationPercent', op: '>', value: 85, weight: 0.4 }
      ],
      logPatterns: [
        { keyword: 'backup', weight: 0.3 },
        { keyword: 'replication', weight: 0.3 },
        { keyword: 'scheduled backup', weight: 0.2 }
      ]
    }
  ],
  situationDesc: 'Backup traffic detected on {device} through link, with {utilizationPercent}% utilization and {trafficDscp0Percent}% DSCP0 share. Top hypothesis: {top_hypothesis} (score={prior}).'
};

// Raw Performance Metrics from Link Congestion
export const linkCongestionMetrics = [
  { timestamp: '2025-10-28T14:10:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 30, inErrors: 0, outDiscards: 0, latencyMs: 5, packetLossPercent: 0, trafficDscp0Percent: 23 },
  { timestamp: '2025-10-28T14:15:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 45, inErrors: 0, outDiscards: 10, latencyMs: 10, packetLossPercent: 0, trafficDscp0Percent: 34 },
  { timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 60, inErrors: 5, outDiscards: 80, latencyMs: 25, packetLossPercent: 0.1, trafficDscp0Percent: 35 },
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 82, inErrors: 10, outDiscards: 300, latencyMs: 300, packetLossPercent: 0.3, trafficDscp0Percent: 68 },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 96, inErrors: 20, outDiscards: 500, latencyMs: 500, packetLossPercent: 1.2, trafficDscp0Percent: 76 },
  { timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilizationPercent: 98, inErrors: 25, outDiscards: 100, latencyMs: 120, packetLossPercent: 1.5, trafficDscp0Percent: 55 },
];

// Device Metrics
export const linkCongestionDeviceMetrics = [
  { timestamp: '2025-10-28T14:10:00Z', device: 'core-router-dc1', cpuPercent: 40, memPercent: 60, tempC: 38 },
  { timestamp: '2025-10-28T14:15:00Z', device: 'core-router-dc1', cpuPercent: 55, memPercent: 65, tempC: 39 },
  { timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', cpuPercent: 65, memPercent: 68, tempC: 40 },
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', cpuPercent: 75, memPercent: 70, tempC: 43 },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', cpuPercent: 85, memPercent: 75, tempC: 45 },
  { timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', cpuPercent: 88, memPercent: 77, tempC: 46 },
];

// Syslog Events
export const linkCongestionSyslogEvents = [
  { timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', resource: 'device', severity: 'info', message: 'Backup job started on agent-server-01 and tail drop observed' },
  { timestamp: '2025-10-28T14:21:30Z', device: 'core-router-dc1', resource: 'device', severity: 'info', message: 'Backup traffic detected on Gi0/1/0 (source: agent-server-01, destination: backup-server-02)' },
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', severity: 'warning', message: 'Interface Gi0/1/0 output queue full' },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', resource: 'device', severity: 'critical', message: 'CPU utilization crossed 85% threshold' },
];

// SNMP Traps
export const linkCongestionSnmpTraps = [
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', trapType: 'linkCongestion', severity: 'major', description: 'Interface congestion threshold exceeded' },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', resource: 'core-router-dc1', trapType: 'highCPU', severity: 'major', description: 'CPU above 80% threshold' },
];

// Normalized Events after Pre-processing
export const linkCongestionNormalizedEvents = [
  { id: 'EVT-LC-001', timestamp: '2025-10-28T14:10:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Utilization', severity: 'Minor', message: 'Interface Gi0/1/0 utilization at 30%.' },
  { id: 'EVT-LC-002', timestamp: '2025-10-28T14:15:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Utilization', severity: 'Major', message: 'Interface Gi0/1/0 utilization reached 45%.' },
  { id: 'EVT-LC-003', timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Packet Drops', severity: 'Major', message: 'Input packet drops observed on Gi0/1/0.' },
  { id: 'EVT-LC-004', timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', resource: 'CPU', type: 'CPU Utilization', severity: 'Minor', message: 'CPU usage at 65%.' },
  { id: 'EVT-LC-005', timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Utilization', severity: 'Major', message: 'Interface Gi0/1/0 utilization exceeded 80%.' },
  { id: 'EVT-LC-006', timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Latency', severity: 'Major', message: 'Latency increased to 300 ms.' },
  { id: 'EVT-LC-007', timestamp: '2025-10-28T14:26:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Input Errors', severity: 'Minor', message: 'CRC errors detected on Gi0/1/0.' },
  { id: 'EVT-LC-008', timestamp: '2025-10-28T14:27:00Z', device: 'core-router-dc1', resource: 'CPU', type: 'CPU Utilization', severity: 'Major', message: 'CPU usage reached 85%.' },
  { id: 'EVT-LC-009', timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Discard Packets', severity: 'Critical', message: 'Output packet discards on Gi0/1/0.' },
  { id: 'EVT-LC-010', timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Utilization', severity: 'Critical', message: 'Interface Gi0/1/0 utilization at 96%.' },
  { id: 'EVT-LC-011', timestamp: '2025-10-28T14:31:00Z', device: 'core-router-dc1', resource: 'Ping Monitor', type: 'Latency', severity: 'Critical', message: 'Latency to peer router 500 ms.' },
  { id: 'EVT-LC-012', timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', type: 'Utilization', severity: 'Minor', message: 'Interface Gi0/1/0 utilization normalized to 65%.' },
  { id: 'EVT-LC-013', timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', resource: 'CPU', type: 'CPU Utilization', severity: 'Minor', message: 'CPU load reduced to 40%.' },
];

// NetFlow Data
export const linkCongestionNetflowData = [
  { timestamp: '2025-10-28T14:20:00Z', srcIp: '10.1.10.5', dstIp: '10.2.20.10', bytes: 500000000, packets: 120000, application: 'agent-server-01' },
  { timestamp: '2025-10-28T14:25:00Z', srcIp: '10.1.10.5', dstIp: '10.2.20.10', bytes: 850000000, packets: 200000, application: 'agent-server-01' },
];

// Link Congestion RCA Details
export const linkCongestionRCADetails = {
  clusterId: 'CLU-LC-001',
  rootCause: 'Backup-Induced Congestion: Unscheduled NFS backup traffic from agent-server-01 consuming >35% link capacity during business hours',
  confidence: 0.93,
  topHypothesis: 'H_BACKUP_TRAFFIC',
  matchedSignals: [
    { metric: 'utilizationPercent', actual: 96, threshold: 90, matched: true },
    { metric: 'outDiscards', actual: 500, threshold: 0, matched: true },
    { metric: 'trafficDscp0Percent', actual: 76, threshold: 50, matched: true },
  ],
  matchedLogPatterns: [
    { keyword: 'backup', found: true, source: 'syslog' },
    { keyword: 'tail drop', found: true, source: 'syslog' },
    { keyword: 'queue full', found: true, source: 'syslog' },
  ],
  correlationMethods: ['Temporal', 'Causal', 'TopK Flow Attribution'],
};

// Remediation Actions for Link Congestion
export const linkCongestionRemediationActions = [
  { id: 'REM-LC-001', action: 'QoS Throttle', description: 'Throttle VLAN 200 backup traffic to 200 Mbps', status: 'completed', automated: true },
  { id: 'REM-LC-002', action: 'Reschedule Backup', description: 'Reschedule backup jobs to 01:00-04:00 window', status: 'pending', automated: false },
  { id: 'REM-LC-003', action: 'Add Guardrails', description: 'Add automation guardrails to prevent future incidents', status: 'pending', automated: false },
];

// KPIs Before/After Remediation
export const linkCongestionKpiComparison = {
  before: { latencyMs: 170, packetLossPct: 1.3, queueDropsPct: 2.5, mttdSeconds: 180, mttrMinutes: 20 },
  after: { latencyMs: 35, packetLossPct: 0.2, queueDropsPct: 0.1, mttdSeconds: 45, mttrMinutes: 6 },
};

// Gap Analysis for Architecture Evaluation
export const architectureGapAnalysis = [
  {
    category: 'Data Collection',
    gaps: [
      { issue: 'No real-time NetFlow integration', severity: 'high', recommendation: 'Integrate streaming NetFlow/sFlow collector for immediate flow visibility' },
      { issue: 'Missing DSCP marking data in metrics', severity: 'medium', recommendation: 'Add QoS class breakdown to interface metrics' },
    ]
  },
  {
    category: 'Correlation Engine',
    gaps: [
      { issue: 'No automatic topology discovery', severity: 'medium', recommendation: 'Integrate GNN-based topology correlation for multi-hop analysis' },
      { issue: 'Limited cross-domain correlation', severity: 'high', recommendation: 'Add correlation between network events and application performance metrics' },
    ]
  },
  {
    category: 'RCA Engine',
    gaps: [
      { issue: 'Static threshold-based hypothesis matching', severity: 'medium', recommendation: 'Implement ML-based dynamic thresholds using EWMA/STL' },
      { issue: 'No confidence scoring history', severity: 'low', recommendation: 'Track RCA accuracy over time to improve confidence calculation' },
    ]
  },
  {
    category: 'Remediation',
    gaps: [
      { issue: 'Limited auto-remediation capabilities', severity: 'high', recommendation: 'Add playbook execution for approved remediation actions' },
      { issue: 'No rollback mechanism', severity: 'medium', recommendation: 'Implement automated rollback if remediation causes degradation' },
    ]
  },
  {
    category: 'Intent Management',
    gaps: [
      { issue: 'Manual intent definition', severity: 'medium', recommendation: 'Add ML-assisted intent discovery from historical incidents' },
      { issue: 'No intent versioning', severity: 'low', recommendation: 'Track intent changes and their impact on RCA accuracy' },
    ]
  },
];

// ============= Main Mock Data =============

export const mockClusters: Cluster[] = [
  // Link Congestion Use Case Cluster (First)
  {
    id: 'CLU-LC-001',
    rootEvent: {
      id: 'EVT-LC-010',
      alertType: 'LINK_CONGESTION',
      source: 'core-router-dc1',
      severity: 'Critical',
      timestamp: '2025-10-28T14:30:00Z',
      message: 'Interface Gi0/1/0 utilization at 96% with queue drops',
      label: 'Root'
    },
    childEvents: [
      {
        id: 'EVT-LC-009',
        alertType: 'PACKET_DISCARD',
        source: 'core-router-dc1',
        severity: 'Critical',
        timestamp: '2025-10-28T14:30:00Z',
        correlationScore: 0.95,
        message: 'Output packet discards on Gi0/1/0',
        label: 'Child'
      },
      {
        id: 'EVT-LC-011',
        alertType: 'HIGH_LATENCY',
        source: 'core-router-dc1',
        severity: 'Critical',
        timestamp: '2025-10-28T14:31:00Z',
        correlationScore: 0.92,
        message: 'Latency to peer router 500 ms',
        label: 'Child'
      },
      {
        id: 'evt_007',
        alertType: 'LINK_DOWN',
        source: 'Edge-S10',
        severity: 'Critical',
        timestamp: '2025-12-26T10:01:22Z',
        correlationScore: 0.85,
        message: 'Uplink to Dist-R4 failed',
        label: 'Child'
      }
    ],
    affectedServices: ['api-gateway', 'web-app', 'database-primary', 'backup-service'],
    affectedUsers: 2500,
    status: 'Active',
    createdAt: '2025-10-28T14:25:00Z',
    duration: '25m 00s',
    duplicateCount: 5,
    suppressedCount: 2,
    rca: {
      rootCause: 'Backup-Induced Congestion: Unscheduled NFS backup traffic from agent-server-01 consuming >35% link capacity during business hours',
      confidence: 0.93,
      hypotheses: ['H_BACKUP_TRAFFIC', 'H_QOS_CONGESTION', 'H_PEAK_TRAFFIC']
    }
  },
  {
    id: 'CLU-12345',
    rootEvent: {
      id: 'EVT-001',
      alertType: 'DB_CONNECTION_FAILED',
      source: 'db-server-01',
      severity: 'Critical',
      timestamp: '2026-01-05T14:30:00Z',
      message: 'Database connection pool exhausted - max connections reached',
      label: 'Root'
    },
    childEvents: [
      {
        id: 'EVT-002',
        alertType: 'API_TIMEOUT',
        source: 'api-gateway-01',
        severity: 'Major',
        timestamp: '2026-01-05T14:30:03Z',
        correlationScore: 0.92,
        message: 'API request timeout after 30s',
        label: 'Child'
      }
    ],
    affectedServices: ['web-app', 'api-gateway', 'auth-service', 'payment-service'],
    affectedUsers: 2500,
    status: 'Active',
    createdAt: '2026-01-05T14:30:00Z',
    duration: '5m 42s',
    duplicateCount: 12,
    suppressedCount: 3,
    rca: {
      rootCause: 'Database connection pool exhaustion due to connection leak in payment service',
      confidence: 0.88,
      hypotheses: ['H_DB_CONNECTION_LEAK', 'H_HIGH_TRAFFIC_SPIKE', 'H_SLOW_QUERY']
    }
  },
  {
    id: 'CLU-12346',
    rootEvent: {
      id: 'EVT-010',
      alertType: 'DISK_FULL',
      source: 'storage-node-03',
      severity: 'Major',
      timestamp: '2026-01-05T13:15:00Z',
      message: 'Disk usage exceeded 95% threshold'
    },
    childEvents: [],
    affectedServices: ['logging-service', 'metrics-collector'],
    affectedUsers: 0,
    status: 'Resolved',
    createdAt: '2026-01-05T13:15:00Z',
    duration: '45m 12s',
    rca: {
      rootCause: 'Log rotation failed causing disk space exhaustion',
      confidence: 0.92,
      hypotheses: ['H_LOG_ROTATION_FAILURE', 'H_LARGE_FILE_UPLOAD']
    }
  },
  {
    id: 'CLU-12347',
    rootEvent: {
      id: 'EVT-020',
      alertType: 'NETWORK_LATENCY',
      source: 'router-dc-east-01',
      severity: 'Major',
      timestamp: '2026-01-05T12:00:00Z',
      message: 'Network latency spike detected - BGP route flapping'
    },
    childEvents: [],
    affectedServices: ['cdn-service', 'api-east'],
    affectedUsers: 850,
    status: 'Active',
    createdAt: '2026-01-05T12:00:00Z',
    duration: '2h 30m',
    rca: {
      rootCause: 'Network congestion due to BGP route flapping on ISP-A peer',
      confidence: 0.75,
      hypotheses: ['H_BGP_FLAP', 'H_ISP_ISSUE']
    }
  },
  {
    id: 'CLU-12348',
    rootEvent: {
      id: 'EVT-030',
      alertType: 'MEMORY_EXHAUSTION',
      source: 'app-server-05',
      severity: 'Critical',
      timestamp: '2026-01-05T10:45:00Z',
      message: 'JVM heap memory at 98% - OOM imminent'
    },
    childEvents: [
      {
        id: 'EVT-050',
        alertType: 'CPU_SPIKE',
        source: 'worker-node-12',
        severity: 'Minor',
        timestamp: '2026-01-05T08:30:00Z',
        correlationScore: 0.82,
        message: 'CPU utilization spiked to 95%',
        label: 'Child'
      }
    ],
    affectedServices: ['order-processing', 'inventory-check'],
    affectedUsers: 1200,
    status: 'Pending',
    createdAt: '2026-01-05T10:45:00Z',
    duration: '15m 22s',
    rca: {
      rootCause: 'Memory leak in pricing calculation module causing cascading GC overhead',
      confidence: 0.82,
      hypotheses: ['H_MEMORY_LEAK', 'H_CACHE_OVERFLOW']
    }
  },
  {
    id: 'CLU-12349',
    rootEvent: {
      id: 'EVT-040',
      alertType: 'SSL_CERT_EXPIRY',
      source: 'proxy-ssl-01',
      severity: 'Major',
      timestamp: '2026-01-05T09:00:00Z',
      message: 'SSL certificate expires in 24 hours'
    },
    childEvents: [],
    affectedServices: ['https-gateway'],
    affectedUsers: 0,
    status: 'Active',
    createdAt: '2026-01-05T09:00:00Z',
    duration: '5h 30m',
    rca: {
      rootCause: 'Certificate auto-renewal process failed due to DNS validation timeout',
      confidence: 0.95,
      hypotheses: ['H_CERT_RENEWAL_FAILURE']
    }
  },
  {
    id: 'CLU-003',
    rootEvent: {
      id: 'evt_011',
      alertType: 'POWER_SUPPLY_FAIL',
      source: 'Core-R2',
      severity: 'Critical',
      timestamp: '2025-12-26T10:02:00Z',
      message: 'PSU-1 failed',
      label: 'Root'
    },
    childEvents: [
      {
        id: 'evt_012',
        alertType: 'PORT_ERROR',
        source: 'Core-R2',
        severity: 'Major',
        timestamp: '2025-12-26T10:02:05Z',
        correlationScore: 0.89,
        message: 'Gi0/2/0 CRC errors',
        label: 'Child'
      }
    ],
    affectedServices: ['Auth-API', 'User-DB'],
    affectedUsers: 1500,
    status: 'Active',
    createdAt: '2025-12-26T10:02:00Z',
    duration: '21d',
    rca: {
      rootCause: 'Hardware Failure: Primary Power Supply Unit (PSU-1) failed on Core-R2 causing electrical instability.',
      confidence: 0.97,
      hypotheses: ['H_PSU_FAILURE']
    }
  },
  {
    id: 'CLU-NET-004',
    rootEvent: {
      id: 'EVT-NET-004-1',
      alertType: 'LINK_CONGESTION',
      source: 'Dist-Switch-02',
      severity: 'Critical',
      timestamp: '2026-02-18T08:00:00Z',
      message: 'Interface Et0/0 utilization > 90% for 5 mins',
      label: 'Root'
    },
    childEvents: [
      {
        id: 'EVT-NET-004-2',
        alertType: 'PACKET_DISCARD',
        source: 'Dist-Switch-02',
        severity: 'Major',
        timestamp: '2026-02-18T08:05:00Z',
        correlationScore: 0.98,
        message: 'Input queue drops on Et0/0',
        label: 'Child'
      },
      {
        id: 'EVT-NET-004-3',
        alertType: 'LINK_FLAP',
        source: 'Dist-Switch-02',
        severity: 'Critical',
        timestamp: '2026-02-18T08:08:00Z',
        correlationScore: 0.99,
        message: 'Interface Et0/0 changed state to Down',
        label: 'Child'
      }
    ],
    affectedServices: ['Internal-Wifi', 'VoIP-Gateway'],
    affectedUsers: 450,
    status: 'Active',
    createdAt: '2026-02-18T08:00:00Z',
    duration: '15m',
    duplicateCount: 3,
    suppressedCount: 1,
    rca: {
      rootCause: '[Pattern Recognized]: Congestion Buildup Before Interface Flap - Recognized highly correlated sequence indicating potential hardware buffer exhaustion.',
      confidence: 0.99,
      hypotheses: ['H_PATTERN_MATCH_CONGESTION_FLAP', 'H_CABLE_FAULT']
    }
  }
];

export const mockFlowStages: FlowStage[] = [
  { id: 'preprocessing', label: 'Event Pre-Processing', status: 'complete', count: 15433, path: '/preprocessing' },
  { id: 'clustering', label: 'Event Clustering', status: 'complete', count: 7, path: '/clustering' },
  { id: 'rca-impact', label: 'RCA & Impact', status: 'active', count: 5, path: '/rca-impact' },
  { id: 'remediation', label: 'Remediation', status: 'pending', count: 3, path: '/remediation' },
];

export const mockDeduplicationRules: DeduplicationRule[] = [
  {
    id: 'dedup-001',
    type: 'exact_match',
    name: 'Exact Match Deduplication',
    description: 'Deduplicate events with same source, alert type, severity, and message.',
    priority: 1,
    status: 'active',
    timeWindow: 300,
    fields: ['source', 'alertType', 'severity', 'message'],
    createdAt: '2025-10-01T00:00:00Z',
    modifiedAt: '2025-10-01T00:00:00Z',
    matchCount: 15420
  },
  {
    id: 'dedup-002',
    type: 'time_window',
    name: 'Time-Window Deduplication',
    description: 'Keep first alert, suppress duplicates within X minutes window.',
    priority: 2,
    status: 'active',
    timeWindow: 600,
    fields: ['source', 'alertType'],
    createdAt: '2025-10-02T00:00:00Z',
    modifiedAt: '2025-10-02T00:00:00Z',
    matchCount: 8500
  },
  {
    id: 'dedup-003',
    type: 'source_based',
    name: 'Source-Based Deduplication',
    description: 'Ensure only one active alert exists per host/service/component for specific check types.',
    priority: 3,
    status: 'active',
    timeWindow: 0,
    fields: ['source'],
    createdAt: '2025-10-03T00:00:00Z',
    modifiedAt: '2025-10-03T00:00:00Z',
    matchCount: 3200
  }
];

export const mockSuppressionRules: SuppressionRule[] = [
  {
    id: 'sup-001',
    type: 'maintenance',
    name: 'Maintenance Suppression',
    description: 'Suppress all events for devices currently under scheduled maintenance windows.',
    status: 'active',
    schedule: { type: 'maintenance_window' }
  },
  {
    id: 'sup-002',
    type: 'business_hours',
    name: 'Business Hours Suppression',
    description: 'Suppress low-severity events outside of defined business hours (09:00 - 18:00).',
    status: 'active',
    schedule: { type: 'weekly', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '18:00', end: '09:00' }
  },
  {
    id: 'sup-003',
    type: 'reboot_pattern',
    name: 'Reboot Pattern Suppression',
    description: 'Suppress known noise and transient alerts detected during device reboot sequence (Grace period).',
    status: 'active',
    schedule: { type: 'event_triggered', trigger: 'sys.reboot' }
  },
  {
    id: 'sup-004',
    type: 'time_based',
    name: 'Time-Based Suppression',
    description: 'Suppress alerts that do not repeat or persist within a defined interval (Transient noise).',
    status: 'active',
    schedule: { type: 'interval', duration: '5m' },
    createdAt: '2025-11-12T00:00:00Z',
    modifiedAt: '2025-11-12T00:00:00Z',
    suppressCount: 230
  }
];

export const mockCorrelationRules: CorrelationRule[] = [
  {
    id: 'cor-001',
    type: 'temporal',
    name: 'Temporal Correlation',
    description: 'Correlate events occurring within a defined rolling time window across any source.',
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    config: { timeWindowSeconds: 300 }
  },
  {
    id: 'cor-002',
    type: 'spatial',
    name: 'Spatial Correlation',
    description: 'Group events by location: Same host, service, region, or datacenter.',
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    config: { groupingCriteria: ['datacenter', 'rack', 'region'] }
  },
  {
    id: 'cor-003',
    type: 'topological',
    name: 'Topological Correlation',
    description: 'Correlate events based on dependency graph.',
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    config: { traceDepth: 3 }
  },
  {
    id: 'cor-004',
    type: 'causal_rule_based',
    name: 'Causal / Rule-based Correlation',
    description: 'Apply domain-specific heuristics and expert rules for grouping.',
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    config: { ruleset: 'standard_ops' }
  },
  {
    id: 'cor-007',
    type: 'dynamic_rule',
    name: 'Dynamic Rule Correlation',
    description: 'Use pattern and behavior-based analysis to correlate dynamic events on the fly.',
    status: 'active',
    mlEnabled: true,
    gnnEnabled: false,
    config: { behaviorAnalysis: true }
  },
  {
    id: 'cor-005',
    type: 'ml_gnn_refinement',
    name: 'ML / GNN Refinement',
    description: 'Graph Neural Network learning propagation patterns on nodes=events, edges=topology/causal.',
    status: 'active',
    mlEnabled: true,
    gnnEnabled: true,
    config: { traceDepth: 5, modelVersion: 'v2.4' }
  },
  {
    id: 'cor-006',
    type: 'llm_semantic',
    name: 'Semantic Synthesis',
    description: 'Use large language models to synthesize cross-domain alerts based on semantic meaning.',
    status: 'active',
    mlEnabled: true,
    gnnEnabled: false,
    config: { model: 'gpt-4-turbo', temperature: 0.1 }
  }
];

export const mockKBArticles: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'Resolving Database Connection Pool Exhaustion',
    category: 'Database',
    content: 'This article covers the diagnosis and remediation of database connection pool exhaustion issues...',
    problem: 'Database connection pool exhausted - max connections reached.',
    area: 'Database Connections',
    remedyItems: [
      'Identify and fix connection leaks in the application code.',
      'Increase the maximum allowed database connections if resources permit.',
      'Implement connection pooling and ensure connections are closed properly.'
    ],
    tags: ['database', 'connection-pool', 'performance'],
    linkedIntents: ['link.db_connection', 'link.pool_exhaustion'],
    lastUpdated: '2026-01-02T00:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-002',
    title: 'Handling High CPU Utilization on Application Servers',
    category: 'Performance',
    content: 'Steps to diagnose and resolve high CPU issues on application servers...',
    problem: 'Application server CPU utilization crosses critical threshold.',
    area: 'Application Servers',
    remedyItems: [
      'Profile the application to identify CPU-intensive methods.',
      'Scale out the application server cluster.',
      'Optimize application code (e.g., fix infinite loops or heavy regex).'
    ],
    tags: ['cpu', 'performance', 'application'],
    linkedIntents: ['link.cpu_spike', 'link.performance_degradation'],
    lastUpdated: '2025-12-28T00:00:00Z',
    effectiveness: 88
  },
  {
    id: 'kb-003',
    title: 'Network Latency Troubleshooting Guide',
    category: 'Network',
    content: 'Comprehensive guide to diagnosing network latency issues...',
    problem: 'Network latency spikes affecting application performance.',
    area: 'Network Infrastructure',
    remedyItems: [
      'Check BGP route stability and reset peering if flapping occurs.',
      'Investigate network path for congestion or hardware faults.',
      'Coordinate with ISP for external connectivity issues.'
    ],
    tags: ['network', 'latency', 'troubleshooting'],
    linkedIntents: ['link.network_latency', 'link.packet_loss'],
    lastUpdated: '2025-12-20T00:00:00Z',
    effectiveness: 85
  },
  {
    id: 'kb-004',
    title: 'Link Congestion and QoS Troubleshooting',
    category: 'Network',
    content: 'Guide for diagnosing and resolving interface congestion issues caused by backup traffic, DSCP0 traffic floods, and queue drops. Includes QoS policy recommendations and traffic shaping strategies.',
    problem: 'Interface congestion with high utilization and queue drops.',
    area: 'Network Interfaces',
    remedyItems: [
      'Throttle backup traffic or reschedule backups to off-peak hours.',
      'Implement or adjust QoS policies to prioritize critical traffic.',
      'Upgrade link capacity if congestion is due to overall traffic growth.'
    ],
    tags: ['congestion', 'qos', 'backup', 'queue-drops', 'dscp', 'traffic-shaping'],
    linkedIntents: ['performance.congestion', 'link.network_latency'],
    lastUpdated: '2025-10-30T00:00:00Z',
    effectiveness: 93
  }
];

export const mockIntents: Intent[] = [
  {
    id: 'link.db_connection',
    name: 'Database Connection Issues',
    subIntent: 'connection_failure',
    domain: 'Database',
    function: 'Connection Management',
    description: 'Detects database connection failures and pool exhaustion',
    keywords: ['connection', 'pool', 'timeout', 'database'],
    hypotheses: ['H_DB_CONNECTION_LEAK', 'H_MAX_CONNECTIONS', 'H_NETWORK_ISSUE'],
    signals: [
      { metric: 'connection_count', op: '>', value: 100, weight: 0.5 },
      { metric: 'connection_wait_time', op: '>', value: 5000, weight: 0.3 }
    ]
  },
  {
    id: 'link.cpu_spike',
    name: 'CPU Utilization Spike',
    subIntent: 'high_cpu',
    domain: 'Performance',
    function: 'Resource Monitoring',
    description: 'Identifies abnormal CPU utilization patterns',
    keywords: ['cpu', 'utilization', 'spike', 'performance'],
    hypotheses: ['H_REGEX_BACKTRACK', 'H_INFINITE_LOOP', 'H_MEMORY_PRESSURE'],
    signals: [
      { metric: 'cpuPercent', op: '>', value: 90, weight: 0.6 },
      { metric: 'load_average', op: '>', value: 4, weight: 0.4 }
    ]
  },
  {
    id: 'performance.congestion',
    name: 'Link Congestion',
    subIntent: 'congestion',
    domain: 'Network',
    function: 'Link Layer',
    description: 'Interface congestion with high utilization and queue drops',
    keywords: ['congestion', 'queue drop', 'buffer full', 'tail drop', 'backup', 'rsync'],
    hypotheses: ['H_BACKUP_TRAFFIC', 'H_QOS_CONGESTION', 'H_PEAK_TRAFFIC'],
    signals: [
      { metric: 'utilizationPercent', op: '>', value: 90, weight: 0.5 },
      { metric: 'outDiscards', op: '>', value: 0, weight: 0.4 }
    ]
  },
  {
    id: 'link.network_latency',
    name: 'Network Latency Issues',
    subIntent: 'high_latency',
    domain: 'Network',
    function: 'Performance Monitoring',
    description: 'Detects abnormal network latency patterns',
    keywords: ['latency', 'delay', 'slow', 'timeout'],
    hypotheses: ['H_BGP_FLAP', 'H_CONGESTION', 'H_ISP_ISSUE'],
    signals: [
      { metric: 'latencyMs', op: '>', value: 100, weight: 0.6 },
      { metric: 'packetLossPercent', op: '>', value: 1, weight: 0.4 }
    ]
  }
];

export const processingStats = {
  totalEvents: 15433,
  normalized: 15393,
  deduplicated: 8933,
  suppressed: 1263,
  clustered: 7,
  errors: 40
};
