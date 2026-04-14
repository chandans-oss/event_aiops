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
  B/W Util               Buffer Util                  -1 polls     0.7516      0.7159  Buffer Util LEADS B/W Util by 5 min
  B/W Util               CRC Errors                   -2 polls     0.7381      0.7158  CRC Errors LEADS B/W Util by 10 min
  B/W Util               Latency                   -1 polls     0.7530      0.7235  Latency LEADS B/W Util by 5 min
  B/W Util               CPU Util                      +0 polls     0.7830      0.7541  simultaneous
  B/W Util               Mem Util                 -1 polls     0.6164      0.6073  Mem Util LEADS B/W Util by 5 min
  B/W Util               Temp (C)                       -2 polls     0.6433      0.6173  Temp (C) LEADS B/W Util by 10 min
  B/W Util               fan_speed_rpm                -2 polls     0.1640      0.1538  fan_speed_rpm LEADS B/W Util by 10 min
  B/W Util               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  B/W Util               Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Buffer Util            CRC Errors                   -1 polls     0.9432      0.9442  CRC Errors LEADS Buffer Util by 5 min
  Buffer Util            Latency                   +0 polls     0.9959      0.9933  simultaneous
  Buffer Util            CPU Util                      +1 polls     0.8546      0.8052  Buffer Util LEADS CPU Util by 5 min
  Buffer Util            Mem Util                 +1 polls     0.6727      0.6167  Buffer Util LEADS Mem Util by 5 min
  Buffer Util            Temp (C)                       -1 polls     0.6630      0.6128  Temp (C) LEADS Buffer Util by 5 min
  Buffer Util            fan_speed_rpm                -2 polls     0.2552      0.2042  fan_speed_rpm LEADS Buffer Util by 10 min
  Buffer Util            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Buffer Util            Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  CRC Errors             Latency                   +1 polls     0.9399      0.9398  CRC Errors LEADS Latency by 5 min
  CRC Errors             CPU Util                      +2 polls     0.8010      0.7827  CRC Errors LEADS CPU Util by 10 min
  CRC Errors             Mem Util                 +2 polls     0.6473      0.5991  CRC Errors LEADS Mem Util by 10 min
  CRC Errors             Temp (C)                       +1 polls     0.6210      0.5960  CRC Errors LEADS Temp (C) by 5 min
  CRC Errors             fan_speed_rpm                -1 polls     0.2289      0.2017  fan_speed_rpm LEADS CRC Errors by 5 min
  CRC Errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CRC Errors             Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Latency             CPU Util                      +1 polls     0.8488      0.8040  Latency LEADS CPU Util by 5 min
  Latency             Mem Util                 +1 polls     0.6778      0.6182  Latency LEADS Mem Util by 5 min
  Latency             Temp (C)                       -1 polls     0.6629      0.6139  Temp (C) LEADS Latency by 5 min
  Latency             fan_speed_rpm                -2 polls     0.2621      0.2089  fan_speed_rpm LEADS Latency by 10 min
  Latency             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Latency             Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  CPU Util                Mem Util                 -3 polls     0.7047      0.6618  Mem Util LEADS CPU Util by 15 min
  CPU Util                Temp (C)                       -2 polls     0.7313      0.7129  Temp (C) LEADS CPU Util by 10 min
  CPU Util                fan_speed_rpm                -2 polls     0.2452      0.2289  fan_speed_rpm LEADS CPU Util by 10 min
  CPU Util                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CPU Util                Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Mem Util           Temp (C)                       +1 polls     0.6262      0.6196  Mem Util LEADS Temp (C) by 5 min
  Mem Util           fan_speed_rpm                -6 polls     0.1894      0.1639  fan_speed_rpm LEADS Mem Util by 30 min
  Mem Util           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Mem Util           Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  Temp (C)                 fan_speed_rpm                +0 polls     0.2749      0.2715  simultaneous
  Temp (C)                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Temp (C)                 Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous
  power_supply_status    Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous










  --------------------------------------------------------------------------
  DEVICE TYPE: ROUTER
  --------------------------------------------------------------------------

  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Cross-Correlation Key Findings
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Buffer Util LEADS B/W Util by 5 min (r=0.7516)
  CRC Errors LEADS B/W Util by 10 min (r=0.7381)
  Latency LEADS B/W Util by 5 min (r=0.753)
  Mem Util LEADS B/W Util by 5 min (r=0.6164)
  Temp (C) LEADS B/W Util by 10 min (r=0.6433)
  fan_speed_rpm LEADS B/W Util by 10 min (r=0.164)
  CRC Errors LEADS Buffer Util by 5 min (r=0.9432)
  Buffer Util LEADS CPU Util by 5 min (r=0.8546)
  Buffer Util LEADS Mem Util by 5 min (r=0.6727)
  Temp (C) LEADS Buffer Util by 5 min (r=0.663)
  fan_speed_rpm LEADS Buffer Util by 10 min (r=0.2552)
  CRC Errors LEADS Latency by 5 min (r=0.9399)
  CRC Errors LEADS CPU Util by 10 min (r=0.801)
  CRC Errors LEADS Mem Util by 10 min (r=0.6473)
  CRC Errors LEADS Temp (C) by 5 min (r=0.621)
  fan_speed_rpm LEADS CRC Errors by 5 min (r=0.2289)
  Latency LEADS CPU Util by 5 min (r=0.8488)
  Latency LEADS Mem Util by 5 min (r=0.6778)
  Temp (C) LEADS Latency by 5 min (r=0.6629)
  fan_speed_rpm LEADS Latency by 10 min (r=0.2621)
  Mem Util LEADS CPU Util by 15 min (r=0.7047)
  Temp (C) LEADS CPU Util by 10 min (r=0.7313)
  fan_speed_rpm LEADS CPU Util by 10 min (r=0.2452)
  Mem Util LEADS Temp (C) by 5 min (r=0.6262)
  fan_speed_rpm LEADS Mem Util by 30 min (r=0.1894)






  ##############################################################################
# PROCESSING: SWITCH
##############################################################################

==============================================================================
 SECTION 1 -- CROSS-CORRELATION [SWITCH]
