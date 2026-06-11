---
name: add-debug-overlay
description: >-
  Add or change debug overlays (cleats, collision hull, markers). Use when
  editing overlay components, screen sync stores, or mooringCleatDebug.
---

# Add or change debug overlay

## Before you start

- [docs/specs/mooring-cleats.md](../../../docs/specs/mooring-cleats.md)
- [docs/specs/rendering.md](../../../docs/specs/rendering.md) for `worldToScreenPixels`

## Pattern in this repo

1. **World data** from physics or scenario (`boatMooringCleats`, `getBoatHullWorldVertices`, `pierCleats`).
2. **R3F sync** component (optional) for 3D debug markers.
3. **Screen store** + `*ScreenSync` component projecting world → pixels via `basinDisplayStore` metrics (include boat heading when calling `worldToScreenPixels` so heading-up view stays aligned).
4. **Overlay** React component positioned absolute over `BasinViewport`.

Existing examples:

- `BoatMooringCleatMarkersOverlay` + `cleatScreenStore`
- `CollisionHullScreenOverlay` + `collisionHullScreenStore`
- `MooringCleatDebugOverlay` + `mooringCleatDebug.ts` flag

## Steps

1. Add spec acceptance criteria in `mooring-cleats.md` if user-visible behaviour changes.
2. Implement sync in `useFrame` or dedicated sync component — avoid duplicating projection math; use `worldToScreenPixels`.
3. Gate debug-only UI on `isMooringCleatDebugEnabled()` or store flag — must not affect physics when toggled.
4. Test resize and scenario change: markers stay aligned with boat/quay.

## Do not

- Put debug drawing inside `PhysicsEngine`.
- Hardcode pixel positions without world projection.
