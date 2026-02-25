
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
    const baseUtil = severity === 'High' ? 65 : severity === 'Med' ? 45 : 25;
    const pointCount = 24; // ~2 mins of data at 5s intervals

    for (let i = 0; i < pointCount; i++) {
        // Organic multi-frequency noise
        const primaryNoise = Math.sin(i * 0.5 + variation) * 4;
        const jitter = (Math.random() - 0.5) * (severity === 'High' ? 12 : 6);
        const microJitter = (Math.random() - 0.5) * 3;

        // Pattern logic
        let utilProgress = (i / pointCount) * (severity === 'High' ? 35 : 20);
        let util = baseUtil + utilProgress + primaryNoise + jitter + microJitter;

        // Drops kicks in exponentially after 60% progress
        let drops = 0;
        if (i > pointCount * 0.6) {
            const dropImpact = Math.pow(i - (pointCount * 0.6), 1.8) * (variation % 2 === 0 ? 1.5 : 0.8);
            drops = dropImpact + (Math.random() * 5);
            if (severity === 'High') drops += 10;
        }

        // CRC errors appear late and bursty
        let errors = 0;
        if (i > pointCount * 0.8 && severity !== 'Low') {
            errors = (i - pointCount * 0.8) * 2 + (Math.random() > 0.7 ? 5 : 0);
        }

        data.push({
            time: `${i * 5}s`,
            utilization: Math.min(100, Math.max(0, util)),
            drops: Math.round(drops),
            errors: Math.round(errors)
        });
    }
    return data;
};

const generateCpuData = (peak: number, variation: number = 1) => {
    const data = [];
    const pointCount = 25;
    const spikeStart = Math.floor(pointCount * 0.5) + (variation % 5);
    const baseLoad = 15 + (variation * 7) % 15;

    for (let i = 0; i < pointCount; i++) {
        const jitter = (Math.random() - 0.5) * 8;
        let cpu = baseLoad + (Math.sin(i * 0.4) * 5) + jitter;

        if (i >= spikeStart) {
            // Plateau/Saturation phase
            cpu = peak - (Math.random() * 6);
        } else if (i >= spikeStart - 4) {
            // Aggressive ramp-up
            const progress = (i - (spikeStart - 4)) / 4;
            cpu = baseLoad + (peak - baseLoad) * progress + jitter;
        }

        const bgpState = i > spikeStart + 5 ? 0 : 1;

        data.push({
            time: `${i * 5}s`,
            cpu: Math.min(100, Math.max(0, cpu)),
            bgpState: bgpState
        });
    }
    return data;
};

const generateCpuSaturation = (variation: number = 1) => {
    const data = [];
    const pointCount = 25;
    for (let i = 0; i < pointCount; i++) {
        const noise = (Math.random() - 0.5) * 6;
        const cpu = Math.min(100, 40 + (i * 2.8) + noise + (Math.sin(i * 0.5) * 4));
        const lossThreshold = Math.floor(pointCount * 0.7);
        const pingLoss = i > lossThreshold ? Math.min(100, (i - lossThreshold) * 12 + (Math.random() * 15)) : (Math.random() > 0.8 ? 2 : 0);
        data.push({
            time: `${i * 5}s`,
            cpuUtil: Math.round(cpu),
            pingLoss: Math.round(pingLoss)
        });
    }
    return data;
};

const generateLinkPhysData = (variation: number = 1) => {
    const data = [];
    const pointCount = 25;
    for (let i = 0; i < pointCount; i++) {
        const baseNoise = Math.random() * 5;
        const errThreshold = Math.floor(pointCount * 0.4);
        const errors = i > errThreshold ? (i - errThreshold) * 45 * variation + (Math.random() * 40) : baseNoise;

        const discThreshold = Math.floor(pointCount * 0.6);
        const discards = i > discThreshold ? (i - discThreshold) * 15 * variation + (Math.random() * 20) : 0;

        data.push({
            time: `${i * 5}s`,
            inErrors: Math.round(errors),
            discards: Math.round(discards)
        });
    }
    return data;
};

