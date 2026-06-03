import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import { harbourPanelClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { useSimulatorStore } from '../store/simulatorStore'

export function ControlsPanel() {
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)

  return (
    <div
      className={`absolute bottom-3 right-3 z-10 w-52 sm:right-10 ${harbourPanelClass}`}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
        Controls
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
    </div>
  )
}
