import { useState } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { cn, formatMetricLabel as formatLabel } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card } from "@/shared/components/ui/card";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Activity,
  Calendar,
  Clock,
  Brain,
  Globe,
  TrendingUp,
  Settings,
  Plus,
  ChevronDown,
  RotateCcw,
  Server
} from "lucide-react";

const CONFIG_FUNCTIONS = [
  { id: "cross_correlation", name: "Cross Correlation", version: "v1.0.1", confidence: 92, status: "RUNNING" },
  { id: "granger_causality", name: "Granger Causality", version: "v1.0.1", confidence: 88, status: "RUNNING" },
  { id: "pre_event", name: "Pre Event Metric Behavior", version: "v1.0.2", confidence: 95, status: "RUNNING" },
  { id: "clustering", name: "Pattern Clustering", version: "v1.0.1", confidence: 84, status: "RUNNING" },
  {
    id: "random_forest",
    name: "Random Forest Event Predictor",
    version: "v2.1.0",
    confidence: 97,
    status: "RUNNING",
    hasModels: true,
    models: [
      { name: "DEVICE_REBOOT.pkl", version: "v1.0.1", confidence: 98 },
      { name: "HIGH_LATENCY.pkl", version: "v1.0.1", confidence: 94 },
      { name: "HIGH_UTIL_WARNING.pkl", version: "v1.0.1", confidence: 96 },
      { name: "INTERFACE_FLAP.pkl", version: "v1.0.1", confidence: 95 },
      { name: "LINK_DOWN.pkl", version: "v1.0.1", confidence: 97 },
      { name: "PACKET_DROP.pkl", version: "v1.0.1", confidence: 96 },
    ]
  },
  { id: "sequence_mining", name: "Event Sequence Mining", version: "v1.0.1", confidence: 81, status: "RUNNING" },
  { id: "anomaly_detection", name: "Anomaly Detection", version: "v1.2.0", confidence: 90, status: "RUNNING" },
  { id: "co_occurrence", name: "Event Co-Occurrence Matrix", version: "v1.0.1", confidence: 86, status: "RUNNING" },
  { id: "failure_chain", name: "Failure Chain Patterns", version: "v1.1.0", confidence: 93, status: "RUNNING" },
];

const getConfidenceColor = (score: number) => {
  if (score >= 90) return "text-rose-500 border-rose-500/20 bg-rose-500/10";
  if (score >= 80) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
  return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
};

// Local formatLabel removed, using centralized formatMetricLabel via import

const DonutProgress = ({ value, size = 32, strokeWidth = 3 }: { value: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 90 ? "#f43f5e" : value >= 80 ? "#f59e0b" : "#10b981";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-[8px] font-black tabular-nums" style={{ color }}>{Math.round(value)}</span>
    </div>
  );
};

