import { CorrelationSession, GrangerSession } from "@/types/analysis";

export const STRUCTURED_REPORTS = {
  cross_correlation: [
    {
      deviceType: "ROUTER",
      results: [
        { metricA: "util_pct", metricB: "queue_depth", lag: "-1 polls", pearson: 0.7516, spearman: 0.7159, interpretation: "queue_depth LEADS util_pct by 5 min" },
        { metricA: "util_pct", metricB: "crc_errors", lag: "-2 polls", pearson: 0.7381, spearman: 0.7158, interpretation: "crc_errors LEADS util_pct by 10 min" },
        { metricA: "util_pct", metricB: "latency_ms", lag: "-1 polls", pearson: 0.7530, spearman: 0.7235, interpretation: "latency_ms LEADS util_pct by 5 min" },
        { metricA: "util_pct", metricB: "cpu_pct", lag: "+0 polls", pearson: 0.7830, spearman: 0.7541, interpretation: "simultaneous" }
      ],
      findings: [
        { metricA: "util_pct", metricB: "queue_depth", lag: "5 min", r: 0.7516 },
        { metricA: "util_pct", metricB: "crc_errors", lag: "10 min", r: 0.7381 }
      ]
    },
    {
      deviceType: "SWITCH",
      results: [
        { metricA: "util_pct", metricB: "queue_depth", lag: "-1 polls", pearson: 0.8942, spearman: 0.8607, interpretation: "queue_depth LEADS util_pct by 5 min" }
      ],
      findings: [
        { metricA: "util_pct", metricB: "queue_depth", lag: "5 min", r: 0.8942 }
      ]
    }
  ],
  granger_causality: [
    {
      deviceType: "ROUTER",
      results: [
        { cause: "queue_depth", effect: "latency_ms", lag: "1 poll", fStat: 12.45, pVal: 0.000123, significant: true },
        { cause: "crc_errors", effect: "util_pct", lag: "2 polls", fStat: 8.32, pVal: 0.0045, significant: true }
      ],
      significantPairs: [
        { cause: "queue_depth", effect: "latency_ms", p: 0.0001, lag: "5 min" }
      ]
    }
  ] as GrangerSession[]
};
