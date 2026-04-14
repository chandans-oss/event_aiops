import { CorrelationSession, GrangerSession } from "@/types/analysis";

export const STRUCTURED_REPORTS = {
  cross_correlation: [
    {
      deviceType: "ROUTER",
      results: [
        { metricA: "B/W Util", metricB: "Buffer Util", lag: "-1 polls", pearson: 0.7516, spearman: 0.7159, interpretation: "Buffer Util LEADS B/W Util by 5 min" },
        { metricA: "B/W Util", metricB: "CRC Errors", lag: "-2 polls", pearson: 0.7381, spearman: 0.7158, interpretation: "CRC Errors LEADS B/W Util by 10 min" },
        { metricA: "B/W Util", metricB: "Latency", lag: "-1 polls", pearson: 0.7530, spearman: 0.7235, interpretation: "Latency LEADS B/W Util by 5 min" },
        { metricA: "B/W Util", metricB: "CPU Util", lag: "+0 polls", pearson: 0.7830, spearman: 0.7541, interpretation: "simultaneous" }
      ],
      findings: [
        { metricA: "B/W Util", metricB: "Buffer Util", lag: "5 min", r: 0.7516 },
        { metricA: "B/W Util", metricB: "CRC Errors", lag: "10 min", r: 0.7381 }
      ]
    },
    {
      deviceType: "SWITCH",
      results: [
        { metricA: "B/W Util", metricB: "Buffer Util", lag: "-1 polls", pearson: 0.8942, spearman: 0.8607, interpretation: "Buffer Util LEADS B/W Util by 5 min" }
      ],
      findings: [
        { metricA: "B/W Util", metricB: "Buffer Util", lag: "5 min", r: 0.8942 }
      ]
    }
  ],
  granger_causality: [
    {
      deviceType: "ROUTER",
      results: [
        { cause: "Buffer Util", effect: "Latency", lag: "1 poll", fStat: 12.45, pVal: 0.000123, significant: true },
        { cause: "CRC Errors", effect: "B/W Util", lag: "2 polls", fStat: 8.32, pVal: 0.0045, significant: true }
      ],
      significantPairs: [
        { cause: "Buffer Util", effect: "Latency", p: 0.0001, lag: "5 min" }
      ]
    }
  ] as GrangerSession[]
};
