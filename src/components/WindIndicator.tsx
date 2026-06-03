import {
  MAX_WIND_SPEED_KNOTS,
  windDirectionRadiansToDegrees,
  windSpeedMsToKnots,
} from '../controls/controlSteps'
import { harbourPanelClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { WindDirectionDial } from './WindDirectionDial'
import { useSimulatorStore } from '../store/simulatorStore'

export function WindIndicator() {
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = windSpeedMsToKnots(wind.speed)
  const directionDegrees = windDirectionRadiansToDegrees(wind.direction)

  return (
    <div
      className={`absolute right-3 top-3 z-10 w-[min(100%,13rem)] sm:right-10 sm:w-52 ${harbourPanelClass}`}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
        Wind
      </div>

      <div className="mt-1.5 flex items-end gap-6">
        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <div className="text-sm font-semibold tabular-nums text-white">
            {directionDegrees}°
          </div>
          <WindDirectionDial
            degrees={directionDegrees}
            onChange={setWindDirectionDegrees}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="text-sm font-semibold tabular-nums text-white">
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
          />
        </div>
      </div>
    </div>
  )
}
