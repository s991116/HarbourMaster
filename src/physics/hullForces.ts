import type { Vector2 } from './vector2'
import { scale } from './vector2'

/**
 * 2D rigid-body torque from a world-frame force applied at a world-frame offset
 * from the centre of mass. Linear integration still uses F/m at the CoM.
 */
export function torqueFromOffsetForce(offsetFromCoM: Vector2, force: Vector2): number {
  return offsetFromCoM.x * force.y - offsetFromCoM.y * force.x
}

/** World-frame vector from CoM toward the stern (aft along the hull). */
export function sternOffsetFromCoM(forward: Vector2, hullLength: number, armFraction: number): Vector2 {
  return scale(forward, -hullLength * armFraction)
}
