---
name: tune-physics
description: >-
  Adjust boat physics, drag, propeller, rudder, wind, or collision. Use when
  editing src/physics/ or changing boat behaviour in the simulator.
---

# Tune physics

## Before you start

1. Read [docs/specs/physics.md](../../../docs/specs/physics.md).
2. Identify which model file owns the behaviour (`propellerModel`, `rudderModel`, `windModel`, `waterResistanceModel`, `collisionModel`, `boatPresets`).

## Steps

1. Reproduce in dev: `npm run dev`, scenario that stresses the change (e.g. astern for prop walk).
2. Change parameters in the relevant model or preset — keep units consistent (SI in engine).
3. If hull shape or length/beam changes, verify `collisionModel` and `boatMooringCleats` still align ([mooring-cleats spec](../../../docs/specs/mooring-cleats.md)).
4. Run through acceptance criteria in `physics.md` mentally or in PR description.
5. Update `docs/specs/physics.md` if behaviour contract changed (not just tuning within existing criteria).

## Do not

- Change `fixedDt` or accumulator loop without updating spec + `SimulatorController`.
- Add dependencies on Three.js inside `src/physics/`.
