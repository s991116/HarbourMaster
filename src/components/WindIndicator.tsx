import { useMemo } from 'react'
import { useSimulatorStore } from '../store/simulatorStore'

export function WindIndicator() {
  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const speedKnots = wind.speed * 1.94384

  const arrowStyle = useMemo(() => {
    const degrees = (wind.direction * 180) / Math.PI
    return { transform: `rotate(${degrees}deg)` }
  }, [wind.direction])

  return (
    <div className="pointer-events-none absolute right-4 top-4 rounded-xl border border-sky-400/30 bg-slate-950/70 px-4 py-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
        Vind
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/40 bg-sky-950/60"
          style={arrowStyle}
        >
          <div className="h-0 w-0 border-x-[6px] border-b-[16px] border-x-transparent border-b-sky-300" />
        </div>
        <div>
          <div className="text-lg font-semibold text-white">
            {speedKnots.toFixed(1)} kt
          </div>
          <div className="text-xs text-slate-300">Retning mod båden</div>
        </div>
      </div>
    </div>
  )
}
