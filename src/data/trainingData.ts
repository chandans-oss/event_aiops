
export const STEPS = [
  "INITIALIZING",
  "LOADING_DATA",
  "PREPROCESSING",
  "WINDOWING",
  "X-CORRELATION",
  "GRANGER_CAUSALITY",
  "PRE-EVENT_ANALYSIS",
  "CLUSTERING",
  "RF_TRAINING",
  "SEQUENCE_MINING",
  "ANOMALY_DETECTION",
  "FAILURE_CHAINS",
  "FINALIZING"
];

export const STEP_ELAPSED = [
  "0.5s", "1.2s", "0.8s", "4.5s", "3.2s", "5.1s", "2.4s", "6.8s", "12.4s", "4.2s", "3.1s", "4.9s", "0.2s"
];

export const FUNC_META: Record<number, { name: string; info: string }> = {
  0: { name: "init_pipeline", info: "Initializing compute kernels and allocating memory buffer..." },
  1: { name: "fetch_mongodb", info: "Connecting to mongodb://analytics-db:27017 and streaming telemetry..." },
  2: { name: "clean_signals", info: "Applying Kalman filter to 70 feature dimensions. Outliers suppressed." },
  3: { name: "sliding_windows", info: "Generating 75-minute batches with 1-minute step interval." },
  4: { name: "compute_xcorr", info: "Calculating temporal lag between interface load and packet loss." },
  5: { name: "test_causality", info: "Applying Granger Causality test (Lag 15). Mapping dependency graph." },
  6: { name: "analyze_pre_evt", info: "Analyzing metric shift 10 minutes prior to critical failures." },
  7: { name: "group_signals", info: "Unsupervised clustering (DBSCAN). Identifying 14 unique signal patterns." },
  8: { name: "train_forest", info: "Training binary classifier (100 trees). Optimized for F1 score." },
  9: { name: "mine_sequences", info: "Extracting n-event transitions. Found 42 significant sequences." },
  10: { name: "isolate_anoms", info: "Computing anomaly score via Isolation Forest. Found 3 outliers." },
  11: { name: "map_fault_chains", info: "Synthesizing causality into end-to-end failure chain models." },
  12: { name: "save_models", info: "Serializing model weights and generating training report..." },
};

export const TRAIN_LINES = [
  "NETWORK PATTERN MINING V3.0.4",
  "====================================",
  "SECTION 0: INITIALIZING PIPELINE",
  "Loading compute kernels... OK",
  "Allocating 2.4GB VRAM buffer... OK",
  "Workers [0-7] spawned successfully.",
  "",
  "SECTION 1: DATA INGESTION",
  "Connecting to MongoDB cluster... OK",
  "Fetching 30 days of telemetry (32 entities)...",
  "Processing 42,912 raw samples... OK",
  "",
  "SECTION 2: PREPROCESSING",
  "Imputing missing values via linear interpolation... OK",
  "Normalizing feature space [0, 1]... OK",
  "Kalman filtering active. Signal noise floor suppressed.",
  "",
  "SECTION 3: TEMPORAL WINDOWING",
  "Generating overlapping sliding windows (75m size, 1m step)...",
  "Processed batch 05/30... OK",
  "Processed batch 12/30... OK",
  "Processed batch 21/30... OK",
  "Processed batch 30/30... OK",
  "Total windows generated: 8,640",
  "",
  "SECTION 4: CROSS-CORRELATION ENGINE",
  "Computing Pearson r across 70x70 matrix...",
  "Found lag: Intf_Load -> Pkt_Drop = +4.5m (r=0.94)",
  "Found lag: CPU_Util -> Latency = +12.1m (r=0.88)",
  "Saving correlation baseline... OK",
  "",
  "SECTION 5: GRANGER CAUSALITY TEST",
  "Testing F-stats (Lag 15)...",
  "*** SIGNIFICANT ***: Eth0/1_Load granger-causes Pkt_Discard (p < 0.001)",
  "*** SIGNIFICANT ***: BGP_Sess_Reset granger-causes Traffic_Blackhole (p < 0.01)",
  "Not significant: Memory_Free granger-causes Interface_Flap.",
  "",
  "SECTION 6: PRE-EVENT METRIC SHIFT",
  "Scanning T-10m window for 52 distinct event types...",
  "Event [DEVICE_REBOOT]: Found 12% rise in CPU_Temp 4m prior.",
  "Event [INTERFACE_FLAP]: Found drop in Optical_Power 2m prior.",
  "",
  "SECTION 7: UNSUPERVISED CLUSTERING",
  "Running DBSCAN (Eps=0.5, MinPts=10)...",
  "Identified 14 specific signal groups.",
  "Cluster 04: High Risk - Pattern matches historical outage #842.",
  "",
  "SECTION 8: RANDOM FOREST CLASSIFIER",
  "Training 100 trees... Bootstrapping data...",
  "Epoch 10/10: Loss 0.124, Accuracy 94.2%",
  "F1 Score: 0.91 (High confidence prediction available)",
  "Feature Importance: CPU_Wait (0.42), Pkt_Error (0.21)",
  "",
  "SECTION 9: SEQUENCE MINING",
  "Running PrefixSpan... Mining patterns length 2-5...",
  "Total sequences found: 42",
  "Top: INTERFACE_FLAP -> BGP_DOWN -> TRAFFIC_DROP (sup: 0.12, conf: 0.85)",
  "",
  "SECTION 10: ANOMALY DETECTION",
  "Isolating outliers via Isolation Forest...",
  "Entity [router-core-01]: High drift in Latency (score: 0.92)",
  "Entity [switch-dist-02]: Anomaly found in Buffer_Usage.",
  "",
  "SECTION 11: FAILURE CHAIN SYNTHESIS",
  "Merging causality and sequences into failure chains...",
  "Generated 8 complete fault propagation models.",
  "Chain 1: Link_Instability -> High_Error_Rate -> OSPF_Drop.",
  "",
  "SECTION 12: FINALIZING",
  "Serializing production weights matrix... OK",
  "Generating PDF report /tmp/reportv3.pdf... OK",
  "Syncing metrics to dashboard... OK",
  "PIPELINE EXECUTION COMPLETE. DONE✓"
];

export const getStepForLine = (lineIdx: number): number => {
  if (lineIdx <= 6) return 0;
  if (lineIdx <= 11) return 1;
  if (lineIdx <= 16) return 2;
  if (lineIdx <= 24) return 3;
  if (lineIdx <= 30) return 4;
  if (lineIdx <= 36) return 5;
  if (lineIdx <= 41) return 6;
  if (lineIdx <= 46) return 7;
  if (lineIdx <= 52) return 8;
  if (lineIdx <= 57) return 9;
  if (lineIdx <= 62) return 10;
  if (lineIdx <= 67) return 11;
  return 12;
};
