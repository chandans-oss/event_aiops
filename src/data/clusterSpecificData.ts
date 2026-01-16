// Cluster-specific RCA, Impact, and Remediation data
// Each cluster has unique data for RCA process steps, evidence, impact topology, and remediation

export interface RCAProcessStep {
    id: string;
    name: string;
    description: string;
    status: 'complete' | 'active' | 'pending';
    details: {
        input: string[];
        processing: string;
        output: string;
        duration: string;
        rawInput?: string;
        rawOutput?: string;
        metadata?: Record<string, string | string[]>;
        bulletPoints?: string[]; // Added for the list view in the UI
    };
}

export interface DataEvidence {
    source: string;
    type: 'Metrics' | 'Logs' | 'Events' | 'Topology' | 'Config' | 'Traces';
    count: number;
    samples: string[];
    relevance: number;
}

export interface ImpactedAsset {
    id: string;
    name: string;
    type: string;
    severity: 'Critical' | 'Major' | 'Minor' | 'Low';
    status: string;
    dependencies: string[];
}

export interface RemediationStep {
    id: string;
    phase: 'Immediate' | 'Temporary' | 'Long-term';
    action: string;
    description: string;
    status: 'complete' | 'in_progress' | 'pending' | 'failed';
    duration: string;
    automated: boolean;
    command?: string;
    verification?: string[];
}

export interface ClusterSpecificData {
    clusterId: string;
    rcaMetadata: {
        rootEventId: string;
        rootEventType: string;
        timestamp: string;
        device: string;
        severity: string;
    };
    rcaSummary: string;
    remedyTitle?: string;
    rcaProcessSteps: RCAProcessStep[];
    dataEvidence: DataEvidence[];
    correlatedChildEvents: Array<{
        id: string;
        alertType: string;
        source: string;
        severity: string;
        timestamp: string;
        correlationScore: number;
        correlationReason: string;
        message?: string;
    }>;
    impactedAssets: ImpactedAsset[];
    impactTopology: {
        nodes: Array<{ id: string; label: string; type: string; status: string; severity?: string }>;
        edges: Array<{ from: string; to: string; type: string }>;
    };
    remediationSteps: RemediationStep[];
    remediationKB: Array<{ title: string; relevance: number; url: string }>;
}

