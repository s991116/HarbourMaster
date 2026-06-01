import { useState } from 'react'
import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import { harbourPanelClass } from './panelStyles'
import { useSimulatorStore } from '../store/simulatorStore'

export function ControlsPanel() {
  const [hintsOpen, setHintsOpen] = useState(false)
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)

  return (
    <div className={`absolute bottom-3 right-10 z-10 w-52 ${harbourPanelClass}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
          Controls
        </div>
        <button
          type="button"
          onClick={() => setHintsOpen((open) => !open)}
          aria-expanded={hintsOpen}
          aria-label={hintsOpen ? 'Hide neutral and keyboard guide' : 'Show neutral and keyboard guide'}
          title={hintsOpen ? 'Hide' : 'Neutral & keys'}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-900/50 text-[10px] font-medium text-sky-300/90 transition hover:border-slate-600 hover:text-sky-200"
        >
          ?
        </button>
      </div>

      <div className="mt-2 space-y-2.5">
        <label className="block bg-transparent">
          <div className="mb-0.5 flex justify-between text-[10px] text-slate-300">
            <span>Engine</span>
            <span className="tabular-nums text-slate-400">
              {formatThrottleStep(throttleStep)}
            </span>
          </div>
          <input
            type="range"
            min={-MAX_THROTTLE_STEP}
            max={MAX_THROTTLE_STEP}
            step={1}
            value={throttleStep}
            onChange={(e) => setThrottleStep(Number(e.target.value))}
            className="h-1 w-full accent-sky-400"
          />
          <div className="mt-0.5 flex justify-between text-[9px] text-slate-500">
            <span>Astern</span>
            <span>Neutral</span>
            <span>Forward</span>
          </div>
        </label>

        <label className="block bg-transparent">
          <div className="mb-0.5 flex justify-between text-[10px] text-slate-300">
            <span>Rudder</span>
            <span className="tabular-nums text-slate-400">
              {formatRudderStep(rudderStep)}
            </span>
          </div>
          <input
            type="range"
            min={-MAX_RUDDER_STEP}
            max={MAX_RUDDER_STEP}
            step={1}
            value={rudderStep}
            onChange={(e) => setRudderStep(Number(e.target.value))}
            className="h-1 w-full accent-sky-400"
          />
          <div className="mt-0.5 flex justify-between text-[9px] text-slate-500">
            <span>Port</span>
            <span>Amidships</span>
            <span>Stbd</span>
          </div>
        </label>
      </div>

      {hintsOpen ? (
        <div className="mt-2 space-y-2 border-t border-slate-700 pt-2">
          <button
            type="button"
            onClick={neutralControls}
            className="w-full rounded border border-slate-700 bg-slate-900/50 px-2 py-1 text-[11px] text-sky-100 transition hover:border-slate-600"
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
