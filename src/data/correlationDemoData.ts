


// We'll define the shape locally if needed or export it from a common place. 
// For now, I will match the structure used in ServiceTopology.tsx

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
        metrics: { latency: '180ms', errorRate: '0.1%' }
    },
    {
        id: 'Edge-R4',
        name: 'Edge Router R4',
        type: 'edge',
        status: 'impacted',
        x: 100,
        y: 100,
        connections: ['Agg-SW1'],
        metrics: { latency: '175ms', errorRate: '0.1%' }
    },
    {
        id: 'Agg-SW1',
        name: 'Agg Switch SW1',
        type: 'core',
        status: 'critical',
        x: 350,
        y: 200,
        connections: ['Core-R1'],
        metrics: { utilization: '95%', queueDepth: '88%' }
    },
    {
        id: 'Core-R1',
        name: 'Core Router R1',
        type: 'core',
        status: 'healthy',
        x: 600,
        y: 200,
        connections: ['App-GW1', 'DC-Services'],
        metrics: { utilization: '45%' }
    },
    {
        id: 'App-GW1',
        name: 'App Gateway 1',
        type: 'api',
        status: 'impacted',
        x: 800,
        y: 100,
        connections: [],
        metrics: { latency: '2400ms' }
    },
    {
        id: 'DC-Services',
        name: 'DC Services',
        type: 'database',
        status: 'healthy',
        x: 800,
        y: 300,
        connections: [],
        metrics: { throughput: '10GB/s' }
    }
];

export const correlationDemoEvents = [
    { id: 'E001', timestamp: '10:00:05', device: 'Agg-SW1', code: 'LINK_UTIL_HIGH', severity: 'MAJOR', message: 'Uplink utilization high' },
    { id: 'E002', timestamp: '10:00:10', device: 'Agg-SW1', code: 'QUEUE_DROP', severity: 'MAJOR', message: 'Queue drops detected' },
    { id: 'E003', timestamp: '10:00:20', device: 'Edge-R3', code: 'LATENCY_HIGH', severity: 'MINOR', message: 'Latency spike' },
    { id: 'E004', timestamp: '10:00:25', device: 'Edge-R4', code: 'LATENCY_HIGH', severity: 'MINOR', message: 'Latency spike' },
    { id: 'E005', timestamp: '10:00:40', device: 'App-GW1', code: 'RESPONSE_TIME_HIGH', severity: 'MINOR', message: 'App response time degraded' }
];

export const correlationDemoMetrics = {
    'Agg-SW1': [
        { time: '09:59:30', metric: 'if_util_percent', value: 62 },
        { time: '10:00:00', metric: 'if_util_percent', value: 91 },
        { time: '10:00:10', metric: 'if_util_percent', value: 95 },
        { time: '10:00:10', metric: 'queue_depth', value: '88%' },
        { time: '10:00:15', metric: 'packet_drop_rate', value: '3.2%' }
    ],
    'Edge-R3': [
        { time: '10:00:20', metric: 'rtt_ms', value: 180 }
    ],
    'Edge-R4': [
        { time: '10:00:25', metric: 'rtt_ms', value: 175 }
    ],
    'App-GW1': [
        { time: '10:00:40', metric: 'p95_response_time_ms', value: 2400 }
    ]
};

export const correlationResult = {
    situation_summary: "Five events form a single correlated situation centered on Agg-SW1 and its downstream path.",
    grouping: {
        core_events: ["E001", "E002"],
        downstream_symptoms: ["E003", "E004", "E005"]
    },
    why_grouped: [
        "All events occur within a short time window (temporal correlation).",
        "All devices are in the same site and zone (spatial correlation).",
        "Edge and App devices are downstream of Agg-SW1 in topology (topological correlation).",
        "Event semantics form a causal chain: utilization -> drops -> latency -> response time. (Causal/Rule-based)"
    ],
    relative_importance: [
        { event: "E002", score: 0.92, device: "Agg-SW1", code: "QUEUE_DROP" },
        { event: "E001", score: 0.88, device: "Agg-SW1", code: "LINK_UTIL_HIGH" },
        { event: "E003", score: 0.45, device: "Edge-R3", code: "LATENCY_HIGH" },
        { event: "E004", score: 0.44, device: "Edge-R4", code: "LATENCY_HIGH" },
        { event: "E005", score: 0.30, device: "App-GW1", code: "RESPONSE_TIME_HIGH" }
    ],
    confidence: "High"
};

export const NODE_INSIGHTS_DEMO: Record<string, any> = {
    'Agg-SW1': {
        actualEvents: [
            { id: 'E001', type: 'LINK_UTIL_HIGH', severity: 'major', time: '10:00:05', analysis: 'Uplink utilization high', impact: 'Potential congestion', correlation: 'Root of congestion chain', recommendation: 'Check traffic sources' },
            { id: 'E002', type: 'QUEUE_DROP', severity: 'major', time: '10:00:10', analysis: 'Queue drops detected', impact: 'Packet loss', correlation: 'Caused by high utilization', recommendation: 'Review QoS policies' }
        ],
        predictedEvents: [],
        anomalyEvents: []
    },
    'Edge-R3': {
        actualEvents: [
            { id: 'E003', type: 'LATENCY_HIGH', severity: 'minor', time: '10:00:20', analysis: 'Latency spike', impact: 'Slow connectivity', correlation: 'Downstream of Agg-SW1 congestion', recommendation: 'Investigate upstream' }
        ],
        predictedEvents: [],
        anomalyEvents: []
    },
    'Edge-R4': {
        actualEvents: [
            { id: 'E004', type: 'LATENCY_HIGH', severity: 'minor', time: '10:00:25', analysis: 'Latency spike', impact: 'Slow connectivity', correlation: 'Downstream of Agg-SW1 congestion', recommendation: 'Investigate upstream' }
        ],
        predictedEvents: [],
        anomalyEvents: []
    },
    'App-GW1': {
        actualEvents: [
            { id: 'E005', type: 'RESPONSE_TIME_HIGH', severity: 'minor', time: '10:00:40', analysis: 'App response time degraded', impact: 'User experience impact', correlation: 'Caused by network latency', recommendation: 'Check network path' }
        ],
        predictedEvents: [],
        anomalyEvents: []
    },
    'Core-R1': {
        actualEvents: [],
        predictedEvents: [],
        anomalyEvents: []
    },
    'DC-Services': {
        actualEvents: [],
        predictedEvents: [],
        anomalyEvents: []
    }
};
