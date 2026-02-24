import { useState } from 'react';
import { Search, BrainCircuit, Activity, Clock, ShieldCheck } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
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
    const [enabledPatterns, setEnabledPatterns] = useState<Record<string, boolean>>(
        () => Object.fromEntries(MOCK_PATTERNS.map(p => [p.id, true]))
    );

    const togglePattern = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEnabledPatterns(prev => ({ ...prev, [id]: !prev[id] }));
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
                            <TableHead className="w-[200px]">Pattern Name</TableHead>
                            <TableHead className="w-[400px]">Details</TableHead>
                            <TableHead>Domain</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Occurrences</TableHead>
                            <TableHead>Last Seen</TableHead>
                            <TableHead className="text-right">Active</TableHead>
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
                                    className="cursor-pointer hover:bg-muted/50 group"
                                    onClick={() => onSelectPattern(pattern)}
                                >
                                    <TableCell className="align-top py-4">
                                        <span className="text-sm font-semibold group-hover:text-primary transition-colors text-balance">{pattern.name}</span>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs text-muted-foreground leading-snug">{pattern.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                            <span>{pattern.domain}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex items-center gap-2">
                                            <BrainCircuit className="h-4 w-4 text-primary" />
                                            <span className="font-semibold">{(pattern.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                            <span>{pattern.seenCount} times</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{pattern.lastSeen}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right align-top py-4" onClick={(e) => e.stopPropagation()}>
                                        <Switch
                                            checked={enabledPatterns[pattern.id] ?? true}
                                            onCheckedChange={() => setEnabledPatterns(prev => ({ ...prev, [pattern.id]: !prev[pattern.id] }))}
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
