import { SCENARIOS, useSimulatorStore } from '../store/simulatorStore'
import type { ScenarioId } from '../simulator/scenarios'
import { SettingsPanel } from './SettingsPanel'

type ScenarioSelectorProps = {
  cleatDebug?: boolean
}

export function ScenarioSelector({ cleatDebug = false }: ScenarioSelectorProps) {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setScenario = useSimulatorStore((s) => s.setScenario)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)
  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId)

  return (
    <div className="absolute left-4 top-4 z-10 w-80 rounded-xl border border-sky-400/30 bg-slate-950/80 p-4 backdrop-blur">
      {cleatDebug ? (
        <div
          style={{
            marginBottom: 12,
            padding: '8px 10px',
            borderRadius: 8,
            backgroundColor: '#dc2626',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Cleat debug aktiv (React panel)
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Harbour Manoeuvre Trainer
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Realistic 2D harbour simulator for sailboat manoeuvres
          </p>
        </div>
        <button
          type="button"
          onClick={resetScenario}
          className="rounded-lg border border-sky-400/40 px-2 py-1 text-xs text-sky-200 transition hover:bg-sky-900/40"
        >
          Reset (R)
        </button>
      </div>

      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.15em] text-sky-300/80">
          Scenario
        </span>
        <select
          value={scenarioId}
          onChange={(e) => setScenario(e.target.value as ScenarioId)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white"
        >
          {SCENARIOS.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
      </label>

      {activeScenario && (
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          {activeScenario.objective}
        </p>
      )}

      <SettingsPanel />
    </div>
  )
}
