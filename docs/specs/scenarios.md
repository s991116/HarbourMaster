# Scenarios and tile maps

**Status:** `active`  
**Source:** `src/simulator/scenarios.ts`, `src/simulator/tileMap/`, `src/components/mapEditor/`

## Purpose

Harbour training scenarios define basin layout, boat start, wind, and optional pier cleats. **Tile maps** are the authoring format for new layouts; they **bake** into the existing runtime `Scenario` type consumed by physics and rendering without API changes.

Legacy scenarios remain hand-authored in `scenarios.ts` until migrated.

## Runtime `Scenario`

| Field | Role |
|-------|------|
| `bounds` | Axis-aligned harbour limits (world metres, x east / y north) |
| `obstacles` | `StaticObstacle[]` — quay, pole, boat (rotated AABB) |
| `landPatches` | Visual-only land rectangles from baked `land` tiles (no collision) |
| `pierCleats` | Mooring points on quays (world x/y) |
| `initialState` | Boat spawn |
| `wind`, `boatConfig` | From scenario metadata, not from tiles |

Physics and rendering read **only** the baked `Scenario` — see [physics.md](physics.md), [rendering.md](rendering.md).

## Tile map format

Defined in `src/simulator/tileMap/types.ts`.

- **`tileSize`** — cell size in world metres (default **1 m**).
- **`origin`** — world position of cell `(0, 0)` minimum corner.
- **`width` / `height`** — grid size in cells.
- **`bounds`** — optional explicit `HarbourBounds`; otherwise derived from the grid extent.
- **`layers.terrain`** — `TerrainTile[][]`, row-major; row `0` = south (`minY`), col `0` = west (`minX`).
- **`layers.objects`** — sparse markers: `pole`, `cleat`, `parked-boat` (optional v1 subset).

### Terrain tile types (v1)

| Tile | Collision when baked |
|------|---------------------|
| `water` | None |
| `quay` | Merged into `StaticObstacle` type `quay` |
| `land` | Merged into `landPatches` (visual only, no collision) |

### Object markers (v1)

| Kind | Baked to |
|------|----------|
| `pole` | `StaticObstacle` type `pole` |
| `cleat` | `PierMooringCleat` |
| `parked-boat` | `StaticObstacle` type `boat` |

## Bake pipeline

`bakeTileMapScenario(tileMap, meta)` in `src/simulator/tileMap/bakeScenario.ts`:

1. **Quay merge** — adjacent `quay` cells (4-connected) are merged into axis-aligned rectangles, then emitted as few `StaticObstacle` quays as possible (avoids per-cell collision).
2. **Land merge** — adjacent `land` cells use the same merge logic → `landPatches` for rendering (no physics).
3. **Objects** — each object layer entry → obstacle or pier cleat at cell centre in world space.
4. **Bounds** — `tileMap.bounds` or grid extent aligned to `origin` + `width/height * tileSize`.

Bake is **deterministic**; same tile map always yields the same obstacles.

## Loading

- `getScenario(id)` returns baked scenarios for tile-backed ids (e.g. `empty-basin`) and legacy entries for others.
- `registerTileMapScenario(tileMap, meta)` — optional custom maps (editor export / future storage).

## Map editor (MVP)

Route: `#editor` (hash). Tablet/laptop first: palette, paint, erase, pan, zoom.

- Does not run physics; edits `TileMap` in memory.
- **Export** copies JSON; **Import** loads JSON.
- **Play** navigates to `#` and registers the map for `empty-basin` override or a dynamic id (v1: replaces `empty-basin` in session via store).

See `src/components/mapEditor/MapEditorApp.tsx`.

## Multi-device

| Role | Requirement |
|------|-------------|
| **Play** | Same baked `Scenario` on mobile, tablet, laptop — layout modes unchanged ([rendering.md](rendering.md)). |
| **Edit** | Pan/zoom required on small screens; touch targets ≥ 44 px; palette wraps on narrow widths. |

## Acceptance criteria

- [ ] `empty-basin` baked from tile map produces perimeter quays and `bounds` matching legacy scenario within one tile.
- [ ] Merged quay obstacles are fewer than raw quay cell count for the basin frame.
- [ ] Baked obstacles work with existing `collisionModel` (no per-cell hopping at normal speed).
- [ ] `#editor` loads, paints terrain, pans/zooms on trackpad and touch.
- [ ] Export/import round-trips tile map JSON without data loss.
- [ ] Simulator loads baked scenario without changes to `PhysicsEngine` API.

## Related

- Cleats: [mooring-cleats.md](mooring-cleats.md)
- Controls / UI: [controls.md](controls.md)
