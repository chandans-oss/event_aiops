
import { Bot, Cpu, Database, Activity, Globe, Shield, Terminal, FileText, GitBranch, BrainCircuit, ShieldAlert, ToggleLeft, Copy, Clock, MapPin, Network, ArrowRightCircle, Layers, Zap } from 'lucide-react';

export interface FleetAgent {
    id: string;
    name: string;
    ip: string;
    os: 'ubuntu' | 'redhat' | 'debian' | 'windows' | 'macos' | 'linux' | 'alpine' | 'container';
    customer: string;
    lastHeartbeat: string;
    heartbeatStatus: 'online' | 'offline' | 'warning' | 'training';
    cpu: number | 'NA';
    memory: number | 'NA';
    load: 'Low' | 'Medium' | 'High' | 'NA';
    version: string;
    location: string;
    tags: string[];
    category: 'Core Agent' | 'Pre-processing Sub-Agent' | 'Correlation Sub-Agent';
}

export const fleetAgents: FleetAgent[] = [
    // Core Agents
    {
        id: 'agent-core-1',
        name: 'Pre-processing Agent',
        ip: '10.0.1.10',
        os: 'alpine',
        customer: 'System-Internal',
        lastHeartbeat: 'few seconds ago',
        heartbeatStatus: 'online',
        cpu: 12.5,
        memory: 450,
        load: 'Medium',
        version: '2.4.0 (Stable)',
        location: 'Global-Control-Plane',
        tags: ['Core', 'High-Throughput'],
        category: 'Core Agent'
    },
    {
        id: 'agent-core-2',
        name: 'Clustering Agent',
        ip: '10.0.1.11',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: '2 minutes ago',
        heartbeatStatus: 'online',
        cpu: 4.2,
        memory: 1200,
        load: 'Low',
        version: '2.4.0 (Stable)',
        location: 'Global-Control-Plane',
        tags: ['Core', 'ML-Inference'],
        category: 'Core Agent'
    },
    {
        id: 'agent-core-3',
        name: 'RCA & Impact Agent',
        ip: '10.0.1.12',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: '15 minutes ago',
        heartbeatStatus: 'online',
        cpu: 0.8,
        memory: 850,
        load: 'Low',
        version: '2.4.0 (Stable)',
        location: 'Global-Control-Plane',
        tags: ['Core', 'Analytical'],
        category: 'Core Agent'
    },
    {
        id: 'agent-core-4',
        name: 'Remediation Agent',
        ip: '10.0.1.13',
        os: 'alpine',
        customer: 'System-Internal',
        lastHeartbeat: '1 hour ago',
        heartbeatStatus: 'warning',
        cpu: 'NA',
        memory: 'NA',
        load: 'NA',
        version: '2.4.0 (Stable)',
        location: 'Global-Control-Plane',
        tags: ['Core', 'Active-Response'],
        category: 'Core Agent'
    },

    // Pre-processing Sub-Agents
    {
        id: 'agent-pre-1',
        name: 'Suppression Sub-Agent',
        ip: '10.0.2.10',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 2.1,
        memory: 120,
        load: 'Low',
        version: '1.2.5',
        location: 'Edge-Region-1',
        tags: ['Sub-Agent', 'Filter'],
        category: 'Pre-processing Sub-Agent'
    },
    {
        id: 'agent-pre-2',
        name: 'Deduplication Sub-Agent',
        ip: '10.0.2.11',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 8.4,
        memory: 340,
        load: 'Medium',
        version: '1.2.5',
        location: 'Edge-Region-1',
        tags: ['Sub-Agent', 'Optimization'],
        category: 'Pre-processing Sub-Agent'
    },

    // Correlation Sub-Agents
    {
        id: 'agent-corr-1',
        name: 'Temporal Sub-Agent',
        ip: '10.0.3.10',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 15.6,
        memory: 520,
        load: 'Medium',
        version: '2.1.0',
        location: 'Core-Analytics-Zone',
        tags: ['Correlation', 'Time-Series'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-2',
        name: 'Spatial Sub-Agent',
        ip: '10.0.3.11',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 5.2,
        memory: 180,
        load: 'Low',
        version: '2.1.0',
        location: 'Core-Analytics-Zone',
        tags: ['Correlation', 'Geo-Aware'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-3',
        name: 'Topological Sub-Agent',
        ip: '10.0.3.12',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 22.8,
        memory: 2400,
        load: 'High',
        version: '2.1.0',
        location: 'Core-Analytics-Zone',
        tags: ['Correlation', 'Graph-DB'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-4',
        name: 'Causal Sub-Agent',
        ip: '10.0.3.13',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 12.1,
        memory: 890,
        load: 'Medium',
        version: '2.1.0',
        location: 'Core-Analytics-Zone',
        tags: ['Correlation', 'Logic-Engine'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-5',
        name: 'Dynamic Sub-Agent',
        ip: '10.0.3.14',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 4.5,
        memory: 450,
        load: 'Low',
        version: '2.1.0',
        location: 'Core-Analytics-Zone',
        tags: ['Correlation', 'Real-Time'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-6',
        name: 'ML/GNN Sub-Agent',
        ip: '10.0.3.15',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Training',
        heartbeatStatus: 'training',
        cpu: 98.2,
        memory: 8192,
        load: 'High',
        version: '0.9.8-beta',
        location: 'GPU-Cluster-Alpha',
        tags: ['AI', 'GNN', 'Deep-Learning'],
        category: 'Correlation Sub-Agent'
    },
    {
        id: 'agent-corr-7',
        name: 'LLM Semantic Sub-Agent',
        ip: '10.0.3.16',
        os: 'container',
        customer: 'System-Internal',
        lastHeartbeat: 'Online',
        heartbeatStatus: 'online',
        cpu: 65.4,
        memory: 16384,
        load: 'High',
        version: 'GPT-Integration-v1',
        location: 'Azure-Cloud-East',
        tags: ['AI', 'LLM', 'Context'],
        category: 'Correlation Sub-Agent'
    }
];

export const fleetMetrics = {
    totalAgents: 13,
    activeAgents: 11,
    warningAgents: 1,
    offlineAgents: 0,
    trainingAgents: 1,
    avgCpu: 28.5,
    avgMemory: 2450,
    totalIngestion: '1.2 TB/day',
    throughputTrend: [240, 320, 210, 450, 680, 520, 710, 890, 820, 950]
};
