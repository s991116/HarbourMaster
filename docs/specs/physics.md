# Physics engine

**Status:** `active`  
**Source:** `src/physics/`, `src/simulator/controller.ts`

## Purpose

Realistic 2D boat physics for harbour training without a general-purpose game engine. Top-down plane: position `(x,y)`, heading, velocity, and angular velocity.

## Architecture

```text
PhysicsInput (throttle, rudderAngle)
    → PhysicsEngine.step(dt)
        → propeller, rudder, wind, water drag
        → integration (force/mass, torque/inertia)
        → collision resolution
    → PhysicsSnapshot
```

`SimulatorController` runs a **fixed timestep** of `1/60` s with an accumulator; `SimulationLoop` calls `tick(frameDt)` with `frameDt` capped at 0.05 s.

## Forces and torque (per step)

| Contribution | Module | Note |
|--------------|--------|------|
| Propeller + prop walk | `propellerModel.ts` | Reverse time tracked for prop walk |
| Rudder | `rudderModel.ts` | Angle clamped via `clampRudderAngle` |
| Wind | `windModel.ts` | From scenario/controller `Wind` |
| Water resistance | `waterResistanceModel.ts` | Direction-dependent drag + angular damping |
| Collision | `collisionModel.ts` | Convex hull vs AABB quay/obstacles + bounds |

Total force and torque are integrated explicitly (Euler). Mass = `BoatConfig.displacement`, rotation = `turningInertia`.

## Input limits

- `throttle` clamped to `[-1, 1]` in the engine.
- Reverse detected when `throttle < -0.02`; `reverseTime` resets when switching to/from astern.
- With neutral controls (`|throttle|`, `|rudder| < 0.02`) and low `angularVelocity`, angular velocity is set to 0 (avoids drift).

## Speed

- **STW** (speed through water): speed along boat axis (local forward).
- **SOG** (speed over ground): `|velocity|` in world space.

Exposed in `PhysicsSnapshot`.

## Collision

- Hull: convex polygon from `boatHullProfile` (half-length, beam profile).
- Obstacles: rotated AABB (`StaticObstacle`), typically `quay`.
- `HULL_SKIN` margin; up to `MAX_ITERATIONS` separation.
- Harbour `bounds` limit position.

Changes to hull shape or penetration must preserve “no tunneling through quay” at normal speeds.

## Boat configuration

- Presets: `boatPresets.ts` (`FIN_KEEL_BOAT`, `LONG_KEEL_BOAT`).
- Scenario selects preset on **scenario change**; `simulatorStore` can update `boatConfig` at runtime via the Settings popup (must stay consistent with hull profile).
- **Scenario reset (R)** restores position and scenario wind but keeps the current `boatConfig` and other Settings values.
- Default directional drag (both presets): `dragAhead` 175, `dragAstern` 400, `dragSideways` 1000 — see `waterResistanceModel.ts`.

## Acceptance criteria

- [ ] Sim loop: when `running === false`, state does not update (snapshot frozen).
- [ ] When `running === true`, 60 Hz physics steps regardless of frame rate (within accumulator).
- [ ] Throttle/rudder from store mapped to `PhysicsInput` each tick.
- [ ] Quay collision reduces penetration without abnormal “hopping” at low speed.
- [ ] Prop walk is noticeable astern, especially after brief time in reverse (`reverseTime`).
- [ ] Boat comes to rest over time with neutral throttle and rudder (drag + neutral angular zeroing).

## Out of scope (for now)

- Mooring line tension / moored boat.
- Physics waves, current, depth (procedural **water ripples** in the renderer are visual only — see [rendering.md](rendering.md)).
- Scenario-specific layout (see future builder).
