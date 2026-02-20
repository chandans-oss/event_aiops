
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
    severity: 'High' | 'Medium' | 'Low';
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
    domain: 'Network' | 'Compute' | 'Storage' | 'Application';
    appliesTo: string[];
    status: 'Enabled' | 'Disabled' | 'Learning';
    severity: 'Critical' | 'Major' | 'Warning';
    steps: PatternStep[];
    tags: string[];

    // Dynamic Content Fields
    logicSummary: string;
    logicSteps: LogicStep[];
    predictedEvents: PredictedEvent[];
    occurrences: PatternOccurrence[];
    simulationType: 'congestion' | 'cpu_spike';
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

export const MOCK_PATTERNS: Pattern[] = [
    {
        id: 'P-Con-01',
        name: 'Congestion buildup before interface instability',
        description: 'Sustained utilization rise + queue growth + early errors leading to packet drops and interface instability.',
        confidence: 0.92,
        seenCount: 7,
        lastSeen: '2 hours ago',
        domain: 'Network',
        appliesTo: ['Routers', 'Switches'],
        status: 'Enabled',
        severity: 'Major',
        tags: ['Congestion', 'Predictive', 'Interface'],
        steps: [
            { id: 'S1', name: 'High Util Warning', description: 'Utilization increasing', icon: TrendingUp },
            { id: 'S2', name: 'Queue Depth Surge', description: 'Queue follows util', icon: Database, delay: '+4m' },
            { id: 'S3', name: 'CRC Errors Rise', description: 'Errors follow queue depth', icon: AlertTriangle, delay: '+2m' },
            { id: 'S4', name: 'Packet Drop Event', description: 'Error to Packet Drop', icon: Activity, delay: '+1m' },
            { id: 'S5', name: 'Interface Flap', description: 'P(Flap|Drop) ~ 0.72', icon: Activity, delay: '1-2 min' },
            { id: 'S6', name: 'Link Down', description: 'P(Down|Flap) ~ 0.55', icon: Network }
        ],
        logicSummary: 'Saturation-to-Failure Sequence:',
        logicSteps: [
            { order: 1, title: 'Traffic Overload', description: 'Interface exceeds capacity limits.', color: 'blue' },
            { order: 2, title: 'Buffer Saturation', description: 'Packet queues fill; memory exhaustion.', color: 'amber' },
            { order: 3, title: 'Connection Collapse', description: 'Sustained drops cause link failure.', color: 'red' }
        ],
        predictedEvents: [
            { name: 'PACKET_DROP', probability: 0.88, severity: 'High', title: 'Predicted Event', subtitle: 'Random Forest Accuracy' },
            { name: 'INTERFACE_FLAP', probability: 0.85, severity: 'Medium', title: 'Predicted Event', subtitle: 'Random Forest Accuracy' },
            { name: 'LINK_DOWN', probability: 0.55, severity: 'High', title: 'Predicted Event', subtitle: 'Co-occurrence Boost' }
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
        name: 'BGP Session Flap correlated with CPU Spike',
        description: 'Control plane CPU spike causing BGP hold-timer expiry.',
        confidence: 0.87,
        seenCount: 4,
        lastSeen: 'Yesterday',
        domain: 'Network',
        appliesTo: ['Core Routers'],
        status: 'Enabled',
        severity: 'Critical',
        tags: ['BGP', 'Control Plane', 'CPU'],
        steps: [
            { id: 'S1', name: 'CPU Spike', description: 'CPU > 90%', icon: Cpu },
            { id: 'S2', name: 'Keep-alive Missed', description: 'Peer unavailable', icon: Activity, delay: '60s' },
            { id: 'S3', name: 'BGP Down', description: 'Route withdrawal', icon: Network }
        ],
        logicSummary: 'Resource Starvation Pattern:',
        logicSteps: [
            { order: 1, title: 'CPU Starvation', description: 'Process consumes 99% CPU.', color: 'blue' },
            { order: 2, title: 'Protocol Block', description: 'BGP Keep-alives dropped.', color: 'amber' },
            { order: 3, title: 'Session Timeout', description: 'Hold-timer expires; neighbor down.', color: 'red' }
        ],
        predictedEvents: [
            { name: 'BGP_SESSION_DOWN', probability: 0.92, severity: 'High', title: 'BGP Neighbor Down', subtitle: 'Peer Unreachable' },
            { name: 'ROUTE_WITHDRAWAL', probability: 0.88, severity: 'High', title: 'Route Withdrawal', subtitle: 'Prefixes Withdrawn' }
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

];
