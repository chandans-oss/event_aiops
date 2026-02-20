import { Severity, EventLabel } from '@/shared/types';

export interface NetworkEvent {
  event_id: string;
  device: string;
  event_code: string;
  timestamp: string;
  severity: Severity;
  metric: string;
  value: string;
  site: string;
  region: string;
  rack: string;
  message: string;
  label?: EventLabel;
  status: 'Active' | 'Resolved';
  clusterId?: string;
  classificationReason?: {
    rule: string;
    description: string;
    confidence: number;
  };
}

export const sampleNetworkEvents: NetworkEvent[] = [
  // --- Active Clusters (High Priority) ---
  { event_id: 'EVT-LC-010', device: 'core-router-dc1', event_code: 'LINK_CONGESTION', timestamp: '2025-10-28T14:30:00Z', severity: 'Critical', metric: 'utilization', value: '96', site: 'DC1', region: 'NA', rack: 'R3', message: 'Gi0/1/0 interface congestion - 96% utilization', label: 'Root', status: 'Active', clusterId: 'CLU-LC-001', classificationReason: { rule: 'Causal Correlation', description: 'Root cause: Unscheduled backup traffic', confidence: 0.93 } },
  { event_id: 'EVT-LC-009', device: 'core-router-dc1', event_code: 'PACKET_DISCARD', timestamp: '2025-10-28T14:30:00Z', severity: 'Critical', metric: 'drops', value: '500', site: 'DC1', region: 'NA', rack: 'R3', message: 'Output discards on Gi0/1/0', label: 'Child', status: 'Active', clusterId: 'CLU-LC-001', classificationReason: { rule: 'Temporal Correlation', description: 'Temporal match on same device/interface (0s delay)', confidence: 0.95 } },
  { event_id: 'EVT-LC-011', device: 'core-router-dc1', event_code: 'HIGH_LATENCY', timestamp: '2025-10-28T14:31:00Z', severity: 'Critical', metric: 'latency', value: '500ms', site: 'DC1', region: 'NA', rack: 'R3', message: 'Latency spike detected', label: 'Child', status: 'Active', clusterId: 'CLU-LC-001', classificationReason: { rule: 'Causal + Temporal Correlation', description: 'Causal link: Congestion → Latency increase', confidence: 0.92 } },
  { event_id: 'evt_007', device: 'Edge-S10', event_code: 'LINK_DOWN', timestamp: '2025-12-26T10:01:22Z', severity: 'Critical', metric: '', value: '', site: 'DC1', region: 'NA', rack: 'R10', message: 'Uplink to Dist-R4 failed', label: 'Child', status: 'Active', clusterId: 'CLU-LC-001', classificationReason: { rule: 'Network Path Dependency', description: 'Link failure secondary to primary congestion event', confidence: 0.85 } },
  { event_id: 'evt_025', device: 'Core-R1', event_code: 'MAC_FLAP', timestamp: '2025-12-26T10:05:00Z', severity: 'Critical', metric: 'flaps', value: '3000', site: 'DC1', region: 'NA', rack: 'R1', message: 'MAC addresses flapping', label: 'Root', status: 'Active', clusterId: 'CLU-LC-001', classificationReason: { rule: 'Loop Detection Pattern', description: 'MAC flapping detected as a symptom of network congestion loop.', confidence: 0.91 } },

  // --- DB Cluster (Active) ---
  { event_id: 'EVT-001', device: 'db-server-01', event_code: 'DB_CONNECTION_FAILED', timestamp: '2026-01-05T14:30:00Z', severity: 'Critical', metric: 'connections', value: '100', site: 'DC1', region: 'NA', rack: 'S1', message: 'Database connection pool exhausted', label: 'Root', status: 'Active', clusterId: 'CLU-12345', classificationReason: { rule: 'Causal Correlation', description: 'Root cause: Connection pool exhaustion', confidence: 0.88 } },
  { event_id: 'EVT-002', device: 'api-gateway-01', event_code: 'API_TIMEOUT', timestamp: '2026-01-05T14:30:03Z', severity: 'Major', metric: '', value: '', site: 'DC1', region: 'NA', rack: 'R7', message: 'API timeout - upstream service unavailable', label: 'Child', status: 'Active', clusterId: 'CLU-12345', classificationReason: { rule: 'Service Dependency Correlation', description: 'Downstream dependency failure (API → Database)', confidence: 0.92 } },

  // --- Hardware Cluster (Active) ---
  { event_id: 'evt_011', device: 'Core-R2', event_code: 'POWER_SUPPLY_FAIL', timestamp: '2025-12-26T10:02:00Z', severity: 'Critical', metric: '', value: '', site: 'DC2', region: 'NA', rack: 'R2', message: 'PSU-1 failed', label: 'Root', status: 'Active', clusterId: 'CLU-003', classificationReason: { rule: 'Hardware Failure Detection', description: 'Power supply failure detected as independent root cause.', confidence: 0.97 } },
  { event_id: 'evt_012', device: 'Core-R2', event_code: 'PORT_ERROR', timestamp: '2025-12-26T10:02:05Z', severity: 'Major', metric: '', value: '', site: 'DC2', region: 'NA', rack: 'R2', message: 'Gi0/2/0 CRC errors', label: 'Child', status: 'Active', clusterId: 'CLU-003', classificationReason: { rule: 'Same Device Correlation', description: 'Port errors on same device following power failure.', confidence: 0.89 } },
  { event_id: 'evt_013', device: 'Dist-R5', event_code: 'LINK_DOWN', timestamp: '2025-12-26T10:02:10Z', severity: 'Critical', metric: '', value: '', site: 'DC2', region: 'NA', rack: 'R5', message: 'Uplink to Core-R2 down', label: 'Child', status: 'Active', clusterId: 'CLU-003', classificationReason: { rule: 'Topological Correlation', description: 'Direct downstream impact from Core-R2 failure.', confidence: 0.91 } },

  // --- BGP Flapping (Active) ---
  { event_id: 'EVT-020', device: 'router-dc-east-01', event_code: 'NETWORK_LATENCY', timestamp: '2026-02-15T12:00:00Z', severity: 'Major', metric: 'latency', value: '500ms', site: 'DC-East', region: 'NA', rack: 'R10', message: 'BGP route flapping detected', label: 'Root', status: 'Active', clusterId: 'CLU-12347', classificationReason: { rule: 'BGP Instability Detection', description: 'BGP flapping on ISP-A peer causing latency', confidence: 0.75 } },
  { event_id: 'EVT-021', device: 'router-dc-east-01', event_code: 'BGP_FLAP', timestamp: '2026-02-15T12:05:00Z', severity: 'Major', metric: 'flaps', value: '15', site: 'DC-East', region: 'NA', rack: 'R10', message: 'BGP neighbor 10.1.1.2 reset', label: 'Child', status: 'Active', clusterId: 'CLU-12347' },

  // --- Memory Leak (Active) ---
  { event_id: 'EVT-030', device: 'app-server-05', event_code: 'MEMORY_EXHAUSTION', timestamp: '2026-02-15T10:45:00Z', severity: 'Critical', metric: 'heap_usage', value: '98', site: 'DC1', region: 'NA', rack: 'R10', message: 'JVM heap exhausted - 7.8GB/8GB used', label: 'Root', status: 'Active', clusterId: 'CLU-12348', classificationReason: { rule: 'Memory Leak Detection', description: 'Pricing cache memory leak identified', confidence: 0.82 } },
  { event_id: 'EVT-050', device: 'worker-node-12', event_code: 'CPU_SPIKE', timestamp: '2026-02-15T08:30:00Z', severity: 'Minor', metric: 'cpu', value: '95', site: 'DC2', region: 'NA', rack: 'R1', message: 'CPU utilization spiked to 95%', label: 'Child', status: 'Active', clusterId: 'CLU-12348' },

  // --- Resolved Incidents (History) ---
  { event_id: 'EVT-010', device: 'storage-node-03', event_code: 'DISK_FULL', timestamp: '2026-01-05T13:15:00Z', severity: 'Major', metric: 'disk_usage', value: '95', site: 'DC1', region: 'NA', rack: 'R4', message: '/var/log partition 95% full', label: 'Root', status: 'Resolved', clusterId: 'CLU-12346', classificationReason: { rule: 'Storage Exhaustion Detection', description: 'Log rotation failure causing disk exhaustion', confidence: 0.92 } },
  { event_id: 'EVT-040', device: 'proxy-ssl-01', event_code: 'SSL_CERT_EXPIRY', timestamp: '2026-01-05T09:00:00Z', severity: 'Major', metric: '', value: '', site: 'DC1', region: 'NA', rack: 'R1', message: 'SSL certificate renewal successful', label: 'Root', status: 'Resolved', clusterId: 'CLU-12349' },
  { event_id: 'EVT-H-001', device: 'core-router-dc1', event_code: 'TEMP_HIGH', timestamp: '2026-01-10T02:00:00Z', severity: 'Major', metric: 'temp', value: '75C', site: 'DC1', region: 'NA', rack: 'R3', message: 'Chassis intake temperature high', label: 'Root', status: 'Resolved' },
  { event_id: 'EVT-H-002', device: 'core-router-dc1', event_code: 'FAN_FAIL', timestamp: '2026-01-10T02:05:00Z', severity: 'Major', metric: 'rpm', value: '0', site: 'DC1', region: 'NA', rack: 'R3', message: 'Fan tray 2 failure', label: 'Child', status: 'Resolved' },
  { event_id: 'EVT-H-003', device: 'sw-access-42', event_code: 'PORT_FLAP', timestamp: '2026-01-12T15:30:00Z', severity: 'Minor', metric: 'flaps', value: '45', site: 'DC1', region: 'NA', rack: 'R12', message: 'Port Gi1/0/1 flapping', label: 'Root', status: 'Resolved' },
  { event_id: 'EVT-H-004', device: 'sw-access-42', event_code: 'DUPLEX_MISMATCH', timestamp: '2026-01-12T15:45:00Z', severity: 'Minor', metric: '', value: '', site: 'DC1', region: 'NA', rack: 'R12', message: 'Duplex mismatch detected on Gi1/0/1', label: 'Child', status: 'Resolved' },

  // --- Duplicate & Suppressed Events ---
  { event_id: 'EVT-D-01', device: 'core-router-dc1', event_code: 'LINK_CONGESTION', timestamp: '2025-10-28T14:32:00Z', severity: 'Major', metric: 'utilization', value: '94', site: 'DC1', region: 'NA', rack: 'R3', message: 'Gi0/1/0 utilization high', label: 'Duplicate', status: 'Active', clusterId: 'CLU-LC-001' },
  { event_id: 'EVT-D-02', device: 'core-router-dc1', event_code: 'LINK_CONGESTION', timestamp: '2025-10-28T14:35:00Z', severity: 'Major', metric: 'utilization', value: '95', site: 'DC1', region: 'NA', rack: 'R3', message: 'Gi0/1/0 utilization high', label: 'Duplicate', status: 'Active', clusterId: 'CLU-LC-001' },
  { event_id: 'EVT-NET-004-1', device: 'Dist-Switch-02', event_code: 'LINK_CONGESTION', timestamp: '2026-02-18T08:00:00Z', severity: 'Critical', metric: 'utilization', value: '98', site: 'DC1', region: 'NA', rack: 'R5', message: 'Interface Et0/0 utilization > 90% for 5 mins', label: 'Root', status: 'Active', clusterId: 'CLU-NET-004', classificationReason: { rule: 'Pattern Match', description: 'Matched Pattern: Congestion Buildup Before Interface Flap', confidence: 0.99 } },
  { event_id: 'EVT-NET-004-2', device: 'Dist-Switch-02', event_code: 'PACKET_DISCARD', timestamp: '2026-02-18T08:05:00Z', severity: 'Major', metric: 'drops', value: '1500', site: 'DC1', region: 'NA', rack: 'R5', message: 'Input queue drops on Et0/0', label: 'Child', status: 'Active', clusterId: 'CLU-NET-004', classificationReason: { rule: 'Pattern Match', description: 'Step 2 of Congestion Pattern', confidence: 0.98 } },
  { event_id: 'EVT-NET-004-3', device: 'Dist-Switch-02', event_code: 'LINK_FLAP', timestamp: '2026-02-18T08:08:00Z', severity: 'Critical', metric: 'state', value: 'Down', site: 'DC1', region: 'NA', rack: 'R5', message: 'Interface Et0/0 changed state to Down', label: 'Child', status: 'Active', clusterId: 'CLU-NET-004', classificationReason: { rule: 'Pattern Match', description: 'Step 3 of Congestion Pattern', confidence: 0.99 } },

  { event_id: 'EVT-S-01', device: 'test-server-01', event_code: 'CPU_HIGH', timestamp: '2026-02-15T03:00:00Z', severity: 'Minor', metric: 'cpu', value: '85', site: 'DC2', region: 'NA', rack: 'T1', message: 'Maintenance window: CPU spike', label: 'Suppressed', status: 'Active' },
  // --- Additional Bulk Data (To reach ~65) ---
  ...Array.from({ length: 45 }).map((_, i) => ({
    event_id: `EVT-B-${i + 100}`,
    device: `edge-router-0${(i % 5) + 1}`,
    event_code: i % 3 === 0 ? 'INTERFACE_FLAP' : i % 3 === 1 ? 'BDP_THROUGHPUT_DROP' : 'THROTTLE_DETECTED',
    timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
    severity: (i % 4 === 0 ? 'Critical' : i % 4 === 1 ? 'Major' : 'Minor') as Severity,
    metric: 'throughput',
    value: `${80 - i} Mbps`,
    site: 'DC3',
    region: 'EMEA',
    rack: `K${(i % 10) + 1}`,
    message: `${i % 3 === 0 ? 'Interface flap' : i % 3 === 1 ? 'BDP drop' : 'Traffic throttle'} detected on edge link`,
    label: (i % 10 === 0 ? 'Root' : 'Child') as EventLabel,
    status: (i % 7 === 0 ? 'Resolved' : 'Active') as 'Resolved' | 'Active',
    clusterId: i % 10 === 0 ? `CLU-B-${i}` : undefined
  }))
];


export const getEventStats = (events: NetworkEvent[]) => {
  const activeEvents = events.filter(e => e.status === 'Active');
  const resolvedEvents = events.filter(e => e.status === 'Resolved');

  const labelCounts = {
    Root: events.filter(e => e.label === 'Root').length,
    Child: events.filter(e => e.label === 'Child').length,
    Duplicate: events.filter(e => e.label === 'Duplicate').length,
    Suppressed: events.filter(e => e.label === 'Suppressed').length,
  };

  const severityCounts = {
    Critical: events.filter(e => e.severity === 'Critical').length,
    Major: events.filter(e => e.severity === 'Major').length,
    Minor: events.filter(e => e.severity === 'Minor').length,
    Low: events.filter(e => e.severity === 'Low').length,
  };

  return {
    total: events.length,
    active: activeEvents.length,
    resolved: resolvedEvents.length,
    labelCounts,
    severityCounts,
  };
};
