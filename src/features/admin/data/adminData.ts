import { IntentFull, IntentCategory, KBArticle, RemediationPermission } from '@/shared/types';

// Intent Categories and Subcategories
export const mockIntentCategories: IntentCategory[] = [
  {
    id: 'network',
    name: 'Network Infrastructure',
    domain: 'Network',
    subcategories: [
      { id: 'connectivity', name: 'Connectivity', function: 'Reachability & Flow', intentCount: 5 },
      { id: 'routing', name: 'Routing Protocols', function: 'Path Vector & IGP', intentCount: 6 },
      { id: 'switching', name: 'Switching Fabric', function: 'L2 Control & Data', intentCount: 4 },
      { id: 'interface', name: 'Physical Interfaces', function: 'Link Integrity', intentCount: 3 },
    ]
  },
  {
    id: 'services',
    name: 'Core Services',
    domain: 'Services',
    subcategories: [
      { id: 'dns', name: 'DNS', function: 'Name Resolution', intentCount: 2 },
      { id: 'dhcp', name: 'DHCP', function: 'IP Management', intentCount: 2 },
    ]
  },
  {
    id: 'performance',
    name: 'Performance & QoS',
    domain: 'Performance',
    subcategories: [
      { id: 'latency', name: 'Latency & Jitter', function: 'Quality of Experience', intentCount: 3 },
      { id: 'bandwidth', name: 'Throughput', function: 'Congestion Management', intentCount: 2 },
    ]
  },
  {
    id: 'security',
    name: 'Security & VPN',
    domain: 'Security',
    subcategories: [
      { id: 'acl', name: 'Access Control', function: 'Security Policy', intentCount: 3 },
      { id: 'vpn', name: 'VPN Gateway', function: 'Secure Transport', intentCount: 4 },
    ]
  }
];