const TERMINAL_LOGS = {
  header: `==============================================================================
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
  Interface cols : ['B/W Util', 'Buffer Util', 'CRC Errors', 'Latency']
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
  Device metric columns added: ['CPU Util', 'Mem Util', 'Temp (C)', 'fan_speed_rpm', 'power_supply_status', 'Reboot Delta']

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
  PACKET_DROP                          986    12.1%`,

  routers: `##############################################################################
# PROCESSING: ROUTER
##############################################################################

==============================================================================
 SECTION 1 — CROSS-CORRELATION [ROUTER]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  -1 polls     0.7516      0.7159  Buffer Util LEADS B/W Util by 5 min
  B/W Util               CRC Errors                   -2 polls     0.7381      0.7158  CRC Errors LEADS B/W Util by 10 min
  B/W Util               Latency                      -1 polls     0.7530      0.7235  Latency LEADS B/W Util by 5 min
  B/W Util               CPU Util                     +0 polls     0.7830      0.7541  simultaneous
  B/W Util               Mem Util                     -1 polls     0.6164      0.6073  Mem Util LEADS B/W Util by 5 min
  B/W Util               Temp C                       -2 polls     0.6433      0.6173  Temp C LEADS B/W Util by 10 min
  B/W Util               fan_speed_rpm                -2 polls     0.1640      0.1538  fan_speed_rpm LEADS B/W Util by 10 min
  B/W Util               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  B/W Util               Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Buffer Util            CRC Errors                   -1 polls     0.9432      0.9442  CRC Errors LEADS Buffer Util by 5 min
  Buffer Util            Latency                      +0 polls     0.9959      0.9933  simultaneous
  Buffer Util            CPU Util                     +1 polls     0.8546      0.8052  Buffer Util LEADS CPU Util by 5 min
  Buffer Util            Mem Util                     +1 polls     0.6727      0.6167  Buffer Util LEADS Mem Util by 5 min
  Buffer Util            Temp C                       -1 polls     0.6630      0.6128  Temp C LEADS Buffer Util by 5 min
  Buffer Util            fan_speed_rpm                -2 polls     0.2552      0.2042  fan_speed_rpm LEADS Buffer Util by 10 min
  Buffer Util            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Buffer Util            Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  CRC Errors             Latency                      +1 polls     0.9399      0.9398  CRC Errors LEADS Latency by 5 min
  CRC Errors             CPU Util                     +2 polls     0.8010      0.7827  CRC Errors LEADS CPU Util by 10 min
  CRC Errors             Mem Util                     +2 polls     0.6473      0.5991  CRC Errors LEADS Mem Util by 10 min
  CRC Errors             Temp C                       +1 polls     0.6210      0.5960  CRC Errors LEADS Temp C by 5 min
  CRC Errors             fan_speed_rpm                -1 polls     0.2289      0.2017  fan_speed_rpm LEADS CRC Errors by 5 min
  CRC Errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CRC Errors             Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Latency                CPU Util                     +1 polls     0.8488      0.8040  Latency LEADS CPU Util by 5 min
  Latency                Mem Util                     +1 polls     0.6778      0.6182  Latency LEADS Mem Util by 5 min
  Latency                Temp C                       -1 polls     0.6629      0.6139  Temp C LEADS Latency by 5 min
  Latency                fan_speed_rpm                -2 polls     0.2621      0.2089  fan_speed_rpm LEADS Latency by 10 min
  Latency                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Latency                Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  CPU Util               Mem Util                     -3 polls     0.7047      0.6618  Mem Util LEADS CPU Util by 15 min
  CPU Util               Temp C                       -2 polls     0.7313      0.7129  Temp C LEADS CPU Util by 10 min
  CPU Util               fan_speed_rpm                -2 polls     0.2452      0.2289  fan_speed_rpm LEADS CPU Util by 10 min
  CPU Util               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CPU Util               Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Mem Util               Temp C                       +1 polls     0.6262      0.6196  Mem Util LEADS Temp C by 5 min
  Mem Util               fan_speed_rpm                -6 polls     0.1894      0.1639  fan_speed_rpm LEADS Mem Util by 30 min
  Mem Util               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Mem Util               Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Temp C                 fan_speed_rpm                +0 polls     0.2749      0.2715  simultaneous
  Temp C                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Temp C                 Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  power_supply_status    Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous

==============================================================================
 SECTION 2 — GRANGER CAUSALITY [ROUTER]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  +2 polls   63.183     0.000000  *** SIGNIFICANT ***
  B/W Util               CRC Errors                   +3 polls   34.934     0.000000  *** SIGNIFICANT ***
  B/W Util               Latency                   +2 polls   54.799     0.000000  *** SIGNIFICANT ***
  B/W Util               CPU Util                      +6 polls    8.954     0.000000  *** SIGNIFICANT ***
  B/W Util               Mem Util                 +1 polls   45.770     0.000000  *** SIGNIFICANT ***
  B/W Util               Temp (C)                       +1 polls   56.131     0.000000  *** SIGNIFICANT ***
  B/W Util               fan_speed_rpm                +9 polls    2.371     0.013630  *** SIGNIFICANT ***
  B/W Util               power_supply_status          +1 polls    0.000     1.000000  not significant
  B/W Util               Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Buffer Util            CRC Errors                   +1 polls  289.313     0.000000  *** SIGNIFICANT ***
  Buffer Util            Latency                   +2 polls    4.154     0.016674  *** SIGNIFICANT ***
  Buffer Util            CPU Util                      +1 polls    9.095     0.002795  *** SIGNIFICANT ***
  Buffer Util            Mem Util                 +1 polls   50.067     0.000000  *** SIGNIFICANT ***
  Buffer Util            Temp (C)                       +1 polls   69.147     0.000000  *** SIGNIFICANT ***
  Buffer Util            fan_speed_rpm                +7 polls    4.837     0.000038  *** SIGNIFICANT ***
  Buffer Util            power_supply_status          +3 polls 8866.326     0.000000  *** SIGNIFICANT ***
  Buffer Util            Reboot Delta                 +1 polls    0.000     1.000000  not significant
  CRC Errors             Latency                   +2 polls   14.463     0.000001  *** SIGNIFICANT ***
  CRC Errors             CPU Util                      +3 polls    3.706     0.012150  *** SIGNIFICANT ***
  CRC Errors             Mem Util                 +1 polls   38.424     0.000000  *** SIGNIFICANT ***
  CRC Errors             Temp (C)                       +1 polls   39.916     0.000000  *** SIGNIFICANT ***
  CRC Errors             fan_speed_rpm                +7 polls    4.292     0.000162  *** SIGNIFICANT ***
  CRC Errors             power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  CRC Errors             Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Latency             CPU Util                     +10 polls    2.809     0.002540  *** SIGNIFICANT ***
  Latency             Mem Util                 +1 polls   47.355     0.000000  *** SIGNIFICANT ***
  Latency             Temp (C)                       +1 polls   70.203     0.000000  *** SIGNIFICANT ***
  Latency             fan_speed_rpm                +7 polls    4.851     0.000036  *** SIGNIFICANT ***
  Latency             power_supply_status          +1 polls    0.000     1.000000  not significant
  Latency             Reboot Delta                 +1 polls    0.000     1.000000  not significant
  CPU Util                Mem Util                 +1 polls   61.350     0.000000  *** SIGNIFICANT ***
  CPU Util                Temp (C)                       +1 polls   99.348     0.000000  *** SIGNIFICANT ***
  CPU Util                fan_speed_rpm                +1 polls   11.531     0.000782  *** SIGNIFICANT ***
  CPU Util                power_supply_status          +1 polls    0.000     1.000000  not significant
  CPU Util                Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Mem Util           Temp (C)                       +1 polls   34.568     0.000000  *** SIGNIFICANT ***
  Mem Util           fan_speed_rpm                +7 polls    3.278     0.002331  *** SIGNIFICANT ***
  Mem Util           power_supply_status          +3 polls  745.558     0.000000  *** SIGNIFICANT ***
  Mem Util           Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Temp (C)                 fan_speed_rpm                +2 polls    4.492     0.012010  *** SIGNIFICANT ***
  Temp (C)                 power_supply_status          +3 polls  153.385     0.000000  *** SIGNIFICANT ***
  Temp (C)                 Reboot Delta                 +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          Reboot Delta                 +1 polls    0.000     1.000000  not significant
  power_supply_status    Reboot Delta                 +1 polls    0.000     1.000000  not significant

==============================================================================
 SECTION 3 — PRE-EVENT METRIC BEHAVIOR [ROUTER]
==============================================================================

  [DEVICE_REBOOT] No occurrences — skipping.

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: HIGH_LATENCY | Occurrences: 231 | Pre-event windows: 343 | Normal windows: 2508 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     49.55          84.14   +34.59    +69.8%  UP
  Buffer Util                   1.76          39.92   +38.16  +2168.8%  UP
  CRC Errors                    0.31          10.11    +9.80  +3194.7%  UP
  Latency                    7.76          44.00   +36.24   +467.2%  UP
  CPU Util                      43.42          50.76    +7.34    +16.9%  UP
  Mem Util                 57.43          58.52    +1.09     +1.9%  UP
  Temp (C)                       49.08          49.57    +0.50     +1.0%  UP
  fan_speed_rpm              3219.73        3224.74    +5.01     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       343  [█···············]
  Buffer Util                   1p        1p        1p       343  [█···············]
  CRC Errors                    1p        1p        1p       343  [█···············]
  Latency                    1p        1p        1p       343  [█···············]
  CPU Util                       6p        1p        1p       343  [█▄▄·▄▄·········]
  Mem Util                 15p        5p        1p        85  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: HIGH_UTIL_WARNING | Occurrences: 532 | Pre-event windows: 719 | Normal windows: 2149 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     47.43          77.55   +30.11    +63.5%  UP
  Buffer Util                   0.08          29.56   +29.48 +37608.5%  UP
  CRC Errors                    0.05           7.30    +7.25 +13422.0%  UP
  Latency                    6.16          34.16   +28.00   +454.4%  UP
  CPU Util                      43.17          48.80    +5.62    +13.0%  UP
  Mem Util                 57.40          58.27    +0.87     +1.5%  UP
  Temp (C)                       49.07          49.45    +0.38     +0.8%  UP
  fan_speed_rpm              3219.41        3225.44    +6.03     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       719  [█···············]
  Buffer Util                   1p        1p        1p       719  [█···············]
  CRC Errors                    2p        1p        1p       719  [█▄·············]
  Latency                    2p        1p        1p       719  [█▄·············]
  CPU Util                      12p        1p        1p       719  [█▄▄▄▄▄▄··▄▄▄···]
  Mem Util                 15p        8p        1p       148  [██▄▄▄▄▄▄▄▄▄▄▄▄▄]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: INTERFACE_FLAP | Occurrences: 277 | Pre-event windows: 408 | Normal windows: 2409 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     49.73          85.24   +35.51    +71.4%  UP
  Buffer Util                   1.44          42.19   +40.75  +2833.1%  UP
  CRC Errors                    0.17          10.90   +10.73  +6225.1%  UP
  Latency                    7.44          46.18   +38.74   +520.3%  UP
  CPU Util                      43.53          51.26    +7.73    +17.8%  UP
  Mem Util                 57.45          58.61    +1.16     +2.0%  UP
  Temp (C)                       49.09          49.61    +0.52     +1.1%  UP
  fan_speed_rpm              3220.11        3226.07    +5.96     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      2p        1p        1p       408  [█▄·············]
  Buffer Util                   1p        1p        1p       408  [█···············]
  CRC Errors                    1p        1p        1p       408  [█···············]
  Latency                    1p        1p        1p       408  [█···············]
  CPU Util                       6p        1p        1p       408  [█▄▄▄·▄·········]
  Mem Util                 15p        5p        1p        86  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [LINK_DOWN] No occurrences — skipping.

  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ EVENT: PACKET_DROP | Occurrences: 493 | Pre-event windows: 657 | Normal windows: 2202 ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     48.03          80.15   +32.12    +66.9%  UP
  Buffer Util                   0.28          33.31   +33.03 +11902.6%  UP
  CRC Errors                    0.06           8.22    +8.16 +14634.7%  UP
  Latency                    6.35          37.70   +31.35   +493.8%  UP
  CPU Util                      43.18          49.70    +6.52    +15.1%  UP
  Mem Util                 57.40          58.39    +0.99     +1.7%  UP
  Temp (C)                       49.07          49.52    +0.44     +0.9%  UP
  fan_speed_rpm              3219.60        3226.49    +6.89     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       657  [█···············]
  Buffer Util                   1p        1p        1p       657  [█···············]
  CRC Errors                    2p        1p        1p       657  [█▄·············]
  Latency                    1p        1p        1p       657  [█···············]
  CPU Util                      12p        1p        1p       657  [█▄▄▄▄▄▄···▄···]
  Mem Util                 15p        6p        1p       136  [█▄▄▄▄▄▄▄▄▄▄▄▄▄▄]
  Temp (C)                       n/a      n/a      n/a       n/a
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

  Cluster Centroids  (interface: ['B/W Util', 'Buffer Util']  device: ['CPU Util', 'Mem Util']):
  Cluster  Name                            B/W Util     Buffer Util         CPU Util    Mem Util
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
    Latency_last                         0.1523  ████
    Buffer Util_last                        0.1475  ████
    CRC Errors_last                         0.1018  ███
    B/W Util_last                           0.0876  ██
    B/W Util_mean                           0.0754  ██
    B/W Util_max                            0.0570  █
    B/W Util_min                            0.0461  █
    Buffer Util_slope                       0.0351  █

  HIGH_UTIL_WARNING                17.6%     0.958      0.824   0.972  0.892  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    B/W Util_last                           0.1731  █████
    Latency_last                         0.1303  ███
    Buffer Util_last                        0.1256  ███
    B/W Util_mean                           0.0680  ██
    B/W Util_max                            0.0555  █
    Latency_std                          0.0440  █
    Latency_range                        0.0358  █
    CRC Errors_last                         0.0310  

  INTERFACE_FLAP                   10.0%     0.967      0.778   0.939  0.851  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    CRC Errors_last                         0.1458  ████
    Latency_last                         0.1202  ███
    Buffer Util_last                        0.1105  ███
    B/W Util_mean                           0.0867  ██
    B/W Util_max                            0.0661  █
    B/W Util_min                            0.0519  █
    Latency_mean                         0.0379  █
    Buffer Util_mean                        0.0355  █

  LINK_DOWN                         0.0%         —          —       —      —  SKIPPED (rate out of range)
  PACKET_DROP                      16.1%     0.968      0.862   0.954  0.906  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    Latency_last                         0.1505  ████
    Buffer Util_last                        0.1380  ████
    B/W Util_last                           0.1185  ███
    CRC Errors_last                         0.0785  ██
    B/W Util_mean                           0.0721  ██
    B/W Util_max                            0.0498  █
    B/W Util_min                            0.0443  █
    Latency_slope                        0.0284  


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
  CPU Util ↑  →  CRC Errors ↑  →  Buffer Util ↑  →  Latency ↑  →  B/W Util ↑  →  HIGH_LATENCY

  Chain 2  [HIGH_UTIL_WARNING]  (5 metrics  |  seen 532x  |  719 pre-event windows)
  CPU Util ↑  →  CRC Errors ↑  →  Latency ↑  →  Buffer Util ↑  →  B/W Util ↑  →  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (5 metrics  |  seen 277x  |  408 pre-event windows)
  CPU Util ↑  →  B/W Util ↑  →  CRC Errors ↑  →  Buffer Util ↑  →  Latency ↑  →  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (5 metrics  |  seen 493x  |  657 pre-event windows)
  CPU Util ↑  →  CRC Errors ↑  →  Buffer Util ↑  →  Latency ↑  →  B/W Util ↑  →  PACKET_DROP

  Total chains: 4`,

  switches: `##############################################################################
# PROCESSING: SWITCH
##############################################################################

==============================================================================
 SECTION 1 — CROSS-CORRELATION [SWITCH]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Interpretation
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  -1 polls     0.8942  Buffer Util LEADS
  B/W Util               CRC Errors                   -2 polls     0.8482  CRC Errors LEADS
  B/W Util               Latency                   -1 polls     0.8906  Latency LEADS

==============================================================================
 SECTION 2 — GRANGER CAUSALITY [SWITCH]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  +1 polls   88.151     0.000000 ***
  B/W Util               CRC Errors                   +3 polls   35.412     0.000000 ***
  B/W Util               Latency                   +1 polls   88.824     0.000000 ***

==============================================================================
 SECTION 3 — PRE-EVENT METRIC BEHAVIOR [SWITCH]
==============================================================================

  EVENT: DEVICE_REBOOT | Occurrences: 2
  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     43.14          33.70    -9.45    -21.9%  DOWN
  Buffer Util                   6.65           0.00    -6.65   -100.0%  DOWN
  CRC Errors                    2.38           0.05    -2.33    -97.9%  DOWN

==============================================================================
 SECTION 4 — PATTERN CLUSTERING [SWITCH]
==============================================================================

  Cluster  Name                       Size  Top Following Events
  ------------------------------------------------------------------------------
  0        Stable Baseline            1310  HIGH_UTIL: 2%
  3        Spike/Recovery              448  PACKET_DROP: 69% | HIGH_UTIL: 58%

==============================================================================
 SECTION 5 — RANDOM FOREST EVENT PREDICTOR [SWITCH]
==============================================================================

  Event                         Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING                0.972      0.747   0.933  0.830  OK
  INTERFACE_FLAP                   0.978      0.741   0.909  0.816  OK
  PACKET_DROP                      0.980      0.821   0.970  0.889  OK

==============================================================================
 SECTION 6 — EVENT SEQUENCE MINING [SWITCH]
==============================================================================

  Frequent 3-event sequences:
  Sequence                                                         Supp   Conf
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP                 24   0.89
  PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP                  8   0.80

==============================================================================
 SECTION 7 — ANOMALY DETECTION [SWITCH]
==============================================================================

  Isolation Forest: 204 / 4,077 windows flagged (5.0%)

  Entity                          Anomaly %  Avg Score  Risk
  ------------------------------------------------------------------------------
  switch-03:Eth1/3                    11.0%     0.1008  MED  ██
  switch-02:Eth1/1                    10.7%     0.1092  MED  ██
  switch-01:Eth1/2                    10.0%     0.1182  MED  █

==============================================================================
 SECTION 8 — EVENT CO-OCCURRENCE MATRIX [SWITCH]
==============================================================================

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  INTERFACE_FLAP               LINK_DOWN                            2   1.21
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      34   1.08

==============================================================================
 SECTION 10 — FAILURE CHAIN PATTERNS [SWITCH]
==============================================================================

  Chain 1 [DEVICE_REBOOT]
  Buffer Util ↓ → CRC Errors ↓ → Latency ↓ → B/W Util ↓ → CPU Util ↓ → EVENT

  Chain 2 [HIGH_UTIL_WARNING]
  CPU Util ↑ → CRC Errors ↑ → Buffer Util ↑ → Latency ↑ → B/W Util ↑ → EVENT

==============================================================================
 FINAL SUMMARY — ALL ALGORITHMS [SWITCH]
==============================================================================

  Buffer Util LEADS B/W Util by 5 min (r=0.8942)
  CRC Errors LEADS B/W Util by 10 min (r=0.8482)
  Latency LEADS B/W Util by 5 min (r=0.8906)
  CPU Util LEADS B/W Util by 5 min (r=0.8324)`,

  footer: `==============================================================================
 SAVING MODELS
==============================================================================

  Models saved to: /opt/pattern_mining_code/models/

  Run score.py to score fresh metrics against these models.

==============================================================================
  DONE
==============================================================================`
};

