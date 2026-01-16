import { Cluster, DeduplicationRule, SuppressionRule, CorrelationRule, KBArticle, Intent, FlowStage, IntentFull } from '@/types';

// ============= Link Congestion Use Case Data =============

// Link Congestion Intent Definition (Full)
export const linkCongestionIntent: IntentFull = {
  _id: { $oid: '69381e8e2c85e919f6139300' },
  id: 'performance.congestion',
  intent: 'performance',
  subintent: 'congestion',
  domain: 'Network',
  function: 'Link Layer',
  description: 'Interface congestion detected with high utilization and queue drops',
  keywords: ['congestion', 'queue drop', 'buffer full', 'tail drop', 'backup', 'rsync'],
  signals: [
    { metric: 'utilization_percent', op: '>', value: 90, weight: 0.5 },
    { metric: 'out_discards', op: '>', value: 0, weight: 0.4 }
  ],
  hypotheses: [
    {
      id: 'H_QOS_CONGESTION',
      description: 'QOS_CONGESTION - High utilization and queue discards',
      signals: [
        { metric: 'utilization_percent', op: '>', value: 90, weight: 0.5 },
        { metric: 'out_discards', op: '>', value: 0, weight: 0.4 }
      ],
      log_patterns: [
        { keyword: 'tail drop', weight: 0.3 },
        { keyword: 'buffer full', weight: 0.3 },
        { keyword: 'queue full', weight: 0.3 }
      ]
    },
    {
      id: 'H_PEAK_TRAFFIC',
      description: 'Peak-hour usage causing congestion',
      signals: [
        { metric: 'utilization_percent', op: '>', value: 85, weight: 0.4 }
      ],
      log_patterns: [
        { keyword: 'traffic spike', weight: 0.2 }
      ]
    },
    {
      id: 'H_BACKUP_TRAFFIC',
      description: 'Backup using default DSCP0 traffic',
      signals: [
        { metric: 'traffic_dscp0_percent', op: '>', value: 50, weight: 0.4 },
        { metric: 'utilization_percent', op: '>', value: 85, weight: 0.4 }
      ],
      log_patterns: [
        { keyword: 'backup', weight: 0.3 },
        { keyword: 'replication', weight: 0.3 },
        { keyword: 'scheduled backup', weight: 0.2 }
      ]
    }
  ],
  situation_desc: 'Backup traffic detected on {device} through link, with {utilization_percent}% utilization and {traffic_dscp0_percent}% DSCP0 share. Top hypothesis: {top_hypothesis} (score={prior}).'
};

