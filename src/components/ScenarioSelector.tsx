import { useState } from 'react'
import { SCENARIOS, useSimulatorStore } from '../store/simulatorStore'
import type { ScenarioId } from '../simulator/scenarios'
import {
  harbourActionButtonClass,
  harbourPanelWidthClass,
  harbourSelectClass,
} from './panelStyles'
import type { HarbourPanelLayout } from './panelStyles'
import { HarbourCollapsiblePanel } from './HarbourCollapsiblePanel'
import { SettingsPanel } from './SettingsPanel'

type ScenarioSelectorProps = {
  cleatDebug?: boolean
  layout?: HarbourPanelLayout
  /** Sidebar: controlled open state (auto-collapses when panels overlap). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ScenarioSelector({
  cleatDebug = false,
  layout = 'overlay',
  open: controlledOpen,
  onOpenChange,
}: ScenarioSelectorProps) {
  const [overlayOpen, setOverlayOpen] = useState(true)
  const open = controlledOpen ?? overlayOpen
  const setOpen = onOpenChange ?? setOverlayOpen

  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setScenario = useSimulatorStore((s) => s.setScenario)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)

  const body = (
    <>
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
        <select
          value={scenarioId}
          onChange={(e) => setScenario(e.target.value as ScenarioId)}
          className={harbourSelectClass}
        >
          {SCENARIOS.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
      </label>

      <SettingsPanel />

      <button type="button" onClick={resetScenario} className={`mt-2 ${harbourActionButtonClass}`}>
        Reset (R)
      </button>
    </>
  )

  const panel = (
    <HarbourCollapsiblePanel
      title="Scenario"
      open={open}
      onOpenChange={setOpen}
      layout={layout}
      sidebarPanel={layout === 'sidebar'}
    >
      {body}
    </HarbourCollapsiblePanel>
  )

  if (layout === 'sidebar') {
    return panel
  }

  return (
    <div className={`absolute left-3 top-3 z-10 ${harbourPanelWidthClass}`}>{panel}</div>
  )
}