const generateFwLoadData = (variation: number = 1) => {
    const data = [];
    const pointCount = 25;
    for (let i = 0; i < pointCount; i++) {
        const sessions = 10000 + (Math.pow(i, 2.7) * 40 * variation) + (Math.random() * 500);
        const noise = (Math.random() - 0.5) * 10;
        const cpu = Math.min(100, 25 + (i * 3.2) + noise + (Math.sin(i * 0.4) * 5));
        const latThreshold = Math.floor(pointCount * 0.7);
        const latency = i > latThreshold ? 12 + Math.pow(i - latThreshold, 2) * 4 + (Math.random() * 15) : 10 + (Math.random() * 5);
        data.push({
            time: `${i * 5}s`,
            sessions: Math.round(sessions),
            fwCpu: Math.round(cpu),
            latency: Math.round(latency)
        });
    }
    return data;
};

const generateQoeData = (variation: number = 1) => {
    const data = [];
    const pointCount = 25;
    for (let i = 0; i < pointCount; i++) {
        const jitNoise = (Math.random() - 0.5) * 4;
        const jitter = 2 + (i * 1.4 * variation) + jitNoise + (Math.sin(i * 0.6) * 3);
        const varNoise = (Math.random() - 0.5) * 6;
        const latencyVar = 5 + (Math.pow(i, 1.25) * variation) + varNoise + (Math.sin(i * 0.3) * 5);
        data.push({
            time: `${i * 5}s`,
            jitter: Math.round(jitter * 10) / 10,
            latencyVar: Math.round(latencyVar * 10) / 10
        });
    }
    return data;
};

