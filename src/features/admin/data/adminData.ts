import { IntentFull, IntentCategory, KBArticle, RemediationPermission } from '@/shared/types';

// Intent Categories and Subcategories
export const mockIntentCategories: IntentCategory[] = [
  {
    id: 'network',
    name: 'Network',
    domain: 'Network',
    subcategories: [
      { id: 'link-layer', name: 'Link Layer', function: 'Link Layer', intentCount: 5 },
      { id: 'routing', name: 'Routing', function: 'Routing', intentCount: 3 },
      { id: 'switching', name: 'Switching', function: 'Switching', intentCount: 4 },
      { id: 'firewall', name: 'Firewall', function: 'Firewall', intentCount: 2 },
    ]
  },
  {
    id: 'database',
    name: 'Database',
    domain: 'Database',
    subcategories: [
      { id: 'connection', name: 'Connection Management', function: 'Connection Management', intentCount: 3 },
      { id: 'performance', name: 'Performance', function: 'Performance', intentCount: 4 },
      { id: 'replication', name: 'Replication', function: 'Replication', intentCount: 2 },
    ]
  },
  {
    id: 'compute',
    name: 'Compute',
    domain: 'Compute',
    subcategories: [
      { id: 'cpu', name: 'CPU', function: 'CPU', intentCount: 3 },
      { id: 'memory', name: 'Memory', function: 'Memory', intentCount: 4 },
      { id: 'process', name: 'Process Management', function: 'Process Management', intentCount: 2 },
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    domain: 'Storage',
    subcategories: [
      { id: 'disk', name: 'Disk', function: 'Disk', intentCount: 3 },
      { id: 'io', name: 'I/O Operations', function: 'I/O Operations', intentCount: 2 },
    ]
  }
];

// Full Intent Data
export const mockIntentsFull: IntentFull[] = [
  {
    _id: { $oid: '69381e8e2c85e919f613923f' },
    id: 'link.unidirectional',
    intent: 'link',
    subIntent: 'unidirectional',
    domain: 'Network',
    function: 'Link Layer',
    description: 'Unidirectional link issue detected between two devices',
    keywords: ['unidirectional', 'rx only', 'tx only', 'fiber issue'],
    signals: [
      { metric: 'rx_errors', op: '>', value: 100, weight: 0.5 },
      { metric: 'tx_errors', op: '==', value: 0, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_FIBER_ONE_SIDE_BROKEN',
        description: 'One strand of the fiber pair is broken or mispatched',
        signals: [
          { metric: 'rx_errors', op: '>', value: 100, weight: 0.6 },
          { metric: 'tx_errors', op: '==', value: 0, weight: 0.3 }
        ],
        logPatterns: [
          { keyword: 'unidirectional link', weight: 0.3 },
          { keyword: 'no light received', weight: 0.3 }
        ]
      }
    ],
    situationDesc: 'Link between {device} and {peer} appears unidirectional. {device} is receiving frames with errors (rx_errors={rx_errors}) while not transmitting successfully (tx_errors={tx_errors}). Top hypothesis: {top_hypothesis} (score={prior}).'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139240' },
    id: 'link.flapping',
    intent: 'link',
    subIntent: 'flapping',
    domain: 'Network',
    function: 'Link Layer',
    description: 'Link state is oscillating between up and down rapidly',
    keywords: ['flapping', 'link up', 'link down', 'unstable'],
    signals: [
      { metric: 'link_state_changes', op: '>', value: 5, weight: 0.7 },
      { metric: 'uptime', op: '<', value: 300, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_CABLE_LOOSE',
        description: 'Physical cable connection is loose or damaged',
        signals: [
          { metric: 'link_state_changes', op: '>', value: 5, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'link down', weight: 0.4 },
          { keyword: 'carrier lost', weight: 0.3 }
        ]
      },
      {
        id: 'H_SFP_FAILING',
        description: 'SFP transceiver is failing or overheating',
        signals: [
          { metric: 'temperature', op: '>', value: 70, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'sfp warning', weight: 0.4 }
        ]
      }
    ],
    situationDesc: 'Link on {device}:{interface} is flapping with {link_state_changes} state changes. Top hypothesis: {top_hypothesis}.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139241' },
    id: 'routing.bgp_down',
    intent: 'routing',
    subIntent: 'bgp_down',
    domain: 'Network',
    function: 'Routing',
    description: 'BGP session with peer has gone down',
    keywords: ['bgp', 'peer down', 'routing', 'session lost'],
    signals: [
      { metric: 'bgp_state', op: '==', value: 0, weight: 0.8 },
      { metric: 'prefixes_received', op: '==', value: 0, weight: 0.4 }
    ],
    hypotheses: [
      {
        id: 'H_PEER_UNREACHABLE',
        description: 'BGP peer is not reachable due to network issue',
        signals: [
          { metric: 'icmp_loss', op: '>', value: 50, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'hold timer expired', weight: 0.5 }
        ]
      }
    ],
    situationDesc: 'BGP session on {device} with peer {peer_ip} is down. Last state: {last_state}.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139242' },
    id: 'db.connection_pool_exhausted',
    intent: 'database',
    subIntent: 'connection_pool_exhausted',
    domain: 'Database',
    function: 'Connection Management',
    description: 'Database connection pool has been exhausted',
    keywords: ['connection pool', 'exhausted', 'max connections', 'timeout'],
    signals: [
      { metric: 'active_connections', op: '>=', value: 100, weight: 0.7 },
      { metric: 'connection_wait_time', op: '>', value: 5000, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_CONNECTION_LEAK',
        description: 'Application is leaking database connections',
        signals: [
          { metric: 'connections_created', op: '>', value: 1000, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'connection timeout', weight: 0.4 }
        ]
      }
    ],
    situationDesc: 'Connection pool on {database} is exhausted with {active_connections} active connections.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139243' },
    id: 'compute.cpu_spike',
    intent: 'compute',
    subIntent: 'cpu_spike',
    domain: 'Compute',
    function: 'CPU',
    description: 'CPU utilization has spiked abnormally',
    keywords: ['cpu', 'spike', 'high utilization', 'performance'],
    signals: [
      { metric: 'cpu_percent', op: '>', value: 90, weight: 0.6 },
      { metric: 'load_average', op: '>', value: 4, weight: 0.4 }
    ],
    hypotheses: [
      {
        id: 'H_RUNAWAY_PROCESS',
        description: 'A runaway process is consuming excessive CPU',
        signals: [
          { metric: 'top_process_cpu', op: '>', value: 80, weight: 0.7 }
        ],
        logPatterns: [
          { keyword: 'oom killer', weight: 0.3 }
        ]
      }
    ],
    situationDesc: 'CPU on {host} is at {cpu_percent}% utilization.'
  }
];