// ============================================================================
// HELPER: Generate High-Fidelity 8-Step RCA Trace (matching user image)
// ============================================================================
const generateRCASteps = (id: string, type: string, device: string): RCAProcessStep[] => {
    const intent = `availability.${type.toLowerCase().replace(/_/g, '.')}`;
    const hypothesis = `H_${type}`;

    return [
        {
            id: 'orchestration',
            name: 'Orchestration',
            description: 'Incident & Goal creation for investigation',
            status: 'complete',
            details: {
                input: ['Correlated incident group', 'Entity lookup'],
                processing: `Created investigation goal: Determine cause of ${type} on ${device}. Initializing diagnostic agents.`,
                output: 'Investigation workflow bootstrapped.',
                duration: '1.2s',
                bulletPoints: [
                    'Contextual entity lookup from CMDB',
                    'Analytical goal generation based on incident severity',
                    'Diagnostic agent swarm initialization',
                    'Resource lock acquisition for deep-dive metrics'
                ],
                metadata: {
                    'Goal Status': 'Initialized',
                    'Orchestrator': 'AgenticFlow-V3',
                    'Assigned Workers': '3 Diagnostic Agents',
                    'Entity Context': 'Loaded',
                    'Trigger Event': type
                },
                rawOutput: `{"status": "initialized", "signals": {"${device}": {"cpu": 88, "mem": 92, "io": 45}}}`
            },
        },
        {
            id: 'intent-routing',
            name: 'Intent Routing',
            description: 'Mapping failure to specific diagnostic intent',
            status: 'complete',
            details: {
                input: ['Orchestration context', 'Intent Knowledge Base'],
                processing: `Matched signature for ${type.toLowerCase()}. Statistical confidence: 91.2%`,
                output: intent,
                duration: '0.8s',
                metadata: {
                    'Matched Intent': intent,
                    'Sub-intent': type.split('_').pop()?.toLowerCase() || 'failure',
                    'Confidence': '91.2%',
                    'KB Version': '2.4.1'
                }
            },
        },
        {
            id: 'hypothesis-scorer',
            name: 'Hypotheses Scorer',
            description: 'Ranking potential root cause hypotheses',
            status: 'complete',
            details: {
                input: [`Intent: ${intent}`, 'Device status'],
                processing: `Scoring H_${type}_PHYSICAL, H_${type}_CONFIG, H_EXTERNAL.`,
                output: hypothesis,
                duration: '2.5s',
                metadata: {
                    'Top Hypothesis': hypothesis,
                    'Lead Evidence': 'Signal Anomaly Detected',
                    'Rejection Reason': 'H_EXTERNAL lack of correlation',
                    'Sample Count': '128 signals'
                }
            },
        },
        {
            id: 'situation-builder',
            name: 'Situation Builder',
            description: 'Generating human-centric situation card',
            status: 'complete',
            details: {
                input: ['Scored hypotheses', 'Blast radius estimate'],
                processing: 'Applying prompt template for situation generation.',
                output: `INFRAON-ALARM-${id.split('-').pop()}`,
                duration: '1.5s',
                metadata: {
                    'Situation ID': `SIT-${id.split('-').pop()}`,
                    'Summary': `Critical ${type} on ${device} impacting services.`,
                    'Criticality': 'High',
                    'Urgency': 'Immediate'
                }
            },
        },
        {
            id: 'planner-llm',
            name: 'Planner LLM',
            description: 'LLM generated diagnostic and validation plan',
            status: 'complete',
            details: {
                input: ['Situation card', 'Tool Inventory'],
                processing: 'Planner LLM process completed.',
                output: 'Diagnostic plan created.',
                duration: '4.2s',
                metadata: {
                    'Plan ID': `PLAN-${Math.floor(Math.random() * 10000)}`,
                    'Steps': '5 Diagnostic Steps',
                    'Tools': 'SSH, REST-API, TSDB',
                    'Strategy': 'Top-Down Verification'
                },
                rawOutput: JSON.stringify({
                    steps: [
                        { tool: "SSH_COMMAND", why: `Capture real-time state on ${device}` },
                        { tool: "SNMP_GET", why: "Verify baseline metrics" },
                        { tool: "LOG_ANALYSIS", why: `Identify patterns related to ${type}` },
                        { tool: "TSDB_LOOKUP", why: "Compare current anomalies with 7-day average" }
                    ]
                })
            },
        },
        {
            id: 'data-correlator',
            name: 'Data Correlation Engine',
            description: 'Semantic match against historical incident database',
            status: 'complete',
            details: {
                input: ['Investigation results', 'Historical Vector Store'],
                processing: 'Data Correlation Engine completed.',
                output: 'Found 2 historical matches.',
                duration: '1.8s',
                metadata: {
                    'Matched Cases': '2',
                    'Top Similarity': '0.88',
                    'Past Resolution': 'Automated Remediation',
                    'Confidence': 'High'
                }
            },
        },
        {
            id: 'rca-engine',
            name: 'RCA Correlator Engine',
            description: 'Final multi-modal synthesis of root cause evidence',
            status: 'complete',
            details: {
                input: ['All evidence stages', 'Correlation results'],
                processing: 'Correlator LLM process completed.',
                output: 'Final rca confirmed.',
                duration: '3.1s',
                metadata: {
                    'Final RCA': `${type} detected on ${device}`,
                    'Remedy Suggestion': 'Execute recommended playbook',
                    'Evidence Strength': 'Strong',
                    'Impact Status': 'Identified'
                }
            },
        },
    ]
};

