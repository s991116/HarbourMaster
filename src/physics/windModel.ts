import type { BoatConfig, BoatState, Wind } from './types'
import { add, dot, fromAngle, scale, sub } from './vector2'

export type WindForces = {
  force: { x: number; y: number }
  torque: number
}

const AIR_DENSITY = 1.225
/** Global wind force multiplier — applied to all wind directions */
const WIND_DRAG_BASE = 2.8

function windForceScale(config: BoatConfig): number {
  return 0.5 * AIR_DENSITY * config.windageArea * WIND_DRAG_BASE
}

/**
 * Directional wind force in the boat body frame.
 * Headwind: lowest effect (small bow profile).
 * Beam wind: highest lateral effect — bow drifts leeward.
 * Tailwind: medium effect (larger stern profile than bow).
 */
export function computeWindForces(
  config: BoatConfig,
  state: BoatState,
  wind: Wind,
): WindForces {
  const windVector = scale(fromAngle(wind.direction), wind.speed)
  const relativeWind = sub(windVector, state.velocity)

  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)

  const vForward = dot(relativeWind, forward)
  const vSide = dot(relativeWind, sideways)
  const forceScale = windForceScale(config)

  const forwardCoeff = vForward < 0 ? config.windageHead : config.windageAstern
  const fForward = vForward * Math.abs(vForward) * forwardCoeff * forceScale
  const fSide = vSide * Math.abs(vSide) * config.windageBeam * forceScale

  const force = add(scale(forward, fForward), scale(sideways, fSide))

  // Beam wind: lateral force acts forward of the hull pivot → bow falls off leeward
  const lateralLever = config.length * 0.28
  const beamTorque = fSide * lateralLever

  // Asymmetric superstructure: bow weathervanes downwind at oblique angles
  const windFromAngle = Math.atan2(-vSide, -vForward)
  const yawAsymmetry =
    Math.sin(windFromAngle * 2) *
    (Math.abs(fForward) + Math.abs(fSide)) *
    config.length *
    0.07

  return { force, torque: beamTorque + yawAsymmetry }
}
