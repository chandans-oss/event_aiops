export interface ReportEvent {
  n: string;
  pos: number;
  rate: number;
  dev: boolean;
}

export interface MetricDelta {
  m: string;
  dpct: number;
  up: boolean;
  normal?: number;
  pre?: number;
}

export interface PreEventData {
  evt: string;
  n: number;
  windows: number;
  warn: string;
  metrics: MetricDelta[];
}

export interface ClusterData {
  n: string;
  size: number;
  total: number;
  noEvt: string;
  evt: string;
  c: string;
  centroids?: {
    util_pct: number;
    queue_depth: number;
    cpu_pct: number;
    mem_util_pct: number;
  };
}

export interface RFData {
  evt: string;
  skip?: boolean;
  reason?: string;
  pos?: string;
  acc?: number;
  prec?: number;
  rec?: number;
  f1?: number;
  feats?: [string, number][];
}

export interface SeqData {
  seq: string[];
  supp: number;
  conf: number;
}

export interface AnomData {
  e: string;
  rate: number;
  score: number;
  risk: string;
  metrics?: {
    cpu: number;
    mem: number;
    lat: number;
    qd: number;
    crc: number;
  };
}

export interface ChainStep {
  m: string;
  d: string;
  lag: string;
}

export interface ChainData {
  evt: string;
  n: number;
  steps: ChainStep[];
}

export interface LovelableReport {
  pipeline: string[];
  events: ReportEvent[];
  xcorrR: { a: string, b: string, r: number, s: number, lag: string, interp: string }[];
  xcorrS: { a: string, b: string, r: number, s: number, lag: string, interp: string }[];
  xcorrT: { a: string, b: string, r: number, s: number, lag: string, interp: string }[];
  grangerR: { c: string, e: string, f: number, p: string, lag: string }[];
  grangerS: { c: string, e: string, f: number, p: string, lag: string }[];
  grangerT: { c: string, e: string, f: number, p: string, lag: string }[];
  preEvtR: PreEventData[];
  preEvtS: PreEventData[];
  clR: ClusterData[];
  clS: ClusterData[];
  rfR: RFData[];
  rfS: RFData[];
  seqR: SeqData[];
  seqS: SeqData[];
  seqT: SeqData[];
  anomR: AnomData[];
  anomS: AnomData[];
  chainsR: ChainData[];
  chainsS: ChainData[];
  chainsT: ChainData[];
  coocR: { a: string, b: string, n: number, lift: number }[];
  coocS: { a: string, b: string, n: number, lift: number }[];
}

