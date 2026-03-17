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
}

export interface ChainStep {
  m: string;
  d: string;
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
  grangerR: { c: string, e: string, f: number, p: string, lag: string }[];
  grangerS: { c: string, e: string, f: number, p: string, lag: string }[];
  preEvtR: PreEventData[];
  preEvtS: PreEventData[];
  clR: ClusterData[];
  clS: ClusterData[];
  rfR: RFData[];
  rfS: RFData[];
  seqR: SeqData[];
  seqS: SeqData[];
  anomR: AnomData[];
  anomS: AnomData[];
  chainsR: ChainData[];
  chainsS: ChainData[];
}

export const LOVELABLE_REPORT_DATA: LovelableReport = {
  pipeline: ['Data load', 'Resample', 'Dev merge', 'Data', 'Cross Correlation', 'Granger Causality', 'Pre-event', 'K-means', 'Random Forest', 'Sequences', 'Chains', 'Isolation Forest', 'Save'],
  events: [
    { n: 'DEVICE_REBOOT', pos: 6, rate: 0.1, dev: true },
    { n: 'HIGH_LATENCY', pos: 343, rate: 4.2, dev: false },
    { n: 'HIGH_UTIL_WARNING', pos: 1017, rate: 12.5, dev: false },
    { n: 'INTERFACE_FLAP', pos: 630, rate: 7.7, dev: false },
    { n: 'LINK_DOWN', pos: 4, rate: 0.0, dev: true },
    { n: 'PACKET_DROP', pos: 986, rate: 12.1, dev: false },
  ],
  xcorrR: [
    { a: 'util_pct', b: 'queue_depth', r: 0.7516, s: 0.7159, lag: '-1 polls', interp: 'queue_depth LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'crc_errors', r: 0.7381, s: 0.7158, lag: '-2 polls', interp: 'crc_errors LEADS util_pct by 10 min' },
    { a: 'util_pct', b: 'latency_ms', r: 0.7530, s: 0.7235, lag: '-1 polls', interp: 'latency_ms LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'cpu_pct', r: 0.7830, s: 0.7541, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'latency_ms', r: 0.9959, s: 0.9933, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'crc_errors', r: 0.9432, s: 0.9442, lag: '-1 polls', interp: 'crc_errors LEADS queue_depth by 5 min' },
    { a: 'queue_depth', b: 'cpu_pct', r: 0.8546, s: 0.8052, lag: '+1 polls', interp: 'queue_depth LEADS cpu_pct by 5 min' },
    { a: 'crc_errors', b: 'latency_ms', r: 0.9399, s: 0.9398, lag: '+1 polls', interp: 'crc_errors LEADS latency_ms by 5 min' },
  ],
  xcorrS: [
    { a: 'util_pct', b: 'queue_depth', r: 0.8942, s: 0.8607, lag: '-1 polls', interp: 'queue_depth LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'crc_errors', r: 0.8482, s: 0.8252, lag: '-2 polls', interp: 'crc_errors LEADS util_pct by 10 min' },
    { a: 'util_pct', b: 'latency_ms', r: 0.8906, s: 0.8589, lag: '-1 polls', interp: 'latency_ms LEADS util_pct by 5 min' },
    { a: 'util_pct', b: 'cpu_pct', r: 0.8324, s: 0.8224, lag: '-1 polls', interp: 'cpu_pct LEADS util_pct by 5 min' },
    { a: 'queue_depth', b: 'latency_ms', r: 0.9976, s: 0.9945, lag: '+0 polls', interp: 'simultaneous' },
    { a: 'queue_depth', b: 'crc_errors', r: 0.9456, s: 0.9531, lag: '-1 polls', interp: 'crc_errors LEADS queue_depth by 5 min' },
    { a: 'crc_errors', b: 'latency_ms', r: 0.9448, s: 0.9529, lag: '+1 polls', interp: 'crc_errors LEADS latency_ms by 5 min' },
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
  preEvtR: [
    {
      evt: 'HIGH_LATENCY', n: 231, windows: 343, warn: '75 min', metrics: [
        { m: 'crc_errors', dpct: 3195, up: true }, { m: 'queue_depth', dpct: 2169, up: true },
        { m: 'latency_ms', dpct: 467, up: true }, { m: 'util_pct', dpct: 70, up: true },
        { m: 'cpu_pct', dpct: 17, up: true }, { m: 'mem_util_pct', dpct: 2, up: true },
      ]
    },
    {
      evt: 'HIGH_UTIL_WARNING', n: 532, windows: 719, warn: '75 min', metrics: [
        { m: 'queue_depth', dpct: 37608, up: true }, { m: 'crc_errors', dpct: 13422, up: true },
        { m: 'latency_ms', dpct: 454, up: true }, { m: 'util_pct', dpct: 64, up: true },
        { m: 'cpu_pct', dpct: 13, up: true }, { m: 'mem_util_pct', dpct: 2, up: true },
      ]
    },
    {
      evt: 'INTERFACE_FLAP', n: 277, windows: 408, warn: '75 min', metrics: [
        { m: 'crc_errors', dpct: 6225, up: true }, { m: 'queue_depth', dpct: 2833, up: true },
        { m: 'latency_ms', dpct: 520, up: true }, { m: 'util_pct', dpct: 71, up: true },
        { m: 'cpu_pct', dpct: 18, up: true }, { m: 'mem_util_pct', dpct: 2, up: true },
      ]
    },
    {
      evt: 'PACKET_DROP', n: 493, windows: 657, warn: '75 min', metrics: [
        { m: 'queue_depth', dpct: 11903, up: true }, { m: 'crc_errors', dpct: 14635, up: true },
        { m: 'latency_ms', dpct: 494, up: true }, { m: 'util_pct', dpct: 67, up: true },
        { m: 'cpu_pct', dpct: 15, up: true }, { m: 'mem_util_pct', dpct: 2, up: true },
      ]
    },
  ],
  preEvtS: [
    {
      evt: 'DEVICE_REBOOT', n: 2, windows: 6, warn: '5 min', metrics: [
        { m: 'queue_depth', dpct: -100, up: false }, { m: 'crc_errors', dpct: -98, up: false },
        { m: 'latency_ms', dpct: -62, up: false }, { m: 'util_pct', dpct: -22, up: false },
        { m: 'cpu_pct', dpct: -16, up: false }, { m: 'mem_util_pct', dpct: -1, up: false },
      ]
    },
    {
      evt: 'HIGH_UTIL_WARNING', n: 207, windows: 298, warn: '75 min', metrics: [
        { m: 'queue_depth', dpct: 5799, up: true }, { m: 'crc_errors', dpct: 5770, up: true },
        { m: 'latency_ms', dpct: 397, up: true }, { m: 'util_pct', dpct: 77, up: true },
        { m: 'cpu_pct', dpct: 19, up: true }, { m: 'reboot_delta', dpct: 0, up: false },
      ]
    },
    {
      evt: 'INTERFACE_FLAP', n: 146, windows: 222, warn: '75 min', metrics: [
        { m: 'crc_errors', dpct: 2879, up: true }, { m: 'queue_depth', dpct: 2058, up: true },
        { m: 'latency_ms', dpct: 469, up: true }, { m: 'util_pct', dpct: 88, up: true },
        { m: 'cpu_pct', dpct: 23, up: true }, { m: 'reboot_delta', dpct: 0, up: false },
      ]
    },
    {
      evt: 'PACKET_DROP', n: 239, windows: 329, warn: '75 min', metrics: [
        { m: 'queue_depth', dpct: 3157, up: true }, { m: 'crc_errors', dpct: 3317, up: true },
        { m: 'latency_ms', dpct: 408, up: true }, { m: 'util_pct', dpct: 79, up: true },
        { m: 'cpu_pct', dpct: 19, up: true }, { m: 'reboot_delta', dpct: 0, up: false },
      ]
    },
  ],
  clR: [
    { n: 'Stable Baseline', size: 678, total: 4079, noEvt: '6%', evt: 'PACKET_DROP: 82% | HIGH_UTIL_WARNING: 75% | INTERFACE_FLAP: 60%', c: '#EF4444', centroids: { util_pct: 89.0, queue_depth: 60.4, cpu_pct: 54.0, mem_util_pct: 59.4 } },
    { n: 'Gradual Rise', size: 614, total: 4079, noEvt: '91%', evt: 'HIGH_UTIL_WARNING: 9% | PACKET_DROP: 5% | HIGH_LATENCY: 0%', c: '#3B82F6', centroids: { util_pct: 49.2, queue_depth: 3.8, cpu_pct: 41.9, mem_util_pct: 57.5 } },
    { n: 'Congestion Buildup', size: 1556, total: 4079, noEvt: '94%', evt: 'HIGH_UTIL_WARNING: 6% | PACKET_DROP: 3% | INTERFACE_FLAP: 0%', c: '#F59E0B', centroids: { util_pct: 51.1, queue_depth: 2.7, cpu_pct: 47.9, mem_util_pct: 58.4 } },
    { n: 'Spike/Recovery', size: 1231, total: 4079, noEvt: '95%', evt: 'HIGH_UTIL_WARNING: 5% | PACKET_DROP: 2% | HIGH_LATENCY: 0%', c: '#8B5CF6', centroids: { util_pct: 50.9, queue_depth: 2.1, cpu_pct: 38.7, mem_util_pct: 56.4 } },
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
    { seq: ['HIGH_UTIL_WARNING', 'PACKET_DROP', 'INTERFACE_FLAP'], supp: 28, conf: 1.00 },
    { seq: ['HIGH_UTIL_WARNING', 'PACKET_DROP', 'HIGH_LATENCY'], supp: 26, conf: 0.93 },
    { seq: ['HIGH_UTIL_WARNING', 'HIGH_LATENCY', 'INTERFACE_FLAP'], supp: 21, conf: 0.72 },
    { seq: ['PACKET_DROP', 'HIGH_LATENCY', 'INTERFACE_FLAP'], supp: 20, conf: 0.71 },
    { seq: ['PACKET_DROP', 'HIGH_UTIL_WARNING', 'INTERFACE_FLAP'], supp: 3, conf: 1.00 },
  ],
  seqS: [
    { seq: ['HIGH_UTIL_WARNING', 'PACKET_DROP', 'INTERFACE_FLAP'], supp: 24, conf: 0.89 },
    { seq: ['PACKET_DROP', 'HIGH_UTIL_WARNING', 'INTERFACE_FLAP'], supp: 8, conf: 0.80 },
    { seq: ['HIGH_UTIL_WARNING', 'INTERFACE_FLAP', 'LINK_DOWN'], supp: 2, conf: 0.06 },
    { seq: ['PACKET_DROP', 'INTERFACE_FLAP', 'LINK_DOWN'], supp: 2, conf: 0.06 },
  ],
  anomR: [
    { e: 'router-03:Gi0/3/0', rate: 14.7, score: 0.0867, risk: 'MED' },
    { e: 'router-02:Gi0/3/0', rate: 8.1, score: 0.0880, risk: 'MED' },
    { e: 'router-02:Gi0/1/0', rate: 7.3, score: 0.0858, risk: 'MED' },
    { e: 'router-01:Gi0/1/0', rate: 7.0, score: 0.0797, risk: 'low' },
    { e: 'router-05:Gi0/2/0', rate: 6.6, score: 0.0814, risk: 'low' },
    { e: 'router-02:Gi0/2/0', rate: 5.5, score: 0.0854, risk: 'low' },
    { e: 'router-03:Gi0/1/0', rate: 5.5, score: 0.0999, risk: 'low' },
    { e: 'router-04:Gi0/1/0', rate: 3.3, score: 0.1106, risk: 'low' },
  ],
  anomS: [
    { e: 'switch-03:Eth1/3', rate: 11.0, score: 0.1008, risk: 'MED' },
    { e: 'switch-02:Eth1/1', rate: 10.7, score: 0.1092, risk: 'MED' },
    { e: 'switch-01:Eth1/2', rate: 10.0, score: 0.1182, risk: 'MED' },
    { e: 'switch-04:Eth1/1', rate: 8.5, score: 0.1175, risk: 'MED' },
    { e: 'switch-04:Eth1/2', rate: 7.7, score: 0.1152, risk: 'MED' },
    { e: 'switch-01:Eth1/1', rate: 6.3, score: 0.0987, risk: 'low' },
    { e: 'switch-04:Eth1/3', rate: 5.5, score: 0.1144, risk: 'low' },
  ],
  chainsR: [
    { evt: 'HIGH_LATENCY', n: 231, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'util_pct', d: '↑' }] },
    { evt: 'HIGH_UTIL_WARNING', n: 532, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'util_pct', d: '↑' }] },
    { evt: 'INTERFACE_FLAP', n: 277, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'util_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }] },
    { evt: 'PACKET_DROP', n: 493, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'util_pct', d: '↑' }] },
  ],
  chainsS: [
    { evt: 'DEVICE_REBOOT', n: 2, steps: [{ m: 'queue_depth', d: '↓' }, { m: 'crc_errors', d: '↓' }, { m: 'latency_ms', d: '↓' }, { m: 'util_pct', d: '↓' }, { m: 'cpu_pct', d: '↓' }] },
    { evt: 'HIGH_UTIL_WARNING', n: 207, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'reboot_delta', d: '↑' }, { m: 'util_pct', d: '↑' }] },
    { evt: 'INTERFACE_FLAP', n: 146, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'util_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'reboot_delta', d: '↑' }] },
    { evt: 'PACKET_DROP', n: 239, steps: [{ m: 'cpu_pct', d: '↑' }, { m: 'crc_errors', d: '↑' }, { m: 'queue_depth', d: '↑' }, { m: 'latency_ms', d: '↑' }, { m: 'reboot_delta', d: '↑' }, { m: 'util_pct', d: '↑' }] },
  ],
};
