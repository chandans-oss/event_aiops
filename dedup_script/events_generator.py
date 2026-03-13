#!/usr/bin/env python3
"""
=============================================================================
Telecom Network Event Generator
=============================================================================
Generates synthetic correlated events across 3 sources for multiple devices.

Event Types:
  HIGH_LATENCY | HIGH_CPU | HIGH_UTIL_WARNING |
  INTERFACE_FLAP | INTERFACE_DOWN | PACKET_DROP

Output → data/ folder:
  data/network_events.csv
  data/nms_events.csv
  data/syslogs.csv

Usage:
  python generate_events.py
  python generate_events.py --out-dir ./data --burst-count 3 --duration 120
  python generate_events.py --seed 99 --start-time "2025-11-01T08:00:00"
=============================================================================
"""

import csv, random, argparse, logging, sys
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from pathlib import Path

logging.basicConfig(level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger("EventGenerator")

# ---------------------------------------------------------------------------
# Topology
# ---------------------------------------------------------------------------
@dataclass
class Interface:
    name: str
    speed_gbps: int
    peer: str = ""

@dataclass
class NetworkDevice:
    hostname: str
    device_type: str
    site: str
    interfaces: list[Interface] = field(default_factory=list)

DEVICE_FLEET = [
    NetworkDevice("core-router-dc1",      "core-router",   "DC1", [
        Interface("Gi0/1/0", 10, "edge-router-dc1"),
        Interface("Gi0/1/1", 10, "core-router-dc2"),
        Interface("Gi0/2/0",100, "backbone-pe1"),
        Interface("Gi0/2/1", 10, "firewall-dc1"),
    ]),
    NetworkDevice("core-router-dc2",      "core-router",   "DC2", [
        Interface("Gi0/1/0", 10, "edge-router-dc2"),
        Interface("Gi0/1/1", 10, "core-router-dc1"),
        Interface("Gi0/2/0",100, "backbone-pe2"),
    ]),
    NetworkDevice("edge-router-dc1",      "edge-router",   "DC1", [
        Interface("Te0/0/0", 10, "isp-a-peer"),
        Interface("Te0/0/1", 10, "isp-b-peer"),
        Interface("Gi0/1/0",  1, "core-router-dc1"),
    ]),
    NetworkDevice("edge-router-dc2",      "edge-router",   "DC2", [
        Interface("Te0/0/0", 10, "isp-c-peer"),
        Interface("Te0/0/1", 10, "isp-d-peer"),
        Interface("Gi0/1/0",  1, "core-router-dc2"),
    ]),
    NetworkDevice("access-switch-floor1", "access-switch", "DC1", [
        Interface("Fa0/1",  1, "workstation-101"),
        Interface("Fa0/2",  1, "workstation-102"),
        Interface("Gi0/1", 10, "core-router-dc1"),
        Interface("Gi0/2", 10, "core-router-dc1"),
    ]),
    NetworkDevice("access-switch-floor2", "access-switch", "DC1", [
        Interface("Fa0/1",  1, "workstation-201"),
        Interface("Fa0/2",  1, "workstation-202"),
        Interface("Gi0/1", 10, "core-router-dc1"),
    ]),
    NetworkDevice("firewall-dc1",         "firewall",      "DC1", [
        Interface("eth0", 10, "core-router-dc1"),
        Interface("eth1", 10, "dmz-switch"),
    ]),
    NetworkDevice("backbone-pe1",         "core-router",   "POP-NYC", [
        Interface("Gi0/0/0",100, "core-router-dc1"),
        Interface("Gi0/0/1",100, "backbone-pe2"),
        Interface("Gi0/1/0", 10, "customer-ce1"),
    ]),
]

PROCESSES = ["bgp", "ospf", "rib-mgr", "fib-mgr", "netflow", "snmpd", "sshd"]

SCENARIO_DEVICES = {
    "HIGH_LATENCY":      ["core-router", "edge-router"],
    "HIGH_CPU":          ["core-router", "edge-router", "firewall"],
    "HIGH_UTIL_WARNING": ["core-router", "edge-router", "access-switch"],
    "INTERFACE_FLAP":    ["core-router", "edge-router", "access-switch"],
    "INTERFACE_DOWN":    ["core-router", "edge-router", "access-switch", "firewall"],
    "PACKET_DROP":       ["core-router", "edge-router", "access-switch"],
}

def ts(dt): return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
def at(base, mins): return ts(base + timedelta(minutes=mins))
def alarm_id(rng): return f"ALARM-{rng.randint(10000,99999)}"

# ---------------------------------------------------------------------------
# Scenario builders — return (net_rows, nms_rows, log_rows)
# ---------------------------------------------------------------------------

def HIGH_LATENCY(dev, iface, start, rng):
    peer = iface.peer or "10.0.0.1"
    net = [
        {"timestamp":at(start,0),  "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_LATENCY", "severity":"Minor",    "event_msg":f"Round-trip latency on {iface.name} elevated: 25ms (baseline: 2ms)."},
        {"timestamp":at(start,5),  "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_LATENCY", "severity":"Major",    "event_msg":f"Latency on {iface.name} exceeded SLA threshold: 80ms."},
        {"timestamp":at(start,12), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_LATENCY", "severity":"Critical", "event_msg":f"Critical latency on {iface.name}: 180ms — traffic engineering triggered."},
        {"timestamp":at(start,8),  "device":dev.hostname, "resource_name":"QoS-Policy","resource_type":"QoS",       "event_type":"HIGH_LATENCY", "severity":"Major",    "event_msg":f"QoS output queue depth on {iface.name} at 92%. Tail drops imminent."},
    ]
    nms = [
        {"timestamp":at(start,6),  "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name,    "resource_type":"interface", "alert_msg":f"High latency on {iface.name} at {dev.hostname}: RTT=80ms (SLA: 10ms)"},
        {"timestamp":at(start,10), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":"QoS-Policy",  "resource_type":"qos",       "alert_msg":f"QoS SLA breach on {dev.hostname}: packet delay variation exceeded threshold"},
    ]
    log = [
        {"timestamp":at(start,0),  "device":dev.hostname, "res_name":iface.name, "severity":"warning",  "message":f"IP SLA probe to {peer} RTT=25ms — above warning threshold"},
        {"timestamp":at(start,7),  "device":dev.hostname, "res_name":"QoS",      "severity":"warning",  "message":f"CBWFQ queue on {iface.name} at 85% — increased scheduling delay"},
        {"timestamp":at(start,12), "device":dev.hostname, "res_name":iface.name, "severity":"critical", "message":f"IP SLA RTT=180ms: SLA violated on path to {peer}"},
        {"timestamp":at(start,15), "device":dev.hostname, "res_name":"device",   "severity":"info",     "message":f"MPLS TE tunnel rerouted to secondary path due to high latency on {dev.hostname}"},
    ]
    return net, nms, log


def HIGH_CPU(dev, iface, start, rng):
    proc = rng.choice(PROCESSES)
    net = [
        {"timestamp":at(start,0),  "device":dev.hostname, "resource_name":"CPU", "resource_type":"Processor", "event_type":"HIGH_CPU", "severity":"Minor",    "event_msg":"CPU usage at 65%. Monitoring elevated load."},
        {"timestamp":at(start,5),  "device":dev.hostname, "resource_name":"CPU", "resource_type":"Processor", "event_type":"HIGH_CPU", "severity":"Major",    "event_msg":"CPU usage reached 78%. Process scheduling impacted."},
        {"timestamp":at(start,10), "device":dev.hostname, "resource_name":"CPU", "resource_type":"Processor", "event_type":"HIGH_CPU", "severity":"Critical", "event_msg":"CPU usage critical at 91%. Control plane at risk."},
        {"timestamp":at(start,18), "device":dev.hostname, "resource_name":"CPU", "resource_type":"Processor", "event_type":"HIGH_CPU", "severity":"Critical", "event_msg":f"CPU sustaining 95% for >5 min. Process {proc} consuming highest cycles."},
    ]
    nms = [
        {"timestamp":at(start,6),  "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":"CPU", "resource_type":"processor", "alert_msg":f"CPU utilization exceeded 80% on {dev.hostname} — control plane risk"},
        {"timestamp":at(start,12), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":"CPU", "resource_type":"processor", "alert_msg":f"CPU sustaining >90% on {dev.hostname} — process {proc} is top consumer"},
    ]
    log = [
        {"timestamp":at(start,5),  "device":dev.hostname, "res_name":"CPU",    "severity":"warning",  "message":f"CPU utilization at 78% — BGP keepalive processing delayed"},
        {"timestamp":at(start,10), "device":dev.hostname, "res_name":"CPU",    "severity":"critical", "message":f"CPU at 91% — process {proc} in tight loop. Stack trace captured."},
        {"timestamp":at(start,12), "device":dev.hostname, "res_name":"device", "severity":"critical", "message":f"Punt path throttled — control plane protection activated on {dev.hostname}"},
        {"timestamp":at(start,22), "device":dev.hostname, "res_name":"CPU",    "severity":"warning",  "message":f"CPU load normalizing: 55% after process {proc} restarted"},
    ]
    return net, nms, log


def HIGH_UTIL_WARNING(dev, iface, start, rng):
    net = [
        {"timestamp":at(start,0),  "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_UTIL_WARNING", "severity":"Minor", "event_msg":f"Interface {iface.name} utilization at 55%. Trending upward."},
        {"timestamp":at(start,5),  "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_UTIL_WARNING", "severity":"Minor", "event_msg":f"Interface {iface.name} utilization at 65%. Above warning threshold."},
        {"timestamp":at(start,10), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_UTIL_WARNING", "severity":"Major", "event_msg":f"Interface {iface.name} utilization at 75%. Approaching capacity."},
        {"timestamp":at(start,18), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"HIGH_UTIL_WARNING", "severity":"Major", "event_msg":f"Interface {iface.name} utilization at 82%. Traffic engineering recommended."},
    ]
    nms = [
        {"timestamp":at(start,11), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name, "resource_type":"interface", "alert_msg":f"Interface utilization warning on {iface.name} at {dev.hostname}: 75% (threshold: 70%)"},
    ]
    log = [
        {"timestamp":at(start,0),  "device":dev.hostname, "res_name":iface.name, "severity":"info",    "message":f"Traffic rate on {iface.name} increasing: 55% of {iface.speed_gbps}Gbps capacity"},
        {"timestamp":at(start,10), "device":dev.hostname, "res_name":iface.name, "severity":"warning", "message":f"Interface {iface.name} bandwidth utilization high: 75% — consider load balancing"},
        {"timestamp":at(start,15), "device":dev.hostname, "res_name":"device",   "severity":"info",    "message":f"ECMP load balancing active on {dev.hostname} — distributing traffic across uplinks"},
        {"timestamp":at(start,18), "device":dev.hostname, "res_name":iface.name, "severity":"warning", "message":f"Utilization on {iface.name} at 82% — backup traffic contributing to congestion"},
    ]
    return net, nms, log


def INTERFACE_FLAP(dev, iface, start, rng):
    crc = rng.randint(200, 8000)
    net = [
        {"timestamp":at(start,0), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_FLAP", "severity":"Critical", "event_msg":f"Interface {iface.name} went DOWN. Line protocol is down."},
        {"timestamp":at(start,2), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_FLAP", "severity":"Minor",    "event_msg":f"Interface {iface.name} came UP. Line protocol is up."},
        {"timestamp":at(start,4), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_FLAP", "severity":"Critical", "event_msg":f"Interface {iface.name} went DOWN again. Repeated flap detected."},
        {"timestamp":at(start,7), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_FLAP", "severity":"Minor",    "event_msg":f"Interface {iface.name} came UP (flap #3). SFP or cable fault suspected."},
        {"timestamp":at(start,9), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_FLAP", "severity":"Major",    "event_msg":f"CRC errors on {iface.name}: {crc} errors/min. Physical layer issue."},
    ]
    nms = [
        {"timestamp":at(start,1),  "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name, "resource_type":"interface", "alert_msg":f"Interface {iface.name} DOWN on {dev.hostname} — service impact possible"},
        {"timestamp":at(start,5),  "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name, "resource_type":"interface", "alert_msg":f"Repeated interface flap on {iface.name} at {dev.hostname} — hardware fault suspected"},
        {"timestamp":at(start,10), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name, "resource_type":"interface", "alert_msg":f"CRC error rate critical on {iface.name} at {dev.hostname} — physical layer degraded"},
    ]
    log = [
        {"timestamp":at(start,0),  "device":dev.hostname, "res_name":iface.name, "severity":"critical", "message":f"%LINEPROTO-5-UPDOWN: Interface {iface.name} changed state to down"},
        {"timestamp":at(start,2),  "device":dev.hostname, "res_name":iface.name, "severity":"info",     "message":f"%LINEPROTO-5-UPDOWN: Interface {iface.name} changed state to up"},
        {"timestamp":at(start,4),  "device":dev.hostname, "res_name":iface.name, "severity":"critical", "message":f"%LINEPROTO-5-UPDOWN: Interface {iface.name} changed state to down"},
        {"timestamp":at(start,7),  "device":dev.hostname, "res_name":iface.name, "severity":"info",     "message":f"%LINEPROTO-5-UPDOWN: Interface {iface.name} changed state to up"},
        {"timestamp":at(start,9),  "device":dev.hostname, "res_name":iface.name, "severity":"warning",  "message":f"High CRC error rate on {iface.name} — duplex mismatch or cable degradation"},
        {"timestamp":at(start,11), "device":dev.hostname, "res_name":"device",   "severity":"info",     "message":f"Carrier Ethernet OAM fault detected on {iface.name} — notifying NOC"},
    ]
    return net, nms, log


def INTERFACE_DOWN(dev, iface, start, rng):
    peer = iface.peer or "10.0.0.1"
    net = [
        {"timestamp":at(start,0), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Interface", "event_type":"INTERFACE_DOWN", "severity":"Critical", "event_msg":f"Interface {iface.name} is DOWN. No carrier detected."},
        {"timestamp":at(start,1), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Routing",   "event_type":"INTERFACE_DOWN", "severity":"Critical", "event_msg":f"OSPF neighbor {peer} lost via {iface.name}. Adjacency dropped."},
        {"timestamp":at(start,2), "device":dev.hostname, "resource_name":iface.name, "resource_type":"Routing",   "event_type":"INTERFACE_DOWN", "severity":"Critical", "event_msg":f"BGP session with {peer} down — interface {iface.name} unreachable."},
    ]
    nms = [
        {"timestamp":at(start,1), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name, "resource_type":"interface", "alert_msg":f"CRITICAL: Interface {iface.name} on {dev.hostname} DOWN — no recovery. Outage declared."},
        {"timestamp":at(start,3), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":"Routing",  "resource_type":"routing",   "alert_msg":f"Routing adjacency lost on {dev.hostname} due to interface {iface.name} failure"},
    ]
    log = [
        {"timestamp":at(start,0), "device":dev.hostname, "res_name":iface.name, "severity":"critical", "message":f"%LINEPROTO-5-UPDOWN: Interface {iface.name} changed state to down — no carrier"},
        {"timestamp":at(start,1), "device":dev.hostname, "res_name":"OSPF",     "severity":"critical", "message":f"%OSPF-5-ADJCHG: Nbr {peer} on {iface.name} from FULL to DOWN, Dead timer expired"},
        {"timestamp":at(start,2), "device":dev.hostname, "res_name":"BGP",      "severity":"critical", "message":f"%BGP-5-ADJCHANGE: neighbor {peer} Down — interface failure"},
        {"timestamp":at(start,3), "device":dev.hostname, "res_name":"device",   "severity":"warning",  "message":f"Failover route activated: traffic rerouted via secondary path on {dev.hostname}"},
        {"timestamp":at(start,5), "device":dev.hostname, "res_name":"device",   "severity":"info",     "message":f"NOC ticket auto-created for interface {iface.name} outage on {dev.hostname}"},
    ]
    return net, nms, log


def PACKET_DROP(dev, iface, start, rng):
    net = [
        {"timestamp":at(start,0),  "device":dev.hostname, "resource_name":iface.name,   "resource_type":"Interface", "event_type":"PACKET_DROP", "severity":"Minor",    "event_msg":f"Input packet drops on {iface.name}: 120 drops/min. Queue congestion."},
        {"timestamp":at(start,5),  "device":dev.hostname, "resource_name":iface.name,   "resource_type":"Interface", "event_type":"PACKET_DROP", "severity":"Major",    "event_msg":f"Packet drop rate on {iface.name} increasing: 850 drops/min. SLA impact."},
        {"timestamp":at(start,12), "device":dev.hostname, "resource_name":iface.name,   "resource_type":"Interface", "event_type":"PACKET_DROP", "severity":"Critical", "event_msg":f"Critical packet loss on {iface.name}: 4200 drops/min. Blackholing risk."},
        {"timestamp":at(start,8),  "device":dev.hostname, "resource_name":"QoS-Policy", "resource_type":"QoS",       "event_type":"PACKET_DROP", "severity":"Major",    "event_msg":f"QoS tail drop on {iface.name}: BE traffic sacrificed. 3000 pkts/sec dropped."},
        {"timestamp":at(start,10), "device":dev.hostname, "resource_name":iface.name,   "resource_type":"Interface", "event_type":"PACKET_DROP", "severity":"Major",    "event_msg":f"Output queue drops on {iface.name}: 600 drops/min — transmit ring full."},
    ]
    nms = [
        {"timestamp":at(start,6), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":iface.name,   "resource_type":"interface", "alert_msg":f"Packet drop alert on {iface.name} at {dev.hostname}: 850 drops/min (threshold: 100/min)"},
        {"timestamp":at(start,9), "device":dev.hostname, "alarm_id":alarm_id(rng), "resource_name":"QoS-Policy", "resource_type":"qos",       "alert_msg":f"QoS tail drop threshold exceeded on {dev.hostname} {iface.name} — SLA breach imminent"},
    ]
    log = [
        {"timestamp":at(start,0),  "device":dev.hostname, "res_name":iface.name, "severity":"warning",  "message":f"Input drops detected on {iface.name}: 120 packets dropped in last interval"},
        {"timestamp":at(start,8),  "device":dev.hostname, "res_name":iface.name, "severity":"warning",  "message":f"Output queue on {iface.name} filling: 600 tail drops observed"},
        {"timestamp":at(start,12), "device":dev.hostname, "res_name":"QoS",      "severity":"critical", "message":f"QoS policy on {iface.name}: DSCP BE traffic dropped — 3000 pkts/sec"},
        {"timestamp":at(start,15), "device":dev.hostname, "res_name":"device",   "severity":"info",     "message":f"Backup traffic de-prioritized on {dev.hostname} to reduce packet drops"},
    ]
    return net, nms, log


BUILDERS = {
    "HIGH_LATENCY":      HIGH_LATENCY,
    "HIGH_CPU":          HIGH_CPU,
    "HIGH_UTIL_WARNING": HIGH_UTIL_WARNING,
    "INTERFACE_FLAP":    INTERFACE_FLAP,
    "INTERFACE_DOWN":    INTERFACE_DOWN,
    "PACKET_DROP":       PACKET_DROP,
}

# ---------------------------------------------------------------------------
# CSV field definitions
# ---------------------------------------------------------------------------
NET_FIELDS = ["timestamp","device","resource_name","resource_type","event_type","severity","event_msg","scenario"]
NMS_FIELDS = ["timestamp","device","alarm_id","resource_name","resource_type","alert_msg","scenario"]
LOG_FIELDS = ["timestamp","device","res_name","severity","message","scenario"]


def write_csv(path, fieldnames, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


# ---------------------------------------------------------------------------
# Main generate function
# ---------------------------------------------------------------------------
def generate(out_dir="data", start_time=None, duration_minutes=60, burst_count=2, seed=42,
             total_events=None, network_count=None, nms_count=None, syslog_count=None):
    """
    Event count control — three approaches:

    Approach A  Direct per-file counts:
        network_count=200, nms_count=50, syslog_count=150
        Generates exactly those counts per file.

    Approach B  Total events split proportionally (60% net / 15% nms / 25% syslog):
        total_events=500  =>  network=300, nms=75, syslog=125

    Approach C  Indirect (original behaviour):
        burst_count=N, duration_minutes=M
        Approx output: net = bursts*32 + background, nms = bursts*16, syslog = bursts*32 + bg
    """
    rng   = random.Random(seed)
    start = start_time or datetime(2025, 10, 28, 14, 0, 0)
    out   = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    # Resolve Approach B -> A
    if total_events is not None:
        network_count = network_count or int(total_events * 0.60)
        nms_count     = nms_count     or int(total_events * 0.15)
        syslog_count  = syslog_count  or (total_events - network_count - nms_count)

    # If explicit counts given, make sure burst_count produces enough raw events
    if network_count is not None:
        needed = max(1, (network_count // (len(DEVICE_FLEET) * 4)) + 1)
        burst_count = max(burst_count, needed)
        logger.info(f"Target: network={network_count} nms={nms_count} "
                    f"syslog={syslog_count} | burst_count adjusted -> {burst_count}")

    all_net, all_nms, all_log = [], [], []

    logger.info(f"Devices: {len(DEVICE_FLEET)} | Scenarios: {len(BUILDERS)} | Bursts/device: {burst_count}")

    for dev in DEVICE_FLEET:
        applicable = [s for s, types in SCENARIO_DEVICES.items() if dev.device_type in types]
        if not applicable:
            continue
        for _ in range(burst_count):
            scenario    = rng.choice(applicable)
            iface       = rng.choice(dev.interfaces)
            offset      = rng.randint(0, max(1, duration_minutes - 25))
            burst_start = start + timedelta(minutes=offset)

            net, nms, log = BUILDERS[scenario](dev, iface, burst_start, rng)
            for r in net: r["scenario"] = scenario
            for r in nms: r["scenario"] = scenario
            for r in log: r["scenario"] = scenario

            all_net.extend(net)
            all_nms.extend(nms)
            all_log.extend(log)

    # Background noise — normal polling + SNMP keepalives
    for dev in DEVICE_FLEET:
        for iface in dev.interfaces:
            for offset in range(0, duration_minutes + 1, 15):
                util = rng.randint(3, 22)
                all_net.append({
                    "timestamp": ts(start + timedelta(minutes=offset)),
                    "device": dev.hostname, "resource_name": iface.name,
                    "resource_type": "Interface", "event_type": "HIGH_UTIL_WARNING",
                    "severity": "Informational",
                    "event_msg": f"Interface {iface.name} utilization at {util}%. Normal.",
                    "scenario": "BACKGROUND",
                })
        for offset in [0, 30, 60]:
            if offset > duration_minutes: break
            all_log.append({
                "timestamp": ts(start + timedelta(minutes=offset)),
                "device": dev.hostname, "res_name": "SNMP", "severity": "info",
                "message": f"SNMP poll response from {dev.hostname}: system up.",
                "scenario": "BACKGROUND",
            })

    # ------------------------------------------------------------------
    # Trim or pad to exact target counts
    # ------------------------------------------------------------------
    def _make_bg_net(rng, start, duration_minutes):
        dev   = rng.choice(DEVICE_FLEET)
        iface = rng.choice(dev.interfaces)
        off   = rng.randint(0, duration_minutes)
        util  = rng.randint(1, 20)
        return {"timestamp": ts(start + timedelta(minutes=off)),
                "device": dev.hostname, "resource_name": iface.name,
                "resource_type": "Interface", "event_type": "POLL",
                "severity": "Informational",
                "event_msg": f"Background poll {iface.name}: util={util}%.",
                "scenario": "BACKGROUND"}

    def _make_bg_nms(rng, start, duration_minutes):
        dev   = rng.choice(DEVICE_FLEET)
        iface = rng.choice(dev.interfaces)
        off   = rng.randint(0, duration_minutes)
        return {"timestamp": ts(start + timedelta(minutes=off)),
                "device": dev.hostname,
                "alarm_id": f"BG-{rng.randint(10000,99999)}",
                "resource_name": iface.name, "resource_type": "Interface",
                "alert_msg": f"Status poll on {iface.name}: normal.",
                "scenario": "BACKGROUND"}

    def _make_bg_log(rng, start, duration_minutes):
        dev   = rng.choice(DEVICE_FLEET)
        iface = rng.choice(dev.interfaces)
        off   = rng.randint(0, duration_minutes)
        return {"timestamp": ts(start + timedelta(minutes=off)),
                "device": dev.hostname, "res_name": iface.name,
                "severity": "info",
                "message": f"Background keepalive {dev.hostname}/{iface.name}.",
                "scenario": "BACKGROUND"}

    def _apply_target(rows, target, make_bg_fn, label):
        if target is None:
            return rows
        if len(rows) > target:
            # Keep all scenario events, trim background from the end
            sc_rows = [r for r in rows if r.get("scenario") != "BACKGROUND"]
            bg_rows = [r for r in rows if r.get("scenario") == "BACKGROUND"]
            keep_bg = max(0, target - len(sc_rows))
            result  = sc_rows + bg_rows[:keep_bg]
            logger.info(f"[{label}] {len(rows)} -> trimmed to {len(result)}")
            return result
        while len(rows) < target:
            rows.append(make_bg_fn(rng, start, duration_minutes))
        logger.info(f"[{label}] padded to {len(rows)}")
        return rows

    all_net = _apply_target(all_net, network_count, _make_bg_net, "network")
    all_nms = _apply_target(all_nms, nms_count,     _make_bg_nms, "nms")
    all_log = _apply_target(all_log, syslog_count,  _make_bg_log, "syslog")

    # Sort and write
    all_net.sort(key=lambda r: r["timestamp"])
    all_nms.sort(key=lambda r: r["timestamp"])
    all_log.sort(key=lambda r: r["timestamp"])

    net_path = out / "network_events.csv"
    nms_path = out / "nms_events.csv"
    log_path = out / "syslogs.csv"

    write_csv(net_path, NET_FIELDS, all_net)
    write_csv(nms_path, NMS_FIELDS, all_nms)
    write_csv(log_path, LOG_FIELDS, all_log)

    # Per-scenario counts for summary
    sc: dict = {}
    for r in all_net: sc.setdefault(r["scenario"], [0,0,0])[0] += 1
    for r in all_nms: sc.setdefault(r["scenario"], [0,0,0])[1] += 1
    for r in all_log: sc.setdefault(r["scenario"], [0,0,0])[2] += 1

    print("\n" + "="*66)
    print("  TELECOM EVENT GENERATOR — SUMMARY")
    print("="*66)
    print(f"  Start       : {start}    Duration : {duration_minutes} min")
    print(f"  Devices     : {len(DEVICE_FLEET)}               Bursts/dev: {burst_count}")
    print(f"  Output dir  : {out.resolve()}")
    print(f"  {'─'*58}")
    print(f"  {'Scenario':<24} {'Network':>9} {'NMS':>6} {'Syslog':>8}")
    print(f"  {'─'*58}")
    for s in list(BUILDERS.keys()) + ["BACKGROUND"]:
        c = sc.get(s, [0,0,0])
        print(f"  {s:<24} {c[0]:>9} {c[1]:>6} {c[2]:>8}")
    print(f"  {'─'*58}")
    total_net = len(all_net); total_nms = len(all_nms); total_log = len(all_log)
    print(f"  {'TOTAL':<24} {total_net:>9} {total_nms:>6} {total_log:>8}")
    print(f"  {'Grand Total':<34} {total_net+total_nms+total_log:>9}")
    print("="*66)
    print(f"\n  Files:")
    print(f"    {net_path}   ({total_net} rows)")
    print(f"    {nms_path}    ({total_nms} rows)")
    print(f"    {log_path}       ({total_log} rows)")
    print(f"\n  Run correlator:")
    print(f"    python telecom_event_correlator.py \\")
    print(f"      --network {net_path} --nms {nms_path} --syslog {log_path} \\")
    print(f"      --output  {out}/enriched_events.csv")
    print("="*66 + "\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    p = argparse.ArgumentParser(
        description="Generate telecom events → data/network_events.csv, nms_events.csv, syslogs.csv",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Event types: HIGH_LATENCY | HIGH_CPU | HIGH_UTIL_WARNING | INTERFACE_FLAP | INTERFACE_DOWN | PACKET_DROP

Count control examples:
  # Exactly 1000 total events (auto split 60/15/25)
  python generate_events.py --total-events 1000

  # Exact per-file counts
  python generate_events.py --network-count 500 --nms-count 100 --syslog-count 300

  # Original indirect control
  python generate_events.py --burst-count 5 --duration 120
        """
    )
    p.add_argument("--out-dir",       default="data",                help="Output folder (default: data/)")
    p.add_argument("--duration",      type=int, default=60,          help="Window in minutes (default: 60)")
    p.add_argument("--burst-count",   type=int, default=2,           help="Scenario bursts per device (default: 2)")
    p.add_argument("--seed",          type=int, default=42,          help="Random seed for reproducibility (default: 42)")
    p.add_argument("--start-time",    default="2025-10-28T14:00:00", help="ISO start timestamp")

    # Count control
    grp = p.add_argument_group("Count control (optional — overrides burst-count)")
    grp.add_argument("--total-events",   type=int, default=None,
                     help="Total events across all files (split 60%% net / 15%% nms / 25%% syslog)")
    grp.add_argument("--network-count",  type=int, default=None,
                     help="Exact number of network_events.csv rows")
    grp.add_argument("--nms-count",      type=int, default=None,
                     help="Exact number of nms_events.csv rows")
    grp.add_argument("--syslog-count",   type=int, default=None,
                     help="Exact number of syslogs.csv rows")

    args = p.parse_args()

    try:
        start = datetime.fromisoformat(args.start_time)
    except ValueError:
        logger.error(f"Bad --start-time: {args.start_time}")
        sys.exit(1)

    generate(
        out_dir         = args.out_dir,
        start_time      = start,
        duration_minutes= args.duration,
        burst_count     = args.burst_count,
        seed            = args.seed,
        total_events    = args.total_events,
        network_count   = args.network_count,
        nms_count       = args.nms_count,
        syslog_count    = args.syslog_count,
    )

if __name__ == "__main__":
    main()