// Raw Performance Metrics from Link Congestion
export const linkCongestionMetrics = [
  { timestamp: '2025-10-28T14:10:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 30, in_errors: 0, out_discards: 0, latency_ms: 5, packet_loss_percent: 0, traffic_dscp0_percent: 23 },
  { timestamp: '2025-10-28T14:15:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 45, in_errors: 0, out_discards: 10, latency_ms: 10, packet_loss_percent: 0, traffic_dscp0_percent: 34 },
  { timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 60, in_errors: 5, out_discards: 80, latency_ms: 25, packet_loss_percent: 0.1, traffic_dscp0_percent: 35 },
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 82, in_errors: 10, out_discards: 300, latency_ms: 300, packet_loss_percent: 0.3, traffic_dscp0_percent: 68 },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 96, in_errors: 20, out_discards: 500, latency_ms: 500, packet_loss_percent: 1.2, traffic_dscp0_percent: 76 },
  { timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', interface: 'Gi0/1/0', utilization_percent: 98, in_errors: 25, out_discards: 100, latency_ms: 120, packet_loss_percent: 1.5, traffic_dscp0_percent: 55 },
];

// Device Metrics
export const linkCongestionDeviceMetrics = [
  { timestamp: '2025-10-28T14:10:00Z', device: 'core-router-dc1', cpu_percent: 40, mem_percent: 60, temp_c: 38 },
  { timestamp: '2025-10-28T14:15:00Z', device: 'core-router-dc1', cpu_percent: 55, mem_percent: 65, temp_c: 39 },
  { timestamp: '2025-10-28T14:20:00Z', device: 'core-router-dc1', cpu_percent: 65, mem_percent: 68, temp_c: 40 },
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', cpu_percent: 75, mem_percent: 70, temp_c: 43 },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', cpu_percent: 85, mem_percent: 75, temp_c: 45 },
  { timestamp: '2025-10-28T14:35:00Z', device: 'core-router-dc1', cpu_percent: 88, mem_percent: 77, temp_c: 46 },
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
  { timestamp: '2025-10-28T14:25:00Z', device: 'core-router-dc1', resource: 'Gi0/1/0', trap_type: 'linkCongestion', severity: 'major', description: 'Interface congestion threshold exceeded' },
  { timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', resource: 'core-router-dc1', trap_type: 'highCPU', severity: 'major', description: 'CPU above 80% threshold' },
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
  { timestamp: '2025-10-28T14:20:00Z', src_ip: '10.1.10.5', dst_ip: '10.2.20.10', bytes: 500000000, packets: 120000, application: 'agent-server-01' },
  { timestamp: '2025-10-28T14:25:00Z', src_ip: '10.1.10.5', dst_ip: '10.2.20.10', bytes: 850000000, packets: 200000, application: 'agent-server-01' },
];

// Link Congestion RCA Details
export const linkCongestionRCADetails = {
  clusterId: 'CLU-LC-001',
  rootCause: 'Backup-Induced Congestion: Unscheduled NFS backup traffic from agent-server-01 consuming >35% link capacity during business hours',
  confidence: 0.93,
  topHypothesis: 'H_BACKUP_TRAFFIC',
  matchedSignals: [
    { metric: 'utilization_percent', actual: 96, threshold: 90, matched: true },
    { metric: 'out_discards', actual: 500, threshold: 0, matched: true },
    { metric: 'traffic_dscp0_percent', actual: 76, threshold: 50, matched: true },
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
  before: { latency_ms: 170, packet_loss_pct: 1.3, queue_drops_pct: 2.5, mttd_seconds: 180, mttr_minutes: 20 },
  after: { latency_ms: 35, packet_loss_pct: 0.2, queue_drops_pct: 0.1, mttd_seconds: 45, mttr_minutes: 6 },
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
        id: 'EVT-LC-008',
        alertType: 'CPU_HIGH',
        source: 'core-router-dc1',
        severity: 'Major',
        timestamp: '2025-10-28T14:27:00Z',
        correlationScore: 0.88,
        message: 'CPU usage reached 85%',
        label: 'Child'
      },
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
      },
      {
        id: 'EVT-003',
        alertType: 'WEB_5XX_ERROR',
        source: 'web-server-01',
        severity: 'Major',
        timestamp: '2026-01-05T14:30:05Z',
        correlationScore: 0.88,
        message: 'HTTP 503 Service Unavailable',
        label: 'Child'
      },
    ],
    affectedServices: ['web-app', 'api-gateway', 'auth-service', 'payment-service', 'user-service', 'notification-service', 'cache-service', 'search-service'],
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
    childEvents: [
      {
        id: 'EVT-011',
        alertType: 'WRITE_FAILURE',
        source: 'log-aggregator-01',
        severity: 'Minor',
        timestamp: '2026-01-05T13:15:30Z',
        correlationScore: 0.85,
        message: 'Failed to write logs to storage'
      }
    ],
    affectedServices: ['logging-service', 'metrics-collector', 'backup-service'],
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
      severity: 'Minor',
      timestamp: '2026-01-05T12:00:00Z',
      message: 'Network latency spike detected - 500ms average'
    },
    childEvents: [
      {
        id: 'EVT-021',
        alertType: 'SLOW_RESPONSE',
        source: 'api-server-east-02',
        severity: 'Minor',
        timestamp: '2026-01-05T12:00:10Z',
        correlationScore: 0.78,
        message: 'API response time exceeded SLA'
      },
      {
        id: 'EVT-022',
        alertType: 'TCP_RETRANSMIT',
        source: 'load-balancer-01',
        severity: 'Low',
        timestamp: '2026-01-05T12:00:15Z',
        correlationScore: 0.72,
        message: 'High TCP retransmission rate detected'
      }
    ],
    affectedServices: ['cdn-service', 'api-east', 'static-assets'],
    affectedUsers: 850,
    status: 'Active',
    createdAt: '2026-01-05T12:00:00Z',
    duration: '2h 30m',
    rca: {
      rootCause: 'Network congestion due to BGP route flapping',
      confidence: 0.75,
      hypotheses: ['H_BGP_FLAP', 'H_DDOS_ATTACK', 'H_ISP_ISSUE']
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
        id: 'EVT-031',
        alertType: 'GC_PAUSE',
        source: 'app-server-05',
        severity: 'Major',
        timestamp: '2026-01-05T10:45:05Z',
        correlationScore: 0.95,
        message: 'Full GC pause lasting 8.5 seconds'
      },
      {
        id: 'EVT-032',
        alertType: 'REQUEST_QUEUE_FULL',
        source: 'app-server-05',
        severity: 'Major',
        timestamp: '2026-01-05T10:45:10Z',
        correlationScore: 0.90,
        message: 'Request queue capacity exceeded'
      }
    ],
    affectedServices: ['order-processing', 'inventory-check', 'pricing-engine'],
    affectedUsers: 1200,
    status: 'Pending',
    createdAt: '2026-01-05T10:45:00Z',
    duration: '15m 22s',
    rca: {
      rootCause: 'Memory leak in pricing calculation module',
      confidence: 0.82,
      hypotheses: ['H_MEMORY_LEAK', 'H_CACHE_OVERFLOW', 'H_THREAD_DEADLOCK']
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
    affectedServices: ['https-gateway', 'api-secure'],
    affectedUsers: 0,
    status: 'Active',
    createdAt: '2026-01-05T09:00:00Z',
    duration: '5h 30m',
    rca: {
      rootCause: 'Certificate auto-renewal process failed',
      confidence: 0.95,
      hypotheses: ['H_CERT_RENEWAL_FAILURE', 'H_DNS_VALIDATION_ISSUE']
    }
  },
  {
    id: 'CLU-12350',
    rootEvent: {
      id: 'EVT-050',
      alertType: 'CPU_SPIKE',
      source: 'worker-node-12',
      severity: 'Minor',
      timestamp: '2026-01-05T08:30:00Z',
      message: 'CPU utilization at 95% for 10 minutes'
    },
    childEvents: [
      {
        id: 'EVT-051',
        alertType: 'PROCESS_SLOW',
        source: 'worker-node-12',
        severity: 'Low',
        timestamp: '2026-01-05T08:32:00Z',
        correlationScore: 0.80,
        message: 'Background job processing delayed'
      }
    ],
    affectedServices: ['batch-processor', 'report-generator'],
    affectedUsers: 50,
    status: 'Resolved',
    createdAt: '2026-01-05T08:30:00Z',
    duration: '20m 15s',
    rca: {
      rootCause: 'Runaway regex in data validation causing CPU exhaustion',
      confidence: 0.88,
      hypotheses: ['H_REGEX_BACKTRACK', 'H_INFINITE_LOOP', 'H_CRYPTOMINER']
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
      rootCause: 'Hardware Failure: Primary Power Supply Unit (PSU-1) failed on Core-R2 causing electrical instability on line cards.',
      confidence: 0.97,
      hypotheses: ['H_PSU_FAILURE', 'H_ELECTRICAL_SPIKE']
    }
  },
  {
    id: 'CLU-002',
    rootEvent: { id: 'evt_002', alertType: 'LINK_DOWN', source: 'Dist-R4', severity: 'Critical', timestamp: '2025-12-26T10:01:20Z', message: 'Uplink port down' },
    childEvents: [],
    affectedServices: ['Data-Center-Link'],
    affectedUsers: 1200,
    status: 'Active',
    createdAt: '2025-12-26T10:01:20Z',
    duration: '21d',
    rca: { rootCause: 'Fiber Cut: Physical fiber damage on uplink to Dist-R4', confidence: 0.95, hypotheses: ['H_FIBER_CUT'] }
  },
  {
    id: 'CLU-004',
    rootEvent: { id: 'evt_018', alertType: 'CPU_HIGH', source: 'Dist-R6', severity: 'Major', timestamp: '2025-12-26T10:03:00Z', message: 'CPU spike' },
    childEvents: [],
    affectedServices: ['Control-Plane'],
    affectedUsers: 500,
    status: 'Active',
    createdAt: '2025-12-26T10:03:00Z',
    duration: '21d',
    rca: { rootCause: 'Traffic Flood: Ingress packet storm on Dist-R6', confidence: 0.88, hypotheses: ['H_TRAFFIC_FLOOD'] }
  },
  {
    id: 'CLU-005',
    rootEvent: { id: 'evt_025', alertType: 'MAC_FLAP', source: 'Core-R1', severity: 'Critical', timestamp: '2025-12-26T10:05:00Z', message: 'MAC flapping' },
    childEvents: [],
    affectedServices: ['Internal-Network'],
    affectedUsers: 3000,
    status: 'Active',
    createdAt: '2025-12-26T10:05:00Z',
    duration: '21d',
    rca: { rootCause: 'Switching Loop: Layer 2 loop detected on VLAN 100', confidence: 0.96, hypotheses: ['H_STP_LOOP'] }
  },
  {
    id: 'CLU-006',
    rootEvent: { id: 'evt_035', alertType: 'LINK_DOWN', source: 'Core-R1', severity: 'Critical', timestamp: '2025-12-26T10:08:00Z', message: 'Port down' },
    childEvents: [],
    affectedServices: ['Edge-Connectivity'],
    affectedUsers: 800,
    status: 'Active',
    createdAt: '2025-12-26T10:08:00Z',
    duration: '21d',
    rca: { rootCause: 'Interface Failure: Transceiver failure on Core-R1 Gi0/2/0', confidence: 0.93, hypotheses: ['H_XCVR_FAILURE'] }
  },
  {
    id: 'CLU-007',
    rootEvent: { id: 'evt_040', alertType: 'LINK_DOWN', source: 'Core-R2', severity: 'Critical', timestamp: '2025-12-26T10:09:00Z', message: 'Interface down' },
    childEvents: [],
    affectedServices: ['Backup-Routes'],
    affectedUsers: 400,
    status: 'Active',
    createdAt: '2025-12-26T10:09:00Z',
    duration: '21d',
    rca: { rootCause: 'Software Bug: Memory leak in linecard driver on Core-R2', confidence: 0.91, hypotheses: ['H_DRIVER_BUG'] }
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
    id: 'ded-001',
    type: 'same_alert_type',
    name: 'Same Alert Type Dedup',
    description: 'Deduplicate events with identical alert name or type',
    priority: 9,
    status: 'active',
    createdAt: '2025-12-01T00:00:00Z',
    modifiedAt: '2026-01-03T10:30:00Z',
    config: {
      matchCriteria: ['alertType', 'alertName']
    }
  },
  {
    id: 'ded-002',
    type: 'same_severity',
    name: 'Same Severity Dedup',
    description: 'Deduplicate events with matching severity levels from same source',
    priority: 8,
    status: 'active',
    createdAt: '2025-12-05T00:00:00Z',
    modifiedAt: '2026-01-02T14:00:00Z',
    config: {
      matchCriteria: ['severity', 'source']
    }
  },
  {
    id: 'ded-003',
    type: 'same_error_message',
    name: 'Same Error Message Dedup',
    description: 'Deduplicate events with identical error messages',
    priority: 7,
    status: 'active',
    createdAt: '2025-12-10T00:00:00Z',
    modifiedAt: '2025-12-28T09:15:00Z',
    config: {
      matchCriteria: ['errorMessage', 'errorCode']
    }
  },
  {
    id: 'ded-004',
    type: 'same_event_multi_source',
    name: 'Multi-Source Event Dedup',
    description: 'Deduplicate same event reported from multiple sources',
    priority: 6,
    status: 'active',
    createdAt: '2025-12-15T00:00:00Z',
    modifiedAt: '2026-01-05T11:00:00Z',
    config: {
      groupBy: ['eventId', 'timestamp']
    }
  }
];

