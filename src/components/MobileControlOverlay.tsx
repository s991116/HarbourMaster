import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import { useSimulatorStore } from '../store/simulatorStore'
import { TouchSlider } from './TouchSlider'

export function MobileControlOverlay() {
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)

  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[6] flex w-16 items-center justify-center pb-24 pt-28"
        aria-hidden={false}
      >
        <div className="pointer-events-auto flex h-full max-h-72 flex-col items-center rounded-r-lg border border-sky-400/20 bg-slate-950/40 px-1 py-3 backdrop-blur-sm">
          <div className="mb-2 text-[9px] uppercase tracking-[0.12em] text-sky-300/70">
            Engine
          </div>
          <TouchSlider
            label="Engine"
            value={throttleStep}
            min={-MAX_THROTTLE_STEP}
            max={MAX_THROTTLE_STEP}
            step={1}
            onChange={setThrottleStep}
            formatValue={formatThrottleStep}
            orientation="vertical"
            minLabel="Astern"
            maxLabel="Forward"
            className="flex min-h-0 flex-1 flex-col"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] flex justify-center px-20 pb-3">
        <div className="pointer-events-auto w-full max-w-md rounded-lg border border-sky-400/20 bg-slate-950/40 px-3 py-2 backdrop-blur-sm">
          <TouchSlider
            label="Rudder"
            value={rudderStep}
            min={-MAX_RUDDER_STEP}
            max={MAX_RUDDER_STEP}
            step={1}
            onChange={setRudderStep}
            formatValue={formatRudderStep}
            orientation="horizontal"
            minLabel="Port"
            midLabel="Amidships"
            maxLabel="Stbd"
          />
        </div>
      </div>
    </>
  )
}
