import { useMemo, useState } from 'react'
import {
  MAX_WIND_SPEED_KNOTS,
  windDirectionRadiansToDegrees,
  windSpeedMsToKnots,
  WIND_DIRECTION_STEP,
} from '../controls/controlSteps'
import { useTouchPrimary } from '../hooks/useTouchPrimary'
import {
  harbourDetailsClass,
  harbourIconButtonClass,
  harbourPanelClass,
  harbourSummaryClass,
} from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { useSimulatorStore } from '../store/simulatorStore'

export function WindIndicator() {
  const touchPrimary = useTouchPrimary()
  const [adjustOpen, setAdjustOpen] = useState(false)
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = windSpeedMsToKnots(wind.speed)
  const directionDegrees = windDirectionRadiansToDegrees(wind.direction)

  const arrowStyle = useMemo(() => {
    return { transform: `rotate(${directionDegrees}deg)` }
  }, [directionDegrees])

  const adjustControls = (
    <div className="w-full space-y-2.5 border-t border-slate-700 px-2 pb-2 pt-2 sm:w-44">
      <TouchSlider
        label="Speed"
        value={speedKnots}
        min={0}
        max={MAX_WIND_SPEED_KNOTS}
        step={1}
        onChange={setWindSpeedKnots}
        formatValue={(value) => `${value} kt`}
      />

      <TouchSlider
        label="Direction"
        value={directionDegrees}
        min={0}
        max={350}
        step={WIND_DIRECTION_STEP}
        onChange={setWindDirectionDegrees}
        formatValue={(value) => `${value}°`}
      />
    </div>
  )

  return (
    <div
      className={`absolute right-3 top-3 z-10 w-[min(100%,13rem)] sm:right-10 sm:w-52 ${harbourPanelClass}`}
    >
      <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
        Wind
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/35 bg-transparent"
            style={arrowStyle}
          >
            <div className="h-0 w-0 border-x-[5px] border-b-[12px] border-x-transparent border-b-sky-300" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{speedKnots} kt</div>
            <div className="text-[10px] text-slate-300">{directionDegrees}°</div>
          </div>
        </div>

        {touchPrimary ? (
          <button
            type="button"
            onClick={() => setAdjustOpen((open) => !open)}
            aria-expanded={adjustOpen}
            className={`${harbourIconButtonClass} shrink-0 px-3 text-xs font-semibold text-sky-100`}
          >
            {adjustOpen ? 'Close' : 'Adjust'}
          </button>
        ) : (
          <details className={`${harbourDetailsClass} shrink-0`}>
            <summary className={harbourSummaryClass}>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-100">
                <span>Adjust</span>
                <span
                  aria-hidden
                  className="h-0 w-0 shrink-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-sky-300 transition-transform duration-200 group-open:rotate-180"
                />
              </span>
            </summary>
            {adjustControls}
          </details>
        )}
      </div>

      {touchPrimary && adjustOpen ? adjustControls : null}
    </div>
  )
}