export const mockSuppressionRules: SuppressionRule[] = [
  {
    id: 'sup-001',
    type: 'business_hours',
    name: 'Non-Critical After Hours',
    description: 'Suppress low/info severity alerts outside business hours',
    priority: 6,
    status: 'active',
    createdAt: '2025-11-20T00:00:00Z',
    modifiedAt: '2025-12-15T00:00:00Z',
    affectedDevices: [],
    config: {
      businessHours: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: '09:00',
        endTime: '18:00'
      }
    }
  },
  {
    id: 'sup-002',
    type: 'user_defined_time',
    name: 'Weekend Suppression Window',
    description: 'Suppress non-critical alerts during user-defined weekend window',
    priority: 5,
    status: 'active',
    createdAt: '2025-11-25T00:00:00Z',
    modifiedAt: '2026-01-02T00:00:00Z',
    affectedDevices: [],
    config: {
      schedule: {
        start: '2026-01-11T18:00:00Z',
        end: '2026-01-13T08:00:00Z',
        recurring: true
      }
    }
  },
  {
    id: 'sup-003',
    type: 'assets_maintenance',
    name: 'Database Maintenance Window',
    description: 'Suppress alerts for assets under scheduled maintenance',
    priority: 10,
    status: 'active',
    createdAt: '2025-11-15T00:00:00Z',
    modifiedAt: '2026-01-01T00:00:00Z',
    affectedDevices: ['db-server-01', 'db-server-02', 'db-replica-01'],
    config: {
      schedule: {
        start: '2026-01-07T02:00:00Z',
        end: '2026-01-07T06:00:00Z',
        recurring: true
      }
    }
  }
];

