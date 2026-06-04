# Rendering and viewport

**Status:** `active`  
**Source:** `src/components/BasinViewport.tsx`, `src/harbour/basinDisplay.ts`, `src/components/HarbourScene.tsx`, R3F

## Purpose

Top-down view of the harbour basin and boat. **One world coordinate system** is shared between physics and display (planar x/y). UI overlays (cleats, collision hull) project to screen via display metrics.

## Coordinate system

- Physics/world: x east, y north (convention in obstacles/scenarios).
- Boat-local (cleats/hull): bow +Y, port −X — see [mooring-cleats.md](mooring-cleats.md).
- Screen: `worldToScreenPixels` in `basinDisplay.ts` centres on `HarbourBounds` with `pixelsPerWorldUnit`.

## Basin fit

- `BASIN_VIEW_FIT_MARGIN = 0.92` — margin around bounds.
- `orthographicZoomForBounds` / `pixelsPerWorldUnitForFit` scale from the active scenario’s `HarbourBounds`.
- `basinDisplayStore` / `BasinCameraFit` keep canvas size and zoom in sync on resize.

## Layers

| Layer | Technology | Content |
|-------|------------|---------|
| 3D scene | R3F (`HarbourScene`, `BoatMesh`, quay) | Boat, obstacles, environment |
| HTML overlays | Absolute over canvas | Cleats, collision hull outline, pause |
| Chrome | Tailwind panels | Controls, settings, scenario selector |

`SimulationLoop` is an empty R3F child that only drives `tick`.

## Pause

- `PauseOverlay` in basin scope when `running === false`.
- Enter / UI resume — see [controls.md](controls.md).

## Landscape / layout

- `useLandscapeLayout`: sidebar vs stacked layout on small screens.
- Basin `flex-1` fills available space; `min-h-0` for correct scroll/flex.

## Acceptance criteria

- [ ] On resize, zoom is recomputed so full `bounds` are visible (with margin).
- [ ] Boat rotation in scene matches `BoatState.heading` from snapshot.
- [ ] Overlays using `worldToScreenPixels` align with 3D boat position at any zoom.
- [ ] `frameDt` cap 0.05 s in `SimulationLoop` prevents physics spikes on tab switch.

## Related

- Cleat overlays: [mooring-cleats.md](mooring-cleats.md)
