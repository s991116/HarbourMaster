import { useMemo } from 'react'
import { useSimulatorStore } from '../store/simulatorStore'

const KNOTS_TO_MS = 1.94384

export function WindIndicator() {
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = wind.speed * KNOTS_TO_MS
  const directionDegrees = Math.round(((wind.direction * 180) / Math.PI + 360) % 360)

  const arrowStyle = useMemo(() => {
    return { transform: `rotate(${directionDegrees}deg)` }
  }, [directionDegrees])

  return (
    <div className="absolute right-4 top-4 w-56 rounded-xl border border-sky-400/30 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
        Wind
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-950/60"
          style={arrowStyle}
        >
          <div className="h-0 w-0 border-x-[6px] border-b-[16px] border-x-transparent border-b-sky-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-white">
            {speedKnots.toFixed(1)} kt
          </div>
          <div className="text-xs text-slate-300">{directionDegrees}°</div>
        </div>
      </div>

      <label className="mt-3 block">
        <div className="mb-1 flex justify-between text-xs text-slate-300">
          <span>Speed</span>
          <span>{speedKnots.toFixed(1)} kt</span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={0.5}
          value={speedKnots}
          onChange={(e) => setWindSpeedKnots(Number(e.target.value))}
          className="w-full accent-sky-400"
        />
      </label>

      <label className="mt-3 block">
        <div className="mb-1 flex justify-between text-xs text-slate-300">
          <span>Direction</span>
          <span>{directionDegrees}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={359}
          step={1}
          value={directionDegrees}
          onChange={(e) => setWindDirectionDegrees(Number(e.target.value))}
          className="w-full accent-sky-400"
        />
      </label>
    </div>
  )
}