==============================================================================

  Metric A               Metric B                 Best Lag  Pearson r  Spearman r  Interpretation
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  -1 polls     0.8942      0.8607  Buffer Util LEADS B/W Util by 5 min
  B/W Util               CRC Errors                   -2 polls     0.8482      0.8252  CRC Errors LEADS B/W Util by 10 min
  B/W Util               Latency                   -1 polls     0.8906      0.8589  Latency LEADS B/W Util by 5 min
  B/W Util               CPU Util                      -1 polls     0.8324      0.8224  CPU Util LEADS B/W Util by 5 min
  B/W Util               Mem Util                -10 polls     0.2118      0.2028  Mem Util LEADS B/W Util by 50 min
  B/W Util               Temp (C)                       -3 polls     0.2936      0.2858  Temp (C) LEADS B/W Util by 15 min
  B/W Util               fan_speed_rpm                -9 polls     0.1935      0.2099  fan_speed_rpm LEADS B/W Util by 45 min
  B/W Util               power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  B/W Util               Reboot Delta                 +4 polls    -0.0957     -0.1054  B/W Util LEADS Reboot Delta by 20 min
  Buffer Util            CRC Errors                   -1 polls     0.9456      0.9531  CRC Errors LEADS Buffer Util by 5 min
  Buffer Util            Latency                   +0 polls     0.9976      0.9945  simultaneous
  Buffer Util            CPU Util                      +1 polls     0.8872      0.9162  Buffer Util LEADS CPU Util by 5 min
  Buffer Util            Mem Util                 -8 polls     0.2111      0.1985  Mem Util LEADS Buffer Util by 40 min
  Buffer Util            Temp (C)                       -2 polls     0.3114      0.3067  Temp (C) LEADS Buffer Util by 10 min
  Buffer Util            fan_speed_rpm                -7 polls     0.2013      0.1864  fan_speed_rpm LEADS Buffer Util by 35 min
  Buffer Util            power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Buffer Util            Reboot Delta                 +4 polls    -0.0969     -0.1283  Buffer Util LEADS Reboot Delta by 20 min
  CRC Errors             Latency                   +1 polls     0.9448      0.9529  CRC Errors LEADS Latency by 5 min
  CRC Errors             CPU Util                      +2 polls     0.8207      0.8694  CRC Errors LEADS CPU Util by 10 min
  CRC Errors             Mem Util                 -2 polls     0.2055      0.1809  Mem Util LEADS CRC Errors by 10 min
  CRC Errors             Temp (C)                       +0 polls     0.3126      0.3057  simultaneous
  CRC Errors             fan_speed_rpm               -13 polls     0.1810      0.1177  fan_speed_rpm LEADS CRC Errors by 65 min
  CRC Errors             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CRC Errors             Reboot Delta                 -2 polls    -0.0785     -0.1385  Reboot Delta LEADS CRC Errors by 10 min
  Latency             CPU Util                      +1 polls     0.8861      0.9151  Latency LEADS CPU Util by 5 min
  Latency             Mem Util                 -8 polls     0.2130      0.1963  Mem Util LEADS Latency by 40 min
  Latency             Temp (C)                       -2 polls     0.3124      0.3096  Temp (C) LEADS Latency by 10 min
  Latency             fan_speed_rpm                -7 polls     0.1953      0.1877  fan_speed_rpm LEADS Latency by 35 min
  Latency             power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Latency             Reboot Delta                 -2 polls    -0.1008     -0.1284  Reboot Delta LEADS Latency by 10 min
  CPU Util                Mem Util                 +0 polls     0.2202      0.2113  simultaneous
  CPU Util                Temp (C)                       -3 polls     0.3119      0.3176  Temp (C) LEADS CPU Util by 15 min
  CPU Util                fan_speed_rpm                -7 polls     0.1892      0.1911  fan_speed_rpm LEADS CPU Util by 35 min
  CPU Util                power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  CPU Util                Reboot Delta                 +2 polls    -0.1266     -0.1284  CPU Util LEADS Reboot Delta by 10 min
  Mem Util           Temp (C)                       -1 polls     0.1178      0.1232  Temp (C) LEADS Mem Util by 5 min
  Mem Util           fan_speed_rpm                +8 polls     0.1530      0.1316  Mem Util LEADS fan_speed_rpm by 40 min
  Mem Util           power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Mem Util           Reboot Delta                 -5 polls    -0.1168     -0.0968  Reboot Delta LEADS Mem Util by 25 min
  Temp (C)                 fan_speed_rpm                +0 polls     0.2026      0.2012  simultaneous
  Temp (C)                 power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  Temp (C)                 Reboot Delta                +15 polls     0.1248      0.0999  Temp (C) LEADS Reboot Delta by 75 min
  fan_speed_rpm          power_supply_status          +0 polls     0.0000      0.0000  simultaneous
  fan_speed_rpm          Reboot Delta                 -5 polls    -0.1930     -0.1026  Reboot Delta LEADS fan_speed_rpm by 25 min
  power_supply_status    Reboot Delta                 +0 polls     0.0000      0.0000  simultaneous



  --------------------------------------------------------------------------
  DEVICE TYPE: SWITCH
  --------------------------------------------------------------------------

  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Cross-Correlation Key Findings
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Buffer Util LEADS B/W Util by 5 min (r=0.8942)
  CRC Errors LEADS B/W Util by 10 min (r=0.8482)
  Latency LEADS B/W Util by 5 min (r=0.8906)
  CPU Util LEADS B/W Util by 5 min (r=0.8324)
  Mem Util LEADS B/W Util by 50 min (r=0.2118)
  Temp (C) LEADS B/W Util by 15 min (r=0.2936)
  fan_speed_rpm LEADS B/W Util by 45 min (r=0.1935)
  B/W Util LEADS Reboot Delta by 20 min (r=-0.0957)
  CRC Errors LEADS Buffer Util by 5 min (r=0.9456)
  Buffer Util LEADS CPU Util by 5 min (r=0.8872)
  Mem Util LEADS Buffer Util by 40 min (r=0.2111)
  Temp (C) LEADS Buffer Util by 10 min (r=0.3114)
  fan_speed_rpm LEADS Buffer Util by 35 min (r=0.2013)
  Buffer Util LEADS Reboot Delta by 20 min (r=-0.0969)
  CRC Errors LEADS Latency by 5 min (r=0.9448)
  CRC Errors LEADS CPU Util by 10 min (r=0.8207)
  Mem Util LEADS CRC Errors by 10 min (r=0.2055)
  fan_speed_rpm LEADS CRC Errors by 65 min (r=0.181)
  Reboot Delta LEADS CRC Errors by 10 min (r=-0.0785)
  Latency LEADS CPU Util by 5 min (r=0.8861)
  Mem Util LEADS Latency by 40 min (r=0.213)
  Temp (C) LEADS Latency by 10 min (r=0.3124)
  fan_speed_rpm LEADS Latency by 35 min (r=0.1953)
  Reboot Delta LEADS Latency by 10 min (r=-0.1008)
  Temp (C) LEADS CPU Util by 15 min (r=0.3119)
  fan_speed_rpm LEADS CPU Util by 35 min (r=0.1892)
  CPU Util LEADS Reboot Delta by 10 min (r=-0.1266)
  Temp (C) LEADS Mem Util by 5 min (r=0.1178)
  Mem Util LEADS fan_speed_rpm by 40 min (r=0.153)
  Reboot Delta LEADS Mem Util by 25 min (r=-0.1168)
  Temp (C) LEADS Reboot Delta by 75 min (r=0.1248)
  Reboot Delta LEADS fan_speed_rpm by 25 min (r=-0.193)











  `,
  granger_causality: `
  ==============================================================================
 SECTION 2 -- GRANGER CAUSALITY [ROUTER]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  +2 polls   63.183     0.000000  *** SIGNIFICANT ***
  B/W Util               CRC Errors                   +3 polls   34.934     0.000000  *** SIGNIFICANT ***
  B/W Util               Latency                   +2 polls   54.799     0.000000  *** SIGNIFICANT ***
  B/W Util               CPU Util                      +6 polls    8.954     0.000000  *** SIGNIFICANT ***
  B/W Util               Mem Util                 +1 polls   45.770     0.000000  *** SIGNIFICANT ***
  B/W Util               Temp (C)                       +1 polls   56.131     0.000000  *** SIGNIFICANT ***
  B/W Util               fan_speed_rpm                +9 polls    2.371     0.013630  *** SIGNIFICANT ***
  B/W Util               power_supply_status          +1 polls    0.000     1.000000  not significant
  B/W Util               Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Buffer Util            CRC Errors                   +1 polls  289.313     0.000000  *** SIGNIFICANT ***
  Buffer Util            Latency                   +2 polls    4.154     0.016674  *** SIGNIFICANT ***
  Buffer Util            CPU Util                      +1 polls    9.095     0.002795  *** SIGNIFICANT ***
  Buffer Util            Mem Util                 +1 polls   50.067     0.000000  *** SIGNIFICANT ***
  Buffer Util            Temp (C)                       +1 polls   69.147     0.000000  *** SIGNIFICANT ***
  Buffer Util            fan_speed_rpm                +7 polls    4.837     0.000038  *** SIGNIFICANT ***
  Buffer Util            power_supply_status          +3 polls 8866.326     0.000000  *** SIGNIFICANT ***
  Buffer Util            Reboot Delta                 +1 polls    0.000     1.000000  not significant
  CRC Errors             Latency                   +2 polls   14.463     0.000001  *** SIGNIFICANT ***
  CRC Errors             CPU Util                      +3 polls    3.706     0.012150  *** SIGNIFICANT ***
  CRC Errors             Mem Util                 +1 polls   38.424     0.000000  *** SIGNIFICANT ***
  CRC Errors             Temp (C)                       +1 polls   39.916     0.000000  *** SIGNIFICANT ***
  CRC Errors             fan_speed_rpm                +7 polls    4.292     0.000162  *** SIGNIFICANT ***
  CRC Errors             power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  CRC Errors             Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Latency             CPU Util                     +10 polls    2.809     0.002540  *** SIGNIFICANT ***
  Latency             Mem Util                 +1 polls   47.355     0.000000  *** SIGNIFICANT ***
  Latency             Temp (C)                       +1 polls   70.203     0.000000  *** SIGNIFICANT ***
  Latency             fan_speed_rpm                +7 polls    4.851     0.000036  *** SIGNIFICANT ***
  Latency             power_supply_status          +1 polls    0.000     1.000000  not significant
  Latency             Reboot Delta                 +1 polls    0.000     1.000000  not significant
  CPU Util                Mem Util                 +1 polls   61.350     0.000000  *** SIGNIFICANT ***
  CPU Util                Temp (C)                       +1 polls   99.348     0.000000  *** SIGNIFICANT ***
  CPU Util                fan_speed_rpm                +1 polls   11.531     0.000782  *** SIGNIFICANT ***
  CPU Util                power_supply_status          +1 polls    0.000     1.000000  not significant
  CPU Util                Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Mem Util           Temp (C)                       +1 polls   34.568     0.000000  *** SIGNIFICANT ***
  Mem Util           fan_speed_rpm                +7 polls    3.278     0.002331  *** SIGNIFICANT ***
  Mem Util           power_supply_status          +3 polls  745.558     0.000000  *** SIGNIFICANT ***
  Mem Util           Reboot Delta                 +1 polls    0.000     1.000000  not significant
  Temp (C)                 fan_speed_rpm                +2 polls    4.492     0.012010  *** SIGNIFICANT ***
  Temp (C)                 power_supply_status          +3 polls  153.385     0.000000  *** SIGNIFICANT ***
  Temp (C)                 Reboot Delta                 +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          Reboot Delta                 +1 polls    0.000     1.000000  not significant
  power_supply_status    Reboot Delta                 +1 polls    0.000     1.000000  not significant




