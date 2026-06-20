# raspi-home-server

DIY climate control for a forced-air home system where the **heat source is Bitcoin miners** (ASICs).
A Raspberry Pi orchestrates; ESP32 edge nodes sense temperature and switch the heat/airflow. The miners'
waste heat is ducted into the house. When the miners' internet is cut they idle and the system is run as a
**fan to circulate AC** — see "Active initiative" below.

> Personal project, solo developer. Direct dev (no MR/approval gates). Repo: `github.com/sjfcodes/raspi-home-server`.

## Vision & design priorities

Recycle Bitcoin miners (2× Antminer S19, each with its own inline duct-fan cooler, on Braiins OS) as the heat source for a forced-air home,
**earning sats from electricity that would be spent heating anyway.** A miner is a ~100%-efficient resistive
heater (every watt → heat, same warmth/watt as a space heater) that also mines — so the sats are pure upside on
heat you'd buy regardless. This is the thesis; it holds.

Priorities, in order (a later one never overrides an earlier one):
1. **Safe** — protects expensive hardware. Fail-safe by construction: the resting AND any-failure state is always "no heat, fans running." See the safety model in the Active initiative below.
2. **Robust** — survives sensor dropouts, network loss, and Pi reboots with no unsafe states and no hardware stress (never cold-boot-cycle the S9s).
3. **Efficient (the thesis)** — never heat without hashing; never hash into the AC; control tightly to demand; and **measure sats earned vs kWh cost** (the whole point — can't optimize what isn't measured).

**Hardware:** 2× Antminer S19 (~3 kW each → ~6 kW / ~25 A @ 240 V total) — modern, efficient miners, so sat yield per kWh is solid (not the old-S9 "mostly heat" case). The ~6 kW is real central-heating capacity; mining earnings are a genuine offset against the power bill.

## Topology

```
Sensor ESP32  ──POST /api/temperature (every 1s)──>  Pi server (Express :3000)
  postTemperatureJson.ino                                │
                                                         │  zone/actions.ts (event-driven):
                                                         │  on each temp update, per zone:
                                                         │    FORCE_OFF/ON override (auto-expires), else
                                                         │    tempF < min → ON, tempF > max+1 → OFF (hysteresis)
                                                         │
Relay/heater-cab ESP32  <──WebSocket :3001 (/heater-cab-0)──┘  pushes heaterPinVal (1/0); switches the miners
  (firmware NOT in this repo — see Gaps)                       reports cabTempF/cabHumidity/heaterPinVal every 5s

Browser UI (React+Vite :5173)  <──SSE──  live state (Jotai atoms mirror each store)
```

All HTTP/WS is plaintext over the LAN WiFi. No transport security; LAN is the trust boundary.

## Branches (important)

- **`repo-structure`** — the **live, proven-through-winter system**. This is the source of truth. Currently checked out and running on the Pi.
- `main` — older implementation (single hardcoded "home" cron, `service/esp32/*`). Reference only; do not develop here.
- Other branches (`typescript`, `use-sse`) are historical.

## Repo layout (monorepo)

- `client/` — React + Vite + TypeScript UI; Jotai atoms (`store/*.atom.ts`) mirror server state via SSE
- `server/` — Express + TypeScript backend; **component architecture** (see below); Jest tests
- `esp32/` — Arduino firmware: `postTemperatureJson` (sensor), `httpGetJson`/`readChipInfo` (scaffolds). NOTE: the WebSocket relay firmware that actually switches the miners is NOT here.
- `constant/constant.ts` — shared constants (Pi IP/ports, HEATER_OVERRIDE_STATUS)
- `types/main.d.ts` — shared domain types (Zone, Heater, Thermostat, Thermometer, ...)

## Backend architecture (`server/src`)

Component pattern — each domain is `controller / model / router / store` (+ tests), scaffold new ones from `api/components/_template/`:

- `components/zone/actions.ts` — **the control logic** and single decision point. `onThermometerUpdate` / `onThermostatUpdate` → `compareZoneThermostatAndThermometer(zone)`. Control is **event-driven off sensor POSTs**, not a polling loop.
- `components/heater/` — heater state store + `wss.ts` (WebSocket to the relay cab) + `handleHeaterMessageOut`
- `components/thermometer/` — receives sensor temps (`POST /api/temperature` and `/api/v1/thermometer`)
- `components/thermostat/` — per-zone min/max + `heaterOverride` (FORCE_ON/OFF with `expireAt`)
- `components/system/` — Pi CPU temp / system info; the only `setInterval` (system poller, NOT the heater loop)
- `services/auth/strategies/jwt.ts` — JWT auth (in progress; endpoints not yet protected)
- `lib`/`services` — SSE stream, logger, redis (present but unused — commented out in `index.ts`)

A **zone** binds 1 thermometer + 1 thermostat + 1 heater. `zone/actions.ts` is where mode/fan logic belongs.

## Devices (from `server/src/config/globals.ts`)

- Zones: `home`, `office`
- Heater (relay cab): `HOME = d0fc8ad4`
- Thermometers: `home = 9efc8ad4`, `office = abe342a8`
- WS channel: `/heater-cab-0`
- Pi: `192.168.68.142`, server `:3000`, WS `:3001`, Vite `:5173`

## Run / ops

