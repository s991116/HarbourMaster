# Specifications

## Language

All files in `docs/specs/` are written in **English**, same as source code, comments, and `.cursor/` skills/rules. See [.cursor/rules/language.mdc](../../.cursor/rules/language.mdc).

These files are the **contract** for HarbourMaster: behaviour, invariants, and acceptance criteria. Code must match specs; when code and spec diverge, fix spec or code deliberately in the same PR.

## Status values

| Status | Meaning |
|--------|---------|
| `draft` | Work in progress — may differ from code |
| `active` | Current contract — must match production/code |
| `deprecated` | Replaced — kept for history only |

## Spec index

| File | Area |
|------|------|
| [physics.md](physics.md) | Physics engine, forces, collision, timestep |
| [controls.md](controls.md) | Keyboard, touch, throttle/rudder steps, wind UI |
| [rendering.md](rendering.md) | Basin viewport, world→screen, camera |
| [mooring-cleats.md](mooring-cleats.md) | Boat and pier cleats, overlays, debug |
| [deployment.md](deployment.md) | Build, Cloudflare Pages, DNS |

**Not covered here (yet):** scenarios / scenario builder.

## Maintenance

- One concern per file; avoid duplicating the root README (README = quick start).
- Add **Acceptance criteria** as a checkbox list when behaviour is testable.
- Link to source files (`src/...`) where it helps review.
- Skills in `.cursor/skills/` may reference specs; they must not replace specs.
