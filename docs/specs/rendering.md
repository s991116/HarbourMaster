# Rendering and viewport

**Status:** `active`  
**Source:** `src/components/BasinViewport.tsx`, `src/harbour/basinDisplay.ts`, `src/components/HarbourScene.tsx`, `src/components/WaterSurface.tsx`, `src/hooks/useHarbourLayoutMode.ts`, R3F

## Purpose

Top-down view of the harbour basin and boat. **One world coordinate system** is shared between physics and display (planar x/y). UI overlays (cleats, collision hull) project to screen via display metrics.

## Coordinate system

- Physics/world: x east, y north (convention in obstacles/scenarios).
- Boat-local (cleats/hull): bow +Y, port −X — see [mooring-cleats.md](mooring-cleats.md).
- Screen: `worldToScreenPixels` in `basinDisplay.ts` maps world points using `pixelsPerWorldUnit`, `viewCenter`, and optional heading-up rotation (`applyHeadingUpWorldOffset`).

## Basin fit

- `BASIN_VIEW_FIT_MARGIN = 0.92` — margin around bounds.
- `orthographicZoomForBounds` / `pixelsPerWorldUnitForFit` scale from the active scenario’s `HarbourBounds`.
- `basinDisplayStore` / `BasinCameraFit` keep canvas size, zoom, and view metrics in sync on resize.
- `basinDisplayStore.viewMode`: `north-up` (default) or `heading-up` (boat bow up, camera centred on boat).

## View orientation

Toggle via `BasinViewModeToggle` (top-right of basin viewport).

| Mode | Camera centre | Scene |
|------|---------------|-------|
| `north-up` | Basin bounds centre | Fixed north |
| `heading-up` | Boat position | `BasinViewPivot` rotates scene so bow points up |

`BasinCameraFit` moves the orthographic camera with `viewCenter`. HTML overlays use the same transform via `worldToScreenPixels` so cleats and hull outlines stay aligned in both modes.

## Water surface

`WaterSurface.tsx` renders a shader plane with procedural ripples:

- Calm isotropic pattern at 0 kt wind.
- Wind-driven streaks when `wind.speed > 0`; drift scales with full wind speed; visual intensity caps at 20 kt.
- Tunable parameters in `waterRippleSettingsStore` (edited via Settings popup).

Visual only — no effect on physics (see [physics.md](physics.md) out of scope).

## Layers

| Layer | Technology | Content |
|-------|------------|---------|
| 3D scene | R3F (`HarbourScene`, `BoatMesh`, `WaterSurface`, quay) | Boat, obstacles, water, environment |
| HTML overlays | Absolute over canvas | Cleats, collision hull outline, pause, view-mode toggle |
| Chrome | Tailwind panels | Scenario/Settings popups, Wind and Controls panels — see [controls.md](controls.md) |

`SimulationLoop` is an empty R3F child that only drives `tick`.

## Pause

- `PauseOverlay` in basin scope when `running === false`.
- Enter / UI resume — see [controls.md](controls.md).

## Landscape / layout

- `useHarbourLayoutMode`: `portrait`, `landscape-sidebar` (wide landscape), or `landscape-compact` (small phone: landscape with `max-height: 520px`, or portrait with `max-width: 520px`).
- **Portrait (tablet / wide):** header stack (scenario, settings, wind, controls) above basin.
- **Landscape sidebar:** basin beside a left sidebar; controls at bottom of sidebar.
- **Compact:** scenario and settings side by side on top; basin full width in the middle with no side chrome; wind bottom-left and controls bottom-right on one row (`items-end`).
- Basin `flex-1` fills available space; `min-h-0` for correct scroll/flex.

## Acceptance criteria

- [ ] On resize, zoom is recomputed so full `bounds` are visible (with margin).
- [ ] Boat rotation in scene matches `BoatState.heading` from snapshot.
- [ ] Overlays using `worldToScreenPixels` align with 3D boat position at any zoom and in both view modes.
- [ ] In `heading-up` mode, boat stays centred on screen; bow points up.
- [ ] `frameDt` cap 0.05 s in `SimulationLoop` prevents physics spikes on tab switch.
- [ ] Water ripples respond to wind speed/direction; visual intensity does not increase above 20 kt.

## Related

- Cleat overlays: [mooring-cleats.md](mooring-cleats.md)
