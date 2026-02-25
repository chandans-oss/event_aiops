
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
    Monitor,
    Activity,
    Clock,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info,
    Cpu,
    Database,
    Zap,
    Download,
    Globe,
    ChevronLeft,
    ChevronRight,
    Server,
    CpuIcon,
    Terminal,
    Container
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/shared/components/ui/pagination";
import { FleetAgent, fleetAgents } from "../data/fleetData";
import { cn } from "@/shared/lib/utils";

const OSIcon = ({ os }: { os: FleetAgent['os'] }) => {
    switch (os) {
        case 'ubuntu':
            return (
                <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                    <span className="text-[10px] font-bold text-orange-500">U</span>
                </div>
            );
        case 'redhat':
            return (
                <div className="h-8 w-8 rounded-full bg-red-600/20 flex items-center justify-center border border-red-600/30">
                    <span className="text-[10px] font-bold text-red-600">RH</span>
                </div>
            );
        case 'debian':
            return (
                <div className="h-8 w-8 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                    <span className="text-[10px] font-bold text-pink-500">D</span>
                </div>
            );
        case 'windows':
            return (
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-[10px] font-bold text-blue-500">W</span>
                </div>
            );
        case 'alpine':
            return (
                <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <span className="text-[10px] font-bold text-cyan-500">A</span>
                </div>
            );
        case 'container':
            return (
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Container className="h-4 w-4 text-indigo-500" />
                </div>
            );
        default:
            return (
                <div className="h-8 w-8 rounded-full bg-slate-500/20 flex items-center justify-center border border-slate-500/30">
                    <Monitor className="h-4 w-4 text-slate-500" />
                </div>
            );
    }
};

const StatusDot = ({ status }: { status: FleetAgent['heartbeatStatus'] }) => {
    switch (status) {
        case 'online':
            return <div className="h-2 w-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />;
        case 'warning':
            return <div className="h-2 w-2 rounded-full bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.6)]" />;
        case 'offline':
            return <div className="h-2 w-2 rounded-full bg-status-error shadow-[0_0_8px_rgba(239,44,44,0.6)]" />;
        case 'training':
            return <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.6)]" />;
    }
};

const Gauge = ({ value, color }: { value: number | 'NA', color: string }) => {
    if (value === 'NA') return <span className="text-muted-foreground text-xs">NA</span>;
    if (typeof value === 'string') return <span className="text-muted-foreground text-xs">{value}</span>;

    // Normalize large values (like memory in MB) for gauge if needed, 
    // but here we assume it's percentage or we just show the percentage relative to a reasonable max.
    // For simplicity, if > 100, we treat as 100 for the circle but show the real number.
    const percentage = Math.min(100, Math.max(0, value > 100 ? (value / 16384) * 100 : value));
    const label = value > 100 ? (value >= 1024 ? `${(value / 1024).toFixed(1)}GB` : `${value}MB`) : `${value}%`;

    const circumference = 2 * Math.PI * 14;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex items-center gap-2">
            <div className="relative h-9 w-9">
                <svg className="h-full w-full transform -rotate-90">
                    <circle
                        cx="18"
                        cy="18"
                        r="14"
                        className="stroke-muted/20 fill-none"
                        strokeWidth="3"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="14"
                        className={cn("fill-none transition-all duration-1000 ease-out", color)}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-semibold leading-none text-center px-1">{label}</span>
                </div>
            </div>
        </div>
    );
};

const ITEMS_PER_PAGE = 8;