export const mockKBArticlesEnhanced: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'Mitigating Interface Saturation and Buffer Overflows',
    category: 'Network',
    subcategory: 'Link Layer',
    content: 'Standard operating procedure for handling sustained traffic spikes that cause output queue exhaustion, CRC errors, and interface flaps.',
    problem: 'An interface is experiencing sustained utilization above 85%. Traffic bursts are overwhelming the hardware packet buffers, causing queue depth surges. As the queues fill, the ASIC begins tail-dropping packets, which registers as output drops. Ultimately, the congestion degrades keepalives (like BFD or routing hellos), causing the interface protocol or routing neighbors to flap and fail over.',
    area: 'Core Routing & Edge Aggregation Links',
    remedyItems: [
      'Examine top talkers using NetFlow/sFlow to determine if the traffic spike is legitimate (e.g. backups) or anomalous (DDoS).',
      'Verify Quality of Service (QoS) queues. Ensure critical control-plane traffic (CS6/Network Control) is mapped to the strict priority queue.',
      'Check if the hardware buffers are statically divided. Consider switching to dynamic buffer allocation if supported by your ASIC.',
      'Temporarily shift traffic by tweaking IGP routing metrics (e.g., OSPF cost or BGP Local Preference) to offload the saturated path.',
      'If congestion is chronic, initiate a capacity planning request to upgrade the link from 10G to 40G/100G or deploy Link Aggregation (LAG/LACP).'
    ],
    tags: ['congestion', 'buffer', 'qos', 'interface-flap'],
    linkedIntents: ['link.flapping', 'link.unidirectional'],
    lastUpdated: '2026-02-18T10:30:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-002',
    title: 'BGP Neighbor Adjacency Failures & Route Flapping',
    category: 'Network',
    subcategory: 'Routing',
    content: 'Diagnosis and recovery of abruptly failing BGP sessions, including hold-timer expiration and reachability issues.',
    problem: 'A critical external or internal BGP peer adjacency has abruptly dropped. The router logged a "Hold timer expired" message. This causes immediate route withdrawals, massive prefix flapping, and diverted traffic paths, resulting in asymmetric routing and dropped traffic for specific external services. The CPU of the control plane might also have spiked leading up to the failure.',
    area: 'Core Routing Protocol Boundaries & Edge Peering',
    remedyItems: [
      'Ping and trace the peer interface to ensure there is no low-level connectivity or transport (Layer 2/3) blockage.',
      'Check the control plane CPU utilization (`show processes cpu hardware`). High CPU can prevent the routing process from replying to BGP keepalives in time.',
      'Verify hold-timer and keep-alive intervals to assure they match the neighboring router configuration.',
      'Ensure the CoPP (Control Plane Policing) policy is not inadvertently dropping TCP port 179 traffic during broadcast storms.',
      'Perform a soft-clear (`clear ip bgp soft in`) to request a route refresh without tearing down the TCP session.'
    ],
    tags: ['bgp', 'routing', 'peering', 'outage'],
    linkedIntents: ['routing.bgp_down'],
    lastUpdated: '2026-02-15T08:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-003',
    title: 'Resolving Database Connection Pool Exhaustion',
    category: 'Database',
    subcategory: 'Connection Management',
    content: 'Action plan for recovering databases failing to hand out active connections due to pool exhaustion or zombie connections.',
    problem: 'Applications are receiving connection timeout (`FATAL: sorry, too many clients already`) errors because the database connection pool has reached its maximum configured size. This typically happens during sudden traffic spikes, or due to connection leaks in the application code where active queries hang and connections are not properly closed and surrendered to the pool.',
    area: 'Database Infrastructure & Connection Orchestration (PostgreSQL/MySQL)',
    remedyItems: [
      'Query `pg_stat_activity` or equivalent views to identify queries stuck in `idle in transaction` state for extended periods.',
      'Aggressively kill zombie connections blocking the pool using `pg_terminate_backend(pid)`.',
      'Check application code or ORM settings for unclosed connections, missing transaction commits, or lack of read-replicas for heavy analytic queries.',
      'Temporarily increase the maximum pool size (`max_connections`), ensuring the host has adequate RAM to support the overhead.',
      'Deploy a connection pooler like PgBouncer or ProxySQL to multiplex thousands of application connections over a small set of real DB connections.'
    ],
    tags: ['database', 'connection-pool', 'postgresql', 'outage'],
    linkedIntents: ['db.connection_pool_exhausted'],
    lastUpdated: '2026-01-20T14:15:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-004',
    title: 'Handling High CPU Utilization on Application Servers',
    category: 'Compute',
    subcategory: 'CPU',
    content: 'Steps to diagnose and resolve runaway CPU exhaustion on compute instances running JVM or Node.js runtimes.',
    problem: 'Application servers are experiencing sustained CPU utilization pegged at 100%, leading to slow response times, service degradation, and dropped HTTP requests. The compute workload is artificially elevated, often caused by infinite loops, catastrophic backtracking in regular expressions (ReDoS), or the runtime Garbage Collector continuously thrashing to free memory.',
    area: 'Compute Instances, JVMs, & App Runtimes',
    remedyItems: [
      'Temporarily isolate the affected node from the load balancer to prevent user impact while diagnosing.',
      'Take a thread dump (`jstack` for Java, `--cpu-prof` for Node) and generate a flamegraph to identify the specific code paths eagerly consuming CPU cycles.',
      'Look for "OutOfMemoryError: GC Overhead Limit Exceeded" logs. If found, the CPU spike is a secondary symptom of a memory leak.',
      'Ensure the server is not swapping to disk. High hypervisor steal time or high I/O wait times masquerade as high CPU load.',
      'Scale out immediately by adding replicas if the CPU load is tied purely to an unexpected legitimate traffic surge.'
    ],
    tags: ['cpu', 'java', 'nodejs', 'performance', 'garbage-collection'],
    linkedIntents: ['compute.cpu_spike'],
    lastUpdated: '2025-12-10T09:45:00Z',
    effectiveness: 86
  },
  {
    id: 'kb-005',
    title: 'MAC Address Flapping & Spanning Tree Instability',
    category: 'Network',
    subcategory: 'Switching',
    content: 'Troubleshooting layer 2 loops and rapid MAC address moves between different switch ports.',
    problem: 'The network core logs thousands of "MAC address flapping" warnings per minute. This indicates that a single MAC address is being learned alternately on two different switch ports. This is highly symptomatic of a Layer 2 network loop, which can rapidly culminate in a broadcast storm that completely paralyses the switching fabric and drops core network telemetry.',
    area: 'Layer 2 Switching Fabric & Data Center Interconnects',
    remedyItems: [
      'Locate the flapping MAC address and the two ports fighting for it in the switch logging buffer (`show log | include FLAP`).',
      'Verify the Spanning Tree Protocol (STP) topology. Look for ports unexpectedly transitioning into forwarding state (`show spanning-tree summary`).',
      'Determine if someone has bridged two access ports together with a dummy switch or IP phone.',
      'Enable loop-protection features: BPDU Guard on access ports, and Root Guard on designated downstream ports.',
      'If it is a hypervisor (VMware/Hyper-V), verify the vSwitch load balancing policies are not sending traffic for one MAC out of multiple physical uplinks simultaneously.'
    ],
    tags: ['switching', 'mac-flap', 'stp', 'layer2', 'loop'],
    linkedIntents: [],
    lastUpdated: '2026-02-05T11:20:00Z',
    effectiveness: 95
  }
];

