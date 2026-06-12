import type { BoatConfig } from '../physics/types'
import {
  useWaterRippleSettingsStore,
  type WaterRippleSettings,
} from '../store/waterRippleSettingsStore'
import { useSimulatorStore } from '../store/simulatorStore'
import { ParameterTextField } from './ParameterTextField'
import { harbourActionButtonClass } from './panelStyles'

type BoatNumberKey = Exclude<
  keyof BoatConfig,
  'keelType' | 'propellerRotation'
>

const BOAT_NUMBER_FIELDS: Array<{ key: BoatNumberKey; label: string }> = [
  { key: 'length', label: 'Length (m)' },
  { key: 'beam', label: 'Beam (m)' },
  { key: 'displacement', label: 'Displacement (kg)' },
  { key: 'rudderArea', label: 'Rudder area (m²)' },
  { key: 'enginePower', label: 'Engine power' },
  { key: 'windageArea', label: 'Windage area (m²)' },
  { key: 'windageHead', label: 'Windage head' },
  { key: 'windageBeam', label: 'Windage beam' },
  { key: 'windageAstern', label: 'Windage astern' },
  { key: 'turningInertia', label: 'Turning inertia' },
  { key: 'dragAhead', label: 'Drag ahead' },
  { key: 'dragAstern', label: 'Drag astern' },
  { key: 'dragSideways', label: 'Drag sideways' },
  { key: 'angularDragLinear', label: 'Angular drag linear' },
  { key: 'angularDragQuadratic', label: 'Angular drag quadratic' },
]

const WATER_RIPPLE_FIELDS: Array<{ key: keyof WaterRippleSettings; label: string }> = [
  { key: 'driftScale', label: 'Drift scale' },
  { key: 'visualCapKnots', label: 'Visual cap (kt)' },
  { key: 'rippleStrengthBase', label: 'Ripple strength base' },
  { key: 'rippleStrengthScale', label: 'Ripple strength scale' },
  { key: 'sparkleMix', label: 'Sparkle mix' },
  { key: 'smoothstepLow', label: 'Smoothstep low' },
  { key: 'smoothstepHigh', label: 'Smoothstep high' },
  { key: 'calmAmp1', label: 'Calm amplitude 1' },
  { key: 'calmAmp2', label: 'Calm amplitude 2' },
  { key: 'calmAmp3', label: 'Calm amplitude 3' },
  { key: 'windyStreak1', label: 'Windy streak 1' },
  { key: 'windyStreak2', label: 'Windy streak 2' },
  { key: 'windyStreak3', label: 'Windy streak 3' },
  { key: 'highlightR', label: 'Highlight R' },
  { key: 'highlightG', label: 'Highlight G' },
  { key: 'highlightB', label: 'Highlight B' },
  { key: 'shadowR', label: 'Shadow R' },
  { key: 'shadowG', label: 'Shadow G' },
  { key: 'shadowB', label: 'Shadow B' },
]

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed.length === 0) return null
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

function sectionTitle(text: string) {
  return (
    <h3 className="text-[10px] uppercase tracking-[0.12em] text-sky-300/80">{text}</h3>
  )
}

export function SettingsWindowContent() {
  const boatConfig = useSimulatorStore((s) => s.boatConfig)
  const showCollisionHull = useSimulatorStore((s) => s.showCollisionHull)
  const maxRudderAngleDegrees = useSimulatorStore((s) => s.maxRudderAngleDegrees)
  const updateBoatConfig = useSimulatorStore((s) => s.updateBoatConfig)
  const resetBoatConfig = useSimulatorStore((s) => s.resetBoatConfig)
  const setShowCollisionHull = useSimulatorStore((s) => s.setShowCollisionHull)
  const setMaxRudderAngleDegrees = useSimulatorStore((s) => s.setMaxRudderAngleDegrees)
  const resetMaxRudderAngleDegrees = useSimulatorStore((s) => s.resetMaxRudderAngleDegrees)

  const waterSettings = useWaterRippleSettingsStore((s) => s.settings)
  const updateWaterSettings = useWaterRippleSettingsStore((s) => s.updateSettings)
  const resetWaterSettings = useWaterRippleSettingsStore((s) => s.resetSettings)

  const commitBoatNumber = (key: BoatNumberKey, raw: string) => {
    const value = parseNumber(raw)
    if (value === null) return
    updateBoatConfig({ [key]: value } as Partial<BoatConfig>)
  }

  const commitWaterNumber = (key: keyof WaterRippleSettings, raw: string) => {
    const value = parseNumber(raw)
    if (value === null) return
    updateWaterSettings({ [key]: value })
  }

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        {sectionTitle('Display')}
        <ParameterTextField
          label="Show collision hull (true / false)"
          value={String(showCollisionHull)}
          onCommit={(raw) => {
            const normalized = raw.trim().toLowerCase()
            if (normalized === 'true') setShowCollisionHull(true)
            if (normalized === 'false') setShowCollisionHull(false)
          }}
        />
      </section>

      <section className="space-y-2">
        {sectionTitle('Controls')}
        <ParameterTextField
          label="Rudder movement max (degrees)"
          value={String(maxRudderAngleDegrees)}
          onCommit={(raw) => {
            const value = parseNumber(raw)
            if (value === null) return
            setMaxRudderAngleDegrees(value)
          }}
        />
        <button
          type="button"
          onClick={resetMaxRudderAngleDegrees}
          className={harbourActionButtonClass}
        >
          Reset rudder movement to default
        </button>
      </section>

      <section className="space-y-2">
        {sectionTitle('Boat')}
        <ParameterTextField
          label="Keel type (long-keel / fin-keel)"
          value={boatConfig.keelType}
          onCommit={(raw) => {
            const normalized = raw.trim() as BoatConfig['keelType']
            if (normalized === 'long-keel' || normalized === 'fin-keel') {
              updateBoatConfig({ keelType: normalized })
            }
          }}
        />
        <ParameterTextField
          label="Propeller rotation (clockwise / counter-clockwise)"
          value={boatConfig.propellerRotation}
          onCommit={(raw) => {
            const normalized = raw.trim() as BoatConfig['propellerRotation']
            if (normalized === 'clockwise' || normalized === 'counter-clockwise') {
              updateBoatConfig({ propellerRotation: normalized })
            }
          }}
        />
        {BOAT_NUMBER_FIELDS.map(({ key, label }) => (
          <ParameterTextField
            key={key}
            label={label}
            value={String(boatConfig[key])}
            onCommit={(raw) => commitBoatNumber(key, raw)}
          />
        ))}
        <button type="button" onClick={resetBoatConfig} className={harbourActionButtonClass}>
          Reset boat to scenario defaults
        </button>
      </section>

      <section className="space-y-2">
        {sectionTitle('Water ripples')}
        {WATER_RIPPLE_FIELDS.map(({ key, label }) => (
          <ParameterTextField
            key={key}
            label={label}
            value={String(waterSettings[key])}
            onCommit={(raw) => commitWaterNumber(key, raw)}
          />
        ))}
        <button
          type="button"
          onClick={() => resetWaterSettings()}
          className={harbourActionButtonClass}
        >
          Reset water ripples to defaults
        </button>
      </section>
    </div>
  )
}
