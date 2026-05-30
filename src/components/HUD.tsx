import { useSimulatorStore } from '../store/simulatorStore'
import { getScenario } from '../simulator/scenarios'

export function HUD() {
  const snapshot = useSimulatorStore((s) => s.snapshot)
  const input = useSimulatorStore((s) => s.input)
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const scenario = getScenario(scenarioId)

  const sogKnots = snapshot.speedOverGround * 1.94384
  const stwKnots = snapshot.speedThroughWater * 1.94384
  const throttlePct = Math.round(input.throttle * 100)
  const rudderDeg = Math.round((input.rudderAngle * 180) / Math.PI)

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-sky-400/30 bg-slate-950/70 px-4 py-3 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
        {scenario.name}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <span className="text-slate-400">Speed (SOG)</span>
        <span className="font-medium text-white">{sogKnots.toFixed(1)} kt</span>
        <span className="text-slate-400">Speed (STW)</span>
        <span className="font-medium text-white">{stwKnots.toFixed(1)} kt</span>
        <span className="text-slate-400">Throttle</span>
        <span className="font-medium text-white">{throttlePct}%</span>
        <span className="text-slate-400">Rudder</span>
        <span className="font-medium text-white">{rudderDeg}°</span>
        <span className="text-slate-400">Keel</span>
        <span className="font-medium text-white">
          {scenario.boatConfig.keelType === 'long-keel' ? 'Long keel' : 'Fin keel'}
        </span>
        <span className="text-slate-400">Gear</span>
        <span className="font-medium text-white">
          {snapshot.isInReverse ? 'Astern' : input.throttle > 0.02 ? 'Ahead' : 'Neutral'}
        </span>
        <span className="text-slate-400">Prop walk</span>
        <span className="font-medium text-white">
          {snapshot.propWalkActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}
