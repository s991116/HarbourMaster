import { SCENARIOS, useSimulatorStore } from '../store/simulatorStore'
import type { ScenarioId } from '../simulator/scenarios'
import { HarbourPopupButton } from './HarbourPopupButton'
import { harbourActionButtonClass, harbourSelectClass } from './panelStyles'

type ScenarioSelectorProps = {
  cleatDebug?: boolean
  className?: string
}

function ScenarioWindowContent({ cleatDebug = false }: { cleatDebug?: boolean }) {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setScenario = useSimulatorStore((s) => s.setScenario)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)

  return (
    <div className="space-y-3">
      {cleatDebug ? (
        <div
          style={{
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

      <label className="block text-xs text-slate-300">
        Scenario
        <select
          value={scenarioId}
          onChange={(event) => setScenario(event.target.value as ScenarioId)}
          className={`mt-1 ${harbourSelectClass}`}
        >
          {SCENARIOS.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
      </label>

      <button type="button" onClick={resetScenario} className={harbourActionButtonClass}>
        Reset (R)
      </button>
    </div>
  )
}

export function ScenarioSelector({ cleatDebug = false, className = '' }: ScenarioSelectorProps) {
  return (
    <HarbourPopupButton
      label="Scenario"
      windowTitle="Scenario"
      titleId="scenario-window-title"
      className={className}
    >
      <ScenarioWindowContent cleatDebug={cleatDebug} />
    </HarbourPopupButton>
  )
}
