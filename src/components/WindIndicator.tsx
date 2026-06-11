import {
  MAX_WIND_SPEED_KNOTS,
  windDirectionRadiansToDegrees,
  windSpeedMsToKnots,
} from '../controls/controlSteps'
import { useSimulatorStore } from '../store/simulatorStore'
import type { HarbourPanelLayout } from './panelStyles'
import { harbourPanelClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { WindDirectionDial } from './WindDirectionDial'

type WindIndicatorProps = {
  layout?: HarbourPanelLayout
  className?: string
}

export function WindIndicator({ layout = 'sidebar', className = '' }: WindIndicatorProps) {
  const isSidebar = layout === 'sidebar'
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = windSpeedMsToKnots(wind.speed)
  const directionDegrees = windDirectionRadiansToDegrees(wind.direction)

  return (
    <div
      className={`${harbourPanelClass} w-full ${className}`.trim()}
      {...(isSidebar ? { 'data-sidebar-panel': true } : {})}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">Wind</div>

      <div className="mt-1 flex flex-col items-center gap-2">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="text-sm font-semibold tabular-nums text-white">
            {directionDegrees}°
          </div>
          <WindDirectionDial
            degrees={directionDegrees}
            onChange={setWindDirectionDegrees}
          />
        </div>

        <div className="flex w-full flex-col gap-1">
          <div className="text-center text-sm font-semibold tabular-nums text-white">
            {speedKnots} kt
          </div>
          <TouchSlider
            label="Wind speed"
            showLabel={false}
            value={speedKnots}
            min={0}
            max={MAX_WIND_SPEED_KNOTS}
            step={1}
            onChange={setWindSpeedKnots}
            formatValue={(value) => `${value} kt`}
            compact={isSidebar}
          />
        </div>
      </div>
    </div>
  )
}
