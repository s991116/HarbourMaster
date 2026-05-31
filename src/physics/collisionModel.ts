import type { BoatConfig, BoatState, HarbourBounds, StaticObstacle } from './types'
import {
  getBoatHullWorldVertices,
  getObstacleLocalCorners,
} from './boatHullProfile'
import { clamp, dot, fromAngle, length, rotate, sub } from './vector2'

export type CollisionResult = {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  angularVelocity: number
  collided: boolean
}

const HULL_SKIN = 0.08
const MAX_ITERATIONS = 10

type Penetration = {
  depth: number
  normal: { x: number; y: number }
}

function pointInConvexPolygon(
  point: { x: number; y: number },
  polygon: Array<{ x: number; y: number }>,
): boolean {
  let sign = 0
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i]
    const b = polygon[(i + 1) % polygon.length]
    const cross = (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)
    if (Math.abs(cross) < 1e-8) continue
    if (sign === 0) sign = Math.sign(cross)
    else if (Math.sign(cross) !== sign) return false
  }
  return true
}

/** Shortest push to move a point out of a rotated AABB (works for interior points). */
function pointAabbPenetration(
  point: { x: number; y: number },
  obstacle: StaticObstacle,
): Penetration | null {
  const local = rotate(sub(point, obstacle.position), -obstacle.rotation)
  const halfW = obstacle.width * 0.5 + HULL_SKIN
  const halfH = obstacle.height * 0.5 + HULL_SKIN

  const outsideX = Math.abs(local.x) - halfW
  const outsideY = Math.abs(local.y) - halfH

  if (outsideX > 0 && outsideY > 0) {
    return null
  }

  if (outsideX <= 0 && outsideY <= 0) {
    const penLeft = halfW + local.x
    const penRight = halfW - local.x
    const penBottom = halfH + local.y
    const penTop = halfH - local.y
    const minPen = Math.min(penLeft, penRight, penBottom, penTop)

    let localNormal = { x: 0, y: 0 }
    if (minPen === penLeft) localNormal = { x: -1, y: 0 }
    else if (minPen === penRight) localNormal = { x: 1, y: 0 }
    else if (minPen === penBottom) localNormal = { x: 0, y: -1 }
    else localNormal = { x: 0, y: 1 }

    const worldNormal = rotate(localNormal, obstacle.rotation)
    return { depth: minPen, normal: worldNormal }
  }

  const clampedX = clamp(local.x, -halfW, halfW)
  const clampedY = clamp(local.y, -halfH, halfH)
  const dx = local.x - clampedX
  const dy = local.y - clampedY
  const dist = Math.hypot(dx, dy)
  if (dist < 1e-6 || dist >= HULL_SKIN) {
    return null
  }

  const localNormal = { x: dx / dist, y: dy / dist }
  const worldNormal = rotate(localNormal, obstacle.rotation)
  return { depth: HULL_SKIN - dist, normal: worldNormal }
}

function circlePenetration(
  point: { x: number; y: number },
  center: { x: number; y: number },
  radius: number,
): Penetration | null {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const dist = Math.hypot(dx, dy)
  const totalRadius = radius + HULL_SKIN
  if (dist >= totalRadius) return null

  if (dist < 1e-6) {
    return { depth: totalRadius, normal: { x: 1, y: 0 } }
  }

  return {
    depth: totalRadius - dist,
    normal: { x: dx / dist, y: dy / dist },
  }
}

function resolveBoundsPenetration(
  hull: Array<{ x: number; y: number }>,
  bounds: HarbourBounds,
): Penetration | null {
  let maxDepth = 0
  let normal = { x: 0, y: 0 }

  for (const point of hull) {
    if (point.x < bounds.minX) {
      const depth = bounds.minX - point.x
      if (depth > maxDepth) {
        maxDepth = depth
        normal = { x: 1, y: 0 }
      }
    }
    if (point.x > bounds.maxX) {
      const depth = point.x - bounds.maxX
      if (depth > maxDepth) {
        maxDepth = depth
        normal = { x: -1, y: 0 }
      }
    }
    if (point.y < bounds.minY) {
      const depth = bounds.minY - point.y
      if (depth > maxDepth) {
        maxDepth = depth
        normal = { x: 0, y: 1 }
      }
    }
    if (point.y > bounds.maxY) {
      const depth = point.y - bounds.maxY
      if (depth > maxDepth) {
        maxDepth = depth
        normal = { x: 0, y: -1 }
      }
    }
  }

  return maxDepth > 0 ? { depth: maxDepth, normal } : null
}

