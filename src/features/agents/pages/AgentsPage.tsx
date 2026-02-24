import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Bot, BrainCircuit, Workflow, Zap, Clock, MapPin, Network, GitBranch, ShieldAlert, FileText, ArrowRightCircle, Layers, ToggleLeft, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

// Agent Data Definitions
const processAgents = [
    {
        id: 'processor-1',
        name: 'Pre-processing Agent',
        description: 'Normalizes raw telemetry, deduplicates noise, and applies suppression rules.',
        icon: FileText,
        status: 'running',
        taskCount: 15433,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'processor-2',
        name: 'Clustering Agent',
        description: 'Groups related alerts into unified incidents based on pattern matching.',
        icon: GitBranch,
        status: 'running',
        taskCount: 7,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10'
    },
    {
        id: 'processor-3',
        name: 'RCA & Impact Agent',
        description: 'Determines root cause probabilities and calculates service impact blast radius.',
        icon: BrainCircuit,
        status: 'running',
        taskCount: 5,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10'
    },
    {
        id: 'processor-4',
        name: 'Remediation Agent',
        description: 'Executes automated healing workflows and suggests corrective actions.',
        icon: ShieldAlert,
        status: 'idle',
        taskCount: 3,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    }
];

const preprocessingSubAgents = [
    {
        id: 'pre-1',
        name: 'Suppression Sub-Agent',
        description: 'Filters out noise using maintenance windows, business hours, and transient rules.',
        icon: ToggleLeft,
        status: 'running',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'pre-2',
        name: 'Deduplication Sub-Agent',
        description: 'Collapses identical or similar repeating events within defined time windows.',
        icon: Copy,
        status: 'running',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    }
];

const correlationAgents = [
    {
        id: 'corr-1',
        name: 'Temporal Sub-Agent',
        description: 'Correlates events occurring within defined rolling time windows.',
        icon: Clock,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        id: 'corr-2',
        name: 'Spatial Sub-Agent',
        description: 'Groups events by geographical, datacenter, or rack location proximity.',
        icon: MapPin,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        id: 'corr-3',
        name: 'Topological Sub-Agent',
        description: 'Traces dependency graphs to correlate upstream and downstream failures.',
        icon: Network,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        id: 'corr-4',
        name: 'Causal Sub-Agent',
        description: 'Applies predefined heuristic logic and expert rules for causal linkages.',
        icon: ArrowRightCircle,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        id: 'corr-5',
        name: 'Dynamic Sub-Agent',
        description: 'Leverages continuous behavior analysis to match dynamic event flows.',
        icon: Layers,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    },
    {
        id: 'corr-6',
        name: 'ML/GNN Sub-Agent',
        description: 'Utilizes Graph Neural Networks to discover hidden propagation patterns.',
        icon: BrainCircuit,
        status: 'training',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10'
    },
    {
        id: 'corr-7',
        name: 'LLM Semantic Sub-Agent',
        description: 'Synthesizes cross-domain event significance using large language models.',
        icon: Zap,
        status: 'running',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    }
];

// Reusable Agent Card Component
function AgentCard({ agent }: { agent: any }) {
    const Icon = agent.icon;
    return (
        <Card className="glass-card hover-lift overflow-hidden border-border/50 group">
            <CardHeader className="pb-3 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    {agent.status === 'running' && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                        </span>
                    )}
                    {agent.status === 'idle' && (
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
                    )}
                    {agent.status === 'training' && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-status-warning opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-warning"></span>
                        </span>
                    )}
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                        {agent.status}
                    </Badge>
                </div>
                <div className={cn("inline-flex p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110", agent.bgColor)}>
                    <Icon className={cn("h-6 w-6", agent.color)} />
                </div>
                <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
                <CardDescription className="text-sm pt-2 line-clamp-3">
                    {agent.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {agent.taskCount !== undefined && (
                    <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Processed Tasks</span>
                        <span className="text-sm font-bold text-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            {agent.taskCount.toLocaleString()}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function AgentsPage() {
    return (
        <MainLayout>
            <div className="p-8 space-y-12 max-w-7xl mx-auto pb-24 h-full overflow-y-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary flex items-center justify-center border border-primary/20">
                            <Bot className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 tracking-tight">
                                AI Agents Matrix
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                                Monitor and manage the decentralized autonomous agents powering event intelligence, correlation, and resolution processing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Process Agents */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <Workflow className="h-6 w-6 text-indigo-400" />
                        <h2 className="text-2xl font-semibold text-foreground">Core Process Agents</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </section>

                {/* Pre-processing Sub-Agents */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-blue-400" />
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground">Pre-processing Sub-Agents</h2>
                                <p className="text-sm text-muted-foreground mt-1">Specialized data reduction engines operating on raw streams.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {preprocessingSubAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </section>

                {/* Correlation Sub-Agents */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="h-6 w-6 text-emerald-400" />
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground">Correlation Sub-Agents</h2>
                                <p className="text-sm text-muted-foreground mt-1">Specialized correlation and reasoning engines operating in parallel.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {correlationAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
