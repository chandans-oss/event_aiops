import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { 
    Typography, 
    Box, 
    Container, 
    Paper, 
    Button, 
    FormControl, 
    Select, 
    MenuItem, 
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Stack,
    LinearProgress
} from '@mui/material';
import { BrainCircuit, Play, Activity, Clock, CheckCircle2, ArrowRight, Gauge, Cpu, Zap, Radio, Database, ShieldAlert, Network, Loader2, PlayCircle, RefreshCw } from 'lucide-react';
import { useTheme as useNextTheme } from 'next-themes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Device naming pattern
const DEVICES = [
    "core-router-dc1",
    "core-router-dc1:Gi0/1/0",
    "core-router-dc1:Gi0/1/1",
    "edge-router-dc1:Gi0/2/0",
    "spine-switch-01:Eth1/1",
    "leaf-switch-02:Eth1/24"
];

// Enhanced Device-Specific Data Generator
const getDeviceData = (device: string) => {
    if (device === "core-router-dc1") {
        return {
            patterns: [
                { id: 'p1', name: "Control Plane CPU Exhaustion", baseConfidence: 0.91, steps: ["interrupt_rate", "process_cpu_peak", "context_switch_delay", "bgp_keepalive_latency"] },
                { id: 'p2', name: "Memory Fragmentation Leak", baseConfidence: 0.78, steps: ["allocated_blocks", "free_memory_contiguous", "malloc_failures"] }
            ],
            events: [
                { id: "EV-CORE-001", type: "Process Watchdog Timeout", severity: "Critical", baseProb: 0.88, time: "T+15m" },
                { id: "EV-CORE-002", type: "BGP Peer Flap", severity: "Major", baseProb: 0.64, time: "T+2h" }
            ],
            stepSpecs: {
                "interrupt_rate": { trend: "up", color: "#3b82f6" },
                "process_cpu_peak": { trend: "up", color: "#3b82f6" },
                "context_switch_delay": { trend: "up", color: "#f97316" },
                "bgp_keepalive_latency": { trend: "up", color: "#ef4444" },
                "allocated_blocks": { trend: "up", color: "#3b82f6" },
                "free_memory_contiguous": { trend: "down", color: "#f97316" },
                "malloc_failures": { trend: "up", color: "#ef4444" }
            }
        };
    }
    
    if (device.includes("Gi0/1/0")) {
        return {
            patterns: [
                { id: 'p3', name: "Optical Transceiver Degradation", baseConfidence: 0.96, steps: ["rx_power_dbm", "tx_bias_current", "pre_fec_ber", "local_fault_count"] },
                { id: 'p4', name: "Cyclic Input Burst Congestion", baseConfidence: 0.84, steps: ["input_peak_rate", "input_buffer_drops", "pause_frame_tx"] }
            ],
            events: [
                { id: "EV-LNK-101", type: "SFP Interface Fault", severity: "Critical", baseProb: 0.94, time: "T+11m" },
                { id: "EV-LNK-102", type: "Link State Down", severity: "Major", baseProb: 0.72, time: "T+46m" }
            ],
            stepSpecs: {
                "rx_power_dbm": { trend: "down", color: "#3b82f6" },
                "tx_bias_current": { trend: "up", color: "#3b82f6" },
                "pre_fec_ber": { trend: "up", color: "#f97316" },
                "local_fault_count": { trend: "up", color: "#ef4444" },
                "input_peak_rate": { trend: "up", color: "#3b82f6" },
                "input_buffer_drops": { trend: "up", color: "#f97316" },
                "pause_frame_tx": { trend: "up", color: "#ef4444" }
            }
        };
    }

    if (device.includes("Gi0/1/1")) {
        return {
            patterns: [
                { id: 'p5', name: "CRC Error Cascade", baseConfidence: 0.89, steps: ["fcs_error_count", "input_errors", "carrier_transition"] }
            ],
            events: [
                { id: "EV-LNK-201", type: "Line Protocol Down", severity: "Major", baseProb: 0.81, time: "T+31m" }
            ],
            stepSpecs: {
                "fcs_error_count": { trend: "up", color: "#3b82f6" },
                "input_errors": { trend: "up", color: "#f97316" },
                "carrier_transition": { trend: "up", color: "#ef4444" }
            }
        };
    }

    if (device.includes("edge-router-dc1")) {
        return {
            patterns: [
                { id: 'p6', name: "DDoS Volumetric Signature", baseConfidence: 0.92, steps: ["udp_pps_in", "unique_src_ips", "policy_map_drops", "reachability_loss"] }
            ],
            events: [
                { id: "EV-EDGE-301", type: "DDoS Mitigation Trigger", severity: "Critical", baseProb: 0.95, time: "T+4m" },
                { id: "EV-EDGE-302", type: "ACL Deny Limit Reached", severity: "Minor", baseProb: 0.45, time: "T+1.5h" }
            ],
            stepSpecs: {
                "udp_pps_in": { trend: "up", color: "#3b82f6" },
                "unique_src_ips": { trend: "up", color: "#3b82f6" },
                "policy_map_drops": { trend: "up", color: "#f97316" },
                "reachability_loss": { trend: "down", color: "#ef4444" }
            }
        };
    }

    if (device.includes("spine-switch")) {
        return {
            patterns: [
                { id: 'p7', name: "Fabric Buffer Microburst", baseConfidence: 0.87, steps: ["queue_util_peak", "ecn_marked_packets", "pfc_priority_pauses"] }
            ],
            events: [
                { id: "EV-FAB-401", type: "VoQ Buffer Overflow", severity: "Major", baseProb: 0.76, time: "T+1h" }
            ],
            stepSpecs: {
                "queue_util_peak": { trend: "up", color: "#3b82f6" },
                "ecn_marked_packets": { trend: "up", color: "#f97316" },
                "pfc_priority_pauses": { trend: "up", color: "#ef4444" }
            }
        };
    }

    // Default Fallback
    return {
        patterns: [
            { id: 'p8', name: "Generic Performance Shift", baseConfidence: 0.65, steps: ["traffic_load", "latency_jitter"] }
        ],
        events: [
            { id: "EV-GEN-999", type: "System Notification", severity: "Minor", baseProb: 0.35, time: "T+3h" }
        ],
        stepSpecs: {
            "traffic_load": { trend: "up", color: "#3b82f6" },
            "latency_jitter": { trend: "up", color: "#f97316" }
        }
    };
};