const generateRemediationSteps = (id: string, type: string, device: string): RemediationStep[] => [
    { id: `REM-${id}-01`, phase: 'Immediate', action: 'Validate Signal Drift', description: `Running health checks on ${device} to confirm ${type.toLowerCase()} error codes and current health state.`, status: 'complete', duration: '30s', automated: true, command: `show ${type.toLowerCase()} diag`, verification: ['Exit code 0', 'Signal stability > 90%'] },
    { id: `REM-${id}-02`, phase: 'Immediate', action: 'Isolate Impacted Segment', description: 'Applying temporary traffic micro-segmentation to prevent lateral impact propagation.', status: 'pending', duration: '1m', automated: true, command: 'microseg --isolate --source ' + device, verification: ['VLAN isolation confirmed', 'Packet flow sanitized'] },
    { id: `REM-${id}-03`, phase: 'Temporary', action: 'Execute Adaptive Payload', description: `Applying remediation payload tailored for ${type.replace(/_/g, ' ')}.`, status: 'pending', duration: '3m', automated: true, command: `./apply_fix.sh --incident ${id} --target ${device}`, verification: ['Target health restored', 'Latency < 50ms'] },
    { id: `REM-${id}-04`, phase: 'Temporary', action: 'Post-Execution Verification', description: 'Running end-to-end synthetic transactions to verify full path restoration.', status: 'pending', duration: '2m', automated: true, command: 'synthetic_probe --target ' + device, verification: ['SLA compliance 100%', 'No retries detected'] },
    { id: `REM-${id}-05`, phase: 'Long-term', action: 'Policy Configuration Update', description: 'Generating permanent configuration change request for the NOC management office.', status: 'pending', duration: '5m', automated: false, verification: ['PR submitted', 'Admin approval pending'] },
    { id: `REM-${id}-06`, phase: 'Long-term', action: 'Close-Loop Lifecycle Update', description: 'Recording lifecycle event in the global incident knowledge base for future training.', status: 'pending', duration: '1m', automated: true, command: 'kb_client upload --case ' + id, verification: ['KB entry created', 'Vector store updated'] }
];