// Full Intent Data
export const mockIntentsFull: IntentFull[] = [
  {
    _id: { $oid: '69381e8e2c85e919f613923f' },
    id: 'connectivity.host_down',
    intent: 'connectivity',
    subIntent: 'host_down',
    domain: 'Network',
    function: 'Reachability',
    description: 'A monitored device is unreachable from the NMS poller',
    keywords: ['host down', 'unreachable', 'snmp timeout', 'icmp fail', 'device offline'],
    signals: [
      { metric: 'icmp_reachability', op: '==', value: 0, weight: 0.5 },
      { metric: 'snmp_poll_success', op: '==', value: 0, weight: 0.4 },
      { metric: 'interface_oper_status', op: '==', value: 0, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_HOST_DOWN_SNMP_BLOCKED',
        description: 'SNMP or ICMP is blocked by an ACL or firewall between NMS and device',
        signals: [
          { metric: 'icmp_reachability', op: '==', value: 0, weight: 0.5 },
          { metric: 'snmp_poll_success', op: '==', value: 0, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'access-list deny', weight: 0.4 },
          { keyword: 'snmp timeout', weight: 0.4 },
          { keyword: 'ACL drop', weight: 0.3 }
        ]
      },
      {
        id: 'H_HOST_DOWN_INTERFACE_DOWN',
        description: 'Physical or logical interface on the device is down',
        signals: [
          { metric: 'interface_oper_status', op: '==', value: 0, weight: 0.6 },
          { metric: 'interface_admin_status', op: '==', value: 1, weight: 0.3 }
        ],
        logPatterns: [
          { keyword: 'line protocol is down', weight: 0.5 },
          { keyword: 'interface down', weight: 0.4 },
          { keyword: 'link down', weight: 0.3 }
        ]
      },
      {
        id: 'H_HOST_DOWN_ROUTING',
        description: 'No routing path exists from poller to the device management IP',
        signals: [
          { metric: 'icmp_reachability', op: '==', value: 0, weight: 0.5 },
          { metric: 'route_exists', op: '==', value: 0, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'unreachable', weight: 0.4 },
          { keyword: 'no route to host', weight: 0.5 },
          { keyword: 'VRF mismatch', weight: 0.3 }
        ]
      }
    ],
    situationDesc: 'Device {device} is showing Host Down in NMS. ICMP reachability={icmp_reachability}, SNMP poll success={snmp_poll_success}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-001 for remediation steps.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139240' },
    id: 'connectivity.packet_loss',
    intent: 'connectivity',
    subIntent: 'packet_loss',
    domain: 'Network',
    function: 'Data Plane',
    description: 'Intermittent packet loss detected on a path to a site or segment',
    keywords: ['packet loss', 'drops', 'latency', 'intermittent', 'CRC', 'congestion'],
    signals: [
      { metric: 'icmp_loss_percent', op: '>', value: 1, weight: 0.5 },
      { metric: 'interface_output_drops', op: '>', value: 50, weight: 0.4 },
      { metric: 'crc_errors', op: '>', value: 10, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_PKTLOSS_LINK_ERRORS',
        description: 'Physical layer errors (CRC, giants) on the interface causing frame drops',
        signals: [
          { metric: 'crc_errors', op: '>', value: 100, weight: 0.6 },
          { metric: 'interface_output_drops', op: '>', value: 50, weight: 0.3 }
        ],
        logPatterns: [
          { keyword: 'CRC error', weight: 0.5 },
          { keyword: 'input errors', weight: 0.4 },
          { keyword: 'duplex mismatch', weight: 0.3 }
        ]
      },
      {
        id: 'H_PKTLOSS_CONGESTION',
        description: 'Queue congestion causing tail-drop on the egress interface',
        signals: [
          { metric: 'interface_output_drops', op: '>', value: 200, weight: 0.6 },
          { metric: 'interface_utilization_percent', op: '>', value: 85, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'output drops', weight: 0.5 },
          { keyword: 'queue full', weight: 0.4 },
          { keyword: 'WRED discard', weight: 0.3 }
        ]
      }
    ],
    situationDesc: 'Packet loss detected toward {device}. Loss={icmp_loss_percent}%, output_drops={interface_output_drops}, CRC={crc_errors}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-002.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139241' },
    id: 'services.dns_failure',
    intent: 'services',
    subIntent: 'dns_failure',
    domain: 'Network',
    function: 'Name Resolution',
    description: 'DNS resolution failing for clients — server not responding or incorrect responses',
    keywords: ['dns failure', 'nxdomain', 'dns timeout', 'name resolution', 'dns server down'],
    signals: [
      { metric: 'dns_query_success_rate', op: '<', value: 95, weight: 0.6 },
      { metric: 'udp_53_reachability', op: '==', value: 0, weight: 0.5 },
      { metric: 'nxdomain_rate', op: '>', value: 10, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_DNS_SERVER_DOWN',
        description: 'DNS server process has crashed or the host is unreachable',
        signals: [
          { metric: 'udp_53_reachability', op: '==', value: 0, weight: 0.6 },
          { metric: 'dns_query_success_rate', op: '<', value: 10, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'DNS service stopped', weight: 0.5 },
          { keyword: 'named crashed', weight: 0.5 },
          { keyword: 'connection refused port 53', weight: 0.4 }
        ]
      }
    ],
    situationDesc: 'DNS resolution failing. Query success rate={dns_query_success_rate}%, UDP 53 reachable={udp_53_reachability}, NXDOMAIN rate={nxdomain_rate}/min. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-003.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139242' },
    id: 'services.dhcp_failure',
    intent: 'services',
    subIntent: 'dhcp_failure',
    domain: 'Network',
    function: 'IP Address Management',
    description: 'Clients unable to obtain IP addresses via DHCP',
    keywords: ['dhcp timeout', 'no ip address', 'dhcp fail', 'ip-helper', 'scope exhausted'],
    signals: [
      { metric: 'dhcp_discover_no_offer_count', op: '>', value: 5, weight: 0.6 },
      { metric: 'dhcp_pool_utilization_percent', op: '>', value: 90, weight: 0.5 },
      { metric: 'udp_67_reachability', op: '==', value: 0, weight: 0.4 }
    ],
    hypotheses: [
      {
        id: 'H_DHCP_POOL_EXHAUSTED',
        description: 'DHCP address pool is full — no IPs available to lease',
        signals: [
          { metric: 'dhcp_pool_utilization_percent', op: '>', value: 95, weight: 0.8 },
          { metric: 'dhcp_discover_no_offer_count', op: '>', value: 10, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'DHCP pool exhausted', weight: 0.6 },
          { keyword: 'no available address', weight: 0.5 },
          { keyword: 'pool utilization 100%', weight: 0.5 }
        ]
      }
    ],
    situationDesc: 'DHCP failure detected. Discover-no-offer count={dhcp_discover_no_offer_count}, pool utilization={dhcp_pool_utilization_percent}%, relay path={udp_67_reachability}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-004.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139243' },
    id: 'routing.bgp_flap',
    intent: 'routing',
    subIntent: 'bgp_flap',
    domain: 'Network',
    function: 'Routing Protocol',
    description: 'BGP session with ISP or peer is repeatedly dropping and re-establishing',
    keywords: ['bgp flap', 'bgp session down', 'neighbor reset', 'hold timer expired', 'max-prefix'],
    signals: [
      { metric: 'bgp_session_state', op: '==', value: 0, weight: 0.7 },
      { metric: 'bgp_flap_count', op: '>', value: 3, weight: 0.5 },
      { metric: 'interface_error_rate', op: '>', value: 10, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_BGP_PHYSICAL_LINK',
        description: 'Physical link instability causing BGP TCP session drops',
        signals: [
          { metric: 'interface_error_rate', op: '>', value: 50, weight: 0.6 },
          { metric: 'bgp_flap_count', op: '>', value: 5, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'line protocol down', weight: 0.5 },
          { keyword: 'TCP reset', weight: 0.4 },
          { keyword: 'BGP session closed', weight: 0.4 }
        ]
      },
      {
        id: 'H_BGP_MAX_PREFIX',
        description: 'Max-prefix limit hit causing session teardown',
        signals: [
          { metric: 'bgp_prefix_count', op: '>', value: 950, weight: 0.6 },
          { metric: 'bgp_session_state', op: '==', value: 0, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'maximum prefix limit reached', weight: 0.7 },
          { keyword: 'CEASE max-prefix', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'BGP session to {peer} is flapping. Session state={bgp_session_state}, flap count={bgp_flap_count}, prefix count={bgp_prefix_count}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-005.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139244' },
    id: 'routing.ospf_stuck',
    intent: 'routing',
    subIntent: 'ospf_stuck',
    domain: 'Network',
    function: 'Routing Protocol',
    description: 'OSPF neighbor stuck in EXSTART or EXCHANGE state — adjacency not forming',
    keywords: ['ospf exstart', 'ospf exchange', 'ospf neighbor stuck', 'ospf adjacency'],
    signals: [
      { metric: 'ospf_neighbor_state', op: '==', value: 5, weight: 0.8 },
      { metric: 'ospf_mtu_mismatch', op: '==', value: 1, weight: 0.5 },
      { metric: 'ospf_dd_retransmit_count', op: '>', value: 3, weight: 0.4 }
    ],
    hypotheses: [
      {
        id: 'H_OSPF_MTU_MISMATCH',
        description: 'MTU mismatch between OSPF peers causing DBD exchange to fail',
        signals: [
          { metric: 'ospf_mtu_mismatch', op: '==', value: 1, weight: 0.8 },
          { metric: 'ospf_dd_retransmit_count', op: '>', value: 3, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'MTU mismatch', weight: 0.7 },
          { keyword: 'OSPF DD retransmit', weight: 0.4 }
        ]
      }
    ],
    situationDesc: 'OSPF neighbor {peer} on {device} is stuck in state={ospf_neighbor_state}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-006.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139245' },
    id: 'switching.stp_instability',
    intent: 'switching',
    subIntent: 'stp_instability',
    domain: 'Network',
    function: 'Layer 2 Control Plane',
    description: 'STP topology changes causing intermittent access outages or broadcast storms',
    keywords: ['stp', 'topology change', 'tcn', 'root bridge', 'bpdu guard', 'loop'],
    signals: [
      { metric: 'stp_tcn_count', op: '>', value: 10, weight: 0.6 },
      { metric: 'stp_root_change_count', op: '>', value: 1, weight: 0.7 },
      { metric: 'broadcast_rate_pps', op: '>', value: 5000, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_STP_LOOP',
        description: 'Physical loop detected causing broadcast storm and MAC thrashing',
        signals: [
          { metric: 'broadcast_rate_pps', op: '>', value: 10000, weight: 0.7 },
          { metric: 'stp_tcn_count', op: '>', value: 50, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'MAC flap detected', weight: 0.6 },
          { keyword: 'broadcast storm', weight: 0.7 }
        ]
      }
    ],
    situationDesc: 'STP instability on {device}. TCN count={stp_tcn_count}, root changes={stp_root_change_count}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-007.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139246' },
    id: 'switching.vlan_gateway_unreachable',
    intent: 'switching',
    subIntent: 'vlan_gateway_unreachable',
    domain: 'Network',
    function: 'Layer 2/3 Gateway',
    description: 'Hosts in a VLAN cannot reach their default gateway',
    keywords: ['vlan gateway', 'svi down', 'hsrp', 'vrrp', 'trunk missing vlan'],
    signals: [
      { metric: 'svi_line_protocol', op: '==', value: 0, weight: 0.7 },
      { metric: 'vlan_on_trunk', op: '==', value: 0, weight: 0.6 },
      { metric: 'hsrp_state_active', op: '==', value: 0, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_VLAN_TRUNK_MISSING',
        description: 'VLAN not permitted on the trunk link between access and distribution switch',
        signals: [
          { metric: 'vlan_on_trunk', op: '==', value: 0, weight: 0.8 }
        ],
        logPatterns: [
          { keyword: 'VLAN not allowed on trunk', weight: 0.7 },
          { keyword: 'native VLAN mismatch', weight: 0.4 }
        ]
      }
    ],
    situationDesc: 'Hosts in VLAN {vlan_id} cannot reach gateway. SVI state={svi_line_protocol}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-008.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139247' },
    id: 'interface.crc_errors',
    intent: 'interface',
    subIntent: 'crc_errors',
    domain: 'Network',
    function: 'Physical Layer',
    description: 'CRC errors increasing on an uplink interface indicating physical layer issues',
    keywords: ['crc errors', 'input errors', 'giants', 'runts', 'bad cable', 'sfp', 'duplex mismatch'],
    signals: [
      { metric: 'crc_errors_per_min', op: '>', value: 10, weight: 0.7 },
      { metric: 'input_errors_total', op: '>', value: 100, weight: 0.5 },
      { metric: 'duplex_mismatch', op: '==', value: 1, weight: 0.4 }
    ],
    hypotheses: [
      {
        id: 'H_CRC_BAD_CABLE_SFP',
        description: 'Faulty patch cable or SFP transceiver causing physical bit errors',
        signals: [
          { metric: 'crc_errors_per_min', op: '>', value: 50, weight: 0.7 },
          { metric: 'optical_rx_power_dbm', op: '<', value: -20, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'CRC error', weight: 0.6 },
          { keyword: 'optical power low', weight: 0.5 }
        ]
      }
    ],
    situationDesc: 'CRC errors on {device} interface {interface}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-009.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139248' },
    id: 'interface.port_flap',
    intent: 'interface',
    subIntent: 'port_flap',
    domain: 'Network',
    function: 'Physical Layer',
    description: 'Access port repeatedly cycling up and down',
    keywords: ['port flap', 'link up down', 'errdisable', 'PoE', 'loose cable'],
    signals: [
      { metric: 'link_flap_count_per_hour', op: '>', value: 3, weight: 0.7 },
      { metric: 'poe_power_deny_count', op: '>', value: 0, weight: 0.4 },
      { metric: 'errdisable_triggered', op: '==', value: 1, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_FLAP_LOOSE_CABLE',
        description: 'Loose or damaged patch cable causing intermittent link loss',
        signals: [
          { metric: 'link_flap_count_per_hour', op: '>', value: 5, weight: 0.7 }
        ],
        logPatterns: [
          { keyword: 'link up', weight: 0.3 },
          { keyword: 'link down', weight: 0.3 }
        ]
      }
    ],
    situationDesc: 'Port {interface} on {device} is flapping. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-010.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139249' },
    id: 'performance.voip_jitter',
    intent: 'performance',
    subIntent: 'voip_jitter',
    domain: 'Network',
    function: 'QoS',
    description: 'High jitter causing degraded VoIP call quality',
    keywords: ['voip jitter', 'mos score', 'voice quality', 'dscp', 'qos', 'llq'],
    signals: [
      { metric: 'ipsla_jitter_ms', op: '>', value: 30, weight: 0.7 },
      { metric: 'ipsla_mos_score', op: '<', value: 3.5, weight: 0.6 },
      { metric: 'voice_queue_drops', op: '>', value: 0, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_JITTER_QUEUE_CONGESTION',
        description: 'Congestion on WAN link causing voice packets to queue with data traffic',
        signals: [
          { metric: 'interface_utilization_percent', op: '>', value: 80, weight: 0.7 },
          { metric: 'voice_queue_drops', op: '>', value: 0, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'queue drops', weight: 0.5 },
          { keyword: 'output queue full', weight: 0.5 }
        ]
      }
    ],
    situationDesc: 'VoIP jitter elevated toward {peer}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-011.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924a' },
    id: 'security.ddos_detected',
    intent: 'security',
    subIntent: 'ddos_detected',
    domain: 'Network',
    function: 'Security',
    description: "Sudden volumetric traffic surge and CPU spike indicating a DDoS attack",
    keywords: ['ddos', 'flood', 'amplification', 'traffic surge', 'copp', 'rate limit', 'rtbh'],
    signals: [
      { metric: 'interface_pps_in', op: '>', value: 1000000, weight: 0.7 },
      { metric: 'copp_drop_rate', op: '>', value: 1000, weight: 0.6 },
      { metric: 'device_cpu_percent', op: '>', value: 90, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_DDOS_VOLUMETRIC',
        description: 'Volumetric UDP/ICMP/SYN flood overwhelming interface and control plane',
        signals: [
          { metric: 'interface_pps_in', op: '>', value: 5000000, weight: 0.8 },
          { metric: 'copp_drop_rate', op: '>', value: 5000, weight: 0.6 }
        ],
        logPatterns: [
          { keyword: 'CoPP rate-limit exceeded', weight: 0.6 },
          { keyword: 'UDP flood', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'DDoS suspected on {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-029.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924b' },
    id: 'device.high_cpu',
    intent: 'device',
    subIntent: 'high_cpu',
    domain: 'Network',
    function: 'Control Plane',
    description: 'Device CPU spiking high — control plane or process overload',
    keywords: ['high cpu', 'cpu spike', 'control plane', 'process', 'copp', 'netflow overload'],
    signals: [
      { metric: 'device_cpu_percent', op: '>', value: 80, weight: 0.7 },
      { metric: 'copp_drop_rate', op: '>', value: 100, weight: 0.4 },
      { metric: 'top_process_cpu_percent', op: '>', value: 50, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_CPU_PROCESS_LEAK',
        description: 'Software process memory or CPU leak consuming resources over time',
        signals: [
          { metric: 'top_process_cpu_percent', op: '>', value: 60, weight: 0.8 },
          { metric: 'process_memory_mb', op: '>', value: 512, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'process memory high', weight: 0.5 },
          { keyword: 'traceback', weight: 0.5 }
        ]
      }
    ],
    situationDesc: 'High CPU on {device}. CPU={device_cpu_percent}%. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-019.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924c' },
    id: 'vpn.ipsec_traffic_drop',
    intent: 'vpn',
    subIntent: 'ipsec_traffic_drop',
    domain: 'Network',
    function: 'VPN',
    description: 'IPsec tunnel established but encrypted traffic is being dropped',
    keywords: ['ipsec drop', 'tunnel up traffic fail', 'proxy-id', 'mss mtu', 'phase2'],
    signals: [
      { metric: 'ipsec_sa_state', op: '==', value: 1, weight: 0.4 },
      { metric: 'ipsec_encrypted_pkts', op: '>', value: 0, weight: 0.3 },
      { metric: 'ipsec_decrypted_pkts', op: '==', value: 0, weight: 0.7 }
    ],
    hypotheses: [
      {
        id: 'H_IPSEC_MTU_MSS',
        description: 'MTU or MSS issue causing large packets to be dropped inside the tunnel',
        signals: [
          { metric: 'ipsec_fragment_drop_count', op: '>', value: 0, weight: 0.7 },
          { metric: 'icmp_df_drop_count', op: '>', value: 0, weight: 0.5 }
        ],
        logPatterns: [
          { keyword: 'fragment needed', weight: 0.5 },
          { keyword: 'DF bit set drop', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'IPsec tunnel to {peer} is up but traffic dropping. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-013.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924d' },
    id: 'monitoring.snmp_poll_failure',
    intent: 'monitoring',
    subIntent: 'snmp_poll_failure',
    domain: 'Network',
    function: 'Observability',
    description: 'SNMP polling intermittently failing causing gaps in NMS data',
    keywords: ['snmp timeout', 'snmp fail', 'engineid', 'copp', 'snmp v3', 'poll failure'],
    signals: [
      { metric: 'snmp_poll_success_rate', op: '<', value: 95, weight: 0.7 },
      { metric: 'copp_snmp_drop_rate', op: '>', value: 10, weight: 0.5 },
      { metric: 'device_cpu_percent', op: '>', value: 70, weight: 0.3 }
    ],
    hypotheses: [
      {
        id: 'H_SNMP_COPP_RATELIMIT',
        description: 'CoPP policy rate-limiting SNMP packets from the poller',
        signals: [
          { metric: 'copp_snmp_drop_rate', op: '>', value: 50, weight: 0.8 }
        ],
        logPatterns: [
          { keyword: 'CoPP SNMP dropped', weight: 0.7 },
          { keyword: 'rate-limit SNMP exceeded', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'SNMP polling failing for {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-014.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924e' },
    id: 'routing.eigrp_neighbor_down',
    intent: 'routing',
    subIntent: 'eigrp_neighbor_down',
    domain: 'Network',
    function: 'Routing Protocol',
    description: 'EIGRP neighbor adjacency dropped and routes removed from RIB',
    keywords: ['eigrp neighbor down', 'dual stuck', 'k-value mismatch', 'eigrp authentication'],
    signals: [
      { metric: 'eigrp_neighbor_count', op: '<', value: 1, weight: 0.8 },
      { metric: 'eigrp_hello_miss_count', op: '>', value: 3, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_EIGRP_K_VALUE',
        description: 'K-value mismatch preventing EIGRP neighbor from forming',
        signals: [
          { metric: 'eigrp_k_value_mismatch', op: '==', value: 1, weight: 0.9 }
        ],
        logPatterns: [
          { keyword: 'K-value mismatch', weight: 0.8 },
          { keyword: 'EIGRP neighbor not compatible', weight: 0.7 }
        ]
      }
    ],
    situationDesc: 'EIGRP neighbor loss on {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-025.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f613924f' },
    id: 'switching.lacp_degraded',
    intent: 'switching',
    subIntent: 'lacp_degraded',
    domain: 'Network',
    function: 'Link Aggregation',
    description: 'Port-channel bundle degraded with fewer members than expected',
    keywords: ['lacp', 'port-channel', 'etherchannel', 'bundle degraded', 'member down'],
    signals: [
      { metric: 'portchannel_active_members', op: '<', value: 2, weight: 0.7 },
      { metric: 'lacp_pdu_timeout_count', op: '>', value: 0, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_LACP_MODE_MISMATCH',
        description: 'LACP mode mismatch (active vs passive vs on) preventing member from joining',
        signals: [
          { metric: 'lacp_mode_mismatch', op: '==', value: 1, weight: 0.9 }
        ],
        logPatterns: [
          { keyword: 'LACP mode mismatch', weight: 0.8 },
          { keyword: 'channel not forming', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'Port-channel on {device} degraded. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-028.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139250' },
    id: 'connectivity.multicast_failure',
    intent: 'connectivity',
    subIntent: 'multicast_failure',
    domain: 'Network',
    function: 'Multicast Routing',
    description: 'Multicast streams not reaching receivers — PIM or IGMP issue',
    keywords: ['multicast drop', 'pim neighbor', 'igmp join', 'rp unreachable', 'rpf failure'],
    signals: [
      { metric: 'pim_neighbor_count', op: '<', value: 1, weight: 0.6 },
      { metric: 'igmp_group_count', op: '==', value: 0, weight: 0.5 }
    ],
    hypotheses: [
      {
        id: 'H_MULTICAST_RP_UNREACHABLE',
        description: 'Rendezvous Point (RP) unreachable causing (*, G) join to fail',
        signals: [
          { metric: 'rp_reachability', op: '==', value: 0, weight: 0.9 }
        ],
        logPatterns: [
          { keyword: 'RP unreachable', weight: 0.8 },
          { keyword: 'no RP mapping', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'Multicast failure on {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-048.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139251' },
    id: 'connectivity.fhrp_flap',
    intent: 'connectivity',
    subIntent: 'fhrp_flap',
    domain: 'Network',
    function: 'Gateway Redundancy',
    description: 'HSRP/VRRP/GLBP role changing unexpectedly causing gateway unreachability',
    keywords: ['hsrp flap', 'vrrp flap', 'gateway unreachable', 'preempt', 'fhrp state change'],
    signals: [
      { metric: 'fhrp_state_change_count', op: '>', value: 2, weight: 0.7 },
      { metric: 'fhrp_active_count', op: '<', value: 1, weight: 0.8 }
    ],
    hypotheses: [
      {
        id: 'H_FHRP_PREEMPT_FLAP',
        description: 'Aggressive preempt causing repeated active/standby role switches',
        signals: [
          { metric: 'fhrp_state_change_count', op: '>', value: 5, weight: 0.8 }
        ],
        logPatterns: [
          { keyword: 'HSRP state change', weight: 0.6 },
          { keyword: 'preempt triggered', weight: 0.6 }
        ]
      }
    ],
    situationDesc: 'FHRP instability on {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-049.'
  },
  {
    _id: { $oid: '69381e8e2c85e919f6139252' },
    id: 'wan.failover_not_triggered',
    intent: 'wan',
    subIntent: 'failover_not_triggered',
    domain: 'Network',
    function: 'WAN Redundancy',
    description: 'WAN primary link failed but automatic failover to backup did not occur',
    keywords: ['wan failover', 'ip sla', 'track object', 'backup link', 'floating static'],
    signals: [
      { metric: 'primary_wan_state', op: '==', value: 0, weight: 0.8 },
      { metric: 'backup_wan_state', op: '==', value: 0, weight: 0.7 }
    ],
    hypotheses: [
      {
        id: 'H_WAN_FLOATING_STATIC_AD',
        description: 'Floating static route AD value incorrect — backup route not entering RIB',
        signals: [
          { metric: 'backup_route_in_rib', op: '==', value: 0, weight: 0.9 }
        ],
        logPatterns: [
          { keyword: 'track object down', weight: 0.7 }
        ]
      }
    ],
    situationDesc: 'WAN failover not triggered on {device}. Top hypothesis: {top_hypothesis} (confidence={prior}). Refer to KB kb-050.'
  }
];

export const mockKBArticlesEnhanced: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'Host Down in NMS',
    category: 'Connectivity',
    subcategory: 'Reachability',
    content: 'Triage process for devices showing as unreachable in the Network Management System.',
    problem: 'Device is showing Host Down. Likely Causes: SNMP or ICMP blocked, Device/Interface down, ACL/Firewall drop, Routing not present, VRF mismatch, or Power/Hardware issue.',
    area: 'Network Management & Reachability',
    remedyItems: [
      'Verify management IP and VRF assignments.',
      'Check ICMP/SNMP reachability from poller.',
      'Validate local link and neighbor state on the preceding hop.',
      'Inspect routing path and intervening ACLs for management traffic blocks.',
      'Verify physical power and hardware status of the target device.'
    ],
    tags: ['host-down', 'snmp', 'icmp', 'reachability'],
    linkedIntents: ['connectivity.host_down'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-002',
    title: 'Intermittent Packet Loss to Site',
    category: 'Connectivity',
    subcategory: 'Packet Loss',
    content: 'Root cause analysis for intermittent drops affecting application traffic.',
    problem: 'Traffic loss detected. Likely Causes: Interface errors (CRC/Giants), Queue congestion, Duplex mismatch, or ISP-side path degradation.',
    area: 'Performance & Flow',
    remedyItems: [
      'Perform MTR/Ping tests to isolate the segment experiencing drops.',
      'Inspect interface counters for increasing CRC, overrun, or discard errors.',
      'Check QoS queue stats for tail-drops or buffer exhaustion.',
      'Validate speed/duplex settings on all intervening ports.',
      'Cross-examine ISP SLA compliance if the issue is in the WAN underlay.'
    ],
    tags: ['packet-loss', 'crc', 'congestion', 'wan'],
    linkedIntents: ['connectivity.packet_loss'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 88
  },
  {
    id: 'kb-003',
    title: 'DNS Server Not Responding',
    category: 'Services',
    subcategory: 'DNS',
    content: 'Resolving failed name resolution for internal or external hosts.',
    problem: 'DNS Query failure. Likely Causes: DNS process crash, UDP 53 blocked, Anycast convergence failure, or zone synchronization lag.',
    area: 'Core Infrastructure Services',
    remedyItems: [
      'Test direct UDP 53 reachability to the DNS server IP.',
      'Check DNS server CPU/Memory health and service status (named/unbound).',
      'Validate firewall ACLs for DNS traffic permission.',
      'Confirm DNS record replication and TTL status across the infrastructure.'
    ],
    tags: ['dns', 'udp-53', 'resolution'],
    linkedIntents: ['services.dns_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-004',
    title: 'DHCP Timeout / IP Assignment Failure',
    category: 'Services',
    subcategory: 'DHCP',
    content: 'Triage for clients failing to obtain IP addresses automatically.',
    problem: 'DHCP failure. Likely Causes: IP Pool exhaustion, relay agent (IP-helper) misconfiguration, or ACL blocks on UDP 67/68.',
    area: 'End-User Services',
    remedyItems: [
      'Verify DHCP pool utilization and expand range if exhausted.',
      'Confirm IP-helper address is correctly configured on the VLAN SVI.',
      'Validate path from gateway to DHCP server for UDP 67/68 traffic.',
      'Inspect DHCP server logs for "no free addresses" or lease conflicts.'
    ],
    tags: ['dhcp', 'ip-helper', 'pool-exhaustion'],
    linkedIntents: ['services.dhcp_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-005',
    title: 'BGP Session Flapping',
    category: 'Routing',
    subcategory: 'BGP',
    content: 'Resolving BGP resets and instability with ISP or Internal peers.',
    problem: 'BGP Down/Flapping. Likely Causes: Hold-timer expiration, MD5 mismatch, MTU issues, or max-prefix limit reached.',
    area: 'Inter-Domain Routing',
    remedyItems: [
      'Check physical link stability for frame errors or flaps.',
      'Validate MD5 password consistency on both sides.',
      'Ensure the path MTU supports BGP packets (check for DF-bit drops).',
      'Verify prefix-count against configured maximum limit.'
    ],
    tags: ['bgp', 'max-prefix', 'flap', 'mtu'],
    linkedIntents: ['routing.bgp_flap'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 95
  },
  {
    id: 'kb-006',
    title: 'OSPF Neighbor Stuck in EXSTART/EXCHANGE',
    category: 'Routing',
    subcategory: 'OSPF',
    content: 'Adjacency failure triage for OSPF neighbors.',
    problem: 'Neighbor not reaching FULL state. Likely Causes: MTU mismatch, Duplicate Router ID, or multicast/unicast block.',
    area: 'IGP Routing',
    remedyItems: [
      'Align MTU values on both ends or use `ip ospf mtu-ignore`.',
      'Verify unique Router IDs within the OSPF area.',
      'Confirm multicast reachability (224.0.0.5) on the shared segment.',
      'Check for network type mismatch (Point-to-Point vs Broadcast).'
    ],
    tags: ['ospf', 'exstart', 'mtu-mismatch'],
    linkedIntents: ['routing.ospf_stuck'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-007',
    title: 'STP Instability / Topology Change Spikes',
    category: 'Switching',
    subcategory: 'STP',
    content: 'Mitigating broadcast storms and L2 instability caused by STP.',
    problem: 'TCN (Topology Change Notification) spike. Likely Causes: Flapping port without Portfast, L2 loop, or Root Bridge change.',
    area: 'L2 Control Plane',
    remedyItems: [
      'Locate the origin of TCNs using `show spanning-tree detail`.',
      'Enable BPDU Guard and Portfast on all access/edge ports.',
      'Verify deterministic Root Bridge placement (Priority 4096).',
      'Inspect for physical loops in non-STP segments.'
    ],
    tags: ['stp', 'tcn', 'bpdu', 'loop'],
    linkedIntents: ['switching.stp_instability'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 96
  },
  {
    id: 'kb-008',
    title: 'VLAN Gateway Unreachable / SVI Down',
    category: 'Switching',
    subcategory: 'Gateway Redundancy',
    content: 'Resolving gateway-level connectivity issues for local segments.',
    problem: 'VLAN gateway Down. Likely Causes: Missing native VLAN, FHRP state-flap, or trunk pruning errors.',
    area: 'Layer 3 Switching Core',
    remedyItems: [
      'Confirm the VLAN is permitted on all upstream trunk ports.',
      'Verify SVI (Switch Virtual Interface) up/up status and IP address.',
      'Monitor HSRP/VRRP states for transition events or priority mismatches.',
      'Inspect MAC address learning on the trunk for evidence of L2 isolation.'
    ],
    tags: ['vlan-gateway', 'svi', 'hsrp', 'vrrp'],
    linkedIntents: ['switching.vlan_gateway_unreachable'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 93
  },
  {
    id: 'kb-009',
    title: 'Uplink CRC Error Analysis',
    category: 'Interface',
    subcategory: 'Physical Integrity',
    content: 'Fixing physical bit errors and corrupted frames on backbone links.',
    problem: 'CRC Errors Detected. Likely Causes: Bad optics (SFP), faulty patch cable, or link distance exceeding spec.',
    area: 'Infrastructure Physical Layer',
    remedyItems: [
      'Replace the patch cable and clean all optical connectors.',
      'Verify optical power levels (RX/TX dbm) using `show controllers`.',
      'Swap the SFP transceiver with a known-good spare.',
      'Perform a physical inspection for cable bends or patch panel faults.'
    ],
    tags: ['crc', 'physical-layer', 'sfp'],
    linkedIntents: ['interface.crc_errors'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-010',
    title: 'Frequent Port Flaps / Link Cycle Triage',
    category: 'Interface',
    subcategory: 'Link Flap',
    content: 'Remediating access ports cycling rapidly up/down.',
    problem: 'Fast Flapping Interface. Likely Causes: Powering issue (PoE), NIC driver bug, or loose cabling.',
    area: 'Campus Physical Layer',
    remedyItems: [
      'Isolate whether the flap coincides with PoE load changes.',
      'Secure or replace the target device patch lead.',
      'Verify that `link-flap` protection is tuned to prevent err-disable loops.',
      'Review NIC logs on the connected endpoint for driver-initiated resets.'
    ],
    tags: ['port-flap', 'poe', 'cabling'],
    linkedIntents: ['interface.port_flap'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 90
  },
  {
    id: 'kb-011',
    title: 'Voice Jitter & Call Quality (MOS) Degradation',
    category: 'Performance',
    subcategory: 'VoIP/Quality',
    content: 'Diagnostic path for audio artifacts and high jitter in voice streams.',
    problem: 'Audio choppy or dropped. Likely Causes: Inconsistent QoS tagging (DSCP), shallow buffers, or asymmetric path jitter.',
    area: 'Real-Time Services QoS',
    remedyItems: [
      'Confirm end-to-end DSCP 46 (EF) markings for all voice traffic.',
      'Review LLQ (Low Latency Queuing) stats for any voice-class drops.',
      'Measure jitter variance using IP SLA probes across the WAN.',
      'Ensure the jitter buffer on receiving handsets is properly tuned or replaced.'
    ],
    tags: ['voip', 'jitter', 'qos', 'pps'],
    linkedIntents: ['performance.voip_jitter'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 87
  },
  {
    id: 'kb-012',
    title: 'Global Anycast DNS Latency & Convergence',
    category: 'WAN',
    subcategory: 'Cloud Routing',
    content: 'Resolving sub-optimal pathing and latency for Anycast services.',
    problem: 'Slow DNS resolution. Likely Causes: Sub-optimal BGP Anycast pathing, PoP overload, or DNS PoP convergence issues.',
    area: 'Cloud & WAN Infrastructure',
    remedyItems: [
      'Trace the Anycast path to verify the nearest regional POP is used.',
      'Verify transit ISP BGP metric preferences for Anycast prefixes.',
      'Validate TTL and Ramping settings in Global Load Balancers.',
      'Check regional DNS server CPU and memory load status.'
    ],
    tags: ['anycast', 'dns', 'bgp', 'latency'],
    linkedIntents: ['services.dns_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-013',
    title: 'IPSec Phase 2 Tunnel Traffic Drop',
    category: 'Security',
    subcategory: 'VPN Gateway',
    content: 'Solving the "Tunnel Up but Traffic Failing" scenario in S2S VPNs.',
    problem: 'VPN Traffic Blackhole. Likely Causes: Proxy-ID (ACL) mismatch, MSS/MTU clamping missing, or Phase 2 lifetime timeout.',
    area: 'Secure Transport Layer',
    remedyItems: [
      'Ensure IKEv2 Phase-2 selector ACLs match perfectly on both peers.',
      'Apply TCP MSS Clamping to 1350 bytes on the tunnel interfaces.',
      'Verify firewall policies allow the specific source/destination subnet pair.',
      'Inspect Phase 2 security associations for valid SPI counts.'
    ],
    tags: ['ipsec', 'vpn', 'mss', 'clamping'],
    linkedIntents: ['vpn.ipsec_traffic_drop'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-014',
    title: 'SNMPv3 Poll Timeouts & EngineID Conflicts',
    category: 'Monitoring',
    subcategory: 'Observability',
    content: 'Fixing authentication and sync issues for secure monitoring.',
    problem: 'NMS/Monitoring gaps. Likely Causes: SNMP engineID collision, credential mismatch, or restrictive CoPP policies.',
    area: 'Device Management & Visibility',
    remedyItems: [
      'Confirm the unique `snmp-server engineid` for all fabric devices.',
      'Validate SNMPv3 user authentication (SHA/AES) password strings.',
      'Inspect CoPP (Control Plane Policing) for UDP 161 rate-limiting drops.',
      'Verify management VRF reachability to the central poller IP.'
    ],
    tags: ['snmpv3', 'monitoring', 'copp', 'engineid'],
    linkedIntents: ['monitoring.snmp_poll_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-015',
    title: 'EIGRP Stuck-in-Active (SIA) Resolution',
    category: 'Routing',
    subcategory: 'EIGRP',
    content: 'Remediating neighbor loss due to SIA queries and unresponsive peers.',
    problem: 'Adjacency loss. Likely Causes: Unresponsive remote peer, overloaded CPU responding slow, or unidirectional link.',
    area: 'Internal Routing Fabric',
    remedyItems: [
      'Locate the SIA origin using `show ip eigrp topology active`.',
      'Optimize EIGRP query boundaries using "Stub" configuration.',
      'Check for unidirectional link failure using UDLD on member ports.',
      'Investigate link congestion causing Hello/Query packet loss.'
    ],
    tags: ['eigrp', 'sia', 'stub', 'routing'],
    linkedIntents: ['routing.eigrp_neighbor_down'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 94
  },

  {
    id: 'kb-016',
    title: 'LACP Bundle Degradation & Hash Triage',
    category: 'Switching',
    subcategory: 'Link Aggregation',
    content: 'Resolving throughput issues and member failures in Port-Channels.',
    problem: 'Port-channel bundle degraded. Likely Causes: LACP mode mismatch, physical link failure, or hashing skew.',
    area: 'Link Aggregation Fabric',
    remedyItems: [
      'Verify `lacp mode active` is configured on both ends of the bundle.',
      'Inspect physical member ports for layer 1 errors or flaps.',
      'Review `show lacp neighbor` for PDU exchange timeouts.',
      'Validate that the hashing algorithm (e.g., src-dst-ip) is appropriate for the traffic profile.'
    ],
    tags: ['lacp', 'port-channel', 'etherchannel'],
    linkedIntents: ['switching.lacp_degraded'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-017',
    title: 'Multicast Stream Dropout / RPF Failure',
    category: 'Routing',
    subcategory: 'Multicast',
    content: 'Fixing missing or choppy multicast video/data streams.',
    problem: 'Multicast loss. Likely Causes: RP unreachability, RPF failure, or IGMP snooping timeouts.',
    area: 'Multicast Delivery Path',
    remedyItems: [
      'Verify the Rendezvous Point (RP) address is reachable via the Unicast RIB.',
      'Check `show ip mroute` for RPF (Reverse Path Forwarding) failures.',
      'Ensure IGMP querier is active on the local VLAN segment.',
      'Validate PIM neighbor adjacencies on the entire distribution path.'
    ],
    tags: ['multicast', 'pim', 'igmp', 'rpf'],
    linkedIntents: ['connectivity.multicast_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 88
  },
  {
    id: 'kb-018',
    title: 'SD-WAN Tunnel Jitter & FEC Optimization',
    category: 'WAN',
    subcategory: 'SD-WAN',
    content: 'Optimizing overlay performance over low-quality internet circuits.',
    problem: 'High overlay jitter. Likely Causes: ISP routing churn, high packet loss on underlay, or FEC (Forward Error Correction) overhead.',
    area: 'Software Defined WAN',
    remedyItems: [
      'Enable Adaptive FEC to mitigate underlay packet loss impacts.',
      'Review App-Route policies to prefer lower-jitter paths for voice.',
      'Inspect IPsec tunnel MTU to avoid fragmentation-induced jitter.',
      'Verify ISP circuit utilization against provisioned bandwidth.'
    ],
    tags: ['sd-wan', 'jitter', 'fec', 'overlay'],
    linkedIntents: ['performance.voip_jitter'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 90
  },
  {
    id: 'kb-019',
    title: 'Device High CPU / Control Plane Protection',
    category: 'Compute',
    subcategory: 'CPU',
    content: 'Mitigating device management lag and control plane instability.',
    problem: 'CPU Spike > 90%. Likely Causes: Process leak, broadcast storm, or NetFlow export overload.',
    area: 'Device Management',
    remedyItems: [
      'Identify the offending process using `show processes cpu sorted`.',
      'Verify CoPP (Control Plane Policing) is actively dropping excessive punts.',
      'Optimize NetFlow sampling rates to reduce CPU processing load.',
      'Check for L2 loops causing interrupt-driven CPU exhaustion.'
    ],
    tags: ['high-cpu', 'copp', 'management'],
    linkedIntents: ['device.high_cpu'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 95
  },
  {
    id: 'kb-020',
    title: 'SaaS Latency & CDN Path Optimization',
    category: 'Performance',
    subcategory: 'Latency',
    content: 'Improving response times for critical cloud applications (O365, Salesforce).',
    problem: 'Slow SaaS response. Likely Causes: Hair-pinning through DC, sub-optimal DNS GEO-location, or ISP peering congestion.',
    area: 'Cloud Application Access',
    remedyItems: [
      'Implement Local Internet Breakout (DIA) for trusted SaaS prefixes.',
      'Verify that DNS resolution occurs locally at the branch office.',
      'Trace the path to the SaaS front-door to identify high-latency hops.',
      'Monitor ISP peering health at major internet exchange points.'
    ],
    tags: ['latency', 'saas', 'dia', 'cloud'],
    linkedIntents: ['performance.latency_spike'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-021',
    title: 'ACL Log Overload & Impact Analysis',
    category: 'Security',
    subcategory: 'Logging',
    content: 'Managing excessive syslog generation from security policies.',
    problem: 'Log Volume surge. Likely Causes: "log" keyword on high-hit ACE rules, or active scanning/attack vector.',
    area: 'Security Operations',
    remedyItems: [
      'Remove the "log" keyword from high-frequency Permit rules.',
      'Implement `logging rate-limit` to protect the syslog transport.',
      'Aggregate log data to identify the source of the traffic surge.',
      'Confirm if logged Deny hits correlate with a known lateral movement pattern.'
    ],
    tags: ['acl', 'logging', 'syslog', 'security'],
    linkedIntents: ['security.acl_breach_suspect'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-022',
    title: 'ARP Table Exhaustion & Spoofing Prevention',
    category: 'Switching',
    subcategory: 'L2 Security',
    content: 'Maintaining L2 reachability and preventing MAC/ARP attacks.',
    problem: 'Missing ARP entries. Likely Causes: Table full (CAM overflow), ARP timeout mismatch, or malicious spoofing.',
    area: 'Edge Security',
    remedyItems: [
      'Verify ARP table utilization against hardware platform limits.',
      'Enable Dynamic ARP Inspection (DAI) to prevent spoofing.',
      'Align ARP timeouts with DHCP lease times or MAC ages.',
      'Clear stale entries for specific blocked or moved hosts.'
    ],
    tags: ['arp', 'spoofing', 'security', 'dai'],
    linkedIntents: ['switching.arp_limit'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-023',
    title: 'DHCP Snooping & Rogue Server Isolation',
    category: 'Security',
    subcategory: 'Core Services',
    content: 'Preventing unauthorized DHCP servers from disrupting the network.',
    problem: 'Wrong IP assigned. Likely Causes: Rogue DHCP server on segment, or misconfigured helper-address.',
    area: 'Network Access Control',
    remedyItems: [
      'Enable DHCP Snooping on the access VLANs.',
      'Configure "Trusted Port" only on the legitimate uplink/server port.',
      'Identify the rogue MAC address via trailing snooping logs.',
      'Shut down the offending physical port until the rogue device is removed.'
    ],
    tags: ['dhcp', 'snooping', 'rogue-server'],
    linkedIntents: ['services.dhcp_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 96
  },
  {
    id: 'kb-024',
    title: 'BGP Max-Prefix Limit Hit / Session Cease',
    category: 'Routing',
    subcategory: 'BGP',
    content: 'Recovering from BGP sessions being shut down due to prefix overflow.',
    problem: 'BGP Session IDLE (PfxCt). Likely Causes: ISP sending more routes than expected, or leak from peer.',
    area: 'External Gateways',
    remedyItems: [
      'Increase the `maximum-prefix` threshold ONLY if legitimate growth is confirmed.',
      'Request prefix-list filtering verification from the upstream peer.',
      'Use `restart` command on the session after adjusting limits.',
      'Analyze the reason for prefix surge (e.g., aggregate route failure at peer).'
    ],
    tags: ['bgp', 'prefix-limit', 'cease'],
    linkedIntents: ['routing.bgp_flap'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 93
  },
  {
    id: 'kb-025',
    title: 'HSRP/VRRP Dual-Active (Split-Brain) Triage',
    category: 'Switching',
    subcategory: 'Redundancy',
    content: 'Resolving gateway instability when two routers think they are Active.',
    problem: 'Dual-Active state. Likely Causes: Hello packet block on VPC/Trunk, or high CPU delaying packets.',
    area: 'High Availability Fabric',
    remedyItems: [
      'Verify the peer-link and VLAN trunk allow FHRP control traffic.',
      'Check for ACLs blocking multicast (224.0.0.2 / 224.0.0.102).',
      'Ensure priority values are distinct and deterministic.',
      'Inspect for unidirectional link failure between the HSRP/VRRP peers.'
    ],
    tags: ['hsrp', 'vrrp', 'redundancy', 'dual-active'],
    linkedIntents: ['connectivity.fhrp_flap'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-026',
    title: 'SD-WAN Controller Connection Loss',
    category: 'WAN',
    subcategory: 'Management Overlay',
    content: 'Recovering vEdge/cEdge connectivity to vSmart or vManage.',
    problem: 'Controller Down. Likely Causes: Firewall block on DTLS (12346), DNS failure for controller FQDN, or NAT-T issues.',
    area: 'SD-WAN Control Plane',
    remedyItems: [
      'Validate that the device can resolve the vBond/vManage FQDN.',
      'Check `show sdwan control local-properties` for valid organization-name.',
      'Verify firewall permission for DTLS/TLS ports from the underlay IP.',
      'Inspect root certificate validity for control session authentication.'
    ],
    tags: ['sd-wan', 'vmanage', 'control-plane'],
    linkedIntents: ['wan.controller_unreachable'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-027',
    title: 'Optical Power (DDM) Low-Light Analysis',
    category: 'Interface',
    subcategory: 'Physical Integrity',
    content: 'Preventing link failures by monitoring transceiver signal quality.',
    problem: 'Input Power Low (<-20dBm). Likely Causes: Dirty fiber end-face, damaged jumper, or failing Laser.',
    area: 'Data Center / WAN Physical',
    remedyItems: [
      'Clean all fiber junctions with a clicker-pen cleaner.',
      'Replace the fiber patch lead if light levels do not improve.',
      'Verify patch panel connections are fully seated.',
      'Check the far-end TX power to determine if the loss is in the local or remote side.'
    ],
    tags: ['optical', 'sfp', 'ddm', 'fiber'],
    linkedIntents: ['interface.crc_errors'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 95
  },
  {
    id: 'kb-028',
    title: 'MPLS L3VPN Label Inconsistency / VRF Loss',
    category: 'WAN',
    subcategory: 'Core Routing',
    content: 'Resolving end-to-end VPN reachability in MPLS provider fabrics.',
    problem: 'Traffic loss in VRF. Likely Causes: LDP label session down, BGP-VPNv4 peer reset, or Route-Target mismatch.',
    area: 'Service Provider Core',
    remedyItems: [
      'Check `show mpls ldp neighbor` for valid label exchange.',
      'Verify BGP VPNv4 address-family state with the provider PE.',
      'Confirm import/export Route-Targets match across all VRF sites.',
      'Validate MPLS MTU supports the extra label overhead (minimum 1508 bytes).'
    ],
    tags: ['mpls', 'vrf', 'vpn', 'ldp'],
    linkedIntents: ['wan.vpn_outage'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 87
  },
  {
    id: 'kb-029',
    title: 'DDoS Volumetric Mitigation with RTBH',
    category: 'Security',
    subcategory: 'Threat Defense',
    content: 'Using Remote Triggered Black Hole to stop massive inbound floods.',
    problem: 'Interface Saturated. Likely Causes: External volumetric attack (UDP/ICMP flood).',
    area: 'Internet Edge Security',
    remedyItems: [
      'Identify the target IP being attacked via NetFlow/SFlow.',
      'Trigger RTBH by advertising the target /32 with the designated community.',
      'Apply CoPP rate-limits for remaining fragmented traffic.',
      'Engage with upstream ISP / DDoS Mitigation scrubbers.'
    ],
    tags: ['ddos', 'rtbh', 'security', 'flood'],
    linkedIntents: ['security.ddos_detected'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 98
  },
  {
    id: 'kb-030',
    title: 'NMS Polling Interval & Payload Tuning',
    category: 'Monitoring',
    subcategory: 'Observability',
    content: 'Balancing monitoring granularity with device management overhead.',
    problem: 'NMS Overhead high. Likely Causes: Aggressive polling (< 1min) for too many OIDs, or large SNMP walk requests.',
    area: 'Network Visibility Optimization',
    remedyItems: [
      'Increase the polling interval for non-critical interfaces.',
      'Use Bulk-Get where supported to reduce the number of SNMP packets.',
      'Filter out "Admin Down" ports from the active polling list.',
      'Leverage Streaming Telemetry (gRPC/NETCONF) for high-fidelity counters.'
    ],
    tags: ['monitoring', 'snmp', 'telemetry', 'nms'],
    linkedIntents: ['monitoring.snmp_poll_failure'],
    lastUpdated: '2026-03-24T10:00:00Z',
    effectiveness: 90
  },
  {
    id: 'kb-031',
    title: 'Route Redistribution Loops & Missing Prefixes',
    category: 'Routing',
    subcategory: 'Route Redistribution',
    content: 'Isolation of loops and suboptimal routing between disparate IGPs and BGP.',
    problem: 'Redistributed routes missing or looping. Likely Causes: Missing route-map filters, Suboptimal seed metrics, or Bi-directional feedback loops.',
    area: 'Inter-Protocol Routing Policy',
    remedyItems: [
      'Identify all mutual redistribution points across the infrastructure.',
      'Verify route-map hit counters to ensure prefixes are meeting filter criteria.',
      'Inspect metric seed values to ensure the resulting cost is mathematically viable.',
      'Implement route tagging (Tags) to prevent bi-directional redistribution loops.'
    ],
    tags: ['redistribution', 'route-map', 'loop', 'bgp', 'ospf'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 93
  },
  {
    id: 'kb-032',
    title: 'MAC Address Table Exhaustion & Flooding',
    category: 'Switching',
    subcategory: 'MAC Table',
    content: 'Mitigation of L2 traffic flooding caused by unstable or overflowing CAM tables.',
    problem: 'Traffic flooding across VLAN. Likely Causes: MAC table overflow (Unicast flooding), Loops causing flapping, or aggressive aging timers.',
    area: 'Layer 2 Connectivity Fabric',
    remedyItems: [
      'Compare current MAC table capacity against hardware utilization limits.',
      'Locate specific "MAC_MOVE" messages in syslog indicating a physical loop.',
      'Correlate MAC instability with Spanning Tree TCN (Topology Change) events.',
      'Audit VM migration logs to see if rapid movement is aging out table entries too fast.'
    ],
    tags: ['mac-table', 'flooding', 'mac-flap', 'vlan'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-033',
    title: 'Port-Channel/LACP Bundle Degradation',
    category: 'Switching',
    subcategory: 'Port-Channel/LACP',
    content: 'Triage for EtherChannel member link failures and traffic imbalance.',
    problem: 'Bundle degraded or members not joining. Likely Causes: LACP mode mismatch, VLAN inconsistency, or Hash algorithm imbalance.',
    area: 'Physical Link Aggregation',
    remedyItems: [
      'Verify LACP modes (Active/Passive) match on both ends of the bundle.',
      'Ensure all physical member ports have identical speed and duplex settings.',
      'Validate that the VLAN allowed list is perfectly identical on all member interfaces.',
      'Inspect traffic distribution and adjust the hash algorithm to mitigate skewed load.'
    ],
    tags: ['lacp', 'port-channel', 'etherchannel', 'bonding'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 95
  },
  {
    id: 'kb-034',
    title: 'Volumetric DDoS Attack Response',
    category: 'Security',
    subcategory: 'DDoS/Rate Limiting',
    content: 'Immediate countermeasures for SYN floods and amplification attacks.',
    problem: 'CPU spikes and traffic surges. Likely Causes: Volumetric floods (UDP/SYN), Amplification (DNS/NTP), or App-layer DDoS.',
    area: 'Infrastructure Perimeter Protection',
    remedyItems: [
      'Confirm the volumetric nature via interface pps (packets per second) rate counters.',
      'Utilize NetFlow top-talker analysis to pinpoint offending source IPs and protocols.',
      'Trigger Remotely Triggered Black Hole (RTBH) or apply upstream CoPP rate-limiting.',
      'Engage the ISP for volumetric scrubbing if the attack exceeds edge capacity.'
    ],
    tags: ['ddos', 'rtbh', 'copp', 'amplification', 'rate-limit'],
    linkedIntents: ['compute.cpu_spike'],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 96
  },
  {
    id: 'kb-035',
    title: 'TLS Certificate Expiry & CA Chain Triage',
    category: 'Security',
    subcategory: 'Certificate/TLS',
    content: 'Resolving HTTPS errors and broken TLS handshakes during service inspection.',
    problem: 'TLS certificate errors. Likely Causes: Expiration, CN/SAN mismatch, Broken intermediate chains, or Cipher mismatches.',
    area: 'Application Security & Encryption',
    remedyItems: [
      'Check the expiration date and CN/SAN strings of the presented certificate.',
      'Validate the full certificate chain manually using `openssl s_client`.',
      'Temporarily disable SSL/TLS inspection engines to isolate middlebox interference.',
      'Verify supported TLS versions and cipher suites on both client and server.'
    ],
    tags: ['tls', 'certificate', 'ssl', 'expiry', 'inspection'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-036',
    title: 'AAA/RADIUS Authentication Timeouts',
    category: 'Security',
    subcategory: 'AAA/RADIUS',
    content: 'Isolating login failures and shared secret mismatches on network devices.',
    problem: 'Administrative lockout risk. Likely Causes: RADIUS/TACACS unreachable, Secret mismatch, NAS-IP whitelist failure, or VRF isolation.',
    area: 'Identity & Access Management',
    remedyItems: [
      'Perform a ping test from the device management VRF to the AAA server IP.',
      'Verify the shared secret consistency between the network device and RADIUS server.',
      'Ensure the NAS-IP used by the device is whitelisted on the AAA appliance.',
      'Check RADIUS statistics for specific Reject vs Timeout patterns.'
    ],
    tags: ['aaa', 'radius', 'tacacs', 'authentication', 'vrf'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-037',
    title: 'SSL VPN Internal Resource Reachability',
    category: 'VPN',
    subcategory: 'SSL/TLS VPN',
    content: 'Diagnostic path for AnyConnect users failing to reach internal VLANs.',
    problem: 'Remote users connected but no traffic. Likely Causes: Split-tunnel misconfig, IP pool exhaustion, or missing DNS profile.',
    area: 'Remote Workplace Connectivity',
    remedyItems: [
      'Confirm the assigned address is within the intended pool and not exhausted.',
      'Audit the split-tunnel ACL to ensure all required internal subnets are included.',
      'Verify that DNS server IPs and domains are being pushed in the VPN group-policy.',
      'Check the ACLs applied to the VPN interface for specific blocking rules.'
    ],
    tags: ['ssl-vpn', 'anyconnect', 'split-tunnel', 'dns', 'ip-pool'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 90
  },
  {
    id: 'kb-038',
    title: 'DMVPN Spoke-to-Spoke Tunnel Formation',
    category: 'VPN',
    subcategory: 'DMVPN',
    content: 'Triage for spoke-to-spoke resolution failures and NHRP registration issues.',
    problem: 'Spoke tunnels not forming. Likely Causes: NHRP registration failure, IKE phase errors, or NAT breaking NHRP packets.',
    area: 'Hub-and-Spoke Enterprise VPN',
    remedyItems: [
      'Verify the spoke successfully registered its NHS (Next Hop Server) with the hub.',
      'Check for valid IKE SAs between the two spoke pair endpoints.',
      'Confirm that the hub is correctly redistributing spoke subnets to the fabric.',
      'Monitor for NAT-T issues specifically on the underlay transport path.'
    ],
    tags: ['dmvpn', 'nhrp', 'ike', 'gre', 'spoke'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-039',
    title: 'Application Throughput & TCP Window Scaling',
    category: 'Performance',
    subcategory: 'Throughput/Bandwidth',
    content: 'Isolating network-side slowdowns vs application-layer bottlenecks.',
    problem: 'Slow file transfers. Likely Causes: TCP window scaling issues, Oversubscription, or Asymmetric path reordering.',
    area: 'Application Transport Performance',
    remedyItems: [
      'Run a parallel-stream iperf3 test to stress the path bandwidth capacity.',
      'Inspect interface utilization vs CIR (Committed Information Rate) thresholds.',
      'Look for high TCP retransmit counts using `netstat -s` or packet captures.',
      'Review QoS shapers for aggressive policies that may be dropping micro-bursts.'
    ],
    tags: ['throughput', 'tcp', 'bandwidth', 'qos', 'wan-optimizer'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 88
  },
  {
    id: 'kb-040',
    title: 'QoS Buffer Tuning & WRED Optimization',
    category: 'Performance',
    subcategory: 'Buffer/Queue',
    content: 'Mitigation of burst drops and tail-drop events on high-traffic interfaces.',
    problem: 'Intermittent drops during bursts. Likely Causes: Shallow queues, Missing WRED, or undersized hold-queues.',
    area: 'Buffer Management & Congestion Avoidance',
    remedyItems: [
      'Identify which specific class-queue is experiencing discard events.',
      'Evaluate current buffer depth against expected micro-burst traffic patterns.',
      'Configure WRED (Weighted Random Early Detection) thresholds for non-voice traffic.',
      'Increase the interface output hold-queue to absorb occasional burst spikes.'
    ],
    tags: ['qos', 'wred', 'queue', 'buffer', 'drops'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 93
  },
  {
    id: 'kb-041',
    title: 'Firmware Upgrade Regressions & Incompatibilities',
    category: 'Device',
    subcategory: 'Firmware/Software',
    content: 'Post-upgrade triage to isolate software bugs from configuration drift.',
    problem: 'Unexpected device behavior. Likely Causes: Known vendor bugs, Config incompatibility, or Feature flag changes.',
    area: 'Lifecycle Management & Stability',
    remedyItems: [
      'Compare observed behavior patterns against vendor-published "Caveats" and known bugs.',
      'Examine syslog for new, non-standard error message patterns post-upgrade.',
      'Check for changes in CLI syntax or default behavior between firmware versions.',
      'Execute a rollback to the previous stable image if service impact is P1.'
    ],
    tags: ['firmware', 'upgrade', 'regression', 'rollback', 'bug'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 95
  },
  {
    id: 'kb-042',
    title: 'Hardware Alarms & PSU/ECC Error Resolution',
    category: 'Device',
    subcategory: 'Hardware/Environment',
    content: 'Triage for environmental failures, memory parity, and chassis alarms.',
    problem: 'Device Alarms/Reboots. Likely Causes: PSU failure, Overheating, Line card fault, or ECC memory errors.',
    area: 'Physical Chassis Integrity',
    remedyItems: [
      'Check environmental status for temperature, fan speed, and PSU voltage alarms.',
      'Review device crash logs to identify specific hardware parity or soft errors.',
      'Verify PSU redundancy status and current draw vs total system capacity.',
      'Coordinate with vendor TAC for RMA (Return Merchandise Authorization) planning.'
    ],
    tags: ['hardware', 'psu', 'temperature', 'fan', 'ecc', 'rma'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 96
  },
  {
    id: 'kb-043',
    title: 'NetFlow Exporter Drops & Collector Inconsistency',
    category: 'Monitoring',
    subcategory: 'NetFlow/sFlow',
    content: 'Debugging visibility gaps in network-wide traffic telemetry streams.',
    problem: 'Missing/Inconsistent Flow data. Likely Causes: UDP export blocks, Sampler mismatch, or NTP skew.',
    area: 'Observability Infrastructure',
    remedyItems: [
      'Verify UDP port 2055 (or configured port) is open across all security zones.',
      'Confirm that the flow sampler rates match on both the exporter and collector.',
      'Check local exporter send statistics for high drop counts at the source.',
      'Validate NTP synchronization to prevent flow record timestamp misplacement.'
    ],
    tags: ['netflow', 'sflow', 'collector', 'exporter', 'sampling'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 87
  },
  {
    id: 'kb-044',
    title: 'Syslog Ingest Pipeline & SIEM Visibility',
    category: 'Monitoring',
    subcategory: 'Syslog',
    content: 'Troubleshooting guide for missing event logs in centralized SIEM systems.',
    problem: 'Logs not appearing in SIEM. Likely Causes: UDP 514 blocked, Wrong destination IP, or Restrictive logging levels.',
    area: 'Security Operations & Auditing',
    remedyItems: [
      'Verify the configured syslog destination IP and port are reachable.',
      'Ensure the audit logging level captures the required event severity (e.g. Informational +).',
      'Validate that the source management VRF has a clean routing path to the SIEM.',
      'Perform a packet capture at the SIEM ingress to verify receipt of UDP packets.'
    ],
    tags: ['syslog', 'siem', 'logging', 'udp-514', 'vrf'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 89
  },
  {
    id: 'kb-045',
    title: 'Wireless AP Join Failures & CAPWAP/DTLS',
    category: 'Wireless',
    subcategory: 'Controller/AP',
    content: 'Diagnostic process for APs failing to register with the Wireless Controller.',
    problem: 'AP stuck in Joining state. Likely Causes: CAPWAP port blocks, License limits, DHCP Option 43 errors, or Cert mismatch.',
    area: 'Enterprise Campus Mobility',
    remedyItems: [
      'Examine the WLC join logs for specific reason codes (e.g. Cert failure, Radius reject).',
      'Verify DHCP Option 43 is providing the correct controller management IP.',
      'Confirm the WLC has available AP capacity licenses to accept new registrations.',
      'Validate that UDP 5246/5247 ports are not blocked by intermediate firewalls.'
    ],
    tags: ['wlc', 'capwap', 'ap-join', 'dhcp-option43', 'license'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 91
  },
  {
    id: 'kb-046',
    title: 'RF Spectrum Interference & DFS Event Analysis',
    category: 'Wireless',
    subcategory: 'Spectrum/Interference',
    content: 'Identification of non-Wi-Fi interference and channel-plan instability.',
    problem: 'Degraded areas. Likely Causes: Non-Wi-Fi interference (Microwave/Bluetooth), Co-channel congestion, or DFS radar events.',
    area: 'RF Environment Health',
    remedyItems: [
      'Utilize built-in spectrum analysis on APs to classify interference sources.',
      'Check for Co-channel interference (CCI) from neighboring or rogue APs.',
      'Review DFS (Dynamic Frequency Selection) event logs for forced channel moves.',
      'Enable automated interference avoidance features like CleanAir/RRM.'
    ],
    tags: ['spectrum', 'interference', 'dfs', 'co-channel', '2.4ghz'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 86
  },
  {
    id: 'kb-047',
    title: 'IPv6 NDP & Router Advertisement (RA) Troubleshooting',
    category: 'Connectivity',
    subcategory: 'IPv6',
    content: 'Resolution guide for IPv6-only or dual-stack connectivity failures.',
    problem: 'IPv4 works, IPv6 fails. Likely Causes: ACL blocks, RA suppression, NDP resolution failure, or DHCPv6 issues.',
    area: 'Next-Generation Protocol Support',
    remedyItems: [
      'Verify that the client has received a valid IPv6 prefix via RA or DHCPv6.',
      'Confirm that Router Advertisements are being sent periodically on the SVI/interface.',
      'Check the NDP (Neighbor Discovery Protocol) table for gateway reachability.',
      'Audit IPv6 ACLs for implicit permits/denies of ICMPv6 control traffic.'
    ],
    tags: ['ipv6', 'ndp', 'ra', 'dhcpv6', 'dual-stack'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 92
  },
  {
    id: 'kb-048',
    title: 'NAT/PAT Translation Pool & Overflow Triage',
    category: 'Connectivity',
    subcategory: 'NAT/PAT',
    content: 'Identifying PAT port-exhaustion and inside/outside interface issues.',
    problem: 'Internet access outage. Likely Causes: Pool exhaustion (PAT full), ACL mismatch, or missing NAT designations.',
    area: 'Network Address Orchestration',
    remedyItems: [
      'Check NAT translation statistics for high "miss" counts or PAT port exhaustion.',
      'Verify that `ip nat inside` and `ip nat outside` are applied to the correct paths.',
      'Confirm the NAT ACL includes all required source subnets.',
      'Monitor NAT rule order to ensure high-priority static rules are not masked.'
    ],
    tags: ['nat', 'pat', 'translation', 'acl', 'pool'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 93
  },
  {
    id: 'kb-049',
    title: 'MPLS L3VPN RD/RT & Label Exchange Failures',
    category: 'WAN',
    subcategory: 'MPLS/L3VPN',
    content: 'Diagnostic workflow for isolated sites or missing VPNv4 prefixes.',
    problem: 'VPN inter-site connectivity loss. Likely Causes: RD/RT mismatch, MP-BGP session down, or LDP label binding issues.',
    area: 'Service Provider & Enterprise WAN Core',
    remedyItems: [
      'Verify that RD (Route Distinguisher) and RT (Route Target) values match on both PEs.',
      'Check the MP-BGP VPNv4 address-family sessions between PE routers.',
      'Confirm LDP (Label Distribution Protocol) is correctly exchanging bindings on P links.',
      'Use `show ip route vrf` to verify the presence of remote site prefixes in the RIB.'
    ],
    tags: ['mpls', 'l3vpn', 'vrf', 'mp-bgp', 'ldp', 'rt-rd'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 94
  },
  {
    id: 'kb-050',
    title: 'Carrier Leased-Line LOS & Alarm Isolation',
    category: 'WAN',
    subcategory: 'Circuit/Leased Line',
    content: 'Differentiating CPE hardware faults from carrier-side backbone outages.',
    problem: 'Primary circuit Down. Likely Causes: Physical cable/SFP fault, Local loop outage, or Carrier maintenance.',
    area: 'Carrier Transport & Physical WAN',
    remedyItems: [
      'Conduct a local physical layer check (Demarc, SFP, patch cable) at the CPE.',
      'Analyze interface alarms for specific loss-of-signal (LOS) or framing (LOF) flags.',
      'Request a loopback test from the carrier to isolate the point of failure.',
      'Cross-reference downtime with known carrier maintenance windows or portal status.'
    ],
    tags: ['wan', 'circuit', 'carrier', 'leased-line', 'los', 'alarm'],
    linkedIntents: [],
    lastUpdated: '2026-03-23T18:20:00Z',
    effectiveness: 95
  }
];

// KB Categories for navigation
export const mockKBCategories = [
  {
    id: 'network-kb',
    name: 'Network',
    subcategories: ['Link Layer', 'Routing', 'Switching'],
    articleCount: 8
  },
  {
    id: 'database-kb',
    name: 'Database',
    subcategories: ['Connection Management', 'Performance', 'Replication'],
    articleCount: 5
  },
  {
    id: 'compute-kb',
    name: 'Compute',
    subcategories: ['CPU', 'Memory', 'Process Management'],
    articleCount: 6
  },
  {
    id: 'storage-kb',
    name: 'Storage',
    subcategories: ['Disk', 'I/O Operations'],
    articleCount: 3
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
