import type { BoatConfig, BoatState, HarbourBounds, StaticObstacle } from './types'
import { clamp, dot, fromAngle, length, rotate, sub } from './vector2'

export type CollisionResult = {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  angularVelocity: number
  collided: boolean
}

function getBoatCorners(
  state: BoatState,
  config: BoatConfig,
): Array<{ x: number; y: number }> {
  const halfLength = config.length * 0.5
  const halfBeam = config.beam * 0.5
  const localCorners = [
    { x: -halfBeam, y: halfLength },
    { x: halfBeam, y: halfLength },
    { x: halfBeam, y: -halfLength },
    { x: -halfBeam, y: -halfLength },
  ]

  return localCorners.map((corner) => {
    const rotated = rotate(corner, state.heading)
    return {
      x: state.position.x + rotated.x,
      y: state.position.y + rotated.y,
    }
  })
}

function resolveCircleCollision(
  point: { x: number; y: number },
  center: { x: number; y: number },
  radius: number,
  velocity: { x: number; y: number },
  restitution: number,
): {
  point: { x: number; y: number }
  velocity: { x: number; y: number }
  hit: boolean
} {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const dist = Math.hypot(dx, dy)
  if (dist >= radius) {
    return { point, velocity, hit: false }
  }

  const nx = dist > 1e-6 ? dx / dist : 1
  const ny = dist > 1e-6 ? dy / dist : 0
  const penetration = radius - dist

  const newPoint = {
    x: point.x + nx * penetration,
    y: point.y + ny * penetration,
  }

  const vn = velocity.x * nx + velocity.y * ny
  if (vn >= 0) {
    return { point: newPoint, velocity, hit: true }
  }

  const newVelocity = {
    x: velocity.x - (1 + restitution) * vn * nx,
    y: velocity.y - (1 + restitution) * vn * ny,
  }

  return { point: newPoint, velocity: newVelocity, hit: true }
}

function resolveAabbCollision(
  point: { x: number; y: number },
  obstacle: StaticObstacle,
  velocity: { x: number; y: number },
): {
  point: { x: number; y: number }
  velocity: { x: number; y: number }
  hit: boolean
} {
  const local = rotate(
    sub(point, obstacle.position),
    -obstacle.rotation,
  )

  const halfW = obstacle.width * 0.5
  const halfH = obstacle.height * 0.5
  const margin = 0.05

  const clampedX = clamp(local.x, -halfW, halfW)
  const clampedY = clamp(local.y, -halfH, halfH)

  const dx = local.x - clampedX
  const dy = local.y - clampedY
  const distSq = dx * dx + dy * dy

  if (distSq > margin * margin) {
    return { point, velocity, hit: false }
  }

  const dist = Math.max(Math.sqrt(distSq), 1e-6)
  const nx = dx / dist
  const ny = dy / dist
  const penetration = margin - dist

  const correctedLocal = {
    x: local.x + nx * penetration,
    y: local.y + ny * penetration,
  }

  const worldCorrected = rotate(correctedLocal, obstacle.rotation)
  const newPoint = {
    x: obstacle.position.x + worldCorrected.x,
    y: obstacle.position.y + worldCorrected.y,
  }

  const worldNormal = rotate({ x: nx, y: ny }, obstacle.rotation)
  const vn = velocity.x * worldNormal.x + velocity.y * worldNormal.y
  if (vn >= 0) {
    return { point: newPoint, velocity, hit: true }
  }

  const restitution = obstacle.restitution
  const newVelocity = {
    x: velocity.x - (1 + restitution) * vn * worldNormal.x,
    y: velocity.y - (1 + restitution) * vn * worldNormal.y,
  }

  return { point: newPoint, velocity: newVelocity, hit: true }
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

  for (let iteration = 0; iteration < 3; iteration++) {
    const testState = { ...state, position, velocity, angularVelocity }
    const corners = getBoatCorners(testState, config)

    for (const corner of corners) {
      if (corner.x < bounds.minX) {
        position.x += bounds.minX - corner.x
        velocity.x = Math.abs(velocity.x) * 0.15
        collided = true
      }
      if (corner.x > bounds.maxX) {
        position.x -= corner.x - bounds.maxX
        velocity.x = -Math.abs(velocity.x) * 0.15
        collided = true
      }
      if (corner.y < bounds.minY) {
        position.y += bounds.minY - corner.y
        velocity.y = Math.abs(velocity.y) * 0.15
        collided = true
      }
      if (corner.y > bounds.maxY) {
        position.y -= corner.y - bounds.maxY
        velocity.y = -Math.abs(velocity.y) * 0.15
        collided = true
      }
    }

    for (const obstacle of obstacles) {
      for (const corner of corners) {
        if (obstacle.type === 'pole') {
          const radius = Math.min(obstacle.width, obstacle.height) * 0.5
          const result = resolveCircleCollision(
            corner,
            obstacle.position,
            radius + 0.15,
            velocity,
            obstacle.restitution,
          )
          if (result.hit) {
            collided = true
            velocity = result.velocity
            const offset = sub(result.point, corner)
            position.x += offset.x
            position.y += offset.y
            angularVelocity *= 0.7
          }
        } else {
          const result = resolveAabbCollision(corner, obstacle, velocity)
          if (result.hit) {
            collided = true
            velocity = result.velocity
            const offset = sub(result.point, corner)
            position.x += offset.x
            position.y += offset.y
            angularVelocity *= 0.75
          }
        }
      }
    }
  }

  if (collided) {
    velocity.x *= 0.92
    velocity.y *= 0.92
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
