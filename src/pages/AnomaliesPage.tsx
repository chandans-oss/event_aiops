import React, { useState } from "react";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import {
  BarChart3, Activity, Search, Settings, Plus, ChevronDown,
  Zap, Clock, ShieldAlert, ArrowUpRight,
  ChevronLeft, ChevronRight, Gauge, Layers, Info, RotateCcw
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/shared/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

// --- Mock Data ---
const ANOMALY_DATA = [
  {
    device: "router-03",
    interface: "Gi0/3/0",
    device_type: "router",
    anomaly_window: "2026-01-01T22:30:00Z",
    severity: "MED",
    anomaly_score: 0.91,
    top_metrics: [
      { metric: "queue_depth", behavior: "spike", change_percent: 3200 },
      { metric: "latency_ms", behavior: "increase", change_percent: 420 },
      { metric: "util_pct", behavior: "traffic surge", change_percent: 68 }
    ]
  },
  {
    device: "router-02",
    interface: "Gi0/1/0",
    device_type: "router",
    anomaly_window: "2026-01-01T21:50:00Z",
    severity: "MED",
    anomaly_score: 0.86,
    top_metrics: [
      { metric: "crc_errors", behavior: "error burst", change_percent: 1500 },
      { metric: "queue_depth", behavior: "buffer buildup", change_percent: 2100 },
      { metric: "latency_ms", behavior: "increase", change_percent: 380 }
    ]
  },
  {
    device: "router-01",
    interface: "Gi0/2/0",
    device_type: "router",
    anomaly_window: "2026-01-01T23:05:00Z",
    severity: "LOW",
    anomaly_score: 0.74,
    top_metrics: [
      { metric: "util_pct", behavior: "high utilization", change_percent: 63 },
      { metric: "cpu_pct", behavior: "increase", change_percent: 28 },
      { metric: "queue_depth", behavior: "moderate rise", change_percent: 340 }
    ]
  },
  {
    device: "switch-03",
    interface: "Eth1/3",
    device_type: "switch",
    anomaly_window: "2026-01-01T22:10:00Z",
    severity: "MED",
    anomaly_score: 0.88,
    top_metrics: [
      { metric: "util_pct", behavior: "traffic spike", change_percent: 72 },
      { metric: "queue_depth", behavior: "buffer buildup", change_percent: 1900 },
      { metric: "latency_ms", behavior: "increase", change_percent: 350 }
    ]
  },
  {
    device: "switch-02",
    interface: "Eth1/1",
    device_type: "switch",
    anomaly_window: "2026-01-01T21:35:00Z",
    severity: "MED",
    anomaly_score: 0.84,
    top_metrics: [
      { metric: "crc_errors", behavior: "error burst", change_percent: 1100 },
      { metric: "latency_ms", behavior: "increase", change_percent: 290 },
      { metric: "util_pct", behavior: "traffic increase", change_percent: 55 }
    ]
  },
  {
    device: "switch-04",
    interface: "Eth1/2",
    device_type: "switch",
    anomaly_window: "2026-01-01T23:15:00Z",
    severity: "LOW",
    anomaly_score: 0.71,
    top_metrics: [
      { metric: "mem_util_pct", behavior: "memory utilization high", change_percent: 48 },
      { metric: "cpu_pct", behavior: "increase", change_percent: 22 },
      { metric: "util_pct", behavior: "traffic increase", change_percent: 37 }
    ]
  }
];

const CONFIG_FUNCTIONS = [
  { id: "cross_correlation", name: "CROSS-CORRELATION", version: "v1.0.1", confidence: 92, status: "RUNNING" },
  { id: "granger_causality", name: "GRANGER CAUSALITY", version: "v1.0.1", confidence: 88, status: "RUNNING" },
  { id: "pre_event", name: "PRE-EVENT METRIC BEHAVIOUR", version: "v1.0.2", confidence: 95, status: "RUNNING" },
  { id: "clustering", name: "PATTERN CLUSTERING", version: "v1.0.1", confidence: 84, status: "RUNNING" },
  {
    id: "random_forest",
    name: "RANDOM FOREST EVENT PREDICTOR",
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
  { id: "sequence_mining", name: "EVENT SEQUENCE MINING", version: "v1.0.1", confidence: 81, status: "RUNNING" },
  { id: "anomaly_detection", name: "ANAMALY DETECTION (BY ISOLATION FOREST)", version: "v1.2.0", confidence: 90, status: "RUNNING" },
  { id: "co_occurrence", name: "EVENT CO-OCCURANCE MATRIX", version: "v1.0.1", confidence: 86, status: "RUNNING" },
  { id: "failure_chain", name: "FAILURE CHAIN PATTERNS", version: "v1.1.0", confidence: 93, status: "RUNNING" },
];

const getConfidenceColor = (score: number) => {
  if (score >= 90) return "text-rose-500 border-rose-500/20 bg-rose-500/10";
  if (score >= 80) return "text-amber-500 border-amber-500/20 bg-amber-500/10";
  return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
};

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
          className="text-white/5"
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
  PACKET_DROP                          986    12.1%`,

  routers: `##############################################################################
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
  util_pct                      2p        1p        1p       408  [█▄·············]
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

  Total chains: 4`,

  switches: `##############################################################################
# PROCESSING: SWITCH
##############################################################################

==============================================================================
 SECTION 1 — CROSS-CORRELATION [SWITCH]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.8942  queue_depth LEADS
  util_pct               crc_errors                   -2 polls     0.8482  crc_errors LEADS
  util_pct               latency_ms                   -1 polls     0.8906  latency_ms LEADS

==============================================================================
 SECTION 2 — GRANGER CAUSALITY [SWITCH]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +1 polls   88.151     0.000000 ***
  util_pct               crc_errors                   +3 polls   35.412     0.000000 ***
  util_pct               latency_ms                   +1 polls   88.824     0.000000 ***

==============================================================================
 SECTION 3 — PRE-EVENT METRIC BEHAVIOR [SWITCH]
==============================================================================

  EVENT: DEVICE_REBOOT | Occurrences: 2
  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     43.14          33.70    -9.45    -21.9%  DOWN
  queue_depth                   6.65           0.00    -6.65   -100.0%  DOWN
  crc_errors                    2.38           0.05    -2.33    -97.9%  DOWN

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
  queue_depth ↓ → crc_errors ↓ → latency_ms ↓ → util_pct ↓ → cpu_pct ↓ → EVENT

  Chain 2 [HIGH_UTIL_WARNING]
  cpu_pct ↑ → crc_errors ↑ → queue_depth ↑ → latency_ms ↑ → util_pct ↑ → EVENT

==============================================================================
 FINAL SUMMARY — ALL ALGORITHMS [SWITCH]
==============================================================================

  queue_depth LEADS util_pct by 5 min (r=0.8942)
  crc_errors LEADS util_pct by 10 min (r=0.8482)
  latency_ms LEADS util_pct by 5 min (r=0.8906)
  cpu_pct LEADS util_pct by 5 min (r=0.8324)`,

  footer: `==============================================================================
 SAVING MODELS
==============================================================================

  Models saved to: /opt/pattern_mining_code/models/

  Run score.py to score fresh metrics against these models.

==============================================================================
  DONE
==============================================================================`
};

export default function AnomaliesPage() {
  const [deviceType, setDeviceType] = useState<"router" | "switch">("router");
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
  
  const filteredAnomalies = ANOMALY_DATA.filter(a => a.device_type === deviceType);

  return (
    <MainLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between border-b pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Anomaly Detection</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-black opacity-60">ML Observation Continuous</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={deviceType}
              onValueChange={(val: any) => setDeviceType(val)}
            >
              <SelectTrigger className="w-[180px] bg-card/40 border-primary/20">
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="router">Routers</SelectItem>
                <SelectItem value="switch">Switches</SelectItem>
              </SelectContent>
            </Select>

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
                      Analysis Workspace — <span className="text-primary capitalize">{deviceType}s</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                  <Tabs defaultValue="procedures" className="h-full flex flex-col">
                    <div className="px-6 border-b border-border/50 bg-muted/30">
                      <TabsList className="h-14 bg-transparent gap-8 p-0">
                        <TabsTrigger
                          value="procedures"
                          className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 text-[11px] font-bold uppercase tracking-widest"
                        >
                          Process procedures
                        </TabsTrigger>
                        <TabsTrigger
                          value="configurations"
                          className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-2 text-[11px] font-bold uppercase tracking-widest"
                        >
                          Configurrations
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden p-8">
                      <TabsContent value="procedures" className="mt-0 h-full">
                        <div className="h-full bg-[#0c0c0c] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                          <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-muted-foreground ml-2 font-mono">anomaly_engine.py — {deviceType}</span>
                          </div>
                          <ScrollArea className="flex-1">
                            <div className="p-6 font-mono text-[11px] leading-relaxed text-[#d4d4d4] whitespace-pre">
                              {TERMINAL_LOGS.header}
                              {"\n\n"}
                              {deviceType === "router" ? TERMINAL_LOGS.routers : TERMINAL_LOGS.switches}
                              {"\n\n"}
                              {TERMINAL_LOGS.footer}
                            </div>
                          </ScrollArea>
                        </div>
                      </TabsContent>

                      <TabsContent value="configurations" className="mt-0 h-full overflow-y-auto">
                        <div className="space-y-6 pb-20">
                          {/* Consolidated Score */}
                          <div className="p-5 bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
                                <Settings className="h-3 w-3 animate-[spin_4s_linear_infinite]" />
                                Global Model Confidence
                              </h4>
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">System-wide reliability threshold</p>
                            </div>
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="text-right">
                                <span className="text-3xl font-black text-emerald-500 tabular-nums tracking-tighter shadow-sm">94.8%</span>
                                <div className="text-[9px] font-black text-emerald-500/60 uppercase tracking-tighter mt-1">Optimal State</div>
                              </div>
                              <div className="h-10 w-10 rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500 animate-[spin_2s_linear_infinite] shadow-lg shadow-emerald-500/10" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CONFIG_FUNCTIONS.map((fn) => (
                              <div key={fn.id} className="space-y-2">
                                <Card className="p-4 bg-muted/10 border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{fn.name}</span>
                                        <Badge variant="secondary" className="text-[8px] h-4 px-1 opacity-60 font-mono">{fn.version}</Badge>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                          <div className={cn(
                                            "h-1.5 w-1.5 rounded-full animate-pulse",
                                            activeConfigs[fn.id] ? "bg-emerald-500" : "bg-muted-foreground/40"
                                          )} />
                                          <span className={cn(
                                            "text-[9px] font-black tracking-widest uppercase",
                                            activeConfigs[fn.id] ? "text-emerald-500/80" : "text-muted-foreground/40"
                                          )}>{activeConfigs[fn.id] ? "Active" : "Disabled"}</span>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5 border font-black uppercase tracking-tighter", getConfidenceColor(fn.confidence))}>
                                          {fn.confidence}% Conf.
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-7 w-7 rounded-md border-white/5 bg-white/5 hover:bg-primary/10 hover:text-primary transition-all group/retrain"
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
                                        <AccordionTrigger className="py-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hover:no-underline">
                                          Toggle PKL Models
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-2">
                                          {fn.models?.map((model) => (
                                            <div key={model.name} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 group/model">
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
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary block mb-1">BYOA Portal</span>
                                <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Bring Your Own Algorithm</p>
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

        {/* Anomaly Grid List */}
        <div className="w-full rounded-xl border border-border bg-card/30 flex flex-col overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[180px]">Device & Interface</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[120px]">Severity</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[150px]">Anomaly Score</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Top Metric Drivers</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[150px]">Window Period</th>
                </tr>
              </thead>
            </table>
          </div>

          <ScrollArea className="h-[600px]">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-white/5">
                {filteredAnomalies.map((anomaly, idx) => (
                  <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6 w-[180px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Layers className="h-3 w-3 text-primary" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                            {anomaly.device}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground/60 font-black tracking-widest uppercase ml-5">
                          {anomaly.interface}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 w-[120px]">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded border tracking-widest uppercase",
                          anomaly.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            anomaly.severity === "MED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}
                      >
                        {anomaly.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 w-[150px]">
                      <div className="flex items-center gap-4">
                        <DonutProgress value={anomaly.anomaly_score * 100} size={40} strokeWidth={4} />
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-tight",
                            anomaly.anomaly_score >= 0.9 ? "text-rose-500" :
                              anomaly.anomaly_score >= 0.8 ? "text-amber-500" :
                                "text-emerald-500"
                          )}>
                            {anomaly.anomaly_score >= 0.9 ? "Critical" :
                              anomaly.anomaly_score >= 0.8 ? "High Risk" : "Elevated"}
                          </span>
                          <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">Confidence</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="grid grid-cols-3 gap-3 max-w-[700px]">
                        {anomaly.top_metrics.map((m, midx) => {
                          const isRed = m.change_percent >= 1000 || m.metric.includes("error");
                          const isOrange = m.change_percent >= 300;

                          return (
                            <div
                              key={midx}
                              className={cn(
                                "p-3 rounded-xl transition-all group/metric border",
                                isRed ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40" :
                                  isOrange ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40" :
                                    "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest truncate transition-colors",
                                  isRed ? "text-rose-500/80 group-hover/metric:text-rose-500" :
                                    isOrange ? "text-amber-500/80 group-hover/metric:text-amber-500" :
                                      "text-emerald-500/80 group-hover/metric:text-emerald-500"
                                )}>
                                  {m.metric}
                                </span>
                                <ArrowUpRight className={cn(
                                  "h-2.5 w-2.5 transition-opacity",
                                  isRed ? "text-rose-500" : isOrange ? "text-amber-500" : "text-emerald-500"
                                )} />
                              </div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[11px] font-black text-foreground tabular-nums">+{m.change_percent}%</span>
                                <span className="text-[8px] font-medium text-muted-foreground/60 italic truncate">{m.behavior}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-6 w-[150px]">
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Clock className="h-3 w-3" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black tracking-widest uppercase">
                            {new Date(anomaly.anomaly_window).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[8px] font-bold opacity-40">
                            {new Date(anomaly.anomaly_window).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/5">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
              Showing <span className="text-foreground">{filteredAnomalies.length}</span> Identified Anomalies
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10 hover:bg-white/5 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 text-[10px] font-black text-primary bg-primary/10 h-8 flex items-center rounded-md border border-primary/20">1</div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10 hover:bg-white/5 text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
