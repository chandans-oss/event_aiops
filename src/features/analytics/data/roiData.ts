
export interface RoiMetric {
    label: string;
    before: number;
    after: number;
    unit: string;
    improvement: number;
    trend: 'up' | 'down';
    icon: string;
}

export interface ContributionData {
    process: string;
    reduction: number;
    remaining: number;
    color: string;
}

export interface EffectivenessData {
    id: string;
    type: string;
    noiseReduction: number;
    mttdReduction: number;
    mttrReduction: number;
    rcaAccuracy: number;
    valueScore: number;
}

export interface RadarData {
    subject: string;
    Temporal: number;
    Topological: number;
    RuleBased: number;
    ML_GNN: number;
    fullMark: number;
}

export const ROI_SUMMARY = [
    { label: 'Alert Volume', before: 1250, after: 312, unit: '', improvement: 75, trend: 'down', icon: 'Activity' },
    { label: 'Noise Reduction', before: 0, after: 75.1, unit: '%', improvement: 75.1, trend: 'up', icon: 'Zap' },
    { label: 'Incidents Created', before: 42, after: 12, unit: '', improvement: 71.4, trend: 'down', icon: 'AlertTriangle' },
    { label: 'Avg MTTR', before: 58, after: 24, unit: 'm', improvement: 58.6, trend: 'down', icon: 'Clock' },
    { label: 'Avg MTTD', before: 12, after: 3.5, unit: 'm', improvement: 70.8, trend: 'down', icon: 'Search' },
    { label: 'RCA Accuracy', before: 45, after: 88, unit: '%', improvement: 95.5, trend: 'up', icon: 'BrainCircuit' },
];

export const COMPARISON_DATA = [
    { name: 'Alerts', before: 1250, after: 312 },
    { name: 'Incidents', before: 42 * 10, after: 12 * 10 }, // Scale for visualization
    { name: 'MTTR (min)', before: 58, after: 24 },
];

export const WATERFALL_DATA = [
    { process: 'Baseline MTTR', value: 58, start: 0, color: '#64748b' },
    { process: 'Deduplication', value: 8, start: 50, color: '#3b82f6' },
    { process: 'Suppression', value: 6, start: 44, color: '#0ea5e9' },
    { process: 'Correlation', value: 14, start: 30, color: '#8b5cf6' },
    { process: 'Predictive RCA', value: 6, start: 24, color: '#f59e0b' },
    { process: 'Optimized MTTR', value: 24, start: 0, color: '#10b981' },
];

export const EFFECTIVENESS_DATA: EffectivenessData[] = [
    { id: '1', type: 'Temporal', noiseReduction: 45, mttdReduction: 30, mttrReduction: 20, rcaAccuracy: 65, valueScore: 72 },
    { id: '2', type: 'Topological', noiseReduction: 25, mttdReduction: 40, mttrReduction: 35, rcaAccuracy: 88, valueScore: 85 },
    { id: '3', type: 'Rule-based', noiseReduction: 60, mttdReduction: 20, mttrReduction: 15, rcaAccuracy: 70, valueScore: 68 },
    { id: '4', type: 'ML / GNN', noiseReduction: 35, mttdReduction: 55, mttrReduction: 45, rcaAccuracy: 92, valueScore: 94 },
];

export const RADAR_DATA: RadarData[] = [
    { subject: 'Noise Reduction', Temporal: 90, Topological: 60, RuleBased: 95, ML_GNN: 70, fullMark: 100 },
    { subject: 'MTTD Reduction', Temporal: 60, Topological: 80, RuleBased: 40, ML_GNN: 95, fullMark: 100 },
    { subject: 'MTTR Reduction', Temporal: 50, Topological: 85, RuleBased: 30, ML_GNN: 90, fullMark: 100 },
    { subject: 'RCA Accuracy', Temporal: 40, Topological: 95, RuleBased: 60, ML_GNN: 98, fullMark: 100 },
    { subject: 'Predictive Value', Temporal: 30, Topological: 70, RuleBased: 20, ML_GNN: 95, fullMark: 100 },
];

export const TREND_DATA = [
    { time: '00:00', before: 120, after: 30 },
    { time: '04:00', before: 80, after: 20 },
    { time: '08:00', before: 250, after: 60 },
    { time: '12:00', before: 450, after: 110 },
    { time: '16:00', before: 380, after: 90 },
    { time: '20:00', before: 180, after: 45 },
    { time: '23:59', before: 130, after: 35 },
];

export const NOISE_REDUCTION_PIE = [
    { name: 'Correlated / Suppressed', value: 938, color: '#3b82f6' },
    { name: 'Actionable Incidents', value: 312, color: '#f59e0b' },
];

export const FUNNEL_DATA = [
    { name: 'Raw Alerts', value: 1250, color: '#64748b' },
    { name: 'Deduplicated', value: 840, color: '#3b82f6' },
    { name: 'Suppressed', value: 620, color: '#0ea5e9' },
    { name: 'Correlated', value: 312, color: '#8b5cf6' },
    { name: 'Incidents', value: 12, color: '#10b981' },
];
