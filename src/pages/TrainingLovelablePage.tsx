import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { LOVELABLE_REPORT_DATA as D, RFData, SCOPE_TARGETS, PreEventData } from "@/data/lovelableReportData";
import { cn } from "@/shared/lib/utils";
import { Play, Loader2, CheckCircle2, RotateCcw, ChevronDown, ChevronRight, FileText, Info, ArrowRight, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fmt = (v: number) => {
  if (Math.abs(v) >= 10000) return (v > 0 ? '+' : '') + (v / 1000).toFixed(0) + 'k%';
  if (Math.abs(v) >= 1000) return (v > 0 ? '+' : '') + (v / 1000).toFixed(1) + 'k%';
  return (v > 0 ? '+' : '') + v.toFixed(0) + '%';
};

const colors = ['#3B82F6', '#8B5CF6', '#3DDAB4', '#F59E0B', '#EF4444', '#EC4899'];
const chartHeight = 320;
const paddingX = 80;
const paddingY = 100;


const Bar = ({ val, max, col }: { val: number, max: number, col: string }) => {
  const pct = Math.min(val / max * 100, 100).toFixed(1);
  return (
    <div className="flex-1 h-[5px] bg-secondary rounded-[3px] overflow-hidden">
      <div className="h-full rounded-[3px] transition-all duration-700" style={{ width: `${pct}%`, background: col }} />
    </div>
  );
};

const LoadingState = ({ title }: { title: string }) => (
  <div className="py-32 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-6 border border-border shadow-[0_0_20px_rgba(59,130,246,0.1)]">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.2em] text-primary mb-2 uppercase font-bold pr-2">Analytical Processing...</div>
    <h2 className="text-[18px] font-semibold mb-1 tracking-tight text-foreground">Calibrating {title} Models</h2>
    <p className="text-muted-foreground max-w-sm font-['IBM_Plex_Mono',monospace] text-[11px] mt-2">
      Waiting for training pipeline to reach this extraction stage. Results will populate automatically.
    </p>
  </div>
);
const DonutChart = ({ val, size = 30 }: { val: number, size?: number }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.abs(val) * circumference);
  const color = val > 0.8 ? '#3DDAB4' : val > 0.6 ? '#3B82F6' : '#F59E0B';

  return (
    <svg width={size} height={size} className="transform -rotate-90 flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        className="text-white/5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

const formatLabel = (str: string) =>
  str.replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());

