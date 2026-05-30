import type { BoatConfig, BoatState } from './types'
import { clamp, dot, fromAngle, scale } from './vector2'

export type PropellerForces = {
  force: { x: number; y: number }
  torque: number
  isReverse: boolean
  propWalkActive: boolean
}

export function computePropellerForces(
  config: BoatConfig,
  state: BoatState,
  reverseTime: number,
): PropellerForces {
  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)
  const surgeSpeed = dot(state.velocity, forward)

  const thrust = state.throttle * config.enginePower
  const thrustForce = scale(forward, thrust)

  const isReverse = state.throttle < -0.02
  let propWalkForce = { x: 0, y: 0 }
  let propWalkTorque = 0
  let propWalkActive = false

  if (isReverse) {
    const speedAbs = Math.abs(surgeSpeed)
    const lowSpeedFactor = clamp(1 - speedAbs / 1.6, 0.15, 1)
    const shiftBoost = clamp(1.8 - reverseTime * 0.9, 0.4, 1.8)

    const rotationSign =
      config.propellerRotation === 'clockwise' ? 1 : -1
    const lateralMag =
      Math.abs(state.throttle) *
      config.enginePower *
      0.11 *
      lowSpeedFactor *
      shiftBoost

    propWalkForce = scale(sideways, lateralMag * rotationSign)
    propWalkTorque =
      lateralMag * rotationSign * config.length * 0.08 * -1
    propWalkActive = lateralMag > 50
  }

  return {
    force: {
      x: thrustForce.x + propWalkForce.x,
      y: thrustForce.y + propWalkForce.y,
    },
    torque: propWalkTorque,
    isReverse,
    propWalkActive,
  }
}