-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Granger Causality Significant Pairs
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  B/W Util->Buffer Util  p=0.0  lag=10 min  *** SIGNIFICANT
  B/W Util->CRC Errors  p=0.0  lag=15 min  *** SIGNIFICANT
  B/W Util->Latency  p=0.0  lag=10 min  *** SIGNIFICANT
  B/W Util->CPU Util  p=0.0  lag=30 min  *** SIGNIFICANT
  B/W Util->Mem Util  p=0.0  lag=5 min  *** SIGNIFICANT
  B/W Util->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  B/W Util->fan_speed_rpm  p=0.01363  lag=45 min  *** SIGNIFICANT
  Buffer Util->CRC Errors  p=0.0  lag=5 min  *** SIGNIFICANT
  Buffer Util->Latency  p=0.016674  lag=10 min  *** SIGNIFICANT
  Buffer Util->CPU Util  p=0.002795  lag=5 min  *** SIGNIFICANT
  Buffer Util->Mem Util  p=0.0  lag=5 min  *** SIGNIFICANT
  Buffer Util->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  Buffer Util->fan_speed_rpm  p=3.8e-05  lag=35 min  *** SIGNIFICANT
  Buffer Util->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  CRC Errors->Latency  p=1e-06  lag=10 min  *** SIGNIFICANT
  CRC Errors->CPU Util  p=0.01215  lag=15 min  *** SIGNIFICANT
  CRC Errors->Mem Util  p=0.0  lag=5 min  *** SIGNIFICANT
  CRC Errors->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  CRC Errors->fan_speed_rpm  p=0.000162  lag=35 min  *** SIGNIFICANT
  CRC Errors->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  Latency->CPU Util  p=0.00254  lag=50 min  *** SIGNIFICANT
  Latency->Mem Util  p=0.0  lag=5 min  *** SIGNIFICANT
  Latency->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  Latency->fan_speed_rpm  p=3.6e-05  lag=35 min  *** SIGNIFICANT
  CPU Util->Mem Util  p=0.0  lag=5 min  *** SIGNIFICANT
  CPU Util->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  CPU Util->fan_speed_rpm  p=0.000782  lag=5 min  *** SIGNIFICANT
  Mem Util->Temp (C)  p=0.0  lag=5 min  *** SIGNIFICANT
  Mem Util->fan_speed_rpm  p=0.002331  lag=35 min  *** SIGNIFICANT
  Mem Util->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  Temp (C)->fan_speed_rpm  p=0.01201  lag=10 min  *** SIGNIFICANT
  Temp (C)->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT



