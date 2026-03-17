
export interface TrainingConfig {
  duration: string;
  trainingScope: 'device' | 'topology' | 'device_group';
  selectedTarget: string;
  algorithms: {
    timeSeries: string[];
    clustering: string[];
    statistical: string[];
    patternMatching: string[];
  };
  anomaly: string[];
}

export const DURATION_CONFIG: Record<string, { label: string; windows: number; batches: number; entities: number }> = {
  '1h': { label: '1 Hour (Recent)', windows: 12, batches: 1, entities: 32 },
  '24h': { label: '24 Hours (Daily)', windows: 288, batches: 4, entities: 32 },
  '7d': { label: '7 Days (Weekly)', windows: 2016, batches: 12, entities: 32 },
  '30d': { label: '30 Days (Monthly)', windows: 8640, batches: 30, entities: 32 },
};

export const ALGORITHM_CATEGORIES = {
  timeSeries: {
    label: 'Time Series',
    icon: '📈',
    sub: 'Supervised prediction models',
    algorithms: [
      { id: 'ts-linreg', name: 'Linear Regression', desc: 'Fit linear trend to time-series features for event prediction' },
      { id: 'ts-xgboost', name: 'XG Boost', desc: 'Gradient boosted trees optimized for tabular data classification' },
      { id: 'ts-rf', name: 'Random Forest', desc: 'Ensemble of 150 decision trees with bagging for robust prediction' }
    ]
  },
  clustering: {
    label: 'Clustering',
    icon: '🔵',
    sub: 'Unsupervised grouping',
    algorithms: [
      { id: 'cluster-kmeans', name: 'K-Means', desc: 'Partition windows into k=4 behavioral clusters by centroid distance' }
    ]
  },
  anomaly: {
    label: 'Anomaly',
    icon: '⚠️',
    sub: 'Outlier & anomaly detection',
    algorithms: [
      { id: 'anom-isoforest', name: 'Isolation Forest', desc: 'Isolation Forest with 5% contamination to flag outlier windows' }
    ]
  },
  patternMatching: {
    label: 'Pattern Matching',
    icon: '🔗',
    sub: 'Sequence & chain detection',
    algorithms: [
      { id: 'pattern-seq', name: 'Sequence Mining', desc: 'Extract frequent 3-event patterns with support ≥ 2 and lift ≥ 1.5' },
      { id: 'pattern-chains', name: 'Failure Chains', desc: 'Build metric cascade chains leading to failure events' }
    ]
  },
  statistical: {
    label: 'Statistical',
    icon: '📊',
    sub: 'Correlation & causality tests',
    algorithms: [
      { id: 'stat-xcorr', name: 'Cross Correlation', desc: 'Lagged Pearson & Spearman for all metric pairs (±15 lags)' },
      { id: 'stat-granger', name: 'Granger Causality', desc: 'F-test with OLS residuals to detect causal metric relationships' }
    ]
  }
};

export interface TrainingReport {
  id: string;
  timestamp: string;
  config: TrainingConfig;
  status: 'completed' | 'failed';
  duration: string;
  windowCount: number;
  entityCount: number;
  results: any;
}

const STORAGE_KEY_CONFIG = 'npm_training_config';
const STORAGE_KEY_REPORTS = 'npm_training_reports';

export const getDefaultConfig = (): TrainingConfig => ({
  duration: '30d',
  trainingScope: 'topology',
  selectedTarget: 'topo-dc-west',
  algorithms: {
    timeSeries: ['ts-rf'],
    clustering: ['cluster-kmeans'],
    statistical: ['stat-granger', 'stat-xcorr'],
    patternMatching: ['pattern-seq', 'pattern-chains'],
  },
  anomaly: ['anom-isoforest'],
});

export const loadConfig = (): TrainingConfig => {
  const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (!saved) return getDefaultConfig();
  try {
    return JSON.parse(saved);
  } catch {
    return getDefaultConfig();
  }
};

export const saveConfig = (config: TrainingConfig) => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

export const loadReports = (): TrainingReport[] => {
  const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const saveReport = (report: TrainingReport) => {
  const reports = loadReports();
  reports.unshift(report);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports.slice(0, 50)));
};

export const loadLatestReport = (): TrainingReport | null => {
  const reports = loadReports();
  return reports.length > 0 ? reports[0] : null;
};
