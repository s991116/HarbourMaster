import { useMemo } from 'react'
import {
  MAX_WIND_SPEED_KNOTS,
  windDirectionRadiansToDegrees,
  windSpeedMsToKnots,
  WIND_DIRECTION_STEP,
} from '../controls/controlSteps'
import { harbourDetailsClass, harbourPanelClass } from './panelStyles'
import { useSimulatorStore } from '../store/simulatorStore'

export function WindIndicator() {
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = windSpeedMsToKnots(wind.speed)
  const directionDegrees = windDirectionRadiansToDegrees(wind.direction)

  const arrowStyle = useMemo(() => {
    return { transform: `rotate(${directionDegrees}deg)` }
  }, [directionDegrees])

  return (
    <div className={`absolute right-10 top-3 z-10 w-52 ${harbourPanelClass}`}>
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

        <details className={`${harbourDetailsClass} shrink-0`}>
          <summary className="cursor-pointer list-none px-2 py-1 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-100">
              <span>Adjust</span>
              <span
                aria-hidden
                className="h-0 w-0 shrink-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-sky-300 transition-transform duration-200 group-open:rotate-180"
              />
            </span>
          </summary>

          <div className="w-44 space-y-2.5 border-t border-slate-700 px-2 pb-2 pt-2">
            <label className="block bg-transparent">
              <div className="mb-0.5 flex justify-between text-[10px] text-slate-300">
                <span>Speed</span>
                <span className="tabular-nums text-slate-400">{speedKnots} kt</span>
              </div>
              <input
                type="range"
                min={0}
                max={MAX_WIND_SPEED_KNOTS}
                step={1}
                value={speedKnots}
                onChange={(e) => setWindSpeedKnots(Number(e.target.value))}
                className="h-1 w-full accent-sky-400"
              />
            </label>

            <label className="block bg-transparent">
              <div className="mb-0.5 flex justify-between text-[10px] text-slate-300">
                <span>Direction</span>
                <span className="tabular-nums text-slate-400">{directionDegrees}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={350}
                step={WIND_DIRECTION_STEP}
                value={directionDegrees}
                onChange={(e) => setWindDirectionDegrees(Number(e.target.value))}
                className="h-1 w-full accent-sky-400"
              />
            </label>
          </div>
        </details>
      </div>
    </div>
  )
}
