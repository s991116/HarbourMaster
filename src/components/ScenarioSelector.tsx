import { SCENARIOS, useSimulatorStore } from '../store/simulatorStore'
import type { ScenarioId } from '../simulator/scenarios'

export function ScenarioSelector() {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setScenario = useSimulatorStore((s) => s.setScenario)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)

  return (
    <div className="absolute left-4 top-4 w-80 rounded-xl border border-sky-400/30 bg-slate-950/80 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Harbour Manoeuvre Trainer
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Realistisk 2D havnesimulator til motorbådmanøvrer
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

      <div className="mt-4 space-y-2">
        {SCENARIOS.map((scenario) => {
          const active = scenario.id === scenarioId
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setScenario(scenario.id as ScenarioId)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                active
                  ? 'border-sky-400 bg-sky-900/40'
                  : 'border-slate-700 bg-slate-900/40 hover:border-sky-500/50'
              }`}
            >
              <div className="text-sm font-medium text-white">{scenario.name}</div>
              <div className="mt-1 text-xs text-slate-300">{scenario.objective}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
