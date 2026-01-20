import { IntentFull, IntentCategory, KBArticle, RemediationPermission } from '@/types';

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

// Knowledge Base Articles - Enhanced with categories
export const mockKBArticlesEnhanced: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'Resolving Database Connection Pool Exhaustion',
    category: 'Database',
    subcategory: 'Connection Management',
    content: 'This article covers the diagnosis and remediation of database connection pool exhaustion issues. Key steps include: 1. Identify connection leaks using monitoring tools. 2. Check application code for unclosed connections. 3. Tune pool size based on workload. 4. Implement connection timeout policies.',
    tags: ['database', 'connection-pool', 'performance'],
    linkedIntents: ['db.connection_pool_exhausted'],
    lastUpdated: '2026-01-02T00:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-002',
    title: 'Handling High CPU Utilization on Application Servers',
    category: 'Compute',
    subcategory: 'CPU',
    content: 'Steps to diagnose and resolve high CPU issues on application servers. Includes profiling techniques, identifying hot code paths, and optimization strategies.',
    tags: ['cpu', 'performance', 'application'],
    linkedIntents: ['compute.cpu_spike'],
    lastUpdated: '2025-12-28T00:00:00Z',
    effectiveness: 88
  },
  {
    id: 'kb-003',
    title: 'Network Latency Troubleshooting Guide',
    category: 'Network',
    subcategory: 'Link Layer',
    content: 'Comprehensive guide to diagnosing network latency issues including MTU problems, duplex mismatches, and physical layer issues.',
    tags: ['network', 'latency', 'troubleshooting'],
    linkedIntents: ['link.unidirectional', 'link.flapping'],
    lastUpdated: '2025-12-20T00:00:00Z',
    effectiveness: 85
  },
  {
    id: 'kb-004',
    title: 'BGP Session Recovery Procedures',
    category: 'Network',
    subcategory: 'Routing',
    content: 'Detailed procedures for recovering from BGP session failures, including peer configuration verification and route table analysis.',
    tags: ['bgp', 'routing', 'network'],
    linkedIntents: ['routing.bgp_down'],
    lastUpdated: '2025-12-15T00:00:00Z',
    effectiveness: 90
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