- Process manager: **pm2** via `pm2.config.js` (apps: `client`, `server`). Started with **`sudo pm2`** → the real processes run under the **root** pm2 daemon (`sudo pm2 list`), not the user one (which has stale ghost entries).
- Scripts (repo root `package.json`): `npm run start` (production), `npm run dev`, `npm run stop`, `npm run restart`, `npm run logs`, `npm run save` (persist pm2 across reboot).
- Logs: `sudo pm2 logs server`.

## Active initiative: FAN/HEAT/OFF modes + fail-safe heat lever

**Hardware reality (confirmed 2026-06):**
- The `heaterPinVal` relay (heater-cab ESP32) switches the **240V miner+fan circuit** — both S19s and their duct fans share one switched circuit and **never switch independently.** Deliberate safety interlock: **each S19's only cooling is its own 6" inline duct fan** (stock screamer fans removed; rigs run Braiins OS), so airflow must exist whenever a miner is powered. **Hard invariant: never a state where a miner is energized but its paired fan isn't.**
- Because the relay is all-or-nothing, it can't deliver "air without heat." The real heat lever is **whether the miners hash**, gated today by **physically unplugging the miners' ethernet** (no pool → S19s stop hashing → near-idle, minimal heat, still powered + cooled — a soft stop, NOT a power cycle: resuming takes ~10–30 s to re-handshake the pool, never a cold boot). The automated lever is a relay on that ethernet uplink (fail-safe, below). *(BOS+ on the S19 may expose power-target/pause control via API — evaluate later as a finer efficiency lever; the ethernet relay stays the safety backbone regardless.)*
- Current manual fan-hack: raise the thermostat setpoint to force a heat-call (relay closes → circuit on → fans run), then unplug ethernet to kill the heat.

**Planned design (fail-safe, to build):**
- **Fans/circuit:** stay energized for circulation + cooling — a dumb, always-on baseline software can't break.
- **Heat lever:** a **normally-open relay on the miners' ethernet uplink** (power-gate a small unmanaged switch in the miners' path), driven by the **Pi's own GPIO** — local dead-man, so heat-safety does NOT depend on the WiFi/WS link to the cab. Default / boot / crash / power-loss → contact open → miners offline → no heat; fans unaffected. The Pi must *actively + healthily* assert "connect" (fresh sensor reading + live heartbeat) to allow hashing. This unifies the heat-on gate with the silent-sensor dead-man — one lever, both problems.
- **Modes** (add `mode: HEAT | FAN | OFF`, branch at the top of `zone/actions.ts::compareZoneThermostatAndThermometer`): HEAT = ethernet relay follows the existing thermostat hysteresis (S9s start/stop hashing, never cold-boot); FAN = ethernet forced open, fans on (circulate AC); OFF = ethernet open, optionally drop the circuit.
- **Network (confirmed):** ISP hardline → a **4-port TP-Link switch** (its own small DC supply) → **2 miner ethernets out**; nothing else is on it (Pi + ESP32s are on WiFi). So we **gate that switch's own DC barrel jack** — no extra switch to buy. Relay open (default) → switch dark → both miners offline → no heat; Pi + sensors on WiFi keep running.
- **Parts (Amazon):** just an opto-isolated 3.3V relay module (or a Pi relay HAT). Splice the TP-Link's DC power lead through the relay **NO** contact, driven by a Pi GPIO that boots LOW.

**Settled:** kill-relay driven by the **Pi's GPIO** — local dead-man, fully autonomous, no runtime dependence on any external service or operator. One relay gates both miners = whole-house heat on/off (matches the single-heater model). Per-miner / per-zone heat would need one relay per miner ethernet — a later refinement.

## Known gaps / TODO

- **[security] WiFi SSID + password are hardcoded** in `esp32/postTemperatureJson.ino` and committed to git history. Rotate the WiFi password; move creds to an uncommitted `arduino_secrets.h`.
- **[safety] No dead-man for a silent sensor.** Control is event-driven; if the sensor ESP32 goes offline while the heat source is ON, nothing re-evaluates and it holds ON. Mitigation belongs both server-side (staleness timeout → fail-safe OFF) and on the relay ESP32 (auto-OFF if it stops hearing from the Pi).
- **[safety] Relay/heater-cab firmware is not version-controlled here** — the most safety-critical device (switches kW of miner). Its failsafe behavior is unverified. Get it into `esp32/`.
- **[security] Endpoints are unauthenticated** on the LAN (`POST /api/temperature`, thermostat target writes). JWT strategy exists but isn't enforced.
- **[correctness] `currTemp` NaN at cold start** when no sensor reading yet; firmware temp math uses a single raw sample (averaging computed then discarded) and a 10-bit (`/1023`) scale on a 12-bit ESP32 ADC.
- **[cleanup] Stale ghost pm2 entries** in the user-level daemon (`raspi`, `raspi - Only Commands`).

## Working with this project (for Tilda)

- SSH alias `pi` → `sjfox@192.168.68.142` (key auth). Repo at `/home/sjfox/code/raspi-home-server`.
- This is the **runtime host**; edits land here. Verify the running branch is `repo-structure` before changing code.
- After server changes: `npm run restart` (or `sudo pm2 restart server`) and watch `sudo pm2 logs server`.
- Heat source is physical and kilowatt-class — prefer the slower, safer path on any control-loop change; never ship a path that can leave the heat source ON without a working thermostat.
