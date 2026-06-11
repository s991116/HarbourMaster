# Mooring cleats and debug display

**Status:** `active`  
**Source:** `src/physics/boatMooringCleats.ts`, `src/simulator/scenarios.ts` (`pierCleats`), overlay components

## Purpose

Show **boat cleats** (6) and **pier cleats** per scenario for training and future mooring. Debug mode helps validate placement against hull and sprite.

## Boat cleats

- IDs: `port-bow`, `port-mid`, `port-stern`, `starboard-*` (mirror).
- Placement from `BoatConfig` + `boatHullProfile`: along-hull `0.8` of half-length; beam via `getHullHalfBeamAtY`.
- Insets: bow `0.88`, mid/stern `0.94` of half-beam (narrower toward deck edges).
- World position: `boatLocalToWorldForDisplay` (same as display/collision hull).

## Pier cleats

- Type `PierMooringCleat`: `id` + world `{x,y}` in scenario.
- Not all scenarios have cleats (`pierCleats` may be empty).
- Marker size: `CLEAT_MARKER_WORLD_DIAMETER` in `basinDisplay.ts`.

## Overlays

| Component | Shows |
|-----------|--------|
| `BoatMooringCleatMarkersOverlay` | Boat cleats on screen |
| `PierCleatMarkersOverlay` | Pier cleats from active scenario |
| `CollisionHullScreenOverlay` | Optional hull outline (`showCollisionHull` in store; toggled in Settings popup) |
| `MooringCleatDebugOverlay` | Only when debug flag is active |

Screen positions sync via `*ScreenSync` components and dedicated Zustand stores (`cleatScreenStore`, `collisionHullScreenStore`, `pierCleatScreenStore`). Projection uses `basinDisplayStore` metrics including `viewMode` so overlays stay aligned in north-up and heading-up view — see [rendering.md](rendering.md).

## Debug mode

Enabled via `isMooringCleatDebugEnabled()` (`src/debug/mooringCleatDebug.ts`):

- `localStorage` key `hm-cleat-debug` = `'1'`
- Query `?cleatDebug=1` or `true` (hash query supported)
- Disable with `?cleatDebug=0` / `false`

`App` listens for `popstate` / `hashchange` / `storage` to refresh debug UI.

- `MooringCleatDebugMarker3D` / centre marker in 3D when debug is on.

## Acceptance criteria

- [ ] 6 boat cleats follow boat rotation and config changes (length/beam).
- [ ] Pier cleats shown only for positions defined in the active scenario.
- [ ] Collision hull overlay matches `getBoatHullWorldVertices` when enabled, in both view modes.
- [ ] Debug can be toggled without affecting physics (`running` unchanged).

## Future

- Mooring lines, tension, securing — not implemented; needs a new spec section when added.

## Related

- [rendering.md](rendering.md) — world→screen
- [physics.md](physics.md) — hull polygon
