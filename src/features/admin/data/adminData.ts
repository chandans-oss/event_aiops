import { IntentFull, IntentCategory, KBArticle, RemediationPermission } from '@/shared/types';

// Intent Categories and Subcategories
export const mockIntentCategories: IntentCategory[] = [
  {
    id: "network",
    name: "Network",
    domain: "Network",
    subcategories: [
      {
        id: "link",
        name: "Link",
        function: "Link Layer",
        intentCount: 5
      },
      {
        id: "performance",
        name: "Performance",
        function: "Performance",
        intentCount: 2
      },
      {
        id: "routing",
        name: "Routing",
        function: "Routing",
        intentCount: 2
      },
      {
        id: "wan",
        name: "Wan",
        function: "WAN",
        intentCount: 1
      },
      {
        id: "wireless",
        name: "Wireless",
        function: "Wireless",
        intentCount: 1
      }
    ]
  },
  {
    id: "compute",
    name: "Compute",
    domain: "Compute",
    subcategories: [
      {
        id: "system",
        name: "System",
        function: "CPU",
        intentCount: 6
      },
      {
        id: "container",
        name: "Container",
        function: "Containers",
        intentCount: 1
      }
    ]
  },
  {
    id: "security",
    name: "Security",
    domain: "Security",
    subcategories: [
      {
        id: "security",
        name: "Security",
        function: "Threat",
        intentCount: 5
      }
    ]
  },
  {
    id: "platform",
    name: "Platform",
    domain: "Platform",
    subcategories: [
      {
        id: "unknown",
        name: "Unknown",
        function: "Intent Quality",
        intentCount: 1
      },
      {
        id: "platform",
        name: "Platform",
        function: "Intent Quality",
        intentCount: 4
      }
    ]
  },
  {
    id: "facility",
    name: "Facility",
    domain: "Facility",
    subcategories: [
      {
        id: "thermal",
        name: "Thermal",
        function: "Device Thermal",
        intentCount: 2
      },
      {
        id: "cooling",
        name: "Cooling",
        function: "Cooling",
        intentCount: 1
      },
      {
        id: "power",
        name: "Power",
        function: "Power",
        intentCount: 1
      }
    ]
  },
  {
    id: "storage",
    name: "Storage",
    domain: "Storage",
    subcategories: [
      {
        id: "storage",
        name: "Storage",
        function: "Disk Health",
        intentCount: 5
      }
    ]
  },
  {
    id: "database",
    name: "Database",
    domain: "Database",
    subcategories: [
      {
        id: "db",
        name: "Db",
        function: "Availability",
        intentCount: 5
      }
    ]
  },
  {
    id: "middleware",
    name: "Middleware",
    domain: "Middleware",
    subcategories: [
      {
        id: "mq",
        name: "Mq",
        function: "Queue Health",
        intentCount: 2
      },
      {
        id: "txn",
        name: "Txn",
        function: "Transaction Health",
        intentCount: 1
      }
    ]
  },
  {
    id: "load-balancer",
    name: "Load Balancer",
    domain: "Load Balancer",
    subcategories: [
      {
        id: "lb",
        name: "Lb",
        function: "VIP Availability",
        intentCount: 5
      }
    ]
  },
  {
    id: "sd-wan",
    name: "SD-WAN",
    domain: "SD-WAN",
    subcategories: [
      {
        id: "sdwan",
        name: "Sdwan",
        function: "Transport Health",
        intentCount: 4
      }
    ]
  }
];

