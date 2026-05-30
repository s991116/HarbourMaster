import type { BoatConfig, BoatState, Wind } from './types'
import { fromAngle, scale } from './vector2'

export type WindForces = {
  force: { x: number; y: number }
  torque: number
}

export function computeWindForces(
  config: BoatConfig,
  state: BoatState,
  wind: Wind,
): WindForces {
  const windVector = scale(fromAngle(wind.direction), wind.speed)
  const relativeWind = {
    x: windVector.x - state.velocity.x,
    y: windVector.y - state.velocity.y,
  }

  const relativeSpeed = Math.hypot(relativeWind.x, relativeWind.y)
  if (relativeSpeed < 0.01) {
    return { force: { x: 0, y: 0 }, torque: 0 }
  }

  const forceMag =
    0.5 *
    1.225 *
    config.windageArea *
    relativeSpeed *
    relativeSpeed *
    0.035

  const forceDirection = {
    x: relativeWind.x / relativeSpeed,
    y: relativeWind.y / relativeSpeed,
  }

  const force = scale(forceDirection, forceMag)

  const windAngle = Math.atan2(relativeWind.x, relativeWind.y)
  const relativeAngle = windAngle - state.heading
  const windTorque =
    Math.sin(relativeAngle * 2) * forceMag * config.length * 0.04

  return { force, torque: windTorque }
}