const AnomalyHeatMap = ({ data }: { data: any[] }) => {
  const metrics = [
    { key: 'cpu', label: 'Cpu' },
    { key: 'mem', label: 'Mem Util' },
    { key: 'lat', label: 'Latency' },
    { key: 'qd', label: 'Queue Depth' },
    { key: 'crc', label: 'Crc Errors' }
  ];

  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="px-3.5 py-2.5 bg-secondary/30 border-b border-border flex items-center justify-between">
        <span className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.06em] text-destructive font-bold uppercase">Resource Anomaly Heat Map</span>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-muted-foreground font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> HIGH
          </div>
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-muted-foreground font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /> MED
          </div>
          <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono',monospace] text-[9px] text-muted-foreground font-bold uppercase transition-all hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> NORMAL
          </div>
        </div>
      </div>
      <div className="p-4 overflow-x-auto no-scrollbar">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-2 mb-3 px-2">
            <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-muted-foreground uppercase font-black pr-2 tracking-widest">Entity Identifier</div>
            {metrics.map(m => (
              <div key={m.key} className="text-center font-['IBM_Plex_Mono',monospace] text-[9px] text-muted-foreground font-black uppercase tracking-widest">{m.label}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {data.map((d, i) => (
              <div key={i} className="grid grid-cols-[160px_repeat(5,1fr)] gap-1.5 items-center group/row animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-foreground truncate pr-3 border-r border-border/10 group-hover/row:text-primary transition-colors">{d.e}</div>
                {metrics.map(m => {
                  const val = d.metrics?.[m.key] || 0;
                  const severity = val > 10 ? 'HIGH' : val > 5 ? 'MED' : val > 2 ? 'LOW' : 'NONE';
                  const color =
                    severity === 'HIGH' ? '#EF4444' :
                      severity === 'MED' ? '#F59E0B' :
                        severity === 'LOW' ? '#10B981' : 'hsl(var(--secondary))';
                  const opacity =
                    severity === 'HIGH' ? '1.0' :
                      severity === 'MED' ? '0.75' :
                        severity === 'LOW' ? '0.45' : '0.15';
                  const border = severity === 'NONE' ? 'border-border/10' : 'border-border/20';
                  const shadow = severity === 'HIGH' ? 'shadow-[inset_0_0_12px_rgba(239,68,68,0.4)]' :
                    severity === 'LOW' ? 'shadow-[inset_0_0_8px_rgba(16,185,129,0.15)]' : '';

                  return (
                    <div
                      key={m.key}
                      className={cn("h-8 rounded-[2px] transition-all duration-300 hover:scale-[1.05] hover:z-10 group/cell relative cursor-help border", border, shadow)}
                      style={{ background: color, opacity }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        <div className="bg-popover px-2 py-1 rounded border border-border shadow-2xl text-[9px] font-bold text-popover-foreground font-['IBM_Plex_Mono',monospace]">
                          {m.label}: {val.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3.5 py-2 bg-secondary/20 border-t border-border flex justify-between font-['IBM_Plex_Mono',monospace] text-[10px] text-muted-foreground uppercase tracking-wider">
        <span>Windows Sampled</span>
        <span>Isolation Depth</span>
      </div>
    </div>
  );
};

const LiftMatrixHeatMap = ({ dataR, dataS }: { dataR: any[], dataS: any[] }) => {
  const mergedData = useMemo(() => {
    const map = new Map();
    [...dataR, ...dataS].forEach(d => {
      const key = [d.a, d.b].sort().join('|');
      if (!map.has(key)) map.set(key, { ...d });
      else {
        const existing = map.get(key);
        existing.lift = Math.max(existing.lift, d.lift);
        existing.n += d.n;
      }
    });
    return Array.from(map.values());
  }, [dataR, dataS]);

  const events = Array.from(new Set(mergedData.flatMap(d => [d.a, d.b]))).sort();

  return (
    <div className="animate-in fade-in duration-700">
      <div className="bg-card border border-border rounded-[16px] overflow-hidden shadow-2xl relative">
        <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(61,218,180,0.4)] animate-pulse" />
            <span className="font-['IBM_Plex_Mono',monospace] text-[14px] tracking-[0.1em] text-emerald-500 font-black">Event Co-occurrence Heatmap</span>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 font-['IBM_Plex_Mono',monospace] text-[13px] text-foreground font-black tracking-wider">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-500 shadow-[0_0_10px_rgba(61,218,180,0.3)]" /> Hi-Lift ({'>'}1.2)
            </div>
            <div className="flex items-center gap-2 font-['IBM_Plex_Mono',monospace] text-[13px] text-foreground font-black tracking-wider">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" /> Med (~1.1)
            </div>
            <div className="flex items-center gap-2 font-['IBM_Plex_Mono',monospace] text-[13px] text-muted-foreground font-black tracking-wider">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-secondary border border-border" /> Baseline (1.0)
            </div>
          </div>
        </div>

        <div className="p-10 pt-16">
          <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-1.5 mb-4">
            <div />
            {events.map(e => (
              <div key={e} className="text-[13px] text-muted-foreground font-black tracking-tight text-center -rotate-45 h-20 flex items-end justify-center pb-3 leading-none whitespace-nowrap overflow-visible font-['IBM_Plex_Mono',monospace]">
                {formatLabel(e)}
              </div>
            ))}
          </div>

          {events.map(row => (
            <div key={row} className="grid grid-cols-[140px_repeat(6,1fr)] gap-1.5 mb-1.5 items-stretch">
              <div className="text-[14px] text-muted-foreground font-black truncate pr-6 text-right flex items-center justify-end font-['IBM_Plex_Mono',monospace] border-r border-border/10">{formatLabel(row)}</div>
              {events.map(col => {
                const d = mergedData.find(x => (x.a === row && x.b === col) || (x.a === col && x.b === row));
                const isDiag = row === col;
                const lift = isDiag ? 0 : (d ? d.lift : 0);
                const color = lift > 1.15 ? 'hsl(var(--severity-low))' : lift > 1.05 ? 'hsl(var(--severity-medium))' : lift > 0 ? 'hsl(var(--muted))' : 'transparent';
                const opacity = lift > 1.15 ? '1' : lift > 1.05 ? '0.75' : '0.4';

                return (
                  <div key={col} className={cn("h-12 rounded-[4px] border border-border flex items-center justify-center relative group transition-all duration-300", lift > 0 ? "hover:scale-[1.15] hover:z-10 cursor-help hover:border-border shadow-lg" : "opacity-20")} style={{ background: color, opacity }}>
                    {lift > 0 && <span className="text-[15px] font-black text-foreground group-hover:text-primary-foreground transition-colors font-['IBM_Plex_Mono',monospace]">{lift.toFixed(1)}</span>}
                    {lift > 0 && (
                      <div className="absolute inset-x-0 -top-12 opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none translate-y-2 group-hover:translate-y-0">
                        <div className="bg-popover px-3 py-2 rounded-lg border border-primary/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-1">
                          <span className="text-[13px] text-primary font-black tracking-widest">{formatLabel(row)} & {formatLabel(col)}</span>
                          <span className="text-[15px] text-popover-foreground font-black">{lift.toFixed(2)} Lift Score</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const CorrelationVennDiagram = ({ a, b, r, dev, lag }: { a: string, b: string, r: number, dev: string, lag: string }) => {
  const distance = 100 - (Math.abs(r) * 80);
  const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
  const labelA = formatLabel(a);
  const labelB = formatLabel(b);
  const isNegativeLag = lag.includes('-');
  const lagColor = isNegativeLag ? '#EF4444' : '#3DDAB4';

  return (
    <div className="bg-card border border-border rounded-[20px] p-5 flex flex-col items-center animate-in zoom-in duration-500 hover:border-primary/50 transition-all group overflow-hidden shadow-2xl h-full justify-center gap-2 relative">
      <div className="w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-[15px] font-black text-foreground tracking-[0.1em] font-['IBM_Plex_Mono',monospace] opacity-90">{labelA} & {labelB}</span>
        </div>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <defs>
            <linearGradient id={`grad-left-${a}-${b}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3DDAB4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3DDAB4" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id={`grad-right-${a}-${b}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <clipPath id={`clip-overlap-${a}-${b}`}>
              <circle cx={200 + distance / 2} cy="100" r="90" />
            </clipPath>
          </defs>

          {/* Left Circle (A) */}
          <circle cx={200 - distance / 2} cy="100" r="90" fill={`url(#grad-left-${a}-${b})`} stroke="#3DDAB4" strokeWidth="2.5" strokeDasharray="6 3" className="opacity-80" />

          {/* Right Circle (B) */}
          <circle cx={200 + distance / 2} cy="100" r="90" fill={`url(#grad-right-${a}-${b})`} stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="6 3" className="opacity-80 transition-opacity" />

          {/* Overlap Highlight */}
          <g clipPath={`url(#clip-overlap-${a}-${b})`}>
            <circle cx={200 - distance / 2} cy="100" r="90" fill="white" fillOpacity="0.08" className="animate-pulse" />
          </g>

          {/* Side Labels - Vertical */}
          <text
            x={200 - distance / 2 - 105}
            y="100"
            textAnchor="middle"
            transform={`rotate(-90, ${200 - distance / 2 - 105}, 100)`}
            className="fill-foreground text-[14px] font-black font-['IBM_Plex_Mono',monospace] tracking-widest opacity-95"
          >
            {labelA}
          </text>

          <text
            x={200 + distance / 2 + 105}
            y="100"
            textAnchor="middle"
            transform={`rotate(90, ${200 + distance / 2 + 105}, 100)`}
            className="fill-foreground text-[14px] font-black font-['IBM_Plex_Mono',monospace] tracking-widest opacity-95"
          >
            {labelB}
          </text>

          {/* Centered Stats in Overlap */}
          <g className="font-['IBM_Plex_Mono',monospace] font-black">
            <text x="200" y="95" textAnchor="middle">
              <tspan className="fill-foreground" fontSize="16" letterSpacing="0.1em">Corr </tspan>
              <tspan fill="#3DDAB4" fontSize="28" letterSpacing="-0.02em">{(r * 100).toFixed(0)}%</tspan>
            </text>
            <text x="200" y="125" textAnchor="middle">
              <tspan className="fill-foreground" fontSize="15" letterSpacing="0.1em">Lag </tspan>
              <tspan fill={lagColor} fontSize="20" letterSpacing="-0.02em">{lag.replace(' polls', '')}</tspan>
            </text>
          </g>
        </svg>
      </div>


    </div>
  );
};

const CausalVennDiagram = ({ cause, effect, fstat, p, lag, dev }: { cause: string, effect: string, fstat: number, p: string, lag: string, dev: string }) => {
  const prob = Math.min(99.9, 100 * (1 - Math.exp(-fstat / 35))).toFixed(1);
  const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
  const labelC = formatLabel(cause);
  const labelE = formatLabel(effect);
  const isNegativeLag = lag.includes('-');
  const lagColor = isNegativeLag ? '#EF4444' : '#3DDAB4';

  return (
    <div className="bg-card border border-border rounded-[20px] p-5 flex flex-col items-center animate-in zoom-in duration-500 hover:border-amber-500/50 transition-all group overflow-hidden shadow-2xl h-full justify-center gap-2 relative">
      <div className="w-full relative z-10">
        <div className="flex items-center justify-center text-center px-1">
          <span className="text-[15px] font-black text-foreground tracking-[0.1em] font-['IBM_Plex_Mono',monospace] opacity-90 leading-tight">
            {labelC} <span className="opacity-50 mx-1">→</span> {labelE}
          </span>
        </div>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.08)]">
          <defs>
            <linearGradient id={`grad-cause-${cause}-${effect}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id={`grad-effect-${cause}-${effect}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <marker id={`arrowhead-causal-${cause}-${effect}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orientation="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
            </marker>
            <clipPath id={`clip-causal-overlap-${cause}-${effect}`}>
              <circle cx="250" cy="100" r="90" />
            </clipPath>
          </defs>

          {/* Lines (Arrows) */}
          <path d="M 150 100 Q 200 80, 250 100" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" className="opacity-30 translate-y-[-15px]" />
          <path d="M 150 100 Q 200 120, 250 100" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 4" className="opacity-30 translate-y-[15px]" />

          {/* Left Circle (Cause) */}
          <circle cx="150" cy="100" r="90" fill={`url(#grad-cause-${cause}-${effect})`} stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" className="opacity-80" />

          {/* Right Circle (Effect) */}
          <circle cx="250" cy="100" r="90" fill={`url(#grad-effect-${cause}-${effect})`} stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="6 3" className="opacity-80 transition-opacity group-hover:opacity-100" />

          {/* Overlap Highlight */}
          <g clipPath={`url(#clip-causal-overlap-${cause}-${effect})`}>
            <circle cx="150" cy="100" r="90" fill="white" fillOpacity="0.08" className="animate-pulse" />
          </g>

          {/* Main Arrow in center */}
          <line
            x1="150" y1="100" x2="235" y2="100"
            stroke="#F59E0B"
            strokeWidth="3.5"
            markerEnd={`url(#arrowhead-causal-${cause}-${effect})`}
            className="animate-pulse opacity-80"
          />

          {/* Side Labels - Vertical */}
          <text
            x={150 - 105}
            y="100"
            textAnchor="middle"
            transform={`rotate(-90, ${150 - 105}, 100)`}
            className="fill-foreground text-[14px] font-black font-['IBM_Plex_Mono',monospace] tracking-widest opacity-95"
          >
            {labelC}
          </text>

          <text
            x={250 + 105}
            y="100"
            textAnchor="middle"
            transform={`rotate(90, ${250 + 105}, 100)`}
            className="fill-foreground text-[14px] font-black font-['IBM_Plex_Mono',monospace] tracking-widest opacity-95"
          >
            {labelE}
          </text>

          {/* Centered Stats in Overlap */}
          <g className="font-['IBM_Plex_Mono',monospace] font-black drop-shadow-md">
            <text x="200" y="82" textAnchor="middle">
              <tspan className="fill-foreground" fontSize="16" letterSpacing="0.1em">Conf </tspan>
              <tspan fill="#3DDAB4" fontSize="28" letterSpacing="-0.02em">{prob}%</tspan>
            </text>
            <text x="200" y="138" textAnchor="middle">
              <tspan className="fill-foreground" fontSize="15" letterSpacing="0.1em">Lag </tspan>
              <tspan fill={lagColor} fontSize="20" letterSpacing="-0.02em">{lag.replace(' min', 'm')}</tspan>
            </text>
          </g>
        </svg>
      </div>


    </div>
  );
};

const MultivariateTrendPlot = ({ data }: { data: any[] }) => {
  const metrics = [
    { key: 'cpu', label: 'CPU' },
    { key: 'mem', label: 'MEM_UTIL' },
    { key: 'lat', label: 'LATENCY' },
    { key: 'qd', label: 'QUEUE_DEPTH' },
    { key: 'crc', label: 'CRC_ERRORS' }
  ];

  return (
    <div className="bg-card border border-border rounded-[15px] overflow-hidden shadow-2xl animate-in fade-in duration-1000 mt-6 relative group">
      <div className="px-5 py-3.5 bg-secondary/30 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-['IBM_Plex_Mono',monospace] text-[15px] tracking-[0.15em] text-primary font-black uppercase flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Multivariate Anomaly Spike Analysis
          </span>
          <span className="text-[13px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">Quantitative Drift Vectorization</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {data.slice(0, 5).map((d, i) => (
            <div key={i} className="flex items-center gap-2 bg-background border border-border/50 px-2 py-1 rounded-md">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length], boxShadow: `0 0 10px ${colors[i % colors.length]}` }} />
              <span className="font-['IBM_Plex_Mono',monospace] text-[13px] font-bold text-foreground uppercase tracking-tighter whitespace-nowrap">{d.e}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-10 h-[400px] relative mt-2">
        <div className="absolute left-4 top-1/2 -rotate-90 origin-left -translate-y-1/2 flex items-center gap-2 transition-opacity group-hover:opacity-100 opacity-40">
          <span className="font-['IBM_Plex_Mono',monospace] text-[13px] text-[#475569] font-black uppercase tracking-widest whitespace-nowrap">Spike Magnitude</span>
        </div>

        <svg className="w-full h-full overflow-visible" viewBox={`0 0 1000 ${chartHeight + paddingY}`}>
          {[0, 3.75, 7.5, 11.25, 15].map((v, i) => {
            const y = chartHeight - (v / 15 * chartHeight);
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2="1000" y2={y} stroke="currentColor" className="text-border/50" strokeWidth="0.5" strokeDasharray="4 4" />
                <text x={paddingX - 15} y={y} textAnchor="end" alignmentBaseline="middle" className="font-['IBM_Plex_Mono',monospace] text-[14px] fill-muted-foreground font-black">{v.toFixed(1)}%</text>
              </g>
            );
          })}

          {data.slice(0, 5).map((d, i) => {
            const color = colors[i % colors.length];
            const points = metrics.map((m, idx) => {
              const x = paddingX + (idx * (1000 - paddingX) / (metrics.length - 1));
              const val = d.metrics?.[m.key] || 0;
              const y = chartHeight - (Math.min(val, 15) / 15 * chartHeight);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={i} className="group/line">
                <polyline points={points} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 transition-all group-hover/line:opacity-100 group-hover/line:stroke-[5px]" />
                {metrics.map((m, idx) => {
                  const x = paddingX + (idx * (1000 - paddingX) / (metrics.length - 1));
                  const val = d.metrics?.[m.key] || 0;
                  const y = chartHeight - (Math.min(val, 15) / 15 * chartHeight);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="6" fill="hsl(var(--background))" stroke={color} strokeWidth="2.5" className="transition-all duration-500 group-hover/line:r-8 group-hover/line:opacity-100" />
                      <text x={x} y={y - 12} textAnchor="middle" className="font-['IBM_Plex_Mono',monospace] text-[14px] font-black opacity-0 group-hover/line:opacity-100 transition-opacity duration-300" fill={color}>{val.toFixed(1)}%</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          {metrics.map((m, idx) => {
            const x = paddingX + (idx * (1000 - paddingX) / (metrics.length - 1));
            return (
              <g key={idx}>
                <line x1={x} y1={chartHeight} x2={x} y2={chartHeight + 8} stroke="currentColor" strokeWidth="1" className="text-border" />
                <text x={x} y={chartHeight + 35} textAnchor="middle" className="font-['IBM_Plex_Mono',monospace] text-[14px] fill-muted-foreground font-black uppercase tracking-tighter">{m.label}</text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-border" />
          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-muted-foreground font-black uppercase tracking-[0.3em] whitespace-nowrap">Normalized Feature Space Vector</span>
          <div className="h-[1px] w-8 bg-border" />
        </div>
      </div>
    </div>
  );
};


const ClusterPlot = ({ clusters, limit }: { clusters: any[], limit: number }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const points = useMemo(() => {
    return clusters.flatMap((c, cIdx) => {
      const cent = c.centroids || { util_pct: 50, queue_depth: 30 };
      const centerX = Math.min(Math.max(cent.util_pct, 10), 90);
      const centerY = 100 - Math.min(Math.max(cent.queue_depth * 1.5, 10), 90);

      return Array.from({ length: 50 }).map((_, i) => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        return {
          x: centerX + z0 * 3.5,
          y: centerY + z1 * 3.5,
          c: c.c,
          cIdx,
          id: `${cIdx}-${i}`
        };
      });
    });
  }, [clusters]);

  const visiblePoints = points.slice(0, Math.min(points.length, limit * 10));

  return (
    <div className="relative w-full aspect-[4/3] bg-background border border-border rounded-xl overflow-hidden p-8 group shadow-2xl">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '10% 10%' }} />

      <div className="absolute left-7 top-8 bottom-8 w-[1px] bg-border h-full opacity-50" />
      <div className="absolute left-7 bottom-7 right-8 h-[1px] bg-border w-full opacity-50" />

      {[0, 25, 50, 75, 100].map(v => (
        <div key={v} className="absolute left-3 font-['IBM_Plex_Mono',monospace] text-[10px] text-muted-foreground -translate-y-1/2" style={{ bottom: `${7 + (v * 0.85)}%` }}>
          {v}
        </div>
      ))}

      {[0, 25, 50, 75, 100].map(v => (
        <div key={v} className="absolute bottom-3 font-['IBM_Plex_Mono',monospace] text-[10px] text-muted-foreground -translate-x-1/2" style={{ left: `${7 + (v * 0.85)}%` }}>
          {v}%
        </div>
      ))}

      <div className="relative w-full h-full border-l border-b border-[#334155]/30">
        {clusters.map((c, i) => {
          const cent = c.centroids || { util_pct: 50, queue_depth: 30 };
          const px = Math.min(Math.max(cent.util_pct, 10), 90);
          const py = 100 - Math.min(Math.max(cent.queue_depth * 1.5, 10), 90);
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={`cent-${i}`}
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-20 cursor-crosshair group/cent"
              style={{ left: `${px}%`, top: `${py}%` }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={cn("absolute inset-0 flex items-center justify-center transition-transform duration-300", isHovered ? "scale-125" : "scale-100 opacity-60")}>
                <div className="w-4 h-[1.5px]" style={{ background: c.c }} />
                <div className="h-4 w-[1.5px] absolute" style={{ background: c.c }} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[130%] group-hover/cent:-translate-y-[150%] transition-transform pointer-events-none">
                <div className="bg-popover/80 border border-border px-2 py-0.5 rounded-[4px] backdrop-blur-sm shadow-2xl flex items-center gap-2 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.c }} />
                  {(() => {
                    const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
                    return <span className="text-[12px] font-black text-foreground/90 font-['IBM_Plex_Mono',monospace] tracking-widest leading-none mt-0.5">{formatLabel(c.n)}</span>;
                  })()}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-border" />
              </div>

              {isHovered && (
                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 bg-popover/95 border border-primary/40 p-3 rounded-lg shadow-2xl z-[100] min-w-[140px] backdrop-blur-md animate-in fade-in zoom-in duration-200">
                  {(() => {
                    const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
                    return <div className="text-[14px] font-bold text-foreground mb-1 whitespace-nowrap tracking-wider" style={{ color: c.c }}>{formatLabel(c.n)}</div>;
                  })()}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[13px] font-['IBM_Plex_Mono',monospace]">
                      <span className="text-muted-foreground">Util %</span>
                      <span className="text-foreground">{cent.util_pct}%</span>
                    </div>
                    <div className="flex justify-between text-[13px] font-['IBM_Plex_Mono',monospace]">
                      <span className="text-muted-foreground">Queue D.</span>
                      <span className="text-foreground">{cent.queue_depth.toFixed(1)}</span>
                    </div>
                    <div className="pt-1 mt-1 border-t border-border/10 flex justify-between text-[13px] font-['IBM_Plex_Mono',monospace]">
                      <span className="text-muted-foreground">Share</span>
                      <span className="text-emerald-500 font-bold">{((c.size / 8156) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visiblePoints.map((p) => {
          const isDimmed = hoveredIdx !== null && hoveredIdx !== p.cIdx;
          return (
            <div
              key={p.id}
              className="absolute h-1 w-1 rounded-full blur-[0.2px] transition-all duration-300 animate-in fade-in zoom-in"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: p.c,
                boxShadow: isDimmed ? 'none' : `0 0 5px ${p.c}80`,
                opacity: isDimmed ? 0.15 : 1,
                transform: hoveredIdx === p.cIdx ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          );
        })}
      </div>

      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-muted-foreground font-['IBM_Plex_Mono',monospace] tracking-[0.25em] font-bold opacity-80">
        Queue Depth Norm
      </div>
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-[11px] text-muted-foreground font-['IBM_Plex_Mono',monospace] tracking-[0.25em] font-bold opacity-80">
        Network Utilization
      </div>

      {limit < 10 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-primary/5 border border-primary/20 rounded backdrop-blur-sm">
          <Loader2 className="w-3 h-3 text-primary animate-spin" />
          <span className="text-[10px] font-bold text-primary tracking-widest">Plotting Clusters</span>
        </div>
      )}
    </div>
  );
};

const ClusterDonutPlot = ({ clusters, deviceFilter }: { clusters: any[], deviceFilter: string }) => {
  const totalWindows = deviceFilter === 'device' ? 4079 : 8156;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col items-center gap-6 animate-in fade-in duration-700">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {clusters.map((c, i) => {
            const switchSize = (deviceFilter !== 'device') ? (D.clS[i]?.size || 0) : 0;
            const totalSize = c.size + switchSize;
            const pct = totalSize / totalWindows;
            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPct * circumference;

            const midAngle = (accumulatedPct + pct / 2) * 2 * Math.PI;
            const lx = 50 + radius * Math.cos(midAngle);
            const ly = 50 + radius * Math.sin(midAngle);

            accumulatedPct += pct;

            return (
              <g key={i} className="group/segment">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={c.c}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out hover:stroke-foreground/20"
                />
                {pct > 0.1 && (
                  <text
                    x={lx}
                    y={ly}
                    fill="hsl(var(--foreground))"
                    textAnchor="middle"
                    className="text-[9px] font-black pointer-events-none drop-shadow-md"
                    transform={`rotate(90 ${lx} ${ly})`}
                    style={{ dominantBaseline: 'middle' }}
                  >
                    {Math.round(pct * 100)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-muted-foreground font-black tracking-widest leading-none mb-1">Scale</span>
          <span className="text-[17px] font-black text-foreground tabular-nums leading-none">100%</span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        <div className="text-[12px] text-muted-foreground font-black tracking-[0.2em] mb-2 border-b border-border/10 pb-1">Cluster Share</div>
        {clusters.map((c, i) => {
          const switchSize = (deviceFilter !== 'device') ? (D.clS[i]?.size || 0) : 0;
          const totalSize = c.size + switchSize;
          const pct = ((totalSize / totalWindows) * 100).toFixed(1);
          return (
            <div key={i} className="flex items-center justify-between group transition-colors hover:text-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.c }} />
                {(() => {
                  const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
                  return <span className="text-[13px] font-bold text-muted-foreground group-hover:text-foreground truncate max-w-[150px] tracking-tighter">{formatLabel(c.n)}</span>;
                })()}
              </div>
              <span className="text-[13px] font-black text-emerald-500 font-['IBM_Plex_Mono',monospace]">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const PreEventComparisonPlot = ({ data }: { data: any[] }) => {
  const displayEvents = data.slice(0, 4);
  const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-visible">
      {displayEvents.map((pe, idx) => {
        const eventMax = Math.max(...pe.metrics.map((m: any) => Math.max(m.normal || 0, m.pre || 0)), 1);

        return (
          <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:bg-secondary/40 transition-all group animate-in slide-in-from-bottom-4 duration-500 shadow-xl" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex items-center justify-between mb-8 border-b border-border/10 pb-4">
              <span className="text-[16px] font-black text-foreground tracking-tight font-['IBM_Plex_Mono',monospace]">{formatLabel(pe.evt)}: Normal Vs Pre-Event</span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span className="text-[13px] font-bold text-muted-foreground">Normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span className="text-[13px] font-bold text-muted-foreground">Pre-Event</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between h-[180px] px-2 gap-8 mb-12 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                {[0, 1, 2, 3, 4].map(line => <div key={line} className="w-full h-px bg-white" />)}
              </div>

              {pe.metrics.map((m: any, midx: number) => {
                const normalH = (m.normal / eventMax) * 100;
                const preH = (m.pre / eventMax) * 100;
                const isSignificant = Math.abs(m.dpct) > 50;

                return (
                  <div key={midx} className="flex-1 flex flex-col items-center h-full relative group/metric">
                    <div className="flex-1 w-full flex items-end justify-center gap-1.5 px-1 relative z-10">
                      <div className="w-full max-w-[12px] bg-primary rounded-t-[2px] transition-all duration-1000 relative group-hover/metric:brightness-125" style={{ height: `${normalH}%` }}>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/metric:opacity-100 transition-opacity whitespace-nowrap bg-popover p-1 rounded text-[12px] font-mono text-popover-foreground z-50">{m.normal.toFixed(1)}</div>
                      </div>
                      <div className="w-full max-w-[12px] bg-orange-500 rounded-t-[2px] transition-all duration-1000 relative group-hover/metric:brightness-125" style={{ height: `${preH}%` }}>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/metric:opacity-100 transition-opacity whitespace-nowrap bg-popover p-1 rounded text-[12px] font-mono text-popover-foreground z-50">{m.pre.toFixed(1)}</div>
                      </div>
                    </div>

                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap origin-center -rotate-45">
                      <span className={cn("text-[12px] font-bold tracking-tight py-0.5 px-1 rounded transition-colors",
                        "text-muted-foreground group-hover/metric:text-foreground")}>
                        {formatLabel(m.m)}
                      </span>
                    </div>

                    {isSignificant && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="text-[11px] font-black text-[#F97316] bg-[#F97316]/10 px-1 rounded border border-[#F97316]/20">+{m.dpct}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LollipopChart = ({
  data,
  labelX,
  unit = "",
  focusMetric,
  onFocusChange,
  metricsList = []
}: {
  data: { label: string, val: number, color?: string }[],
  labelX: string,
  unit?: string,
  focusMetric?: string,
  onFocusChange?: (v: string) => void,
  metricsList?: string[]
}) => {
  const max = Math.max(...data.map(d => Math.abs(d.val)), 0.01);
  return (
    <div className="bg-card border border-border rounded-[10px] p-4 h-full flex flex-col shadow-2xl">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center px-1">
          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-muted-foreground tracking-[0.2em] uppercase font-bold">Strength Ranking</span>
        </div>

        {onFocusChange && metricsList.length > 0 && (
          <div className="space-y-1.5 px-1">
            <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-muted-foreground uppercase opacity-40 font-bold tracking-widest">FocusMetric:</div>
            <select
              value={focusMetric}
              onChange={(e) => onFocusChange(e.target.value)}
              className="w-full h-8 bg-secondary border border-border rounded-[4px] text-[13px] font-['IBM_Plex_Mono',monospace] text-foreground px-2 outline-none cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="all">All pairs ranked</option>
              {metricsList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {data.map((d, i) => {
          const w = Math.min((Math.abs(d.val) / max) * 100, 100);
          return (
            <div key={i} className="group grid grid-cols-[210px_1fr] gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="font-['IBM_Plex_Mono',monospace] text-[13px] text-muted-foreground text-right font-medium truncate pr-4 border-r border-border/10 h-10 flex items-center justify-end uppercase tracking-tighter">
                {d.label}
              </div>
              <div className="relative h-10 w-full flex items-center pr-4">
                <div
                  className="h-8 transition-all duration-1000 ease-out rounded-[4px] flex items-center justify-end px-3 font-['IBM_Plex_Mono',monospace] text-[13px] font-bold text-white shadow-lg"
                  style={{
                    width: `${Math.max(w, 15)}%`,
                    background: `linear-gradient(90deg, ${d.color || '#2563EB'} 0%, ${d.color || '#3B82F6'} 100%)`,
                    boxShadow: `0 4px 15px ${(d.color || '#3B82F6')}20`
                  }}
                >
                  <span className="drop-shadow-md whitespace-nowrap">{d.val.toFixed(1)}{unit}</span>
                </div>
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-[13px] text-muted-foreground font-['IBM_Plex_Mono',monospace] uppercase tracking-widest  gap-2 opacity-50">
            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
            No results found for focus
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-border/10">
        <div className="flex justify-between font-['IBM_Plex_Mono',monospace] text-[11px] text-muted-foreground tracking-tighter font-black">
          <span>0.0</span>
          <span>{(max * 0.5).toFixed(2)}</span>
          <span>{max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const STEP_CATEGORIES: Record<string, string> = {
  'Data': 'Data Prep',
  'Cross Correlation': 'Time-Lag Correlation',
  'Granger Causality': 'Causal Correlation',
  'Pre-event': 'Pre Event Behavior',
  'K-means': 'Unsupervised Learning',
  'Random Forest': 'Supervised ML (Classification)',
  'Sequences': 'Sequential Pattern Mining',
  'Isolation Forest': 'Unsupervised Learning',
  'Chains': 'Failure Chain Patterns',
  'Co-occurrence': 'Event Co-Occurrence',
};

const TERMINAL_LOG = `==============================================================================
 NETWORK PATTERN MINING SYSTEM  v3
==============================================================================

  Run started      : 2026-03-12 17:00:23
  Metrics          : ./data/metrics.csv
  Events           : ./data/events.csv
  Device metrics   : ./data/device_metrics.csv
  Device map       : ./data/interface_device_map.csv
  Mode             : RETRAIN (overwriting existing models)

  Run config:
    Poll interval  : 5 min
    Window size    : 15 polls = 75 min
    Lookahead      : 2 polls = 10 min
    Clusters (K)   : 4
    RF trees       : 150
    Min seq support: 2
    Min seq lift   : 1.5

==============================================================================
 DATA LOADING & PREPROCESSING
==============================================================================

  Loading data ...
  metrics.csv    : 8,640 rows | 30 entities | 2 device types
  events.csv     : 2,129 rows | 6 event types
  Interface cols : ['util_pct', 'queue_depth', 'crc_errors', 'latency_ms']
  Event types    : ['DEVICE_REBOOT', 'HIGH_LATENCY', 'HIGH_UTIL_WARNING', 'INTERFACE_FLAP', 'LINK_DOWN', 'PACKET_DROP']
  Device types   : ['router', 'switch']
  Time range     : 2025-12-31 23:59:33 -> 2026-01-01 23:55:27
  Event source   : interface=2,127  device=2

  Resampled -> 8,636 rows from 8,640 raw rows (30 entities)

==============================================================================
 MERGING DEVICE RESOURCE METRICS
==============================================================================

  Device dedup: 2,880 -> 2,173 rows (707 bucket collisions collapsed)
  Device metrics join: 8,636/8,636 rows matched (100.0%)
  Device metric columns added: ['cpu_pct', 'mem_util_pct', 'temp_c', 'fan_speed_rpm', 'power_supply_status', 'reboot_delta']

  Device types: ['router', 'switch']
    router          entities=15  events=1533
    switch          entities=15  events=596

==============================================================================
 BUILDING SLIDING WINDOWS
==============================================================================

  Building windows for 30 entities ...
    ... 100% Complete
                                                  
  Total windows : 8,156
  Feature dims  : 70

  Event label distribution:
  Event                           Positive     Rate
  ------------------------------------------------------------------------------
  HIGH_LATENCY                         343     4.2%
  HIGH_UTIL_WARNING                   1017    12.5%
  INTERFACE_FLAP                       630     7.7%
  PACKET_DROP                          986    12.1%

##############################################################################
# PROCESSING: ROUTER
##############################################################################

==============================================================================
 SECTION 1 — CROSS-CORRELATION [ROUTER]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.7516      0.7159  queue_depth LEADS util_pct by 5 min
  util_pct               crc_errors                   -2 polls     0.7381      0.7158  crc_errors LEADS util_pct by 10 min
  util_pct               latency_ms                   -1 polls     0.7530      0.7235  latency_ms LEADS util_pct by 5 min
  util_pct               cpu_pct                      +0 polls     0.7830      0.7541  simultaneous
  util_pct               mem_util_pct                 -1 polls     0.6164      0.6073  mem_util_pct LEADS util_pct by 5 min
  util_pct               temp_c                       -2 polls     0.6433      0.6173  temp_c LEADS util_pct by 10 min
  util_pct               fan_speed_rpm                -2 polls     0.1640      0.1538  fan_speed_rpm LEADS util_pct by 10 min
  util_pct               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  util_pct               reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  queue_depth            crc_errors                   -1 polls     0.9432      0.9442  crc_errors LEADS queue_depth by 5 min
  queue_depth            latency_ms                   +0 polls     0.9959      0.9933  simultaneous
  queue_depth            cpu_pct                      +1 polls     0.8546      0.8052  queue_depth LEADS cpu_pct by 5 min
  queue_depth            mem_util_pct                 +1 polls     0.6727      0.6167  queue_depth LEADS mem_util_pct by 5 min
  queue_depth            temp_c                       -1 polls     0.6630      0.6128  temp_c LEADS queue_depth by 5 min
  queue_depth            fan_speed_rpm                -2 polls     0.2552      0.2042  fan_speed_rpm LEADS queue_depth by 10 min
  queue_depth            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  queue_depth            reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  crc_errors             latency_ms                   +1 polls     0.9399      0.9398  crc_errors LEADS latency_ms by 5 min
  crc_errors             cpu_pct                      +2 polls     0.8010      0.7827  crc_errors LEADS cpu_pct by 10 min
  crc_errors             mem_util_pct                 +2 polls     0.6473      0.5991  crc_errors LEADS mem_util_pct by 10 min
  crc_errors             temp_c                       +1 polls     0.6210      0.5960  crc_errors LEADS temp_c by 5 min
  crc_errors             fan_speed_rpm                -1 polls     0.2289      0.2017  fan_speed_rpm LEADS crc_errors by 5 min
  crc_errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  crc_errors             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  latency_ms             cpu_pct                      +1 polls     0.8488      0.8040  latency_ms LEADS cpu_pct by 5 min
  latency_ms             mem_util_pct                 +1 polls     0.6778      0.6182  latency_ms LEADS mem_util_pct by 5 min
  latency_ms             temp_c                       -1 polls     0.6629      0.6139  temp_c LEADS latency_ms by 5 min
  latency_ms             fan_speed_rpm                -2 polls     0.2621      0.2089  fan_speed_rpm LEADS latency_ms by 10 min
  latency_ms             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  latency_ms             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                mem_util_pct                 -3 polls     0.7047      0.6618  mem_util_pct LEADS cpu_pct by 15 min
  cpu_pct                temp_c                       -2 polls     0.7313      0.7129  temp_c LEADS cpu_pct by 10 min
  cpu_pct                fan_speed_rpm                -2 polls     0.2452      0.2289  fan_speed_rpm LEADS cpu_pct by 10 min
  cpu_pct                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           temp_c                       +1 polls     0.6262      0.6196  mem_util_pct LEADS temp_c by 5 min
  mem_util_pct           fan_speed_rpm                -6 polls     0.1894      0.1639  fan_speed_rpm LEADS mem_util_pct by 30 min
  mem_util_pct           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  temp_c                 fan_speed_rpm                +0 polls     0.2749      0.2715  simultaneous
  temp_c                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  temp_c                 reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  power_supply_status    reboot_delta                 +0 polls     0.0000      0.0000  simultaneous

==============================================================================
 SECTION 2 — GRANGER CAUSALITY [ROUTER]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +2 polls   63.183     0.000000  *** SIGNIFICANT ***
  util_pct               crc_errors                   +3 polls   34.934     0.000000  *** SIGNIFICANT ***
  util_pct               latency_ms                   +2 polls   54.799     0.000000  *** SIGNIFICANT ***
  util_pct               cpu_pct                      +6 polls    8.954     0.000000  *** SIGNIFICANT ***
  util_pct               mem_util_pct                 +1 polls   45.770     0.000000  *** SIGNIFICANT ***
  util_pct               temp_c                       +1 polls   56.131     0.000000  *** SIGNIFICANT ***
  util_pct               fan_speed_rpm                +9 polls    2.371     0.013630  *** SIGNIFICANT ***
  util_pct               power_supply_status          +1 polls    0.000     1.000000  not significant
  util_pct               reboot_delta                 +1 polls    0.000     1.000000  not significant
  queue_depth            crc_errors                   +1 polls  289.313     0.000000  *** SIGNIFICANT ***
  queue_depth            latency_ms                   +2 polls    4.154     0.016674  *** SIGNIFICANT ***
  queue_depth            cpu_pct                      +1 polls    9.095     0.002795  *** SIGNIFICANT ***
  queue_depth            mem_util_pct                 +1 polls   50.067     0.000000  *** SIGNIFICANT ***
  queue_depth            temp_c                       +1 polls   69.147     0.000000  *** SIGNIFICANT ***
  queue_depth            fan_speed_rpm                +7 polls    4.837     0.000038  *** SIGNIFICANT ***
  queue_depth            power_supply_status          +3 polls 8866.326     0.000000  *** SIGNIFICANT ***
  queue_depth            reboot_delta                 +1 polls    0.000     1.000000  not significant
  crc_errors             latency_ms                   +2 polls   14.463     0.000001  *** SIGNIFICANT ***
  crc_errors             cpu_pct                      +3 polls    3.706     0.012150  *** SIGNIFICANT ***
  crc_errors             mem_util_pct                 +1 polls   38.424     0.000000  *** SIGNIFICANT ***
  crc_errors             temp_c                       +1 polls   39.916     0.000000  *** SIGNIFICANT ***
  crc_errors             fan_speed_rpm                +7 polls    4.292     0.000162  *** SIGNIFICANT ***
  crc_errors             power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  crc_errors             reboot_delta                 +1 polls    0.000     1.000000  not significant
  latency_ms             cpu_pct                     +10 polls    2.809     0.002540  *** SIGNIFICANT ***
  latency_ms             mem_util_pct                 +1 polls   47.355     0.000000  *** SIGNIFICANT ***
  latency_ms             temp_c                       +1 polls   70.203     0.000000  *** SIGNIFICANT ***
  latency_ms             fan_speed_rpm                +7 polls    4.851     0.000036  *** SIGNIFICANT ***
  latency_ms             power_supply_status          +1 polls    0.000     1.000000  not significant
  latency_ms             reboot_delta                 +1 polls    0.000     1.000000  not significant
  cpu_pct                mem_util_pct                 +1 polls   61.350     0.000000  *** SIGNIFICANT ***
  cpu_pct                temp_c                       +1 polls   99.348     0.000000  *** SIGNIFICANT ***
  cpu_pct                fan_speed_rpm                +1 polls   11.531     0.000782  *** SIGNIFICANT ***
  cpu_pct                power_supply_status          +1 polls    0.000     1.000000  not significant
  cpu_pct                reboot_delta                 +1 polls    0.000     1.000000  not significant
  mem_util_pct           temp_c                       +1 polls   34.568     0.000000  *** SIGNIFICANT ***
  mem_util_pct           fan_speed_rpm                +7 polls    3.278     0.002331  *** SIGNIFICANT ***
  mem_util_pct           power_supply_status          +3 polls  745.558     0.000000  *** SIGNIFICANT ***
  mem_util_pct           reboot_delta                 +1 polls    0.000     1.000000  not significant
  temp_c                 fan_speed_rpm                +2 polls    4.492     0.012010  *** SIGNIFICANT ***
  temp_c                 power_supply_status          +3 polls  153.385     0.000000  *** SIGNIFICANT ***
  temp_c                 reboot_delta                 +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          reboot_delta                 +1 polls    0.000     1.000000  not significant
  power_supply_status    reboot_delta                 +1 polls    0.000     1.000000  not significant

==============================================================================
 SECTION 3 — PRE-EVENT METRIC BEHAVIOR [ROUTER]
==============================================================================

  [DEVICE_REBOOT] No occurrences — skipping.

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: HIGH_LATENCY | Occurrences: 231 | Pre-event windows: 343 | Normal windows: 2508 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     49.55          84.14   +34.59    +69.8%  UP
  queue_depth                   1.76          39.92   +38.16  +2168.8%  UP
  crc_errors                    0.31          10.11    +9.80  +3194.7%  UP
  latency_ms                    7.76          44.00   +36.24   +467.2%  UP
  cpu_pct                      43.42          50.76    +7.34    +16.9%  UP
  mem_util_pct                 57.43          58.52    +1.09     +1.9%  UP
  temp_c                       49.08          49.57    +0.50     +1.0%  UP
  fan_speed_rpm              3219.73        3224.74    +5.01     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       343  [█···············]
  queue_depth                   1p        1p        1p       343  [█···············]
  crc_errors                    1p        1p        1p       343  [█···············]
  latency_ms                    1p        1p        1p       343  [█···············]
  cpu_pct                       6p        1p        1p       343  [█▄▄·▄▄·········]
  mem_util_pct                 15p        5p        1p        85  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: HIGH_UTIL_WARNING | Occurrences: 532 | Pre-event windows: 719 | Normal windows: 2149 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     47.43          77.55   +30.11    +63.5%  UP
  queue_depth                   0.08          29.56   +29.48 +37608.5%  UP
  crc_errors                    0.05           7.30    +7.25 +13422.0%  UP
  latency_ms                    6.16          34.16   +28.00   +454.4%  UP
  cpu_pct                      43.17          48.80    +5.62    +13.0%  UP
  mem_util_pct                 57.40          58.27    +0.87     +1.5%  UP
  temp_c                       49.07          49.45    +0.38     +0.8%  UP
  fan_speed_rpm              3219.41        3225.44    +6.03     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       719  [█···············]
  queue_depth                   1p        1p        1p       719  [█···············]
  crc_errors                    2p        1p        1p       719  [█▄·············]
  latency_ms                    2p        1p        1p       719  [█▄·············]
  cpu_pct                      12p        1p        1p       719  [█▄▄▄▄▄▄··▄▄▄···]
  mem_util_pct                 15p        8p        1p       148  [██▄▄▄▄▄▄▄▄▄▄▄▄▄]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: INTERFACE_FLAP | Occurrences: 277 | Pre-event windows: 408 | Normal windows: 2409 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     49.73          85.24   +35.51    +71.4%  UP
  queue_depth                   1.44          42.19   +40.75  +2833.1%  UP
  crc_errors                    0.17          10.90   +10.73  +6225.1%  UP
  latency_ms                    7.44          46.18   +38.74   +520.3%  UP
  cpu_pct                      43.53          51.26    +7.73    +17.8%  UP
  mem_util_pct                 57.45          58.61    +1.16     +2.0%  UP
  temp_c                       49.09          49.61    +0.52     +1.1%  UP
  fan_speed_rpm              3220.11        3226.07    +5.96     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      2p        1p        1p       408  [█▄············]
  queue_depth                   1p        1p        1p       408  [█···············]
  crc_errors                    1p        1p        1p       408  [█···············]
  latency_ms                    1p        1p        1p       408  [█···············]
  cpu_pct                       6p        1p        1p       408  [█▄▄▄·▄·········]
  mem_util_pct                 15p        5p        1p        86  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [LINK_DOWN] No occurrences — skipping.

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: PACKET_DROP | Occurrences: 493 | Pre-event windows: 657 | Normal windows: 2202 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     48.03          80.15   +32.12    +66.9%  UP
  queue_depth                   0.28          33.31   +33.03 +11902.6%  UP
  crc_errors                    0.06           8.22    +8.16 +14634.7%  UP
  latency_ms                    6.35          37.70   +31.35   +493.8%  UP
  cpu_pct                      43.18          49.70    +6.52    +15.1%  UP
  mem_util_pct                 57.40          58.39    +0.99     +1.7%  UP
  temp_c                       49.07          49.52    +0.44     +0.9%  UP
  fan_speed_rpm              3219.60        3226.49    +6.89     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       657  [█···············]
  queue_depth                   1p        1p        1p       657  [█···············]
  crc_errors                    2p        1p        1p       657  [█▄·············]
  latency_ms                    1p        1p        1p       657  [█···············]
  cpu_pct                      12p        1p        1p       657  [█▄▄▄▄▄▄···▄···]
  mem_util_pct                 15p        6p        1p       136  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

==============================================================================
 SECTION 4 — PATTERN CLUSTERING [ROUTER]
==============================================================================

  Cluster  Name                       Size  No Event  Top Following Events
  ------------------------------------------------------------------------------
  0        Stable Baseline             678        6%  PACKET_DROP: 82% | HIGH_UTIL_WARNING: 75% | INTERFACE_FLAP: 60%
  1        Gradual Rise                614       91%  HIGH_UTIL_WARNING: 9% | PACKET_DROP: 5% | HIGH_LATENCY: 0%
  2        Congestion Buildup         1556       94%  HIGH_UTIL_WARNING: 6% | PACKET_DROP: 3% | INTERFACE_FLAP: 0%
  3        Spike/Recovery             1231       95%  HIGH_UTIL_WARNING: 5% | PACKET_DROP: 2% | HIGH_LATENCY: 0%

  Cluster Centroids  (interface: ['util_pct', 'queue_depth']  device: ['cpu_pct', 'mem_util_pct']):
  Cluster  Name                            util_pct     queue_depth         cpu_pct    mem_util_pct
  ------------------------------------------------------------------------------
  0        Stable Baseline                     89.0            60.4            54.0            59.4
  1        Gradual Rise                        49.2             3.8            41.9            57.5
  2        Congestion Buildup                  51.1             2.7            47.9            58.4
  3        Spike/Recovery                      50.9             2.1            38.7            56.4

==============================================================================
 SECTION 5 — RANDOM FOREST EVENT PREDICTOR [ROUTER]
==============================================================================

  Event                         Pos Rate  Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                     0.0%         —          —       —      —  SKIPPED (rate out of range)
  HIGH_LATENCY                      8.4%     0.962      0.732   0.870  0.795  OK

    Top 8 features for HIGH_LATENCY:
    Feature                             Importance  Bar
    latency_ms_last                         0.1523  ████
    queue_depth_last                        0.1475  ████
    crc_errors_last                         0.1018  ███
    util_pct_last                           0.0876  ██
    util_pct_mean                           0.0754  ██
    util_pct_max                            0.0570  █
    util_pct_min                            0.0461  █
    queue_depth_slope                       0.0351  █

  HIGH_UTIL_WARNING                17.6%     0.958      0.824   0.972  0.892  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    util_pct_last                           0.1731  █████
    latency_ms_last                         0.1303  ███
    queue_depth_last                        0.1256  ███
    util_pct_mean                           0.0680  ██
    util_pct_max                            0.0555  █
    latency_ms_std                          0.0440  █
    latency_ms_range                        0.0358  █
    crc_errors_last                         0.0310  

  INTERFACE_FLAP                   10.0%     0.967      0.778   0.939  0.851  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    crc_errors_last                         0.1458  ████
    latency_ms_last                         0.1202  ███
    queue_depth_last                        0.1105  ███
    util_pct_mean                           0.0867  ██
    util_pct_max                            0.0661  █
    util_pct_min                            0.0519  █
    latency_ms_mean                         0.0379  █
    queue_depth_mean                        0.0355  █

  LINK_DOWN                         0.0%         —          —       —      —  SKIPPED (rate out of range)
  PACKET_DROP                      16.1%     0.968      0.862   0.954  0.906  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    latency_ms_last                         0.1505  ████
    queue_depth_last                        0.1380  ████
    util_pct_last                           0.1185  ███
    crc_errors_last                         0.0785  ██
    util_pct_mean                           0.0721  ██
    util_pct_max                            0.0498  █
    util_pct_min                            0.0443  █
    latency_ms_slope                        0.0284  


==============================================================================
 SECTION 6 — EVENT SEQUENCE MINING [ROUTER]
==============================================================================
  Total sessions  : 32
  Unique devices  : 5

  Frequent 2-event sequences (support >= 2, lift >= 1.5):
  Sequence                                               Supp   Conf   Lift
  ------------------------------------------------------------------------------
  No sequences met support >= 2 AND lift >= 1.5.

  Frequent 3-event sequences (support >= 2):
  Sequence                                                         Supp   Conf
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP                 28   1.00
  HIGH_UTIL_WARNING -> PACKET_DROP -> HIGH_LATENCY                   26   0.93
  HIGH_UTIL_WARNING -> HIGH_LATENCY -> INTERFACE_FLAP                21   0.72
  PACKET_DROP -> HIGH_LATENCY -> INTERFACE_FLAP                      20   0.71
  HIGH_UTIL_WARNING -> INTERFACE_FLAP -> HIGH_LATENCY                 8   0.26
  PACKET_DROP -> INTERFACE_FLAP -> HIGH_LATENCY                       8   0.26
  PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP                  3   1.00
  PACKET_DROP -> HIGH_UTIL_WARNING -> HIGH_LATENCY                    2   0.67

==============================================================================
 SECTION 7 — ANOMALY DETECTION [ROUTER]
==============================================================================

  Isolation Forest: 204 / 4,079 windows flagged (5.0% anomaly rate, target=5%)

  Entity                          Anomaly %  Avg Score  Risk
  ------------------------------------------------------------------------------
  router-03:Gi0/3/0                   14.7%     0.0867  MED  ██
  router-02:Gi0/3/0                    8.1%     0.0880  MED  █
  router-02:Gi0/1/0                    7.3%     0.0858  MED  █
  router-01:Gi0/1/0                    7.0%     0.0797  low  █
  router-05:Gi0/2/0                    6.6%     0.0814  low  █
  router-02:Gi0/2/0                    5.5%     0.0854  low  █
  router-03:Gi0/1/0                    5.5%     0.0999  low  █
  router-03:Gi0/2/0                    3.7%     0.0975  low  
  router-01:Gi0/3/0                    3.7%     0.0769  low  
  router-04:Gi0/3/0                    3.7%     0.0838  low  
  router-04:Gi0/1/0                    3.3%     0.1106  low  
  router-01:Gi0/2/0                    2.6%     0.1022  low  
  router-04:Gi0/2/0                    1.8%     0.0824  low  
  router-05:Gi0/3/0                    1.1%     0.1041  low  
  router-05:Gi0/1/0                    0.4%     0.1004  low  

==============================================================================
 SECTION 8 — EVENT CO-OCCURRENCE MATRIX [ROUTER]
==============================================================================

  Co-occurrence Lift Matrix  (4 event types, 32 sessions)
  Lift > 1 = events tend to co-occur.  Lift < 1 = tend to be separate.

                                          HIGH_LAHIGH_UTINTERFAPACKET_
  ------------------------------------------------------------------------------
  HIGH_LATENCY                              —       1.0    1.0    1.0 
  HIGH_UTIL_WARNING                          1.0   —       1.0    1.0 
  INTERFACE_FLAP                             1.0    1.0   —       1.0 
  PACKET_DROP                                1.0    1.0    1.0   —    

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  HIGH_LATENCY                 INTERFACE_FLAP                      29   1.03
  HIGH_LATENCY                 PACKET_DROP                         29   1.03
  INTERFACE_FLAP               PACKET_DROP                         31   1.03
  HIGH_LATENCY                 HIGH_UTIL_WARNING                   29   1.00
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      31   1.00
  HIGH_UTIL_WARNING            PACKET_DROP                         31   1.00

==============================================================================
 SECTION 10 — FAILURE CHAIN PATTERNS [ROUTER]
==============================================================================

  Chain 1  [HIGH_LATENCY]  (5 metrics  |  seen 231x  |  343 pre-event windows)
  cpu_pct ↑  →  crc_errors ↑  →  queue_depth ↑  →  latency_ms ↑  →  util_pct ↑  →  HIGH_LATENCY

  Chain 2  [HIGH_UTIL_WARNING]  (5 metrics  |  seen 532x  |  719 pre-event windows)
  cpu_pct ↑  →  crc_errors ↑  →  latency_ms ↑  →  queue_depth ↑  →  util_pct ↑  →  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (5 metrics  |  seen 277x  |  408 pre-event windows)
  cpu_pct ↑  →  util_pct ↑  →  crc_errors ↑  →  queue_depth ↑  →  latency_ms ↑  →  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (5 metrics  |  seen 493x  |  657 pre-event windows)
  cpu_pct ↑  →  crc_errors ↑  →  queue_depth ↑  →  latency_ms ↑  →  util_pct ↑  →  PACKET_DROP

  Total chains: 4
  ##############################################################################
# PROCESSING: SWITCH
##############################################################################

==============================================================================
 SECTION 1 CROSS-CORRELATION [SWITCH]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.8218      0.7764  queue_depth LEADS util_pct by 5 min
  util_pct               crc_errors                   -2 polls     0.7701      0.7115  crc_errors LEADS util_pct by 10 min
  util_pct               latency_ms                   -1 polls     0.8136      0.7609  latency_ms LEADS util_pct by 5 min
  util_pct               cpu_pct                      +0 polls     0.7745      0.7337  simultaneous
  util_pct               mem_util_pct                 +3 polls     0.1789      0.1639  util_pct LEADS mem_util_pct by 15 min
  util_pct               temp_c                       -4 polls     0.3306      0.3076  temp_c LEADS util_pct by 20 min
  util_pct               fan_speed_rpm                +6 polls    -0.1051     -0.1133  util_pct LEADS fan_speed_rpm by 30 min
  util_pct               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  util_pct               reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  queue_depth            crc_errors                   -1 polls     0.9229      0.9128  crc_errors LEADS queue_depth by 5 min
  queue_depth            latency_ms                   +0 polls     0.9970      0.9946  simultaneous
  queue_depth            cpu_pct                      +1 polls     0.8704      0.8357  queue_depth LEADS cpu_pct by 5 min
  queue_depth            mem_util_pct                 +4 polls     0.1283      0.1056  queue_depth LEADS mem_util_pct by 20 min
  queue_depth            temp_c                       -3 polls     0.4010      0.4108  temp_c LEADS queue_depth by 15 min
  queue_depth            fan_speed_rpm                +7 polls    -0.1257     -0.1427  queue_depth LEADS fan_speed_rpm by 35 min
  queue_depth            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  queue_depth            reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  crc_errors             latency_ms                   +1 polls     0.9212      0.9060  crc_errors LEADS latency_ms by 5 min
  crc_errors             cpu_pct                      +2 polls     0.8009      0.7577  crc_errors LEADS cpu_pct by 10 min
  crc_errors             mem_util_pct                 -1 polls     0.1470      0.0952  mem_util_pct LEADS crc_errors by 5 min
  crc_errors             temp_c                       -2 polls     0.3676      0.3779  temp_c LEADS crc_errors by 10 min
  crc_errors             fan_speed_rpm                +7 polls    -0.1020     -0.1376  crc_errors LEADS fan_speed_rpm by 35 min
  crc_errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  crc_errors             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  latency_ms             cpu_pct                      +1 polls     0.8704      0.8384  latency_ms LEADS cpu_pct by 5 min
  latency_ms             mem_util_pct                 +4 polls     0.1279      0.1025  latency_ms LEADS mem_util_pct by 20 min
  latency_ms             temp_c                       -3 polls     0.3990      0.4092  temp_c LEADS latency_ms by 15 min
  latency_ms             fan_speed_rpm                +7 polls    -0.1125     -0.1271  latency_ms LEADS fan_speed_rpm by 35 min
  latency_ms             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  latency_ms             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                mem_util_pct                 +3 polls     0.1257      0.0909  cpu_pct LEADS mem_util_pct by 15 min
  cpu_pct                temp_c                       -3 polls     0.3849      0.3678  temp_c LEADS cpu_pct by 15 min
  cpu_pct                fan_speed_rpm                +6 polls    -0.1166     -0.1075  cpu_pct LEADS fan_speed_rpm by 30 min
  cpu_pct                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           temp_c                       -4 polls     0.1501      0.1332  temp_c LEADS mem_util_pct by 20 min
  mem_util_pct           fan_speed_rpm               -15 polls    -0.1811     -0.1548  fan_speed_rpm LEADS mem_util_pct by 75 min
  mem_util_pct           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  temp_c                 fan_speed_rpm                -8 polls    -0.1075     -0.0689  fan_speed_rpm LEADS temp_c by 40 min
  temp_c                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  temp_c                 reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  power_supply_status    reboot_delta                 +0 polls     0.0000      0.0000  simultaneous

==============================================================================
 SECTION 2 GRANGER CAUSALITY [SWITCH]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +2 polls   88.877     0.000000  *** SIGNIFICANT ***
  util_pct               crc_errors                   +3 polls   35.252     0.000000  *** SIGNIFICANT ***
  util_pct               latency_ms                   +2 polls   78.646     0.000000  *** SIGNIFICANT ***
  util_pct               cpu_pct                      +1 polls   39.315     0.000000  *** SIGNIFICANT ***
  util_pct               mem_util_pct                 +1 polls    4.605     0.032731  *** SIGNIFICANT ***
  util_pct               temp_c                       +3 polls    7.507     0.000075  *** SIGNIFICANT ***
  util_pct               fan_speed_rpm                +9 polls    1.180     0.307961  not significant
  util_pct               power_supply_status          +1 polls    0.000     1.000000  not significant
  util_pct               reboot_delta                 +1 polls    0.000     1.000000  not significant
  queue_depth            crc_errors                   +1 polls  378.646     0.000000  *** SIGNIFICANT ***
  queue_depth            latency_ms                   +1 polls    6.264     0.012878  *** SIGNIFICANT ***
  queue_depth            cpu_pct                      +1 polls   27.223     0.000000  *** SIGNIFICANT ***
  queue_depth            mem_util_pct                 +1 polls    2.138     0.144833  not significant
  queue_depth            temp_c                       +3 polls   12.518     0.000000  *** SIGNIFICANT ***
  queue_depth            fan_speed_rpm                +8 polls    1.428     0.184647  not significant
  queue_depth            power_supply_status          +1 polls  340.595     0.000000  *** SIGNIFICANT ***
  queue_depth            reboot_delta                 +1 polls    0.000     1.000000  not significant
  crc_errors             latency_ms                   +3 polls   10.133     0.000002  *** SIGNIFICANT ***
  crc_errors             cpu_pct                     +10 polls    3.679     0.000129  *** SIGNIFICANT ***
  crc_errors             mem_util_pct                +10 polls    1.954     0.038654  *** SIGNIFICANT ***
  crc_errors             temp_c                       +3 polls   10.549     0.000001  *** SIGNIFICANT ***
  crc_errors             fan_speed_rpm                +8 polls    1.406     0.194020  not significant
  crc_errors             power_supply_status          +1 polls      inf     0.000000  *** SIGNIFICANT ***
  crc_errors             reboot_delta                 +1 polls    0.000     1.000000  not significant
  latency_ms             cpu_pct                      +1 polls   26.929     0.000000  *** SIGNIFICANT ***
  latency_ms             mem_util_pct                 +1 polls    1.826     0.177656  not significant
  latency_ms             temp_c                       +3 polls   12.073     0.000000  *** SIGNIFICANT ***
  latency_ms             fan_speed_rpm                +8 polls    1.436     0.181504  not significant
  latency_ms             power_supply_status          +3 polls   62.473     0.000000  *** SIGNIFICANT ***
  latency_ms             reboot_delta                 +1 polls    0.000     1.000000  not significant
  cpu_pct                mem_util_pct                 +9 polls    1.394     0.190964  not significant
  cpu_pct                temp_c                       +3 polls   10.891     0.000001  *** SIGNIFICANT ***
  cpu_pct                fan_speed_rpm               +10 polls    1.298     0.231773  not significant
  cpu_pct                power_supply_status          +3 polls  600.390     0.000000  *** SIGNIFICANT ***
  cpu_pct                reboot_delta                 +1 polls    0.000     1.000000  not significant
  mem_util_pct           temp_c                       +1 polls    2.497     0.115144  not significant
  mem_util_pct           fan_speed_rpm                +5 polls    1.610     0.157450  not significant
  mem_util_pct           power_supply_status          +3 polls 1395.000     0.000000  *** SIGNIFICANT ***
  mem_util_pct           reboot_delta                 +1 polls    0.000     1.000000  not significant
  temp_c                 fan_speed_rpm                +4 polls    1.126     0.344644  not significant
  temp_c                 power_supply_status          +1 polls    0.000     1.000000  not significant
  temp_c                 reboot_delta                 +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          reboot_delta                 +1 polls    0.000     1.000000  not significant
  power_supply_status    reboot_delta                 +1 polls    0.000     1.000000  not significant

==============================================================================
 SECTION 3 PRE-EVENT METRIC BEHAVIOR [SWITCH]
==============================================================================

  [DEVICE_REBOOT] No occurrences skipping.

  [HIGH_LATENCY] No occurrences skipping.

  ==========================================================================================================
  EVENT: HIGH_UTIL_WARNING | Occurrences: 178 | Pre-event windows: 265 | Normal windows: 2463
  ==========================================================================================================

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     36.58          64.47   +27.89    +76.2%  UP
  queue_depth                   0.38          18.53   +18.15  +4774.0%  UP
  crc_errors                    0.09           4.40    +4.31  +4727.6%  UP
  latency_ms                    3.52          17.04   +13.51   +383.7%  UP
  cpu_pct                      26.34          30.81    +4.47    +17.0%  UP
  mem_util_pct                 45.11          45.22    +0.11     +0.3%  UP
  temp_c                       42.07          42.18    +0.11     +0.3%  UP
  fan_speed_rpm              2605.95        2609.01    +3.06     +0.1%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       265  
  queue_depth                   1p        1p        1p       265  
  crc_errors                    2p        1p        1p       265  
  latency_ms                    1p        1p        1p       265  
  cpu_pct                       9p        1p        1p       265  
  mem_util_pct                 15p        8p        1p        68  
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ==========================================================================================================
  EVENT: INTERFACE_FLAP | Occurrences: 143 | Pre-event windows: 215 | Normal windows: 2675
  ==========================================================================================================

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     37.87          70.45   +32.58    +86.0%  UP
  queue_depth                   1.31          26.51   +25.19  +1916.2%  UP
  crc_errors                    0.26           7.16    +6.90  +2670.7%  UP
  latency_ms                    4.23          22.95   +18.72   +442.4%  UP
  cpu_pct                      26.45          32.35    +5.89    +22.3%  UP
  mem_util_pct                 45.11          45.27    +0.16     +0.4%  UP
  temp_c                       42.07          42.23    +0.16     +0.4%  UP
  fan_speed_rpm              2606.17        2608.08    +1.91     +0.1%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      2p        1p        1p       215  
  queue_depth                   1p        1p        1p       215  
  crc_errors                    1p        1p        1p       215  
  latency_ms                    1p        1p        1p       215  
  cpu_pct                       2p        1p        1p       215  
  mem_util_pct                 15p        8p        1p        53  
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ==========================================================================================================
  EVENT: LINK_DOWN | Occurrences: 2 | Pre-event windows: 4 | Normal windows: 4039
  ==========================================================================================================

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     42.91          81.05   +38.13    +88.9%  UP
  queue_depth                   6.12          46.36   +40.24   +657.1%  UP
  crc_errors                    2.06          17.41   +15.35   +745.8%  UP
  latency_ms                    7.80          37.34   +29.53   +378.5%  UP
  cpu_pct                      27.48          36.25    +8.78    +31.9%  UP
  mem_util_pct                 45.12          45.75    +0.63     +1.4%  UP
  temp_c                       42.10          42.32    +0.23     +0.5%  UP
  fan_speed_rpm              2606.62        2590.64   -15.98     -0.6%  DOWN
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p         4  
  queue_depth                   1p        1p        1p         4  
  crc_errors                    1p        1p        1p         4  
  latency_ms                    1p        1p        1p         4  
  cpu_pct                       3p        2p        1p         4  
  mem_util_pct                  1p        1p        1p         2  
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ==========================================================================================================
  EVENT: PACKET_DROP | Occurrences: 246 | Pre-event windows: 344 | Normal windows: 2380
  ==========================================================================================================

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     36.37          65.05   +28.68    +78.8%  UP
  queue_depth                   0.21          19.27   +19.06  +9148.6%  UP
  crc_errors                    0.06           4.68    +4.62  +8165.6%  UP
  latency_ms                    3.39          17.57   +14.18   +418.3%  UP
  cpu_pct                      26.29          30.83    +4.54    +17.3%  UP
  mem_util_pct                 45.11          45.22    +0.11     +0.2%  UP
  temp_c                       42.07          42.18    +0.11     +0.3%  UP
  fan_speed_rpm              2606.29        2607.24    +0.95     +0.0%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       344  
  queue_depth                   1p        1p        1p       344  
  crc_errors                    2p        1p        1p       344  
  latency_ms                    1p        1p        1p       344  
  cpu_pct                       9p        1p        1p       344  
  mem_util_pct                 15p        8p        1p        79  
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

==============================================================================
 SECTION 4 PATTERN CLUSTERING [SWITCH]
==============================================================================

  Cluster  Name                       Size  No Event  Top Following Events
  ------------------------------------------------------------------------------
  0        Stable Baseline            1547      100%  PACKET_DROP: 0% | HIGH_UTIL_WARNING: 0%
  1        Gradual Rise                457       14%  PACKET_DROP: 70% | HIGH_UTIL_WARNING: 53% | INTERFACE_FLAP: 47%
  2        Congestion Buildup         1431       98%  HIGH_UTIL_WARNING: 1% | PACKET_DROP: 1%
  3        Spike/Recovery              653       99%  HIGH_UTIL_WARNING: 1% | PACKET_DROP: 1% | INTERFACE_FLAP: 0%

  Cluster Centroids  (interface: ['util_pct', 'queue_depth']  device: ['cpu_pct', 'mem_util_pct']):
  Cluster  Name                            util_pct     queue_depth         cpu_pct    mem_util_pct
  ------------------------------------------------------------------------------
  0        Stable Baseline                     37.3             0.8            24.2            44.9
  1        Gradual Rise                        75.1            45.6            33.9            45.5
  2        Congestion Buildup                  41.4             2.3            29.6            45.3
  3        Spike/Recovery                      38.5             1.6            26.8            45.0

==============================================================================
 SECTION 5 RANDOM FOREST EVENT PREDICTOR [SWITCH]
==============================================================================

  Event                         Pos Rate  Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                     0.0%         SKIPPED (rate out of range)
  HIGH_LATENCY                      0.0%         SKIPPED (rate out of range)
  HIGH_UTIL_WARNING                 6.5%     0.968      0.680   0.962  0.797  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    util_pct_last                           0.1479  
    latency_ms_last                         0.1289  
    queue_depth_last                        0.1199  
    crc_errors_last                         0.0813  
    latency_ms_slope                        0.0763  
    util_pct_slope                          0.0654  
    util_pct_mean                           0.0628  
    queue_depth_slope                       0.0486  

  INTERFACE_FLAP                    5.3%     0.987      0.833   0.930  0.879  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    crc_errors_last                         0.1571  
    latency_ms_slope                        0.1304  
    queue_depth_last                        0.0810  
    latency_ms_last                         0.0788  
    queue_depth_slope                       0.0740  
    util_pct_mean                           0.0725  
    crc_errors_slope                        0.0431  
    util_pct_max                            0.0333  

  LINK_DOWN                         0.1%         SKIPPED (rate out of range)
  PACKET_DROP                       8.4%     0.983      0.840   0.986  0.907  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    queue_depth_last                        0.1539  
    latency_ms_last                         0.1428  
    latency_ms_slope                        0.0939  
    crc_errors_last                         0.0917  
    util_pct_last                           0.0838  
    util_pct_slope                          0.0707  
    util_pct_mean                           0.0533  
    queue_depth_slope                       0.0512  


==============================================================================
 SECTION 6  EVENT SEQUENCE MINING [SWITCH]
==============================================================================
  Total sessions  : 42
  Unique devices  : 5

  Frequent 2-event sequences (support >= 2, lift >= 1.5):
  Sequence                                               Supp   Conf   Lift
  ------------------------------------------------------------------------------
  No sequences met support >= 2 AND lift >= 1.5.

  Frequent 3-event sequences (support >= 2):
  Sequence                                                         Supp   Conf
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP                 19   0.86
  PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP                 13   0.68
  PACKET_DROP -> INTERFACE_FLAP -> LINK_DOWN                          2   0.06
  HIGH_UTIL_WARNING -> INTERFACE_FLAP -> LINK_DOWN                    2   0.06
  PACKET_DROP -> INTERFACE_FLAP -> HIGH_UTIL_WARNING                  2   0.06

==============================================================================
 SECTION 7  ANOMALY DETECTION [SWITCH]
==============================================================================

  Isolation Forest: 205 / 4,088 windows flagged (5.0% anomaly rate, target=5%)

  Entity                          Anomaly %  Avg Score  Risk
  ------------------------------------------------------------------------------
  switch-03:Eth1/2                    10.6%     0.1156  MED
  switch-02:Eth1/1                    10.3%     0.0982  MED  
  switch-03:Eth1/1                     9.5%     0.0976  MED  
  switch-01:Eth1/1                     8.1%     0.1056  MED  
  switch-05:Eth1/3                     8.1%     0.1160  MED  
  switch-04:Eth1/1                     6.2%     0.0914  low  
  switch-05:Eth1/2                     5.9%     0.0943  low  
  switch-01:Eth1/2                     4.4%     0.1126  low  
  switch-02:Eth1/2                     4.4%     0.1050  low  
  switch-03:Eth1/3                     3.3%     0.1148  low  
  switch-02:Eth1/3                     2.9%     0.1115  low  
  switch-05:Eth1/1                     1.1%     0.1128  low  
  switch-04:Eth1/3                     0.4%     0.1234  low  
  switch-01:Eth1/3                     0.0%     0.1218  low  
  switch-04:Eth1/2                     0.0%     0.1206  low  

==============================================================================
 SECTION 8 â€” EVENT CO-OCCURRENCE MATRIX [SWITCH]
==============================================================================

  Co-occurrence Lift Matrix  (4 event types, 42 sessions)
  Lift > 1 = events tend to co-occur.  Lift < 1 = tend to be separate.

                                          HIGH_UTINTERFALINK_DOPACKET_
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING                                   1.0    1.0    1.0 
  INTERFACE_FLAP                             1.0             1.2    1.0 
  LINK_DOWN                                  1.0    1.2             1.0 
  PACKET_DROP                                1.0    1.0      1.0          

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  INTERFACE_FLAP               LINK_DOWN                            2   1.20
  INTERFACE_FLAP               PACKET_DROP                         35   1.02
  LINK_DOWN                    PACKET_DROP                          2   1.02
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      35   1.00
  HIGH_UTIL_WARNING            LINK_DOWN                            2   1.00
  HIGH_UTIL_WARNING            PACKET_DROP                         41   1.00

==============================================================================
 SECTION 10 FAILURE CHAIN PATTERNS [SWITCH]
==============================================================================

  Chain 1  [HIGH_UTIL_WARNING]  (5 metrics  |  seen 178x  |  265 pre-event windows)
  cpu_pct â†‘  â†’  crc_errors â†‘  â†’  queue_depth â†‘  â†’  latency_ms â†‘  â†’  util_pct â†‘  â†’  HIGH_UTIL_WARNING

  Chain 2  [INTERFACE_FLAP]  (5 metrics  |  seen 143x  |  215 pre-event windows)
  util_pct â†‘  â†’  cpu_pct â†‘  â†’  crc_errors â†‘  â†’  queue_depth â†‘  â†’  latency_ms â†‘  â†’  INTERFACE_FLAP

  Chain 3  [PACKET_DROP]  (5 metrics  |  seen 246x  |  344 pre-event windows)
  cpu_pct â†‘  â†’  crc_errors â†‘  â†’  queue_depth â†‘  â†’  latency_ms â†‘  â†’  util_pct â†‘  â†’  PACKET_DROP

  Total chains: 3

==============================================================================
 SAVING MODELS
==============================================================================

  Models saved to: /opt/pattern_mining_code/models/

==============================================================================
 FINAL SUMMARY â€” ALL ALGORITHMS
==============================================================================

  ============================================================================================================================================================
  DEVICE TYPE: ROUTER
  ============================================================================================================================================================

  ============================================================================================================================================================
  Cross-Correlation Key Findings
  ============================================================================================================================================================
  queue_depth LEADS util_pct by 10 min (r=0.6833)
  crc_errors LEADS util_pct by 15 min (r=0.674)
  latency_ms LEADS util_pct by 10 min (r=0.6834)
  cpu_pct LEADS util_pct by 5 min (r=0.7133)
  mem_util_pct LEADS util_pct by 20 min (r=0.5183)
  temp_c LEADS util_pct by 15 min (r=0.5098)
  fan_speed_rpm LEADS util_pct by 5 min (r=0.1691)
  util_pct LEADS reboot_delta by 55 min (r=-0.1013)
  crc_errors LEADS queue_depth by 5 min (r=0.9319)
  queue_depth LEADS cpu_pct by 5 min (r=0.8502)
  mem_util_pct LEADS queue_depth by 15 min (r=0.666)
  temp_c LEADS queue_depth by 5 min (r=0.6257)
  queue_depth LEADS reboot_delta by 45 min (r=-0.0948)
  crc_errors LEADS latency_ms by 5 min (r=0.9266)
  crc_errors LEADS cpu_pct by 10 min (r=0.7872)
  crc_errors LEADS temp_c by 5 min (r=0.5656)
  crc_errors LEADS fan_speed_rpm by 5 min (r=0.2177)
  reboot_delta LEADS crc_errors by 15 min (r=0.1007)
  latency_ms LEADS cpu_pct by 5 min (r=0.8518)
  mem_util_pct LEADS latency_ms by 10 min (r=0.666)
  temp_c LEADS latency_ms by 5 min (r=0.6282)
  latency_ms LEADS reboot_delta by 45 min (r=-0.0962)
  mem_util_pct LEADS cpu_pct by 20 min (r=0.6931)
  temp_c LEADS cpu_pct by 5 min (r=0.6919)
  fan_speed_rpm LEADS cpu_pct by 10 min (r=0.158)
  reboot_delta LEADS cpu_pct by 75 min (r=0.1172)
  mem_util_pct LEADS temp_c by 10 min (r=0.5608)
  reboot_delta LEADS mem_util_pct by 70 min (r=0.1442)
  temp_c LEADS reboot_delta by 75 min (r=-0.1382)

  ============================================================================================================================================================
  Granger Causality Significant Pairs
  ============================================================================================================================================================
  util_pct->queue_depth  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->crc_errors  p=0.0  lag=20 min  *** SIGNIFICANT
  util_pct->latency_ms  p=0.0  lag=15 min  *** SIGNIFICANT
  util_pct->cpu_pct  p=0.0  lag=30 min  *** SIGNIFICANT
  util_pct->mem_util_pct  p=1e-06  lag=5 min  *** SIGNIFICANT
  util_pct->temp_c  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->fan_speed_rpm  p=0.029557  lag=5 min  *** SIGNIFICANT
  util_pct->reboot_delta  p=0.049878  lag=20 min  *** SIGNIFICANT
  queue_depth->crc_errors  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->cpu_pct  p=2.1e-05  lag=5 min  *** SIGNIFICANT
  queue_depth->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->fan_speed_rpm  p=0.029528  lag=5 min  *** SIGNIFICANT
  queue_depth->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->latency_ms  p=0.000146  lag=10 min  *** SIGNIFICANT
  crc_errors->cpu_pct  p=0.01251  lag=20 min  *** SIGNIFICANT
  crc_errors->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->temp_c  p=4e-06  lag=5 min  *** SIGNIFICANT
  crc_errors->fan_speed_rpm  p=0.048759  lag=5 min  *** SIGNIFICANT
  latency_ms->cpu_pct  p=3e-06  lag=5 min  *** SIGNIFICANT
  latency_ms->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->fan_speed_rpm  p=0.034426  lag=5 min  *** SIGNIFICANT
  cpu_pct->mem_util_pct  p=0.0  lag=10 min  *** SIGNIFICANT
  cpu_pct->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  cpu_pct->fan_speed_rpm  p=0.040932  lag=5 min  *** SIGNIFICANT
  cpu_pct->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  mem_util_pct->temp_c  p=3e-05  lag=5 min  *** SIGNIFICANT

  ============================================================================================================================================================
  Pre-Event Metric Patterns
  ============================================================================================================================================================
  DEVICE_REBOOT (7 occurrences)
    queue_depth            normal=10.9  pre-event=13.3  (+22%)
    Earliest warning: 70 min before event
  HIGH_LATENCY (242 occurrences)
    util_pct               normal=49.3  pre-event=84.6  (+72%)
    queue_depth            normal=1.4  pre-event=41.6  (+2784%)
    crc_errors             normal=0.2  pre-event=11.1  (+5687%)
    latency_ms             normal=7.5  pre-event=45.8  (+513%)
    cpu_pct                normal=42.3  pre-event=51.5  (+22%)
    Earliest warning: 75 min before event
  HIGH_UTIL_WARNING (505 occurrences)
    util_pct               normal=47.2  pre-event=76.7  (+63%)
    queue_depth            normal=0.1  pre-event=29.0  (+38973%)
    crc_errors             normal=0.1  pre-event=7.3  (+13334%)
    latency_ms             normal=6.2  pre-event=33.8  (+449%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (283 occurrences)
    util_pct               normal=49.4  pre-event=86.0  (+74%)
    queue_depth            normal=1.2  pre-event=44.6  (+3504%)
    crc_errors             normal=0.1  pre-event=12.3  (+10091%)
    latency_ms             normal=7.3  pre-event=48.7  (+569%)
    cpu_pct                normal=42.3  pre-event=52.0  (+23%)
    Earliest warning: 75 min before event
  PACKET_DROP (487 occurrences)
    util_pct               normal=47.7  pre-event=80.0  (+68%)
    queue_depth            normal=0.2  pre-event=33.9  (+15162%)
    crc_errors             normal=0.1  pre-event=8.7  (+15418%)
    latency_ms             normal=6.3  pre-event=38.5  (+510%)
    Earliest warning: 75 min before event

  ============================================================================================================================================================
  Random Forest Accuracy
  ============================================================================================================================================================
  HIGH_LATENCY                 acc=0.972  prec=0.788  recall=0.931  f1=0.854
    Top feature: latency_ms_last (0.1460)
  HIGH_UTIL_WARNING            acc=0.961  prec=0.836  recall=0.948  f1=0.888
    Top feature: util_pct_last (0.1763)
  INTERFACE_FLAP               acc=0.979  prec=0.865  recall=0.939  f1=0.901
    Top feature: crc_errors_last (0.1714)
  PACKET_DROP                  acc=0.974  prec=0.895  recall=0.944  f1=0.919
    Top feature: queue_depth_last (0.1619)

  ========================================================================================================================
  Top Event Sequences (with lift)
  ========================================================================================================================

  ========================================================================================================================
  Top Anomalous Entities
  ========================================================================================================================
  router-03:Gi0/1/0              anomaly_rate=11.8%  avg_score=0.1114
  router-02:Gi0/1/0              anomaly_rate=11.0%  avg_score=0.1015
  router-05:Gi0/2/0              anomaly_rate=9.2%  avg_score=0.1054
  router-01:Gi0/3/0              anomaly_rate=7.0%  avg_score=0.1210
  router-05:Gi0/3/0              anomaly_rate=6.2%  avg_score=0.1090
  
  ========================================================================================================================
  DEVICE TYPE: SWITCH
  ========================================================================================================================

  ========================================================================================================================
  Cross-Correlation Key Findings
  ========================================================================================================================
  queue_depth LEADS util_pct by 5 min (r=0.8218)
  crc_errors LEADS util_pct by 10 min (r=0.7701)
  latency_ms LEADS util_pct by 5 min (r=0.8136)
  util_pct LEADS mem_util_pct by 15 min (r=0.1789)
  temp_c LEADS util_pct by 20 min (r=0.3306)
  util_pct LEADS fan_speed_rpm by 30 min (r=-0.1051)
  crc_errors LEADS queue_depth by 5 min (r=0.9229)
  queue_depth LEADS cpu_pct by 5 min (r=0.8704)
  queue_depth LEADS mem_util_pct by 20 min (r=0.1283)
  temp_c LEADS queue_depth by 15 min (r=0.401)
  queue_depth LEADS fan_speed_rpm by 35 min (r=-0.1257)
  crc_errors LEADS latency_ms by 5 min (r=0.9212)
  crc_errors LEADS cpu_pct by 10 min (r=0.8009)
  mem_util_pct LEADS crc_errors by 5 min (r=0.147)
  temp_c LEADS crc_errors by 10 min (r=0.3676)
  crc_errors LEADS fan_speed_rpm by 35 min (r=-0.102)
  latency_ms LEADS cpu_pct by 5 min (r=0.8704)
  latency_ms LEADS mem_util_pct by 20 min (r=0.1279)
  temp_c LEADS latency_ms by 15 min (r=0.399)
  latency_ms LEADS fan_speed_rpm by 35 min (r=-0.1125)
  cpu_pct LEADS mem_util_pct by 15 min (r=0.1257)
  temp_c LEADS cpu_pct by 15 min (r=0.3849)
  cpu_pct LEADS fan_speed_rpm by 30 min (r=-0.1166)
  temp_c LEADS mem_util_pct by 20 min (r=0.1501)
  fan_speed_rpm LEADS mem_util_pct by 75 min (r=-0.1811)
  fan_speed_rpm LEADS temp_c by 40 min (r=-0.1075)

  ========================================================================================================================
  Granger Causality Significant Pairs
  ========================================================================================================================
  util_pct->queue_depth  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->crc_errors  p=0.0  lag=15 min  *** SIGNIFICANT
  util_pct->latency_ms  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->mem_util_pct  p=0.032731  lag=5 min  *** SIGNIFICANT
  util_pct->temp_c  p=7.5e-05  lag=15 min  *** SIGNIFICANT
  queue_depth->crc_errors  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->latency_ms  p=0.012878  lag=5 min  *** SIGNIFICANT
  queue_depth->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->temp_c  p=0.0  lag=15 min  *** SIGNIFICANT
  queue_depth->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->latency_ms  p=2e-06  lag=15 min  *** SIGNIFICANT
  crc_errors->cpu_pct  p=0.000129  lag=50 min  *** SIGNIFICANT
  crc_errors->mem_util_pct  p=0.038654  lag=50 min  *** SIGNIFICANT
  crc_errors->temp_c  p=1e-06  lag=15 min  *** SIGNIFICANT
  crc_errors->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->temp_c  p=0.0  lag=15 min  *** SIGNIFICANT
  latency_ms->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  cpu_pct->temp_c  p=1e-06  lag=15 min  *** SIGNIFICANT
  cpu_pct->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  mem_util_pct->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT

  ========================================================================================================================
  Pre-Event Metric Patterns
  ========================================================================================================================
  HIGH_UTIL_WARNING (178 occurrences)
    util_pct               normal=36.6  pre-event=64.5  (+76%)
    queue_depth            normal=0.4  pre-event=18.5  (+4774%)
    crc_errors             normal=0.1  pre-event=4.4  (+4728%)
    latency_ms             normal=3.5  pre-event=17.0  (+384%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (143 occurrences)
    util_pct               normal=37.9  pre-event=70.5  (+86%)
    queue_depth            normal=1.3  pre-event=26.5  (+1916%)
    crc_errors             normal=0.3  pre-event=7.2  (+2671%)
    latency_ms             normal=4.2  pre-event=23.0  (+442%)
    cpu_pct                normal=26.5  pre-event=32.3  (+22%)
    Earliest warning: 75 min before event
  LINK_DOWN (2 occurrences)
    util_pct               normal=42.9  pre-event=81.0  (+89%)
    queue_depth            normal=6.1  pre-event=46.4  (+657%)
    crc_errors             normal=2.1  pre-event=17.4  (+746%)
    latency_ms             normal=7.8  pre-event=37.3  (+378%)
    cpu_pct                normal=27.5  pre-event=36.3  (+32%)
    Earliest warning: 15 min before event
  PACKET_DROP (246 occurrences)
    util_pct               normal=36.4  pre-event=65.1  (+79%)
    queue_depth            normal=0.2  pre-event=19.3  (+9149%)
    crc_errors             normal=0.1  pre-event=4.7  (+8166%)
    latency_ms             normal=3.4  pre-event=17.6  (+418%)
    Earliest warning: 75 min before event

  ========================================================================================================================
  Random Forest Accuracy
  ========================================================================================================================
  HIGH_UTIL_WARNING            acc=0.968  prec=0.680  recall=0.962  f1=0.797
    Top feature: util_pct_last (0.1479)
  INTERFACE_FLAP               acc=0.987  prec=0.833  recall=0.930  f1=0.879
    Top feature: crc_errors_last (0.1571)
  PACKET_DROP                  acc=0.983  prec=0.840  recall=0.986  f1=0.907
    Top feature: queue_depth_last (0.1539)

  ========================================================================================================================
  Top Event Sequences (with lift)
  ========================================================================================================================

  ========================================================================================================================
  Top Anomalous Entities
  ========================================================================================================================
  switch-03:Eth1/2               anomaly_rate=10.6%  avg_score=0.1156
  switch-02:Eth1/1               anomaly_rate=10.3%  avg_score=0.0982
  switch-03:Eth1/1               anomaly_rate=9.5%  avg_score=0.0976
  switch-01:Eth1/1               anomaly_rate=8.1%  avg_score=0.1056
  switch-05:Eth1/3               anomaly_rate=8.1%  avg_score=0.1160

==============================================================================
 SAVING REPORTS
==============================================================================

  JSON report : /opt/pattern_mining_code/reports/report_20260317_183002.json
  Summary CSV : /opt/pattern_mining_code/reports/summary_20260317_183002.csv

  Duration: 67.7s

  Models saved to : /opt/pattern_mining_code/models/
  Run score.py to score fresh metrics against these models.

==============================================================================
  DONE
==============================================================================

  `;
const CATEGORIES = [
  { name: 'Data Prep', steps: [3] },
  { name: 'Supervised ML', steps: [8] },
  { name: 'Clustering', steps: [7] },
  // { name: 'Anomaly Detection', steps: [11] },
  { name: 'Time-Series Analysis', steps: [6] },
  { name: 'Time-Lag Correlation', steps: [4] },
  { name: 'Causal Correlation', steps: [5] },
  { name: 'Sequence Mining', steps: [9] },
  { name: 'Event Co-Occurrence', steps: [12] },
  { name: 'Failure Chains', steps: [10] }
];


export default function TrainingLovelablePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [deviceFilter, setDeviceFilter] = useState<'device' | 'topology' | 'group'>('device');
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeTab, setActiveTab] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [showTimeLagVenn, setShowTimeLagVenn] = useState(true);
  const [showCausalVenn, setShowCausalVenn] = useState(true);
  const [itemLimit, setItemLimit] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(SCOPE_TARGETS['device'][0].label);
  const [trainingPeriod, setTrainingPeriod] = useState("1 Month");
  const [visibleLogLines, setVisibleLogLines] = useState<string[]>([]);
  const [focusXcorr, setFocusXcorr] = useState('all');
  const [focusGranger, setFocusGranger] = useState('all');
  const [showRFTable, setShowRFTable] = useState(false);
  const [showAnomTable, setShowAnomTable] = useState(false);
  const [showPreEvtTable, setShowPreEvtTable] = useState(false);
  const [showCoocHeatMap, setShowCoocHeatMap] = useState(true);

  // Sync state from location
  useEffect(() => {
    if (location.state?.deviceFilter) {
      setDeviceFilter(location.state.deviceFilter);
    }
    if (location.state?.selectedTarget) {
      setSelectedTarget(location.state.selectedTarget);
    }
  }, [location.state]);

  const targetType = useMemo(() => {
    const list = (SCOPE_TARGETS as any)[deviceFilter];
    const match = list.find((t: any) => t.label === selectedTarget);
    return match ? match.sub : null;
  }, [deviceFilter, selectedTarget]);

  const displayTargetLabel = useMemo(() => {
    if (deviceFilter === 'device') {
      return targetType || "";
    }
    return formatLabel(selectedTarget);
  }, [deviceFilter, selectedTarget, targetType]);

  const combinedXcorr = useMemo(() => {
    if (deviceFilter === 'topology') {
      return D.xcorrT.map(d => ({ ...d, dev: 'DC EAST TOPOLOGY' }))
        .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
    }
    const routers = D.xcorrR.map(d => ({ ...d, dev: 'Router' }));
    const switches = D.xcorrS.map(d => ({ ...d, dev: 'Switch' }));

    let base = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') base = routers;
      if (targetType === 'Switch') base = switches;
    }

    return base
      .filter(d => Math.abs(d.r) > 0.75)
      .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  }, [deviceFilter, targetType]);

  const combinedGranger = useMemo(() => {
    if (deviceFilter === 'topology') {
      return D.grangerT.map(d => ({ ...d, dev: 'DC EAST TOPOLOGY' }))
        .sort((a, b) => b.f - a.f);
    }

    const routers = D.grangerR.map(d => ({ ...d, dev: 'Router' }));
    const switches = D.grangerS.map(d => ({ ...d, dev: 'Switch' }));

    let base = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') base = routers;
      if (targetType === 'Switch') base = switches;
    }

    return base.sort((a, b) => b.f - a.f);
  }, [deviceFilter, targetType]);

  const combinedSeq = useMemo(() => {
    if (deviceFilter === 'topology') {
      return D.seqT.map(d => ({ ...d, dev: 'DC EAST TOPOLOGY' }))
        .sort((a, b) => b.conf - a.conf);
    }

    const routers = D.seqR.map(d => ({ ...d, dev: 'Router' }));
    const switches = D.seqS.map(d => ({ ...d, dev: 'Switch' }));

    let base = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') base = routers;
      if (targetType === 'Switch') base = switches;
    }

    return base.sort((a, b) => b.conf - a.conf);
  }, [deviceFilter, targetType]);

  const combinedChains = useMemo(() => {
    if (deviceFilter === 'topology') {
      return D.chainsT.map(d => ({ ...d, dev: 'DC EAST TOPOLOGY' }))
        .sort((a, b) => b.n - a.n);
    }
    const routers = D.chainsR.map(d => ({ ...d, dev: 'Router' }));
    const switches = D.chainsS.map(d => ({ ...d, dev: 'Switch' }));

    let base = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') base = routers;
      if (targetType === 'Switch') base = switches;
    }

    return base.sort((a, b) => b.n - a.n);
  }, [deviceFilter, targetType]);

  useEffect(() => {
    const activeEl = document.getElementById(`tab-btn-${activeTab}`);
    if (activeEl && navRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const allLogLines = TERMINAL_LOG.split('\n');

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLogLines]);


  const maxRate = Math.max(...D.events.map(e => e.rate));

  // Unified RF Data
  const unifiedRFData = useMemo(() => {
    const topoLabel = deviceFilter === 'topology' ? 'DC EAST TOPOLOGY' : '';

    const routers = D.rfR.map(r => ({ ...r, dev: topoLabel || 'Router' }));
    const switches = D.rfS.map(s => ({ ...s, dev: topoLabel || 'Switch' }));

    let combined = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') combined = routers;
      if (targetType === 'Switch') combined = switches;
    }

    const unique = new Map<string, RFData & { dev: string }>();
    combined.forEach(item => {
      if (item.skip) return;
      const key = `${item.evt}-${item.dev}`;
      unique.set(key, item);
    });
    return Array.from(unique.values()).sort((a, b) => (b.acc || 0) - (a.acc || 0));
  }, [deviceFilter, targetType]);

  const filteredAnoms = useMemo(() => {
    const routers = D.anomR.map(d => ({ ...d, dev: 'Router' }));
    const switches = D.anomS.map(d => ({ ...d, dev: 'Switch' }));

    let base = [...routers, ...switches];
    if (deviceFilter === 'device') {
      if (targetType === 'Router') base = routers;
      if (targetType === 'Switch') base = switches;
    }
    return base.sort((a, b) => b.rate - a.rate);
  }, [deviceFilter, targetType]);

  const ConfidenceItem = ({ value, label, dev, feats }: { value: number, label: string, dev: string, feats?: [string, number][] }) => {
    const percentage = value * 100;
    const color = percentage > 90 ? '#3DDAB4' : percentage > 80 ? '#3B82F6' : '#F59E0B';

    return (
      <div className="bg-[#1E293B]/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-[#1E293B]/60 transition-colors group">
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[16px] font-bold text-[#F8FAFC] tracking-tight font-['IBM_Plex_Mono',monospace]">{formatLabel(label)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-[#475569] font-white tracking-[0.1em] opacity-40">Top Signals:</div>
              <div className="flex items-center gap-3">
                {feats?.slice(0, 3).map(([fn, fi], k) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#94A3B8] font-medium transition-colors group-hover:text-[#3B82F6]">{formatLabel(fn)}</span>
                    <span className="text-[11px] font-bold text-[#3DDAB4]">{(fi * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end pr-2">
          <div className="text-[23px] font-black tabular-nums leading-none tracking-tighter" style={{ color }}>{percentage.toFixed(1)}%</div>
          <div className="text-[9px] font-bold text-[#475569] tracking-[0.25em] mt-1.5 opacity-60">Model Confidence</div>
        </div>
      </div>
    );
  };

  const shouldShow = (stepIdx: number) => {
    if (!started) return false;
    const cat = CATEGORIES[activeTab];
    return cat ? cat.steps.includes(stepIdx) : false;
  };

  const isStepReady = (stepIdx: number) => {
    return started && currentStep >= 3;
  };

  useEffect(() => {
    if (location.state?.autoStart) {
      handleStart();
    }
  }, [location.state]);

  // Parallel Training Logic
  useEffect(() => {
    if (!started || isComplete) return;

    let subItemTimer: NodeJS.Timeout;

    // 1. Rapid Ingestion Phase (Steps 0, 1, 2)
    const ingestionInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 3) return prev + 1;
        clearInterval(ingestionInterval);
        return 11; // Unlock all analytical tabs after data ingestion
      });
    }, 600);

    // 2. Global Discovery Logic (Affects all tabs)
    // Discovery intervals removed to prevent flickering/phased loading
    setItemLimit(100);

    // 3. Overall Completion Logic removed from here 
    // It is now handled by the terminal log completion to stay in sync.

    return () => {
      clearInterval(ingestionInterval);
    };
  }, [started, isComplete]);

  // Terminal Line-by-Line Execution Effect
  useEffect(() => {
    if (!started) {
      setVisibleLogLines([]);
      return;
    }

    let currentLine = 0;
    const totalLines = allLogLines.length;

    // Initial burst of headers
    const initialBurst = 15;
    setVisibleLogLines(allLogLines.slice(0, initialBurst));
    currentLine = initialBurst;

    const logInterval = setInterval(() => {
      if (currentLine >= totalLines) {
        clearInterval(logInterval);
        setIsComplete(true);
        setItemLimit(100);
        return;
      }

      // Constant speed for smoother flow without flicker
      let chunk = 2;
      setVisibleLogLines(allLogLines.slice(0, currentLine + chunk));
      currentLine += chunk;
    }, 80); // Increased frequency for smoother flow

    return () => clearInterval(logInterval);
  }, [started]);

  // Persistent Report Save on Completion
  useEffect(() => {
    if (isComplete && started) {
      const now = new Date();
      const reportId = `report-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

      const newReport = {
        id: reportId,
        name: `analytical_report_${Date.now()}.json`,
        date: now.toLocaleString(),
        duration: trainingPeriod,
        dataPeriod: deviceFilter === 'device' ? 'Device' : deviceFilter === 'topology' ? 'Topology' : 'Group',
        windows: '8,156',
        status: 'completed',
        execTime: '67.7s'
      };

      const saved = localStorage.getItem('analytical_training_reports');
      let reports = [];
      if (saved) {
        try {
          reports = JSON.parse(saved);
        } catch (e) {
          reports = [];
        }
      }

      // Avoid duplicate saves if user stays on page
      if (!reports.some((r: any) => r.id === reportId)) {
        const updatedReports = [newReport, ...reports];
        localStorage.setItem('analytical_training_reports', JSON.stringify(updatedReports));
        console.log("ENGINE: Report persisted to Model Registry.");
      }
    }
  }, [isComplete, started, trainingPeriod, deviceFilter]);

  const handleStart = () => {
    setStarted(true);
    setCurrentStep(0);
    setActiveTab(0); // Default to first category (DATA PREP)
    setItemLimit(0);
    setIsComplete(false);
    setVisibleLogLines([]);
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentStep(-1);
    setActiveTab(0); // Reset back to first category
    setItemLimit(0);
    setIsComplete(false);
    setVisibleLogLines([]);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background text-foreground font-['Sora',sans-serif] text-[13px] leading-relaxed selection:bg-primary/20 pb-20 overflow-x-hidden">

        {/* PAGE HEADER */}
        <header className="bg-card text-foreground px-10 pt-7 pb-6 border-b-[3px] border-primary shadow-sm dark:shadow-none">
          <div className="flex items-start justify-between gap-5 mb-4">
            <div>
              <h1 className="text-[25px] font-semibold tracking-[-0.02em] leading-tight">Model Training Analysis</h1>
            </div>
            <div className="flex flex-col items-end gap-5 flex-shrink-0">
              <div className="flex items-end gap-6">
                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.2em] text-[#3DDAB4] font-bold px-0.5">
                    Training Scope
                  </div>
                  <Select
                    value={deviceFilter}
                    onValueChange={(v: 'device' | 'topology' | 'group') => {
                      setDeviceFilter(v);
                      setSelectedTarget(SCOPE_TARGETS[v][0].label);
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-10 bg-secondary/50 border border-border/50 rounded-md px-3 text-[12px] font-medium text-foreground outline-none hover:border-primary/50 transition-all shadow-sm">
                      <SelectValue placeholder="Select Scope" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border text-foreground">
                      <SelectItem value="device" className="text-[12px] focus:bg-[#3B82F6] focus:text-white">Device Specific</SelectItem>
                      <SelectItem value="topology" className="text-[12px] focus:bg-[#3B82F6] focus:text-white">Topology Based</SelectItem>
                      <SelectItem value="group" className="text-[12px] focus:bg-[#3B82F6] focus:text-white">Device Group Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.2em] text-[#94A3B8] font-bold px-0.5">
                    {deviceFilter === 'device' ? 'Select Device' : deviceFilter === 'topology' ? 'Select Topology' : 'Select Device Group'}
                  </div>
                  <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                    <SelectTrigger className="w-[180px] h-10 bg-secondary/50 border border-border/50 rounded-md px-3 text-[12px] font-medium text-foreground outline-none hover:border-primary/50 transition-all shadow-sm">
                      <SelectValue placeholder="Select Target" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border text-foreground">
                      {SCOPE_TARGETS[deviceFilter].map((t) => (
                        <SelectItem key={t.label} value={t.label} className="text-[12px] focus:bg-[#3B82F6] focus:text-white">
                          <div className="flex items-center gap-2">
                            <span>{t.label}</span>
                            <span className="text-[10px] opacity-40 font-normal">{t.sub}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.2em] text-[#94A3B8] font-bold px-0.5 opacity-60">
                    Period
                  </div>
                  <select
                    value={trainingPeriod}
                    onChange={(e) => setTrainingPeriod(e.target.value)}
                    className="w-[140px] h-10 bg-secondary/50 border border-border/50 rounded-md px-3 text-[12px] font-['IBM_Plex_Mono',monospace] text-foreground outline-none cursor-pointer hover:border-primary/50 transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%233B82F6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                  >
                    <option value="Last Week">Last Week</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  {!started ? (
                    <button
                      onClick={handleStart}
                      className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[13px] font-bold tracking-wider transition-all shadow-[0_4px_0_0_#1D4ED8] active:translate-y-[2px] active:shadow-none h-10 mt-auto"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start Training Analysis
                    </button>
                  ) : !isComplete ? (
                    <div className="flex items-center gap-3 mt-auto h-10">
                      <button
                        onClick={handleReset}
                        className="p-2 text-[#9a9488] hover:text-[#f4f2ed] transition-colors"
                        title="Reset Training"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-[#2a2520] text-[#2a9070] px-5 py-1.5 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[13px] font-bold tracking-wider border border-[#2a9070]/30 shadow-[0_0_15px_rgba(42,144,112,0.15)]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Training...
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-auto h-10">
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-[#9a9488] hover:text-[#f4f2ed] font-['IBM_Plex_Mono',monospace] text-[12px] uppercase font-bold tracking-widest transition-colors mr-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retrain
                      </button>
                      <div className="flex items-center gap-2 bg-[#e8f4f0] text-[#0a7c5c] px-5 py-1.5 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[13px] font-bold tracking-wider border border-[#2a9070] shadow-[0_4px_12px_rgba(10,124,92,0.1)] select-none">
                        <CheckCircle2 className="w-4 h-4" />
                        Complete
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  {isComplete && (
                    <NavLink
                      to="/pattern-prediction/results"
                      className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary text-foreground px-5 py-2 rounded-[6px] font-['IBM_Plex_Mono',monospace] text-[13px] font-bold tracking-wider border border-border/50 transition-all group shadow-sm"
                    >
                      View Results
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </NavLink>
                  )}
                </div>

                {started && !isComplete && currentStep < 4 && (
                  <div className="flex items-center gap-2 text-[12px] text-[#3B82F6] font-['IBM_Plex_Mono',monospace] animate-in fade-in slide-in-from-right-2 duration-300 pr-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="opacity-70 tracking-widest text-[#3B82F6]">Ingestion Pipeline:</span>
                    <span className="font-bold tracking-tight">{formatLabel(D.pipeline[currentStep])}...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <nav
          ref={navRef}
          className="bg-card border-b border-border px-10 py-0 flex items-end gap-1 overflow-x-auto whitespace-nowrap sticky top-0 z-50 scroll-smooth h-14 scrollbar-horiz"
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = i === activeTab;
            // A category is considered "Done" if all its steps are completed
            const isDone = isComplete || cat.steps.every(sIdx => sIdx <= currentStep);
            // A category is "Processing" if any of its steps is current
            const isProcessing = !isComplete && cat.steps.some(sIdx => sIdx === currentStep);

            return (
              <div key={i} className="flex-none flex flex-col h-full justify-end group">
                <button
                  id={`tab-btn-${i}`}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex items-center h-14 px-6 font-['IBM_Plex_Mono',monospace] text-[12px] transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0",
                    isActive
                      ? (cat.name === 'Failure Chains' ? "bg-amber-500/10 border-amber-500 text-amber-500 font-bold" : "bg-primary/10 border-primary text-foreground font-bold")
                      : (cat.name === 'Failure Chains' ? "border-transparent text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-500" : "border-transparent text-muted-foreground hover:bg-primary/5")
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-300 mr-2 flex-shrink-0",
                    isDone ? (cat.name === 'Failure Chains' ? "bg-amber-500 border-amber-500" : "bg-emerald-500 border-emerald-500") :
                      isProcessing ? "bg-background border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse" :
                        (cat.name === 'Failure Chains' ? "border-amber-500/30 bg-card" : "border-border bg-card")
                  )} />
                  <span className="tracking-[0.1em]">{cat.name}</span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* MAIN CONTENT */}
        <main className="px-10">

          {!started && (
            <div className="mt-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 border-2 border-border border-dashed">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connect to MongoDB</h2>
              <p className="text-muted-foreground max-w-md">
                Establish connection to the pattern storage and initialize function training on 8,156 document windows.
              </p>
              <button
                onClick={handleStart}
                className="mt-8 bg-[#3B82F6] text-white px-8 py-3 rounded-[8px] font-semibold hover:bg-[#2563EB] transition-all"
              >
                Execute Analysis Pipeline
              </button>
            </div>
          )}

          {/* SECTION 01: SLIDING WINDOWS */}
          <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(3) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#94A3B8]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Data Prep {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <span className="text-[13px] text-[#94A3B8] ml-auto">8,156 document windows integrated</span>
            </div>

            {!isStepReady(3) ? <LoadingState title="Time Series" /> : (
              <>

                <div className="grid grid-cols-1 gap-4 mb-4 items-start">
                  {/* Terminal Processing Log */}
                  <div className="bg-card border border-border rounded-[10px] overflow-hidden flex flex-col">
                    <div className="px-3.5 py-2.5 bg-secondary/30 border-b border-border flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-foreground font-bold">Pipeline Execution Log</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]/40" />
                      </div>
                    </div>
                    <div
                      ref={terminalRef}
                      className="p-4 font-['IBM_Plex_Mono',monospace] text-[13px] leading-relaxed text-muted-foreground/80 flex-1 overflow-auto no-scrollbar max-h-[500px]"
                    >
                      <pre className="whitespace-pre">{visibleLogLines.join('\n')}</pre>
                      {started && visibleLogLines.length < allLogLines.length && (
                        <div className="inline-block w-1.5 h-3.5 bg-[#3B82F6] ml-1 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(4) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#94A3B8]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Cross Correlation (Pearson / Spearman) {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <button
                onClick={() => setShowTimeLagVenn(!showTimeLagVenn)}
                className={cn("ml-2 p-1 rounded-full transition-all", showTimeLagVenn ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#94A3B8] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {!isStepReady(4) ? <LoadingState title="Statistical Correlation" /> : (
              <div className="animate-in fade-in duration-700">
                {showTimeLagVenn ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
                    {combinedXcorr.slice(0, 12).map((d, i) => (
                      <CorrelationVennDiagram
                        key={i}
                        a={d.a}
                        b={d.b}
                        r={d.r}
                        dev={d.dev}
                        lag={d.lag}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    <div className={cn("grid grid-cols-[1fr_400px] gap-4", !shouldShow(4) && "hidden")}>
                      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
                        <div className="px-3.5 py-2.5 bg-secondary/30 border-b border-border flex items-center justify-between">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-emerald-500 font-bold">Combined Network-Wide Relations [Top Correlations]</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-foreground tracking-widest">{combinedXcorr.length} significant nodes (&gt;0.75 R) identified</span>
                        </div>
                        <div className="p-0">
                          <div className="grid grid-cols-[100px_100px_80px_100px_70px_80px_1fr] gap-4 py-2 px-4 items-center bg-[#0F172A]/30 border-b border-[#334155]">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black">Metric A</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black">Metric B</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black">Best Lag</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black text-center">Pearson r</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black text-right">Spearman r</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] font-black">Interpretation</span>
                          </div>
                          {combinedXcorr.slice(0, 15).map((d, i) => {
                            return (
                              <div key={i} className="grid grid-cols-[100px_100px_80px_100px_70px_80px_1fr] gap-4 items-center border-b border-[#334155] last:border-none py-2 px-4 animate-in fade-in slide-in-from-left-2 duration-300 hover:bg-white/[0.02] transition-colors">
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] truncate font-bold">{formatLabel(d.a)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] truncate font-bold">{formatLabel(d.b)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] whitespace-nowrap">{d.lag}</span>
                                <div className="flex items-center justify-center gap-2">
                                  <DonutChart val={d.r} size={28} />
                                  <span className="font-['IBM_Plex_Mono',monospace] text-[13px] text-[#F8FAFC] w-12">{d.r.toFixed(3)}</span>
                                </div>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[13px] text-right text-[#F8FAFC] font-bold">{d.s.toFixed(3)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#3B82F6] opacity-80">{d.interp}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <LollipopChart
                        labelX="Pearson R"
                        focusMetric={focusXcorr}
                        onFocusChange={setFocusXcorr}
                        metricsList={['util_pct', 'queue_depth', 'crc_errors', 'latency_ms', 'cpu_pct', 'mem_util_pct', 'temp_c', 'fan_speed_rpm']}
                        data={combinedXcorr
                          .filter(d => focusXcorr === 'all' || d.a === focusXcorr || d.b === focusXcorr)
                          .slice(0, 10)
                          .map(d => ({
                            label: `${d.a} ↔ ${d.b}`,
                            val: d.r,
                            color: d.r > 0.8 ? '#3DDAB4' : d.r > 0.6 ? '#3B82F6' : '#F59E0B'
                          }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(5) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em] text-[#F8FAFC]">Granger Causality {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <div className="flex items-center gap-4 ml-8 px-3 py-1 bg-[#1e293b]/60 border border-[#334155] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-[10px] text-[#F8FAFC] font-black uppercase tracking-widest">Cause</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[11px] text-[#F8FAFC] font-black uppercase tracking-widest">Effect</span>
                </div>
              </div>
              <button
                onClick={() => setShowCausalVenn(!showCausalVenn)}
                className={cn("ml-2 p-1 rounded-full transition-all", showCausalVenn ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#F8FAFC] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {!isStepReady(5) ? <LoadingState title="Granger Causality" /> : (
              <div className="animate-in fade-in duration-700">
                {showCausalVenn ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
                    {combinedGranger.slice(0, 12).map((d, i) => (
                      <CausalVennDiagram
                        key={i}
                        cause={d.c}
                        effect={d.e}
                        fstat={d.f}
                        p={d.p}
                        lag={d.lag}
                        dev={d.dev}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 items-start">
                    <div className="grid grid-cols-[1fr_400px] gap-4">
                      <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden">
                        <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#F8FAFC] font-bold">Combined Network-Wide Causality [Top F-Stats]</span>
                          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] tracking-widest">{combinedGranger.length} nodes analyzed</span>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <div className="grid grid-cols-[125px_14px_125px_60px_60px_60px_60px] gap-2 pb-1.5 items-center bg-[#0F172A]/30 px-3 rounded">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] tracking-widest px-1 font-black">Cause</span><span />
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] tracking-widest font-black">Effect</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] text-right font-black">F-Stat</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] text-right font-black">P-Value</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] text-right px-2 font-black">Lag</span>
                          </div>
                          {combinedGranger.slice(0, 15).map((d, i) => {
                            return (
                              <div key={i} className="grid grid-cols-[125px_14px_125px_60px_60px_60px_60px] gap-2 items-center border-b border-[#334155] last:border-none py-2 px-3 animate-in fade-in slide-in-from-left-2 duration-300 hover:bg-white/[0.04] transition-all">
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] truncate font-bold">{formatLabel(d.c)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[13px] text-[#F8FAFC] text-center opacity-50">→</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] truncate font-bold">{formatLabel(d.e)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-right px-1 font-bold" style={{ color: d.f > 100 ? '#F59E0B' : '#F8FAFC' }}>{d.f.toFixed(1)}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] text-right opacity-70 font-bold">{d.p}</span>
                                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] text-right px-2">{d.lag}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <LollipopChart
                        labelX="F-Statistic"
                        focusMetric={focusGranger}
                        onFocusChange={setFocusGranger}
                        metricsList={['util_pct', 'queue_depth', 'crc_errors', 'latency_ms', 'cpu_pct', 'mem_util_pct', 'temp_c', 'fan_speed_rpm']}
                        data={combinedGranger
                          .filter(d => focusGranger === 'all' || d.c === focusGranger || d.e === focusGranger)
                          .slice(0, 10)
                          .map(d => ({
                            label: `${d.c} → ${d.e}`,
                            val: d.f,
                            color: d.f > 80 ? '#F59E0B' : '#3B82F6'
                          }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(6) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Pre-Event Behavior {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <button
                onClick={() => setShowPreEvtTable(!showPreEvtTable)}
                className={cn("ml-2 p-1 rounded-full transition-all", showPreEvtTable ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#F8FAFC] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {!isStepReady(6) ? <LoadingState title="Pre-Event Behavior" /> : (
              <div className="animate-in fade-in duration-700">
                {!showPreEvtTable ? (
                  <div className="space-y-6">
                    <PreEventComparisonPlot data={
                      (deviceFilter === 'device')
                        ? (targetType === 'Router' ? D.preEvtR : D.preEvtS)
                        : [...D.preEvtR, ...D.preEvtS]
                    } />
                  </div>
                ) : (
                  <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-2xl">
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#F8FAFC] font-bold">Event Behavior Matrix [Baseline vs Pre-Event]</span>
                      <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] tracking-widest font-black uppercase">Total windows Analyzed: 14,208</span>
                    </div>
                    <div className="p-0 overflow-auto max-h-[500px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0F172A] sticky top-0 z-10 border-b border-[#334155]">
                          <tr>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC]">Event Type</th>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC]">Metric Name</th>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC] text-right">Normal Value</th>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC] text-right">Pre-Event Value</th>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC] text-right">Delta (%)</th>
                            <th className="px-3.5 py-2 text-[11px] font-black font-mono text-[#F8FAFC]">Detection Window</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                          {(deviceFilter === 'device' ? (targetType === 'Router' ? D.preEvtR : D.preEvtS) : [...D.preEvtR, ...D.preEvtS]).map((pe, idx) => {
                            const formatLabel = (str: string) => str.replace(/_/g, ' ').toLowerCase().replace(/(^\w|[\s\(\:]\w)/g, m => m.toUpperCase());
                            return pe.metrics.map((m, midx) => (
                              <tr key={`${idx}-${midx}`} className="hover:bg-[#1e293b]/60 transition-colors group">
                                {midx === 0 && (
                                  <td rowSpan={pe.metrics.length} className="px-3.5 py-2 text-[12px] text-white font-mono bg-[#0F172A]/20 font-bold border-r border-[#334155]">
                                    {formatLabel(pe.evt)}
                                  </td>
                                )}
                                <td className="px-3.5 py-2 text-[12px] text-[#F8FAFC] font-mono group-hover:text-white transition-colors font-bold whitespace-nowrap">{formatLabel(m.m)}</td>
                                <td className="px-3.5 py-2 text-[12px] text-[#F8FAFC] font-black tabular-nums text-right">{m.normal ?? 'N/A'}</td>
                                <td className="px-3.5 py-2 text-[13px] text-white font-black tabular-nums text-right">{m.pre ?? 'N/A'}</td>
                                <td className={cn("px-3.5 py-2 text-[13px] font-black tabular-nums text-right", m.up ? 'text-red-500' : 'text-blue-500')}>
                                  {m.up ? '+' : ''}{m.dpct}%
                                </td>
                                {midx === 0 && (
                                  <td rowSpan={pe.metrics.length} className="px-3.5 py-2 text-[11px] text-[#3B82F6] font-black text-center border-l border-[#334155]">
                                    {pe.warn} Prior
                                  </td>
                                )}
                              </tr>
                            ));
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(7) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">KMeans Clustering Patterns {displayTargetLabel && `- ${displayTargetLabel}`}</span>
            </div>
            {!isStepReady(7) ? <LoadingState title="K-Means Clustering" /> : (
              <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                  {(() => {
                    return (
                      <span className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#3DDAB4] font-bold">
                        {deviceFilter === 'device' ? `${targetType} Specific Pattern Clustering` : 'Integrated Network-Wide Pattern Clustering'}
                      </span>
                    );
                  })()}
                  <div className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] opacity-70">K=4 / Silhouette: 0.742</div>
                </div>

                <div className="p-6 grid grid-cols-[1fr_300px] gap-10 items-start">
                  <div className="flex flex-col gap-4">
                    <ClusterPlot
                      clusters={deviceFilter === 'device' ? (targetType === 'Switch' ? D.clS : D.clR) : D.clR}
                      limit={itemLimit}
                    />
                  </div>

                  <div>
                    <ClusterDonutPlot
                      clusters={deviceFilter === 'device' ? (targetType === 'Switch' ? D.clS : D.clR) : D.clR}
                      deviceFilter={deviceFilter}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(8) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Random Forest {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <button
                onClick={() => setShowRFTable(!showRFTable)}
                className={cn("ml-2 p-1 rounded-full transition-all", showRFTable ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#F8FAFC] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {!isStepReady(8) ? <LoadingState title="Random Forest" /> : (
              <div>
                {!showRFTable ? (
                  <div className="flex flex-col gap-3 px-2">
                    {unifiedRFData.map((r, i) => (
                      <ConfidenceItem
                        key={i}
                        value={r.acc || 0}
                        label={r.evt}
                        dev={r.dev}
                        feats={r.feats}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { data: D.rfR, device: 'router' as const, title: 'Router — 4 Trained / 2 Skipped', type: 'Router' },
                      { data: D.rfS, device: 'switch' as const, title: 'Switch — 3 Trained / 3 Skipped', type: 'Switch' }
                    ].filter(group => {
                      if (deviceFilter === 'device') return group.type === targetType;
                      return true;
                    }).map((group, idx) => (
                      <div key={idx} className={cn("bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden mb-2.5 last:mb-0")}>
                        <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#F8FAFC] font-medium">{group.title}</span>
                        </div>
                        <div className="p-3.5 space-y-2">
                          <div className="grid grid-cols-[160px_50px_50px_50px_50px_1fr] gap-2 items-start pb-1.5 border-b border-[#334155]">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] tracking-[0.05em]">Event</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] text-center">F1</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] text-center">Prec</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] text-center">Rec</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] text-center">Acc</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC]">Top 3 Features</span>
                          </div>
                          {group.data.slice(0, itemLimit).map((r, i) => (
                            <div key={i} className={cn("grid grid-cols-[160px_50px_50px_50px_50px_1fr] gap-2 items-start py-2 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300", r.skip && "opacity-40")}>
                              {(() => {
                                return (
                                  <div>
                                    <div className="text-[12px] font-medium text-[#F8FAFC]">{formatLabel(r.evt)}</div>
                                    <div className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC]">{r.skip ? `Skipped — ${r.reason}` : `${r.pos} pos rate`}</div>
                                  </div>
                                );
                              })()}
                              {!r.skip && r.f1 !== undefined && (
                                <>
                                  <div className="text-[12px] font-['IBM_Plex_Mono',monospace] text-center" style={{ color: (r.f1 as number) > 0.88 ? '#3B82F6' : (r.f1 as number) > 0.82 ? '#F8FAFC' : '#F8FAFC' }}>
                                    {r.f1}
                                  </div>
                                  <div className="font-['IBM_Plex_Mono',monospace] text-[12px] text-center text-[#F8FAFC]">{r.prec}</div>
                                  <div className="font-['IBM_Plex_Mono',monospace] text-[12px] text-center text-[#F8FAFC]">{r.rec}</div>
                                  <div className="font-['IBM_Plex_Mono',monospace] text-[12px] text-center text-[#F8FAFC]">{r.acc}</div>
                                  <div className="flex flex-col gap-1 max-w-[280px]">
                                    {r.feats?.map(([fn, fi], k) => {
                                      return (
                                        <div key={k} className="flex items-center gap-1.5">
                                          <div className="h-[2px] rounded-[1px] bg-[#3B82F6]" style={{ width: `${Math.min(fi * 150, 48)}px` }} />
                                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] whitespace-nowrap">{formatLabel(fn)}</span>
                                          <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#3B82F6] font-bold ml-2">{(fi * 100).toFixed(1)}%</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(9) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Sequential Pattern Mining {displayTargetLabel && `- ${displayTargetLabel}`}</span>
            </div>
            {!isStepReady(9) ? <LoadingState title="Sequence Mining" /> : (
              <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-xl">

                <div className="p-3 space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_110px_110px] gap-4 px-4 py-2 bg-[#0F172A]/40 border-b border-[#334155]">
                    <span className="text-[11px] font-black text-[#F8FAFC] tracking-[0.1em]">Sequence Flow</span>
                    <span className="text-[11px] font-black text-[#F8FAFC] tracking-[0.1em] text-center">Frequency</span>
                    <span className="text-[11px] font-black text-[#F8FAFC] tracking-[0.1em] text-center">Accuracy</span>
                  </div>

                  {combinedSeq.slice(0, 6).map((s, i) => {
                    const evtCol: any = {
                      'R1 (High Util)': 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
                      'R1 (Packet Drop)': 'bg-red-500/10 text-red-500 border border-red-500/20',
                      'R1 (Interface Flap)': 'bg-red-500/10 text-red-500 border border-red-500/20',
                      'R1 (Queue Buildup)': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
                      'S1 (Packet Drop)': 'bg-red-500/10 text-red-500 border border-red-500/20',
                      'S1 (Latency High)': 'bg-red-500/10 text-red-500 border border-red-500/20',
                      'App1 (Response Slow)': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
                      'R1 (Config Change)': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
                      'R2 (Peer Down)': 'bg-red-500/10 text-red-500 border border-red-500/20',
                    };
                    return (
                      <div key={i} className="grid grid-cols-[1fr_110px_110px] gap-4 items-center px-4 py-3 bg-[#0F172A]/20 border border-[#334155] rounded-lg group hover:border-[#3B82F6]/30 hover:bg-[#0F172A]/40 transition-all duration-300 animate-in fade-in slide-in-from-left-2">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          {s.seq.map((e, k) => (
                            <React.Fragment key={k}>
                              <span className={cn("px-2.5 py-1 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[11px] font-bold tracking-tight whitespace-nowrap transition-transform group-hover:scale-[1.02]", evtCol[e] || 'bg-[#334155]/40 text-[#CBD5E1] border border-white/5')}>
                                {formatLabel(e)}
                              </span>
                              {k < s.seq.length - 1 && (
                                <div className="flex flex-col items-center px-0.5 opacity-40">
                                  <span className="text-[9px] text-[#3B82F6] font-black">~5m</span>
                                  <ChevronRight className="w-3 h-3 text-[#475569]" />
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="text-center border-l border-white/5 h-full flex items-center justify-center">
                          <span className="text-[13px] font-black text-[#94A3B8] font-['IBM_Plex_Mono',monospace] tracking-tighter">{s.supp}</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-white/5 h-full justify-center pl-2">
                          <DonutChart val={s.conf} size={28} />
                          <span className="text-[11px] font-black mt-1 text-[#3B82F6] font-['IBM_Plex_Mono',monospace]">{((s.conf) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500", !shouldShow(12) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#94A3B8]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Event Co-occurrence {displayTargetLabel && `- ${displayTargetLabel}`}</span>
              <button
                onClick={() => setShowCoocHeatMap(!showCoocHeatMap)}
                className={cn("ml-2 p-1 rounded-full transition-all", showCoocHeatMap ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#94A3B8] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
              <span className="text-[12px] text-[#94A3B8] ml-auto uppercase font-black tracking-widest">{showCoocHeatMap ? 'Heatmap View' : 'Table View'}</span>
            </div>
            {!isStepReady(12) ? <LoadingState title="Co-occurrence Analysis" /> : (
              <div className="animate-in fade-in duration-700">
                {showCoocHeatMap ? (
                  <LiftMatrixHeatMap dataR={D.coocR} dataS={D.coocS} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {[
                      { data: D.coocR, title: 'ROUTER — 32 sessions', type: 'Router' },
                      { data: D.coocS, title: 'SWITCH — 42 sessions', type: 'Switch' }
                    ].filter(group => {
                      if (deviceFilter === 'device') return group.type === targetType;
                      return true;
                    }).map((group, idx) => (
                      <div key={idx} className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden">
                        <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#F8FAFC] font-medium">{group.title}</span>
                        </div>
                        <div className="p-3.5 space-y-1.5">
                          <div className="grid grid-cols-[130px_14px_130px_50px_50px] gap-2 pb-1.5 items-center border-b border-[#334155]">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] font-black tracking-widest">EVENT A</span>
                            <span />
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] font-black tracking-widest">EVENT B</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right text-[#F8FAFC] font-black tracking-widest">COUNT</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right text-[#F8FAFC] font-black tracking-widest">LIFT</span>
                          </div>
                          {group.data.slice(0, 15).map((d, i) => (
                            <div key={i} className="grid grid-cols-[130px_14px_130px_50px_50px] gap-2 items-center py-2 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300 hover:bg-white/[0.02]">
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] truncate font-bold">{d.a}</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] text-center opacity-40">&amp;</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F8FAFC] truncate font-bold">{d.b}</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-right text-[#F8FAFC] font-bold">{d.n}</span>
                              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-right font-bold" style={{ color: d.lift > 1.01 ? '#3DDAB4' : '#F8FAFC' }}>{d.lift.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION 10: FAILURE CHAINS */}
          <section className={cn("mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12", !shouldShow(10) && "hidden")}>
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#F59E0B]/50 mb-6">
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#F59E0B]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em] text-[#F59E0B]">Failure Chains {displayTargetLabel && `- ${displayTargetLabel}`}</span>
            </div>
            {!isStepReady(10) ? <LoadingState title="Failure Chains" /> : (
              <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-xl">
                <div className="p-3 space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1fr_120px] gap-4 px-4 py-2 bg-[#0F172A]/40 border-b border-[#334155]">
                    <span className="text-[10px] font-black text-[#F8FAFC] tracking-[0.15em]">Causal Chain</span>
                    <span className="text-[12px] font-black text-[#F8FAFC] tracking-[0.15em]">Confidence</span>
                  </div>

                  {combinedChains.slice(0, Math.ceil(itemLimit / 2)).map((c, i) => {
                    const isCritical = ['PACKET_DROP', 'DEVICE_REBOOT', 'INTERFACE_FLAP'].includes(c.evt);
                    const severityColor = isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]';
                    const badgeColor = isCritical ? 'bg-[#7F1D1D]/40 text-[#F87171]' : 'bg-[#78350F]/40 text-[#F59E0B]';
                    const confVal = Math.min(0.72 + (c.n / 1000) * 0.28, 0.99);
                    return (
                      <div key={i} className={cn("grid grid-cols-[1fr_120px] gap-4 items-center px-4 py-3 bg-[#0F172A]/20 border border-[#334155] rounded-lg border-l-4 group hover:border-[#3B82F6]/30 hover:bg-[#0F172A]/40 transition-all duration-300 animate-in fade-in slide-in-from-left-2 shadow-lg", severityColor)}>
                        {/* Causal Chain Column */}
                        <div className="flex flex-wrap items-center gap-y-3 gap-x-1.5 min-w-0">
                          {c.steps.map((s: any, k: number) => (
                            <React.Fragment key={k}>
                              <div className="flex flex-col gap-0.5 font-['IBM_Plex_Mono',monospace]">
                                <span className="text-[10px] text-[#F8FAFC] font-black opacity-80">Step 0{k + 1}</span>
                                <div className="px-2 py-1 rounded-md bg-[#0F172A]/80 border border-[#334155] flex items-center gap-1.5 shadow-inner group-hover:border-[#3B82F6]/20 transition-colors">
                                  <span className="text-[12px] text-[#F8FAFC] font-bold whitespace-nowrap">{formatLabel(s.m)}</span>
                                  <span className={cn("font-bold text-[12px]", s.d === '↑' ? 'text-rose-400' : 'text-emerald-400')}>{s.d}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-center px-1 min-w-[24px] opacity-40">
                                <span className="text-[10px] font-black text-[#60A5FA] mb-0.5">{s.lag}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#334155]" />
                              </div>
                            </React.Fragment>
                          ))}
                          <div className="flex flex-col gap-0.5 font-['IBM_Plex_Mono',monospace]">
                            <span className="text-[10px] text-[#F8FAFC] font-black opacity-80">Impact</span>
                            <div className={cn("px-2.5 py-1 rounded-md text-[12px] font-black shadow-xl border border-white/5 tracking-wide", badgeColor)}>
                              {c.evt === 'HIGH_LATENCY (VALIDATED)' ? 'High_Latency' : formatLabel(c.evt)}
                            </div>
                          </div>
                        </div>
                        {/* Confidence Column */}
                        <div className="flex flex-col items-center border-l border-white/5 h-full justify-center pl-2">
                          <DonutChart val={confVal} size={28} />
                          <span className="text-[12px] font-black mt-1 text-[#3B82F6] font-['IBM_Plex_Mono',monospace]">{(confVal * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>


          <section className="hidden">
            <div className="flex items-baseline gap-2.5 pb-2.5 border-b-[1.5px] border-[#3B82F6]/50 mb-3.5">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#94A3B8]"></span>
              <span className="text-[16px] font-semibold tracking-[-0.01em]">Isolation Forest Anomaly Risks</span>
              <button
                onClick={() => setShowAnomTable(!showAnomTable)}
                className={cn("ml-2 p-1 rounded-full transition-all", showAnomTable ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-[#94A3B8] hover:text-white")}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {!isStepReady(11) ? <LoadingState title="Isolation Forest" /> : (
              <div className="animate-in fade-in duration-700">
                {!showAnomTable ? (
                  <div className="flex flex-col gap-6">
                    <AnomalyHeatMap data={filteredAnoms.slice(0, 50)} />
                    <MultivariateTrendPlot data={filteredAnoms.slice(0, 5)} />
                  </div>
                ) : (
                  <div className="bg-[#1e293b]/40 border border-[#334155] rounded-[10px] overflow-hidden shadow-2xl">
                    <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#F8FAFC] font-medium uppercase">Statistical Anomaly Distribution</span>
                      <span className="text-[12px] text-[#F8FAFC] font-['IBM_Plex_Mono',monospace] opacity-60">N=128 ENTITIES</span>
                    </div>
                    <div className="p-0 overflow-auto max-h-[500px]">
                      <div className="grid grid-cols-[160px_60px_1fr_65px_60px_80px] gap-4 py-2 px-4 items-center bg-[#0F172A]/30 border-b border-[#334155] sticky top-0 z-10">
                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] uppercase font-black tracking-widest">Entity</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] uppercase font-black tracking-widest">Type</span>
                        <span />
                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] uppercase text-right font-black tracking-widest">Anom %</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] uppercase text-right font-black tracking-widest">Score</span>
                        <span className="font-['IBM_Plex_Mono',monospace] text-[12px] text-[#F8FAFC] uppercase text-center font-black tracking-widest">Risk</span>
                      </div>
                      {filteredAnoms.slice(0, 40).map((d: any, i) => {
                        const maxRate = 12;
                        return (
                          <div key={i} className="grid grid-cols-[160px_60px_1fr_65px_60px_80px] gap-4 items-center py-2.5 px-4 border-b border-[#334155] last:border-none animate-in fade-in slide-in-from-left-2 duration-300 hover:bg-white/[0.02] transition-colors">
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#F8FAFC] truncate font-bold">{d.e}</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[8px] text-[#F8FAFC] uppercase opacity-60">{d.dev}</span>
                            <Bar val={d.rate} max={maxRate} col={d.risk === 'HIGH' ? '#EF4444' : d.risk === 'MED' ? '#F59E0B' : '#3B82F6'} />
                            <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-right font-bold" style={{ color: d.risk === 'HIGH' ? '#EF4444' : d.risk === 'MED' ? '#F59E0B' : '#F8FAFC' }}>{d.rate.toFixed(1)}%</span>
                            <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-right text-[#F8FAFC] opacity-60 font-bold">{d.score.toFixed(4)}</span>
                            <div className="flex justify-center">
                              <span className={cn("px-2 py-0.5 rounded-[3px] font-['IBM_Plex_Mono',monospace] text-[9px] font-black tracking-[0.04em] text-center w-full max-w-[60px]",
                                d.risk === 'HIGH' ? 'bg-[#7F1D1D]/40 text-[#F87171] border border-[#EF4444]/20' :
                                  d.risk === 'MED' ? 'bg-[#78350F]/40 text-[#F59E0B] border border-[#F59E0B]/20' :
                                    'bg-[#334155]/40 text-[#F8FAFC] border border-white/5')}>
                                {d.risk}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="h-20" /> {/* Bottom Spacing */}
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MainLayout>
  );
}
