import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import { useSimulatorStore } from '../store/simulatorStore'

export function ControlsPanel() {
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)

  return (
    <div className="absolute bottom-4 right-4 z-10 w-72 rounded-xl border border-sky-400/30 bg-slate-950/80 p-4 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
        Controls
      </div>

      <div className="mt-3 space-y-4">
        <label className="block">
          <div className="mb-1 flex justify-between text-xs text-slate-300">
            <span>Engine</span>
            <span>{formatThrottleStep(throttleStep)}</span>
          </div>
          <input
            type="range"
            min={-MAX_THROTTLE_STEP}
            max={MAX_THROTTLE_STEP}
            step={1}
            value={throttleStep}
            onChange={(e) => setThrottleStep(Number(e.target.value))}
            className="w-full accent-sky-400"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>Astern</span>
            <span>Neutral</span>
            <span>Forward</span>
          </div>
        </label>

        <label className="block">
          <div className="mb-1 flex justify-between text-xs text-slate-300">
            <span>Rudder</span>
            <span>{formatRudderStep(rudderStep)}</span>
          </div>
          <input
            type="range"
            min={-MAX_RUDDER_STEP}
            max={MAX_RUDDER_STEP}
            step={1}
            value={rudderStep}
            onChange={(e) => setRudderStep(Number(e.target.value))}
            className="w-full accent-sky-400"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>Port</span>
            <span>Amidships</span>
            <span>Stbd</span>
          </div>
        </label>

        <button
          type="button"
          onClick={neutralControls}
          className="w-full rounded-lg border border-sky-400/40 bg-sky-900/30 px-3 py-2 text-sm text-sky-100 transition hover:bg-sky-900/50"
        >
          Neutral (space)
        </button>
      </div>

      <div className="mt-4 rounded-lg bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
        <div>↑ / ↓ — engine step ahead / astern</div>
        <div>← / → — rudder step port / starboard</div>
        <div>Space — neutral</div>
        <div>R — reset scenario</div>
      </div>
    </div>
  )
}
