# BUILD.md — Phase 1: fail-safe ethernet heat-lever + FAN/HEAT/OFF modes

Replace the manual "raise the setpoint + unplug ethernet" hack with an automated, **fail-safe** relay that gates
the miners' network (= the heat lever), driven by the **Pi's own GPIO**. Fans stay always-on for cooling +
circulation. Design rationale: `CLAUDE.md § Active initiative` and `§ Vision`.

**Fail-safe contract (non-negotiable):** the resting AND any-failure state is *miners offline, fans running, no heat.*

## Bill of materials

| Item | Spec / why | ~Price |
|---|---|---|
| **Opto-isolated relay, 3.3V high-level trigger (active-HIGH), 1ch** | De-energized = OFF = miners offline = safe. 3.3V-native, optocoupler isolates the Pi GPIO. **Already owned** — Teyleten Robot 1ch 3V/3.3V high-level module (×5, Dec 2023). | $0 (have) |
| *(tidier alt)* Raspberry Pi relay HAT | e.g. Waveshare / SB Components RPi Relay Board — sits on the header, 3.3V-native, screw terminals. Confirm/configure for **open-when-de-energized**. | $12–18 |
| 10kΩ resistor | pull-down GPIO→GND: defined LOW at boot and when the Pi is off | ¢ |
| DC inline splice / barrel pigtail | to route the TP-Link's power lead through the relay | $5 |

### Relay — you already have the right one ✅
The **Teyleten Robot DC 1-Channel Optocoupler 3V/3.3V High-Level Driver Module** (×5, purchased Dec 2023) is
exactly the part — no purchase needed. It checks every box:
- **1 channel · opto-isolated** (protects the Pi GPIO)
- **3V/3.3V** → the Pi's 3.3V drives both the trigger logic *and* the relay coil — no separate 5V, no level-shift
- **High-level trigger (active-HIGH)** → de-energized / no-signal = contact open = miners offline = the fail-safe resting state

Contrast (why this one's right): the common blue `SRD-05VDC-SL-C` boards are **active-LOW with a 5V coil** —
backwards for a fail-safe cutoff (can energize at boot when the pin floats; 5V coil marginal off 3.3V). Keep those
for non-safety jobs; the Teyleten high-level module is the correct call for the heat lever.

## Wiring

- **GPIO:** a **boot-LOW** BCM pin (the GPIO9–27 bank has boot pull-downs) — use **GPIO26 (header pin 37)**. Add the **10kΩ pin→GND** as a hard pull-down so it's LOW during the boot window and whenever the Pi is off.
- **Relay input:** `VCC`→3.3V (or 5V per module spec), `GND`→Pi GND, `IN`→GPIO26.
- **Contacts:** route the TP-Link's **DC positive lead** through **COM → NO** (normally-open). De-energized → NO open → switch unpowered → both miners offline.
- **Check first:** read the TP-Link adapter label for V/polarity before splicing (likely 5V/9V/12V @ <1A — trivial for any relay).

Fail-safe truth table:

| Pi GPIO26 | coil | COM–NO | TP-Link | miners | heat |
|---|---|---|---|---|---|
| LOW / floating / Pi off | de-energized | **open** | off | offline | **none (safe)** |
| HIGH (Pi asserts heat) | energized | closed | on | online | possible |

## Software (server runs as root → GPIO access is fine)

1. **GPIO service** — `server/src/services/heaterRelay.ts` using the `onoff` package:
   - initialize the pin **LOW (safe)** on boot; export `connectMiners()` / `disconnectMiners()`.
   - register `process.on('exit'|'SIGINT'|'SIGTERM')` → set LOW (clean shutdown ⇒ miners offline).
2. **Mode** — add `mode: 'HEAT' | 'FAN' | 'OFF'` to the zone/thermostat model + a `PUT` route + a UI control.
3. **Re-point control** in `zone/actions.ts::compareZoneThermostatAndThermometer`:
   - **circuit/fans** (existing `heaterPinVal` → cab relay): ON when `mode ∈ {HEAT, FAN}`, OFF when `mode==OFF`.
   - **heat lever** (new GPIO relay): `connectMiners()` only when `mode==HEAT && belowMin(hysteresis) && sensorFresh && heartbeatOK`; otherwise `disconnectMiners()`.
4. **Dead-man watchdog** — a NEW `setInterval` (~5s; the one timer we deliberately add back, for safety): if the newest thermometer `updatedAt` is older than `STALE_MS` (start at 60s) **OR** `mode != HEAT` → force `disconnectMiners()`. This closes the event-driven gap: when sensor events stop, the watchdog still acts.
5. **(robustness) Pi hardware watchdog** — enable `/dev/watchdog` (systemd `RuntimeWatchdogSec=15`) so a hung-but-powered Pi reboots → GPIO drops → relay opens → safe. Closes the "process alive but wedged, holding the relay closed" residual.

## Commissioning — do this BEFORE trusting it with ~6 kW

1. **Bench, no miners:** toggle GPIO26; relay clicks; multimeter on COM–NO matches the truth table.
2. **Fail-safe boot:** reboot the Pi — confirm COM–NO stays **open through the entire boot** (no glitch closes it). Power Pi off — confirm open.
3. **Inline, miners live:** splice into the TP-Link DC. Open the relay → both miners drop the pool / stop hashing; close → hashing resumes in ~10–30 s. Confirm **fans never interrupt**.
4. **Dead-man:** mode=HEAT, heat calling → power off the sensor ESP32 → watchdog disconnects within `STALE_MS`.
5. **Modes:** HEAT hashes to setpoint; FAN runs fans and never hashes; OFF everything down.
6. Only after all pass → enable on the live system.

## Out of scope for Phase 1 (later)
Per-miner / per-zone heat (one relay per miner ethernet); BOS+ S19 power-target modulation; sats-vs-kWh metering.