const PATTERNS_DATA = {
  routers: [
    {
      id: "R-FC-01",
      name: "High Latency Root Cause",
      type: "Metrics Pattern",
      event: "HIGH_LATENCY",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "B/W Util", trend: "increase" }
      ],
      date: "Mar 10, 2026",
      confidence: 0.98,
      occurrences: 231,
      lastSeen: "12 min ago",
      severity: "critical",
      domain: "Network"
    },
    {
      id: "R-FC-02",
      name: "Utilization Warning Chain",
      type: "Metrics Pattern",
      event: "HIGH_UTIL_WARNING",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "B/W Util", trend: "increase" }
      ],
      date: "Mar 11, 2026",
      confidence: 0.94,
      occurrences: 532,
      lastSeen: "45 min ago",
      severity: "warning"
    },
    {
      id: "R-FC-03",
      name: "Interface Flap Root Cause",
      type: "Metrics Pattern",
      event: "INTERFACE_FLAP",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "B/W Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" }
      ],
      date: "Mar 12, 2026",
      confidence: 0.96,
      occurrences: 277,
      lastSeen: "2 hours ago",
      severity: "critical",
      domain: "Network"
    },
    {
      id: "R-FC-04",
      name: "Packet Drop Chain",
      type: "Metrics Pattern",
      event: "PACKET_DROP",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "B/W Util", trend: "increase" }
      ],
      date: "Mar 12, 2026",
      confidence: 0.92,
      occurrences: 493,
      lastSeen: "5 min ago",
      severity: "warning",
      domain: "Network"
    },
    {
      id: "R-ES-01",
      name: "Flap Cascade Sequence",
      type: "Event Sequence",
      sequence: ["HIGH_UTIL_WARNING", "PACKET_DROP", "INTERFACE_FLAP"],
      date: "Mar 12, 2026",
      confidence: 1.00,
      occurrences: 28,
      lastSeen: "18 min ago",
      severity: "critical",
      domain: "Network"
    },
    {
      id: "R-ES-02",
      name: "Latency Buildup Sequence",
      type: "Event Sequence",
      sequence: ["HIGH_UTIL_WARNING", "PACKET_DROP", "HIGH_LATENCY"],
      date: "Mar 13, 2026",
      confidence: 0.93,
      occurrences: 26,
      lastSeen: "4 min ago",
      severity: "warning",
      domain: "Network"
    },
    {
      id: "R-ES-03",
      name: "Utilization Flap Sequence",
      type: "Event Sequence",
      sequence: ["HIGH_UTIL_WARNING", "HIGH_LATENCY", "INTERFACE_FLAP"],
      date: "Mar 13, 2026",
      confidence: 0.72,
      occurrences: 21,
      lastSeen: "1 hour ago",
      severity: "warning",
      domain: "Network"
    },
    {
      id: "R-ES-04",
      name: "Drop Latency Sequence",
      type: "Event Sequence",
      sequence: ["PACKET_DROP", "HIGH_LATENCY", "INTERFACE_FLAP"],
      date: "Mar 13, 2026",
      confidence: 0.71,
      occurrences: 20,
      lastSeen: "30 min ago",
      severity: "warning",
      domain: "Network"
    }
  ],
  switches: [
    {
      id: "S-FC-01",
      name: "Device Reboot Chain",
      type: "Metrics Pattern",
      event: "DEVICE_REBOOT",
      details: [
        { metric: "Buffer Util", trend: "decrease" },
        { metric: "CRC Errors", trend: "decrease" },
        { metric: "Latency", trend: "decrease" },
        { metric: "B/W Util", trend: "decrease" },
        { metric: "CPU Util", trend: "decrease" }
      ],
      date: "Mar 05, 2026",
      confidence: 0.88,
      occurrences: 2,
      lastSeen: "2 days ago",
      severity: "critical",
      domain: "Data Center"
    },
    {
      id: "S-FC-02",
      name: "Utilization Spike Chain",
      type: "Metrics Pattern",
      event: "HIGH_UTIL_WARNING",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "Reboot Delta", trend: "increase" },
        { metric: "B/W Util", trend: "increase" }
      ],
      date: "Mar 10, 2026",
      confidence: 0.91,
      occurrences: 207,
      lastSeen: "12 min ago",
      severity: "warning",
      domain: "Data Center"
    },
    {
      id: "S-FC-03",
      name: "Switch Interface Flap Chain",
      type: "Metrics Pattern",
      event: "INTERFACE_FLAP",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "B/W Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "Reboot Delta", trend: "increase" }
      ],
      date: "Mar 12, 2026",
      confidence: 0.95,
      occurrences: 146,
      lastSeen: "2 hours ago",
      severity: "critical",
      domain: "Data Center"
    },
    {
      id: "S-FC-04",
      name: "Packet Loss Chain",
      type: "Metrics Pattern",
      event: "PACKET_DROP",
      details: [
        { metric: "CPU Util", trend: "increase" },
        { metric: "CRC Errors", trend: "increase" },
        { metric: "Buffer Util", trend: "increase" },
        { metric: "Latency", trend: "increase" },
        { metric: "Reboot Delta", trend: "increase" },
        { metric: "B/W Util", trend: "increase" }
      ],
      date: "Mar 12, 2026",
      confidence: 0.93,
      occurrences: 239,
      lastSeen: "3 hours ago",
      severity: "warning",
      domain: "Data Center"
    },
    {
      id: "S-ES-01",
      name: "Switch Flap Sequence",
      type: "Event Sequence",
      sequence: ["HIGH_UTIL_WARNING", "PACKET_DROP", "INTERFACE_FLAP"],
      date: "Mar 13, 2026",
      confidence: 0.89,
      occurrences: 24,
      lastSeen: "45 min ago",
      severity: "warning",
      domain: "Data Center"
    },
    {
      id: "S-ES-02",
      name: "Drop Util Sequence",
      type: "Event Sequence",
      sequence: ["PACKET_DROP", "HIGH_UTIL_WARNING", "INTERFACE_FLAP"],
      date: "Mar 13, 2026",
      confidence: 0.80,
      occurrences: 8,
      lastSeen: "2 hours ago",
      severity: "warning",
      domain: "Data Center"
    },
    {
      id: "S-ES-03",
      name: "High Util Link Down",
      type: "Event Sequence",
      sequence: ["HIGH_UTIL_WARNING", "INTERFACE_FLAP", "LINK_DOWN"],
      date: "Mar 13, 2026",
      confidence: 0.06,
      occurrences: 2,
      lastSeen: "10 min ago",
      severity: "critical",
      domain: "Data Center"
    },
    {
      id: "S-ES-04",
      name: "Packet Drop Link Down",
      type: "Event Sequence",
      sequence: ["PACKET_DROP", "INTERFACE_FLAP", "LINK_DOWN"],
      date: "Mar 13, 2026",
      confidence: 0.06,
      occurrences: 2,
      lastSeen: "15 min ago",
      severity: "critical",
      domain: "Data Center"
    }
  ]
};