export function AgentFleetTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAgents = fleetAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedAgents = filteredAgents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Grouping for visual separation if needed, but the user asked for categories.
    // We can just display the category as a column or as subheaders.
    // Given the request "names of tha agents and subagents must be there", I will ensure they are prominent.

    return (
        <div className="flex flex-col space-y-4 max-w-6xl mx-auto">
            <div className="glass-card rounded-2xl overflow-hidden border-border/50 shadow-2xl flex flex-col min-h-0">
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-card/30 flex-shrink-0">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight text-foreground">
                            <Activity className="h-5 w-5 text-primary" />
                            AI Agents
                        </h3>
                        <p className="text-sm text-muted-foreground">List of autonomous process, agents and sub-agents.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search agents or categories..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-9 w-64 bg-secondary/50 border border-border/50 rounded-lg px-3 pl-9 text-xs focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
                            />
                            <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <Badge variant="outline" className="gap-1 bg-secondary/30 h-9 px-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <Download className="h-3.5 w-3.5" /> Export
                        </Badge>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <Table className="table-fixed w-full min-w-[1000px]">
                        <TableHeader className="bg-secondary/20 z-10 backdrop-blur-md">
                            <TableRow className="border-border/30">
                                <TableHead className="w-[28%] text-xs font-bold uppercase tracking-wider text-muted-foreground px-6">Agent Name</TableHead>
                                <TableHead className="w-[20%] text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Heartbeat</TableHead>
                                <TableHead className="w-[12%] text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">CPU Usage</TableHead>
                                <TableHead className="w-[12%] text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Memory / Buffer</TableHead>
                                <TableHead className="w-[12%] text-xs font-bold uppercase tracking-wider text-muted-foreground">Load State</TableHead>
                                <TableHead className="w-[16%] text-xs font-bold uppercase tracking-wider text-muted-foreground text-right px-6">Version Info</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedAgents.map((agent) => (
                                <TableRow key={agent.id} className="border-border/20 hover:bg-secondary/30 transition-colors group">
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <OSIcon os={agent.os} />
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">{agent.name}</div>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-[10px] text-muted-foreground font-mono">{agent.ip}</span>
                                                    <Badge className="bg-primary/10 text-primary border-none text-[8px] h-3.5 px-1.5 uppercase font-black tracking-tighter shrink-0">
                                                        {agent.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StatusDot status={agent.heartbeatStatus} />
                                            <span className={cn(
                                                "text-xs font-bold",
                                                agent.heartbeatStatus === 'online' ? "text-status-success" :
                                                    agent.heartbeatStatus === 'offline' ? "text-status-error" :
                                                        agent.heartbeatStatus === 'training' ? "text-blue-400" : "text-status-warning"
                                            )}>
                                                {agent.lastHeartbeat}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Gauge
                                                value={agent.cpu}
                                                color={agent.cpu !== 'NA' && typeof agent.cpu === 'number' && agent.cpu > 80 ? "stroke-status-error" : "stroke-status-success"}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Gauge
                                                value={agent.memory}
                                                color={agent.memory !== 'NA' && typeof agent.memory === 'number' && agent.memory > 70 ? "stroke-status-warning" : "stroke-status-success"}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                "capitalize px-2.5 py-0 h-5 text-[10px] font-black border-none",
                                                agent.load === 'Low' ? "bg-status-success/15 text-status-success" :
                                                    agent.load === 'Medium' ? "bg-status-warning/15 text-status-warning" :
                                                        agent.load === 'High' ? "bg-status-error/15 text-status-error" :
                                                            "bg-muted/30 text-muted-foreground"
                                            )}
                                        >
                                            {agent.load}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex flex-col items-end">
                                            <div className="text-xs font-mono font-bold flex items-center gap-1.5 text-foreground">
                                                <Info className="h-3 w-3 text-primary/60" />
                                                {agent.version}
                                            </div>
                                            <span className="text-[9px] text-muted-foreground opacity-60">
                                                {agent.id}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center pt-2">
                    <Pagination>
                        <PaginationContent className="bg-secondary/10 p-1 rounded-xl border border-border/30 backdrop-blur-sm">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={cn("cursor-pointer hover:bg-secondary/40 transition-colors", currentPage === 1 && "pointer-events-none opacity-50")}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                        className={cn(
                                            "cursor-pointer transition-all",
                                            currentPage === page ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary/40"
                                        )}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className={cn("cursor-pointer hover:bg-secondary/40 transition-colors", currentPage === totalPages && "pointer-events-none opacity-50")}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
