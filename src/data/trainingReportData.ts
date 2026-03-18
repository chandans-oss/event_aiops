export interface ReportSummaryItem {
  section: string;
  device_type: string;
  event: string;
  metric: string;
  normal_avg: number | string;
  pre_event_avg: number | string;
  delta_pct: number | string;
  n_occurrences: number | string;
  accuracy?: number | string;
  precision?: number | string;
  recall?: number | string;
  f1?: number | string;
  entity_id?: string;
  anomaly_rate?: number | string;
  avg_if_score?: number | string;
}

export const trainingSummaryReport: ReportSummaryItem[] = [
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'util_pct', normal_avg: 49.3, pre_event_avg: 84.6, delta_pct: 72.0, n_occurrences: 242 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'queue_depth', normal_avg: 1.4, pre_event_avg: 41.6, delta_pct: 2784.0, n_occurrences: 242 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'crc_errors', normal_avg: 0.2, pre_event_avg: 11.1, delta_pct: 5687.0, n_occurrences: 242 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'latency_ms', normal_avg: 7.5, pre_event_avg: 45.8, delta_pct: 513.0, n_occurrences: 242 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'cpu_pct', normal_avg: 42.3, pre_event_avg: 51.5, delta_pct: 22.0, n_occurrences: 242 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'util_pct', normal_avg: 47.2, pre_event_avg: 76.7, delta_pct: 63.0, n_occurrences: 505 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'queue_depth', normal_avg: 0.1, pre_event_avg: 29.0, delta_pct: 38973.0, n_occurrences: 505 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'crc_errors', normal_avg: 0.1, pre_event_avg: 7.3, delta_pct: 13334.0, n_occurrences: 505 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'latency_ms', normal_avg: 6.2, pre_event_avg: 33.8, delta_pct: 449.0, n_occurrences: 505 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'util_pct', normal_avg: 49.4, pre_event_avg: 86.0, delta_pct: 74.0, n_occurrences: 283 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'queue_depth', normal_avg: 1.2, pre_event_avg: 44.6, delta_pct: 3504.0, n_occurrences: 283 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'crc_errors', normal_avg: 0.1, pre_event_avg: 12.3, delta_pct: 10091.0, n_occurrences: 283 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'latency_ms', normal_avg: 7.3, pre_event_avg: 48.7, delta_pct: 569.0, n_occurrences: 283 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'cpu_pct', normal_avg: 42.3, pre_event_avg: 52.0, delta_pct: 23.0, n_occurrences: 283 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'util_pct', normal_avg: 47.7, pre_event_avg: 80.0, delta_pct: 68.0, n_occurrences: 487 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'queue_depth', normal_avg: 0.2, pre_event_avg: 33.9, delta_pct: 15162.0, n_occurrences: 487 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'crc_errors', normal_avg: 0.1, pre_event_avg: 8.7, delta_pct: 15418.0, n_occurrences: 487 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'latency_ms', normal_avg: 6.3, pre_event_avg: 38.5, delta_pct: 510.0, n_occurrences: 487 },
  { section: 'rf', device_type: 'router', event: 'HIGH_LATENCY', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.972, precision: 0.788, recall: 0.931, f1: 0.854 },
  { section: 'rf', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.961, precision: 0.836, recall: 0.948, f1: 0.888 },
  { section: 'rf', device_type: 'router', event: 'INTERFACE_FLAP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.979, precision: 0.865, recall: 0.939, f1: 0.901 },
  { section: 'rf', device_type: 'router', event: 'PACKET_DROP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.974, precision: 0.895, recall: 0.944, f1: 0.919 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-03:Gi0/1/0', anomaly_rate: 0.118, avg_if_score: 0.1114 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-02:Gi0/1/0', anomaly_rate: 0.11, avg_if_score: 0.1015 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-05:Gi0/2/0', anomaly_rate: 0.092, avg_if_score: 0.1054 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-01:Gi0/3/0', anomaly_rate: 0.07, avg_if_score: 0.121 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-05:Gi0/3/0', anomaly_rate: 0.062, avg_if_score: 0.109 },
  { section: 'pre_event', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: 'util_pct', normal_avg: 36.6, pre_event_avg: 64.5, delta_pct: 76.0, n_occurrences: 178 },
  { section: 'pre_event', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: 'queue_depth', normal_avg: 0.4, pre_event_avg: 18.5, delta_pct: 4774.0, n_occurrences: 178 },
  { section: 'pre_event', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: 'crc_errors', normal_avg: 0.1, pre_event_avg: 4.4, delta_pct: 4728.0, n_occurrences: 178 },
  { section: 'pre_event', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: 'latency_ms', normal_avg: 3.5, pre_event_avg: 17.0, delta_pct: 384.0, n_occurrences: 178 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'util_pct', normal_avg: 37.9, pre_event_avg: 70.5, delta_pct: 86.0, n_occurrences: 143 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'queue_depth', normal_avg: 1.3, pre_event_avg: 26.5, delta_pct: 1916.0, n_occurrences: 143 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'crc_errors', normal_avg: 0.3, pre_event_avg: 7.2, delta_pct: 2671.0, n_occurrences: 143 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'latency_ms', normal_avg: 4.2, pre_event_avg: 23.0, delta_pct: 442.0, n_occurrences: 143 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'cpu_pct', normal_avg: 26.5, pre_event_avg: 32.3, delta_pct: 22.0, n_occurrences: 143 },
  { section: 'pre_event', device_type: 'switch', event: 'LINK_DOWN', metric: 'util_pct', normal_avg: 42.9, pre_event_avg: 81.0, delta_pct: 89.0, n_occurrences: 2 },
  { section: 'pre_event', device_type: 'switch', event: 'LINK_DOWN', metric: 'queue_depth', normal_avg: 6.1, pre_event_avg: 46.4, delta_pct: 657.0, n_occurrences: 2 },
  { section: 'pre_event', device_type: 'switch', event: 'LINK_DOWN', metric: 'crc_errors', normal_avg: 2.1, pre_event_avg: 17.4, delta_pct: 746.0, n_occurrences: 2 },
  { section: 'pre_event', device_type: 'switch', event: 'LINK_DOWN', metric: 'latency_ms', normal_avg: 7.8, pre_event_avg: 37.3, delta_pct: 378.0, n_occurrences: 2 },
  { section: 'pre_event', device_type: 'switch', event: 'LINK_DOWN', metric: 'cpu_pct', normal_avg: 27.5, pre_event_avg: 36.3, delta_pct: 32.0, n_occurrences: 2 },
  { section: 'pre_event', device_type: 'switch', event: 'PACKET_DROP', metric: 'util_pct', normal_avg: 36.4, pre_event_avg: 65.1, delta_pct: 79.0, n_occurrences: 246 },
  { section: 'pre_event', device_type: 'switch', event: 'PACKET_DROP', metric: 'queue_depth', normal_avg: 0.2, pre_event_avg: 19.3, delta_pct: 9149.0, n_occurrences: 246 },
  { section: 'pre_event', device_type: 'switch', event: 'PACKET_DROP', metric: 'crc_errors', normal_avg: 0.1, pre_event_avg: 4.7, delta_pct: 8166.0, n_occurrences: 246 },
  { section: 'pre_event', device_type: 'switch', event: 'PACKET_DROP', metric: 'latency_ms', normal_avg: 3.4, pre_event_avg: 17.6, delta_pct: 418.0, n_occurrences: 246 },
  { section: 'rf', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.968, precision: 0.68, recall: 0.962, f1: 0.797 },
  { section: 'rf', device_type: 'switch', event: 'INTERFACE_FLAP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.987, precision: 0.833, recall: 0.93, f1: 0.879 },
  { section: 'rf', device_type: 'switch', event: 'PACKET_DROP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.983, precision: 0.84, recall: 0.986, f1: 0.907 },
  { section: 'anomaly', device_type: 'switch', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'switch-03:Eth1/2', anomaly_rate: 0.106, avg_if_score: 0.1156 },
  { section: 'anomaly', device_type: 'switch', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'switch-02:Eth1/1', anomaly_rate: 0.103, avg_if_score: 0.0982 },
  { section: 'anomaly', device_type: 'switch', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'switch-03:Eth1/1', anomaly_rate: 0.095, avg_if_score: 0.0976 },
  { section: 'anomaly', device_type: 'switch', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'switch-01:Eth1/1', anomaly_rate: 0.081, avg_if_score: 0.1056 },
  { section: 'anomaly', device_type: 'switch', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'switch-05:Eth1/3', anomaly_rate: 0.081, avg_if_score: 0.116 },
];

export const storedReports = [
  {
    id: 'report-20260317-183002',
    name: 'analytical_report_1710682800000.json',
    date: '2026-03-17 18:30:02',
    duration: '1 Month',
    dataPeriod: 'Device',
    windows: '8,156',
    status: 'completed',
    execTime: '68.4s'
  }
];

export const trainingJsonReport = {
  "device_types": [
    "router",
    "switch"
  ],
  "cross_correlation": {
    "router": {
      "util_pct->queue_depth": {
        "lag_polls": -2,
        "lag_min": -10,
        "pearson_r": 0.6833,
        "spearman_r": 0.6234
      },
      "util_pct->crc_errors": {
        "lag_polls": -3,
        "lag_min": -15,
        "pearson_r": 0.674,
        "spearman_r": 0.6421
      },
      "util_pct->latency_ms": {
        "lag_polls": -2,
        "lag_min": -10,
        "pearson_r": 0.6834,
        "spearman_r": 0.6212
      },
      "util_pct->cpu_pct": {
        "lag_polls": -1,
        "lag_min": -5,
        "pearson_r": 0.7133,
        "spearman_r": 0.6284
      }
    },
    "switch": {
      "util_pct->queue_depth": {
        "lag_polls": -1,
        "lag_min": -5,
        "pearson_r": 0.8218,
        "spearman_r": 0.7764
      },
      "util_pct->crc_errors": {
        "lag_polls": -2,
        "lag_min": -10,
        "pearson_r": 0.7701,
        "spearman_r": 0.7115
      }
    }
  },
  "granger": {
    "router": {
      "util_pct->queue_depth": {
        "f_stat": 63.1832,
        "p_value": 0.0,
        "significant": "True",
        "lag_min": 10
      },
      "util_pct->crc_errors": {
        "f_stat": 34.9341,
        "p_value": 0.0,
        "significant": "True",
        "lag_min": 20
      }
    },
    "switch": {
      "util_pct->queue_depth": {
        "f_stat": 88.8772,
        "p_value": 0.0,
        "significant": "True",
        "lag_min": 10
      }
    }
  }
};
