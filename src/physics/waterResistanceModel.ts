import type { BoatConfig, BoatState } from './types'
import { dot, fromAngle, scale } from './vector2'

export function computeWaterDrag(
  config: BoatConfig,
  state: BoatState,
): { x: number; y: number } {
  const forward = fromAngle(state.heading)
  const sideways = fromAngle(state.heading + Math.PI / 2)

  const surge = dot(state.velocity, forward)
  const sway = dot(state.velocity, sideways)

  const surgeDrag = -surge * Math.abs(surge) * config.dragForward
  const swayDrag = -sway * Math.abs(sway) * config.dragSideways

  const dragForward = scale(forward, surgeDrag)
  const dragSideways = scale(sideways, swayDrag)

  return {
    x: dragForward.x + dragSideways.x,
    y: dragForward.y + dragSideways.y,
  }
}

export function computeAngularDamping(
  config: BoatConfig,
  angularVelocity: number,
): number {
  const damping = config.keelType === 'long-keel' ? 4200 : 2600
  return -angularVelocity * Math.abs(angularVelocity) * damping * 0.001
}
