import type { BoatConfig, BoatState } from './types'
import { dot, fromAngle, scale } from './vector2'

/** Linear viscous fraction of each directional drag coefficient (brings boat to rest) */
const LINEAR_DRAG_FRACTION = 0.4

/**
 * Directional water resistance in the boat body frame.
 * Ahead, astern, and sideways each use their own coefficient.
 * Quadratic term models hydrodynamic drag; linear term ensures the boat settles to rest.
 */
function axisDrag(speed: number, coefficient: number): number {
  return -(speed * Math.abs(speed) * coefficient + speed * coefficient * LINEAR_DRAG_FRACTION)
}

export function computeWaterDrag(
  config: BoatConfig,
  state: BoatState,
): { x: number; y: number } {
  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)

  const surge = dot(state.velocity, forward)
  const sway = dot(state.velocity, sideways)

  const surgeCoeff = surge >= 0 ? config.dragAhead : config.dragAstern
  const surgeDrag = axisDrag(surge, surgeCoeff)
  const swayDrag = axisDrag(sway, config.dragSideways)

  const dragAlongSurge = scale(forward, surgeDrag)
  const dragAlongSway = scale(sideways, swayDrag)

  return {
    x: dragAlongSurge.x + dragAlongSway.x,
    y: dragAlongSurge.y + dragAlongSway.y,
  }
}

/**
 * Yaw resistance in water: opposes angular velocity so the boat stops turning
 * when rudder/prop torque is removed. Includes hull coupling from lateral drag.
 */
export function computeAngularDamping(
  config: BoatConfig,
  state: BoatState,
): number {
  const { angularVelocity } = state

  const hullCoupling =
    config.dragSideways * config.length * config.beam * 0.000008

  const linear =
    -angularVelocity *
    (config.angularDragLinear + hullCoupling)

  const quadratic =
    -angularVelocity *
    Math.abs(angularVelocity) *
    (config.angularDragQuadratic + hullCoupling * 0.5)

  return linear + quadratic
}
