import { useSimulatorStore } from '../store/simulatorStore'

export function ControlsPanel() {
  const input = useSimulatorStore((s) => s.input)
  const setThrottle = useSimulatorStore((s) => s.setThrottle)
  const setRudder = useSimulatorStore((s) => s.setRudder)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)

  return (
    <div className="absolute bottom-4 right-4 w-72 rounded-xl border border-sky-400/30 bg-slate-950/80 p-4 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
        Kontroller
      </div>

      <div className="mt-3 space-y-4">
        <label className="block">
          <div className="mb-1 flex justify-between text-xs text-slate-300">
            <span>Motor</span>
            <span>{Math.round(input.throttle * 100)}%</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={Math.round(input.throttle * 100)}
            onChange={(e) => setThrottle(Number(e.target.value) / 100)}
            className="w-full accent-sky-400"
          />
        </label>

        <label className="block">
          <div className="mb-1 flex justify-between text-xs text-slate-300">
            <span>Ror</span>
            <span>{Math.round((input.rudderAngle * 180) / Math.PI)}°</span>
          </div>
          <input
            type="range"
            min={-30}
            max={30}
            value={Math.round((input.rudderAngle * 180) / Math.PI)}
            onChange={(e) => setRudder((Number(e.target.value) * Math.PI) / 180)}
            className="w-full accent-sky-400"
          />
        </label>

        <button
          type="button"
          onClick={neutralControls}
          className="w-full rounded-lg border border-sky-400/40 bg-sky-900/30 px-3 py-2 text-sm text-sky-100 transition hover:bg-sky-900/50"
        >
          Neutral (mellemrum)
        </button>
      </div>

      <div className="mt-4 rounded-lg bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
        <div>↑ / ↓ — gas frem / bak</div>
        <div>← / → — ror bagbord / styrbord</div>
        <div>Mellemrum — neutral</div>
        <div>R — nulstil scenarie</div>
      </div>
    </div>
  )
}
