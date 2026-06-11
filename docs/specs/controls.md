# Controls and input

**Status:** `active`  
**Source:** `src/hooks/useKeyboardControls.ts`, `src/controls/controlSteps.ts`, `src/store/simulatorStore.ts`, UI panels

## Purpose

The user controls throttle and rudder in **discrete steps** (realistic lever “clicks”), with parallel UI (sliders) and keyboard. Wind can be adjusted in settings independently of scenario start (via store).

## Simulation state

| State | Behaviour |
|-------|-----------|
| Paused (`running === false`) | Physics does not run; snapshot frozen |
| Running | `resume()` / start — `tick` runs |
| After scenario change | Always paused; throttle/rudder reset |

**Enter** resumes when paused (`useKeyboardControls`).

## Keyboard

| Key | Action |
|-----|--------|
| ↑ | Throttle ahead (+1 step) |
| ↓ | Throttle astern (−1 step) |
| ← | Rudder port (−1 step) |
| → | Rudder starboard (+1 step) |
| Space | Neutral (throttle + rudder step 0) |
| R / r | `resetScenario()` — reloads current scenario |
| Enter | Resume when paused |

`event.repeat` is ignored (one step per key press).

## Steps → physics

Defined in `controlSteps.ts`:

| Parameter | Max step | Physics value |
|-----------|----------|---------------|
| Throttle | ±4 (`MAX_THROTTLE_STEP`) | `step / 4` → [-1, 1] |
| Rudder | ±5 (`MAX_RUDDER_STEP`) | linear to ±`MAX_RUDDER_ANGLE` (0.52 rad) |

Store holds `throttleStep`, `rudderStep`, and derived `input: PhysicsInput`.

## Wind (UI)

- Direction: snap to 15° (`WIND_DIRECTION_STEP`).
- Speed: 0–40 kn (`MAX_WIND_SPEED_KNOTS`), integer knob.
- kn ↔ m/s via `KNOTS_TO_MS` / `windSpeedKnotsToMs`.

Wind in store updates `SimulatorController.setWind` without necessarily resetting boat position.

## Touch / mobile

- `MobileControlOverlay`, `TouchSlider` — same step semantics as keyboard where possible.
- `useLandscapeLayout` affects panel layout, not physics.

## Acceptance criteria

- [ ] Arrow keys only change steps within max; UI shows consistent labels (`formatThrottleStep` / `formatRudderStep`).
- [ ] Space sets both steps to 0 and neutral `PhysicsInput`.
- [ ] R resets boat position and wind to scenario defaults; throttle/rudder steps reset to neutral. Settings-panel values (boat config, water ripples, collision hull overlay) are unchanged.
- [ ] Paused: no position change on arrow keys (resume only with Enter).
- [ ] Scenario selector stops sim and resets controls.

## Related

- Physics integration: [physics.md](physics.md)
- Scenario list: `src/simulator/scenarios.ts` (no spec yet)
