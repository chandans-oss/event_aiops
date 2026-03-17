
export const buildResultsData = () => {
  return {
    crossCorrelation: {
      router: [
        { a: "Inbound_Load", b: "Packet_Discard", lag: "+4m", r: 0.942, interp: "Strong positive correlation with delay" },
        { a: "CPU_Wait", b: "Query_Latency", lag: "+0m", r: 0.881, interp: "Immediate impact on performance" },
        { a: "Buffer_Utilization", b: "TCP_Retransmit", lag: "+1m", r: 0.754, interp: "Buffer pressure causes segment loss" }
      ],
      switch: [
        { a: "Link_Utilization", b: "Error_Rate", lag: "+12m", r: 0.912, interp: "Congestion leads to high bit errors" },
        { a: "Fan_Speed", b: "Chassis_Temp", lag: "-5m", r: 0.654, interp: "Reactive cooling lag detected" }
      ]
    },
    granger: {
      router: [
        { cause: "Interface_Load", effect: "Packet_Drop", f: 242.1, p: "< 0.001", lag: "Lag 15" },
        { cause: "BGP_Reset", effect: "Traffic_Blackhole", f: 112.4, p: "< 0.01", lag: "Lag 5" }
      ],
      switch: [
        { cause: "STP_Calculation", effect: "CPU_Spike", f: 88.5, p: "< 0.05", lag: "Lag 2" }
      ]
    },
    preEvent: {
      router: [
        { event: "DEVICE_REBOOT", occ: 12, wins: 180, drain: true, metrics: [
          { name: "CPU_Temp", change: 12.4, up: true },
          { name: "Power_Draw", change: 8.5, up: false }
        ]},
        { event: "HIGH_UTIL_WARNING", occ: 45, wins: 670, metrics: [
          { name: "BGP_Prefix_Count", change: 42.1, up: true }
        ]}
      ],
      switch: [
        { event: "INTERFACE_FLAP", occ: 8, wins: 120, metrics: [
          { name: "Optical_Power", change: 15.2, up: false }
        ]}
      ]
    },
    clustering: {
      router: [
        { name: "Stable Core Flow", size: 4200, total: 8640, noEvt: 99.2, top: "Low variance metrics", risk: false },
        { name: "Congestion Storm", size: 420, total: 8640, noEvt: 12.4, top: "High CPU, High Discard", risk: true }
      ],
      switch: [
        { name: "Broadcast Storm", size: 120, total: 8640, noEvt: 5.2, top: "High PPS, Low Unicast", risk: true }
      ]
    },
    randomForest: {
      router: [
        { event: "PACKET_DROP", f1: 0.942, prec: 0.951, rec: 0.932, acc: 0.985, pos: 420, feats: [["Interface_Load", 0.45], ["CPU_Wait", 0.21]] },
        { event: "BGP_DOWN", f1: 0.881, prec: 0.892, rec: 0.871, acc: 0.992, pos: 12, feats: [["Hold_Timer_Ex", 0.62]] }
      ],
      switch: [
        { event: "INTERFACE_FLAP", f1: 0.912, prec: 0.921, rec: 0.902, acc: 0.995, pos: 54, feats: [["Optical_Power", 0.52]] }
      ]
    },
    sequences: {
      router: [
        { seq: ["INTERFACE_FLAP", "BGP_DOWN", "TRAFFIC_DROP"], sup: 42, conf: 0.85 },
        { seq: ["CPU_SPIKE", "PROCESS_KILL"], sup: 15, conf: 0.92 }
      ],
      switch: [
        { seq: ["PORT_SHUT", "STP_RECALC"], sup: 12, conf: 0.78 }
      ]
    },
    anomaly: {
      router: [
        { entity: "router-core-01", rate: 12.4, risk: "HIGH" },
        { entity: "router-core-02", rate: 1.2, risk: "LOW" }
      ],
      switch: [
        { entity: "switch-dist-01", rate: 5.8, risk: "MED" }
      ]
    },
    chains: {
      router: [
        { event: "TRAFFIC_DROP", count: 12, drain: true, steps: ["Intf_Load \u2191", "Pkt_Discard \u2191", "BGP_Reset"] },
        { event: "LATENCY_SPIKE", count: 45, drain: false, steps: ["CPU_Wait \u2191", "Process_Queue \u2191"] }
      ],
      switch: [
        { event: "BROADCAST_STORM", count: 3, drain: true, steps: ["PPS \u2191", "Broadcast_Count \u2191"] }
      ]
    }
  };
};
