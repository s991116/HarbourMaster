import { DEFAULT_MAX_RUDDER_ANGLE_RAD } from '../controls/controlSteps'
import type { BoatConfig, BoatState } from './types'
import { sternOffsetFromCoM, torqueFromOffsetForce } from './hullForces'
import { clamp, dot, fromAngle, scale } from './vector2'

/** Lateral-force coefficient (N per m² rudder per unit sin(angle) at full water flow). */
const RUDDER_LIFT_COEFFICIENT = 4200
/** Distance from CoM to rudder as a fraction of hull length (aft). */
const RUDDER_STERN_ARM_FRACTION = 0.45
/** Surge speed (m/s) for full rudder authority. */
const RUDDER_SPEED_FOR_FULL_AUTHORITY = 2.5
/** Astern rudder authority relative to ahead at the same STW. */
const REVERSE_RUDDER_AUTHORITY = 0.65

export const clampRudderAngle = (
  angle: number,
  maxAngle = DEFAULT_MAX_RUDDER_ANGLE_RAD,
): number => clamp(angle, -maxAngle, maxAngle)

export type RudderForces = {
  force: { x: number; y: number }
  torque: number
}

function rudderWaterFlowFactor(speedAbs: number): number {
  return Math.min(speedAbs / RUDDER_SPEED_FOR_FULL_AUTHORITY, 1)
}

function rudderEffectiveness(surgeSpeed: number, speedAbs: number): number {
  const flow = rudderWaterFlowFactor(speedAbs)
  const isReverse = surgeSpeed < -0.05
  return isReverse ? flow * REVERSE_RUDDER_AUTHORITY : flow
}

/**
 * Rudder lateral force at the stern; yaw comes from the stern lever arm (r × F),
 * not a separate torque term. Recalibrated vs the old CoM force + 0.22·L hack
 * so similar turn rate at lower sideslip.
 */
export function computeRudderForces(
  config: BoatConfig,
  state: BoatState,
): RudderForces {
  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)

  const surgeSpeed = dot(state.velocity, forward)
  const speedAbs = Math.abs(surgeSpeed)

  if (speedAbs < 0.02) {
    return { force: { x: 0, y: 0 }, torque: 0 }
  }

  const effectiveness = rudderEffectiveness(surgeSpeed, speedAbs)

  const lateralForceMag =
    config.rudderArea *
    RUDDER_LIFT_COEFFICIENT *
    Math.sin(state.rudderAngle) *
    effectiveness *
    Math.sign(surgeSpeed)

  const force = scale(sideways, lateralForceMag)
  const sternOffset = sternOffsetFromCoM(forward, config.length, RUDDER_STERN_ARM_FRACTION)
  const torque = torqueFromOffsetForce(sternOffset, force)

  return {
    force: { x: force.x, y: force.y },
    torque,
  }
}