export const MOCK_PATTERNS: Pattern[] = [
    {
        id: 'P-Con-01',
        name: 'Interface Flap Pattern',
        description: 'Link Util ↑ | Buffer Util ↑ | CRC Errors ↑ |\n PACKET_LOSS / INTERFACE_FLAP ',
        confidence: 0.99,
        seenCount: 7,
        lastSeen: '2 hours ago',
        domain: 'Network',
        appliesTo: ['Routers', 'Switches'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['Congestion', 'Predictive', 'Interface', 'Pattern Match'],
        steps: [
            { id: 'S1', name: 'Link Util', description: '50% -> 90%', icon: TrendingUp, delay: '0m' },
            { id: 'S2', name: 'Buffer Util', description: '20% -> 85%', icon: Database, delay: '+4m' },
            { id: 'S3', name: 'CRC Errors', description: '0 -> 70', icon: AlertTriangle, delay: '+2m' },
            { id: 'S4', name: 'Packet Loss', description: '0% -> 5%', icon: Activity, delay: '+5m' },
            { id: 'S5', name: 'Critical Breach', description: 'INTERFACE_FLAP', icon: ShieldCheck, delay: '(FINAL)' }
        ],
        logicSummary: 'Saturation-to-Failure Sequence:',
        logicSteps: [
            { order: 1, title: 'Traffic Overload', description: 'Util ↑', color: 'blue' },
            { order: 2, title: 'Buffer Saturation', description: 'Buffer Util ↑', color: 'amber' },
            { order: 3, title: 'Physical Layer Errors', description: 'CRC Errors ↑', color: 'amber' },
            { order: 4, title: 'Packet Loss', description: 'Loss ↑', color: 'amber' },
            { order: 5, title: 'Connection Collapse', description: 'Link Flap', color: 'red' }
        ],
        predictedEvents: [
            { name: 'PACKET_LOSS', probability: 0.92, severity: 'Major', title: '', subtitle: 'Edge congestion detected' },
            { name: 'INTERFACE_FLAP', probability: 0.99, severity: 'Critical', title: '', subtitle: 'Interface stability failure' }
        ],
        drillDownMetrics: [
            { label: 'Utilization', value: 'Gradual rise from ~50% → ~90%', icon: 'trending', color: 'blue' },
            { label: 'Buffer Utilization', value: 'Starts increasing after util crosses ~80%', icon: 'database', color: 'amber' },
            { label: 'CRC / Drop errors', value: 'Begin to appear when queue > ~70% (Total Discards)', icon: 'alert', color: 'red' }
        ],
        occurrences: [
            {
                id: 'OCC-2026-001',
                timestamp: new Date(Date.now() - 3600000).toLocaleString(),
                severity: 'Major',
                summary: 'Full Sequence: Congestion to Flap',
                outcomes: ['Packet Loss', 'Link Down', 'BGP Flap'],
                metricData: generateCongestionData('High', 1),
                events: [
                    {
                        id: '260501197808', timestamp: 'Feb 25, 2026 02:40 PM',
                        title: 'High Utilization', subtitle: 'Traffic burst detected', severity: 'Warning',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: '85%', threshold: '> 80%'
                    },
                    {
                        id: '260501197809', timestamp: 'Feb 25, 2026 02:41 PM',
                        title: 'Buffer Overflow', subtitle: 'Output queue drops', severity: 'Major',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: '1450', threshold: '> 1000'
                    },
                    {
                        id: '260501197810', timestamp: 'Feb 25, 2026 02:43 PM',
                        title: 'Availability', subtitle: 'Interface Reset', severity: 'Critical',
                        nodeName: '111004203', nodeIp: '10.0.4.203', resource: 'Gi1/0/1',
                        alertValue: 'Down', threshold: 'State'
                    }
                ]
            },
            {
                id: 'OCC-2026-002',
                timestamp: new Date(Date.now() - 86400000).toLocaleString(),
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
                timestamp: new Date(Date.now() - 172800000).toLocaleString(),
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
        description: 'CPU UTIL↑ | BGP_STATE ↓ | ROUTE_WITHDRAWAL',
        confidence: 0.87,
        seenCount: 5,
        lastSeen: 'Yesterday',
        domain: 'Network',
        appliesTo: ['Core Routers'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['BGP', 'Control Plane', 'CPU'],
        steps: [
            { id: 'S1', name: 'CPU Util', description: '20% -> 98%', icon: Cpu, delay: '0s' },
            { id: 'S2', name: 'Keep-alive Missed', description: 'Active -> Timeout', icon: Activity, delay: '+60s' },
            { id: 'S3', name: 'BGP Down', description: 'Established -> IDLE', icon: Network, delay: '+30s' }
        ],
        logicSummary: 'Resource Starvation Pattern:',
        logicSteps: [
            { order: 1, title: 'CPU Starvation', description: 'CPU ↑', color: 'blue' },
            { order: 2, title: 'Protocol Block', description: 'BGP_STATE ↓', color: 'amber' },
            { order: 3, title: 'Session Timeout', description: 'ROUTE_WITHDRAWAL', color: 'red' }
        ],
        predictedEvents: [
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
                timestamp: new Date(Date.now() - 259200000).toLocaleString(),
                severity: 'Critical',
                summary: 'Outage: Core-01 BGP Failure',
                outcomes: ['BGP Session Down', 'Route Withdrawals'],
                metricData: generateCpuData(95, 1),
                events: [
                    {
                        id: '260501199001', timestamp: new Date(Date.now() - 259200000 - 600000).toLocaleString(),
                        title: 'BGP Neighbor Change', subtitle: 'Neighbor 10.10.10.5 Down', severity: 'Critical',
                        nodeName: 'Core-01', nodeIp: '10.10.10.1', resource: 'bgp-100',
                        alertValue: 'Down', threshold: 'State != Established'
                    }
                ]
            },
            {
                id: 'OCC-2026-042',
                timestamp: new Date(Date.now() - 604800000).toLocaleString(),
                severity: 'Critical',
                summary: 'Repeated Flap: Core-02',
                outcomes: ['BGP Flap', 'High CPU'],
                metricData: generateCpuData(92, 2),
                events: []
            },
            {
                id: 'OCC-2026-039',
                timestamp: new Date(Date.now() - 1209600000).toLocaleString(),
                severity: 'Major',
                summary: 'Transient CPU Spike',
                outcomes: ['High CPU'],
                metricData: generateCpuData(85, 3),
                events: []
            },
            {
                id: 'OCC-2025-045',
                timestamp: new Date(Date.now() - 2592000000).toLocaleString(),
                severity: 'Major',
                summary: 'Previous CPU Anomaly',
                outcomes: ['High CPU'],
                metricData: generateCpuData(80, 4),
                events: []
            },
            {
                id: 'OCC-2025-032',
                timestamp: new Date(Date.now() - 3456000000).toLocaleString(),
                severity: 'Warning',
                summary: 'Minor BGP Fluctuation',
                outcomes: ['High CPU'],
                metricData: generateCpuData(75, 5),
                events: []
            }
        ],
        simulationType: 'cpu_spike'
    },
    {
        id: 'P-Dev-CPU-01',
        name: 'Device Reboot Pattern',
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
            { id: 'S1', name: 'CPU Utilization Rise', description: '40% -> 95%', icon: TrendingUp, delay: '0m' },
            { id: 'S2', name: 'Status Code Change', description: '200 -> 503', icon: ShieldCheck, delay: '+5m' },
            { id: 'S3', name: 'Ping Intermittent', description: '0% -> 15% Loss', icon: Activity, delay: '+5m' },
            { id: 'S4', name: 'Availability Drops', description: '100% -> 0%', icon: AlertTriangle, delay: '+2m' },
        ],
        logicSummary: 'CPU Exhaustion to OS Failure:',
        logicSteps: [
            { order: 1, title: 'Compute Starvation', description: 'CPU ↑', color: 'blue' },
            { order: 2, title: 'ICMP Packet Loss', description: 'PING_LOSS ↑', color: 'amber' },
            { order: 3, title: 'System Hang/Reboot', description: 'AVAILABILITY ↓', color: 'red' }
        ],
        predictedEvents: [
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
                timestamp: new Date(Date.now() - 345600000).toLocaleString(),
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
                timestamp: new Date(Date.now() - (i + 5) * 86400000).toLocaleString(),
                severity: 'Critical' as const,
                summary: `Historical CPU Crash #${i + 1}`,
                outcomes: ['Device Unreachable'],
                metricData: generateCpuSaturation(1.1 + (i * 0.1)),
                events: [
                    {
                        id: `HYST_${i}1`, timestamp: new Date(Date.now() - (i + 5) * 86400000 - 3600000).toLocaleString(),
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
            { id: 'S1', name: 'In Errors Gradual Rise', description: '0 -> 120 cps', icon: Activity, delay: '0m' },
            { id: 'S2', name: 'Out Errors / Discards Rise', description: '5 -> 50 discards', icon: AlertTriangle, delay: '+5m' },
            { id: 'S3', name: 'Duplex Mismatch (Optional)', description: 'Full -> Half', icon: Database, delay: '+2m' },
            { id: 'S4', name: 'Interface Flapping', description: 'Up -> Down / Flap', icon: Zap, delay: '+5m' },
        ],
        logicSummary: 'Physical Layer Decay:',
        logicSteps: [
            { order: 1, title: 'Signal Degradation', description: 'ERRORS ↑', color: 'blue' },
            { order: 2, title: 'Frame Discards', description: 'DISCARDS ↑', color: 'amber' },
            { order: 3, title: 'Carrier Loss', description: 'INTERFACE_FLAP', color: 'red' }
        ],
        predictedEvents: [
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
                timestamp: new Date(Date.now() - 432000000).toLocaleString(),
                severity: 'Major',
                summary: 'S1-Eth2 Optics Failure',
                outcomes: ['Interface Flap', 'Link Down'],
                metricData: generateLinkPhysData(1.5),
                events: [
                    {
                        id: '99011X11', timestamp: new Date(Date.now() - 432000000 - 600000).toLocaleString(),
                        title: 'CRC Errors Rise', subtitle: 'Input Errors Spike', severity: 'Warning',
                        nodeName: 'Sw-Aggregation-01', nodeIp: '10.5.2.1', resource: 'Eth2',
                        alertValue: '120 cps', threshold: '> 50 cps'
                    },
                    {
                        id: '99011X12', timestamp: new Date(Date.now() - 432000000 - 120000).toLocaleString(),
                        title: 'Interface Flapping', subtitle: 'Link state changing', severity: 'Major',
                        nodeName: 'Sw-Aggregation-01', nodeIp: '10.5.2.1', resource: 'Eth2',
                        alertValue: 'Flap', threshold: 'State Stability'
                    }
                ]
            },
            ...Array.from({ length: 13 }).map((_, i) => ({
                id: `OCC-OPTICS-${i}`,
                timestamp: new Date(Date.now() - (i + 10) * 86400000).toLocaleString(),
                severity: 'Major' as const,
                summary: `Transceiver Decay #${i + 1}`,
                outcomes: ['Interface Flap'],
                metricData: generateLinkPhysData(1.2 + (i * 0.05)),
                events: [
                    {
                        id: `HYST_OPT_${i}1`, timestamp: new Date(Date.now() - (i + 10) * 86400000 - 900000).toLocaleString(),
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
            { id: 'S1', name: 'Total Sessions Spike', description: '10k -> 80k', icon: Grid, delay: '0m' },
            { id: 'S2', name: 'CPU Utilization Rise', description: '30% -> 99%', icon: Cpu, delay: '+2m' },
            { id: 'S3', name: 'Latency Increases', description: '10ms -> 150ms', icon: Clock, delay: '+3m' },
            { id: 'S4', name: 'Packet Loss', description: '0% -> 2%', icon: AlertTriangle, delay: '+3m' },
        ],
        logicSummary: 'Session Table Exhaustion:',
        logicSteps: [
            { order: 1, title: 'Connection Flood', description: 'SESSIONS ↑', color: 'blue' },
            { order: 2, title: 'Processing Bottleneck', description: 'CPU ↑', color: 'amber' },
            { order: 3, title: 'Tail Drop Failures', description: 'PACKET_LOSS', color: 'red' }
        ],
        predictedEvents: [
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
                timestamp: new Date(Date.now() - 1296000000).toLocaleString(),
                severity: 'Critical',
                summary: 'Edge FW Session Exhaustion',
                outcomes: ['Packet Loss', 'High Latency'],
                metricData: generateFwLoadData(1.2),
                events: [
                    {
                        id: 'FW_EV_01', timestamp: new Date(Date.now() - 1296000000 - 120000).toLocaleString(),
                        title: 'Packet Drop', subtitle: 'Buffer Exhaustion', severity: 'Critical' as const,
                        nodeName: 'Edge-FW-01', nodeIp: '192.168.254.1', resource: 'DataPlane',
                        alertValue: '1500 pps', threshold: '> 0 pps'
                    }
                ]
            },
            ...Array.from({ length: 5 }).map((_, i) => ({
                id: `OCC-FW-${i}`,
                timestamp: new Date(Date.now() - (i + 15) * 86400000).toLocaleString(),
                severity: 'Critical' as const,
                summary: `Firewall Overload #${i + 1}`,
                outcomes: ['Packet Loss'],
                metricData: generateFwLoadData(1.0 + (i * 0.2)),
                events: [
                    {
                        id: `FW_EV_1${i}`, timestamp: new Date(Date.now() - (i + 15) * 86400000 - 300000).toLocaleString(),
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
            { id: 'S1', name: 'Utilization Near Threshold', description: '60% -> 85%', icon: Database, delay: '0m' },
            { id: 'S2', name: 'Latency Variance Rise', description: '5ms -> 45ms', icon: Clock, delay: '+1m' },
            { id: 'S3', name: 'Jitter Increases', description: '2ms -> 35ms', icon: Activity, delay: '+2m' }
        ],
        logicSummary: 'Micro-burst Congestion:',
        logicSteps: [
            { order: 1, title: 'Traffic Burst', description: 'UTIL ↑', color: 'blue' },
            { order: 2, title: 'Queuing Delays', description: 'LATENCY ↑', color: 'amber' },
            { order: 3, title: 'Jitter Saturation', description: 'JITTER ↑', color: 'amber' }
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
                timestamp: new Date(Date.now() - 518400000).toLocaleString(),
                severity: 'Warning',
                summary: 'SD-WAN Voice Degradation',
                outcomes: ['SLA Breach', 'RTP Loss'],
                metricData: generateQoeData(1),
                events: [
                    {
                        id: 'QOE_EV_01', timestamp: new Date(Date.now() - 518400000 - 120000).toLocaleString(),
                        title: 'SLA Breach', subtitle: 'Jitter > 30ms', severity: 'Warning' as const,
                        nodeName: 'SDWAN-Branch-5', nodeIp: '10.50.1.1', resource: 'Tunnel-01',
                        alertValue: '35ms', threshold: '< 30ms'
                    }
                ]
            },
            ...Array.from({ length: 21 }).map((_, i) => ({
                id: `OCC-QOE-${i}`,
                timestamp: new Date(Date.now() - (i + 1) * 43200000).toLocaleString(),
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
