export const RAW_TRAINING_REPORTS: Record<string, string> = {
  cross_correlation: `
 ##############################################################################
# PROCESSING: ROUTER
##############################################################################

==============================================================================
 SECTION 1 -- CROSS-CORRELATION [ROUTER]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.7516      0.7159  queue_depth LEADS util_pct by 5 min
  util_pct               crc_errors                   -2 polls     0.7381      0.7158  crc_errors LEADS util_pct by 10 min
  util_pct               latency_ms                   -1 polls     0.7530      0.7235  latency_ms LEADS util_pct by 5 min
  util_pct               cpu_pct                      +0 polls     0.7830      0.7541  simultaneous
  util_pct               mem_util_pct                 -1 polls     0.6164      0.6073  mem_util_pct LEADS util_pct by 5 min
  util_pct               temp_c                       -2 polls     0.6433      0.6173  temp_c LEADS util_pct by 10 min
  util_pct               fan_speed_rpm                -2 polls     0.1640      0.1538  fan_speed_rpm LEADS util_pct by 10 min
  util_pct               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  util_pct               reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  queue_depth            crc_errors                   -1 polls     0.9432      0.9442  crc_errors LEADS queue_depth by 5 min
  queue_depth            latency_ms                   +0 polls     0.9959      0.9933  simultaneous
  queue_depth            cpu_pct                      +1 polls     0.8546      0.8052  queue_depth LEADS cpu_pct by 5 min
  queue_depth            mem_util_pct                 +1 polls     0.6727      0.6167  queue_depth LEADS mem_util_pct by 5 min
  queue_depth            temp_c                       -1 polls     0.6630      0.6128  temp_c LEADS queue_depth by 5 min
  queue_depth            fan_speed_rpm                -2 polls     0.2552      0.2042  fan_speed_rpm LEADS queue_depth by 10 min
  queue_depth            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  queue_depth            reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  crc_errors             latency_ms                   +1 polls     0.9399      0.9398  crc_errors LEADS latency_ms by 5 min
  crc_errors             cpu_pct                      +2 polls     0.8010      0.7827  crc_errors LEADS cpu_pct by 10 min
  crc_errors             mem_util_pct                 +2 polls     0.6473      0.5991  crc_errors LEADS mem_util_pct by 10 min
  crc_errors             temp_c                       +1 polls     0.6210      0.5960  crc_errors LEADS temp_c by 5 min
  crc_errors             fan_speed_rpm                -1 polls     0.2289      0.2017  fan_speed_rpm LEADS crc_errors by 5 min
  crc_errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  crc_errors             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  latency_ms             cpu_pct                      +1 polls     0.8488      0.8040  latency_ms LEADS cpu_pct by 5 min
  latency_ms             mem_util_pct                 +1 polls     0.6778      0.6182  latency_ms LEADS mem_util_pct by 5 min
  latency_ms             temp_c                       -1 polls     0.6629      0.6139  temp_c LEADS latency_ms by 5 min
  latency_ms             fan_speed_rpm                -2 polls     0.2621      0.2089  fan_speed_rpm LEADS latency_ms by 10 min
  latency_ms             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  latency_ms             reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                mem_util_pct                 -3 polls     0.7047      0.6618  mem_util_pct LEADS cpu_pct by 15 min
  cpu_pct                temp_c                       -2 polls     0.7313      0.7129  temp_c LEADS cpu_pct by 10 min
  cpu_pct                fan_speed_rpm                -2 polls     0.2452      0.2289  fan_speed_rpm LEADS cpu_pct by 10 min
  cpu_pct                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           temp_c                       +1 polls     0.6262      0.6196  mem_util_pct LEADS temp_c by 5 min
  mem_util_pct           fan_speed_rpm                -6 polls     0.1894      0.1639  fan_speed_rpm LEADS mem_util_pct by 30 min
  mem_util_pct           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  temp_c                 fan_speed_rpm                +0 polls     0.2749      0.2715  simultaneous
  temp_c                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  temp_c                 reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          reboot_delta                 +0 polls     0.0000      0.0000  simultaneous
  power_supply_status    reboot_delta                 +0 polls     0.0000      0.0000  simultaneous










  --------------------------------------------------------------------------
  DEVICE TYPE: ROUTER
  --------------------------------------------------------------------------

  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Cross-Correlation Key Findings
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  queue_depth LEADS util_pct by 5 min (r=0.7516)
  crc_errors LEADS util_pct by 10 min (r=0.7381)
  latency_ms LEADS util_pct by 5 min (r=0.753)
  mem_util_pct LEADS util_pct by 5 min (r=0.6164)
  temp_c LEADS util_pct by 10 min (r=0.6433)
  fan_speed_rpm LEADS util_pct by 10 min (r=0.164)
  crc_errors LEADS queue_depth by 5 min (r=0.9432)
  queue_depth LEADS cpu_pct by 5 min (r=0.8546)
  queue_depth LEADS mem_util_pct by 5 min (r=0.6727)
  temp_c LEADS queue_depth by 5 min (r=0.663)
  fan_speed_rpm LEADS queue_depth by 10 min (r=0.2552)
  crc_errors LEADS latency_ms by 5 min (r=0.9399)
  crc_errors LEADS cpu_pct by 10 min (r=0.801)
  crc_errors LEADS mem_util_pct by 10 min (r=0.6473)
  crc_errors LEADS temp_c by 5 min (r=0.621)
  fan_speed_rpm LEADS crc_errors by 5 min (r=0.2289)
  latency_ms LEADS cpu_pct by 5 min (r=0.8488)
  latency_ms LEADS mem_util_pct by 5 min (r=0.6778)
  temp_c LEADS latency_ms by 5 min (r=0.6629)
  fan_speed_rpm LEADS latency_ms by 10 min (r=0.2621)
  mem_util_pct LEADS cpu_pct by 15 min (r=0.7047)
  temp_c LEADS cpu_pct by 10 min (r=0.7313)
  fan_speed_rpm LEADS cpu_pct by 10 min (r=0.2452)
  mem_util_pct LEADS temp_c by 5 min (r=0.6262)
  fan_speed_rpm LEADS mem_util_pct by 30 min (r=0.1894)






  ##############################################################################
# PROCESSING: SWITCH
##############################################################################

==============================================================================
 SECTION 1 -- CROSS-CORRELATION [SWITCH]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  -1 polls     0.8942      0.8607  queue_depth LEADS util_pct by 5 min
  util_pct               crc_errors                   -2 polls     0.8482      0.8252  crc_errors LEADS util_pct by 10 min
  util_pct               latency_ms                   -1 polls     0.8906      0.8589  latency_ms LEADS util_pct by 5 min
  util_pct               cpu_pct                      -1 polls     0.8324      0.8224  cpu_pct LEADS util_pct by 5 min
  util_pct               mem_util_pct                -10 polls     0.2118      0.2028  mem_util_pct LEADS util_pct by 50 min
  util_pct               temp_c                       -3 polls     0.2936      0.2858  temp_c LEADS util_pct by 15 min
  util_pct               fan_speed_rpm                -9 polls     0.1935      0.2099  fan_speed_rpm LEADS util_pct by 45 min
  util_pct               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  util_pct               reboot_delta                 +4 polls    -0.0957     -0.1054  util_pct LEADS reboot_delta by 20 min
  queue_depth            crc_errors                   -1 polls     0.9456      0.9531  crc_errors LEADS queue_depth by 5 min
  queue_depth            latency_ms                   +0 polls     0.9976      0.9945  simultaneous
  queue_depth            cpu_pct                      +1 polls     0.8872      0.9162  queue_depth LEADS cpu_pct by 5 min
  queue_depth            mem_util_pct                 -8 polls     0.2111      0.1985  mem_util_pct LEADS queue_depth by 40 min
  queue_depth            temp_c                       -2 polls     0.3114      0.3067  temp_c LEADS queue_depth by 10 min
  queue_depth            fan_speed_rpm                -7 polls     0.2013      0.1864  fan_speed_rpm LEADS queue_depth by 35 min
  queue_depth            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  queue_depth            reboot_delta                 +4 polls    -0.0969     -0.1283  queue_depth LEADS reboot_delta by 20 min
  crc_errors             latency_ms                   +1 polls     0.9448      0.9529  crc_errors LEADS latency_ms by 5 min
  crc_errors             cpu_pct                      +2 polls     0.8207      0.8694  crc_errors LEADS cpu_pct by 10 min
  crc_errors             mem_util_pct                 -2 polls     0.2055      0.1809  mem_util_pct LEADS crc_errors by 10 min
  crc_errors             temp_c                       +0 polls     0.3126      0.3057  simultaneous
  crc_errors             fan_speed_rpm               -13 polls     0.1810      0.1177  fan_speed_rpm LEADS crc_errors by 65 min
  crc_errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  crc_errors             reboot_delta                 -2 polls    -0.0785     -0.1385  reboot_delta LEADS crc_errors by 10 min
  latency_ms             cpu_pct                      +1 polls     0.8861      0.9151  latency_ms LEADS cpu_pct by 5 min
  latency_ms             mem_util_pct                 -8 polls     0.2130      0.1963  mem_util_pct LEADS latency_ms by 40 min
  latency_ms             temp_c                       -2 polls     0.3124      0.3096  temp_c LEADS latency_ms by 10 min
  latency_ms             fan_speed_rpm                -7 polls     0.1953      0.1877  fan_speed_rpm LEADS latency_ms by 35 min
  latency_ms             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  latency_ms             reboot_delta                 -2 polls    -0.1008     -0.1284  reboot_delta LEADS latency_ms by 10 min
  cpu_pct                mem_util_pct                 +0 polls     0.2202      0.2113  simultaneous
  cpu_pct                temp_c                       -3 polls     0.3119      0.3176  temp_c LEADS cpu_pct by 15 min
  cpu_pct                fan_speed_rpm                -7 polls     0.1892      0.1911  fan_speed_rpm LEADS cpu_pct by 35 min
  cpu_pct                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  cpu_pct                reboot_delta                 +2 polls    -0.1266     -0.1284  cpu_pct LEADS reboot_delta by 10 min
  mem_util_pct           temp_c                       -1 polls     0.1178      0.1232  temp_c LEADS mem_util_pct by 5 min
  mem_util_pct           fan_speed_rpm                +8 polls     0.1530      0.1316  mem_util_pct LEADS fan_speed_rpm by 40 min
  mem_util_pct           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  mem_util_pct           reboot_delta                 -5 polls    -0.1168     -0.0968  reboot_delta LEADS mem_util_pct by 25 min
  temp_c                 fan_speed_rpm                +0 polls     0.2026      0.2012  simultaneous
  temp_c                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  temp_c                 reboot_delta                +15 polls     0.1248      0.0999  temp_c LEADS reboot_delta by 75 min
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          reboot_delta                 -5 polls    -0.1930     -0.1026  reboot_delta LEADS fan_speed_rpm by 25 min
  power_supply_status    reboot_delta                 +0 polls     0.0000      0.0000  simultaneous



  --------------------------------------------------------------------------
  DEVICE TYPE: SWITCH
  --------------------------------------------------------------------------

  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Cross-Correlation Key Findings
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  queue_depth LEADS util_pct by 5 min (r=0.8942)
  crc_errors LEADS util_pct by 10 min (r=0.8482)
  latency_ms LEADS util_pct by 5 min (r=0.8906)
  cpu_pct LEADS util_pct by 5 min (r=0.8324)
  mem_util_pct LEADS util_pct by 50 min (r=0.2118)
  temp_c LEADS util_pct by 15 min (r=0.2936)
  fan_speed_rpm LEADS util_pct by 45 min (r=0.1935)
  util_pct LEADS reboot_delta by 20 min (r=-0.0957)
  crc_errors LEADS queue_depth by 5 min (r=0.9456)
  queue_depth LEADS cpu_pct by 5 min (r=0.8872)
  mem_util_pct LEADS queue_depth by 40 min (r=0.2111)
  temp_c LEADS queue_depth by 10 min (r=0.3114)
  fan_speed_rpm LEADS queue_depth by 35 min (r=0.2013)
  queue_depth LEADS reboot_delta by 20 min (r=-0.0969)
  crc_errors LEADS latency_ms by 5 min (r=0.9448)
  crc_errors LEADS cpu_pct by 10 min (r=0.8207)
  mem_util_pct LEADS crc_errors by 10 min (r=0.2055)
  fan_speed_rpm LEADS crc_errors by 65 min (r=0.181)
  reboot_delta LEADS crc_errors by 10 min (r=-0.0785)
  latency_ms LEADS cpu_pct by 5 min (r=0.8861)
  mem_util_pct LEADS latency_ms by 40 min (r=0.213)
  temp_c LEADS latency_ms by 10 min (r=0.3124)
  fan_speed_rpm LEADS latency_ms by 35 min (r=0.1953)
  reboot_delta LEADS latency_ms by 10 min (r=-0.1008)
  temp_c LEADS cpu_pct by 15 min (r=0.3119)
  fan_speed_rpm LEADS cpu_pct by 35 min (r=0.1892)
  cpu_pct LEADS reboot_delta by 10 min (r=-0.1266)
  temp_c LEADS mem_util_pct by 5 min (r=0.1178)
  mem_util_pct LEADS fan_speed_rpm by 40 min (r=0.153)
  reboot_delta LEADS mem_util_pct by 25 min (r=-0.1168)
  temp_c LEADS reboot_delta by 75 min (r=0.1248)
  reboot_delta LEADS fan_speed_rpm by 25 min (r=-0.193)











  `,
  granger_causality: `
  ==============================================================================
 SECTION 2 -- GRANGER CAUSALITY [ROUTER]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +2 polls   63.183     0.000000  *** SIGNIFICANT ***
  util_pct               crc_errors                   +3 polls   34.934     0.000000  *** SIGNIFICANT ***
  util_pct               latency_ms                   +2 polls   54.799     0.000000  *** SIGNIFICANT ***
  util_pct               cpu_pct                      +6 polls    8.954     0.000000  *** SIGNIFICANT ***
  util_pct               mem_util_pct                 +1 polls   45.770     0.000000  *** SIGNIFICANT ***
  util_pct               temp_c                       +1 polls   56.131     0.000000  *** SIGNIFICANT ***
  util_pct               fan_speed_rpm                +9 polls    2.371     0.013630  *** SIGNIFICANT ***
  util_pct               power_supply_status          +1 polls    0.000     1.000000  not significant
  util_pct               reboot_delta                 +1 polls    0.000     1.000000  not significant
  queue_depth            crc_errors                   +1 polls  289.313     0.000000  *** SIGNIFICANT ***
  queue_depth            latency_ms                   +2 polls    4.154     0.016674  *** SIGNIFICANT ***
  queue_depth            cpu_pct                      +1 polls    9.095     0.002795  *** SIGNIFICANT ***
  queue_depth            mem_util_pct                 +1 polls   50.067     0.000000  *** SIGNIFICANT ***
  queue_depth            temp_c                       +1 polls   69.147     0.000000  *** SIGNIFICANT ***
  queue_depth            fan_speed_rpm                +7 polls    4.837     0.000038  *** SIGNIFICANT ***
  queue_depth            power_supply_status          +3 polls 8866.326     0.000000  *** SIGNIFICANT ***
  queue_depth            reboot_delta                 +1 polls    0.000     1.000000  not significant
  crc_errors             latency_ms                   +2 polls   14.463     0.000001  *** SIGNIFICANT ***
  crc_errors             cpu_pct                      +3 polls    3.706     0.012150  *** SIGNIFICANT ***
  crc_errors             mem_util_pct                 +1 polls   38.424     0.000000  *** SIGNIFICANT ***
  crc_errors             temp_c                       +1 polls   39.916     0.000000  *** SIGNIFICANT ***
  crc_errors             fan_speed_rpm                +7 polls    4.292     0.000162  *** SIGNIFICANT ***
  crc_errors             power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  crc_errors             reboot_delta                 +1 polls    0.000     1.000000  not significant
  latency_ms             cpu_pct                     +10 polls    2.809     0.002540  *** SIGNIFICANT ***
  latency_ms             mem_util_pct                 +1 polls   47.355     0.000000  *** SIGNIFICANT ***
  latency_ms             temp_c                       +1 polls   70.203     0.000000  *** SIGNIFICANT ***
  latency_ms             fan_speed_rpm                +7 polls    4.851     0.000036  *** SIGNIFICANT ***
  latency_ms             power_supply_status          +1 polls    0.000     1.000000  not significant
  latency_ms             reboot_delta                 +1 polls    0.000     1.000000  not significant
  cpu_pct                mem_util_pct                 +1 polls   61.350     0.000000  *** SIGNIFICANT ***
  cpu_pct                temp_c                       +1 polls   99.348     0.000000  *** SIGNIFICANT ***
  cpu_pct                fan_speed_rpm                +1 polls   11.531     0.000782  *** SIGNIFICANT ***
  cpu_pct                power_supply_status          +1 polls    0.000     1.000000  not significant
  cpu_pct                reboot_delta                 +1 polls    0.000     1.000000  not significant
  mem_util_pct           temp_c                       +1 polls   34.568     0.000000  *** SIGNIFICANT ***
  mem_util_pct           fan_speed_rpm                +7 polls    3.278     0.002331  *** SIGNIFICANT ***
  mem_util_pct           power_supply_status          +3 polls  745.558     0.000000  *** SIGNIFICANT ***
  mem_util_pct           reboot_delta                 +1 polls    0.000     1.000000  not significant
  temp_c                 fan_speed_rpm                +2 polls    4.492     0.012010  *** SIGNIFICANT ***
  temp_c                 power_supply_status          +3 polls  153.385     0.000000  *** SIGNIFICANT ***
  temp_c                 reboot_delta                 +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          reboot_delta                 +1 polls    0.000     1.000000  not significant
  power_supply_status    reboot_delta                 +1 polls    0.000     1.000000  not significant




-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Granger Causality Significant Pairs
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  util_pct->queue_depth  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->crc_errors  p=0.0  lag=15 min  *** SIGNIFICANT
  util_pct->latency_ms  p=0.0  lag=10 min  *** SIGNIFICANT
  util_pct->cpu_pct  p=0.0  lag=30 min  *** SIGNIFICANT
  util_pct->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->fan_speed_rpm  p=0.01363  lag=45 min  *** SIGNIFICANT
  queue_depth->crc_errors  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->latency_ms  p=0.016674  lag=10 min  *** SIGNIFICANT
  queue_depth->cpu_pct  p=0.002795  lag=5 min  *** SIGNIFICANT
  queue_depth->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->fan_speed_rpm  p=3.8e-05  lag=35 min  *** SIGNIFICANT
  queue_depth->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  crc_errors->latency_ms  p=1e-06  lag=10 min  *** SIGNIFICANT
  crc_errors->cpu_pct  p=0.01215  lag=15 min  *** SIGNIFICANT
  crc_errors->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->fan_speed_rpm  p=0.000162  lag=35 min  *** SIGNIFICANT
  crc_errors->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->cpu_pct  p=0.00254  lag=50 min  *** SIGNIFICANT
  latency_ms->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->fan_speed_rpm  p=3.6e-05  lag=35 min  *** SIGNIFICANT
  cpu_pct->mem_util_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  cpu_pct->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  cpu_pct->fan_speed_rpm  p=0.000782  lag=5 min  *** SIGNIFICANT
  mem_util_pct->temp_c  p=0.0  lag=5 min  *** SIGNIFICANT
  mem_util_pct->fan_speed_rpm  p=0.002331  lag=35 min  *** SIGNIFICANT
  mem_util_pct->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  temp_c->fan_speed_rpm  p=0.01201  lag=10 min  *** SIGNIFICANT
  temp_c->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT



==============================================================================
 SECTION 2 -- GRANGER CAUSALITY [SWITCH]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  util_pct               queue_depth                  +1 polls   88.151     0.000000  *** SIGNIFICANT ***
  util_pct               crc_errors                   +3 polls   35.412     0.000000  *** SIGNIFICANT ***
  util_pct               latency_ms                   +1 polls   88.824     0.000000  *** SIGNIFICANT ***
  util_pct               cpu_pct                      +1 polls   60.987     0.000000  *** SIGNIFICANT ***
  util_pct               mem_util_pct                 +1 polls    8.286     0.004299  *** SIGNIFICANT ***
  util_pct               temp_c                       +1 polls   19.366     0.000015  *** SIGNIFICANT ***
  util_pct               fan_speed_rpm                +3 polls    2.206     0.087653  not significant
  util_pct               power_supply_status          +1 polls    0.000     1.000000  not significant
  util_pct               reboot_delta                 +1 polls    1.859     0.173793  not significant
  queue_depth            crc_errors                   +1 polls  329.346     0.000000  *** SIGNIFICANT ***
  queue_depth            latency_ms                   +2 polls    7.940     0.000442  *** SIGNIFICANT ***
  queue_depth            cpu_pct                      +1 polls   27.817     0.000000  *** SIGNIFICANT ***
  queue_depth            mem_util_pct                 +1 polls    8.713     0.003423  *** SIGNIFICANT ***
  queue_depth            temp_c                       +5 polls    7.354     0.000002  *** SIGNIFICANT ***
  queue_depth            fan_speed_rpm                +1 polls    2.338     0.127380  not significant
  queue_depth            power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  queue_depth            reboot_delta                 +1 polls    2.659     0.104054  not significant
  crc_errors             latency_ms                   +9 polls    4.039     0.000074  *** SIGNIFICANT ***
  crc_errors             cpu_pct                      +1 polls   10.251     0.001521  *** SIGNIFICANT ***
  crc_errors             mem_util_pct                 +2 polls    5.606     0.004099  *** SIGNIFICANT ***
  crc_errors             temp_c                       +4 polls    7.816     0.000006  *** SIGNIFICANT ***
  crc_errors             fan_speed_rpm                +1 polls    2.288     0.131504  not significant
  crc_errors             power_supply_status          +1 polls 3320.436     0.000000  *** SIGNIFICANT ***
  crc_errors             reboot_delta                 +1 polls    1.745     0.187620  not significant
  latency_ms             cpu_pct                      +1 polls   27.771     0.000000  *** SIGNIFICANT ***
  latency_ms             mem_util_pct                 +1 polls    8.174     0.004564  *** SIGNIFICANT ***
  latency_ms             temp_c                       +3 polls   10.334     0.000002  *** SIGNIFICANT ***
  latency_ms             fan_speed_rpm                +1 polls    2.310     0.129629  not significant
  latency_ms             power_supply_status          +1 polls  173.948     0.000000  *** SIGNIFICANT ***
  latency_ms             reboot_delta                 +1 polls    2.811     0.094739  not significant
  cpu_pct                mem_util_pct                 +1 polls   10.309     0.001475  *** SIGNIFICANT ***
  cpu_pct                temp_c                       +4 polls    7.770     0.000006  *** SIGNIFICANT ***
  cpu_pct                fan_speed_rpm                +7 polls    1.395     0.207637  not significant
  cpu_pct                power_supply_status          +1 polls    0.000     1.000000  not significant
  cpu_pct                reboot_delta                 +1 polls    3.627     0.057871  not significant
  mem_util_pct           temp_c                       +1 polls    3.549     0.060597  not significant
  mem_util_pct           fan_speed_rpm                +1 polls    5.502     0.019683  *** SIGNIFICANT ***
  mem_util_pct           power_supply_status          +3 polls  116.950     0.000000  *** SIGNIFICANT ***
  mem_util_pct           reboot_delta                 +7 polls    1.603     0.134648  not significant
  temp_c                 fan_speed_rpm                +5 polls    0.916     0.471229  not significant
  temp_c                 power_supply_status          +1 polls    0.000     1.000000  not significant
  temp_c                 reboot_delta                 +4 polls    0.677     0.608338  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          reboot_delta                 +5 polls    3.016     0.011456  *** SIGNIFICANT ***
  power_supply_status    reboot_delta                 +2 polls    0.000     1.000000  not significant




-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Granger Causality Significant Pairs
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  util_pct->queue_depth  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->crc_errors  p=0.0  lag=15 min  *** SIGNIFICANT
  util_pct->latency_ms  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  util_pct->mem_util_pct  p=0.004299  lag=5 min  *** SIGNIFICANT
  util_pct->temp_c  p=1.5e-05  lag=5 min  *** SIGNIFICANT
  queue_depth->crc_errors  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->latency_ms  p=0.000442  lag=10 min  *** SIGNIFICANT
  queue_depth->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  queue_depth->mem_util_pct  p=0.003423  lag=5 min  *** SIGNIFICANT
  queue_depth->temp_c  p=2e-06  lag=25 min  *** SIGNIFICANT
  queue_depth->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  crc_errors->latency_ms  p=7.4e-05  lag=45 min  *** SIGNIFICANT
  crc_errors->cpu_pct  p=0.001521  lag=5 min  *** SIGNIFICANT
  crc_errors->mem_util_pct  p=0.004099  lag=10 min  *** SIGNIFICANT
  crc_errors->temp_c  p=6e-06  lag=20 min  *** SIGNIFICANT
  crc_errors->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->cpu_pct  p=0.0  lag=5 min  *** SIGNIFICANT
  latency_ms->mem_util_pct  p=0.004564  lag=5 min  *** SIGNIFICANT
  latency_ms->temp_c  p=2e-06  lag=15 min  *** SIGNIFICANT
  latency_ms->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  cpu_pct->mem_util_pct  p=0.001475  lag=5 min  *** SIGNIFICANT
  cpu_pct->temp_c  p=6e-06  lag=20 min  *** SIGNIFICANT
  mem_util_pct->fan_speed_rpm  p=0.019683  lag=5 min  *** SIGNIFICANT
  mem_util_pct->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  fan_speed_rpm->reboot_delta  p=0.011456  lag=25 min  *** SIGNIFICANT




  `,
  pre_event_behavior: `
==============================================================================
 SECTION 3 -- PRE-EVENT METRIC BEHAVIOR [ROUTER]
==============================================================================

  [DEVICE_REBOOT] No occurrences -- skipping.

  --------------------------------------------------------------------------
  EVENT: HIGH_LATENCY | Occurrences: 231 | Pre-event windows: 343 | Normal windows: 2508
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     49.55          84.14   +34.59    +69.8%  UP
  queue_depth                   1.76          39.92   +38.16  +2168.8%  UP
  crc_errors                    0.31          10.11    +9.80  +3194.7%  UP
  latency_ms                    7.76          44.00   +36.24   +467.2%  UP
  cpu_pct                      43.42          50.76    +7.34    +16.9%  UP
  mem_util_pct                 57.43          58.52    +1.09     +1.9%  UP
  temp_c                       49.08          49.57    +0.50     +1.0%  UP
  fan_speed_rpm              3219.73        3224.74    +5.01     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       343  [#..............]
  queue_depth                   1p        1p        1p       343  [#..............]
  crc_errors                    1p        1p        1p       343  [#..............]
  latency_ms                    1p        1p        1p       343  [#..............]
  cpu_pct                       6p        1p        1p       343  [#==.==.........]
  mem_util_pct                 15p        5p        1p        85  [#==============]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  --------------------------------------------------------------------------
  EVENT: HIGH_UTIL_WARNING | Occurrences: 532 | Pre-event windows: 719 | Normal windows: 2149
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     47.43          77.55   +30.11    +63.5%  UP
  queue_depth                   0.08          29.56   +29.48 +37608.5%  UP
  crc_errors                    0.05           7.30    +7.25 +13422.0%  UP
  latency_ms                    6.16          34.16   +28.00   +454.4%  UP
  cpu_pct                      43.17          48.80    +5.62    +13.0%  UP
  mem_util_pct                 57.40          58.27    +0.87     +1.5%  UP
  temp_c                       49.07          49.45    +0.38     +0.8%  UP
  fan_speed_rpm              3219.41        3225.44    +6.03     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       719  [#..............]
  queue_depth                   1p        1p        1p       719  [#..............]
  crc_errors                    2p        1p        1p       719  [#=.............]
  latency_ms                    2p        1p        1p       719  [#=.............]
  cpu_pct                      12p        1p        1p       719  [#======..===...]
  mem_util_pct                 15p        8p        1p       148  [##=============]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  --------------------------------------------------------------------------
  EVENT: INTERFACE_FLAP | Occurrences: 277 | Pre-event windows: 408 | Normal windows: 2409
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     49.73          85.24   +35.51    +71.4%  UP
  queue_depth                   1.44          42.19   +40.75  +2833.1%  UP
  crc_errors                    0.17          10.90   +10.73  +6225.1%  UP
  latency_ms                    7.44          46.18   +38.74   +520.3%  UP
  cpu_pct                      43.53          51.26    +7.73    +17.8%  UP
  mem_util_pct                 57.45          58.61    +1.16     +2.0%  UP
  temp_c                       49.09          49.61    +0.52     +1.1%  UP
  fan_speed_rpm              3220.11        3226.07    +5.96     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      2p        1p        1p       408  [#=.............]
  queue_depth                   1p        1p        1p       408  [#..............]
  crc_errors                    1p        1p        1p       408  [#..............]
  latency_ms                    1p        1p        1p       408  [#..............]
  cpu_pct                       6p        1p        1p       408  [#===.=.........]
  mem_util_pct                 15p        5p        1p        86  [#==============]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [LINK_DOWN] No occurrences -- skipping.

  --------------------------------------------------------------------------
  EVENT: PACKET_DROP | Occurrences: 493 | Pre-event windows: 657 | Normal windows: 2202
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     48.03          80.15   +32.12    +66.9%  UP
  queue_depth                   0.28          33.31   +33.03 +11902.6%  UP
  crc_errors                    0.06           8.22    +8.16 +14634.7%  UP
  latency_ms                    6.35          37.70   +31.35   +493.8%  UP
  cpu_pct                      43.18          49.70    +6.52    +15.1%  UP
  mem_util_pct                 57.40          58.39    +0.99     +1.7%  UP
  temp_c                       49.07          49.52    +0.44     +0.9%  UP
  fan_speed_rpm              3219.60        3226.49    +6.89     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       657  [#..............]
  queue_depth                   1p        1p        1p       657  [#..............]
  crc_errors                    2p        1p        1p       657  [#=.............]
  latency_ms                    1p        1p        1p       657  [#..............]
  cpu_pct                      12p        1p        1p       657  [#======....=...]
  mem_util_pct                 15p        6p        1p       136  [#==============]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a





  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Pre-Event Metric Patterns
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_LATENCY (231 occurrences)
    util_pct               normal=49.5  pre-event=84.1  (+70%)
    queue_depth            normal=1.8  pre-event=39.9  (+2169%)
    crc_errors             normal=0.3  pre-event=10.1  (+3195%)
    latency_ms             normal=7.8  pre-event=44.0  (+467%)
    Earliest warning: 75 min before event
  HIGH_UTIL_WARNING (532 occurrences)
    util_pct               normal=47.4  pre-event=77.5  (+64%)
    queue_depth            normal=0.1  pre-event=29.6  (+37608%)
    crc_errors             normal=0.1  pre-event=7.3  (+13422%)
    latency_ms             normal=6.2  pre-event=34.2  (+454%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (277 occurrences)
    util_pct               normal=49.7  pre-event=85.2  (+71%)
    queue_depth            normal=1.4  pre-event=42.2  (+2833%)
    crc_errors             normal=0.2  pre-event=10.9  (+6225%)
    latency_ms             normal=7.4  pre-event=46.2  (+520%)
    Earliest warning: 75 min before event
  PACKET_DROP (493 occurrences)
    util_pct               normal=48.0  pre-event=80.2  (+67%)
    queue_depth            normal=0.3  pre-event=33.3  (+11903%)
    crc_errors             normal=0.1  pre-event=8.2  (+14635%)
    latency_ms             normal=6.3  pre-event=37.7  (+494%)
    Earliest warning: 75 min before event



==============================================================================
 SECTION 3 -- PRE-EVENT METRIC BEHAVIOR [SWITCH]
==============================================================================

  --------------------------------------------------------------------------
  EVENT: DEVICE_REBOOT | Occurrences: 2 | Pre-event windows: 6 | Normal windows: 4022
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     43.14          33.70    -9.45    -21.9%  DOWN
  queue_depth                   6.65           0.00    -6.65   -100.0%  DOWN
  crc_errors                    2.38           0.05    -2.33    -97.9%  DOWN
  latency_ms                    8.24           3.14    -5.10    -61.9%  DOWN
  cpu_pct                      27.43          23.12    -4.31    -15.7%  DOWN
  mem_util_pct                 45.26          44.69    -0.56     -1.2%  DOWN
  temp_c                       42.09          42.07    -0.02     -0.1%  DOWN
  fan_speed_rpm              2607.41        2590.37   -17.04     -0.7%  DOWN
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p         6  [#..............]
  queue_depth                   1p        1p        1p         6  [#..............]
  crc_errors                    1p        1p        1p         6  [#..............]
  latency_ms                    1p        1p        1p         6  [#..............]
  cpu_pct                       1p        1p        1p         6  [#..............]
  mem_util_pct                 n/a      n/a      n/a       n/a
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [HIGH_LATENCY] No occurrences -- skipping.

  --------------------------------------------------------------------------
  EVENT: HIGH_UTIL_WARNING | Occurrences: 207 | Pre-event windows: 298 | Normal windows: 2438
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     36.54          64.70   +28.16    +77.1%  UP
  queue_depth                   0.33          19.44   +19.11  +5798.9%  UP
  crc_errors                    0.09           5.00    +4.92  +5769.7%  UP
  latency_ms                    3.57          17.72   +14.15   +396.6%  UP
  cpu_pct                      26.06          30.93    +4.87    +18.7%  UP
  mem_util_pct                 45.16          45.33    +0.18     +0.4%  UP
  temp_c                       42.06          42.14    +0.08     +0.2%  UP
  fan_speed_rpm              2605.95        2610.75    +4.81     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       298  [#..............]
  queue_depth                   1p        1p        1p       298  [#..............]
  crc_errors                    2p        1p        1p       298  [#=.............]
  latency_ms                    1p        1p        1p       298  [#..............]
  cpu_pct                       9p        1p        1p       298  [#===....=......]
  mem_util_pct                 15p        7p        1p        72  [##=###==###====]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  reboot_delta                  1p        1p        1p       298  [#..............]

  --------------------------------------------------------------------------
  EVENT: INTERFACE_FLAP | Occurrences: 146 | Pre-event windows: 222 | Normal windows: 2636
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     37.96          71.37   +33.41    +88.0%  UP
  queue_depth                   1.32          28.42   +27.10  +2057.8%  UP
  crc_errors                    0.28           8.30    +8.02  +2879.0%  UP
  latency_ms                    4.30          24.44   +20.14   +468.8%  UP
  cpu_pct                      26.26          32.28    +6.01    +22.9%  UP
  mem_util_pct                 45.16          45.41    +0.25     +0.6%  UP
  temp_c                       42.06          42.18    +0.12     +0.3%  UP
  fan_speed_rpm              2606.18        2611.75    +5.56     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      2p        1p        1p       222  [#=.............]
  queue_depth                   1p        1p        1p       222  [#..............]
  crc_errors                    1p        1p        1p       222  [#..............]
  latency_ms                    1p        1p        1p       222  [#..............]
  cpu_pct                       3p        1p        1p       222  [#==............]
  mem_util_pct                 15p        7p        1p        57  [#==============]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  reboot_delta                  1p        1p        1p       222  [#..............]

  --------------------------------------------------------------------------
  EVENT: LINK_DOWN | Occurrences: 2 | Pre-event windows: 4 | Normal windows: 4028
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     42.70          83.22   +40.53    +94.9%  UP
  queue_depth                   6.11          46.38   +40.27   +658.6%  UP
  crc_errors                    2.12          18.62   +16.51   +779.9%  UP
  latency_ms                    7.84          37.61   +29.76   +379.4%  UP
  cpu_pct                      27.31          33.89    +6.58    +24.1%  UP
  mem_util_pct                 45.24          45.74    +0.50     +1.1%  UP
  temp_c                       42.09          42.01    -0.08     -0.2%  DOWN
  fan_speed_rpm              2607.05        2620.99   +13.94     +0.5%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p         4  [#..............]
  queue_depth                   1p        1p        1p         4  [#..............]
  crc_errors                    1p        1p        1p         4  [#..............]
  latency_ms                    1p        1p        1p         4  [#..............]
  cpu_pct                       1p        1p        1p         4  [#..............]
  mem_util_pct                  9p        8p        8p         2  [.......##......]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  reboot_delta                  1p        1p        1p         4  [#..............]

  --------------------------------------------------------------------------
  EVENT: PACKET_DROP | Occurrences: 239 | Pre-event windows: 329 | Normal windows: 2484
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  util_pct                     37.03          66.38   +29.35    +79.3%  UP
  queue_depth                   0.66          21.53   +20.87  +3156.5%  UP
  crc_errors                    0.17           5.69    +5.53  +3317.2%  UP
  latency_ms                    3.80          19.31   +15.51   +408.2%  UP
  cpu_pct                      26.13          31.12    +4.98    +19.1%  UP
  mem_util_pct                 45.17          45.34    +0.17     +0.4%  UP
  temp_c                       42.07          42.15    +0.08     +0.2%  UP
  fan_speed_rpm              2606.29        2610.26    +3.97     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  reboot_delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  util_pct                      1p        1p        1p       329  [#..............]
  queue_depth                   1p        1p        1p       329  [#..............]
  crc_errors                    1p        1p        1p       329  [#..............]
  latency_ms                    1p        1p        1p       329  [#..............]
  cpu_pct                       4p        1p        1p       329  [#===...........]
  mem_util_pct                 15p        6p        1p        64  [##=####========]
  temp_c                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  reboot_delta                  1p        1p        1p       329  [#..............]


  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Pre-Event Metric Patterns
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  DEVICE_REBOOT (2 occurrences)
    util_pct               normal=43.1  pre-event=33.7  (-22%)
    queue_depth            normal=6.6  pre-event=0.0  (-100%)
    crc_errors             normal=2.4  pre-event=0.1  (-98%)
    latency_ms             normal=8.2  pre-event=3.1  (-62%)
    Earliest warning: 5 min before event
  HIGH_UTIL_WARNING (207 occurrences)
    util_pct               normal=36.5  pre-event=64.7  (+77%)
    queue_depth            normal=0.3  pre-event=19.4  (+5799%)
    crc_errors             normal=0.1  pre-event=5.0  (+5770%)
    latency_ms             normal=3.6  pre-event=17.7  (+397%)
    reboot_delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (146 occurrences)
    util_pct               normal=38.0  pre-event=71.4  (+88%)
    queue_depth            normal=1.3  pre-event=28.4  (+2058%)
    crc_errors             normal=0.3  pre-event=8.3  (+2879%)
    latency_ms             normal=4.3  pre-event=24.4  (+469%)
    cpu_pct                normal=26.3  pre-event=32.3  (+23%)
    reboot_delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 75 min before event
  LINK_DOWN (2 occurrences)
    util_pct               normal=42.7  pre-event=83.2  (+95%)
    queue_depth            normal=6.1  pre-event=46.4  (+659%)
    crc_errors             normal=2.1  pre-event=18.6  (+780%)
    latency_ms             normal=7.8  pre-event=37.6  (+379%)
    cpu_pct                normal=27.3  pre-event=33.9  (+24%)
    reboot_delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 45 min before event
  PACKET_DROP (239 occurrences)
    util_pct               normal=37.0  pre-event=66.4  (+79%)
    queue_depth            normal=0.7  pre-event=21.5  (+3156%)
    crc_errors             normal=0.2  pre-event=5.7  (+3317%)
    latency_ms             normal=3.8  pre-event=19.3  (+408%)
    reboot_delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 75 min before event








  `,
  random_forest: `
	==============================================================================
 SECTION 5 -- RANDOM FOREST EVENT PREDICTOR [ROUTER]
==============================================================================

  Event                         Pos Rate  Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                     0.0%         --          --       --      --  SKIPPED (rate out of range)
  HIGH_LATENCY                      8.4%     0.962      0.732   0.870  0.795  OK

    Top 8 features for HIGH_LATENCY:
    Feature                             Importance  Bar
    latency_ms_last                         0.1523  ####
    queue_depth_last                        0.1475  ####
    crc_errors_last                         0.1018  ###
    util_pct_last                           0.0876  ##
    util_pct_mean                           0.0754  ##
    util_pct_max                            0.0570  #
    util_pct_min                            0.0461  #
    queue_depth_slope                       0.0351  #

  HIGH_UTIL_WARNING                17.6%     0.958      0.824   0.972  0.892  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    util_pct_last                           0.1731  #####
    latency_ms_last                         0.1303  ###
    queue_depth_last                        0.1256  ###
    util_pct_mean                           0.0680  ##
    util_pct_max                            0.0555  #
    latency_ms_std                          0.0440  #
    latency_ms_range                        0.0358  #
    crc_errors_last                         0.0310

  INTERFACE_FLAP                   10.0%     0.967      0.778   0.939  0.851  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    crc_errors_last                         0.1458  ####
    latency_ms_last                         0.1202  ###
    queue_depth_last                        0.1105  ###
    util_pct_mean                           0.0867  ##
    util_pct_max                            0.0661  #
    util_pct_min                            0.0519  #
    latency_ms_mean                         0.0379  #
    queue_depth_mean                        0.0355  #

  LINK_DOWN                         0.0%         --          --       --      --  SKIPPED (rate out of range)
  PACKET_DROP                      16.1%     0.968      0.862   0.954  0.906  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    latency_ms_last                         0.1505  ####
    queue_depth_last                        0.1380  ####
    util_pct_last                           0.1185  ###
    crc_errors_last                         0.0785  ##
    util_pct_mean                           0.0721  ##
    util_pct_max                            0.0498  #
    util_pct_min                            0.0443  #
    latency_ms_slope                        0.0284



-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Random Forest Accuracy
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_LATENCY                 acc=0.962  prec=0.732  recall=0.870  f1=0.795
    Top feature: latency_ms_last (0.1523)
  HIGH_UTIL_WARNING            acc=0.958  prec=0.824  recall=0.972  f1=0.892
    Top feature: util_pct_last (0.1731)
  INTERFACE_FLAP               acc=0.967  prec=0.778  recall=0.939  f1=0.851
    Top feature: crc_errors_last (0.1458)
  PACKET_DROP                  acc=0.968  prec=0.862  recall=0.954  f1=0.906
    Top feature: latency_ms_last (0.1505)






	==============================================================================
 SECTION 5 -- RANDOM FOREST EVENT PREDICTOR [SWITCH]
==============================================================================

  Event                         Pos Rate  Accuracy  Precision  Recall     F1  Status
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                     0.1%         --          --       --      --  SKIPPED (rate out of range)
  HIGH_LATENCY                      0.0%         --          --       --      --  SKIPPED (rate out of range)
  HIGH_UTIL_WARNING                 7.3%     0.972      0.747   0.933  0.830  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    util_pct_last                           0.1794  #####
    queue_depth_last                        0.1250  ###
    latency_ms_last                         0.1169  ###
    crc_errors_last                         0.0774  ##
    latency_ms_slope                        0.0620  #
    util_pct_slope                          0.0459  #
    util_pct_mean                           0.0446  #
    queue_depth_slope                       0.0442  #

  INTERFACE_FLAP                    5.4%     0.978      0.741   0.909  0.816  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    crc_errors_last                         0.1666  ####
    queue_depth_last                        0.1091  ###
    latency_ms_last                         0.0991  ##
    util_pct_mean                           0.0846  ##
    latency_ms_slope                        0.0777  ##
    queue_depth_slope                       0.0524  #
    queue_depth_mean                        0.0518  #
    util_pct_max                            0.0360  #

  LINK_DOWN                         0.1%         --          --       --      --  SKIPPED (rate out of range)
  PACKET_DROP                       8.1%     0.980      0.821   0.970  0.889  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    queue_depth_last                        0.1543  ####
    latency_ms_last                         0.1516  ####
    crc_errors_last                         0.1146  ###
    util_pct_last                           0.0715  ##
    latency_ms_slope                        0.0693  ##
    util_pct_mean                           0.0456  #
    queue_depth_slope                       0.0443  #
    util_pct_max                            0.0373  #





  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Random Forest Accuracy
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_UTIL_WARNING            acc=0.972  prec=0.747  recall=0.933  f1=0.830
    Top feature: util_pct_last (0.1794)
  INTERFACE_FLAP               acc=0.978  prec=0.741  recall=0.909  f1=0.816
    Top feature: crc_errors_last (0.1666)
  PACKET_DROP                  acc=0.980  prec=0.821  recall=0.970  f1=0.889
    Top feature: queue_depth_last (0.1543)








  `,
  pattern_clustering: `
==============================================================================
 SECTION 4 -- PATTERN CLUSTERING [ROUTER]
==============================================================================

  Cluster  Name                       Size  No Event  Top Following Events
  ------------------------------------------------------------------------------
  0        Stable Baseline             678        6%  PACKET_DROP: 82% | HIGH_UTIL_WARNING: 75% | INTERFACE_FLAP: 60%
  1        Gradual Rise                614       91%  HIGH_UTIL_WARNING: 9% | PACKET_DROP: 5% | HIGH_LATENCY: 0%
  2        Congestion Buildup         1556       94%  HIGH_UTIL_WARNING: 6% | PACKET_DROP: 3% | INTERFACE_FLAP: 0%
  3        Spike/Recovery             1231       95%  HIGH_UTIL_WARNING: 5% | PACKET_DROP: 2% | HIGH_LATENCY: 0%

  Cluster Centroids  (interface: ['util_pct', 'queue_depth']  device: ['cpu_pct', 'mem_util_pct']):
  Cluster  Name                            util_pct     queue_depth         cpu_pct    mem_util_pct
  ------------------------------------------------------------------------------
  0        Stable Baseline                     89.0            60.4            54.0            59.4
  1        Gradual Rise                        49.2             3.8            41.9            57.5
  2        Congestion Buildup                  51.1             2.7            47.9            58.4
  3        Spike/Recovery                      50.9             2.1            38.7            56.4







==============================================================================
 SECTION 4 -- PATTERN CLUSTERING [SWITCH]
==============================================================================

  Cluster  Name                       Size  No Event  Top Following Events
  ------------------------------------------------------------------------------
  0        Stable Baseline            1310       98%  HIGH_UTIL_WARNING: 2% | PACKET_DROP: 1%
  1        Gradual Rise               1693      100%  DEVICE_REBOOT: 0% | PACKET_DROP: 0%
  2        Congestion Buildup          626       98%  HIGH_UTIL_WARNING: 2% | PACKET_DROP: 1% | INTERFACE_FLAP: 0%
  3        Spike/Recovery              448       14%  PACKET_DROP: 69% | HIGH_UTIL_WARNING: 58% | INTERFACE_FLAP: 49%

  Cluster Centroids  (interface: ['util_pct', 'queue_depth']  device: ['cpu_pct', 'mem_util_pct']):
  Cluster  Name                            util_pct     queue_depth         cpu_pct    mem_util_pct
  ------------------------------------------------------------------------------
  0        Stable Baseline                     42.3             2.8            29.1            45.4
  1        Gradual Rise                        36.9             0.6            24.3            45.0
  2        Congestion Buildup                  38.1             1.3            27.2            45.3
  3        Spike/Recovery                      75.0            47.4            34.0            45.7




  `,
  sequence_mining: `
 ==============================================================================
 SECTION 6 -- EVENT SEQUENCE MINING [ROUTER]
==============================================================================
  Total sessions  : 32
  Unique devices  : 5

  Frequent 2-event sequences (support >= 2, lift >= 1.5):
  Sequence                                               Supp   Conf   Lift
  ------------------------------------------------------------------------------
  No sequences met support >= 2 AND lift >= 1.5.

  Frequent 3-event sequences (support >= 2):
  Sequence                                                         Supp   Conf
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP                 28   1.00
  HIGH_UTIL_WARNING -> PACKET_DROP -> HIGH_LATENCY                   26   0.93
  HIGH_UTIL_WARNING -> HIGH_LATENCY -> INTERFACE_FLAP                21   0.72
  PACKET_DROP -> HIGH_LATENCY -> INTERFACE_FLAP                      20   0.71
  HIGH_UTIL_WARNING -> INTERFACE_FLAP -> HIGH_LATENCY                 8   0.26
  PACKET_DROP -> INTERFACE_FLAP -> HIGH_LATENCY                       8   0.26
  PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP                  3   1.00
  PACKET_DROP -> HIGH_UTIL_WARNING -> HIGH_LATENCY                    2   0.67


==============================================================================
 SECTION 6 -- EVENT SEQUENCE MINING [SWITCH]
==============================================================================
  Total sessions  : 41
  Unique devices  : 5

  Frequent 2-event sequences (support >= 2, lift >= 1.5):
  Sequence                                               Supp   Conf   Lift
  ------------------------------------------------------------------------------
  No sequences met support >= 2 AND lift >= 1.5.

  Frequent 3-event sequences (support >= 2):
  Sequence                                                         Supp   Conf
  ------------------------------------------------------------------------------
  HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP                 24   0.89
  PACKET_DROP -> HIGH_UTIL_WARNING -> INTERFACE_FLAP                  8   0.80
  HIGH_UTIL_WARNING -> INTERFACE_FLAP -> LINK_DOWN                    2   0.06
  PACKET_DROP -> INTERFACE_FLAP -> LINK_DOWN                          2   0.06



  `,
  anomaly_detection: `
==============================================================================
 SECTION 7 -- ANOMALY DETECTION [ROUTER]
==============================================================================

  Isolation Forest: 204 / 4,079 windows flagged (5.0% anomaly rate, target=5%)

  Entity                          Anomaly %  Avg Score  Risk
  ------------------------------------------------------------------------------
  router-03:Gi0/3/0                   14.7%     0.0867  MED  ##
  router-02:Gi0/3/0                    8.1%     0.0880  MED  #
  router-02:Gi0/1/0                    7.3%     0.0858  MED  #
  router-01:Gi0/1/0                    7.0%     0.0797  low  #
  router-05:Gi0/2/0                    6.6%     0.0814  low  #
  router-02:Gi0/2/0                    5.5%     0.0854  low  #
  router-03:Gi0/1/0                    5.5%     0.0999  low  #
  router-03:Gi0/2/0                    3.7%     0.0975  low
  router-01:Gi0/3/0                    3.7%     0.0769  low
  router-04:Gi0/3/0                    3.7%     0.0838  low
  router-04:Gi0/1/0                    3.3%     0.1106  low
  router-01:Gi0/2/0                    2.6%     0.1022  low
  router-04:Gi0/2/0                    1.8%     0.0824  low
  router-05:Gi0/3/0                    1.1%     0.1041  low
  router-05:Gi0/1/0                    0.4%     0.1004  low


  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Top Anomalous Entities
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  router-03:Gi0/3/0              anomaly_rate=14.7%  avg_score=0.0867
  router-02:Gi0/3/0              anomaly_rate=8.1%  avg_score=0.0880
  router-02:Gi0/1/0              anomaly_rate=7.3%  avg_score=0.0858
  router-01:Gi0/1/0              anomaly_rate=7.0%  avg_score=0.0797
  router-05:Gi0/2/0              anomaly_rate=6.6%  avg_score=0.0814





==============================================================================
 SECTION 7 -- ANOMALY DETECTION [SWITCH]
==============================================================================

  Isolation Forest: 204 / 4,077 windows flagged (5.0% anomaly rate, target=5%)

  Entity                          Anomaly %  Avg Score  Risk
  ------------------------------------------------------------------------------
  switch-03:Eth1/3                    11.0%     0.1008  MED  ##
  switch-02:Eth1/1                    10.7%     0.1092  MED  ##
  switch-01:Eth1/2                    10.0%     0.1182  MED  #
  switch-04:Eth1/1                     8.5%     0.1175  MED  #
  switch-04:Eth1/2                     7.7%     0.1152  MED  #
  switch-01:Eth1/1                     6.3%     0.0987  low  #
  switch-04:Eth1/3                     5.5%     0.1144  low  #
  switch-03:Eth1/2                     3.3%     0.1090  low
  switch-05:Eth1/1                     3.3%     0.1103  low
  switch-03:Eth1/1                     1.8%     0.1222  low
  switch-05:Eth1/3                     1.8%     0.1222  low
  switch-02:Eth1/2                     1.5%     0.1136  low
  switch-02:Eth1/3                     1.5%     0.1162  low
  switch-05:Eth1/2                     1.5%     0.1122  low
  switch-01:Eth1/3                     0.7%     0.1130  low

    -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Top Anomalous Entities
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  switch-03:Eth1/3               anomaly_rate=11.0%  avg_score=0.1008
  switch-02:Eth1/1               anomaly_rate=10.7%  avg_score=0.1092
  switch-01:Eth1/2               anomaly_rate=10.0%  avg_score=0.1182
  switch-04:Eth1/1               anomaly_rate=8.5%  avg_score=0.1175
  switch-04:Eth1/2               anomaly_rate=7.7%  avg_score=0.1152









  `,
  co_occurrence_matrix: `
==============================================================================
 SECTION 8 -- EVENT CO-OCCURRENCE MATRIX [SWITCH]
==============================================================================

  Co-occurrence Lift Matrix  (5 event types, 41 sessions)
  Lift > 1 = events tend to co-occur.  Lift < 1 = tend to be separate.

                                          DEVICE_HIGH_UTINTERFALINK_DOPACKET_
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                             --       0.0    0.0    0.0    0.0
  HIGH_UTIL_WARNING                          0.0   --       1.1    1.1    1.1
  INTERFACE_FLAP                             0.0    1.1   --       1.2    1.0
  LINK_DOWN                                  0.0    1.1    1.2   --       1.1
  PACKET_DROP                                0.0    1.1    1.0    1.1   --

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  INTERFACE_FLAP               LINK_DOWN                            2   1.21
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      34   1.08
  HIGH_UTIL_WARNING            LINK_DOWN                            2   1.08
  LINK_DOWN                    PACKET_DROP                          2   1.08
  HIGH_UTIL_WARNING            PACKET_DROP                         37   1.05
  INTERFACE_FLAP               PACKET_DROP                         33   1.05


==============================================================================
 SECTION 8 -- EVENT CO-OCCURRENCE MATRIX [ROUTER]
==============================================================================

  Co-occurrence Lift Matrix  (4 event types, 32 sessions)
  Lift > 1 = events tend to co-occur.  Lift < 1 = tend to be separate.

                                          HIGH_LAHIGH_UTINTERFAPACKET_
  ------------------------------------------------------------------------------
  HIGH_LATENCY                              --       1.0    1.0    1.0
  HIGH_UTIL_WARNING                          1.0   --       1.0    1.0
  INTERFACE_FLAP                             1.0    1.0   --       1.0
  PACKET_DROP                                1.0    1.0    1.0   --

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  HIGH_LATENCY                 INTERFACE_FLAP                      29   1.03
  HIGH_LATENCY                 PACKET_DROP                         29   1.03
  INTERFACE_FLAP               PACKET_DROP                         31   1.03
  HIGH_LATENCY                 HIGH_UTIL_WARNING                   29   1.00
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      31   1.00
  HIGH_UTIL_WARNING            PACKET_DROP                         31   1.00



==============================================================================
 SECTION 8 -- EVENT CO-OCCURRENCE MATRIX [SWITCH]
==============================================================================

  Co-occurrence Lift Matrix  (5 event types, 41 sessions)
  Lift > 1 = events tend to co-occur.  Lift < 1 = tend to be separate.

                                          DEVICE_HIGH_UTINTERFALINK_DOPACKET_
  ------------------------------------------------------------------------------
  DEVICE_REBOOT                             --       0.0    0.0    0.0    0.0
  HIGH_UTIL_WARNING                          0.0   --       1.1    1.1    1.1
  INTERFACE_FLAP                             0.0    1.1   --       1.2    1.0
  LINK_DOWN                                  0.0    1.1    1.2   --       1.1
  PACKET_DROP                                0.0    1.1    1.0    1.1   --

  Strongest co-occurring pairs:
  A                            B                             Co-occur   Lift
  ------------------------------------------------------------------------------
  INTERFACE_FLAP               LINK_DOWN                            2   1.21
  HIGH_UTIL_WARNING            INTERFACE_FLAP                      34   1.08
  HIGH_UTIL_WARNING            LINK_DOWN                            2   1.08
  LINK_DOWN                    PACKET_DROP                          2   1.08
  HIGH_UTIL_WARNING            PACKET_DROP                         37   1.05
  INTERFACE_FLAP               PACKET_DROP                         33   1.05





  `,
  failure_chain: `
==============================================================================
 SECTION 10 -- FAILURE CHAIN PATTERNS [ROUTER]
==============================================================================

  Chain 1  [HIGH_LATENCY]  (5 metrics  |  seen 231x  |  343 pre-event windows)
  cpu_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  util_pct ^  ->  HIGH_LATENCY

  Chain 2  [HIGH_UTIL_WARNING]  (5 metrics  |  seen 532x  |  719 pre-event windows)
  cpu_pct ^  ->  crc_errors ^  ->  latency_ms ^  ->  queue_depth ^  ->  util_pct ^  ->  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (5 metrics  |  seen 277x  |  408 pre-event windows)
  cpu_pct ^  ->  util_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (5 metrics  |  seen 493x  |  657 pre-event windows)
  cpu_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  util_pct ^  ->  PACKET_DROP

  Total chains: 4


  ==============================================================================
 SECTION 10 -- FAILURE CHAIN PATTERNS [SWITCH]
==============================================================================

  Chain 1  [DEVICE_REBOOT]  (5 metrics  |  seen 2x  |  6 pre-event windows)
  queue_depth v  ->  crc_errors v  ->  latency_ms v  ->  util_pct v  ->  cpu_pct v  ->  DEVICE_REBOOT

  Chain 2  [HIGH_UTIL_WARNING]  (6 metrics  |  seen 207x  |  298 pre-event windows)
  cpu_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  reboot_delta ^  ->  util_pct ^  ->  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (6 metrics  |  seen 146x  |  222 pre-event windows)
  cpu_pct ^  ->  util_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  reboot_delta ^  ->  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (6 metrics  |  seen 239x  |  329 pre-event windows)
  cpu_pct ^  ->  crc_errors ^  ->  queue_depth ^  ->  latency_ms ^  ->  reboot_delta ^  ->  util_pct ^  ->  PACKET_DROP

  Total chains: 4
  `,
  default: `NETWORK PATTERN MINING SYSTEM v3.4.2
Initializing Training Kernel...
Mounting sliding window partitions...
Partition [1/5]: OK
Partition [2/5]: OK
Partition [3/5]: OK
Partition [4/5]: OK
Partition [5/5]: OK
---------------------------------------
TOTAL ENTITIES: 128 | TOTAL WINDOWS: 8,156
READY FOR ALGORITHMIC EXECUTION.`,
};
