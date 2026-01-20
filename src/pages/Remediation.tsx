import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench, CheckCircle2, Circle, Play, Terminal, BookOpen, AlertTriangle,
  RotateCcw, Pause, XCircle, ArrowRight, ArrowLeft, Clock, ShieldCheck,
  History, BarChart3, TrendingDown, TrendingUp, Download, Check, AlertCircle,
  Activity, Info, ChevronRight, Share2, ClipboardCheck, Trash2, Users, Zap, Search, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getClusterData, ClusterSpecificData, RemediationStep } from '@/data/clusterSpecificData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import React from 'react';

// Post-remediation verification metrics mock data
const VERIFICATION_METRICS = [
  { name: 'Latency', before: 170, after: 35, unit: 'ms', improvement: '79%' },
  { name: 'Packet Loss', before: 1.3, after: 0.2, unit: '%', improvement: '85%' },
  { name: 'Queue Drops', before: 2.5, after: 0.1, unit: '%', improvement: '96%' },
  { name: 'Bandwidth', before: 96, after: 45, unit: '%', improvement: '53%' },
];

const TIMELINE_DATA = [
  { time: '14:30:00', event: 'Issue Detected', details: 'EWMA anomaly, Z-score = 3.2σ', icon: AlertCircle, color: 'text-destructive' },
  { time: '14:32:15', event: 'Root Cause Identified', details: 'Backup-Induced Congestion (93%)', icon: Activity, color: 'text-primary' },
  { time: '14:35:00', event: 'Remediation Started', details: 'Workflow initiated by operator', icon: Play, color: 'text-blue-500' },
  { time: '14:37:30', event: 'Step 1: Completed', details: 'Verified backup traffic pattern', icon: CheckCircle2, color: 'text-status-success' },
  { time: '14:39:00', event: 'Step 2: Completed', details: 'Applied QoS Traffic Shaping', icon: CheckCircle2, color: 'text-status-success' },
  { time: '14:42:15', event: 'Step 3: Completed', details: 'Rescheduled backup jobs', icon: CheckCircle2, color: 'text-status-success' },
  { time: '14:45:00', event: 'Verification Finalized', details: 'All metrics stabilized within SLA', icon: ShieldCheck, color: 'text-emerald-500' },
];