const MLPredCorrPatternsPage = () => {
    const { theme: appTheme, systemTheme } = useNextTheme();
    const isDark = appTheme === 'dark' || (appTheme === 'system' && systemTheme === 'dark');

    const [selectedDevice, setSelectedDevice] = useState('');
    const [isInferenceRunning, setIsInferenceRunning] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    // Live Simulation State
    const [liveTimeLeft, setLiveTimeLeft] = useState(60);
    const [visibleStepsCount, setVisibleStepsCount] = useState<Record<string, number>>({});
    
    // Dynamic values for rendering
    const [dynamicPatterns, setDynamicPatterns] = useState<any[]>([]);
    const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);
    
    const timerRef = useRef<any>(null);

    const muiTheme = useMemo(() => createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            primary: { main: '#3b82f6' },
            secondary: { main: '#8b5cf6' },
            background: { default: 'transparent', paper: isDark ? '#12172b' : '#ffffff' },
            text: { primary: isDark ? '#e8ecf5' : '#1e293b', secondary: isDark ? '#8b94b0' : '#64748b' },
            divider: isDark ? '#2a3354' : '#e2e8f0'
        },
        typography: { fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
    }), [isDark]);

    const activeScenario = useMemo(() => {
        if (!selectedDevice) return null;
        return getDeviceData(selectedDevice);
    }, [selectedDevice]);

    // Initialize static data
    const initializeStaticData = () => {
        if (!activeScenario) return;
        
        const patterns = activeScenario.patterns.map((p: any) => ({
            ...p,
            confidence: p.baseConfidence
        }));
        
        const events = activeScenario.events.map((e: any) => ({
            ...e,
            probability: e.baseProb
        }));

        setDynamicPatterns(patterns);
        setDynamicEvents(events);

        const initialSteps: Record<string, number> = {};
        patterns.forEach((p: any) => initialSteps[p.id] = p.steps.length);
        setVisibleStepsCount(initialSteps);
    };

    // Handle Inference (Static Form)
    const handleRunInference = () => {
        setIsLiveMode(false);
        setIsInferenceRunning(true);
        setShowResults(false);
        if (timerRef.current) clearInterval(timerRef.current);

        setTimeout(() => {
            initializeStaticData();
            setIsInferenceRunning(false);
            setShowResults(true);
        }, 1500);
    };

    // Fluctuator helper
    const fluctuate = (val: number, maxVariance: number) => {
        const change = (Math.random() * maxVariance * 2) - maxVariance;
        return Math.min(0.99, Math.max(0.40, val + change));
    };

    // Handle Live Analysis (Dynamic Infinite Polling)
    const handleStartLiveAnalysis = () => {
        setIsLiveMode(true);
        setIsInferenceRunning(false);
        setShowResults(true);
        
        // Setup initial live state immediately to prevent empty renders
        setLiveTimeLeft(60);
        setVisibleStepsCount({});
        
        if (activeScenario && activeScenario.patterns && activeScenario.events) {
            setDynamicPatterns(activeScenario.patterns.map((p:any) => ({ ...p, confidence: p.baseConfidence - 0.2 })));
            if (activeScenario.events.length > 0) {
                setDynamicEvents([{ ...activeScenario.events[0], probability: activeScenario.events[0].baseProb - 0.3 }]);
            } else {
                setDynamicEvents([]);
            }
        }

        if (timerRef.current) clearInterval(timerRef.current);

        // Infinite Polling Loop (60s cycles)
        timerRef.current = setInterval(() => {
            setLiveTimeLeft((prev) => {
                if (prev <= 1) {
                    // END OF 1-MINUTE POLLING CYCLE -> RESTART INFINITE LOOP
                    setDynamicPatterns(pts => pts.map(p => ({ ...p, confidence: fluctuate(p.confidence, 0.15) })));
                    setDynamicEvents(evs => {
                        if (activeScenario && evs.length < activeScenario.events.length) {
                             return activeScenario.events.map((e:any) => ({ ...e, probability: fluctuate(e.baseProb, 0.1) }));
                        }
                        return evs.map(e => ({ ...e, probability: fluctuate(e.probability, 0.1) }));
                    });
                    return 60; // Reset timer for next minute period
                }
                
                // Micro-updates every few seconds simulating continuous real-time data ingestion
                if (prev % 3 === 0) {
                    setDynamicPatterns(pts => pts.map(p => ({
                        ...p,
                        confidence: fluctuate(p.confidence, 0.03)
                    })));
                    setDynamicEvents(evs => evs.map(e => ({
                        ...e,
                        probability: fluctuate(e.probability, 0.04)
                    })));
                }

                // Simulate pattern steps forming piece by piece
                if (prev % 8 === 0) {
                    setVisibleStepsCount(current => {
                        const next = { ...current };
                        activeScenario?.patterns.forEach((p: any) => {
                            const currentCount = next[p.id] || 0;
                            if (currentCount < p.steps.length && Math.random() > 0.3) {
                                next[p.id] = currentCount + 1;
                            } else if (currentCount > 1 && Math.random() > 0.8) {
                                next[p.id] = currentCount - 1; // Pattern weakening momentarily
                            }
                        });
                        return next;
                    });
                }

                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const renderPatternSteps = (pattern: any) => {
        const count = isLiveMode ? (visibleStepsCount[pattern.id] || 1) : pattern.steps.length;
        const visibleSteps = pattern.steps.slice(0, count);

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, py: 1 }}>
                {visibleSteps.map((stepKey: string, idx: number) => {
                    const spec = activeScenario?.stepSpecs[stepKey];
                    const isLastStep = idx === pattern.steps.length - 1;
                    return (
                        <motion.div 
                            key={`${stepKey}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5,
                                color: spec?.color || '#3b82f6', 
                                fontWeight: 600, 
                                fontSize: '13px',
                                background: isLastStep ? `${spec?.color || '#3b82f6'}15` : 'transparent',
                                px: isLastStep ? 1 : 0,
                                py: isLastStep ? 0.3 : 0,
                                borderRadius: 1
                            }}>
                                {stepKey}
                                {spec?.trend === 'up' && <span>↑</span>}
                                {spec?.trend === 'down' && <span>↓</span>}
                            </Box>
                            {idx < visibleSteps.length - 1 && (
                                <ArrowRight size={14} style={{ margin: '0 4px', opacity: 0.3 }} />
                            )}
                        </motion.div>
                    );
                })}
                {isLiveMode && count < pattern.steps.length && (
                    <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', ml: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <RefreshCw size={12} className="animate-spin" /> Correlating...
                        </Typography>
                    </motion.div>
                )}
            </Box>
        );
    };

    return (
        <MainLayout>
            <ThemeProvider theme={muiTheme}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    
                    {/* Header with Dual Buttons */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} gap={3} sx={{ flexWrap: 'wrap' }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <BrainCircuit size={28} color="#3b82f6" />
                            <Typography variant="h5" fontWeight="800">ML Inference Playground</Typography>
                        </Box>

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, justifyContent: 'flex-end', minWidth: '450px' }}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <Select
                                    id="device-select"
                                    value={selectedDevice}
                                    displayEmpty
                                    onChange={(e) => setSelectedDevice(e.target.value)}
                                    sx={{ borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                                    renderValue={(selected) => selected || "Select Device/Link"}
                                >
                                    {DEVICES.map((dev) => (
                                        <MenuItem key={dev} value={dev}>{dev}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <Button 
                                variant="outlined" 
                                startIcon={isInferenceRunning ? <CircularProgress size={14} /> : <Play size={16} />}
                                disabled={!selectedDevice || isLiveMode}
                                onClick={handleRunInference}
                                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 2 }}
                            >
                                Inference
                            </Button>

                            <Button 
                                variant="contained" 
                                startIcon={isLiveMode ? <RefreshCw size={16} className="animate-spin" /> : <PlayCircle size={16} />}
                                disabled={!selectedDevice || isInferenceRunning}
                                onClick={handleStartLiveAnalysis}
                                sx={{ 
                                    borderRadius: 2, 
                                    fontWeight: 700, 
                                    textTransform: 'none', 
                                    px: 2,
                                    background: isLiveMode ? 'success.main' : 'primary.main',
                                    '&:hover': { background: isLiveMode ? 'success.dark' : 'primary.dark' }
                                }}
                            >
                                {isLiveMode ? 'Continuous Polling...' : 'Live Analysis'}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Infinite Live Polling Bar */}
                    <AnimatePresence>
                        {isLiveMode && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <Paper sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid', borderColor: 'success.main' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" fontWeight="700" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Activity size={16} className="animate-pulse" /> Live Polling Data (1-Min Cycles)
                                        </Typography>
                                        <Typography variant="body2" fontWeight="700">Next burst in {liveTimeLeft}s</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={(60 - liveTimeLeft) * (100 / 60)} 
                                        color="success" 
                                        sx={{ 
                                            height: 6, 
                                            borderRadius: 3,
                                            '& .MuiLinearProgress-bar': {
                                                transition: 'transform 1s linear'
                                            }
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Area */}
                    <AnimatePresence mode="wait">
                        {showResults ? (
                            <motion.div key="results" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" fontWeight="700" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Activity size={20} color={isLiveMode ? "#10b981" : "#3b82f6"} /> {isLiveMode ? 'Real-time Pattern Formation' : 'Detected Pattern Details'}
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                                                        <TableCell sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Pattern Signature</TableCell>
                                                        <TableCell sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Live Confidence</TableCell>
                                                        <TableCell sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Metric Sequence</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dynamicPatterns.map((pattern: any) => (
                                                        <TableRow key={pattern.id}>
                                                            <TableCell sx={{ width: '250px' }}>
                                                                <Typography variant="body2" fontWeight="700">{pattern.name}</Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ width: '150px' }}>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Box sx={{ flexGrow: 1, bgcolor: 'divider', height: 4, borderRadius: 2 }}>
                                                                        <motion.div 
                                                                            animate={{ width: `${Math.max(0, Math.min(100, pattern.confidence * 100))}%` }}
                                                                            transition={{ duration: 0.8 }}
                                                                            style={{ height: '100%', borderRadius: 2, background: isLiveMode ? '#10b981' : '#3b82f6' }}
                                                                        />
                                                                    </Box>
                                                                    <Typography variant="caption" fontWeight="800">
                                                                        {Math.round(pattern.confidence * 100)}%
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{renderPatternSteps(pattern)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {dynamicPatterns.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>Loading Patterns...</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                            <Typography variant="h6" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Clock size={20} color="#f59e0b" /> Streaming Future Predictions
                                            </Typography>
                                            {isLiveMode && (
                                                <Chip icon={<Activity size={14}/>} label="Continuously Updating" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
                                            )}
                                        </Box>
                                        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                                                        <TableCell sx={{ fontWeight: 700 }}>Event Formed</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Projected Time</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Live Risk Level</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dynamicEvents.length > 0 ? dynamicEvents.map((event: any) => (
                                                        <TableRow key={event.id}>
                                                            <TableCell><Typography variant="body2" fontWeight="700"><Zap size={14} style={{ marginRight: 8 }} />{event.type}</Typography></TableCell>
                                                            <TableCell><Chip label={event.severity} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 800, bgcolor: `${event.severity === 'Critical' ? '#ef4444' : '#f97316'}15`, color: event.severity === 'Critical' ? '#ef4444' : '#f97316' }} /></TableCell>
                                                            <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{event.time}</Typography></TableCell>
                                                            <TableCell>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Box sx={{ flexGrow: 1, bgcolor: 'divider', height: 4, borderRadius: 2, width: 60 }}>
                                                                        <motion.div 
                                                                            animate={{ width: `${Math.max(0, Math.min(100, event.probability * 100))}%` }}
                                                                            transition={{ duration: 0.8 }}
                                                                            style={{ background: event.probability > 0.8 ? '#ef4444' : (isLiveMode ? '#10b981' : '#3b82f6'), height: '100%', borderRadius: 2 }} 
                                                                        />
                                                                    </Box>
                                                                    <Typography variant="caption" fontWeight="800">{Math.round(event.probability * 100)}%</Typography>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                                                                <CircularProgress size={16} sx={{ mr: 2, verticalAlign: 'middle' }}/>
                                                                Listening to resource stream to build predictions...
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        ) : (
                            <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.4 }}>
                                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                    <BrainCircuit size={64} strokeWidth={1} />
                                </motion.div>
                                <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>Select a target and choose Analysis mode</Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </Container>
            </ThemeProvider>
        </MainLayout>
    );
};

export default MLPredCorrPatternsPage;