// KB Categories for navigation
export const mockKBCategories = [
  {
    id: 'network-kb',
    name: 'Network',
    subcategories: ['Link Layer', 'Routing', 'Switching'],
    articleCount: 8
  },
  {
    id: 'database-kb',
    name: 'Database',
    subcategories: ['Connection Management', 'Performance', 'Replication'],
    articleCount: 5
  },
  {
    id: 'compute-kb',
    name: 'Compute',
    subcategories: ['CPU', 'Memory', 'Process Management'],
    articleCount: 6
  },
  {
    id: 'storage-kb',
    name: 'Storage',
    subcategories: ['Disk', 'I/O Operations'],
    articleCount: 3
  }
];

// Auto Remediation Permissions
export const mockRemediationPermissions: RemediationPermission[] = [
  {
    id: 'perm-001',
    name: 'Auto-restart Failed Services',
    description: 'Allow automatic restart of failed services after detection',
    category: 'Service Management',
    riskLevel: 'low',
    approved: true,
    approvedBy: 'admin@company.com',
    approvedAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'perm-002',
    name: 'Clear Connection Pools',
    description: 'Automatically clear and reset database connection pools when exhausted',
    category: 'Database',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'dba@company.com',
    approvedAt: '2025-12-28T14:30:00Z'
  },
  {
    id: 'perm-003',
    name: 'Failover to Secondary',
    description: 'Trigger automatic failover to secondary systems during primary outages',
    category: 'High Availability',
    riskLevel: 'high',
    approved: false
  },
  {
    id: 'perm-004',
    name: 'Scale Up Resources',
    description: 'Automatically scale compute resources during high load',
    category: 'Auto Scaling',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'ops@company.com',
    approvedAt: '2025-12-20T09:00:00Z'
  },
  {
    id: 'perm-005',
    name: 'Execute Playbooks',
    description: 'Allow execution of pre-defined remediation playbooks',
    category: 'Automation',
    riskLevel: 'medium',
    approved: false
  },
  {
    id: 'perm-006',
    name: 'Network Failover',
    description: 'Trigger network path failover during connectivity issues',
    category: 'Network',
    riskLevel: 'high',
    approved: false
  },
  {
    id: 'perm-007',
    name: 'Kill Runaway Processes',
    description: 'Automatically terminate processes consuming excessive resources',
    category: 'Process Management',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'ops@company.com',
    approvedAt: '2026-01-05T11:00:00Z'
  },
  {
    id: 'perm-008',
    name: 'Rollback Deployments',
    description: 'Automatically rollback to previous deployment on failure detection',
    category: 'Deployment',
    riskLevel: 'high',
    approved: false
  }
];
