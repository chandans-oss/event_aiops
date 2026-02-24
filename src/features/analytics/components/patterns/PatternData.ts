
import { useState } from 'react';
import {
    Activity,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Cpu,
    Database,
    Grid,
    LayoutList,
    List,
    Network,
    Search,
    Server,
    TrendingUp,
    Zap,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';

// --- Types ---

export interface PatternStep {
    id: string;
    name: string;
    description: string;
    icon: any; // Lucide Icon
    delay?: string;
}

export interface LogicStep {
    order: number;
    title: string;
    description: string;
    color: 'blue' | 'amber' | 'red';
}

export interface PredictedEvent {
    name: string; // E.g., PACKET_DROP
    probability: number; // 0-1
    severity: 'Critical' | 'Major' | 'High' | 'Medium' | 'Low';
    title: string;
    subtitle: string;
}

export interface EvidenceItem {
    id: string; // Incident/Alarm ID
    timestamp: string;
    title: string;
    subtitle: string;
    severity: 'Critical' | 'Major' | 'Warning';
    nodeName: string;
    nodeIp: string;
    resource: string;
    alertValue: string;
    threshold: string;
}

export interface PatternOccurrence {
    id: string;
    timestamp: string;
    severity: 'Critical' | 'Major' | 'Warning';
    summary: string;
    outcomes: string[];
    events: EvidenceItem[];
    metricData: any[]; // For the chart
}

export interface Pattern {
    id: string;
    name: string;
    description: string;
    confidence: number;
    seenCount: number;
    lastSeen: string;
    domain: 'Network' | 'Compute' | 'Storage' | 'Application' | 'Data Center' | 'Security';
    appliesTo: string[];
    status: 'Enabled' | 'Disabled' | 'Learning';
    severity: 'Critical' | 'Major' | 'Warning';
    steps: PatternStep[];
    tags: string[];

    // Dynamic Content Fields
    logicSummary: string;
    logicSteps: LogicStep[];
    predictedEvents: PredictedEvent[];
    drillDownMetrics: {
        label: string;
        value: string;
        icon: 'trending' | 'database' | 'alert';
        color: 'blue' | 'amber' | 'red';
    }[];
    occurrences: PatternOccurrence[];
    simulationType: 'congestion' | 'cpu_spike' | 'device_cpu_saturation' | 'link_physical_degradation' | 'firewall_overload' | 'qoe_jitter';
}

// --- Mock Data ---

const generateCongestionData = (severity: 'High' | 'Med' | 'Low', variation: number = 1) => {
    const data = [];
    // variation acts as a seed for randomness shape
    const baseUtil = severity === 'High' ? 75 : severity === 'Med' ? 60 : 40;

    // Different slopes based on variation
    const slope = 1.5 + (variation % 3) * 0.5;
    const noiseLevel = 2 + (variation % 4);

    for (let i = 0; i < 15; i++) {
        const t = i;
        // Make some curves linear, some exponential based on variation
        const rise = (variation % 2 === 0) ? (t * slope) : (Math.pow(t, 1.3) * (slope / 2));

        const randomNoise = (Math.random() - 0.5) * noiseLevel * 2;

        let util = baseUtil + rise + randomNoise;

        // Drops kick in late
        let drops = 0;
        if (i > 10) {
            drops = (i - 10) * 10 * ((variation % 2) + 0.5) + Math.random() * 5;
        } else if (severity === 'High') {
            drops = Math.max(0, (Math.random() * 5));
        }

        // Errors
        let errors = 0;
        if (i > 12) {
            errors = (i - 12) * 5 + Math.random() * 2;
        }

        data.push({
            time: `T-${15 - i}m`,
            utilization: Math.min(100, Math.max(0, util)),
            drops: Math.round(drops),
            errors: Math.round(errors)
        });
    }
    return data;
};

const generateCpuData = (peak: number, variation: number = 1) => {
    const data = [];
    const spikeStart = 8 + (variation % 4); // Spike starts at different times
    const baseLoad = 20 + (variation * 5) % 20;

    for (let i = 0; i < 15; i++) {
        let cpu = baseLoad + (Math.random() * 5);

        if (i >= spikeStart) {
            // steep rise
            cpu = peak - (Math.random() * 10);
        } else if (i >= spikeStart - 2) {
            // pre-spike rise
            cpu = baseLoad + ((peak - baseLoad) / 2) + (Math.random() * 10);
        }

        const bgpState = i > spikeStart + 2 ? 0 : 1;

        data.push({
            time: `T-${15 - i}m`,
            cpu: Math.min(100, Math.max(0, cpu)),
            bgpState: bgpState
        });
    }
    return data;
};

const generateCpuSaturation = (variation: number = 1) => {
    const data = [];
    for (let i = 0; i < 15; i++) {
        const cpu = Math.min(100, 50 + (i * 2.8) + (Math.random() * 5 * variation));
        const pingLoss = i > 10 ? Math.min(100, (i - 10) * 15 + (Math.random() * 10)) : 0;
        data.push({
            time: `T-${15 - i}m`,
            cpuUtil: Math.round(cpu),
            pingLoss: Math.round(pingLoss)
        });
    }
    return data;
};

const generateLinkPhysData = (variation: number = 1) => {
    const data = [];
    for (let i = 0; i < 15; i++) {
        const errors = i > 5 ? (i - 5) * 50 * variation + Math.random() * 20 : Math.random() * 5;
        const discards = i > 8 ? (i - 8) * 15 * variation + Math.random() * 10 : 0;
        data.push({
            time: `T-${15 - i}m`,
            inErrors: Math.round(errors),
            discards: Math.round(discards)
        });
    }
    return data;
};

const generateFwLoadData = (variation: number = 1) => {
    const data = [];
    for (let i = 0; i < 15; i++) {
        const sessions = 10000 + (Math.pow(i, 2.7) * 40 * variation);
        const cpu = Math.min(100, 30 + (i * 3.8) + (Math.random() * 8));
        const latency = i > 10 ? 10 + Math.pow(i - 10, 2) * 5 + Math.random() * 10 : 10 + Math.random() * 5;
        data.push({
            time: `T-${15 - i}m`,
            sessions: Math.round(sessions),
            fwCpu: Math.round(cpu),
            latency: Math.round(latency)
        });
    }
    return data;
};

const generateQoeData = (variation: number = 1) => {
    const data = [];
    for (let i = 0; i < 15; i++) {
        const jitter = 2 + (i * 1.5 * variation) + Math.random() * 3;
        const latencyVar = 5 + (Math.pow(i, 1.3) * variation) + Math.random() * 5;
        data.push({
            time: `T-${15 - i}m`,
            jitter: Math.round(jitter * 10) / 10,
            latencyVar: Math.round(latencyVar * 10) / 10
        });
    }
    return data;
};

export const MOCK_PATTERNS: Pattern[] = [
    {
        id: 'P-Con-01',
        name: 'Interface Flap pattern',
        description: 'Link Util ↑ | Buffer Util ↑ | CRC Errors ↑ |\n PACKET_LOSS / INTERFACE_FLAP ',
        confidence: 0.92,
        seenCount: 7,
        lastSeen: '2 hours ago',
        domain: 'Network',
        appliesTo: ['Routers', 'Switches'],
        status: 'Enabled',
        severity: 'Major',
        tags: ['Congestion', 'Predictive', 'Interface'],
        steps: [
            { id: 'S1', name: 'Link Util', description: '50% -> 90%', icon: TrendingUp, delay: '~12m' },
            { id: 'S2', name: 'Buffer Util', description: 'cross 80%', icon: Database, delay: '+4m' },
            { id: 'S3', name: 'CRC Error', description: 'cross 70%', icon: AlertTriangle, delay: '+2m' },
            { id: 'S4', name: 'Critical Breach', description: 'PACKET_LOSS / INTERFACE_FLAP', icon: Activity, delay: '(FINAL)' }
        ],
        logicSummary: 'Saturation-to-Failure Sequence:',
        logicSteps: [
            { order: 1, title: 'Traffic Overload', description: 'Util ↑', color: 'blue' },
            { order: 2, title: 'Buffer Saturation', description: 'Buffer Util ↑', color: 'amber' },
            { order: 3, title: 'Connection Collapse', description: 'Drops ↑', color: 'red' }
        ],
        predictedEvents: [
            { name: 'PACKET LOSS', probability: 0.55, severity: 'High', title: 'Predicted Event', subtitle: 'Random Forest Accuracy' },
            { name: 'LINK_FLAP', probability: 0.90, severity: 'Medium', title: 'Predicted Event', subtitle: 'Random Forest Accuracy' }
        ],
        drillDownMetrics: [
            { label: 'Utilization', value: 'Gradual rise from ~50% → ~90%', icon: 'trending', color: 'blue' },
            { label: 'Buffer Utilization', value: 'Starts increasing after util crosses ~80%', icon: 'database', color: 'amber' },
            { label: 'CRC / Drop errors', value: 'Begin to appear when queue > ~70% (Total Discards)', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-001',
                timestamp: 'Feb 19, 2026 02:43 PM',
                severity: 'Major',
                summary: 'Full Sequence: Congestion to Flap',
                outcomes: ['Packet Loss', 'Link Down', 'BGP Flap'],
                metricData: generateCongestionData('High', 1),
                events: [
                    {
                        id: '260501197808', timestamp: 'Feb 19, 2026 02:40 PM',
                        title: 'High Utilization', subtitle: 'Traffic burst detected', severity: 'Warning',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: '85%', threshold: '> 80%'
                    },
                    {
                        id: '260501197809', timestamp: 'Feb 19, 2026 02:41 PM',
                        title: 'Buffer Overflow', subtitle: 'Output queue drops', severity: 'Major',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: '1450', threshold: '> 1000'
                    },
                    {
                        id: '260501197810', timestamp: 'Feb 19, 2026 02:43 PM',
                        title: 'Availability', subtitle: 'Interface Reset', severity: 'Critical',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: 'Down', threshold: 'State'
                    }
                ]
            },
            {
                id: 'OCC-2026-002',
                timestamp: 'Feb 18, 2026 11:30 AM',
                severity: 'Warning',
                summary: 'Partial: Saturation',
                outcomes: ['High Latency', 'Jitter'],
                metricData: generateCongestionData('Med', 2),
                events: [
                    {
                        id: '260501197748', timestamp: 'Feb 18, 2026 11:28 AM',
                        title: 'High Utilization', subtitle: 'Approaching saturation', severity: 'Warning',
                        nodeName: 'R2-Backbone', nodeIp: '192.168.1.1', resource: 'Gi0/1',
                        alertValue: '92%', threshold: '> 90%'
                    },
                    {
                        id: '260501197750', timestamp: 'Feb 18, 2026 11:30 AM',
                        title: 'Error Rate', subtitle: 'Input errors increasing', severity: 'Major',
                        nodeName: 'R2-Backbone', nodeIp: '192.168.1.1', resource: 'Gi0/1',
                        alertValue: '1.5%', threshold: '> 1%'
                    }
                ]
            },
            {
                id: 'OCC-2026-003',
                timestamp: 'Feb 17, 2026 09:15 AM',
                severity: 'Critical',
                summary: 'Critical Failure: Buffer Overflow',
                outcomes: ['Packet Loss', 'Service Degraded'],
                metricData: generateCongestionData('High', 3),
                events: [
                    {
                        id: '260501196590', timestamp: 'Feb 17, 2026 09:12 AM',
                        title: 'QoS Drop', subtitle: 'Policy policer drops', severity: 'Warning',
                        nodeName: 'Core-Sw-01', nodeIp: '10.0.0.1', resource: 'Gi1/0/1',
                        alertValue: '500pps', threshold: '> 0'
                    },
                    {
                        id: '260501196600', timestamp: 'Feb 17, 2026 09:15 AM',
                        title: 'Buffer Miss', subtitle: 'Hardware buffer exhaustion', severity: 'Critical',
                        nodeName: 'Core-Sw-01', nodeIp: '10.0.0.1', resource: 'Gi1/0/1',
                        alertValue: '1200', threshold: '> 0'
                    }
                ]
            },
            {
                id: 'OCC-2026-004',
                timestamp: 'Feb 15, 2026 04:20 PM',
                severity: 'Major',
                summary: 'Sequence: Congestion Spike',
                outcomes: ['Packet Loss'],
                metricData: generateCongestionData('Med', 4),
                events: []
            },
            {
                id: 'OCC-2026-005',
                timestamp: 'Jan 12, 2026 08:15 AM',
                severity: 'Major',
                summary: 'Chronic Congestion Pattern',
                outcomes: ['Packet Loss'],
                metricData: generateCongestionData('Med', 5),
                events: []
            },
            {
                id: 'OCC-2025-006',
                timestamp: 'Nov 05, 2025 10:30 AM',
                severity: 'Warning',
                summary: 'Early Signs of Saturation',
                outcomes: ['Jitter'],
                metricData: generateCongestionData('Low', 6),
                events: []
            },
            {
                id: 'OCC-2025-007',
                timestamp: 'Aug 14, 2025 03:45 PM',
                severity: 'Critical',
                summary: 'Legacy Switch Link Failure',
                outcomes: ['Link Down', 'Packet Loss'],
                metricData: generateCongestionData('High', 7),
                events: []
            }
        ],
        simulationType: 'congestion'
    },
    {
        id: 'PAT-NET-002',
        name: 'BGP Connection Loss pattern',
        description: 'CPU ↑ | BGP_STATE ↓ | ROUTE_WITHDRAWAL',
        confidence: 0.87,
        seenCount: 4,
        lastSeen: 'Yesterday',
        domain: 'Network',
        appliesTo: ['Core Routers'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['BGP', 'Control Plane', 'CPU'],
        steps: [
            { id: 'S1', name: 'CPU Spike', description: 'CPU ↑', icon: Cpu },
            { id: 'S2', name: 'Keep-alive Missed', description: 'BGP_STATE ↓', icon: Activity, delay: '60s' },
            { id: 'S3', name: 'BGP Down', description: 'ROUTE_WITHDRAWAL', icon: Network }
        ],
        logicSummary: 'Resource Starvation Pattern:',
        logicSteps: [
            { order: 1, title: 'CPU Starvation', description: 'CPU ↑', color: 'blue' },
            { order: 2, title: 'Protocol Block', description: 'BGP_STATE ↓', color: 'amber' },
            { order: 3, title: 'Session Timeout', description: 'ROUTE_WITHDRAWAL', color: 'red' }
        ],
        predictedEvents: [
            { name: 'BGP_SESSION_DOWN', probability: 0.92, severity: 'High', title: 'BGP Neighbor Down', subtitle: 'Peer Unreachable' },
            { name: 'ROUTE_WITHDRAWAL', probability: 0.88, severity: 'High', title: 'Route Withdrawal', subtitle: 'Prefixes Withdrawn' }
        ],
        drillDownMetrics: [
            { label: 'CPU Utilization', value: 'Sustained spike > 95%', icon: 'trending', color: 'blue' },
            { label: 'Control Plane Latency', value: 'Increases after CPU crosses 90%', icon: 'database', color: 'amber' },
            { label: 'BGP Keep-alive Missed', value: 'Detected after 60s of starvation', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-050',
                timestamp: 'Feb 14, 2026 10:00 AM',
                severity: 'Critical',
                summary: 'Outage: Core-01 BGP Failure',
                outcomes: ['BGP Session Down', 'Route Withdrawals'],
                metricData: generateCpuData(95, 1),
                events: [
                    {
                        id: '260501199001', timestamp: 'Feb 14, 2026 10:00 AM',
                        title: 'BGP Neighbor Change', subtitle: 'Neighbor 10.10.10.5 Down', severity: 'Critical',
                        nodeName: 'Core-01', nodeIp: '10.10.10.1', resource: 'bgp-100',
                        alertValue: 'Down', threshold: 'State != Established'
                    }
                ]
            },
            {
                id: 'OCC-2026-042',
                timestamp: 'Feb 02, 2026 04:20 PM',
                severity: 'Critical',
                summary: 'Repeated Flap: Core-02',
                outcomes: ['BGP Flap', 'High CPU'],
                metricData: generateCpuData(92, 2),
                events: []
            },
            {
                id: 'OCC-2026-039',
                timestamp: 'Jan 28, 2026 11:00 AM',
                severity: 'Major',
                summary: 'Transient CPU Spike',
                outcomes: ['High CPU'],
                metricData: generateCpuData(85, 3),
                events: []
            },
            {
                id: 'OCC-2025-045',
                timestamp: 'Oct 10, 2025 09:20 AM',
                severity: 'Major',
                summary: 'Previous CPU Anomaly',
                outcomes: ['High CPU'],
                metricData: generateCpuData(80, 4),
                events: []
            }
        ],
        simulationType: 'cpu_spike'
    },
    {
        id: 'P-Dev-CPU-01',
        name: 'Node Failure pattern',
        description: 'CPU ↑ | STATUS_CHANGE | PING_LOSS ↑ | AVAILABILITY ↓',
        confidence: 0.88,
        seenCount: 9,
        lastSeen: '12 hours ago',
        domain: 'Data Center',
        appliesTo: ['Core Routers', 'Aggregation Switches'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['CPU Saturation', 'Reboot Prediction', 'Unreachable'],
        steps: [
            { id: 'S1', name: 'CPU Utilization Rise', description: 'CPU ↑', icon: TrendingUp },
            { id: 'S2', name: 'Status Code Change', description: 'STATUS_CHANGE', icon: ShieldCheck, delay: '+5m' },
            { id: 'S3', name: 'Ping Intermittent', description: 'PING_LOSS ↑', icon: Activity, delay: '+5m' },
            { id: 'S4', name: 'Availability Drops', description: 'AVAILABILITY ↓', icon: AlertTriangle, delay: '+2m' },
        ],
        logicSummary: 'CPU Exhaustion to OS Failure:',
        logicSteps: [
            { order: 1, title: 'Compute Starvation', description: 'CPU ↑', color: 'blue' },
            { order: 2, title: 'ICMP Packet Loss', description: 'PING_LOSS ↑', color: 'amber' },
            { order: 3, title: 'System Hang/Reboot', description: 'AVAILABILITY ↓', color: 'red' }
        ],
        predictedEvents: [
            { name: 'DEVICE_UNREACHABLE', probability: 0.80, severity: 'Critical', title: 'Predicted Outage', subtitle: 'Strong Pattern Match' },
            { name: 'DEVICE_REBOOT', probability: 0.50, severity: 'Major', title: 'Predicted Reboot', subtitle: 'Watchdog trigger likely' }
        ],
        drillDownMetrics: [
            { label: 'CPU Saturation', value: 'Continuous rise to 100%', icon: 'trending', color: 'blue' },
            { label: 'ICMP Response Time', value: 'Increases linearly with CPU load', icon: 'database', color: 'amber' },
            { label: 'Watchdog Timeout', value: 'Likely after 5m of 100% CPU', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-101',
                timestamp: 'Feb 12, 2026 11:15 AM',
                severity: 'Critical',
                summary: 'Core Router R3 Crash',
                outcomes: ['Device Unreachable', 'Device Reboot'],
                metricData: generateCpuSaturation(1),
                events: [
                    {
                        id: '99011X10', timestamp: 'Feb 12, 2026 11:10 AM',
                        title: 'CPU Warning', subtitle: 'CPU 83%', severity: 'Warning',
                        nodeName: 'R3-Core', nodeIp: '10.0.0.3', resource: 'Control Plane',
                        alertValue: '83%', threshold: '> 80%'
                    },
                    {
                        id: '99011X11', timestamp: 'Feb 12, 2026 11:13 AM',
                        title: 'Device Unreachable', subtitle: 'Ping Timeout', severity: 'Critical',
                        nodeName: 'R3-Core', nodeIp: '10.0.0.3', resource: 'ICMP',
                        alertValue: '100% Loss', threshold: 'Reachability'
                    }
                ]
            },
            ...Array.from({ length: 8 }).map((_, i) => ({
                id: `OCC-2026-10${i + 2}`,
                timestamp: `Feb ${11 - i}, 2026 10:00 AM`,
                severity: 'Critical' as const,
                summary: `Historical CPU Crash #${i + 1}`,
                outcomes: ['Device Unreachable'],
                metricData: generateCpuSaturation(1.1 + (i * 0.1)),
                events: [
                    {
                        id: `HYST_${i}1`, timestamp: `Feb ${11 - i}, 2026 09:50 AM`,
                        title: 'CPU Warning', subtitle: 'CPU > 80%', severity: 'Warning' as const,
                        nodeName: `Agg-Sw-0${i + 1}`, nodeIp: `10.1.${i}.1`, resource: 'System',
                        alertValue: '88%', threshold: '> 80%'
                    }
                ]
            }))
        ],
        simulationType: 'device_cpu_saturation'
    },
    {
        id: 'P-Link-Phys-01',
        name: 'Link Degradation pattern',
        description: 'ERRORS ↑ | DISCARDS ↑ | INTERFACE_FLAP | LINK_DOWN',
        confidence: 0.90,
        seenCount: 14,
        lastSeen: '4 days ago',
        domain: 'Network',
        appliesTo: ['Optical Links', 'WAN Interfaces'],
        status: 'Enabled',
        severity: 'Major',
        tags: ['CRC Errors', 'Link Flap', 'Physical Layer'],
        steps: [
            { id: 'S1', name: 'In Errors Gradual Rise', description: 'ERRORS ↑', icon: Activity },
            { id: 'S2', name: 'Out Errors / Discards Rise', description: 'DISCARDS ↑', icon: AlertTriangle, delay: '+5m' },
            { id: 'S3', name: 'Duplex Mismatch (Optional)', description: 'DUPLEX_MISMATCH', icon: Database, delay: '+2m' },
            { id: 'S4', name: 'Interface Flapping', description: 'INTERFACE_FLAP', icon: Zap, delay: '+5m' },
        ],
        logicSummary: 'Physical Layer Decay:',
        logicSteps: [
            { order: 1, title: 'Signal Degradation', description: 'ERRORS ↑', color: 'blue' },
            { order: 2, title: 'Frame Discards', description: 'DISCARDS ↑', color: 'amber' },
            { order: 3, title: 'Carrier Loss', description: 'INTERFACE_FLAP', color: 'red' }
        ],
        predictedEvents: [
            { name: 'INTERFACE_FLAP', probability: 0.70, severity: 'Medium', title: 'Predicted Flap', subtitle: 'Error rate critical' },
            { name: 'LINK_DOWN', probability: 0.60, severity: 'High', title: 'Predicted Outage', subtitle: 'Link failure imminent' }
        ],
        drillDownMetrics: [
            { label: 'CRC Errors', value: 'Increasing at > 50 cps', icon: 'trending', color: 'blue' },
            { label: 'Output Discards', value: 'Follows CRC error growth', icon: 'database', color: 'amber' },
            { label: 'Link State Stability', value: 'FLAP expected when drops > 2%', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-102',
                timestamp: 'Feb 15, 2026 09:30 AM',
                severity: 'Major',
                summary: 'S1-Eth2 Optics Failure',
                outcomes: ['Interface Flap', 'Link Down'],
                metricData: generateLinkPhysData(1.5),
                events: [
                    {
                        id: '99011X11', timestamp: 'Feb 15, 2026 09:20 AM',
                        title: 'CRC Errors Rise', subtitle: 'Input Errors Spike', severity: 'Warning',
                        nodeName: 'Sw-Aggregation-01', nodeIp: '10.5.2.1', resource: 'Eth2',
                        alertValue: '120 cps', threshold: '> 50 cps'
                    },
                    {
                        id: '99011X12', timestamp: 'Feb 15, 2026 09:28 AM',
                        title: 'Interface Flapping', subtitle: 'Link state changing', severity: 'Major',
                        nodeName: 'Sw-Aggregation-01', nodeIp: '10.5.2.1', resource: 'Eth2',
                        alertValue: 'Flap', threshold: 'State Stability'
                    }
                ]
            },
            ...Array.from({ length: 13 }).map((_, i) => ({
                id: `OCC-OPTICS-${i}`,
                timestamp: `Jan ${28 - i}, 2026 04:00 PM`,
                severity: 'Major' as const,
                summary: `Transceiver Decay #${i + 1}`,
                outcomes: ['Interface Flap'],
                metricData: generateLinkPhysData(1.2 + (i * 0.05)),
                events: [
                    {
                        id: `HYST_OPT_${i}1`, timestamp: `Jan ${28 - i}, 2026 03:45 PM`,
                        title: 'CRC Errors', subtitle: 'Physical degradation', severity: 'Warning' as const,
                        nodeName: `PE-Router-0${(i % 5) + 1}`, nodeIp: `10.20.${i}.1`, resource: `xe-0/0/${i}`,
                        alertValue: 'Rising', threshold: '> 0 cps'
                    }
                ]
            }))
        ],
        simulationType: 'link_physical_degradation'
    },
    {
        id: 'P-FW-Load-01',
        name: 'Firewall Load pattern',
        description: 'SESSIONS ↑ | CPU ↑ | LATENCY ↑ | PACKET_LOSS',
        confidence: 0.86,
        seenCount: 6,
        lastSeen: '1 week ago',
        domain: 'Security',
        appliesTo: ['Edge Firewalls', 'Datacenter Firewalls'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['Firewall', 'Packet Loss', 'Session Exhaustion'],
        steps: [
            { id: 'S1', name: 'Total Sessions Spike', description: 'SESSIONS ↑', icon: Grid },
            { id: 'S2', name: 'CPU Utilization Rise', description: 'CPU ↑', icon: Cpu, delay: '+2m' },
            { id: 'S3', name: 'Latency Increases', description: 'LATENCY ↑', icon: Clock, delay: '+3m' },
            { id: 'S4', name: 'Packet Loss', description: 'PACKET_LOSS', icon: AlertTriangle, delay: '+3m' },
        ],
        logicSummary: 'Session Table Exhaustion:',
        logicSteps: [
            { order: 1, title: 'Connection Flood', description: 'SESSIONS ↑', color: 'blue' },
            { order: 2, title: 'Processing Bottleneck', description: 'CPU ↑', color: 'amber' },
            { order: 3, title: 'Tail Drop Failures', description: 'PACKET_LOSS', color: 'red' }
        ],
        predictedEvents: [
            { name: 'PACKET_LOSS', probability: 0.85, severity: 'High', title: 'Predicted Drops', subtitle: 'Processing limits reached' },
            { name: 'FIREWALL_UNRESPONSIVE', probability: 0.55, severity: 'Critical', title: 'Predicted Isolation', subtitle: 'Total control plane freeze' }
        ],
        drillDownMetrics: [
            { label: 'Session Count', value: 'Approaching max connection limit', icon: 'trending', color: 'blue' },
            { label: 'Packet Processing Latency', value: 'Rises above 50ms', icon: 'database', color: 'amber' },
            { label: 'Policy Drop Rate', value: 'Active when session table is full', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-103',
                timestamp: 'Feb 10, 2026 14:00 PM',
                severity: 'Critical',
                summary: 'Edge FW Session Exhaustion',
                outcomes: ['Packet Loss', 'High Latency'],
                metricData: generateFwLoadData(1.2),
                events: [
                    {
                        id: 'FW_EV_01', timestamp: 'Feb 10, 2026 13:58 PM',
                        title: 'Packet Drop', subtitle: 'Buffer Exhaustion', severity: 'Critical' as const,
                        nodeName: 'Edge-FW-01', nodeIp: '192.168.254.1', resource: 'DataPlane',
                        alertValue: '1500 pps', threshold: '> 0 pps'
                    }
                ]
            },
            ...Array.from({ length: 5 }).map((_, i) => ({
                id: `OCC-FW-${i}`,
                timestamp: `Jan ${15 - i}, 2026 11:00 AM`,
                severity: 'Critical' as const,
                summary: `Firewall Overload #${i + 1}`,
                outcomes: ['Packet Loss'],
                metricData: generateFwLoadData(1.0 + (i * 0.2)),
                events: [
                    {
                        id: `FW_EV_1${i}`, timestamp: `Jan ${15 - i}, 2026 10:55 AM`,
                        title: 'High CPU', subtitle: 'Data Plane 99%', severity: 'Critical' as const,
                        nodeName: `DC-FW-0${i % 2 + 1}`, nodeIp: `172.16.0.${i}`, resource: 'CPU1',
                        alertValue: '99%', threshold: '> 90%'
                    }
                ]
            }))
        ],
        simulationType: 'firewall_overload'
    },
    {
        id: 'P-QoE-01',
        name: 'QoE Degradation pattern',
        description: 'JITTER ↑ | LATENCY_VAR ↑ | UTIL ↑ | PACKET_LOSS',
        confidence: 0.75,
        seenCount: 22,
        lastSeen: '2 days ago',
        domain: 'Application',
        appliesTo: ['VoIP Gateways', 'SD-WAN Tunnels'],
        status: 'Learning',
        severity: 'Warning',
        tags: ['Jitter', 'QoE', 'SLA', 'VoIP'],
        steps: [
            { id: 'S1', name: 'Jitter Increases', description: 'JITTER ↑', icon: Activity },
            { id: 'S2', name: 'Latency Variance Rise', description: 'LATENCY_VAR ↑', icon: Clock, delay: '+1m' },
            { id: 'S3', name: 'Utilization Near Threshold', description: 'UTIL ↑', icon: Database, delay: '+2m' }
        ],
        logicSummary: 'Micro-burst Congestion:',
        logicSteps: [
            { order: 1, title: 'Queuing Delays', description: 'LATENCY ↑', color: 'blue' },
            { order: 2, title: 'Jitter Saturation', description: 'JITTER ↑', color: 'amber' },
            { order: 3, title: 'Active Queue Drop', description: 'UTIL ↑', color: 'red' }
        ],
        predictedEvents: [
            { name: 'PACKET_LOSS', probability: 0.80, severity: 'Medium', title: 'Predicted Loss', subtitle: 'Shaping drop incoming' },
            { name: 'SLA_BREACH', probability: 0.75, severity: 'Medium', title: 'Predicted SLA Breach', subtitle: 'Voice quality degraded' }
        ],
        drillDownMetrics: [
            { label: 'Packet Jitter', value: 'Variance exceeding 30ms', icon: 'trending', color: 'blue' },
            { label: 'Link Utilization', value: 'Over 85% sustained', icon: 'database', color: 'amber' },
            { label: 'QoS Queue Length', value: 'Near overflow on voice priority', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-104',
                timestamp: 'Feb 18, 2026 08:30 AM',
                severity: 'Warning',
                summary: 'SD-WAN Voice Degradation',
                outcomes: ['SLA Breach', 'RTP Loss'],
                metricData: generateQoeData(1),
                events: [
                    {
                        id: 'QOE_EV_01', timestamp: 'Feb 18, 2026 08:28 AM',
                        title: 'SLA Breach', subtitle: 'Jitter > 30ms', severity: 'Warning' as const,
                        nodeName: 'SDWAN-Branch-5', nodeIp: '10.50.1.1', resource: 'Tunnel-01',
                        alertValue: '35ms', threshold: '< 30ms'
                    }
                ]
            },
            ...Array.from({ length: 21 }).map((_, i) => ({
                id: `OCC-QOE-${i}`,
                timestamp: `Feb ${17 - Math.floor(i / 2)}, 2026 0${(i % 8) + 1}:00 PM`,
                severity: 'Warning' as const,
                summary: `Microburst Degradation #${i + 1}`,
                outcomes: ['Jitter Spike'],
                metricData: generateQoeData(0.8 + (Math.random() * 0.5)),
                events: []
            }))
        ],
        simulationType: 'qoe_jitter'
    }
];