// Full Intent Data
export const mockIntentsFull: IntentFull[] = [
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdf8"
    },
    id: "link.down",
    intent: "link",
    description: "Physical/optical link down",
    domain: "Network",
    function: "Link Layer",
    keywords: [
      "interface down",
      "link down",
      "port down",
      "los",
      "loss of signal"
    ],
    signals: [
      {
        metric: "oper_status",
        op: "==",
        value: "down",
        weight: 0.7
      },
      {
        metric: "admin_status",
        op: "==",
        value: "up",
        weight: 0.2
      }
    ],
    hypotheses: [
      {
        id: "H_CABLE_UNPLUGGED",
        description: "Physical cable disconnected or optical signal lost",
        signals: [
          {
            metric: "oper_status",
            op: "==",
            value: "down",
            weight: 0.7
          },
          {
            metric: "admin_status",
            op: "==",
            value: "up",
            weight: 0.2
          }
        ],
        logPatterns: [
          {
            keyword: "loss of signal",
            weight: 0.3
          },
          {
            keyword: "LOS",
            weight: 0.3
          }
        ]
      },
      {
        id: "H_TRANSCEIVER_FAILURE",
        description: "Optical module or SFP failure",
        signals: [
          {
            metric: "oper_status",
            op: "==",
            value: "down",
            weight: 0.6
          }
        ],
        logPatterns: [
          {
            keyword: "transceiver",
            weight: 0.3
          },
          {
            keyword: "module failure",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Link/Interface {interface} on device {device} is down. Operational status is {oper_status}, while administrative status is {admin_status}. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "down"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdf9"
    },
    id: "link.flap",
    intent: "link",
    description: "Interface flapping frequently",
    domain: "Network",
    function: "Link Layer",
    keywords: [
      "flap",
      "bouncing",
      "up/down",
      "interface changed state"
    ],
    signals: [
      {
        metric: "flap_count",
        op: ">",
        value: 3,
        weight: 0.7
      },
      {
        metric: "oper_changes_per_min",
        op: ">",
        value: 1,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_LOOSE_CONNECTION",
        description: "Loose connection or faulty cable",
        signals: [
          {
            metric: "flap_count",
            op: ">",
            value: 3,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "changed state to down",
            weight: 0.3
          }
        ]
      },
      {
        id: "H_NEGOTIATION_ISSUE",
        description: "Speed/Duplex negotiation mismatch",
        signals: [
          {
            metric: "oper_changes_per_min",
            op: ">",
            value: 1,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "duplex",
            weight: 0.3
          },
          {
            keyword: "speed mismatch",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Interface {resoure_name} on {device} is flapping frequently ({flap_count} flaps, {oper_changes_per_min} state changes per minute). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "flap"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdfa"
    },
    id: "link.high_errors",
    intent: "link",
    description: "High CRC/Input/Output errors",
    domain: "Network",
    function: "Link Layer",
    keywords: [
      "crc",
      "input error",
      "output error",
      "frame error"
    ],
    signals: [
      {
        metric: "in_errors",
        op: ">",
        value: 100,
        weight: 0.5
      },
      {
        metric: "out_discards",
        op: ">",
        value: 100,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_CRC_ERRORS",
        description: "CRC or physical layer corruption",
        signals: [
          {
            metric: "in_errors",
            op: ">",
            value: 100,
            weight: 0.6
          }
        ],
        logPatterns: [
          {
            keyword: "crc error",
            weight: 0.3
          }
        ]
      },
      {
        id: "H_BUFFER_OVERFLOW",
        description: "Packet drops due to output queue overflow",
        signals: [
          {
            metric: "out_discards",
            op: ">",
            value: 100,
            weight: 0.4
          }
        ],
        logPatterns: [
          {
            keyword: "queue full",
            weight: 0.2
          },
          {
            keyword: "tail drop",
            weight: 0.2
          }
        ]
      }
    ],
    situationDesc: "Interface {resoure_name} on {device} is experiencing high error rates {in_errors} input errors, {out_discards} output discards. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "high_errors"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdfb"
    },
    id: "performance.congestion",
    intent: "performance",
    description: "Interface congestion",
    domain: "Network",
    function: "Performance",
    keywords: [
      "congestion",
      "queue drop",
      "buffer full",
      "tail drop",
      "backup",
      "rsync"
    ],
    signals: [
      {
        metric: "utilization_percent",
        op: ">",
        value: 90,
        weight: 0.5
      },
      {
        metric: "out_discards",
        op: ">",
        value: 0,
        weight: 0.4
      }
    ],
    hypotheses: [
      {
        id: "H_QOS_CONGESTION",
        description: "High utilization and queue discards",
        signals: [
          {
            metric: "utilization_percent",
            op: ">",
            value: 90,
            weight: 0.5
          },
          {
            metric: "out_discards",
            op: ">",
            value: 0,
            weight: 0.4
          }
        ],
        logPatterns: [
          {
            keyword: "tail drop",
            weight: 0.3
          },
          {
            keyword: "buffer full",
            weight: 0.3
          },
          {
            keyword: "queue full",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Interface {resoure_name} on {device} shows high utilization ({utilization_percent}%), with {out_discards} queue drops. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "congestion"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdfc"
    },
    id: "routing.bgp_down",
    intent: "routing",
    description: "BGP session down",
    domain: "Network",
    function: "Routing",
    keywords: [
      "bgp",
      "neighbor down"
    ],
    signals: [
      {
        metric: "bgp_session_state",
        op: "==",
        value: "down",
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_BGP_NEIGHBOR_LOST",
        description: "BGP peer or transport failure",
        signals: [
          {
            metric: "bgp_session_state",
            op: "==",
            value: "down",
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "BGP-5-ADJCHANGE",
            weight: 0.3
          },
          {
            keyword: "neighbor down",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "BGP session between {device} and neighbor {peer} is down (state={bgp_session_state}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "bgp_down"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdfd"
    },
    id: "system.cpu_high",
    intent: "system",
    description: "High CPU on device",
    domain: "Compute",
    function: "CPU",
    keywords: [
      "cpu high",
      "high load"
    ],
    signals: [
      {
        metric: "cpu_percent",
        op: ">",
        value: 80,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_CPU_SPIKE",
        description: "CPU nearing threshold causing impact",
        signals: [
          {
            metric: "cpu_percent",
            op: ">",
            value: 80,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "high cpu",
            weight: 0.3
          },
          {
            keyword: "process",
            weight: 0.2
          }
        ]
      }
    ],
    situationDesc: "Device {device} CPU utilization is high ({cpu_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "cpu_high"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdfe"
    },
    id: "system.memory_high",
    intent: "system",
    description: "High memory usage",
    domain: "Compute",
    function: "Memory",
    keywords: [
      "memory high",
      "ram usage"
    ],
    signals: [
      {
        metric: "mem_percent",
        op: ">",
        value: 80,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_MEMORY_PRESSURE",
        description: "Memory nearing full capacity",
        signals: [
          {
            metric: "mem_percent",
            op: ">",
            value: 80,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "memory",
            weight: 0.3
          },
          {
            keyword: "oom",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Device {device} memory utilization is high ({mem_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "memory_high"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75cdff"
    },
    id: "security.ddos",
    intent: "security",
    description: "High PPS traffic – potential DDOS",
    domain: "Security",
    function: "Threat",
    keywords: [
      "ddos",
      "attack",
      "flood"
    ],
    signals: [
      {
        metric: "pps_rate",
        op: ">",
        value: 1000000,
        weight: 0.6
      }
    ],
    hypotheses: [
      {
        id: "H_VOLUME_ATTACK",
        description: "High-volume packet flood attack",
        signals: [
          {
            metric: "pps_rate",
            op: ">",
            value: 1000000,
            weight: 0.6
          }
        ],
        logPatterns: [
          {
            keyword: "attack",
            weight: 0.3
          },
          {
            keyword: "flood",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Device {device} is experiencing unusually high packet rate ({pps_rate} PPS) indicating possible DDOS. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "ddos"
  },
  {
    _id: {
      $oid: "6937d9c6a4cd14665b75ce00"
    },
    id: "unknown.low_confidence",
    intent: "unknown",
    description: "No confident match",
    domain: "Platform",
    function: "Intent Quality",
    keywords: [
      "unknown",
      "investigate"
    ],
    signals: [
      {
        metric: "combined_score",
        op: "<",
        value: 0.6,
        weight: 1
      }
    ],
    hypotheses: [
      {
        id: "H_MANUAL_INVESTIGATION",
        description: "Not enough evidence – manual analysis required",
        signals: [
          {
            metric: "combined_score",
            op: "<",
            value: 0.6,
            weight: 1
          }
        ],
        logPatterns: [
          {
            keyword: "unknown",
            weight: 0.2
          }
        ]
      }
    ],
    situationDesc: "No clear pattern detected for {device}. Combined score = {combined_score}. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "low_confidence"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce01"
    },
    id: "link.unidirectional",
    intent: "link",
    domain: "Network",
    function: "Link Layer",
    description: "Unidirectional link issue detected between two devices",
    keywords: [
      "unidirectional",
      "rx only",
      "tx only",
      "fiber issue"
    ],
    signals: [
      {
        metric: "rx_errors",
        op: ">",
        value: 100,
        weight: 0.5
      },
      {
        metric: "tx_errors",
        op: "==",
        value: 0,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_FIBER_ONE_SIDE_BROKEN",
        description: "One strand of the fiber pair is broken or mispatched",
        signals: [
          {
            metric: "rx_errors",
            op: ">",
            value: 100,
            weight: 0.6
          },
          {
            metric: "tx_errors",
            op: "==",
            value: 0,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "unidirectional link",
            weight: 0.3
          },
          {
            keyword: "no light received",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Link between {device} and {peer} appears unidirectional. {device} is receiving frames with errors (rx_errors={rx_errors}) while not transmitting successfully (tx_errors={tx_errors}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "unidirectional"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce02"
    },
    id: "link.duplex_mismatch",
    intent: "link",
    domain: "Network",
    function: "Link Layer",
    description: "Possible speed/duplex mismatch detected on interface",
    keywords: [
      "duplex mismatch",
      "late collisions",
      "half duplex"
    ],
    signals: [
      {
        metric: "collisions",
        op: ">",
        value: 10,
        weight: 0.5
      },
      {
        metric: "speed_mismatch_flag",
        op: "==",
        value: 1,
        weight: 0.4
      }
    ],
    hypotheses: [
      {
        id: "H_AUTONEG_FAILED",
        description: "Auto-negotiation failed leading to speed/duplex mismatch",
        signals: [
          {
            metric: "collisions",
            op: ">",
            value: 10,
            weight: 0.5
          },
          {
            metric: "speed_mismatch_flag",
            op: "==",
            value: 1,
            weight: 0.4
          }
        ],
        logPatterns: [
          {
            keyword: "duplex mismatch",
            weight: 0.3
          },
          {
            keyword: "late collision",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Interface {interface} on {device} shows collision errors (collisions={collisions}) and a speed/duplex mismatch indicator. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "duplex_mismatch"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce03"
    },
    id: "performance.jitter_high",
    intent: "performance",
    domain: "Network",
    function: "Performance",
    description: "High jitter observed on path impacting real-time traffic",
    keywords: [
      "jitter",
      "voice quality",
      "realtime",
      "RTP"
    ],
    signals: [
      {
        metric: "jitter_ms",
        op: ">",
        value: 30,
        weight: 0.6
      },
      {
        metric: "packet_loss_percent",
        op: ">",
        value: 1,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_TRANSIENT_CONGESTION",
        description: "Transient congestion or microbursts causing jitter",
        signals: [
          {
            metric: "jitter_ms",
            op: ">",
            value: 30,
            weight: 0.6
          },
          {
            metric: "packet_loss_percent",
            op: ">",
            value: 1,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "voice quality degraded",
            weight: 0.3
          },
          {
            keyword: "RTP jitter",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "High jitter detected on path involving {device} (jitter={jitter_ms} ms, loss={packet_loss_percent}%). Real-time applications may be impacted. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "jitter_high"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce04"
    },
    id: "routing.ospf_flap",
    intent: "routing",
    domain: "Network",
    function: "Routing",
    description: "OSPF adjacency flapping between neighbors",
    keywords: [
      "ospf",
      "adjacency reset",
      "routing flap"
    ],
    signals: [
      {
        metric: "ospf_adj_changes",
        op: ">",
        value: 3,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_OSPF_HELLO_MISS",
        description: "Hello packets being missed due to loss or delay",
        signals: [
          {
            metric: "ospf_adj_changes",
            op: ">",
            value: 3,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "LOST_ADJACENCY",
            weight: 0.3
          },
          {
            keyword: "Dead timer expired",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "OSPF adjacency between {device} and {peer} is flapping (changes={ospf_adj_changes}). This can cause route instability. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "ospf_flap"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce05"
    },
    id: "wan.mtu_mismatch",
    intent: "wan",
    domain: "Network",
    function: "WAN",
    description: "Possible MTU mismatch on WAN path",
    keywords: [
      "mtu",
      "fragmentation",
      "path mtu"
    ],
    signals: [
      {
        metric: "fragmented_packets",
        op: ">",
        value: 100,
        weight: 0.5
      },
      {
        metric: "icmp_frag_needed",
        op: ">",
        value: 0,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_PATH_MTU_MISMATCH",
        description: "Intermediate hop enforcing smaller MTU than endpoints",
        signals: [
          {
            metric: "fragmented_packets",
            op: ">",
            value: 100,
            weight: 0.5
          },
          {
            metric: "icmp_frag_needed",
            op: ">",
            value: 0,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "fragmentation needed",
            weight: 0.3
          },
          {
            keyword: "DF bit set",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "WAN path involving {device} shows fragmentation events (fragmented_packets={fragmented_packets}) and ICMP 'fragmentation needed' messages. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "mtu_mismatch"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce06"
    },
    id: "wireless.client_auth_failure",
    intent: "wireless",
    domain: "Network",
    function: "Wireless",
    description: "Multiple wireless client authentication failures on SSID",
    keywords: [
      "wifi",
      "auth failure",
      "802.1x",
      "EAP"
    ],
    signals: [
      {
        metric: "wifi_auth_failures",
        op: ">",
        value: 20,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_RADIUS_ISSUE",
        description: "RADIUS or 802.1X authentication issues",
        signals: [
          {
            metric: "wifi_auth_failures",
            op: ">",
            value: 20,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "EAP failure",
            weight: 0.3
          },
          {
            keyword: "RADIUS server not responding",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "High wireless authentication failure rate detected on {ssid} at {device} (failures={wifi_auth_failures}). Users may be unable to join the network. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "client_auth_failure"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce07"
    },
    id: "system.cpu_spike",
    intent: "system",
    domain: "Compute",
    function: "CPU",
    description: "Short-term CPU spike on host",
    keywords: [
      "cpu spike",
      "high load",
      "process spike"
    ],
    signals: [
      {
        metric: "cpu_percent",
        op: ">",
        value: 90,
        weight: 0.7
      },
      {
        metric: "cpu_load_1min",
        op: ">",
        value: 4,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_BATCH_JOB",
        description: "Batch or background job temporarily consuming CPU",
        signals: [
          {
            metric: "cpu_percent",
            op: ">",
            value: 90,
            weight: 0.7
          },
          {
            metric: "cpu_load_1min",
            op: ">",
            value: 4,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "cron",
            weight: 0.3
          },
          {
            keyword: "scheduled job",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Host {device} shows a CPU spike (cpu={cpu_percent}%, load_1={cpu_load_1min}). Short bursts may impact latency-sensitive workloads. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "cpu_spike"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce08"
    },
    id: "system.memory_leak_suspected",
    intent: "system",
    domain: "Compute",
    function: "Memory",
    description: "Sustained growth in memory usage suggesting a leak",
    keywords: [
      "memory leak",
      "heap growth",
      "rss increasing"
    ],
    signals: [
      {
        metric: "mem_percent",
        op: ">",
        value: 85,
        weight: 0.6
      },
      {
        metric: "mem_trend_1h",
        op: ">",
        value: 10,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_APP_MEMORY_LEAK",
        description: "Application memory leak causing continuous growth in RAM usage",
        signals: [
          {
            metric: "mem_percent",
            op: ">",
            value: 85,
            weight: 0.6
          },
          {
            metric: "mem_trend_1h",
            op: ">",
            value: 10,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "OutOfMemoryError",
            weight: 0.3
          },
          {
            keyword: "memory allocation failure",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Host {device} shows sustained high memory usage (mem={mem_percent}%, 1h increase={mem_trend_1h}%). This may indicate a leak. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "memory_leak_suspected"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce09"
    },
    id: "system.psu_sensor_alarm",
    intent: "system",
    domain: "Compute",
    function: "Sensors",
    description: "Power supply unit sensor reporting alarm",
    keywords: [
      "psu failure",
      "power supply",
      "sensor alarm"
    ],
    signals: [
      {
        metric: "psu_status",
        op: "==",
        value: "failed",
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_PSU_FAILED",
        description: "One of the PSUs on the server has failed",
        signals: [
          {
            metric: "psu_status",
            op: "==",
            value: "failed",
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "PSU failure",
            weight: 0.3
          },
          {
            keyword: "power supply error",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Power supply sensor on {device} reports a failure (psu_status={psu_status}). Redundancy may be degraded. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "psu_sensor_alarm"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0a"
    },
    id: "system.critical_service_down",
    intent: "system",
    domain: "Compute",
    function: "OS Services",
    description: "Critical OS-level service is not running",
    keywords: [
      "service down",
      "daemon stopped",
      "process not running"
    ],
    signals: [
      {
        metric: "service_running",
        op: "==",
        value: 0,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_SERVICE_CRASHED",
        description: "Critical service crashed or failed to start",
        signals: [
          {
            metric: "service_running",
            op: "==",
            value: 0,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "service crashed",
            weight: 0.3
          },
          {
            keyword: "failed to start",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Service {service_name} on {device} is not running (service_running={service_running}). This may impact application availability. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "critical_service_down"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0b"
    },
    id: "container.restart_loop",
    intent: "container",
    domain: "Compute",
    function: "Containers",
    description: "Container repeatedly restarting on host",
    keywords: [
      "crashloop",
      "restart backoff",
      "container crash"
    ],
    signals: [
      {
        metric: "container_restarts",
        op: ">",
        value: 5,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_BAD_CONFIG_OR_DEPENDENCY",
        description: "Misconfiguration or missing dependency causing container to crash",
        signals: [
          {
            metric: "container_restarts",
            op: ">",
            value: 5,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "CrashLoopBackOff",
            weight: 0.3
          },
          {
            keyword: "ImagePullBackOff",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Container {container_name} on {device} is restarting repeatedly (restarts={container_restarts}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "restart_loop"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0c"
    },
    id: "security.port_scan",
    intent: "security",
    domain: "Security",
    function: "Threat",
    description: "Possible port scanning activity detected",
    keywords: [
      "port scan",
      "nmap",
      "reconnaissance"
    ],
    signals: [
      {
        metric: "unique_dest_ports",
        op: ">",
        value: 100,
        weight: 0.7
      },
      {
        metric: "conn_attempts_per_sec",
        op: ">",
        value: 200,
        weight: 0.5
      }
    ],
    hypotheses: [
      {
        id: "H_EXTERNAL_RECON",
        description: "External actor scanning ports to discover open services",
        signals: [
          {
            metric: "unique_dest_ports",
            op: ">",
            value: 100,
            weight: 0.7
          },
          {
            metric: "conn_attempts_per_sec",
            op: ">",
            value: 200,
            weight: 0.5
          }
        ],
        logPatterns: [
          {
            keyword: "port scan detected",
            weight: 0.3
          },
          {
            keyword: "reconnaissance",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "High rate of connection attempts to many ports observed on {device} (ports={unique_dest_ports}, rate={conn_attempts_per_sec}/s). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "port_scan"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0d"
    },
    id: "security.policy_block",
    intent: "security",
    domain: "Security",
    function: "Policy",
    description: "Traffic blocked due to security policy",
    keywords: [
      "policy deny",
      "acl drop",
      "firewall block"
    ],
    signals: [
      {
        metric: "policy_denies",
        op: ">",
        value: 100,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_MISCONFIGURED_RULE",
        description: "Overly restrictive or misconfigured security rule blocking legitimate traffic",
        signals: [
          {
            metric: "policy_denies",
            op: ">",
            value: 100,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "deny",
            weight: 0.3
          },
          {
            keyword: "dropped by policy",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Security device {device} is blocking a high volume of traffic (policy_denies={policy_denies}). This may impact legitimate flows. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "policy_block"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0e"
    },
    id: "security.login_bruteforce",
    intent: "security",
    domain: "Security",
    function: "Authentication",
    description: "Multiple failed login attempts from same source",
    keywords: [
      "bruteforce",
      "login failure",
      "account attack"
    ],
    signals: [
      {
        metric: "auth_failures",
        op: ">",
        value: 50,
        weight: 0.7
      },
      {
        metric: "unique_usernames",
        op: ">",
        value: 5,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_PASSWORD_BRUTEFORCE",
        description: "Attacker attempting to guess passwords on multiple accounts",
        signals: [
          {
            metric: "auth_failures",
            op: ">",
            value: 50,
            weight: 0.7
          },
          {
            metric: "unique_usernames",
            op: ">",
            value: 5,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "invalid credentials",
            weight: 0.3
          },
          {
            keyword: "too many failed attempts",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Authentication system on {device} sees many failed logins (failures={auth_failures}, users={unique_usernames}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "login_bruteforce"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce0f"
    },
    id: "security.malware_detected",
    intent: "security",
    domain: "Security",
    function: "Detection",
    description: "Endpoint or network malware indicator detected",
    keywords: [
      "malware",
      "virus",
      "trojan",
      "endpoint alert"
    ],
    signals: [
      {
        metric: "malware_alerts",
        op: ">",
        value: 1,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_CONFIRMED_MALWARE",
        description: "Malware detected and classified by endpoint or IDS/IPS",
        signals: [
          {
            metric: "malware_alerts",
            op: ">",
            value: 1,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "malware detected",
            weight: 0.3
          },
          {
            keyword: "quarantined file",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Malware detection event raised for {device} (alerts={malware_alerts}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "malware_detected"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce10"
    },
    id: "platform.intent_ambiguous",
    intent: "platform",
    domain: "Platform",
    function: "Intent Quality",
    description: "User query maps to multiple low-confidence intents",
    keywords: [
      "ambiguous intent",
      "overlapping intents",
      "low confidence"
    ],
    signals: [
      {
        metric: "top_intent_score",
        op: "<",
        value: 0.6,
        weight: 0.7
      },
      {
        metric: "intent_score_gap",
        op: "<",
        value: 0.1,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_INTENT_OVERLAP",
        description: "Two or more intents modeled too similarly causing ambiguity",
        signals: [
          {
            metric: "top_intent_score",
            op: "<",
            value: 0.6,
            weight: 0.7
          },
          {
            metric: "intent_score_gap",
            op: "<",
            value: 0.1,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "multiple candidate intents",
            weight: 0.3
          },
          {
            keyword: "intent overlap",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Platform detected ambiguous mapping for input on {device}: top_intent_score={top_intent_score}, gap={intent_score_gap}. Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "intent_ambiguous"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce11"
    },
    id: "platform.correlation_missing",
    intent: "platform",
    domain: "Platform",
    function: "Correlation",
    description: "Correlator unable to link related events into a single situation",
    keywords: [
      "correlation gap",
      "uncorrelated alarms"
    ],
    signals: [
      {
        metric: "raw_events_clustered",
        op: "<",
        value: 2,
        weight: 0.6
      },
      {
        metric: "events_in_window",
        op: ">",
        value: 20,
        weight: 0.4
      }
    ],
    hypotheses: [
      {
        id: "H_TOPOLOGY_MISSING",
        description: "Missing or outdated topology/metadata causing correlation failure",
        signals: [
          {
            metric: "raw_events_clustered",
            op: "<",
            value: 2,
            weight: 0.6
          },
          {
            metric: "events_in_window",
            op: ">",
            value: 20,
            weight: 0.4
          }
        ],
        logPatterns: [
          {
            keyword: "no correlation rule matched",
            weight: 0.3
          },
          {
            keyword: "topology information missing",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Platform sees many raw events (events_in_window={events_in_window}) but few clusters (raw_events_clustered={raw_events_clustered}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "correlation_missing"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce12"
    },
    id: "platform.metric_gaps",
    intent: "platform",
    domain: "Platform",
    function: "Data Quality",
    description: "Significant gaps in metric ingestion for monitored resource",
    keywords: [
      "data gap",
      "missing metrics",
      "telemetry loss"
    ],
    signals: [
      {
        metric: "missing_points_percent",
        op: ">",
        value: 20,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_AGENT_OR_EXPORTER_DOWN",
        description: "Metric agent or exporter stopped sending data",
        signals: [
          {
            metric: "missing_points_percent",
            op: ">",
            value: 20,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "exporter timeout",
            weight: 0.3
          },
          {
            keyword: "scrape failed",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Metrics for {device} show data gaps (missing={missing_points_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "metric_gaps"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce13"
    },
    id: "platform.synthetic_probe_loss",
    intent: "platform",
    domain: "Platform",
    function: "Synthetic",
    description: "Synthetic transaction probes failing on a monitored path",
    keywords: [
      "synthetic failure",
      "probe fail",
      "transaction monitoring"
    ],
    signals: [
      {
        metric: "probe_success_rate",
        op: "<",
        value: 90,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_APP_OR_PATH_DEGRADED",
        description: "Application or path degradation detected via synthetic checks",
        signals: [
          {
            metric: "probe_success_rate",
            op: "<",
            value: 90,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "probe timeout",
            weight: 0.3
          },
          {
            keyword: "transaction failed",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Synthetic probes to {endpoint} are failing (success_rate={probe_success_rate}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "synthetic_probe_loss"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce14"
    },
    id: "thermal.chassis_hot",
    intent: "thermal",
    domain: "Facility",
    function: "Device Thermal",
    description: "Device chassis temperature above safe operating range",
    keywords: [
      "chassis hot",
      "overheat",
      "thermal alarm"
    ],
    signals: [
      {
        metric: "temp_c",
        op: ">",
        value: 70,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_AIRFLOW_BLOCKED",
        description: "Front or rear airflow blocked causing heat buildup",
        signals: [
          {
            metric: "temp_c",
            op: ">",
            value: 70,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "temperature alarm",
            weight: 0.3
          },
          {
            keyword: "over temperature",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Device {device} chassis temperature is high (temp_c={temp_c}°C). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "chassis_hot"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce15"
    },
    id: "thermal.room_hot",
    intent: "thermal",
    domain: "Facility",
    function: "Environmental Heat",
    description: "Room or rack inlet temperature above recommended levels",
    keywords: [
      "room hot",
      "rack hotspot",
      "environment heat"
    ],
    signals: [
      {
        metric: "inlet_temp_c",
        op: ">",
        value: 30,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_HOTSPOT_IN_RACK",
        description: "Local hotspot in rack causing elevated inlet temperature",
        signals: [
          {
            metric: "inlet_temp_c",
            op: ">",
            value: 30,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "rack temperature high",
            weight: 0.3
          },
          {
            keyword: "hot aisle alarm",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Room or rack inlet temperature near {device} is high (inlet_temp_c={inlet_temp_c}°C). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "room_hot"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce16"
    },
    id: "cooling.crac_fault",
    intent: "cooling",
    domain: "Facility",
    function: "Cooling",
    description: "Cooling unit or CRAC reporting a fault condition",
    keywords: [
      "crac fault",
      "cooling failure",
      "hvac"
    ],
    signals: [
      {
        metric: "crac_status",
        op: "==",
        value: "fault",
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_CRAC_FAILED",
        description: "Cooling unit malfunction reducing cold air supply",
        signals: [
          {
            metric: "crac_status",
            op: "==",
            value: "fault",
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "CRAC fault",
            weight: 0.3
          },
          {
            keyword: "cooling failure",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Cooling system near {room} reports a fault (crac_status={crac_status}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "crac_fault"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce17"
    },
    id: "power.redundancy_lost",
    intent: "power",
    domain: "Facility",
    function: "Power",
    description: "Device is running on single power feed due to failure",
    keywords: [
      "power redundancy",
      "single supply",
      "psu failed"
    ],
    signals: [
      {
        metric: "psu_redundant",
        op: "==",
        value: 0,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_SINGLE_PSU_REMAINING",
        description: "One PSU or power feed has failed; device on single supply",
        signals: [
          {
            metric: "psu_redundant",
            op: "==",
            value: 0,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "power supply failed",
            weight: 0.3
          },
          {
            keyword: "running on single PSU",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Device {device} has lost power redundancy (psu_redundant={psu_redundant}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "redundancy_lost"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce18"
    },
    id: "storage.disk_iops_degraded",
    intent: "storage",
    domain: "Storage",
    function: "Disk Health",
    description: "Disk or LUN IOPS capability degraded",
    keywords: [
      "iops",
      "disk slow",
      "storage performance"
    ],
    signals: [
      {
        metric: "disk_iops",
        op: "<",
        value: 500,
        weight: 0.7
      },
      {
        metric: "disk_queue_depth",
        op: ">",
        value: 20,
        weight: 0.3
      }
    ],
    hypotheses: [
      {
        id: "H_BACKEND_CONTENTION",
        description: "Backend disk contention or failing disk slowing I/O",
        signals: [
          {
            metric: "disk_iops",
            op: "<",
            value: 500,
            weight: 0.7
          },
          {
            metric: "disk_queue_depth",
            op: ">",
            value: 20,
            weight: 0.3
          }
        ],
        logPatterns: [
          {
            keyword: "disk latency high",
            weight: 0.3
          },
          {
            keyword: "backend busy",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Storage for {volume} on {device} shows degraded IOPS (disk_iops={disk_iops}, qdepth={disk_queue_depth}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "disk_iops_degraded"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce19"
    },
    id: "storage.volume_near_full",
    intent: "storage",
    domain: "Storage",
    function: "Capacity",
    description: "Storage volume usage nearing full capacity",
    keywords: [
      "volume full",
      "low free space",
      "capacity"
    ],
    signals: [
      {
        metric: "volume_used_percent",
        op: ">",
        value: 90,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_LOG_OR_BACKUP_GROWTH",
        description: "Logs, backups or data growth filling the volume",
        signals: [
          {
            metric: "volume_used_percent",
            op: ">",
            value: 90,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "no space left",
            weight: 0.3
          },
          {
            keyword: "disk quota exceeded",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Volume {volume} on {device} is nearly full (used={volume_used_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "volume_near_full"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1a"
    },
    id: "storage.snapshot_failures",
    intent: "storage",
    domain: "Storage",
    function: "Snapshot",
    description: "Repeated failures in taking storage snapshots",
    keywords: [
      "snapshot failed",
      "backup snapshot"
    ],
    signals: [
      {
        metric: "snapshot_failures",
        op: ">",
        value: 1,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_SNAPSHOT_CONFIG_OR_SPACE",
        description: "Snapshot misconfiguration or insufficient space",
        signals: [
          {
            metric: "snapshot_failures",
            op: ">",
            value: 1,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "snapshot failed",
            weight: 0.3
          },
          {
            keyword: "insufficient space",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Snapshot operations for {volume} on {device} are failing (snapshot_failures={snapshot_failures}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "snapshot_failures"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1b"
    },
    id: "storage.latency_spike",
    intent: "storage",
    domain: "Storage",
    function: "IO Latency",
    description: "Spikes in storage I/O latency",
    keywords: [
      "io latency",
      "slow disk",
      "storage delay"
    ],
    signals: [
      {
        metric: "io_latency_ms",
        op: ">",
        value: 20,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_BACKEND_BUSY",
        description: "Backend array under heavy load causing latency",
        signals: [
          {
            metric: "io_latency_ms",
            op: ">",
            value: 20,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "I/O latency warning",
            weight: 0.3
          },
          {
            keyword: "backend busy",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "I/O latency for {volume} on {device} is high (io_latency_ms={io_latency_ms}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "latency_spike"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1c"
    },
    id: "storage.replication_lag",
    intent: "storage",
    domain: "Storage",
    function: "Replication",
    description: "Storage replication lag exceeding threshold",
    keywords: [
      "replication delay",
      "async mirror",
      "lag"
    ],
    signals: [
      {
        metric: "replication_lag_sec",
        op: ">",
        value: 300,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_LINK_OR_TARGET_SLOW",
        description: "Replication link or target array is slow causing lag",
        signals: [
          {
            metric: "replication_lag_sec",
            op: ">",
            value: 300,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "replication behind",
            weight: 0.3
          },
          {
            keyword: "mirror out of sync",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Replication for {volume} is lagging (replication_lag_sec={replication_lag_sec}s). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "replication_lag"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1d"
    },
    id: "db.down",
    intent: "db",
    domain: "Database",
    function: "Availability",
    description: "Database instance not reachable",
    keywords: [
      "database down",
      "connection refused"
    ],
    signals: [
      {
        metric: "db_up",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_DB_PROCESS_STOPPED",
        description: "Database process stopped or host unreachable",
        signals: [
          {
            metric: "db_up",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "could not connect",
            weight: 0.3
          },
          {
            keyword: "connection refused",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Database {db_name} on {device} is not reachable (db_up={db_up}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "down"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1e"
    },
    id: "db.slow_queries",
    intent: "db",
    domain: "Database",
    function: "Query Performance",
    description: "Slow query rate above normal",
    keywords: [
      "slow query",
      "long running",
      "performance"
    ],
    signals: [
      {
        metric: "slow_queries_per_min",
        op: ">",
        value: 20,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_MISSING_INDEX_OR_PLAN",
        description: "Missing indexes or bad execution plan causing slow queries",
        signals: [
          {
            metric: "slow_queries_per_min",
            op: ">",
            value: 20,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "slow query",
            weight: 0.3
          },
          {
            keyword: "full table scan",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Database {db_name} shows high slow query rate (slow_queries_per_min={slow_queries_per_min}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "slow_queries"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce1f"
    },
    id: "db.replication_delay",
    intent: "db",
    domain: "Database",
    function: "Replication",
    description: "Database replication delay above threshold",
    keywords: [
      "replica lag",
      "replication delay"
    ],
    signals: [
      {
        metric: "db_replication_delay_sec",
        op: ">",
        value: 120,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_REPLICA_UNDERPOWERED",
        description: "Replica instance not able to keep up with primary write rate",
        signals: [
          {
            metric: "db_replication_delay_sec",
            op: ">",
            value: 120,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "replication delay",
            weight: 0.3
          },
          {
            keyword: "seconds behind master",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Database replication for {db_name} is delayed (db_replication_delay_sec={db_replication_delay_sec}s). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "replication_delay"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce20"
    },
    id: "db.tablespace_full",
    intent: "db",
    domain: "Database",
    function: "Capacity",
    description: "Database tablespace nearing full utilization",
    keywords: [
      "tablespace full",
      "db space",
      "segment growth"
    ],
    signals: [
      {
        metric: "tablespace_used_percent",
        op: ">",
        value: 90,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_TABLE_OR_INDEX_GROWTH",
        description: "Table or index growth filling tablespace",
        signals: [
          {
            metric: "tablespace_used_percent",
            op: ">",
            value: 90,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "unable to extend",
            weight: 0.3
          },
          {
            keyword: "no space left in tablespace",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Tablespace for {db_name} is nearly full (used={tablespace_used_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "tablespace_full"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce21"
    },
    id: "db.backup_failed",
    intent: "db",
    domain: "Database",
    function: "Backup",
    description: "Database backup job failure detected",
    keywords: [
      "backup failed",
      "db backup",
      "job error"
    ],
    signals: [
      {
        metric: "db_backup_success",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_BACKUP_JOB_OR_STORAGE_ISSUE",
        description: "Backup job misconfigured or target storage unavailable",
        signals: [
          {
            metric: "db_backup_success",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "backup job failed",
            weight: 0.3
          },
          {
            keyword: "cannot write backup",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Database backup for {db_name} failed (db_backup_success={db_backup_success}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "backup_failed"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce22"
    },
    id: "mq.queue_depth_high",
    intent: "mq",
    domain: "Middleware",
    function: "Queue Health",
    description: "Message queue depth above threshold",
    keywords: [
      "queue depth",
      "message backlog",
      "mq delay"
    ],
    signals: [
      {
        metric: "queue_depth",
        op: ">",
        value: 1000,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_CONSUMERS_SLOW_OR_DOWN",
        description: "Consumers not processing messages fast enough",
        signals: [
          {
            metric: "queue_depth",
            op: ">",
            value: 1000,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "consumer lagging",
            weight: 0.3
          },
          {
            keyword: "queue depth high",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Queue {queue} on {device} has high depth (queue_depth={queue_depth}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "queue_depth_high"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce23"
    },
    id: "mq.broker_unreachable",
    intent: "mq",
    domain: "Middleware",
    function: "Broker Health",
    description: "Message broker not reachable from clients",
    keywords: [
      "broker down",
      "mq unavailable"
    ],
    signals: [
      {
        metric: "broker_up",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_BROKER_PROCESS_OR_NETWORK",
        description: "Broker process down or network connectivity problem",
        signals: [
          {
            metric: "broker_up",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "connection refused",
            weight: 0.3
          },
          {
            keyword: "broker not responding",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Message broker {broker} is unreachable (broker_up={broker_up}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "broker_unreachable"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce24"
    },
    id: "txn.failure_rate_high",
    intent: "txn",
    domain: "Middleware",
    function: "Transaction Health",
    description: "Application transaction failure rate above normal",
    keywords: [
      "transaction failure",
      "error rate",
      "api errors"
    ],
    signals: [
      {
        metric: "txn_error_rate_percent",
        op: ">",
        value: 5,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_DOWNSTREAM_DEPENDENCY",
        description: "Downstream dependency or service causing transaction errors",
        signals: [
          {
            metric: "txn_error_rate_percent",
            op: ">",
            value: 5,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "500 Internal Server Error",
            weight: 0.3
          },
          {
            keyword: "timeout while calling",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Transaction failure rate for {service} is elevated (txn_error_rate_percent={txn_error_rate_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "failure_rate_high"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce25"
    },
    id: "lb.vip_down",
    intent: "lb",
    domain: "Load Balancer",
    function: "VIP Availability",
    description: "Virtual IP (VIP) not reachable",
    keywords: [
      "vip down",
      "virtual service down"
    ],
    signals: [
      {
        metric: "vip_up",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_ALL_POOL_MEMBERS_DOWN",
        description: "All backend pool members for this VIP are down",
        signals: [
          {
            metric: "vip_up",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "no available pool members",
            weight: 0.3
          },
          {
            keyword: "virtual server disabled",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Load balancer VIP {vip} on {device} is down (vip_up={vip_up}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "vip_down"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce26"
    },
    id: "lb.pool_members_down",
    intent: "lb",
    domain: "Load Balancer",
    function: "Pool Health",
    description: "Significant portion of pool members are down",
    keywords: [
      "pool member down",
      "health check failed"
    ],
    signals: [
      {
        metric: "pool_down_members_percent",
        op: ">",
        value: 50,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_BACKEND_SERVICE_OUTAGE",
        description: "Backend service failure affecting many pool members",
        signals: [
          {
            metric: "pool_down_members_percent",
            op: ">",
            value: 50,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "health check failed",
            weight: 0.3
          },
          {
            keyword: "pool member marked down",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Pool {pool} on {device} has many members down (pool_down_members_percent={pool_down_members_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "pool_members_down"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce27"
    },
    id: "lb.session_drop",
    intent: "lb",
    domain: "Load Balancer",
    function: "Session Quality",
    description: "Client sessions being dropped or reset unexpectedly",
    keywords: [
      "session reset",
      "connection reset",
      "lb drops"
    ],
    signals: [
      {
        metric: "session_resets_per_min",
        op: ">",
        value: 50,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_IDLE_OR_TIMEOUT_MISCONFIG",
        description: "Session idle timeout or TCP settings causing resets",
        signals: [
          {
            metric: "session_resets_per_min",
            op: ">",
            value: 50,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "connection reset",
            weight: 0.3
          },
          {
            keyword: "idle timeout",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Load balancer {device} is resetting many sessions (session_resets_per_min={session_resets_per_min}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "session_drop"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce28"
    },
    id: "lb.ssl_error_rate",
    intent: "lb",
    domain: "Load Balancer",
    function: "SSL Health",
    description: "High rate of SSL/TLS handshake errors",
    keywords: [
      "ssl error",
      "tls handshake",
      "certificate"
    ],
    signals: [
      {
        metric: "ssl_handshake_errors_per_min",
        op: ">",
        value: 20,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_CERT_OR_CIPHER_MISMATCH",
        description: "Certificate issue or cipher mismatch causing handshake failures",
        signals: [
          {
            metric: "ssl_handshake_errors_per_min",
            op: ">",
            value: 20,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "handshake failure",
            weight: 0.3
          },
          {
            keyword: "unsupported protocol",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "SSL/TLS errors on {device} are elevated (ssl_handshake_errors_per_min={ssl_handshake_errors_per_min}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "ssl_error_rate"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce29"
    },
    id: "lb.misrouting",
    intent: "lb",
    domain: "Load Balancer",
    function: "Routing",
    description: "Traffic being routed to unexpected or wrong backend",
    keywords: [
      "wrong backend",
      "misrouting",
      "policy mismatch"
    ],
    signals: [
      {
        metric: "policy_mismatch_hits",
        op: ">",
        value: 10,
        weight: 0.7
      }
    ],
    hypotheses: [
      {
        id: "H_L7_RULE_MISCONFIG",
        description: "Incorrect L7 routing rule causing misrouted requests",
        signals: [
          {
            metric: "policy_mismatch_hits",
            op: ">",
            value: 10,
            weight: 0.7
          }
        ],
        logPatterns: [
          {
            keyword: "no matching policy",
            weight: 0.3
          },
          {
            keyword: "default pool used",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Load balancer {device} is misrouting some requests (policy_mismatch_hits={policy_mismatch_hits}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "misrouting"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce2a"
    },
    id: "sdwan.transport_degraded",
    intent: "sdwan",
    domain: "SD-WAN",
    function: "Transport Health",
    description: "Underlay transport showing high loss or latency",
    keywords: [
      "underlay loss",
      "transport degraded"
    ],
    signals: [
      {
        metric: "transport_latency_ms",
        op: ">",
        value: 100,
        weight: 0.6
      },
      {
        metric: "transport_loss_percent",
        op: ">",
        value: 2,
        weight: 0.4
      }
    ],
    hypotheses: [
      {
        id: "H_ISP_ISSUE",
        description: "ISP or underlay provider experiencing degradation",
        signals: [
          {
            metric: "transport_latency_ms",
            op: ">",
            value: 100,
            weight: 0.6
          },
          {
            metric: "transport_loss_percent",
            op: ">",
            value: 2,
            weight: 0.4
          }
        ],
        logPatterns: [
          {
            keyword: "underlay degraded",
            weight: 0.3
          },
          {
            keyword: "transport path issue",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "SD-WAN transport path for {site} is degraded (latency={transport_latency_ms} ms, loss={transport_loss_percent}%). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "transport_degraded"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce2b"
    },
    id: "sdwan.tunnel_flap",
    intent: "sdwan",
    domain: "SD-WAN",
    function: "Overlay Health",
    description: "SD-WAN overlay tunnel flapping between peers",
    keywords: [
      "tunnel down",
      "overlay flap"
    ],
    signals: [
      {
        metric: "tunnel_state_changes",
        op: ">",
        value: 3,
        weight: 0.8
      }
    ],
    hypotheses: [
      {
        id: "H_UNDERLAY_UNSTABLE",
        description: "Underlying transport instability causing tunnel flaps",
        signals: [
          {
            metric: "tunnel_state_changes",
            op: ">",
            value: 3,
            weight: 0.8
          }
        ],
        logPatterns: [
          {
            keyword: "tunnel down",
            weight: 0.3
          },
          {
            keyword: "keepalive failure",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "SD-WAN tunnel between {site} and {peer_site} is flapping (tunnel_state_changes={tunnel_state_changes}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "tunnel_flap"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce2c"
    },
    id: "sdwan.controller_unreachable",
    intent: "sdwan",
    domain: "SD-WAN",
    function: "Control Plane",
    description: "Edge device unable to reach SD-WAN controller",
    keywords: [
      "controller down",
      "orchestrator unreachable"
    ],
    signals: [
      {
        metric: "controller_up",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_CONTROLLER_OR_CONTROL_LINK",
        description: "Controller outage or control path connectivity issue",
        signals: [
          {
            metric: "controller_up",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "controller not reachable",
            weight: 0.3
          },
          {
            keyword: "control connection lost",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "SD-WAN edge {device} cannot reach controller (controller_up={controller_up}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "controller_unreachable"
  },
  {
    _id: {
      $oid: "693811d3a4cd14665b75ce2d"
    },
    id: "sdwan.branch_down",
    intent: "sdwan",
    domain: "SD-WAN",
    function: "Branch Connectivity",
    description: "Branch site unreachable over SD-WAN fabric",
    keywords: [
      "branch down",
      "site unreachable"
    ],
    signals: [
      {
        metric: "branch_reachable",
        op: "==",
        value: 0,
        weight: 0.9
      }
    ],
    hypotheses: [
      {
        id: "H_EDGE_DEVICE_OR_ACCESS_CIRCUIT",
        description: "Branch edge device down or access circuit failure",
        signals: [
          {
            metric: "branch_reachable",
            op: "==",
            value: 0,
            weight: 0.9
          }
        ],
        logPatterns: [
          {
            keyword: "site down",
            weight: 0.3
          },
          {
            keyword: "branch offline",
            weight: 0.3
          }
        ]
      }
    ],
    situationDesc: "Branch {site} is unreachable via SD-WAN (branch_reachable={branch_reachable}). Top hypothesis: {top_hypothesis} (score={prior}).",
    subIntent: "branch_down"
  }
];

// KB Categories for navigation
export const mockKBCategories = [
  {
    id: 'network-kb',
    name: 'Network Intelligence',
    subcategories: [
      'Connectivity', 
      'Routing', 
      'Switching', 
      'Wireless', 
      'WAN', 
      'Security', 
      'Performance', 
      'Monitoring'
    ],
    articleCount: 4
  },
  {
    id: 'database-kb',
    name: 'Database',
    subcategories: ['Connection Management', 'Performance', 'Replication'],
    articleCount: 1
  },
  {
    id: 'compute-kb',
    name: 'Compute',
    subcategories: ['CPU', 'Memory', 'Process Management'],
    articleCount: 2
  },
  {
    id: 'storage-kb',
    name: 'Storage',
    subcategories: ['Disk', 'I/O Operations'],
    articleCount: 1
  }
];

export const mockKBArticlesEnhanced: KBArticle[] = [
  {
    id: 'kb-net-001',
    title: 'Troubleshooting SD-WAN Packet Loss',
    category: 'Network Intelligence',
    subcategory: 'WAN',
    content: 'Comprehensive guide for diagnosing and resolving packet loss over SD-WAN underlay and overlay tunnels...',
    problem: 'Branch unreachable or performance degraded due to transport-layer packet loss.',
    area: 'SD-WAN Fabric',
    remedyItems: [
      'Check underlay transport health and switch to secondary path if loss exceeds 2%.',
      'Verify MTU/MSS settings to prevent fragmentation-induced loss.',
      'Investigate edge device CPU/Memory pressure.'
    ],
    tags: ['sd-wan', 'packet-loss', 'wan'],
    linkedIntents: ['sdwan.transport_degraded', 'sdwan.branch_down'],
    lastUpdated: '2026-03-01T00:00:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-net-002',
    title: 'Resolving External BGP Flaps',
    category: 'Network Intelligence',
    subcategory: 'Routing',
    content: 'Diagnosis and remediation steps for BGP sessions that frequently restart...',
    problem: 'BGP sessions flapping causing route instability and traffic drops.',
    area: 'Core Routing',
    remedyItems: [
      'Check physical interface errors (CRC/Runts) on peering links.',
      'Verify hold-time and keepalive timer consistency between peers.',
      'Analyze peer CPU load and incoming route advertisements for churn.'
    ],
    tags: ['bgp', 'routing', 'flapping'],
    linkedIntents: ['performance.congestion', 'link.network_latency'],
    lastUpdated: '2026-02-15T00:00:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-db-001',
    title: 'Managing MySQL Replication Delay',
    category: 'Database',
    subcategory: 'Replication',
    content: 'Steps to reduce lag between primary and replica database instances...',
    problem: 'Replication lag exceeds 120 seconds, causing stale reads on replicas.',
    area: 'Database Replicas',
    remedyItems: [
      'Check disk I/O performance on the replica instance.',
      'Optimize long-running write queries on the primary.',
      'Increase thread count for parallel replication if supported.'
    ],
    tags: ['mysql', 'replication', 'database'],
    linkedIntents: ['db.replication_delay'],
    lastUpdated: '2026-01-10T12:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-comp-001',
    title: 'CPU Spike Analysis on Linux Hosts',
    category: 'Compute',
    subcategory: 'CPU',
    content: 'General methodology for identifying processes causing CPU exhaustion...',
    problem: 'Sustained CPU usage above 90% impacting application responsiveness.',
    area: 'Compute Instances',
    remedyItems: [
      'Use "top" or "htop" to identify high-consumption PID.',
      'Check for runaway background jobs or cron processes.',
      'Profile application if a single process is consuming excessive resources.'
    ],
    tags: ['cpu', 'linux', 'performance'],
    linkedIntents: ['system.cpu_spike'],
    lastUpdated: '2026-03-05T09:00:00Z',
    effectiveness: 87
  },
  {
    id: 'kb-store-001',
    title: 'Resolving Disk IOPS Contention',
    category: 'Storage',
    subcategory: 'Disk',
    content: 'Dealing with heavy backend array load affecting LUN performance...',
    problem: 'High I/O latency (avg > 20ms) causing application timeouts.',
    area: 'Storage Area Network',
    remedyItems: [
      'Redistribute heavy I/O workloads to different storage tiers.',
      'Check for snapshot operations or backups causing temporary IOPS spikes.',
      'Identify and throttle processes generating excessive small random I/O.'
    ],
    tags: ['storage', 'iops', 'latency'],
    linkedIntents: ['storage.latency_spike', 'storage.disk_iops_degraded'],
    lastUpdated: '2026-02-28T14:00:00Z',
    effectiveness: 93
  },
  {
      id: 'kb-net-003',
      title: 'Wireless Client Authentication Failures',
      category: 'Network Intelligence',
      subcategory: 'Wireless',
      content: 'Troubleshooting steps for 802.1X and EAP failures in enterprise Wi-Fi networks...',
      problem: 'Multiple users unable to authenticate with RADIUS server on corporate SSID.',
      area: 'WLAN Infrastructure',
      remedyItems: [
          'Verify RADIUS server reachability from WLAN controller.',
          'Check RADIUS shared secret consistency and certificate validity.',
          'Validate client-side credentials and certificate trust chain.'
      ],
      tags: ['wifi', 'wireless', 'authentication', 'radius'],
      linkedIntents: ['wireless.client_auth_failure'],
      lastUpdated: '2026-03-10T11:00:00Z',
      effectiveness: 90
  },
  {
      id: 'kb-net-004',
      title: 'DDoS Traffic Mitigation Strategy',
      category: 'Network Intelligence',
      subcategory: 'Security',
      content: 'Standard operating procedure for responding to large-scale inbound DDoS attacks...',
      problem: 'External traffic flood overwhelming edge links and firewall resources.',
      area: 'Network Perimeter',
      remedyItems: [
          'Activate cloud-based scrubbers or BGP FlowSpec rules.',
          'Implement rate-limiting on perimeter interfaces for targeted destination IPs.',
          'Analyze traffic headers for common attack signatures to refine ACLs.'
      ],
      tags: ['ddos', 'security', 'mitigation'],
      linkedIntents: ['security.policy_block'],
      lastUpdated: '2026-03-12T15:30:00Z',
      effectiveness: 96
  },
  {
      id: 'kb-comp-002',
      title: 'Container CrashLoopBackOff Resolution',
      category: 'Compute',
      subcategory: 'Process Management',
      content: 'Debugging guide for Kubernetes pods stuck in restart loops...',
      problem: 'Containers repeatedly crashing on startup due to config errors or missing dependencies.',
      area: 'Container Platform',
      remedyItems: [
          'Examine container logs using "kubectl logs --previous".',
          'Check environment variable completeness and secret availability.',
          'Verify resource limits (CPU/MEM) are not causing immediate OOM kills.'
      ],
      tags: ['k8s', 'containers', 'crashloop'],
      linkedIntents: ['container.restart_loop'],
      lastUpdated: '2026-03-08T10:15:00Z',
      effectiveness: 92
  }
];

// Auto Remediation Permissions
export const mockRemediationPermissions: RemediationPermission[] = [
  {
    id: 'perm-001',
    name: 'Auto-restart Failed Services',
    description: 'Allow automatic restart of failed services after detection',
    category: 'Service Management',
    riskLevel: 'low',
    approved: true,
    approvedBy: 'admin@company.com',
    approvedAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'perm-002',
    name: 'Clear Connection Pools',
    description: 'Automatically clear and reset database connection pools when exhausted',
    category: 'Database',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'dba@company.com',
    approvedAt: '2025-12-28T14:30:00Z'
  },
  {
    id: 'perm-003',
    name: 'Failover to Secondary',
    description: 'Trigger automatic failover to secondary systems during primary outages',
    category: 'High Availability',
    riskLevel: 'high',
    approved: false
  },
  {
    id: 'perm-004',
    name: 'Scale Up Resources',
    description: 'Automatically scale compute resources during high load',
    category: 'Auto Scaling',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'ops@company.com',
    approvedAt: '2025-12-20T09:00:00Z'
  },
  {
    id: 'perm-005',
    name: 'Execute Playbooks',
    description: 'Allow execution of pre-defined remediation playbooks',
    category: 'Automation',
    riskLevel: 'medium',
    approved: false
  },
  {
    id: 'perm-006',
    name: 'Network Failover',
    description: 'Trigger network path failover during connectivity issues',
    category: 'Network',
    riskLevel: 'high',
    approved: false
  },
  {
    id: 'perm-007',
    name: 'Kill Runaway Processes',
    description: 'Automatically terminate processes consuming excessive resources',
    category: 'Process Management',
    riskLevel: 'medium',
    approved: true,
    approvedBy: 'ops@company.com',
    approvedAt: '2026-01-05T11:00:00Z'
  },
  {
    id: 'perm-008',
    name: 'Rollback Deployments',
    description: 'Automatically rollback to previous deployment on failure detection',
    category: 'Deployment',
    riskLevel: 'high',
    approved: false
  }
];
