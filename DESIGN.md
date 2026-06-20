# DESIGN.md — the heat harness

North-star design for what `raspi-home-server` grows into: a personal **tech harness around recycled Bitcoin
miners used as heaters**, deployed across a **trust network** (friends & family), managed from custom software.
The home rig in this repo is **node zero**.

> **Scope guardrails (read first).** This is a **personal, for-fun** project, **not** a business for strangers
> and **not** a marketplace. Friends & family only, built on trust. Keep it small, honest, and safe. Decisions
> here optimize for *simpler · cheaper · safer*, in that spirit.

## 1. The thesis

A Bitcoin miner is a **~100%-efficient resistive heater** — every watt becomes heat, same warmth/watt as a space
heater — that *also* mines. So the heat is real, and the sats are a byproduct of heat someone wanted anyway.

- **Host** (friend/family) gets comfortable, controllable, economical heat; **pays the electricity** (which all
  becomes heat).
- **Operator** (you) provides the recycled hardware + software and **keeps the Bitcoin**.
- **Heat = hash.** When the host calls for heat, the miner hashes; when they're warm, it idles. You harvest sats
  as the byproduct of the heat they asked for — never by overriding their comfort.

### Honest economics (say this plainly — it keeps a trust network trusting)
- A rational host gets the *same* heat from a $30 space heater for the *same* power. The product's real edge is
  **control + transparency + fleet software**, not free Bitcoin.
- It's a genuine **savings** story vs electric-resistance heat, or vs overheating a whole house (zone + schedule).
  Vs cheap **gas** central heat it's **comfort + novelty, not a lower bill** — say so.
- S9 sat revenue per unit is small and swings hard with BTC price / difficulty. This is a many-small-units,
  for-funsies passive shape, not a profit engine.

## 2. Hardware tiers

| Build | Miner | Power | Role |
|---|---|---|---|
| **Home (node zero)** | Antminer **S19** ×2 | 240V / ~6 kW | your own rig — see `CLAUDE.md` |
| **Remote fleet** | Antminer **S9** | **120V** (standard outlet) | deployable in any friend's home, space-heater-class |

S9 on 120V is the right remote form factor: plugs into a normal outlet, ~1.3 kW (space-heater-class), and your
**quiet fan mod** (stock screamers removed) makes it livable in someone's home.

## 3. Architecture — three tiers

```
EDGE (each home)               CONTROL PLANE (your harness)        FRONT-ENDS
──────────────────             ────────────────────────────        ─────────────────────
N× miner (safe switching)      MQTT broker (TLS, dial-IN)          Host PWA  (scoped: their
 + controller (ESP32):    ───► fleet state + history          ───► units only — comfort,
  • local thermostat loop      remote control / OTA / alerts        schedule, measured cost)
  • fail-safe (no cloud dep)   mining: all units → your pool       Operator console (all homes,
  • power metering (kWh)       + wallet; per-home attribution      health, mining, earnings)
  • dials OUT to broker
```

### LAN → WAN (the key shift from node zero)
Your home is all-LAN. Friends' homes are **remote, behind their routers**. So edge nodes **dial *out*** to a
broker you host — **nothing inbound** on a friend's network (no port-forwarding, no NAT spelunking). MQTT-over-TLS
is the fit: each node is an outbound client; the broker's **last-will** message tells you the instant one drops.

### Edge node = brain + lever (local, fail-safe)
The control loop lives **on the ESP32**, not in the cloud — like a real thermostat. It reads room temp from a
**digital sensor** (DS18B20 / SHT31, not noisy analog), runs hysteresis + mode + schedule locally, drives the
heat lever, and **keeps regulating safely if WiFi or the broker is down.** Multiple miners per home = staged
zones from one (or few) controllers.

## 4. Control precedence (the spine)

```
safety  >  host comfort  >  operator mining
```

- **Safety** always wins: over-temp, fault, sensor-invalid, power-loss → heat off, locally, no network needed.
- **Host comfort** is the control: their thermostat/schedule decides when there's heat demand.
- **Operator mining** is the *byproduct*: the miner hashes whenever the host is heating. You never warm a host's
  home beyond what they ask for. (See §7 integrity.)

## 5. Front-ends

### Host PWA (their space, scoped to only their units)
- **Claim a device** — scan a QR on the unit → linked to their profile (repo already has a `QrCode` component).
- **Comfort** — target temp, schedule/setback, presets (Comfort / Eco / Away / Sleep), per-room zoning.
- **Budget-aware cost tracking** (the adoption hook — see §6).
- **Visibility + fun** — running/safe status, room temp, "your house made X kWh heat / Y sats this cycle."
- **Hard-off + report-a-problem** — always available, always theirs.

### Operator console (you — all homes)
Fleet view: per-home/per-unit health, temps, hashrate, uptime, earnings; remote control + safety override; OTA
firmware; alerts (down / over-temp / offline); enroll new units.

### Identity (right-sized)
Multi-tenant: accounts + a **device → owner** map + **scoped authz** (host sees only theirs; you see all).
**Magic-link auth** is plenty at friends-and-family scale (same pattern as hellotilda invite-only).

## 6. Cost tracking — kill the bill anxiety

Hosts worry heaters spike the bill. The answer is **measured, billing-cycle-aligned actual cost** they control —
not an estimate.

- **Measure, don't estimate:** a ~$10 **PZEM-004T** (or metering plug) on the ESP32 integrates **real kWh**
  (S9s draw variably idle vs hashing, so runtime × rated-watts is wrong).
