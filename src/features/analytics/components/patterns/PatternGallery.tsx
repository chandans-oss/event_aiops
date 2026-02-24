import { useState } from 'react';
import { Search, BrainCircuit, Activity, Clock, ShieldCheck } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { useToast } from '@/shared/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Pattern, MOCK_PATTERNS } from './PatternData';

interface PatternGalleryProps {
    onSelectPattern: (pattern: Pattern) => void;
}

export function PatternGallery({ onSelectPattern }: PatternGalleryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [enabledPatterns, setEnabledPatterns] = useState<Record<string, boolean>>(
        () => Object.fromEntries(MOCK_PATTERNS.map(p => [p.id, true]))
    );

    const handleTogglePattern = (id: string, name: string, currentStatus: boolean) => {
        const nextStatus = !currentStatus;
        setEnabledPatterns(prev => ({ ...prev, [id]: nextStatus }));
        toast({
            title: `Pattern ${nextStatus ? 'Enabled' : 'Disabled'}`,
            description: `${name} has been ${nextStatus ? 'activated' : 'deactivated'}.`,
            variant: nextStatus ? 'success' : 'destructive',
        });
    };

    const filteredPatterns = MOCK_PATTERNS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Major': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Warning': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Pattern Recognition Library
                    </h1>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search patterns..."
                            className="pl-9 bg-card/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-border/50 bg-card/40 overflow-y-auto h-[max(50vh,600px)] custom-scrollbar">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[180px] text-[12px] font-bold uppercase text-muted-foreground/60">Pattern Name</TableHead>
                            <TableHead className="w-[450px] text-[12px] font-bold uppercase text-muted-foreground/60">Details</TableHead>
                            <TableHead className="text-[12px] font-bold uppercase text-muted-foreground/60">Domain</TableHead>
                            <TableHead className="text-[12px] font-bold uppercase text-muted-foreground/60">Confidence</TableHead>
                            <TableHead className="text-[12px] font-bold uppercase text-muted-foreground/60">Occurrences</TableHead>
                            <TableHead className="text-[12px] font-bold uppercase text-muted-foreground/60">Last Seen</TableHead>
                            <TableHead className="text-right text-[12px] font-bold uppercase text-muted-foreground/60">Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatterns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No patterns found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPatterns.map((pattern) => (
                                <TableRow
                                    key={pattern.id}
                                    className="cursor-pointer hover:bg-muted/5 transition-colors group"
                                    onClick={() => onSelectPattern(pattern)}
                                >
                                    <TableCell className="py-2.5 pl-4">
                                        <span className="text-[15px] font-bold text-foreground tracking-tight">
                                            {pattern.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex border border-border/40 rounded bg-card/40 group-hover:border-primary/30 transition-all max-w-[450px] min-h-[64px]">
                                            {/* Right: Behavioral Grid Section */}
                                            <div className="flex-1 flex flex-col">
                                                {/* Top: Behavioral Sequence */}
                                                <div className="flex-1 flex flex-col justify-center items-center gap-0 py-1">
                                                    {pattern.steps.slice(0, 3).map((step, idx) => (
                                                        <div key={idx} className="text-[9px] font-semibold text-muted-foreground/70 whitespace-nowrap flex items-center gap-1 justify-center w-full">
                                                            <span className="text-foreground/80">{step.name} ↑</span>
                                                            <span className="font-medium text-blue-400/80">({step.description})</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Bottom: Predictive Outcomes */}
                                                <div className="border-t border-border/30 px-2 py-0.5 bg-muted/20 flex justify-center items-center divide-x divide-border/30">
                                                    {pattern.predictedEvents.slice(0, 2).map((evt, idx) => (
                                                        <div key={idx} className="px-3 flex items-center gap-1.5 first:pl-0 last:pr-0">
                                                            <span className="text-[8px] font-bold text-foreground/60 tracking-tighter uppercase">
                                                                {evt.name}
                                                            </span>
                                                            <span className="text-[9px] font-mono font-bold text-blue-400">
                                                                ({(evt.probability * 100).toFixed(0)}%)
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle py-1">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-muted-foreground/30" />
                                            <span className="text-[13px] font-medium text-muted-foreground">{pattern.domain}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle py-1">
                                        <div className="flex items-center gap-2">
                                            <BrainCircuit className="h-4 w-4 text-primary/40" />
                                            <span className="text-[14px] font-bold text-primary/90">{(pattern.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle py-1">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-muted-foreground/30" />
                                            <span className="text-[13px] font-bold text-muted-foreground">{pattern.seenCount}×</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle py-1">
                                        <div className="flex items-center gap-2 text-muted-foreground/60">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span className="text-[12px] font-medium">{pattern.lastSeen}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right align-middle py-1 pr-6" onClick={(e) => e.stopPropagation()}>
                                        <Switch
                                            checked={enabledPatterns[pattern.id] ?? true}
                                            onCheckedChange={() => handleTogglePattern(pattern.id, pattern.name, !!enabledPatterns[pattern.id])}
                                            className="h-4 w-8"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
