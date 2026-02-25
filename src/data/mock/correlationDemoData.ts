export interface DemoServiceNode {
    id: string;
    name: string;
    type: 'api' | 'database' | 'web' | 'auth' | 'compute' | 'storage' | 'network' | 'core' | 'edge';
    status: 'healthy' | 'degraded' | 'critical' | 'impacted';
    x: number;
    y: number;
    connections: string[];
    metrics?: {
        latency?: string;
        errorRate?: string;
        throughput?: string;
        utilization?: string;
        queueDepth?: string;
        cpu?: string;
        memory?: string;
    };
}

export const correlationDemoNodes: DemoServiceNode[] = [
    {
        id: 'Edge-R3',
        name: 'Edge Router R3',
        type: 'edge',
        status: 'impacted',
        x: 100,
        y: 300,
        connections: ['Agg-SW1'],
        metrics: { latency: '192ms', errorRate: '0.12%', throughput: '450Mbps' }
    },
    {
        id: 'Edge-R4',
        name: 'Edge Router R4',
        type: 'edge',
        status: 'impacted',
        x: 100,
        y: 100,
        connections: ['Agg-SW1'],
        metrics: { latency: '188ms', errorRate: '0.08%', throughput: '380Mbps' }
    },
    {
        id: 'Agg-SW1',
        name: 'Agg Switch SW1',
        type: 'core',
        status: 'critical',
        x: 350,
        y: 200,
        connections: ['Core-R1'],
        metrics: { utilization: '98%', queueDepth: '92%', cpu: '85%' }
    },
    {
        id: 'Core-R1',
        name: 'Core Router R1',
        type: 'core',
        status: 'healthy',
        x: 550,
        y: 200,
        connections: ['App-GW1', 'DC-Services', 'Storage-Cluster'],
        metrics: { utilization: '42%', cpu: '35%', memory: '28%' }
    },
    {
        id: 'App-GW1',
        name: 'App Gateway 1',
        type: 'api',
        status: 'impacted',
        x: 750,
        y: 100,
        connections: ['Auth-Cluster'],
        metrics: { latency: '2850ms', errorRate: '5.2%', throughput: '1.2Gbps' }
    },
    {
        id: 'DC-Services',
        name: 'Compute Cluster A',
        type: 'compute',
        status: 'healthy',
        x: 750,
        y: 300,
        connections: ['DB-Main'],
        metrics: { cpu: '65%', memory: '72%', throughput: '2.5Gbps' }
    },
    {
        id: 'DB-Main',
        name: 'DB Cluster Main',
        type: 'database',
        status: 'degraded',
        x: 950,
        y: 300,
        connections: [],
        metrics: { latency: '45ms', utilization: '88%', throughput: '850Mbps' }
    },
    {
        id: 'Auth-Cluster',
        name: 'Auth Cluster',
        type: 'auth',
        status: 'healthy',
        x: 950,
        y: 100,
        connections: [],
        metrics: { latency: '12ms', throughput: '120Mbps' }
    },
    {
        id: 'Storage-Cluster',
        name: 'Storage Cluster',
        type: 'storage',
        status: 'healthy',
        x: 750,
        y: 450,
        connections: [],
        metrics: { utilization: '32%', throughput: '5.2Gbps' }
    }
];

export const correlationDemoEvents = [
    { id: 'E001', timestamp: '15:30:05', device: 'Agg-SW1', code: 'LINK_UTIL_HIGH', severity: 'CRITICAL', message: 'Uplink utilization critical on Et0/1' },
    { id: 'E002', timestamp: '15:30:10', device: 'Agg-SW1', code: 'QUEUE_DROP', severity: 'CRITICAL', message: 'Egress queue drops detected (92% saturation)' },
    { id: 'E003', timestamp: '15:30:20', device: 'Edge-R3', code: 'LATENCY_HIGH', severity: 'MAJOR', message: 'SLA breach: RTD exceeds 180ms to Core-R1' },
    { id: 'E004', timestamp: '15:30:22', device: 'Edge-R4', code: 'LATENCY_HIGH', severity: 'MAJOR', message: 'SLA breach: RTD exceeds 180ms to Core-R1' },
    { id: 'E005', timestamp: '15:30:45', device: 'App-GW1', code: 'TRANSACTION_TIMEOUT', severity: 'MAJOR', message: 'p99 response time spike detected (2850ms)' },
    { id: 'E006', timestamp: '15:31:10', device: 'DB-Main', code: 'IO_WAIT_HIGH', severity: 'MINOR', message: 'Disk I/O wait increasing on secondary nodes' }
];

export const correlationDemoMetrics = {
    'Agg-SW1': [
        { time: '15:25:00', metric: 'if_util_percent', value: 45 },
        { time: '15:28:00', metric: 'if_util_percent', value: 72 },
        { time: '15:30:00', metric: 'if_util_percent', value: 98 },
        { time: '15:30:10', metric: 'queue_depth', value: 92 },
        { time: '15:31:00', metric: 'cpu_usage', value: 85 }
    ],
    'App-GW1': [
        { time: '15:25:00', metric: 'response_time', value: 120 },
        { time: '15:29:00', metric: 'response_time', value: 450 },
        { time: '15:30:45', metric: 'response_time', value: 2850 }
    ],
    'DB-Main': [
        { time: '15:30:00', metric: 'query_latency', value: 12 },
        { time: '15:31:00', metric: 'query_latency', value: 45 }
    ]
};