export const LOVELABLE_REPORT_DATA: LovelableReport = {
  pipeline: ['Data load', 'Resample', 'Dev merge', 'Data Prep', 'Time-Lag Correlation', 'Causal Correlation', 'Time-Series Analysis', 'Unsupervised Learning (Clustering)', 'Supervised ML (Classification)', 'Sequential Pattern Mining', 'Failure Chain Patterns', 'Unsupervised Learning (Anomaly Detection)', 'Save'],
  events: [
    { n: 'DEVICE_REBOOT', pos: 6, rate: 0.1, dev: true },
    { n: 'HIGH_LATENCY', pos: 343, rate: 4.2, dev: false },
    { n: 'HIGH_UTIL_WARNING', pos: 1017, rate: 12.5, dev: false },
    { n: 'INTERFACE_FLAP', pos: 630, rate: 7.7, dev: false },
    { n: 'LINK_DOWN', pos: 4, rate: 0.0, dev: true },
    { n: 'PACKET_DROP', pos: 986, rate: 12.1, dev: false },
  ],
  xcorrR: [
    { a: 'util_pct', b: 'queue_depth', r: 0.6833, s: 0.6234, lag: '-2 polls', interp: 'queue_depth LEADS util_pct by 10 min' },
    { a: 'util_pct', b: 'crc_errors', r: 0.6740, s: 0.6421, lag: '-3 polls', interp: 'crc_errors LEADS util_pct by 15 min' },
    { a: 'util_pct', b: 'latency_ms', r: 0.6834, s: 0.6212, lag: '-2 polls', interp: 'latency_ms LEADS util_pct by 10 min' },
    { a: 'util_pct', b: 'cpu_pct', r: 0.7133, s: 0.6284, lag: '-1 polls', interp: 'cpu_pct LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'mem_util_pct', r: 0.5183, s: 0.4726, lag: '-4 polls', interp: 'mem_util_pct LEADS util_pct by 20 min' },
    { a: 'util_pct', b: 'temp_c', r: 0.5098, s: 0.4634, lag: '-3 polls', interp: 'temp_c LEADS util_pct by 15 min' },
    { a: 'util_pct', b: 'fan_speed_rpm', r: 0.1691, s: 0.1795, lag: '-1 polls', interp: 'fan_speed_rpm LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'util_pct', b: 'reboot_delta', r: -0.1013, s: -0.1032, lag: '+11 polls', interp: 'util_pct LEADS reboot_delta by 55 min' },
    { a: 'queue_depth', b: 'crc_errors', r: 0.9319, s: 0.9284, lag: '-1 polls', interp: 'crc_errors LEADS queue_depth by 5 min' },
    { a: 'queue_depth', b: 'latency_ms', r: 0.9968, s: 0.9946, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'cpu_pct', r: 0.8502, s: 0.8221, lag: '+1 polls', interp: 'queue_depth LEADS cpu_pct by 5 min' },
    { a: 'queue_depth', b: 'mem_util_pct', r: 0.6660, s: 0.6472, lag: '-3 polls', interp: 'mem_util_pct LEADS queue_depth by 15 min' },
    { a: 'queue_depth', b: 'temp_c', r: 0.6257, s: 0.5967, lag: '-1 polls', interp: 'temp_c LEADS queue_depth by 5 min' },
    { a: 'queue_depth', b: 'fan_speed_rpm', r: 0.2024, s: 0.2125, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'reboot_delta', r: -0.0948, s: -0.0848, lag: '+9 polls', interp: 'queue_depth LEADS reboot_delta by 45 min' },
    { a: 'crc_errors', b: 'latency_ms', r: 0.9266, s: 0.9233, lag: '+1 polls', interp: 'crc_errors LEADS latency_ms by 5 min' },
    { a: 'crc_errors', b: 'cpu_pct', r: 0.7872, s: 0.7668, lag: '+2 polls', interp: 'crc_errors LEADS cpu_pct by 10 min' },
    { a: 'crc_errors', b: 'mem_util_pct', r: 0.5943, s: 0.5865, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'crc_errors', b: 'temp_c', r: 0.5656, s: 0.5387, lag: '+1 polls', interp: 'crc_errors LEADS temp_c by 5 min' },
    { a: 'crc_errors', b: 'fan_speed_rpm', r: 0.2177, s: 0.2210, lag: '+1 polls', interp: 'crc_errors LEADS fan_speed_rpm by 5 min' },
    { a: 'crc_errors', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'crc_errors', b: 'reboot_delta', r: 0.1007, s: 0.1307, lag: '-3 polls', interp: 'reboot_delta LEADS crc_errors by 15 min' },
    { a: 'latency_ms', b: 'cpu_pct', r: 0.8518, s: 0.8212, lag: '+1 polls', interp: 'latency_ms LEADS cpu_pct by 5 min' },
    { a: 'latency_ms', b: 'mem_util_pct', r: 0.6660, s: 0.6374, lag: '-2 polls', interp: 'mem_util_pct LEADS latency_ms by 10 min' },
    { a: 'latency_ms', b: 'temp_c', r: 0.6282, s: 0.5947, lag: '-1 polls', interp: 'temp_c LEADS latency_ms by 5 min' },
    { a: 'latency_ms', b: 'fan_speed_rpm', r: 0.1953, s: 0.2067, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'latency_ms', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'latency_ms', b: 'reboot_delta', r: -0.0962, s: -0.0911, lag: '+9 polls', interp: 'latency_ms LEADS reboot_delta by 45 min' },
    { a: 'cpu_pct', b: 'mem_util_pct', r: 0.6931, s: 0.6651, lag: '-4 polls', interp: 'mem_util_pct LEADS cpu_pct by 20 min' },
    { a: 'cpu_pct', b: 'temp_c', r: 0.6919, s: 0.6569, lag: '-1 polls', interp: 'temp_c LEADS cpu_pct by 5 min' },
    { a: 'cpu_pct', b: 'fan_speed_rpm', r: 0.1580, s: 0.1748, lag: '-2 polls', interp: 'fan_speed_rpm LEADS cpu_pct by 10 min' },
    { a: 'cpu_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'cpu_pct', b: 'reboot_delta', r: 0.1172, s: 0.0712, lag: '-15 polls', interp: 'reboot_delta LEADS cpu_pct by 75 min' },
    { a: 'mem_util_pct', b: 'temp_c', r: 0.5608, s: 0.5255, lag: '+2 polls', interp: 'mem_util_pct LEADS temp_c by 10 min' },
    { a: 'mem_util_pct', b: 'fan_speed_rpm', r: 0.1758, s: 0.1878, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'mem_util_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'mem_util_pct', b: 'reboot_delta', r: 0.1442, s: 0.1301, lag: '-14 polls', interp: 'reboot_delta LEADS mem_util_pct by 70 min' },
    { a: 'temp_c', b: 'fan_speed_rpm', r: 0.2585, s: 0.2519, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'temp_c', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'temp_c', b: 'reboot_delta', r: -0.1382, s: -0.1459, lag: '+15 polls', interp: 'temp_c LEADS reboot_delta by 75 min' },
    { a: 'fan_speed_rpm', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'fan_speed_rpm', b: 'reboot_delta', r: -0.1655, s: -0.0990, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'power_supply_status', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
  ],
  xcorrT: [
    { a: 'SW2:buffer_util', b: 'FW1:packet_loss', r: 0.865, s: 0.82, lag: '-4 polls', interp: 'buffer fills, packets drop 20min later' },
    { a: 'SW2:buffer_util', b: 'FW1:latency_ms', r: 0.860, s: 0.81, lag: '-2 polls', interp: 'buffer fills, latency rises 10min later' },
    { a: 'FW1:latency_ms', b: 'SW2:buffer_util', r: 0.794, s: 0.75, lag: '+0 polls', interp: 'Same-time correlation (feedback loop)' },
    { a: 'R1:cpu_pct', b: 'FW1:latency_ms', r: 0.809, s: 0.78, lag: '-7 polls', interp: 'router CPU spike → firewall latency 35min later' },
    { a: 'R1:cpu_pct', b: 'SW2:buffer_util', r: 0.775, s: 0.74, lag: '-5 polls', interp: 'CPU spike → buffer fills 25min later' },
    { a: 'SW1:crc_errors', b: 'FW1:latency_ms', r: 0.758, s: 0.72, lag: '-5 polls', interp: 'CRC errors at SW1 → latency at FW1 25min later' },
  ],
  xcorrS: [
    { a: 'util_pct', b: 'queue_depth', r: 0.8218, s: 0.7764, lag: '-1 polls', interp: 'queue_depth LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'crc_errors', r: 0.7701, s: 0.7115, lag: '-2 polls', interp: 'crc_errors LEADS util_pct by 10 min' },
    { a: 'util_pct', b: 'latency_ms', r: 0.8136, s: 0.7609, lag: '-1 polls', interp: 'latency_ms LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'cpu_pct', r: 0.7745, s: 0.7337, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'util_pct', b: 'mem_util_pct', r: 0.1789, s: 0.1639, lag: '+3 polls', interp: 'util_pct LEADS mem_util_pct by 15 min' },
    { a: 'util_pct', b: 'temp_c', r: 0.3306, s: 0.3076, lag: '-4 polls', interp: 'temp_c LEADS util_pct by 20 min' },
    { a: 'util_pct', b: 'fan_speed_rpm', r: -0.1051, s: -0.1133, lag: '+6 polls', interp: 'util_pct LEADS fan_speed_rpm by 30 min' },
    { a: 'util_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'util_pct', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'crc_errors', r: 0.9229, s: 0.9128, lag: '-1 polls', interp: 'crc_errors LEADS queue_depth by 5 min' },
    { a: 'queue_depth', b: 'latency_ms', r: 0.9970, s: 0.9946, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'cpu_pct', r: 0.8704, s: 0.8357, lag: '+1 polls', interp: 'queue_depth LEADS cpu_pct by 5 min' },
    { a: 'queue_depth', b: 'mem_util_pct', r: 0.1283, s: 0.1056, lag: '+4 polls', interp: 'queue_depth LEADS mem_util_pct by 20 min' },
    { a: 'queue_depth', b: 'temp_c', r: 0.4010, s: 0.4108, lag: '-3 polls', interp: 'temp_c LEADS queue_depth by 15 min' },
    { a: 'queue_depth', b: 'fan_speed_rpm', r: -0.1257, s: -0.1427, lag: '+7 polls', interp: 'queue_depth LEADS fan_speed_rpm by 35 min' },
    { a: 'queue_depth', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'crc_errors', b: 'latency_ms', r: 0.9212, s: 0.9060, lag: '+1 polls', interp: 'crc_errors LEADS latency_ms by 5 min' },
    { a: 'crc_errors', b: 'cpu_pct', r: 0.8009, s: 0.7577, lag: '+2 polls', interp: 'crc_errors LEADS cpu_pct by 10 min' },
    { a: 'crc_errors', b: 'mem_util_pct', r: 0.1470, s: 0.0952, lag: '-1 polls', interp: 'mem_util_pct LEADS crc_errors by 5 min' },
    { a: 'crc_errors', b: 'temp_c', r: 0.3676, s: 0.3779, lag: '-2 polls', interp: 'temp_c LEADS crc_errors by 10 min' },
    { a: 'crc_errors', b: 'fan_speed_rpm', r: -0.1020, s: -0.1376, lag: '+7 polls', interp: 'crc_errors LEADS fan_speed_rpm by 35 min' },
    { a: 'crc_errors', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'crc_errors', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'latency_ms', b: 'cpu_pct', r: 0.8704, s: 0.8384, lag: '+1 polls', interp: 'latency_ms LEADS cpu_pct by 5 min' },
    { a: 'latency_ms', b: 'mem_util_pct', r: 0.1279, s: 0.1025, lag: '+4 polls', interp: 'latency_ms LEADS mem_util_pct by 20 min' },
    { a: 'latency_ms', b: 'temp_c', r: 0.3990, s: 0.4092, lag: '-3 polls', interp: 'temp_c LEADS latency_ms by 15 min' },
    { a: 'latency_ms', b: 'fan_speed_rpm', r: -0.1125, s: -0.1271, lag: '+7 polls', interp: 'latency_ms LEADS fan_speed_rpm by 35 min' },
    { a: 'latency_ms', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'latency_ms', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'cpu_pct', b: 'mem_util_pct', r: 0.1257, s: 0.0909, lag: '+3 polls', interp: 'cpu_pct LEADS mem_util_pct by 15 min' },
    { a: 'cpu_pct', b: 'temp_c', r: 0.3849, s: 0.3678, lag: '-3 polls', interp: 'temp_c LEADS cpu_pct by 15 min' },
    { a: 'cpu_pct', b: 'fan_speed_rpm', r: -0.1166, s: -0.1075, lag: '+6 polls', interp: 'cpu_pct LEADS fan_speed_rpm by 30 min' },
    { a: 'cpu_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'cpu_pct', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'mem_util_pct', b: 'temp_c', r: 0.1501, s: 0.1332, lag: '-4 polls', interp: 'temp_c LEADS mem_util_pct by 20 min' },
    { a: 'mem_util_pct', b: 'fan_speed_rpm', r: -0.1811, s: -0.1548, lag: '-15 polls', interp: 'fan_speed_rpm LEADS mem_util_pct by 75 min' },
    { a: 'mem_util_pct', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'mem_util_pct', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'temp_c', b: 'fan_speed_rpm', r: -0.1075, s: -0.0689, lag: '-8 polls', interp: 'fan_speed_rpm LEADS temp_c by 40 min' },
    { a: 'temp_c', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'temp_c', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'fan_speed_rpm', b: 'power_supply_status', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'fan_speed_rpm', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'power_supply_status', b: 'reboot_delta', r: 0.0000, s: 0.0000, lag: '+0 polls', interp: 'simultaneous' },
  ],
  grangerR: [
    { c: 'queue_depth', e: 'crc_errors', f: 289.3, p: '<0.001', lag: '5 min' },
    { c: 'util_pct', e: 'queue_depth', f: 63.2, p: '<0.001', lag: '10 min' },
    { c: 'cpu_pct', e: 'temp_c', f: 99.3, p: '<0.001', lag: '5 min' },
    { c: 'latency_ms', e: 'temp_c', f: 70.2, p: '<0.001', lag: '5 min' },
    { c: 'util_pct', e: 'latency_ms', f: 54.8, p: '<0.001', lag: '10 min' },
    { c: 'cpu_pct', e: 'mem_util_pct', f: 61.4, p: '<0.001', lag: '5 min' },
    { c: 'mem_util_pct', e: 'power_supply_status', f: 745.6, p: '<0.001', lag: '15 min' },
    { c: 'crc_errors', e: 'power_supply_status', f: 221.7, p: '<0.001', lag: '5 min' },
  ],
  grangerS: [
    { c: 'crc_errors', e: 'power_supply_status', f: 3320.4, p: '<0.001', lag: '5 min' },
    { c: 'queue_depth', e: 'crc_errors', f: 329.3, p: '<0.001', lag: '5 min' },
    { c: 'queue_depth', e: 'power_supply_status', f: 221.7, p: '<0.001', lag: '5 min' },
    { c: 'latency_ms', e: 'power_supply_status', f: 174.0, p: '<0.001', lag: '5 min' },
    { c: 'mem_util_pct', e: 'power_supply_status', f: 116.9, p: '<0.001', lag: '15 min' },
    { c: 'util_pct', e: 'queue_depth', f: 88.2, p: '<0.001', lag: '5 min' },
    { c: 'util_pct', e: 'latency_ms', f: 88.8, p: '<0.001', lag: '5 min' },
    { c: 'fan_speed_rpm', e: 'reboot_delta', f: 3.0, p: '0.011', lag: '25 min' },
  ],
  grangerT: [
    { c: 'FW1:latency_ms', e: 'SW2:buffer_util', f: 95.4, p: '<0.001', lag: '5 min' },
    { c: 'SW1:crc_errors', e: 'R1:cpu_pct', f: 40.6, p: '<0.001', lag: '10 min' },
    { c: 'SW2:buffer_util', e: 'R1:cpu_pct', f: 39.2, p: '<0.001', lag: '10 min' },
  ],
  preEvtR: [
    {
      evt: 'HIGH_LATENCY', n: 231, windows: 343, warn: '75 min', metrics: [
        { m: 'crc_errors', normal: 0.1, pre: 3.3, dpct: 3195, up: true }, { m: 'queue_depth', normal: 0.2, pre: 4.5, dpct: 2169, up: true },
        { m: 'latency_ms', normal: 10, pre: 56.7, dpct: 467, up: true }, { m: 'util_pct', normal: 40, pre: 68, dpct: 70, up: true },
        { m: 'cpu_pct', normal: 25, pre: 29.2, dpct: 17, up: true }, { m: 'mem_util_pct', normal: 55, pre: 56.1, dpct: 2, up: true },
      ]
    },
    {
      evt: 'HIGH_UTIL_WARNING', n: 178, windows: 343, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 36.6, pre: 64.5, dpct: 76, up: true },
        { m: 'queue_depth', normal: 0.4, pre: 18.5, dpct: 4774, up: true },
        { m: 'crc_errors', normal: 0.1, pre: 4.4, dpct: 4728, up: true },
        { m: 'latency_ms', normal: 3.5, pre: 17.0, dpct: 384, up: true },
      ]
    },
    {
      evt: 'INTERFACE_FLAP', n: 143, windows: 222, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 37.9, pre: 70.5, dpct: 86, up: true },
        { m: 'queue_depth', normal: 1.3, pre: 26.5, dpct: 1916, up: true },
        { m: 'crc_errors', normal: 0.3, pre: 7.2, dpct: 2671, up: true },
        { m: 'latency_ms', normal: 4.2, pre: 23.0, dpct: 442, up: true },
        { m: 'cpu_pct', normal: 26.5, pre: 32.3, dpct: 22, up: true },
      ]
    },
    {
      evt: 'PACKET_DROP', n: 246, windows: 329, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 36.4, pre: 65.1, dpct: 79, up: true },
        { m: 'queue_depth', normal: 0.2, pre: 19.3, dpct: 9149, up: true },
        { m: 'crc_errors', normal: 0.1, pre: 4.7, dpct: 8166, up: true },
        { m: 'latency_ms', normal: 3.4, pre: 17.6, dpct: 418, up: true },
      ]
    },
  ],
  preEvtS: [
    {
      evt: 'HIGH_UTIL_WARNING', n: 178, windows: 343, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 36.6, pre: 64.5, dpct: 76, up: true },
        { m: 'queue_depth', normal: 0.4, pre: 18.5, dpct: 4774, up: true },
        { m: 'crc_errors', normal: 0.1, pre: 4.4, dpct: 4728, up: true },
        { m: 'latency_ms', normal: 3.5, pre: 17.0, dpct: 384, up: true },
      ]
    },
    {
      evt: 'INTERFACE_FLAP', n: 143, windows: 222, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 37.9, pre: 70.5, dpct: 86, up: true },
        { m: 'queue_depth', normal: 1.3, pre: 26.5, dpct: 1916, up: true },
        { m: 'crc_errors', normal: 0.3, pre: 7.2, dpct: 2671, up: true },
        { m: 'latency_ms', normal: 4.2, pre: 23.0, dpct: 442, up: true },
        { m: 'cpu_pct', normal: 26.5, pre: 32.3, dpct: 22, up: true },
      ]
    },
    {
      evt: 'LINK_DOWN', n: 2, windows: 5, warn: '15 min', metrics: [
        { m: 'util_pct', normal: 42.9, pre: 81.0, dpct: 89, up: true },
        { m: 'queue_depth', normal: 6.1, pre: 46.4, dpct: 657, up: true },
        { m: 'crc_errors', normal: 2.1, pre: 17.4, dpct: 746, up: true },
        { m: 'latency_ms', normal: 7.8, pre: 37.3, dpct: 378, up: true },
        { m: 'cpu_pct', normal: 27.5, pre: 36.3, dpct: 32, up: true },
      ]
    },
    {
      evt: 'PACKET_DROP', n: 246, windows: 329, warn: '75 min', metrics: [
        { m: 'util_pct', normal: 36.4, pre: 65.1, dpct: 79, up: true },
        { m: 'queue_depth', normal: 0.2, pre: 19.3, dpct: 9149, up: true },
        { m: 'crc_errors', normal: 0.1, pre: 4.7, dpct: 8166, up: true },
        { m: 'latency_ms', normal: 3.4, pre: 17.6, dpct: 418, up: true },
      ]
    },
  ],
  clR: [
    { n: 'Stable Baseline', size: 678, total: 4079, noEvt: '6%', evt: 'PACKET_DROP: 82% | HIGH_UTIL_WARNING: 75% | INTERFACE_FLAP: 60%', c: '#EF4444', centroids: { util_pct: 82.0, queue_depth: 55.4, cpu_pct: 54.0, mem_util_pct: 59.4 } },
    { n: 'Gradual Rise', size: 614, total: 4079, noEvt: '91%', evt: 'HIGH_UTIL_WARNING: 9% | PACKET_DROP: 5% | HIGH_LATENCY: 0%', c: '#3B82F6', centroids: { util_pct: 18.2, queue_depth: 8.8, cpu_pct: 41.9, mem_util_pct: 57.5 } },
    { n: 'Congestion Buildup', size: 1556, total: 4079, noEvt: '94%', evt: 'HIGH_UTIL_WARNING: 6% | PACKET_DROP: 3% | INTERFACE_FLAP: 0%', c: '#F59E0B', centroids: { util_pct: 45.1, queue_depth: 35.7, cpu_pct: 47.9, mem_util_pct: 58.4 } },
    { n: 'Spike/Recovery', size: 1231, total: 4079, noEvt: '95%', evt: 'HIGH_UTIL_WARNING: 5% | PACKET_DROP: 2% | HIGH_LATENCY: 0%', c: '#8B5CF6', centroids: { util_pct: 72.9, queue_depth: 12.1, cpu_pct: 38.7, mem_util_pct: 56.4 } },
  ],
  clS: [
    { n: 'Stable Baseline', size: 1310, total: 4077, noEvt: '98%', evt: 'HIGH_UTIL_WARNING: 2% | PACKET_DROP: 1%', c: '#10B981', centroids: { util_pct: 42.3, queue_depth: 2.8, cpu_pct: 29.1, mem_util_pct: 45.4 } },
    { n: 'Gradual Rise', size: 1693, total: 4077, noEvt: '100%', evt: 'DEVICE_REBOOT: 0% | PACKET_DROP: 0%', c: '#3B82F6', centroids: { util_pct: 36.9, queue_depth: 0.6, cpu_pct: 24.3, mem_util_pct: 45.0 } },
    { n: 'Congestion Buildup', size: 626, total: 4077, noEvt: '98%', evt: 'HIGH_UTIL_WARNING: 2% | PACKET_DROP: 1% | INTERFACE_FLAP: 0%', c: '#F59E0B', centroids: { util_pct: 38.1, queue_depth: 1.3, cpu_pct: 27.2, mem_util_pct: 45.3 } },
    { n: 'Spike/Recovery', size: 448, total: 4077, noEvt: '14%', evt: 'PACKET_DROP: 69% | HIGH_UTIL_WARNING: 58% | INTERFACE_FLAP: 49%', c: '#EF4444', centroids: { util_pct: 75.0, queue_depth: 47.4, cpu_pct: 34.0, mem_util_pct: 45.7 } },
  ],
  rfR: [
    { evt: 'DEVICE_REBOOT', skip: true, reason: 'rate 0.1%' },
    { evt: 'HIGH_LATENCY', pos: '8.4%', acc: 0.962, prec: 0.732, rec: 0.870, f1: 0.795, feats: [['latency_ms_last', 0.152], ['queue_depth_last', 0.148], ['crc_errors_last', 0.102]] },
    { evt: 'HIGH_UTIL_WARNING', pos: '17.6%', acc: 0.958, prec: 0.824, rec: 0.972, f1: 0.892, feats: [['util_pct_last', 0.173], ['latency_ms_last', 0.130], ['queue_depth_last', 0.126]] },
    { evt: 'INTERFACE_FLAP', pos: '10.0%', acc: 0.967, prec: 0.778, rec: 0.939, f1: 0.851, feats: [['crc_errors_last', 0.146], ['latency_ms_last', 0.120], ['queue_depth_last', 0.111]] },
    { evt: 'LINK_DOWN', skip: true, reason: 'rate 0.0%' },
    { evt: 'PACKET_DROP', pos: '16.1%', acc: 0.968, prec: 0.862, rec: 0.954, f1: 0.906, feats: [['latency_ms_last', 0.151], ['queue_depth_last', 0.138], ['util_pct_last', 0.119]] },
  ],
  rfS: [
    { evt: 'DEVICE_REBOOT', skip: true, reason: 'rate 0.1%' },
    { evt: 'HIGH_LATENCY', skip: true, reason: 'rate 0.0%' },
    { evt: 'HIGH_UTIL_WARNING', pos: '7.3%', acc: 0.972, prec: 0.747, rec: 0.933, f1: 0.830, feats: [['util_pct_last', 0.179], ['queue_depth_last', 0.125], ['latency_ms_last', 0.117]] },
    { evt: 'INTERFACE_FLAP', pos: '5.4%', acc: 0.978, prec: 0.741, rec: 0.909, f1: 0.816, feats: [['crc_errors_last', 0.167], ['queue_depth_last', 0.109], ['latency_ms_last', 0.099]] },
    { evt: 'LINK_DOWN', skip: true, reason: 'rate 0.1%' },
    { evt: 'PACKET_DROP', pos: '8.1%', acc: 0.980, prec: 0.821, rec: 0.970, f1: 0.889, feats: [['queue_depth_last', 0.154], ['latency_ms_last', 0.152], ['crc_errors_last', 0.115]] },
  ],
  seqR: [
    { seq: ['R1 (High Util)', 'R1 (Packet Drop)', 'R1 (Interface Flap)'], supp: 28, conf: 1.00 },
    { seq: ['R1 (High Util)', 'R1 (Queue Buildup)', 'S1 (Packet Drop)', 'S1 (Latency High)', 'App1 (Response Slow)'], supp: 42, conf: 0.98 },
    { seq: ['R1 (Config Change)', 'R2 (Peer Down)', 'S1 (Latency High)'], supp: 35, conf: 0.92 },
  ],
  seqS: [
    { seq: ['R1 (High Util)', 'R1 (Packet Drop)', 'R1 (Interface Flap)'], supp: 24, conf: 0.89 },
    { seq: ['R1 (Packet Drop)', 'R1 (High Util)', 'R1 (Interface Flap)'], supp: 8, conf: 0.80 },
  ],
  seqT: [
    { seq: ['R1 (High Util)', 'R1 (Packet Drop)', 'R1 (Interface Flap)'], supp: 28, conf: 1.00 },
    { seq: ['R1 (High Util)', 'R1 (Queue Buildup)', 'S1 (Packet Drop)', 'S1 (Latency High)', 'App1 (Response Slow)'], supp: 42, conf: 0.98 },
    { seq: ['R1 (Config Change)', 'R2 (Peer Down)', 'S1 (Latency High)'], supp: 35, conf: 0.92 },
  ],
  anomR: [
    { e: 'router-03:Gi0/3/0', rate: 14.7, score: 0.0867, risk: 'MED', metrics: { cpu: 8.2, mem: 4.1, lat: 12.5, qd: 14.7, crc: 3.2 } },
    { e: 'router-02:Gi0/3/0', rate: 8.1, score: 0.0880, risk: 'MED', metrics: { cpu: 7.1, mem: 3.5, lat: 6.2, qd: 8.1, crc: 2.1 } },
    { e: 'router-02:Gi0/1/0', rate: 7.3, score: 0.0858, risk: 'MED', metrics: { cpu: 6.5, mem: 3.2, lat: 5.8, qd: 7.3, crc: 1.8 } },
    { e: 'router-01:Gi0/1/0', rate: 7.0, score: 0.0797, risk: 'low', metrics: { cpu: 5.2, mem: 2.8, lat: 4.5, qd: 7.0, crc: 1.5 } },
    { e: 'router-05:Gi0/2/0', rate: 6.6, score: 0.0814, risk: 'low', metrics: { cpu: 4.8, mem: 2.5, lat: 4.1, qd: 6.6, crc: 1.2 } },
    { e: 'router-02:Gi0/2/0', rate: 5.5, score: 0.0854, risk: 'low', metrics: { cpu: 4.1, mem: 2.1, lat: 3.8, qd: 5.5, crc: 1.1 } },
    { e: 'router-03:Gi0/1/0', rate: 5.5, score: 0.0999, risk: 'low', metrics: { cpu: 3.8, mem: 2.0, lat: 3.5, qd: 5.5, crc: 1.0 } },
    { e: 'router-04:Gi0/1/0', rate: 3.3, score: 0.1106, risk: 'low', metrics: { cpu: 2.5, mem: 1.5, lat: 2.2, qd: 3.3, crc: 0.8 } },
  ],
  anomS: [
    { e: 'switch-03:Eth1/3', rate: 11.0, score: 0.1008, risk: 'MED', metrics: { cpu: 6.2, mem: 5.8, lat: 9.1, qd: 11.0, crc: 4.5 } },
    { e: 'switch-02:Eth1/1', rate: 10.7, score: 0.1092, risk: 'MED', metrics: { cpu: 5.8, mem: 5.5, lat: 8.8, qd: 10.7, crc: 4.2 } },
    { e: 'switch-01:Eth1/2', rate: 10.0, score: 0.1182, risk: 'MED', metrics: { cpu: 5.5, mem: 5.2, lat: 8.5, qd: 10.0, crc: 3.8 } },
    { e: 'switch-04:Eth1/1', rate: 8.5, score: 0.1175, risk: 'MED', metrics: { cpu: 4.8, mem: 4.5, lat: 7.2, qd: 8.5, crc: 3.2 } },
    { e: 'switch-04:Eth1/2', rate: 7.7, score: 0.1152, risk: 'MED', metrics: { cpu: 4.1, mem: 4.1, lat: 6.5, qd: 7.7, crc: 2.8 } },
    { e: 'switch-01:Eth1/1', rate: 6.3, score: 0.0987, risk: 'low', metrics: { cpu: 3.2, mem: 3.5, lat: 5.2, qd: 6.3, crc: 2.1 } },
    { e: 'switch-04:Eth1/3', rate: 5.5, score: 0.1144, risk: 'low', metrics: { cpu: 2.8, mem: 3.1, lat: 4.5, qd: 5.5, crc: 1.8 } },
  ],
  chainsR: [
    { evt: 'High Latency', n: 420, steps: [{ m: 'R1:CPU Util', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Buffer Util', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
    { evt: 'Packet Drop', n: 385, steps: [{ m: 'R1:Buffer Util', d: '↑', lag: '5m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Latency Ms', d: '↑', lag: '5m' }, { m: 'Fw1:Packet Drop', d: '↑', lag: '5m' }] },
    { evt: 'High Latency', n: 310, steps: [{ m: 'R2:Config Change', d: '↑', lag: '5m' }, { m: 'R2:Peer Down', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
  ],
  chainsS: [
    { evt: 'High Latency', n: 420, steps: [{ m: 'R1:CPU Util', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Buffer Util', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
    { evt: 'Packet Drop', n: 385, steps: [{ m: 'R1:Buffer Util', d: '↑', lag: '5m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Latency Ms', d: '↑', lag: '5m' }, { m: 'Fw1:Packet Drop', d: '↑', lag: '5m' }] },
    { evt: 'High Latency', n: 310, steps: [{ m: 'R2:Config Change', d: '↑', lag: '5m' }, { m: 'R2:Peer Down', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
  ],
  chainsT: [
    { evt: 'High Latency', n: 420, steps: [{ m: 'R1:CPU Util', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Buffer Util', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
    { evt: 'Packet Drop', n: 385, steps: [{ m: 'R1:Buffer Util', d: '↑', lag: '5m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Sw2:Latency Ms', d: '↑', lag: '5m' }, { m: 'Fw1:Packet Drop', d: '↑', lag: '5m' }] },
    { evt: 'High Latency', n: 310, steps: [{ m: 'R2:Config Change', d: '↑', lag: '5m' }, { m: 'R2:Peer Down', d: '↑', lag: '10m' }, { m: 'Sw1:Crc Errors', d: '↑', lag: '10m' }, { m: 'Fw1:Latency Ms', d: '↑', lag: '10m' }] },
  ],
  coocR: [
    { a: 'HIGH_LATENCY', b: 'INTERFACE_FLAP', n: 29, lift: 1.03 },
    { a: 'HIGH_LATENCY', b: 'PACKET_DROP', n: 29, lift: 1.03 },
    { a: 'INTERFACE_FLAP', b: 'PACKET_DROP', n: 31, lift: 1.03 },
    { a: 'HIGH_LATENCY', b: 'HIGH_UTIL_WARNING', n: 29, lift: 1.00 },
    { a: 'HIGH_UTIL_WARNING', b: 'INTERFACE_FLAP', n: 31, lift: 1.00 },
    { a: 'HIGH_UTIL_WARNING', b: 'PACKET_DROP', n: 31, lift: 1.00 },
  ],
  coocS: [
    { a: 'INTERFACE_FLAP', b: 'LINK_DOWN', n: 2, lift: 1.20 },
    { a: 'INTERFACE_FLAP', b: 'PACKET_DROP', n: 35, lift: 1.02 },
    { a: 'LINK_DOWN', b: 'PACKET_DROP', n: 2, lift: 1.02 },
    { a: 'HIGH_UTIL_WARNING', b: 'INTERFACE_FLAP', n: 35, lift: 1.00 },
    { a: 'HIGH_UTIL_WARNING', b: 'LINK_DOWN', n: 2, lift: 1.00 },
    { a: 'HIGH_UTIL_WARNING', b: 'PACKET_DROP', n: 41, lift: 1.00 },
  ],
};

export const SCOPE_TARGETS = {
  device: [
    { label: 'Router Core 01', sub: 'Router' },
    { label: 'Router Core 02', sub: 'Router' },
    { label: 'Router Edge 01', sub: 'Router' },
    { label: 'Switch Dist 01', sub: 'Switch' },
    { label: 'Switch Dist 02', sub: 'Switch' },
    { label: 'Switch Access 01', sub: 'Switch' },
    { label: 'Switch Access 02', sub: 'Switch' },
  ],
  topology: [
    { label: 'DC East', sub: 'Data Center' },
    { label: 'DC West', sub: 'Data Center' },
    { label: 'Campus HQ', sub: 'Campus' },
    { label: 'Branch North', sub: 'Branch' },
    { label: 'WAN Backbone', sub: 'WAN' },
  ],
  group: [
    { label: 'Premium Devices', sub: '3 Routers, 4 Switches' },
    { label: 'Site 001 [HQ Gen]', sub: '2 Routers, 2 Switches' },
    { label: 'DC Cluster A', sub: '5 Routers, 12 Switches' },
    { label: 'Site 002 [Branch]', sub: '1 Router, 4 Switches' },
    { label: 'Legacy Infrastructure', sub: '2 Routers, 15 Switches' },
  ],
};