function findHullObstaclePenetration(
  hull: Array<{ x: number; y: number }>,
  obstacle: StaticObstacle,
  boatCenter: { x: number; y: number },
): Penetration | null {
  let deepest: Penetration | null = null

  if (obstacle.type === 'pole') {
    const radius = Math.min(obstacle.width, obstacle.height) * 0.5
    for (const point of hull) {
      const pen = circlePenetration(point, obstacle.position, radius)
      if (pen && (!deepest || pen.depth > deepest.depth)) deepest = pen
    }
    return deepest
  }

  for (const point of hull) {
    const pen = pointAabbPenetration(point, obstacle)
    if (pen && (!deepest || pen.depth > deepest.depth)) deepest = pen
  }

  for (const corner of getObstacleLocalCorners(obstacle)) {
    if (pointInConvexPolygon(corner, hull)) {
      const awayX = boatCenter.x - obstacle.position.x
      const awayY = boatCenter.y - obstacle.position.y
      const awayLen = Math.hypot(awayX, awayY)
      const normal =
        awayLen > 1e-6
          ? { x: awayX / awayLen, y: awayY / awayLen }
          : { x: 0, y: 1 }
      const pen = { depth: HULL_SKIN + 0.12, normal }
      if (!deepest || pen.depth > deepest.depth) deepest = pen
    }
  }

  return deepest
}

function applyPenetrationResponse(
  velocity: { x: number; y: number },
  angularVelocity: number,
  pen: Penetration,
  restitution: number,
): { velocity: { x: number; y: number }; angularVelocity: number } {
  const vn = dot(velocity, pen.normal)
  if (vn < 0) {
    velocity = {
      x: velocity.x - (1 + restitution) * vn * pen.normal.x,
      y: velocity.y - (1 + restitution) * vn * pen.normal.y,
    }
  }
  return { velocity, angularVelocity: angularVelocity * 0.82 }
}

export function resolveCollisions(
  config: BoatConfig,
  state: BoatState,
  obstacles: StaticObstacle[],
  bounds: HarbourBounds,
): CollisionResult {
  let position = { ...state.position }
  let velocity = { ...state.velocity }
  let angularVelocity = state.angularVelocity
  let collided = false

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const hull = getBoatHullWorldVertices(config, position, state.heading)
    let moved = false

    const boundsPen = resolveBoundsPenetration(hull, bounds)
    if (boundsPen) {
      position.x += boundsPen.normal.x * boundsPen.depth
      position.y += boundsPen.normal.y * boundsPen.depth
      const response = applyPenetrationResponse(velocity, angularVelocity, boundsPen, 0.05)
      velocity = response.velocity
      angularVelocity = response.angularVelocity
      collided = true
      moved = true
    }

    for (const obstacle of obstacles) {
      const hullNow = moved
        ? getBoatHullWorldVertices(config, position, state.heading)
        : hull
      const pen = findHullObstaclePenetration(hullNow, obstacle, position)
      if (!pen) continue

      position.x += pen.normal.x * pen.depth
      position.y += pen.normal.y * pen.depth
      const response = applyPenetrationResponse(
        velocity,
        angularVelocity,
        pen,
        obstacle.restitution,
      )
      velocity = response.velocity
      angularVelocity = response.angularVelocity
      collided = true
      moved = true
    }

    if (!moved) break
  }

  if (collided) {
    velocity.x *= 0.88
    velocity.y *= 0.88
    angularVelocity *= 0.85
  }

  return { position, velocity, angularVelocity, collided }
}

export function getSpeedThroughWater(state: BoatState): number {
  const forward = fromAngle(state.heading)
  return Math.abs(dot(state.velocity, forward))
}

export function getSpeedOverGround(state: BoatState): number {
  return length(state.velocity)
}
