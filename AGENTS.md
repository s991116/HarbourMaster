# HarbourMaster — agent and developer guide

Specification-driven development: **specs** = what, **skills** = how, **rules** = short guardrails.

## Conventions

- **Language:** English for code, specs (`docs/specs/`), skills, rules, and this file — enforced by [.cursor/rules/language.mdc](.cursor/rules/language.mdc) (`alwaysApply: true`).

## Start here

| Task | Read first | Skill |
|------|------------|-------|
| Change physics / boat behaviour | [docs/specs/physics.md](docs/specs/physics.md) | [.cursor/skills/tune-physics/SKILL.md](.cursor/skills/tune-physics/SKILL.md) |
| Input, keyboard, UI controls | [docs/specs/controls.md](docs/specs/controls.md) | — |
| Viewport, 2D/3D display | [docs/specs/rendering.md](docs/specs/rendering.md) | — |
| Boat and pier cleats, debug | [docs/specs/mooring-cleats.md](docs/specs/mooring-cleats.md) | [.cursor/skills/add-debug-overlay/SKILL.md](.cursor/skills/add-debug-overlay/SKILL.md) |
| Deploy / hosting | [docs/specs/deployment.md](docs/specs/deployment.md) | [.cursor/skills/deploy/SKILL.md](.cursor/skills/deploy/SKILL.md) |

**Scenarios:** No dedicated spec yet. Data lives in `src/simulator/scenarios.ts`. A future scenario builder may replace hard-coded scenarios.

## Folder layout

```text
docs/specs/          # Product and technical contract (versioned in git)
.cursor/skills/      # Step-by-step workflows for repeated tasks
.cursor/rules/       # Short Cursor rules (globs / alwaysApply)
```

## Workflow

1. Update the relevant spec (or mark WIP in the spec **Status**).
2. Implement in code; keep changes within the spec scope.
3. Verify against the spec **Acceptance criteria**.
4. Update a skill if the process (not the requirement) changes.

See [docs/specs/README.md](docs/specs/README.md) for maintaining specs.

## Tech (quick reference)

- React + TypeScript, R3F top-down, Zustand, Tailwind
- Physics: `src/physics/` — custom engine, 60 Hz fixed step via `SimulatorController`
- Simulator: `src/simulator/`, state: `src/store/simulatorStore.ts`
