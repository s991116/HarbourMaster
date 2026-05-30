# HarbourMaster

Browser-based **Harbour Manoeuvre Trainer** for practising harbour manoeuvres with motorboats.

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

## Controls

| Key | Action |
|-----|--------|
| ↑ | Throttle ahead |
| ↓ | Throttle astern |
| ← | Rudder port |
| → | Rudder starboard |
| Space | Neutral |
| R | Reset scenario |

Virtual slider controls are also available in the UI.

## Scenarios (MVP)

1. **Empty basin** — learn speed and inertia
2. **Berthing alongside** — smooth alongside landing
3. **Departure in crosswind** — wind and prop walk
4. **Narrow berth** — manoeuvring between boats

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

Drag is direction-dependent (low ahead, high sideways). Astern gear uses a separate rudder and prop walk model. Wind scales with wind speed².

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