const createPlaceholderData = (id: string, type: string, device: string, summary?: string, remedyTitle?: string): ClusterSpecificData => ({
    clusterId: id,
    rcaMetadata: { rootEventId: `evt_${id}`, rootEventType: type, timestamp: new Date().toISOString(), device, severity: 'Critical' },
    rcaSummary: summary || `Analysis of the ${type} event on ${device}. High-confidence correlation suggests a persistent failure in the ${type.toLowerCase()} module, leading to service degradation across dependent nodes.`,
    remedyTitle: remedyTitle || `Remediate ${type.replace(/_/g, ' ')}`,
    rcaProcessSteps: generateRCASteps(id, type, device),
    dataEvidence: [
        { source: 'System Logs', type: 'Logs', count: 42, samples: [`${device}: ${type} threshold exceeded`, `${device}: Critical hardware interrupt`, `${device}: Neighbor loss detected`], relevance: 98 },
        { source: 'Interface Stats', type: 'Metrics', count: 120, samples: ['error_count: 500/min', 'discard_rate: 12%', 'utilization: 98%'], relevance: 85 },
        { source: 'Chassis Telemetry', type: 'Metrics', count: 25, samples: ['Internal temp: 45C', 'CPU: 88%', 'Buffer usage: 92%'], relevance: 90 }
    ],
    correlatedChildEvents: [
        { id: `EVT-${id}-CH-01`, alertType: 'INTERFACE_UP_DOWN', source: device, severity: 'Major', timestamp: new Date().toISOString(), correlationScore: 0.96, correlationReason: 'Temporal & Topological Proximity', message: `Interface Gi0/1 on ${device} is flapping` },
        { id: `EVT-${id}-CH-02`, alertType: 'BGP_ADJACENCY_CHANGE', source: device, severity: 'Critical', timestamp: new Date().toISOString(), correlationScore: 0.89, correlationReason: 'Impact Propagation', message: 'BGP session lost with peer 10.1.1.2' }
    ],
    impactedAssets: [
        { id: 'auth-service', name: 'Auth Service', type: 'Microservice', severity: 'Critical', status: 'Degraded', dependencies: [device] },
        { id: 'pay-service', name: 'Payment Service', type: 'Microservice', severity: 'Major', status: 'Slow', dependencies: ['auth-service'] }
    ],
    impactTopology: {
        nodes: [
            { id: device, label: device, type: 'device', status: 'critical', severity: 'Critical' },
            { id: 'switch-agg-01', label: 'Agg Switch 01', type: 'device', status: 'warning', severity: 'Major' },
            { id: 'auth-service', label: 'Auth Service', type: 'service', status: 'critical', severity: 'Critical' },
            { id: 'pay-service', label: 'Payment Service', type: 'service', status: 'warning', severity: 'Major' },
            { id: 'end-users', label: 'End Users', type: 'user', status: 'critical', severity: 'Critical' }
        ],
        edges: [
            { from: device, to: 'switch-agg-01', type: 'connection' },
            { from: 'switch-agg-01', to: 'auth-service', type: 'dependency' },
            { from: 'auth-service', to: 'pay-service', type: 'dependency' },
            { from: 'pay-service', to: 'end-users', type: 'impact' }
        ]
    },
    remediationSteps: generateRemediationSteps(id, type, device),
    remediationKB: [
        { title: `${type} Troubleshooting Guide`, relevance: 95, url: `/kb/${type.toLowerCase()}-guide` },
        { title: 'Standard Service Recovery PR #452', relevance: 88, url: '#' }
    ],
});

// ============================================================================
// SPECIFIC DETAILED MOCK DATA (Top Use Cases)
// ============================================================================