export const mockCorrelationRules: CorrelationRule[] = [
  {
    id: 'cor-001',
    type: 'causal',
    name: 'Database Cascade Detection',
    description: 'Detect cascading failures from database issues using cause-effect relationships',
    priority: 10,
    status: 'active',
    mlEnabled: true,
    gnnEnabled: false,
    createdAt: '2025-10-01T00:00:00Z',
    modifiedAt: '2026-01-04T11:00:00Z',
    config: {
      relationships: [
        { cause: 'DB_CONNECTION_FAILED', effect: 'API_TIMEOUT', timeWindow: 30, confidence: 0.9 },
        { cause: 'DB_CONNECTION_FAILED', effect: 'WEB_5XX_ERROR', timeWindow: 60, confidence: 0.85 }
      ],
      traceDepth: 5
    }
  },
  {
    id: 'cor-002',
    type: 'temporal',
    name: 'Time-Based Clustering',
    description: 'Correlate events occurring within defined time windows',
    priority: 8,
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    createdAt: '2025-11-01T00:00:00Z',
    modifiedAt: '2025-12-10T00:00:00Z',
    config: {
      timeWindowValue: 60,
      timeWindowUnit: 'seconds'
    }
  },
  {
    id: 'cor-003',
    type: 'spatial',
    name: 'Location-Based Correlation',
    description: 'Correlate events based on physical or logical proximity',
    priority: 7,
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    createdAt: '2025-10-20T00:00:00Z',
    modifiedAt: '2025-12-15T00:00:00Z',
    config: {
      groupingCriteria: ['datacenter', 'rack', 'region']
    }
  },
  {
    id: 'cor-004',
    type: 'topological',
    name: 'Service Dependency Correlation',
    description: 'Correlate events based on service dependency topology graph',
    priority: 9,
    status: 'active',
    mlEnabled: false,
    gnnEnabled: false,
    createdAt: '2025-10-15T00:00:00Z',
    modifiedAt: '2025-12-20T00:00:00Z',
    config: {
      traceDepth: 3
    }
  },
  {
    id: 'cor-005',
    type: 'gnn',
    name: 'Graph Neural Network Correlation',
    description: 'Use GNN to discover complex event correlations in infrastructure graph',
    priority: 10,
    status: 'active',
    mlEnabled: true,
    gnnEnabled: true,
    createdAt: '2025-09-01T00:00:00Z',
    modifiedAt: '2026-01-05T00:00:00Z',
    config: {
      traceDepth: 5
    }
  }
];

export const mockKBArticles: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'Resolving Database Connection Pool Exhaustion',
    category: 'Database',
    content: 'This article covers the diagnosis and remediation of database connection pool exhaustion issues...',
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
      { metric: 'cpu_percent', op: '>', value: 90, weight: 0.6 },
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
      { metric: 'utilization_percent', op: '>', value: 90, weight: 0.5 },
      { metric: 'out_discards', op: '>', value: 0, weight: 0.4 }
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
      { metric: 'latency_ms', op: '>', value: 100, weight: 0.6 },
      { metric: 'packet_loss_percent', op: '>', value: 1, weight: 0.4 }
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