export function PatternPredictionContent({ onSectionChange }: { onSectionChange?: (section: any) => void }) {
  const allPatterns = [...PATTERNS_DATA.routers, ...PATTERNS_DATA.switches];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(allPatterns.length / itemsPerPage);
  const currentPatterns = allPatterns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderDetails = (item: any) => {
    if (item.type === "Metrics Pattern") {
      return (
        <div className="flex flex-wrap items-center gap-1 max-w-[400px]">
          {item.details.map((m: any, idx: number) => (
            <span key={idx} className="flex items-center gap-0.5 whitespace-nowrap">
              <span className="text-[10px] text-primary/80 font-mono">{formatLabel(m.metric)}</span>
              <span className={cn(
                "text-[10px]",
                m.trend === "increase" ? "text-rose-500" : "text-blue-500"
              )}>
                {m.trend === "increase" ? "↑" : "↓"}
              </span>
              {idx < item.details.length - 1 && (
                <span className="text-muted-foreground/30 mx-0.5">→</span>
              )}
            </span>
          ))}
          <span className="text-muted-foreground/30 mx-0.5">→</span>
          <span className={cn(
            "text-[10px] font-bold tracking-tight px-1 rounded",
            item.severity === "critical" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
          )}>
            {item.event.split('_').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap items-center gap-1 max-w-[400px]">
        {item.sequence.map((ev: string, idx: number) => (
          <span key={idx} className="flex items-center gap-1">
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap",
              idx === item.sequence.length - 1
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-muted/50 border-border/50 text-foreground/70"
            )}>
              {ev.split('_').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </span>
            {idx < item.sequence.length - 1 && (
              <span className="text-muted-foreground/30">→</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const [activeConfigs, setActiveConfigs] = useState<Record<string, boolean>>(
    CONFIG_FUNCTIONS.reduce((acc, fn) => ({ ...acc, [fn.id]: true }), {})
  );

  const initialModelsState = CONFIG_FUNCTIONS.reduce((acc, fn) => {
    if (fn.models) {
      fn.models.forEach(model => {
        acc[model.name] = true;
      });
    }
    return acc;
  }, {} as Record<string, boolean>);

  const [activeModels, setActiveModels] = useState<Record<string, boolean>>(initialModelsState);

  const toggleConfig = (id: string) => {
    setActiveConfigs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModel = (name: string) => {
    setActiveModels(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between border-b pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pattern Workspace</h1>
          </div>

          <div className="flex items-center gap-4">

            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analysis
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-[80vw] w-[80vw] bg-card/95 backdrop-blur-xl border-l border-primary/20 p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                      Analysis Workspace — <span className="text-primary capitalize">Global Patterns</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                  <Tabs defaultValue="procedures" className="h-full flex flex-col">
                    <div className="px-6 border-b border-border/50 bg-secondary/30">
                      <TabsList className="h-14 bg-transparent gap-8 p-0">
                        <TabsTrigger
                          value="procedures"
                          className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 text-[11px] font-bold tracking-widest"
                        >
                          Process Procedures
                        </TabsTrigger>
                        <TabsTrigger
                          value="configurations"
                          className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 text-[11px] font-bold tracking-widest"
                        >
                          Configurations
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden p-8">
                      <TabsContent value="procedures" className="mt-0 h-full">
                        <div className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col">
                          <div className="px-4 py-2 border-b border-border/50 bg-secondary/50 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-muted-foreground ml-2 font-mono">pattern_engine.py — Combined Output</span>
                          </div>
                          <ScrollArea className="flex-1">
                            <div className="p-6 font-mono text-[11px] leading-relaxed text-[#d4d4d4] whitespace-pre">
                              {TERMINAL_LOGS.header}
                              {"\n\n"}
                              {TERMINAL_LOGS.routers}
                              {"\n\n"}
                              {TERMINAL_LOGS.switches}
                              {"\n\n"}
                              {TERMINAL_LOGS.footer}
                            </div>
                          </ScrollArea>
                        </div>
                      </TabsContent>

                      <TabsContent value="configurations" className="mt-0 h-full overflow-y-auto">
                        <div className="space-y-6 pb-20">
                          <div className="p-5 bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                              <h4 className="text-[10px] font-black tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
                                <Settings className="h-3 w-3 animate-[spin_4s_linear_infinite]" />
                                Global Model Confidence
                              </h4>
                              <p className="text-[9px] text-foreground/80 font-bold tracking-widest opacity-60">System-wide Reliability Threshold</p>
                            </div>
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="text-right">
                                <span className="text-3xl font-black text-emerald-500 tabular-nums tracking-tighter shadow-sm">94.8%</span>
                                <div className="text-[9px] font-black text-emerald-500/60 tracking-tighter mt-1">Optimal State</div>
                              </div>
                              <div className="h-10 w-10 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500 animate-[spin_2s_linear_infinite] shadow-lg shadow-emerald-500/10" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CONFIG_FUNCTIONS.map((fn, i) => (
                              <div key={fn.id} className="space-y-2">
                                <Card className="p-4 bg-muted/10 border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black tracking-widest text-foreground group-hover:text-primary transition-colors">{fn.name}</span>
                                        <Badge variant="secondary" className="text-[8px] h-4 px-1 opacity-60 font-mono">{fn.version}</Badge>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                          <div className={cn(
                                            "h-1.5 w-1.5 rounded-full animate-pulse",
                                            activeConfigs[fn.id] ? "bg-emerald-500" : "bg-muted-foreground/40"
                                          )} />
                                          <span className={cn(
                                            "text-[9px] font-black tracking-widest",
                                            activeConfigs[fn.id] ? "text-emerald-500/80" : "text-muted-foreground/40"
                                          )}>{activeConfigs[fn.id] ? "Active" : "Disabled"}</span>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5 border font-black tracking-tighter", getConfidenceColor(fn.confidence))}>
                                          {fn.confidence}% Conf.
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-md border-border/50 bg-secondary/20 hover:bg-primary/10 hover:text-primary transition-all group/retrain"
                                        title="Retrain Model"
                                      >
                                        <RotateCcw className="h-3 w-3 group-hover/retrain:rotate-[-180deg] transition-transform duration-500" />
                                      </Button>
                                      <Switch
                                        checked={activeConfigs[fn.id]}
                                        onCheckedChange={() => toggleConfig(fn.id)}
                                        className="data-[state=checked]:bg-primary h-5 w-9"
                                      />
                                    </div>
                                  </div>

                                  {fn.hasModels && (
                                    <Accordion type="single" collapsible className="w-full">
                                      <AccordionItem value="models" className="border-none">
                                        <AccordionTrigger className="py-0 text-[9px] font-black tracking-widest text-foreground hover:text-primary transition-colors hover:no-underline">
                                          Toggle Pkl Models
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-2">
                                          {fn.models?.map((model) => (
                                            <div key={model.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50 group/model">
                                              <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                  <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full animate-pulse",
                                                    activeModels[model.name] ? "bg-emerald-500" : "bg-muted-foreground/40"
                                                  )} />
                                                  <p className={cn(
                                                    "text-[9px] font-bold transition-colors",
                                                    activeModels[model.name] ? "text-foreground/80 group-hover/model:text-primary" : "text-muted-foreground/40"
                                                  )}>{model.name}</p>
                                                </div>
                                                <span className="text-[8px] text-muted-foreground/60 font-mono ml-3">{model.version}</span>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <span className={cn("text-[9px] font-black tabular-nums", getConfidenceColor(model.confidence).split(' ')[0])}>
                                                  {model.confidence}%
                                                </span>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-5 w-5 rounded border-white/5 bg-white/5 hover:bg-primary/10 hover:text-primary transition-all group/retrain_model"
                                                  title="Retrain PKL Model"
                                                >
                                                  <RotateCcw className="h-2.5 w-2.5 group-hover/retrain_model:rotate-[-180deg] transition-transform duration-500" />
                                                </Button>
                                                <Switch
                                                  checked={activeModels[model.name]}
                                                  onCheckedChange={() => toggleModel(model.name)}
                                                  className="h-4 w-7 data-[state=checked]:bg-primary"
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  )}
                                </Card>
                              </div>
                            ))}

                            {/* BYOA Placeholder */}
                            <Card className="p-6 bg-transparent border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 group hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer min-h-[140px] relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                                <Plus className="h-12 w-12 text-primary" />
                              </div>
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <Plus className="h-6 w-6 text-primary" />
                              </div>
                              <div className="text-center relative z-10">
                                <span className="text-[11px] font-black tracking-[0.2em] text-primary block mb-1">Byoa Portal</span>
                                <p className="text-[8px] text-foreground/80 font-black tracking-widest opacity-60">Bring Your Own Algorithm</p>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="w-full rounded-xl border border-border bg-card/30 flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[220px]">Pattern Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground">Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[150px]">Domain</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[180px]">Rule Creation Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[120px]">Confidence</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[140px]">Occurrences</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[150px]">Last Seen</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-wider text-foreground w-[80px]">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {currentPatterns.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-bold tracking-widest h-4 px-1 border-none",
                            item.type === "Metrics Pattern" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                          )}>
                            {item.type}
                          </Badge>
                          <div className={cn(
                            "h-1 w-1 rounded-full",
                            item.severity === "critical" ? "bg-rose-500" : "bg-amber-500"
                          )} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {renderDetails(item)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-foreground/80">
                        {item.domain === 'Network' ? <Globe className="h-3 w-3 text-primary/60" /> : <Server className="h-3 w-3 text-primary/60" />}
                        <span className="text-[10px] font-bold tracking-tight">{item.domain}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-foreground/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 opacity-50" />
                        <span className="text-[10px]">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <DonutProgress value={item.confidence * 100} size={32} strokeWidth={3} />
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[10px] font-black tracking-tight",
                            (item.confidence * 100) >= 90 ? "text-rose-500" :
                              (item.confidence * 100) >= 80 ? "text-amber-500" :
                                "text-emerald-500"
                          )}>
                            {(item.confidence * 100) >= 90 ? "Critical" :
                              (item.confidence * 100) >= 80 ? "High" : "Optimal"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="h-3 w-3 opacity-50" />
                        <span className="text-[11px] font-bold tabular-nums">{item.occurrences}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3 opacity-50" />
                        <span className="text-[10px]">{item.lastSeen}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Switch defaultChecked />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
            <div className="text-[11px] font-semibold text-foreground tracking-wider">
              Showing <span className="text-foreground">{currentPatterns.length}</span> of <span className="text-foreground">{allPatterns.length}</span> Patterns
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 px-3 gap-1.5", currentPage === 1 && "opacity-50 cursor-not-allowed")}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-[10px] font-bold">Prev</span>
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-[11px] font-bold",
                      currentPage === i + 1 ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground opacity-60 hover:opacity-100"
                    )}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 px-3 gap-1.5", currentPage === totalPages && "opacity-50 cursor-not-allowed")}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <span className="text-[10px] font-bold">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default function PatternPage() {
  return (
    <MainLayout>
      <PatternPredictionContent />
    </MainLayout>
  );
}