// CLU-LC-001: Link Congestion (The Master Sample)
export const CLU_LC_001_Data: ClusterSpecificData = {
    clusterId: 'CLU-LC-001',
    rcaMetadata: { rootEventId: 'EVT-LC-010', rootEventType: 'LINK_CONGESTION', timestamp: '2025-10-28T14:30:00Z', device: 'core-router-dc1', severity: 'Critical' },
    remedyTitle: 'Reconfigure and Stabilize DNS Resolution',
    rcaSummary: 'Backup-Induced Congestion: Unscheduled NFS backup traffic from agent-server-01 consuming >35% link capacity during business hours, causing queue drops and latency spikes on interface Gi0/1/0.',
    rcaProcessSteps: generateRCASteps('CLU-LC-001', 'LINK_CONGESTION', 'core-router-dc1'),
    dataEvidence: [
        { source: 'NetFlow', type: 'Metrics', count: 450, samples: ['DSCP: 0, 76% share', 'Source: agent-server-01', 'Destination: backup-node-dc2'], relevance: 98 },
        { source: 'SNMP', type: 'Metrics', count: 12, samples: ['ifOutDiscards: 542', 'ifUtil: 96%', 'ifErrors: 8'], relevance: 92 },
        { source: 'Interface Logs', type: 'Logs', count: 5, samples: ['Gi0/1/0: Queue full - tail drops active', 'Gi0/1/0: High buffer utilization'], relevance: 88 }
    ],
    correlatedChildEvents: [
        { id: 'EVT-LC-009', alertType: 'PACKET_DISCARD', source: 'core-router-dc1', severity: 'Critical', timestamp: '2025-10-28T14:30:00Z', correlationScore: 0.95, correlationReason: 'Direct Resource Overlap', message: 'Output packet discards on Gi0/1/0' },
        { id: 'EVT-LC-011', alertType: 'HIGH_LATENCY', source: 'core-router-dc1', severity: 'Critical', timestamp: '2025-10-28T14:31:00Z', correlationScore: 0.92, correlationReason: 'Network Congestion Propagation', message: 'Latency to peer router 500 ms' },
        { id: 'EVT-LC-008', alertType: 'CPU_HIGH', source: 'core-router-dc1', severity: 'Major', timestamp: '2025-10-28T14:27:00Z', correlationScore: 0.88, correlationReason: 'Resource Contention', message: 'CPU usage reached 85%' }
    ],
    impactedAssets: [
        { id: 'api-gw', name: 'API Gateway', type: 'Service', severity: 'Critical', status: 'Slow', dependencies: ['core-router-dc1'] },
        { id: 'web-front', name: 'Web Front-end', type: 'Service', severity: 'Major', status: 'Degraded', dependencies: ['api-gw'] }
    ],
    impactTopology: {
        nodes: [
            { id: 'core-router-dc1', label: 'Core Router DC1', type: 'device', status: 'critical', severity: 'Critical' },
            { id: 'api-gw', label: 'API Gateway', type: 'service', status: 'warning', severity: 'Major' },
            { id: 'web-front', label: 'Web UI', type: 'service', status: 'warning', severity: 'Major' },
            { id: 'customers', label: 'Enterprise Users', type: 'user', status: 'critical', severity: 'Critical' }
        ],
        edges: [
            { from: 'core-router-dc1', to: 'api-gw', type: 'dependency' },
            { from: 'api-gw', to: 'web-front', type: 'dependency' },
            { from: 'web-front', to: 'customers', type: 'impact' }
        ]
    },
    remediationSteps: [
        { id: 'REM-LC-01', phase: 'Immediate', action: 'Verify Backup Flows', description: 'Identifying source IP and destination for the unscheduled NFS transfer.', status: 'complete', duration: '45s', automated: true, command: 'show ip flow top-talkers', verification: ['Talker identified: 10.0.1.5'] },
        { id: 'REM-LC-02', phase: 'Immediate', action: 'Apply QoS Policy', description: 'Enable traffic shaping on Gi0/1/0 to prioritize business traffic.', status: 'pending', duration: '2m', automated: true, command: 'policy-map SHAPE_BACKUP; class BACKUP; shape average 100m', verification: ['Policy applied', 'Queue drops: 0'] },
        { id: 'REM-LC-03', phase: 'Temporary', action: 'Redirect Traffic', description: 'Rerouting secondary backup streams to the OOB management network.', status: 'pending', duration: '3m', automated: true, command: 'ip route 10.50.0.0 255.255.0.0 Gi0/9', verification: ['Route active', 'Management link load: 15%'] },
        { id: 'REM-LC-04', phase: 'Temporary', action: 'Alert Backup Owner', description: 'Automated notification to the storage team regarding SLA violation.', status: 'pending', duration: '1m', automated: true, command: 'send_webhook --team storage --msg "Backup blocked"', verification: ['Webhook 202 OK'] },
        { id: 'REM-LC-05', phase: 'Long-term', action: 'Schedule Adjustment', description: 'Modify cron jobs for agent-server-01 to midnight window.', status: 'pending', duration: '1h', automated: false, verification: ['Crontab updated'] },
        { id: 'REM-LC-06', phase: 'Long-term', action: 'Policy Hardening', description: 'Implement permanent rate-limiting for NFS traffic on core interfaces.', status: 'pending', duration: '10m', automated: true, command: 'conf t; interface Gi0/1/0; service-policy input HARDEN_CORE', verification: ['Policy committed'] }
    ],
    remediationKB: [
        { title: 'Link Congestion Remediation', relevance: 98, url: '#' },
        { title: 'QoS Best Practices DC1', relevance: 92, url: '#' },
        { title: 'NFS Performance Tuning', relevance: 85, url: '#' }
    ],
};

