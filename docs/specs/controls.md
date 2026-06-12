# Controls and input

**Status:** `active`  
**Source:** `src/hooks/useKeyboardControls.ts`, `src/controls/controlSteps.ts`, `src/store/simulatorStore.ts`, `src/components/HarbourPanelsChrome.tsx`, harbour UI panels

## Purpose

The user controls throttle and rudder in **discrete steps** (realistic lever “clicks”), with parallel UI (sliders) and keyboard. Wind is adjusted in the always-open **Wind** panel. Boat physics, water-ripple visuals, and display flags are edited in the **Settings** popup.

## Simulation state

| State | Behaviour |
|-------|-----------|
| Paused (`running === false`) | Physics does not run; snapshot frozen |
| Running | `resume()` / start — `tick` runs |
| After scenario change | Always paused; throttle/rudder reset; `boatConfig` and wind reset to new scenario defaults |
| After scenario reset (R) | Position and wind reset; throttle/rudder neutral; Settings values (`boatConfig`, max rudder angle, water ripples, collision hull) unchanged |

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
| Rudder | ±5 (`MAX_RUDDER_STEP`) | linear to ±max angle from Settings (`maxRudderAngleDegrees`, 5°–~29.8°, default full deflection) |

Store holds `throttleStep`, `rudderStep`, and derived `input: PhysicsInput`.

## Wind (UI)

- Direction: snap to 15° (`WIND_DIRECTION_STEP`).
- Speed: 0–40 kn (`MAX_WIND_SPEED_KNOTS`), integer knob.
- kn ↔ m/s via `KNOTS_TO_MS` / `windSpeedKnotsToMs`.

Wind in store updates `SimulatorController.setWind` without necessarily resetting boat position.

## Harbour UI chrome

Layout mode from `useHarbourLayoutMode` — see [rendering.md](rendering.md).

| UI | Type | Content |
|----|------|---------|
| **Scenario** | Popup (`HarbourPopupButton`) | Scenario select, reset (R) |
| **Settings** | Popup | Max rudder angle (degrees), `BoatConfig` fields, collision-hull toggle, water-ripple shader parameters (`waterRippleSettingsStore`) |
| **Wind** | Open panel (same frame as Controls) | Direction dial (15° steps), speed slider |
| **Controls** | Open panel | Engine and rudder sliders |

Popup dialogs share `HarbourPopupWindow` (backdrop, title bar, Escape to close).

## Touch / mobile

- `MobileControlOverlay`, `TouchSlider` — same step semantics as keyboard where possible.
- `useHarbourLayoutMode` affects panel layout, not physics.

## Acceptance criteria

- [ ] Arrow keys only change steps within max; UI shows consistent labels (`formatThrottleStep` / `formatRudderStep`).
- [ ] Space sets both steps to 0 and neutral `PhysicsInput`.
- [ ] R resets boat position and wind to scenario defaults; throttle/rudder steps reset to neutral. Settings-panel values (boat config, max rudder angle, water ripples, collision hull overlay) are unchanged.
- [ ] Paused: no position change on arrow keys (resume only with Enter).
- [ ] Scenario selector stops sim, resets controls, and loads the selected scenario preset.

## Related

- Physics integration: [physics.md](physics.md)
- Scenario list: `src/simulator/scenarios.ts` (no spec yet)
