# HarbourMaster

Browser-based **Harbour Manoeuvre Trainer** for practising harbour manoeuvres with sailboats.

The simulator is 2D top-down and models realistic boat behaviour via a custom physics engine in TypeScript — no general-purpose game physics engines.

## Tech stack

- React + TypeScript
- Three.js + React Three Fiber (top-down renderer)
- Zustand (state)
- Tailwind CSS (UI)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Map editor:** [http://localhost:5173/#editor](http://localhost:5173/#editor) — paint tile-based harbour layouts (see [docs/specs/scenarios.md](docs/specs/scenarios.md)).

## Controls

| Key | Action |
|-----|--------|
| ↑ | Throttle ahead |
| ↓ | Throttle astern |
| ← | Rudder port |
| → | Rudder starboard |
| Space | Neutral |
| R | Reset scenario |

Virtual slider controls are also available in the UI. Wind direction and speed are set in the **Wind** panel (direction snaps to 15° steps). **Scenario** and **Settings** open popup dialogs; Settings exposes boat physics and water-ripple tuning. Toggle **north-up** / **heading-up** view with the icon at the top-right of the basin.

## Scenarios (MVP)

1. **Empty basin** — learn speed and inertia
2. **Berthing alongside** — smooth alongside landing
3. **Departure in crosswind** — wind and prop walk
4. **Narrow berth** — manoeuvring between boats

## Documentation (spec-driven)

- [AGENTS.md](AGENTS.md) — index for specs, skills, and workflows
- [docs/specs/](docs/specs/) — behaviour contracts (physics, controls, rendering, cleats, deployment)

Scenarios are still defined in code (`src/simulator/scenarios.ts`); a dedicated scenario spec or builder may come later.

## Architecture

```text
React UI
    │
    ▼
Simulator Controller
    │
    ▼
Physics Engine
    ├── Boat Model
    ├── Rudder Model
    ├── Propeller Model (+ prop walk)
    ├── Wind Model
    ├── Water Resistance Model
    └── Collision Model
    │
    ▼
Three.js Renderer
```

## Physics (summary)

Each frame computes:

```text
F_total = F_propeller + F_rudder + F_wind + F_water_drag
T_total = T_rudder + T_prop_walk + T_wind + angular_damping
```

Drag is direction-dependent with separate coefficients for ahead, astern, and sideways motion (port/starboard equal). Each axis uses quadratic hydrodynamic drag plus a linear viscous term so the boat comes to rest naturally.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run preview  # preview build
```

## GitHub

Create a new repo named `HarbourMaster` and push:

```bash
git init
git add .
git commit -m "Initial Harbour Manoeuvre Trainer MVP"
gh repo create HarbourMaster --public --source=. --remote=origin --push
```

(Use `--private` if you prefer a private repo.)