// CLU-002: Fiber Cut
export const CLU_002_Data: ClusterSpecificData = createPlaceholderData('CLU-002', 'LINK_DOWN', 'Dist-R4', 'Fiber Cut identified on uplink to Dist-R4. Optical signal loss detected immediately preceding link failure.', 'Dispatch Field Technician');

// CLU-003: Power Supply Failure
export const CLU_003_Data: ClusterSpecificData = createPlaceholderData('CLU-003', 'POWER_SUPPLY_FAIL', 'Core-R2', 'Hardware Failure: Primary Power Supply Unit (PSU-1) failed on Core-R2 causing electrical instability on line cards.', 'Replace Power Supply Unit');

// CLU-004: Traffic Flood
export const CLU_004_Data: ClusterSpecificData = createPlaceholderData('CLU-004', 'CPU_HIGH', 'Dist-R6', 'Traffic Flood: Ingress packet storm on Dist-R6 causing control plane CPU exhaustion.', 'Mitigate DDoS / Traffic Flood');

// CLU-005: Switching Loop
export const CLU_005_Data: ClusterSpecificData = createPlaceholderData('CLU-005', 'MAC_FLAP', 'Core-R1', 'Switching Loop: Layer 2 loop detected on VLAN 100. Rapid MAC address flapping indicates a switching loop.', 'Break Switching Loop');

// CLU-006: Transceiver Failure
export const CLU_006_Data: ClusterSpecificData = createPlaceholderData('CLU-006', 'LINK_DOWN', 'Core-R1', 'Interface Failure: Transceiver failure on Core-R1 Gi0/2/0 detected via DOM metrics.', 'Replace SFP Transceiver');

// CLU-007: Driver Bug
export const CLU_007_Data: ClusterSpecificData = createPlaceholderData('CLU-007', 'LINK_DOWN', 'Core-R2', 'Software Bug: Memory leak in linecard driver on Core-R2 causing interface crash.', 'Patch Linecard Driver');

// Export a map for easy lookup
export const clusterDataMap: Record<string, ClusterSpecificData> = {
    'CLU-LC-001': CLU_LC_001_Data,
    'CLU-12345': createPlaceholderData('CLU-12345', 'DB_CONNECTION_FAILED', 'db-server-01', 'Database connection pool exhaustion due to a connection leak in the payment processing service.', 'Restart Connection Pool'),
    'CLU-12346': createPlaceholderData('CLU-12346', 'DISK_FULL', 'storage-node-03', 'Storage exhaustion on log volume. Unhandled cleanup script failure led to log rotation stall.', 'Prune Old Logs'),
    'CLU-12347': createPlaceholderData('CLU-12347', 'NETWORK_LATENCY', 'router-dc-east-01', 'Network latency spike caused by BGP route flapping with an external peer.', 'Stabilize BGP Peer'),
    'CLU-12348': createPlaceholderData('CLU-12348', 'MEMORY_EXHAUSTION', 'app-server-05', 'JVM heap memory exhaustion on app-server-05.', 'Scale Up Memory'),
    'CLU-12349': createPlaceholderData('CLU-12349', 'SSL_CERT_EXPIRY', 'proxy-ssl-01', 'SSL Certificate expired for proxy-ssl-01 causing connection termination.', 'Renew SSL Certificate'),
    'CLU-12350': createPlaceholderData('CLU-12350', 'CPU_SPIKE', 'worker-node-12', 'Sudden CPU spike on worker-node-12 due to runaway process.', 'Terminate Runaway Process'),
    'CLU-002': CLU_002_Data,
    'CLU-003': CLU_003_Data,
    'CLU-004': CLU_004_Data,
    'CLU-005': CLU_005_Data,
    'CLU-006': CLU_006_Data,
    'CLU-007': CLU_007_Data,
};

export const getClusterData = (id: string): ClusterSpecificData | undefined => {
    return clusterDataMap[id];
};
