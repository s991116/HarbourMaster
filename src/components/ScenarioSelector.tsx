import { SCENARIOS, useSimulatorStore } from '../store/simulatorStore'
import type { ScenarioId } from '../simulator/scenarios'
import { harbourInsetClass, harbourPanelClass, harbourSelectClass } from './panelStyles'
import { SettingsPanel } from './SettingsPanel'

type ScenarioSelectorProps = {
  cleatDebug?: boolean
}

export function ScenarioSelector({ cleatDebug = false }: ScenarioSelectorProps) {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setScenario = useSimulatorStore((s) => s.setScenario)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)
  return (
    <div className={`absolute left-3 top-3 z-10 w-56 ${harbourPanelClass}`}>
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
      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.12em] text-sky-300/80">
          Scenario
        </span>
        <select
          value={scenarioId}
          onChange={(e) => setScenario(e.target.value as ScenarioId)}
          className={`mt-0.5 ${harbourSelectClass}`}
        >
          {SCENARIOS.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
      </label>

      <SettingsPanel />

      <button
        type="button"
        onClick={resetScenario}
        className={`mt-2 w-full px-2 py-1 text-[10px] text-sky-200 transition hover:border-slate-600 ${harbourInsetClass}`}
      >
        Reset (R)
      </button>
    </div>
  )
}