export const correlationResult = {
    situation_summary: "A terminal congestion event on Agg-SW1 is propagating downstream, causing widespread latency spikes in edge routers and transaction timeouts in the App Gateway tier.",
    grouping: {
        core_events: ["E001", "E002"],
        downstream_symptoms: ["E003", "E004", "E005"]
    },
    why_grouped: [
        "Concurrent threshold breaches across same network fabric path.",
        "Causal relationship identified: Link Congestion -> Queue Drops -> Buffer Bloat -> End-to-End Latency.",
        "Topological dominance: Agg-SW1 is the common funnel for all affected downstream traffic.",
        "Temporal synchronization (98%): Events occurred within a 45-second propagation window."
    ],
    relative_importance: [
        { event: "E002", score: 0.98, device: "Agg-SW1", code: "QUEUE_DROP" },
        { event: "E001", score: 0.95, device: "Agg-SW1", code: "LINK_UTIL_HIGH" },
        { event: "E005", score: 0.72, device: "App-GW1", code: "TRANSACTION_TIMEOUT" },
        { event: "E003", score: 0.58, device: "Edge-R3", code: "LATENCY_HIGH" },
        { event: "E004", score: 0.55, device: "Edge-R4", code: "LATENCY_HIGH" }
    ],
    scoring_explanation: {
        formula: "S_total = Σ (w_i × S_i) | i ∈ {temporal, spatial, topological, semantic}",
        weights: { temporal: 0.30, spatial: 0.10, topological: 0.35, semantic: 0.25 },
        examples: [
            {
                pair: "LINK_UTIL → QUEUE_DROP",
                calc: "0.3(0.99) + 0.1(1.0) + 0.35(1.0) + 0.25(0.95)",
                total: 0.97,
                breakdown: "Direct physical causality on device Agg-SW1."
            },
            {
                pair: "QUEUE_DROP → LATENCY_SPIKE",
                calc: "0.3(0.85) + 0.1(0.7) + 0.35(0.9) + 0.25(0.8)",
                total: 0.84,
                breakdown: "Network propagation from Aggregation to Edge tier."
            }
        ]
    },
    confidence: "Very High (0.98)"
};

export const NODE_INSIGHTS_DEMO: Record<string, any> = {
    'Agg-SW1': {
        actualEvents: [
            {
                id: 'E001',
                type: 'Uplink Congestion Spike',
                severity: 'critical',
                time: '12 mins ago',
                analysis: 'Interface Et0/1 reached 98% sustained utilization. Burst traffic from DC-Services exceeded shaper limits.',
                impact: 'All traffic entering via Edge-R3/R4 is experiencing buffer bloat.',
                correlation: 'Matches historical "Cyber Monday Peak" pattern. 98% similarity.',
                recommendation: 'Apply emergency QoS shaper to non-critical traffic; scale uplink capacity.'
            },
            {
                id: 'E002',
                type: 'Egress Buffer Overflow',
                severity: 'critical',
                time: '11 mins ago',
                analysis: 'Shared buffer pool saturated at 92%. Tail drops occurring on default class traffic.',
                impact: 'Packet loss detected for real-time services.',
                correlation: 'Direct consequence of Link Congestion event.',
                recommendation: 'Increase buffer allocation for class-map REALTIME.'
            }
        ],
        predictedEvents: [
            {
                id: 'P001',
                type: 'Hardware Thermal Risk',
                probability: '75%',
                evidence: 'ASIC temperature rising at 1.5°C/min due to sustained high load.',
                effect: 'Predicted hardware thermal shutdown of module 1 in 45 minutes if load persists.'
            }
        ],
        anomalyEvents: [
            {
                id: 'A001',
                type: 'Unusual Flow Pattern',
                details: 'Massive surge in DSCP 46 (EF) traffic from an unauthorized subnet.',
                impact: 'QoS priority queue being hijacked by non-VoIP traffic.'
            }
        ]
    },
    'App-GW1': {
        actualEvents: [
            {
                id: 'E005',
                type: 'Transaction Timeout Crisis',
                severity: 'high',
                time: '10 mins ago',
                analysis: 'p99 response times reached 2850ms. Core network latency identified as bottleneck.',
                impact: '75% drop in successful checkout transactions.',
                correlation: '92% temporal correlation with Agg-SW1 link drops.',
                recommendation: 'Check upstream path health and increase client-side timeout settings.'
            }
        ],
        predictedEvents: [
            {
                id: 'P002',
                type: 'Potential Pod Eviction',
                probability: '65%',
                evidence: 'Horizontal Pod Autoscaler (HPA) failing to scale due to cluster resource exhaustion.',
                effect: 'Total service unavailability expected if current traffic trend continues for 30 mins.'
            }
        ],
        anomalyEvents: []
    },
    'DB-Main': {
        actualEvents: [
            {
                id: 'E006',
                type: 'Disk I/O Degradation',
                severity: 'minor',
                time: '5 mins ago',
                analysis: 'Wait times on storage-tier backends increasing. Potential hot-partitioning.',
                impact: 'Delayed query results for analytical workloads.',
                correlation: 'Coincident with Compute Cluster A scaling event.',
                recommendation: 'Redistribute partitions or scale storage nodes.'
            }
        ],
        predictedEvents: [],
        anomalyEvents: [
            {
                id: 'A002',
                type: 'Slow Query Outlier',
                details: 'Single query from analytical-service taking 120s compared to median 0.5s.',
                impact: 'Holding database locks, blocking transaction processing.'
            }
        ]
    }
};

