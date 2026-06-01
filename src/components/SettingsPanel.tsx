import type { BoatConfig } from '../physics/types'
import { useSimulatorStore } from '../store/simulatorStore'

type NumberField = {
  key: keyof BoatConfig
  label: string
  step?: number
}

const NUMBER_FIELDS: NumberField[] = [
  { key: 'length', label: 'Length (m)', step: 0.1 },
  { key: 'beam', label: 'Beam (m)', step: 0.1 },
  { key: 'displacement', label: 'Displacement (kg)', step: 100 },
  { key: 'rudderArea', label: 'Rudder area (m²)', step: 0.01 },
  { key: 'enginePower', label: 'Engine power', step: 100 },
  { key: 'windageArea', label: 'Windage area (m²)', step: 0.5 },
  { key: 'windageHead', label: 'Windage head', step: 0.05 },
  { key: 'windageBeam', label: 'Windage beam', step: 0.05 },
  { key: 'windageAstern', label: 'Windage astern', step: 0.05 },
  { key: 'turningInertia', label: 'Turning inertia', step: 500 },
  { key: 'dragAhead', label: 'Drag ahead', step: 10 },
  { key: 'dragAstern', label: 'Drag astern', step: 10 },
  { key: 'dragSideways', label: 'Drag sideways', step: 50 },
  { key: 'angularDragLinear', label: 'Angular drag linear', step: 100 },
  { key: 'angularDragQuadratic', label: 'Angular drag quadratic', step: 100 },
]

export function SettingsPanel() {
  const boatConfig = useSimulatorStore((s) => s.boatConfig)
  const showCollisionHull = useSimulatorStore((s) => s.showCollisionHull)
  const updateBoatConfig = useSimulatorStore((s) => s.updateBoatConfig)
  const resetBoatConfig = useSimulatorStore((s) => s.resetBoatConfig)
  const setShowCollisionHull = useSimulatorStore((s) => s.setShowCollisionHull)

  return (
    <details className="group mt-3 rounded-lg border border-slate-700 bg-slate-900/50">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-sky-200 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          Settings
          <span className="text-xs text-slate-400 group-open:rotate-180 transition-transform">
            ▼
          </span>
        </span>
      </summary>

      <div className="max-h-72 space-y-3 overflow-y-auto border-t border-slate-700 px-3 py-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={showCollisionHull}
            onChange={(e) => setShowCollisionHull(e.target.checked)}
            className="rounded border-slate-600 bg-slate-950 accent-sky-400"
          />
          Show collision hull
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs text-slate-300">
            Keel type
            <select
              value={boatConfig.keelType}
              onChange={(e) =>
                updateBoatConfig({
                  keelType: e.target.value as BoatConfig['keelType'],
                })
              }
              className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-white"
            >
              <option value="long-keel">Long keel</option>
              <option value="fin-keel">Fin keel</option>
            </select>
          </label>

          <label className="block text-xs text-slate-300">
            Propeller rotation
            <select
              value={boatConfig.propellerRotation}
              onChange={(e) =>
                updateBoatConfig({
                  propellerRotation: e.target.value as BoatConfig['propellerRotation'],
                })
              }
              className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-white"
            >
              <option value="clockwise">Clockwise</option>
              <option value="counter-clockwise">Counter-clockwise</option>
            </select>
          </label>
        </div>

        {NUMBER_FIELDS.map(({ key, label, step = 1 }) => (
          <label key={key} className="block text-xs text-slate-300">
            {label}
            <input
              type="number"
              step={step}
              value={boatConfig[key] as number}
              onChange={(e) =>
                updateBoatConfig({ [key]: Number(e.target.value) } as Partial<BoatConfig>)
              }
              className="mt-1 w-full rounded border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-white"
            />
          </label>
        ))}

        <button
          type="button"
          onClick={resetBoatConfig}
          className="w-full rounded-lg border border-sky-400/40 px-3 py-2 text-xs text-sky-200 transition hover:bg-sky-900/40"
        >
          Reset to scenario defaults
        </button>
      </div>
    </details>
  )
}
