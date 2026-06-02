import { useState } from 'react'
import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import { useTouchPrimary } from '../hooks/useTouchPrimary'
import { harbourIconButtonClass, harbourPanelClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { useSimulatorStore } from '../store/simulatorStore'

export function ControlsPanel() {
  const touchPrimary = useTouchPrimary()
  const [hintsOpen, setHintsOpen] = useState(false)
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)

  return (
    <div
      className={`absolute bottom-3 right-3 z-10 w-52 sm:right-10 ${harbourPanelClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
          Controls
        </div>
        {!touchPrimary ? (
          <button
            type="button"
            onClick={() => setHintsOpen((open) => !open)}
            aria-expanded={hintsOpen}
            aria-label={
              hintsOpen
                ? 'Hide neutral and keyboard guide'
                : 'Show neutral and keyboard guide'
            }
            title={hintsOpen ? 'Hide' : 'Neutral & keys'}
            className={`${harbourIconButtonClass} text-[10px] font-medium`}
          >
            ?
          </button>
        ) : null}
      </div>

      <div className="mt-2 space-y-2.5">
        <TouchSlider
          label="Engine"
          value={throttleStep}
          min={-MAX_THROTTLE_STEP}
          max={MAX_THROTTLE_STEP}
          step={1}
          onChange={setThrottleStep}
          formatValue={formatThrottleStep}
          minLabel="Astern"
          midLabel="Neutral"
          maxLabel="Forward"
        />

        <TouchSlider
          label="Rudder"
          value={rudderStep}
          min={-MAX_RUDDER_STEP}
          max={MAX_RUDDER_STEP}
          step={1}
          onChange={setRudderStep}
          formatValue={formatRudderStep}
          minLabel="Port"
          midLabel="Amidships"
          maxLabel="Stbd"
        />
      </div>

      {!touchPrimary && hintsOpen ? (
        <div className="mt-2 space-y-2 border-t border-slate-700 pt-2">
          <button
            type="button"
            onClick={neutralControls}
            className="w-full rounded border border-slate-700 bg-slate-900/50 px-2 py-2 text-[11px] text-sky-100 transition active:border-slate-500 active:bg-slate-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Neutral (space)
          </button>
          <div className="bg-transparent px-0 py-1 text-[10px] leading-snug text-slate-400">
            <div>↑ / ↓ — engine</div>
            <div>← / → — rudder</div>
            <div>Enter / click — start</div>
            <div>Space — neutral</div>
            <div>R — reset</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