==============================================================================
 SECTION 2 -- GRANGER CAUSALITY [SWITCH]
==============================================================================

  Cause                  Effect                   Best Lag   F-stat      p-value  Result
  ------------------------------------------------------------------------------
  B/W Util               Buffer Util                  +1 polls   88.151     0.000000  *** SIGNIFICANT ***
  B/W Util               CRC Errors                   +3 polls   35.412     0.000000  *** SIGNIFICANT ***
  B/W Util               Latency                   +1 polls   88.824     0.000000  *** SIGNIFICANT ***
  B/W Util               CPU Util                      +1 polls   60.987     0.000000  *** SIGNIFICANT ***
  B/W Util               Mem Util                 +1 polls    8.286     0.004299  *** SIGNIFICANT ***
  B/W Util               Temp (C)                       +1 polls   19.366     0.000015  *** SIGNIFICANT ***
  B/W Util               fan_speed_rpm                +3 polls    2.206     0.087653  not significant
  B/W Util               power_supply_status          +1 polls    0.000     1.000000  not significant
  B/W Util               Reboot Delta                 +1 polls    1.859     0.173793  not significant
  Buffer Util            CRC Errors                   +1 polls  329.346     0.000000  *** SIGNIFICANT ***
  Buffer Util            Latency                   +2 polls    7.940     0.000442  *** SIGNIFICANT ***
  Buffer Util            CPU Util                      +1 polls   27.817     0.000000  *** SIGNIFICANT ***
  Buffer Util            Mem Util                 +1 polls    8.713     0.003423  *** SIGNIFICANT ***
  Buffer Util            Temp (C)                       +5 polls    7.354     0.000002  *** SIGNIFICANT ***
  Buffer Util            fan_speed_rpm                +1 polls    2.338     0.127380  not significant
  Buffer Util            power_supply_status          +1 polls  221.667     0.000000  *** SIGNIFICANT ***
  Buffer Util            Reboot Delta                 +1 polls    2.659     0.104054  not significant
  CRC Errors             Latency                   +9 polls    4.039     0.000074  *** SIGNIFICANT ***
  CRC Errors             CPU Util                      +1 polls   10.251     0.001521  *** SIGNIFICANT ***
  CRC Errors             Mem Util                 +2 polls    5.606     0.004099  *** SIGNIFICANT ***
  CRC Errors             Temp (C)                       +4 polls    7.816     0.000006  *** SIGNIFICANT ***
  CRC Errors             fan_speed_rpm                +1 polls    2.288     0.131504  not significant
  CRC Errors             power_supply_status          +1 polls 3320.436     0.000000  *** SIGNIFICANT ***
  CRC Errors             Reboot Delta                 +1 polls    1.745     0.187620  not significant
  Latency             CPU Util                      +1 polls   27.771     0.000000  *** SIGNIFICANT ***
  Latency             Mem Util                 +1 polls    8.174     0.004564  *** SIGNIFICANT ***
  Latency             Temp (C)                       +3 polls   10.334     0.000002  *** SIGNIFICANT ***
  Latency             fan_speed_rpm                +1 polls    2.310     0.129629  not significant
  Latency             power_supply_status          +1 polls  173.948     0.000000  *** SIGNIFICANT ***
  Latency             Reboot Delta                 +1 polls    2.811     0.094739  not significant
  CPU Util                Mem Util                 +1 polls   10.309     0.001475  *** SIGNIFICANT ***
  CPU Util                Temp (C)                       +4 polls    7.770     0.000006  *** SIGNIFICANT ***
  CPU Util                fan_speed_rpm                +7 polls    1.395     0.207637  not significant
  CPU Util                power_supply_status          +1 polls    0.000     1.000000  not significant
  CPU Util                Reboot Delta                 +1 polls    3.627     0.057871  not significant
  Mem Util           Temp (C)                       +1 polls    3.549     0.060597  not significant
  Mem Util           fan_speed_rpm                +1 polls    5.502     0.019683  *** SIGNIFICANT ***
  Mem Util           power_supply_status          +3 polls  116.950     0.000000  *** SIGNIFICANT ***
  Mem Util           Reboot Delta                 +7 polls    1.603     0.134648  not significant
  Temp (C)                 fan_speed_rpm                +5 polls    0.916     0.471229  not significant
  Temp (C)                 power_supply_status          +1 polls    0.000     1.000000  not significant
  Temp (C)                 Reboot Delta                 +4 polls    0.677     0.608338  not significant
  fan_speed_rpm          power_supply_status          +1 polls    0.000     1.000000  not significant
  fan_speed_rpm          Reboot Delta                 +5 polls    3.016     0.011456  *** SIGNIFICANT ***
  power_supply_status    Reboot Delta                 +2 polls    0.000     1.000000  not significant




