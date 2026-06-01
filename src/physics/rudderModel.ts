import type { BoatConfig, BoatState } from './types'
import { clamp, dot, fromAngle, scale } from './vector2'

const MAX_RUDDER_ANGLE = 0.52

export const clampRudderAngle = (angle: number): number =>
  clamp(angle, -MAX_RUDDER_ANGLE, MAX_RUDDER_ANGLE)

export type RudderForces = {
  force: { x: number; y: number }
  torque: number
}

export function computeRudderForces(
  config: BoatConfig,
  state: BoatState,
): RudderForces {
  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)

  const surgeSpeed = dot(state.velocity, forward)
  const speedAbs = Math.abs(surgeSpeed)
  const isReverse = surgeSpeed < -0.05

  if (speedAbs < 0.02) {
    return { force: { x: 0, y: 0 }, torque: 0 }
  }

  // Rudder authority scales with |surge speed| (STW along the hull) — same idea ahead and astern.
  const waterFlowFactor = Math.min(speedAbs / 2.5, 1)
  /** Astern is weaker than ahead at the same STW, but still grows with flow over the rudder. */
  const REVERSE_RUDDER_AUTHORITY = 0.65
  const rudderEffectiveness = isReverse
    ? waterFlowFactor * REVERSE_RUDDER_AUTHORITY
    : waterFlowFactor

  const lateralForceMag =
    config.rudderArea *
    8500 *
    Math.sin(state.rudderAngle) *
    rudderEffectiveness *
    Math.sign(surgeSpeed)

  const lateralForce = scale(sideways, lateralForceMag)
  const torque =
    -lateralForceMag *
    config.length *
    0.22 *
    (isReverse ? 0.8 : 1) *
    Math.sign(state.rudderAngle || 1)

  return {
    force: lateralForce,
    torque,
  }
}
