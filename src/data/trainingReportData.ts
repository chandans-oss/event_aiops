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
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'util_pct', normal_avg: 49.547, pre_event_avg: 84.14, delta_pct: 69.8, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'queue_depth', normal_avg: 1.76, pre_event_avg: 39.924, delta_pct: 2168.8, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'crc_errors', normal_avg: 0.307, pre_event_avg: 10.107, delta_pct: 3194.7, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'latency_ms', normal_avg: 7.758, pre_event_avg: 44, delta_pct: 467.2, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'cpu_pct', normal_avg: 43.42, pre_event_avg: 50.756, delta_pct: 16.9, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'mem_util_pct', normal_avg: 57.434, pre_event_avg: 58.521, delta_pct: 1.9, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'temp_c', normal_avg: 49.079, pre_event_avg: 49.574, delta_pct: 1, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'fan_speed_rpm', normal_avg: 3219.729, pre_event_avg: 3224.739, delta_pct: 0.2, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'power_supply_status', normal_avg: 1, pre_event_avg: 1, delta_pct: 0, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_LATENCY', metric: 'reboot_delta', normal_avg: 0, pre_event_avg: 0, delta_pct: 0, n_occurrences: 231 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'util_pct', normal_avg: 47.432, pre_event_avg: 77.546, delta_pct: 63.5, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'queue_depth', normal_avg: 0.078, pre_event_avg: 29.56, delta_pct: 37608.5, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'crc_errors', normal_avg: 0.054, pre_event_avg: 7.304, delta_pct: 13422, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'latency_ms', normal_avg: 6.161, pre_event_avg: 34.159, delta_pct: 454.4, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'cpu_pct', normal_avg: 43.174, pre_event_avg: 48.797, delta_pct: 13, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'mem_util_pct', normal_avg: 57.404, pre_event_avg: 58.272, delta_pct: 1.5, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'temp_c', normal_avg: 49.071, pre_event_avg: 49.451, delta_pct: 0.8, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'fan_speed_rpm', normal_avg: 3219.412, pre_event_avg: 3225.439, delta_pct: 0.2, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'power_supply_status', normal_avg: 1, pre_event_avg: 1, delta_pct: 0, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: 'reboot_delta', normal_avg: 0, pre_event_avg: 0, delta_pct: 0, n_occurrences: 532 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'util_pct', normal_avg: 49.728, pre_event_avg: 85.236, delta_pct: 71.4, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'queue_depth', normal_avg: 1.438, pre_event_avg: 42.191, delta_pct: 2833.1, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'crc_errors', normal_avg: 0.172, pre_event_avg: 10.902, delta_pct: 6225.1, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'latency_ms', normal_avg: 7.445, pre_event_avg: 46.18, delta_pct: 520.3, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'cpu_pct', normal_avg: 43.529, pre_event_avg: 51.26, delta_pct: 17.8, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'mem_util_pct', normal_avg: 57.447, pre_event_avg: 58.608, delta_pct: 2, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'temp_c', normal_avg: 49.092, pre_event_avg: 49.612, delta_pct: 1.1, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'fan_speed_rpm', normal_avg: 3220.105, pre_event_avg: 3226.069, delta_pct: 0.2, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'power_supply_status', normal_avg: 1, pre_event_avg: 1, delta_pct: 0, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'INTERFACE_FLAP', metric: 'reboot_delta', normal_avg: 0, pre_event_avg: 0, delta_pct: 0, n_occurrences: 277 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'util_pct', normal_avg: 48.032, pre_event_avg: 80.154, delta_pct: 66.9, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'queue_depth', normal_avg: 0.278, pre_event_avg: 33.309, delta_pct: 11902.6, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'crc_errors', normal_avg: 0.056, pre_event_avg: 8.216, delta_pct: 14634.7, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'latency_ms', normal_avg: 6.35, pre_event_avg: 37.703, delta_pct: 493.8, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'cpu_pct', normal_avg: 43.182, pre_event_avg: 49.699, delta_pct: 15.1, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'mem_util_pct', normal_avg: 57.4, pre_event_avg: 58.388, delta_pct: 1.7, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'temp_c', normal_avg: 49.071, pre_event_avg: 49.515, delta_pct: 0.9, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'fan_speed_rpm', normal_avg: 3219.601, pre_event_avg: 3226.489, delta_pct: 0.2, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'power_supply_status', normal_avg: 1, pre_event_avg: 1, delta_pct: 0, n_occurrences: 493 },
  { section: 'pre_event', device_type: 'router', event: 'PACKET_DROP', metric: 'reboot_delta', normal_avg: 0, pre_event_avg: 0, delta_pct: 0, n_occurrences: 493 },
  { section: 'rf', device_type: 'router', event: 'HIGH_LATENCY', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.962, precision: 0.7317, recall: 0.8696, f1: 0.7947 },
  { section: 'rf', device_type: 'router', event: 'HIGH_UTIL_WARNING', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.9583, precision: 0.8235, recall: 0.9722, f1: 0.8917 },
  { section: 'rf', device_type: 'router', event: 'INTERFACE_FLAP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.9669, precision: 0.7778, recall: 0.939, f1: 0.8508 },
  { section: 'rf', device_type: 'router', event: 'PACKET_DROP', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.9681, precision: 0.8621, recall: 0.9542, f1: 0.9058 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-03:Gi0/3/0', anomaly_rate: 0.1471, avg_if_score: 0.0867 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-02:Gi0/3/0', anomaly_rate: 0.0809, avg_if_score: 0.088 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-02:Gi0/1/0', anomaly_rate: 0.0733, avg_if_score: 0.0858 },
  { section: 'anomaly', device_type: 'router', event: '', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', entity_id: 'router-01:Gi0/1/0', anomaly_rate: 0.0699, avg_if_score: 0.0797 },
  // ... switch data follows same pattern
  { section: 'pre_event', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: 'util_pct', normal_avg: 36.539, pre_event_avg: 64.7, delta_pct: 77.1, n_occurrences: 207 },
  { section: 'pre_event', device_type: 'switch', event: 'INTERFACE_FLAP', metric: 'util_pct', normal_avg: 37.955, pre_event_avg: 71.37, delta_pct: 88, n_occurrences: 146 },
  { section: 'rf', device_type: 'switch', event: 'HIGH_UTIL_WARNING', metric: '', normal_avg: '', pre_event_avg: '', delta_pct: '', n_occurrences: '', accuracy: 0.9718, precision: 0.7467, recall: 0.9333, f1: 0.8296 },
];

export const trainingJsonReport = {
  "cross_correlation": {
    "router": {
      "util_pct->queue_depth": { "lag_polls": -1, "lag_min": -5, "pearson_r": 0.7516, "spearman_r": 0.7159 },
      "util_pct->crc_errors": { "lag_polls": -2, "lag_min": -10, "pearson_r": 0.7381, "spearman_r": 0.7158 },
      "queue_depth->latency_ms": { "lag_polls": 0, "lag_min": 0, "pearson_r": 0.9959, "spearman_r": 0.9933 }
    },
    "switch": {
      "util_pct->queue_depth": { "lag_polls": -1, "lag_min": -5, "pearson_r": 0.8942, "spearman_r": 0.8607 }
    }
  },
  "granger": {
    "router": {
      "util_pct->queue_depth": { "f_stat": 63.1832, "p_value": 0.0, "significant": "True" },
      "util_pct->latency_ms": { "f_stat": 54.7989, "p_value": 0.0, "significant": "True" }
    }
  }
};