-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Granger Causality Significant Pairs
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  B/W Util->Buffer Util  p=0.0  lag=5 min  *** SIGNIFICANT
  B/W Util->CRC Errors  p=0.0  lag=15 min  *** SIGNIFICANT
  B/W Util->Latency  p=0.0  lag=5 min  *** SIGNIFICANT
  B/W Util->CPU Util  p=0.0  lag=5 min  *** SIGNIFICANT
  B/W Util->Mem Util  p=0.004299  lag=5 min  *** SIGNIFICANT
  B/W Util->Temp (C)  p=1.5e-05  lag=5 min  *** SIGNIFICANT
  Buffer Util->CRC Errors  p=0.0  lag=5 min  *** SIGNIFICANT
  Buffer Util->Latency  p=0.000442  lag=10 min  *** SIGNIFICANT
  Buffer Util->CPU Util  p=0.0  lag=5 min  *** SIGNIFICANT
  Buffer Util->Mem Util  p=0.003423  lag=5 min  *** SIGNIFICANT
  Buffer Util->Temp (C)  p=2e-06  lag=25 min  *** SIGNIFICANT
  Buffer Util->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  CRC Errors->Latency  p=7.4e-05  lag=45 min  *** SIGNIFICANT
  CRC Errors->CPU Util  p=0.001521  lag=5 min  *** SIGNIFICANT
  CRC Errors->Mem Util  p=0.004099  lag=10 min  *** SIGNIFICANT
  CRC Errors->Temp (C)  p=6e-06  lag=20 min  *** SIGNIFICANT
  CRC Errors->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  Latency->CPU Util  p=0.0  lag=5 min  *** SIGNIFICANT
  Latency->Mem Util  p=0.004564  lag=5 min  *** SIGNIFICANT
  Latency->Temp (C)  p=2e-06  lag=15 min  *** SIGNIFICANT
  Latency->power_supply_status  p=0.0  lag=5 min  *** SIGNIFICANT
  CPU Util->Mem Util  p=0.001475  lag=5 min  *** SIGNIFICANT
  CPU Util->Temp (C)  p=6e-06  lag=20 min  *** SIGNIFICANT
  Mem Util->fan_speed_rpm  p=0.019683  lag=5 min  *** SIGNIFICANT
  Mem Util->power_supply_status  p=0.0  lag=15 min  *** SIGNIFICANT
  fan_speed_rpm->Reboot Delta  p=0.011456  lag=25 min  *** SIGNIFICANT




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
  B/W Util                     49.55          84.14   +34.59    +69.8%  UP
  Buffer Util                   1.76          39.92   +38.16  +2168.8%  UP
  CRC Errors                    0.31          10.11    +9.80  +3194.7%  UP
  Latency                    7.76          44.00   +36.24   +467.2%  UP
  CPU Util                      43.42          50.76    +7.34    +16.9%  UP
  Mem Util                 57.43          58.52    +1.09     +1.9%  UP
  Temp (C)                       49.08          49.57    +0.50     +1.0%  UP
  fan_speed_rpm              3219.73        3224.74    +5.01     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       343  [#..............]
  Buffer Util                   1p        1p        1p       343  [#..............]
  CRC Errors                    1p        1p        1p       343  [#..............]
  Latency                    1p        1p        1p       343  [#..............]
  CPU Util                       6p        1p        1p       343  [#==.==.........]
  Mem Util                 15p        5p        1p        85  [#==============]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  --------------------------------------------------------------------------
  EVENT: HIGH_UTIL_WARNING | Occurrences: 532 | Pre-event windows: 719 | Normal windows: 2149
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     47.43          77.55   +30.11    +63.5%  UP
  Buffer Util                   0.08          29.56   +29.48 +37608.5%  UP
  CRC Errors                    0.05           7.30    +7.25 +13422.0%  UP
  Latency                    6.16          34.16   +28.00   +454.4%  UP
  CPU Util                      43.17          48.80    +5.62    +13.0%  UP
  Mem Util                 57.40          58.27    +0.87     +1.5%  UP
  Temp (C)                       49.07          49.45    +0.38     +0.8%  UP
  fan_speed_rpm              3219.41        3225.44    +6.03     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       719  [#..............]
  Buffer Util                   1p        1p        1p       719  [#..............]
  CRC Errors                    2p        1p        1p       719  [#=.............]
  Latency                    2p        1p        1p       719  [#=.............]
  CPU Util                      12p        1p        1p       719  [#======..===...]
  Mem Util                 15p        8p        1p       148  [##=============]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  --------------------------------------------------------------------------
  EVENT: INTERFACE_FLAP | Occurrences: 277 | Pre-event windows: 408 | Normal windows: 2409
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     49.73          85.24   +35.51    +71.4%  UP
  Buffer Util                   1.44          42.19   +40.75  +2833.1%  UP
  CRC Errors                    0.17          10.90   +10.73  +6225.1%  UP
  Latency                    7.44          46.18   +38.74   +520.3%  UP
  CPU Util                      43.53          51.26    +7.73    +17.8%  UP
  Mem Util                 57.45          58.61    +1.16     +2.0%  UP
  Temp (C)                       49.09          49.61    +0.52     +1.1%  UP
  fan_speed_rpm              3220.11        3226.07    +5.96     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      2p        1p        1p       408  [#=.............]
  Buffer Util                   1p        1p        1p       408  [#..............]
  CRC Errors                    1p        1p        1p       408  [#..............]
  Latency                    1p        1p        1p       408  [#..............]
  CPU Util                       6p        1p        1p       408  [#===.=.........]
  Mem Util                 15p        5p        1p        86  [#==============]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [LINK_DOWN] No occurrences -- skipping.

  --------------------------------------------------------------------------
  EVENT: PACKET_DROP | Occurrences: 493 | Pre-event windows: 657 | Normal windows: 2202
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     48.03          80.15   +32.12    +66.9%  UP
  Buffer Util                   0.28          33.31   +33.03 +11902.6%  UP
  CRC Errors                    0.06           8.22    +8.16 +14634.7%  UP
  Latency                    6.35          37.70   +31.35   +493.8%  UP
  CPU Util                      43.18          49.70    +6.52    +15.1%  UP
  Mem Util                 57.40          58.39    +0.99     +1.7%  UP
  Temp (C)                       49.07          49.52    +0.44     +0.9%  UP
  fan_speed_rpm              3219.60        3226.49    +6.89     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       657  [#..............]
  Buffer Util                   1p        1p        1p       657  [#..............]
  CRC Errors                    2p        1p        1p       657  [#=.............]
  Latency                    1p        1p        1p       657  [#..............]
  CPU Util                      12p        1p        1p       657  [#======....=...]
  Mem Util                 15p        6p        1p       136  [#==============]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a





  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Pre-Event Metric Patterns
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_LATENCY (231 occurrences)
    B/W Util               normal=49.5  pre-event=84.1  (+70%)
    Buffer Util            normal=1.8  pre-event=39.9  (+2169%)
    CRC Errors             normal=0.3  pre-event=10.1  (+3195%)
    Latency             normal=7.8  pre-event=44.0  (+467%)
    Earliest warning: 75 min before event
  HIGH_UTIL_WARNING (532 occurrences)
    B/W Util               normal=47.4  pre-event=77.5  (+64%)
    Buffer Util            normal=0.1  pre-event=29.6  (+37608%)
    CRC Errors             normal=0.1  pre-event=7.3  (+13422%)
    Latency             normal=6.2  pre-event=34.2  (+454%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (277 occurrences)
    B/W Util               normal=49.7  pre-event=85.2  (+71%)
    Buffer Util            normal=1.4  pre-event=42.2  (+2833%)
    CRC Errors             normal=0.2  pre-event=10.9  (+6225%)
    Latency             normal=7.4  pre-event=46.2  (+520%)
    Earliest warning: 75 min before event
  PACKET_DROP (493 occurrences)
    B/W Util               normal=48.0  pre-event=80.2  (+67%)
    Buffer Util            normal=0.3  pre-event=33.3  (+11903%)
    CRC Errors             normal=0.1  pre-event=8.2  (+14635%)
    Latency             normal=6.3  pre-event=37.7  (+494%)
    Earliest warning: 75 min before event



==============================================================================
 SECTION 3 -- PRE-EVENT METRIC BEHAVIOR [SWITCH]
==============================================================================

  --------------------------------------------------------------------------
  EVENT: DEVICE_REBOOT | Occurrences: 2 | Pre-event windows: 6 | Normal windows: 4022
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     43.14          33.70    -9.45    -21.9%  DOWN
  Buffer Util                   6.65           0.00    -6.65   -100.0%  DOWN
  CRC Errors                    2.38           0.05    -2.33    -97.9%  DOWN
  Latency                    8.24           3.14    -5.10    -61.9%  DOWN
  CPU Util                      27.43          23.12    -4.31    -15.7%  DOWN
  Mem Util                 45.26          44.69    -0.56     -1.2%  DOWN
  Temp (C)                       42.09          42.07    -0.02     -0.1%  DOWN
  fan_speed_rpm              2607.41        2590.37   -17.04     -0.7%  DOWN
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    +0.00     +0.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p         6  [#..............]
  Buffer Util                   1p        1p        1p         6  [#..............]
  CRC Errors                    1p        1p        1p         6  [#..............]
  Latency                    1p        1p        1p         6  [#..............]
  CPU Util                       1p        1p        1p         6  [#..............]
  Mem Util                 n/a      n/a      n/a       n/a
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a

  [HIGH_LATENCY] No occurrences -- skipping.

  --------------------------------------------------------------------------
  EVENT: HIGH_UTIL_WARNING | Occurrences: 207 | Pre-event windows: 298 | Normal windows: 2438
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     36.54          64.70   +28.16    +77.1%  UP
  Buffer Util                   0.33          19.44   +19.11  +5798.9%  UP
  CRC Errors                    0.09           5.00    +4.92  +5769.7%  UP
  Latency                    3.57          17.72   +14.15   +396.6%  UP
  CPU Util                      26.06          30.93    +4.87    +18.7%  UP
  Mem Util                 45.16          45.33    +0.18     +0.4%  UP
  Temp (C)                       42.06          42.14    +0.08     +0.2%  UP
  fan_speed_rpm              2605.95        2610.75    +4.81     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       298  [#..............]
  Buffer Util                   1p        1p        1p       298  [#..............]
  CRC Errors                    2p        1p        1p       298  [#=.............]
  Latency                    1p        1p        1p       298  [#..............]
  CPU Util                       9p        1p        1p       298  [#===....=......]
  Mem Util                 15p        7p        1p        72  [##=###==###====]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  Reboot Delta                  1p        1p        1p       298  [#..............]

  --------------------------------------------------------------------------
  EVENT: INTERFACE_FLAP | Occurrences: 146 | Pre-event windows: 222 | Normal windows: 2636
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     37.96          71.37   +33.41    +88.0%  UP
  Buffer Util                   1.32          28.42   +27.10  +2057.8%  UP
  CRC Errors                    0.28           8.30    +8.02  +2879.0%  UP
  Latency                    4.30          24.44   +20.14   +468.8%  UP
  CPU Util                      26.26          32.28    +6.01    +22.9%  UP
  Mem Util                 45.16          45.41    +0.25     +0.6%  UP
  Temp (C)                       42.06          42.18    +0.12     +0.3%  UP
  fan_speed_rpm              2606.18        2611.75    +5.56     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      2p        1p        1p       222  [#=.............]
  Buffer Util                   1p        1p        1p       222  [#..............]
  CRC Errors                    1p        1p        1p       222  [#..............]
  Latency                    1p        1p        1p       222  [#..............]
  CPU Util                       3p        1p        1p       222  [#==............]
  Mem Util                 15p        7p        1p        57  [#==============]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  Reboot Delta                  1p        1p        1p       222  [#..............]

  --------------------------------------------------------------------------
  EVENT: LINK_DOWN | Occurrences: 2 | Pre-event windows: 4 | Normal windows: 4028
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     42.70          83.22   +40.53    +94.9%  UP
  Buffer Util                   6.11          46.38   +40.27   +658.6%  UP
  CRC Errors                    2.12          18.62   +16.51   +779.9%  UP
  Latency                    7.84          37.61   +29.76   +379.4%  UP
  CPU Util                      27.31          33.89    +6.58    +24.1%  UP
  Mem Util                 45.24          45.74    +0.50     +1.1%  UP
  Temp (C)                       42.09          42.01    -0.08     -0.2%  DOWN
  fan_speed_rpm              2607.05        2620.99   +13.94     +0.5%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p         4  [#..............]
  Buffer Util                   1p        1p        1p         4  [#..............]
  CRC Errors                    1p        1p        1p         4  [#..............]
  Latency                    1p        1p        1p         4  [#..............]
  CPU Util                       1p        1p        1p         4  [#..............]
  Mem Util                  9p        8p        8p         2  [.......##......]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  Reboot Delta                  1p        1p        1p         4  [#..............]

  --------------------------------------------------------------------------
  EVENT: PACKET_DROP | Occurrences: 239 | Pre-event windows: 329 | Normal windows: 2484
  --------------------------------------------------------------------------

  Metric                  Normal avg  Pre-event avg   Change  Change %  Direction
  ------------------------------------------------------------------------------
  B/W Util                     37.03          66.38   +29.35    +79.3%  UP
  Buffer Util                   0.66          21.53   +20.87  +3156.5%  UP
  CRC Errors                    0.17           5.69    +5.53  +3317.2%  UP
  Latency                    3.80          19.31   +15.51   +408.2%  UP
  CPU Util                      26.13          31.12    +4.98    +19.1%  UP
  Mem Util                 45.17          45.34    +0.17     +0.4%  UP
  Temp (C)                       42.07          42.15    +0.08     +0.2%  UP
  fan_speed_rpm              2606.29        2610.26    +3.97     +0.2%  UP
  power_supply_status           1.00           1.00    +0.00     +0.0%  DOWN
  Reboot Delta                  0.00           0.00    -0.00   -100.0%  DOWN

  Lead time distribution (>10% divergence from normal):
  Metric                  Earliest   Median   Latest   Windows  Sample dist (polls before event)
  ------------------------------------------------------------------------------
  B/W Util                      1p        1p        1p       329  [#..............]
  Buffer Util                   1p        1p        1p       329  [#..............]
  CRC Errors                    1p        1p        1p       329  [#..............]
  Latency                    1p        1p        1p       329  [#..............]
  CPU Util                       4p        1p        1p       329  [#===...........]
  Mem Util                 15p        6p        1p        64  [##=####========]
  Temp (C)                       n/a      n/a      n/a       n/a
  fan_speed_rpm                n/a      n/a      n/a       n/a
  power_supply_status          n/a      n/a      n/a       n/a
  Reboot Delta                  1p        1p        1p       329  [#..............]


  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Pre-Event Metric Patterns
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  DEVICE_REBOOT (2 occurrences)
    B/W Util               normal=43.1  pre-event=33.7  (-22%)
    Buffer Util            normal=6.6  pre-event=0.0  (-100%)
    CRC Errors             normal=2.4  pre-event=0.1  (-98%)
    Latency             normal=8.2  pre-event=3.1  (-62%)
    Earliest warning: 5 min before event
  HIGH_UTIL_WARNING (207 occurrences)
    B/W Util               normal=36.5  pre-event=64.7  (+77%)
    Buffer Util            normal=0.3  pre-event=19.4  (+5799%)
    CRC Errors             normal=0.1  pre-event=5.0  (+5770%)
    Latency             normal=3.6  pre-event=17.7  (+397%)
    Reboot Delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 75 min before event
  INTERFACE_FLAP (146 occurrences)
    B/W Util               normal=38.0  pre-event=71.4  (+88%)
    Buffer Util            normal=1.3  pre-event=28.4  (+2058%)
    CRC Errors             normal=0.3  pre-event=8.3  (+2879%)
    Latency             normal=4.3  pre-event=24.4  (+469%)
    CPU Util                normal=26.3  pre-event=32.3  (+23%)
    Reboot Delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 75 min before event
  LINK_DOWN (2 occurrences)
    B/W Util               normal=42.7  pre-event=83.2  (+95%)
    Buffer Util            normal=6.1  pre-event=46.4  (+659%)
    CRC Errors             normal=2.1  pre-event=18.6  (+780%)
    Latency             normal=7.8  pre-event=37.6  (+379%)
    CPU Util                normal=27.3  pre-event=33.9  (+24%)
    Reboot Delta           normal=0.0  pre-event=0.0  (-100%)
    Earliest warning: 45 min before event
  PACKET_DROP (239 occurrences)
    B/W Util               normal=37.0  pre-event=66.4  (+79%)
    Buffer Util            normal=0.7  pre-event=21.5  (+3156%)
    CRC Errors             normal=0.2  pre-event=5.7  (+3317%)
    Latency             normal=3.8  pre-event=19.3  (+408%)
    Reboot Delta           normal=0.0  pre-event=0.0  (-100%)
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
    Latency_last                         0.1523  ####
    Buffer Util_last                        0.1475  ####
    CRC Errors_last                         0.1018  ###
    B/W Util_last                           0.0876  ##
    B/W Util_mean                           0.0754  ##
    B/W Util_max                            0.0570  #
    B/W Util_min                            0.0461  #
    Buffer Util_slope                       0.0351  #

  HIGH_UTIL_WARNING                17.6%     0.958      0.824   0.972  0.892  OK

    Top 8 features for HIGH_UTIL_WARNING:
    Feature                             Importance  Bar
    B/W Util_last                           0.1731  #####
    Latency_last                         0.1303  ###
    Buffer Util_last                        0.1256  ###
    B/W Util_mean                           0.0680  ##
    B/W Util_max                            0.0555  #
    Latency_std                          0.0440  #
    Latency_range                        0.0358  #
    CRC Errors_last                         0.0310

  INTERFACE_FLAP                   10.0%     0.967      0.778   0.939  0.851  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    CRC Errors_last                         0.1458  ####
    Latency_last                         0.1202  ###
    Buffer Util_last                        0.1105  ###
    B/W Util_mean                           0.0867  ##
    B/W Util_max                            0.0661  #
    B/W Util_min                            0.0519  #
    Latency_mean                         0.0379  #
    Buffer Util_mean                        0.0355  #

  LINK_DOWN                         0.0%         --          --       --      --  SKIPPED (rate out of range)
  PACKET_DROP                      16.1%     0.968      0.862   0.954  0.906  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    Latency_last                         0.1505  ####
    Buffer Util_last                        0.1380  ####
    B/W Util_last                           0.1185  ###
    CRC Errors_last                         0.0785  ##
    B/W Util_mean                           0.0721  ##
    B/W Util_max                            0.0498  #
    B/W Util_min                            0.0443  #
    Latency_slope                        0.0284



-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Random Forest Accuracy
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_LATENCY                 acc=0.962  prec=0.732  recall=0.870  f1=0.795
    Top feature: Latency_last (0.1523)
  HIGH_UTIL_WARNING            acc=0.958  prec=0.824  recall=0.972  f1=0.892
    Top feature: B/W Util_last (0.1731)
  INTERFACE_FLAP               acc=0.967  prec=0.778  recall=0.939  f1=0.851
    Top feature: CRC Errors_last (0.1458)
  PACKET_DROP                  acc=0.968  prec=0.862  recall=0.954  f1=0.906
    Top feature: Latency_last (0.1505)






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
    B/W Util_last                           0.1794  #####
    Buffer Util_last                        0.1250  ###
    Latency_last                         0.1169  ###
    CRC Errors_last                         0.0774  ##
    Latency_slope                        0.0620  #
    B/W Util_slope                          0.0459  #
    B/W Util_mean                           0.0446  #
    Buffer Util_slope                       0.0442  #

  INTERFACE_FLAP                    5.4%     0.978      0.741   0.909  0.816  OK

    Top 8 features for INTERFACE_FLAP:
    Feature                             Importance  Bar
    CRC Errors_last                         0.1666  ####
    Buffer Util_last                        0.1091  ###
    Latency_last                         0.0991  ##
    B/W Util_mean                           0.0846  ##
    Latency_slope                        0.0777  ##
    Buffer Util_slope                       0.0524  #
    Buffer Util_mean                        0.0518  #
    B/W Util_max                            0.0360  #

  LINK_DOWN                         0.1%         --          --       --      --  SKIPPED (rate out of range)
  PACKET_DROP                       8.1%     0.980      0.821   0.970  0.889  OK

    Top 8 features for PACKET_DROP:
    Feature                             Importance  Bar
    Buffer Util_last                        0.1543  ####
    Latency_last                         0.1516  ####
    CRC Errors_last                         0.1146  ###
    B/W Util_last                           0.0715  ##
    Latency_slope                        0.0693  ##
    B/W Util_mean                           0.0456  #
    Buffer Util_slope                       0.0443  #
    B/W Util_max                            0.0373  #





  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  Random Forest Accuracy
  -€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€-€
  HIGH_UTIL_WARNING            acc=0.972  prec=0.747  recall=0.933  f1=0.830
    Top feature: B/W Util_last (0.1794)
  INTERFACE_FLAP               acc=0.978  prec=0.741  recall=0.909  f1=0.816
    Top feature: CRC Errors_last (0.1666)
  PACKET_DROP                  acc=0.980  prec=0.821  recall=0.970  f1=0.889
    Top feature: Buffer Util_last (0.1543)








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

  Cluster Centroids  (interface: ['B/W Util', 'Buffer Util']  device: ['CPU Util', 'Mem Util']):
  Cluster  Name                            B/W Util     Buffer Util         CPU Util    Mem Util
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

  Cluster Centroids  (interface: ['B/W Util', 'Buffer Util']  device: ['CPU Util', 'Mem Util']):
  Cluster  Name                            B/W Util     Buffer Util         CPU Util    Mem Util
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
  CPU Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  B/W Util ^  ->  HIGH_LATENCY

  Chain 2  [HIGH_UTIL_WARNING]  (5 metrics  |  seen 532x  |  719 pre-event windows)
  CPU Util ^  ->  CRC Errors ^  ->  Latency ^  ->  Buffer Util ^  ->  B/W Util ^  ->  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (5 metrics  |  seen 277x  |  408 pre-event windows)
  CPU Util ^  ->  B/W Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (5 metrics  |  seen 493x  |  657 pre-event windows)
  CPU Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  B/W Util ^  ->  PACKET_DROP

  Total chains: 4


  ==============================================================================
 SECTION 10 -- FAILURE CHAIN PATTERNS [SWITCH]
==============================================================================

  Chain 1  [DEVICE_REBOOT]  (5 metrics  |  seen 2x  |  6 pre-event windows)
  Buffer Util v  ->  CRC Errors v  ->  Latency v  ->  B/W Util v  ->  CPU Util v  ->  DEVICE_REBOOT

  Chain 2  [HIGH_UTIL_WARNING]  (6 metrics  |  seen 207x  |  298 pre-event windows)
  CPU Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  Reboot Delta ^  ->  B/W Util ^  ->  HIGH_UTIL_WARNING

  Chain 3  [INTERFACE_FLAP]  (6 metrics  |  seen 146x  |  222 pre-event windows)
  CPU Util ^  ->  B/W Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  Reboot Delta ^  ->  INTERFACE_FLAP

  Chain 4  [PACKET_DROP]  (6 metrics  |  seen 239x  |  329 pre-event windows)
  CPU Util ^  ->  CRC Errors ^  ->  Buffer Util ^  ->  Latency ^  ->  Reboot Delta ^  ->  B/W Util ^  ->  PACKET_DROP

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
