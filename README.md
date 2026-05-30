# HarbourMaster

Browserbaseret **Harbour Manoeuvre Trainer** til træning af havnemanøvrer for motorbåde.

Simulatoren er 2D top-down og modellerer realistisk bådadfærd via en egenudviklet fysikmotor i TypeScript — uden generelle game physics engines.

## Tech stack

- React + TypeScript
- Three.js + React Three Fiber (top-down renderer)
- Zustand (state)
- Tailwind CSS (UI)

## Kom i gang

```bash
npm install
npm run dev
```

Åbn [http://localhost:5173](http://localhost:5173).

## Kontroller

| Tast | Handling |
|------|----------|
| ↑ | Gas frem |
| ↓ | Gas bak |
| ← | Ror bagbord |
| → | Ror styrbord |
| Mellemrum | Neutral |
| R | Nulstil scenarie |

Der findes også virtuelle skyderkontroller i UI'et.

## Scenarier (MVP)

1. **Tomt bassin** — lær fart og inerti
2. **Tillægning langs kaj** — blød tillægning
3. **Fralægning i sidevind** — vind og prop walk
4. **Smal havneplads** — manøvrering mellem både

## Arkitektur

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

## Fysik (kort)

Ved hver frame beregnes:

```text
F_total = F_propeller + F_rudder + F_wind + F_water_drag
T_total = T_rudder + T_prop_walk + T_wind + angular_damping
```

Modstand er retningsafhængig (lav fremad, høj sideværts). Bakgear har særskilt ror- og prop walk-model. Vind skalerer med vindstyrke².

## Scripts

```bash
npm run dev      # udvikling
npm run build    # produktionsbuild
npm run preview  # forhåndsvis build
```

## GitHub

Opret et nyt repo med navnet `HarbourMaster` og push:

```bash
git init
git add .
git commit -m "Initial Harbour Manoeuvre Trainer MVP"
gh repo create HarbourMaster --public --source=. --remote=origin --push
```

(Erstat med `--private` hvis du foretrækker et privat repo.)