export default function Remediation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clusterId = searchParams.get('cluster') || 'CLU-LC-001';
  const clusterData = getClusterData(clusterId);

  const [viewMode, setViewMode] = useState<'execution' | 'verification' | 'history'>('execution');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepStates, setStepStates] = useState<Record<string, 'pending' | 'success' | 'failed'>>({});
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'command' | 'output'; text: string }>>([]);
  const [currentTab, setCurrentTab] = useState('steps');

  useEffect(() => {
    if (clusterData) {
      const initialStates: Record<string, 'pending' | 'success' | 'failed'> = {};
      clusterData.remediationSteps.forEach(step => {
        initialStates[step.id] = 'pending';
      });
      setStepStates(initialStates);
    }
  }, [clusterId]);

  const handleStepAction = (stepId: string, result: 'success' | 'failed' | 'pending') => {
    setStepStates(prev => ({ ...prev, [stepId]: result }));

    // Log to terminal
    const step = clusterData?.remediationSteps.find(s => s.id === stepId);
    if (step) {
      if (result === 'pending') {
        const logs = [
          { type: 'command' as const, text: `$ retry_step --id ${step.id} --force` },
          { type: 'output' as const, text: `↺ RE-INITIATING STEP: ${step.action.toUpperCase()}...` },
        ];
        setTerminalHistory(prev => [...prev, ...logs]);
        return;
      }

      const logs = [
        { type: 'command' as const, text: `$ ./execute_payload.sh --step "${step.id}" --action "${step.action}"` },
        { type: 'output' as const, text: result === 'success' ? `✓ STATUS: SUCCESS | [${step.action}]` : `❌ STATUS: FAILED | [${step.action}]` },
        { type: 'output' as const, text: result === 'success' ? `  TELEMETRY VERIFICATION: PASS (98% confidence)` : `  TELEMETRY VERIFICATION: FAIL (Anomaly detected)` },
      ];
      setTerminalHistory(prev => [...prev, ...logs]);
    }

    if (result === 'success' && clusterData && activeStepIndex < clusterData.remediationSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const isAllComplete = useMemo(() => {
    if (!clusterData) return false;
    return clusterData.remediationSteps.every(s => stepStates[s.id] === 'success');
  }, [stepStates, clusterData]);

  if (!clusterData) {
    return (
      <MainLayout>
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-full space-y-4">
          <AlertCircle className="h-16 w-16 opacity-20" />
          <h2 className="text-xl font-bold tracking-tight">Remediation Data Out of Sync</h2>
          <p className="max-w-md">The cluster ID <span className="font-mono text-primary">{clusterId}</span> could not be resolved in the current active session.</p>
          <Button asChild className="mt-4 px-10 rounded-full"><Link to="/events">Return to Command Center</Link></Button>
        </div>
      </MainLayout>
    );
  }

  const steps = clusterData.remediationSteps;
  const progress = Math.round((Object.values(stepStates).filter(s => s === 'success').length / steps.length) * 100);

  // Render Execution View
  const renderExecution = () => {
    const activeStep = steps[activeStepIndex];
    const state = stepStates[activeStep.id];
    const isCompleted = state === 'success';
    const isFailed = state === 'failed';
    const isActive = state === 'pending';

    return (
      <div className="grid grid-cols-12 gap-10">
        {/* Main Step Detail Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className={cn(
            "border-none shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500",
            isCompleted ? "bg-emerald-500/5 ring-2 ring-emerald-500/20" :
              isFailed ? "bg-destructive/5 ring-2 ring-destructive/20" : "bg-card"
          )}>
            <CardHeader className="p-10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500",
                    isCompleted ? "bg-emerald-500 rotate-0" :
                      isFailed ? "bg-destructive rotate-0" : "bg-primary animate-pulse"
                  )}>
                    {isCompleted ? <Check className="h-8 w-8" /> :
                      isFailed ? <XCircle className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Step 0{activeStepIndex + 1}</span>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest leading-none border-primary/20 text-primary px-2 py-0.5 h-auto">
                        {activeStep.phase}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
                      {activeStep.action}
                    </CardTitle>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-1">Duration</p>
                  <p className="text-sm font-black text-foreground font-mono">{activeStep.duration}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 space-y-10">
              {/* Description */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" /> Execution Context
                </h4>
                <p className="text-xl text-muted-foreground font-medium italic border-l-4 border-primary/20 pl-8 py-2">
                  "{activeStep.description}"
                </p>
              </div>

              {/* Technical Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Verification Logic</h4>
                  <div className="space-y-3">
                    {activeStep.verification?.map((v, vi) => (
                      <div key={vi} className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50 text-xs font-bold transition-all group hover:bg-muted/50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{v}</span>
                      </div>
                    )) || <div className="text-xs italic text-muted-foreground">Standard status verification</div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Automation Payload</h4>
                  <div className="p-6 bg-zinc-950 rounded-3xl border border-white/5 font-mono text-xs shadow-3xl relative group/code h-full min-h-[140px]">
                    <div className="absolute top-4 right-4 text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">Payload v1.2</div>
                    <pre className="text-zinc-400 whitespace-pre-wrap mt-2 leading-relaxed">
                      <span className="text-emerald-500 mr-2">$</span>
                      {activeStep.command || `# MANUAL_INTERVENTION_REQUIRED`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-10">
                {isActive && (
                  <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    <Button
                      className="w-full sm:flex-1 h-20 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/20 gap-4 font-black text-lg rounded-[1.5rem] tracking-tight group transition-all"
                      onClick={() => handleStepAction(activeStep.id, 'success')}
                    >
                      <CheckCircle2 className="h-7 w-7 transition-transform group-hover:scale-110" />
                      EXECUTE FLOW STEP 0{activeStepIndex + 1}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto h-20 px-10 gap-4 font-black text-lg rounded-[1.5rem] shadow-2xl shadow-destructive/10 group transition-all"
                      onClick={() => handleStepAction(activeStep.id, 'failed')}
                    >
                      <XCircle className="h-7 w-7 group-hover:rotate-90 transition-transform" />
                      ABORT
                    </Button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-6 p-8 rounded-[1.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-700 animate-in zoom-in-95 duration-500">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Check className="h-8 w-8 text-white font-black" />
                    </div>
                    <div>
                      <p className="text-xl font-black uppercase tracking-tight">Step Verified Successfully</p>
                      <p className="text-xs font-medium opacity-70">Instruction completed and telemetry confirmed. Ready for next phase.</p>
                    </div>
                  </div>
                )}

                {isFailed && (
                  <div className="space-y-6 p-8 rounded-[1.5rem] bg-destructive/10 border-2 border-destructive/20 text-destructive animate-in shake duration-500">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="h-10 w-10 animate-pulse" />
                      <div>
                        <h3 className="text-xl font-black uppercase">Execution Failure</h3>
                        <p className="text-sm font-medium opacity-80">Manual diagnostics required to resolve bottleneck.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Button variant="outline" className="h-12 px-6 gap-2 font-black text-[10px] uppercase tracking-widest" onClick={() => handleStepAction(activeStep.id, 'pending' as any)}>
                        <RotateCcw className="h-4 w-4" /> Retry Step
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Console / Terminal Link */}
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4 text-muted-foreground/40 font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4" /> SECURE_REMEDIATION_SESSION_V4.2
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5" onClick={() => setCurrentTab('terminal')}>
              View Terminal Logs <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Sidebar Roadmap Tracker */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card className="shadow-2xl border-none bg-card/60 backdrop-blur-md rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-border/40">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                <Target className="h-4 w-4" /> Execution Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Visual Roadmap list */}
              <div className="space-y-6 relative">
                {/* Progress Connector */}
                <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-muted -z-0" />
                <div
                  className="absolute left-[13px] top-4 w-0.5 bg-primary transition-all duration-1000 -z-0"
                  style={{ height: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, i) => {
                  const state = stepStates[step.id];
                  const isDone = state === 'success';
                  const isCurr = i === activeStepIndex;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex gap-6 relative z-10 p-2 rounded-xl transition-all cursor-pointer",
                        isCurr ? "bg-primary/5 ring-1 ring-primary/10" : "opacity-60 grayscale-[0.5] hover:opacity-100"
                      )}
                      onClick={() => setActiveStepIndex(i)}
                    >
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black transition-all shadow-md",
                        isDone ? "bg-emerald-500 text-white" :
                          isCurr ? "bg-primary text-white scale-110 shadow-primary/20" : "bg-muted text-muted-foreground"
                      )}>
                        {isDone ? <Check className="h-3 w-3" /> : (i + 1)}
                      </div>
                      <div>
                        <p className={cn(
                          "text-xs font-black uppercase tracking-widest",
                          isCurr ? "text-primary" : "text-foreground"
                        )}>{step.action}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-medium mt-0.5">{step.phase}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="opacity-50" />

              {/* Live Metric Mini-Board */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-between">
                  Live Telemetry <Badge className="text-[8px] h-4 px-1.5 animate-pulse font-black">STREAMING</Badge>
                </h4>
                <div className="bg-zinc-950/90 rounded-[1.5rem] border border-white/5 p-5 space-y-4 overflow-hidden shadow-3xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Latency Delta</span>
                    <span className="text-xs font-mono font-black text-emerald-500">110ms <span className="text-[10px] opacity-40">(-35%)</span></span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Loss Factor</span>
                    <span className="text-xs font-mono font-black text-emerald-500">0.8% <span className="text-[10px] opacity-40">(-0.5%)</span></span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-14 rounded-[1.2rem] gap-3 font-black text-[10px] uppercase tracking-widest border-2 shadow-sm"
                onClick={() => setCurrentTab('kb')}
              >
                <BookOpen className="h-4 w-4 text-primary" /> Runbook Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Render Verification View
  const renderVerification = () => (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto py-6">
      <div className="flex flex-col lg:flex-row items-center justify-between p-12 rounded-[3.5rem] bg-card border-none shadow-3xl relative overflow-hidden group">
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] scale-150 rotate-12">
          <ShieldCheck className="h-64 w-64 text-emerald-500" />
        </div>

        <div className="flex items-center gap-10 relative z-10">
          <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Post-Flow Verification</h2>
              <Badge className="bg-emerald-500 text-white font-black text-[10px] uppercase px-3 py-1 animate-pulse">PASSED</Badge>
            </div>
            <p className="text-lg text-muted-foreground font-medium italic opacity-70">
              Payload execution verified for {clusterId} on {clusterData.rcaMetadata.device}
            </p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10 mt-8 lg:mt-0">
          <Button variant="outline" size="lg" className="h-16 px-10 font-black text-xs uppercase tracking-widest border-2 shadow-xl rounded-[1.5rem]">
            <Download className="h-5 w-5 mr-3" /> Audit Log
          </Button>
          <Button
            size="lg"
            className="h-16 px-12 gap-4 font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-[1.5rem] transform hover:scale-105 transition-all"
            onClick={() => setViewMode('history')}
          >
            Finalize Case
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <Card className="col-span-12 shadow-2xl border-none bg-card/60 backdrop-blur-md rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-border/40">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 text-emerald-600">
              <TrendingDown className="h-5 w-5" /> Performance Recovery Delta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-4">
                <div className="rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl bg-card">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border/40">
                      <tr>
                        <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Metric</th>
                        <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Base</th>
                        <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest text-emerald-600">Optimized</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {VERIFICATION_METRICS.map(m => (
                        <tr key={m.name} className="hover:bg-primary/5 transition-all">
                          <td className="px-10 py-6 font-black text-sm uppercase tracking-tight">{m.name}</td>
                          <td className="px-6 py-6 text-center font-mono text-xs opacity-50">{m.before}{m.unit}</td>
                          <td className="px-6 py-6 text-center">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-xs font-black">
                              {m.after}{m.unit}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="h-[350px] w-full bg-zinc-950 rounded-[3rem] p-10 border border-white/5 shadow-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={VERIFICATION_METRICS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} />
                    <YAxis hide />
                    <RechartsTooltip />
                    <Bar dataKey="before" fill="#ffffff0a" radius={[6, 6, 0, 0]} barSize={40} />
                    <Bar dataKey="after" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render History / Resolved View
  const renderHistory = () => (
    <div className="max-w-5xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-8">
        <div className="h-40 w-40 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto shadow-3xl shadow-emerald-500/10 relative">
          <div className="h-28 w-28 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="h-16 w-16 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" style={{ animationDuration: '3s' }} />
        </div>
        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter uppercase text-foreground">Case Archived</h2>
          <p className="text-2xl text-muted-foreground font-medium italic opacity-60">Closed-Loop Resolution for {clusterId}</p>
        </div>
      </div>

      <Card className="rounded-[3.5rem] border-none shadow-3xl bg-zinc-950 text-white overflow-hidden p-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4 p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">MTTR Gain</p>
            <p className="text-5xl font-black tracking-tighter">15m 00s</p>
            <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">-75% AVG</p>
          </div>
          <div className="text-center space-y-4 p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Health Recovery</p>
            <p className="text-5xl font-black text-emerald-500 tracking-tighter">+82.4%</p>
            <p className="text-[10px] font-black text-emerald-500/60 tracking-widest uppercase">KPI Stable</p>
          </div>
          <div className="text-center space-y-4 p-8 rounded-[2.5rem] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Audit Compliance</p>
            <p className="text-5xl font-black text-primary tracking-tighter">A+ 9.8</p>
            <p className="text-[10px] font-black text-primary/60 tracking-widest uppercase">Sec-Verified</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center gap-6 text-emerald-500">
            <History className="h-8 w-8" />
            <h4 className="text-xl font-black uppercase tracking-[0.3em]">Executive Summary Log</h4>
          </div>
          <div className="text-xl text-white/60 font-medium leading-relaxed italic max-w-3xl border-l-4 border-emerald-500/20 pl-10 py-4">
            "The orchestrated response for {clusterId} was successfully executed on {clusterData.rcaMetadata.device}.
            Downstream congestion was suppressed through dynamic QoS shaping and job rescheduling.
            The incident is now classified as [CLOSED] and passed to long-term analytics."
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row justify-center gap-8">
          <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-white/10 text-white hover:bg-white/5 font-black uppercase text-xs tracking-widest">
            <Download className="h-5 w-5 mr-3" /> Export Incident PDF
          </Button>
          <Button asChild size="lg" className="h-20 px-16 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 text-white transform hover:scale-105 transition-all">
            <Link to="/events">Finalize & Exit Center</Link>
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <MainLayout>
      <div className="p-8 space-y-10 min-h-screen bg-slate-50/10">
        {/* Nav & Context Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full border border-border/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Payload Orchestrator</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{clusterId}</p>
                <Separator orientation="vertical" className="h-4 bg-primary/20" />
                <p className="text-xs text-primary font-bold uppercase tracking-tight">Active Mediation Session</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="h-8 px-4 rounded-full border-primary/20 text-primary uppercase font-black text-[9px] tracking-[0.2em] bg-primary/5">
              Secure Audit Active
            </Badge>
          </div>
        </div>

        {/* Dynamic State Indicator */}
        {viewMode === 'execution' && (
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Play className="h-40 w-40" />
            </div>
            <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                <Badge className="bg-white/20 text-white border-none text-[9px] uppercase font-black px-3 py-1 tracking-widest">Global Status</Badge>
                <p className="text-4xl font-black tracking-tighter leading-none max-w-xl">
                  Remediation Workflow for {clusterData.rcaMetadata.device} is {progress}% Complete.
                </p>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Saturation</p>
                  <p className="text-5xl font-black tracking-tighter">{progress}%</p>
                </div>
                <div className="w-px h-16 bg-white/10 hidden lg:block" />
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Session</p>
                  <Badge className="bg-white text-primary border-none h-8 px-6 font-black text-xs uppercase tracking-widest shadow-xl">LIVE OPS</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Horizontal Process Flow */}
        {viewMode === 'execution' && (
          <div className="flex justify-between items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {steps.map((step, i) => {
              const state = stepStates[step.id];
              const isActive = i === activeStepIndex;
              const isDone = state === 'success';
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveStepIndex(i)}
                    className={cn(
                      "flex flex-col items-center gap-3 min-w-[140px] transition-all group",
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
                      isDone ? "bg-emerald-500 text-white" :
                        isActive ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-muted text-muted-foreground"
                    )}>
                      {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Play className="h-5 w-5" />}
                    </div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest text-center leading-tight",
                      isActive ? "text-primary" : "text-foreground"
                    )}>{step.action}</p>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="h-px flex-1 bg-border/40 min-w-[20px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Component Tabs / Specific Views */}
        <div className="mt-8">
          {viewMode === 'execution' && (
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-10">
              <TabsList className="bg-transparent border-b border-border/40 rounded-none w-full justify-start h-auto p-0 gap-10">
                <TabsTrigger value="steps" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-2 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">01. Workflow Payload</TabsTrigger>
                <TabsTrigger value="terminal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-2 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">02. Live Console Logs</TabsTrigger>
                <TabsTrigger value="kb" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-2 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">03. Runbook Knowledge</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="m-0 focus-visible:ring-0">
                {renderExecution()}
              </TabsContent>

              <TabsContent value="terminal" className="m-0 focus-visible:ring-0">
                <div className="max-w-6xl mx-auto">
                  <Card className="bg-zinc-950 border-none rounded-[3rem] overflow-hidden shadow-3xl text-zinc-400 font-mono">
                    <CardHeader className="bg-zinc-900 border-b border-white/5 p-8 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div className="h-3 w-3 rounded-full bg-rose-500/50" />
                          <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                          <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">payload_session_0102.log</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white" onClick={() => setTerminalHistory([])}>
                        Clear Session
                      </Button>
                    </CardHeader>
                    <CardContent className="h-[500px] p-10">
                      <ScrollArea className="h-full">
                        <div className="space-y-3">
                          {terminalHistory.map((l, i) => (
                            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-left-2 duration-300">
                              <span className="text-zinc-800 text-[10px] w-8">[{i}]</span>
                              <span className={cn("text-sm tracking-tight", l.type === 'command' ? "text-emerald-500 font-bold" : "text-zinc-400")}>
                                {l.type === 'command' ? '➜ ' : '  '}{l.text}
                              </span>
                            </div>
                          ))}
                          {terminalHistory.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center pt-20 text-zinc-700">
                              <Terminal className="h-16 w-16 mb-4 opacity-20" />
                              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ready for stream...</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="kb" className="m-0 focus-visible:ring-0">
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card className="rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex items-center gap-6 text-primary">
                      <BookOpen className="h-8 w-8" />
                      <h3 className="text-2xl font-black uppercase tracking-tighter">AI Knowledge Base Reference</h3>
                    </div>
                    <div className="space-y-6">
                      {clusterData.remediationKB.map((kb, kbi) => (
                        <div key={kbi} className="p-6 rounded-[2rem] bg-muted/30 border border-border/50 hover:bg-primary/5 transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-black tracking-tight">{kb.title}</h4>
                            <Badge variant="secondary" className="text-[10px] font-black">Score: {kb.relevance}%</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">Cross-referenced from historical recovery events on {clusterData.rcaMetadata.device} and similar assets.</p>
                          <Button variant="link" className="p-0 text-primary font-black uppercase text-[10px] tracking-widest gap-2">
                            Read Full Doc <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {viewMode === 'verification' && renderVerification()}
          {viewMode === 'history' && renderHistory()}
        </div>
      </div>
    </MainLayout>
  );
}
