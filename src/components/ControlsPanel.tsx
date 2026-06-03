import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import type { HarbourPanelLayout } from './panelStyles'
import { harbourPanelClass, harbourPanelWidthClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { useSimulatorStore } from '../store/simulatorStore'

type ControlsPanelProps = {
  layout?: HarbourPanelLayout
}

export function ControlsPanel({ layout = 'overlay' }: ControlsPanelProps) {
  const positionClass =
    layout === 'sidebar'
      ? `${harbourPanelClass} w-full`
      : `absolute bottom-3 right-3 z-10 sm:right-10 ${harbourPanelWidthClass} ${harbourPanelClass}`
  const isSidebar = layout === 'sidebar'
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)

  return (
    <div className={positionClass} {...(isSidebar ? { 'data-sidebar-panel': true } : {})}>
      <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
        Controls
      </div>

      <div
        className={
          isSidebar
            ? 'mt-1 flex flex-col gap-1.5'
            : 'mt-2 space-y-2.5'
        }
      >
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
          compact={isSidebar}
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
          compact={isSidebar}
        />
      </div>
    </div>
  )
}