- **Host inputs:** their **$/kWh** and their **billing-cycle start day**.
- **Rollups:** this cycle (running total, days left, **projected** end-of-cycle — labeled an estimate),
  plus history (past cycles, day/month, per-heater).
- **Start with a flat rate;** tiered / time-of-use is a v2 refinement, not a v1 blocker.

### One sensor, three jobs (the two-for-one)
The same power measurement gives:
1. **Host cost** — the planning view above.
2. **Operator yield** — sats per *measured* kWh (your real efficiency).
3. **Safety** — abnormal draw = a fault you catch remotely.

Same measured kWh, both sides of the ledger: they see exactly what it costs, you see exactly what it earns.

## 7. Integrity guardrails (non-negotiable)

> The host app is **their budget tool, never a nudge-them-to-heat-more tool.** You must have **zero incentive** to
> warm a host's home beyond what they ask for.

- Full transparency both sides (host cost + operator yield, both from measured kWh).
- Host always sees and can stop what's in their home.
- State the gas-vs-electric honest nuance up front.

This is "value verifiable without trust, cost visible to both sides" — the same ethos the operator's platform runs
on, pointed at heaters.

## 8. Safety model (deploying powered appliances in others' homes)

- **Fail-safe by construction:** normally-open relays; resting/any-failure state = no heat (fans/cooling intact).
- **Local regulation:** edge node stays safe with zero cloud/WiFi dependency; **ESP32 hardware watchdog** reboots a
  hung controller → relay opens → safe.
- **Heat lever = soft stop** (cut the miner's hashing — e.g. ethernet/network gate — not a 240V power-cycle that
  cold-boots the ASIC). See `BUILD.md` for the node-zero relay implementation.
- **Master cutoff:** a mechanical contactor that **fails open** (preferred over SSRs, which fail *shorted*).
- **Electrical sanity in a stranger's panel:** ~1.3 kW S9 ≈ 11A on 120V → dedicated circuit; **stagger inrush**
  across multiple units so you don't trip a 15A breaker; watch for trip patterns.
- **Over-temp cutoff**, quiet operation, host-controllable hard-off.
- Mains-side work (breaker, wire gauge, contactor install) gets a **licensed electrician** — fire is the failure
  mode.

## 9. Heat cell — physical construction

The deployable unit ("heat cell") is a **2 ft section of 10 in metal ducting** (non-combustible structural shell)
holding the S9 + fan, with components centered in the tube by **adapter plates**. Today those plates are hand-cut
3/4 in plywood — the slowest step in the build. Plan: **3D-print them** as a repeatable part set.

- **Print "centering spiders," not solid discs:** a hub that cradles the component (S9 aluminum housing, PSU
  housing) + arms reaching to the tube wall. Less filament, faster print, *better* airflow, and it sidesteps the
  bed-size problem.
- **Size:** 10 in ≈ 254 mm exceeds most printer beds. Options: the spider geometry (small hub + arms), print in
  **interlocking arc segments** that join into a ring, or a large-format printer.
- **Material by thermal zone (safety-driven):**
  - Intake / cool side → PETG or ASA.
  - Hot / exhaust side, or any adapter contacting the hot S9 housing or PSU → **ASA or polycarbonate, ideally a
    flame-retardant (UL94 V-0) grade. Never PLA** (sags ~60 °C, creeps under load near a kW heater).
  - Plywood is combustible too, but plastic adds a melt/sag failure mode — use a heat-rated/FR grade so the swap is
    a net safety *upgrade*. Account for **creep**: load-bearing/hot adapters need heat-tolerant material + generous
    wall/infill (they hold a heavy S9 + PSU).
- **Validate on node zero first:** run a printed adapter in the real hot tube for several days; inspect the hot-end
  part for sag/creep/discoloration. Better — place a temp probe at each adapter position and **measure actual air +
  contact temps**, turning the material choice from a guess into a spec.
- **Integrate while printing** (what plywood couldn't): the temp-sensor mount + PZEM current-clamp, cable
  pass-throughs, snap-fits, vibration-isolating standoffs, the QR claim-plate.
- **Fleet payoff:** design the adapter set once → print N → every unit centers identically → consistent airflow,
  thermals, control loop, and cost model across all homes.

## 10. Build order (proposed)

1. **Edge node done right** — ESP32 firmware: digital sensor, local thermostat + schedule, fail-safe, power
   metering, dial-out MQTT client. The safety-critical, reusable unit; everything plugs into it.
2. **Control plane** — hosted MQTT broker (TLS) + minimal fleet state/history + operator console.
3. **Identity + host PWA** — magic-link auth, device→owner, comfort + schedule + cost views.
4. **Mining aggregation** — pool/wallet config, per-home attribution, the "your house made X" page.

Node zero (the S19 home rig) is the proving ground for tiers 1–2 before any remote unit ships.

## 11. Open decisions
- Where the control plane lives (home Pi w/ outbound tunnel · cheap VPS · the operator's existing AWS/platform).
- Broker: self-hosted Mosquitto vs managed MQTT.
- One controller per home (cheaper) vs per-zone (more independent).
- PWA stack (the repo's React/Vite client extended, vs a fresh PWA).
- Supersedes the Pi-GPIO-relay heat-lever note in `BUILD.md` for the *fleet* case: the lever lives on the edge
  ESP32 (brain + lever co-located), not a separate Pi.
