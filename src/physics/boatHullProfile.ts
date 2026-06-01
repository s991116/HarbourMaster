import type { BoatConfig, StaticObstacle } from './types'
import { rotate, vec2, type Vector2 } from './vector2'

/** Tapered top-down hull outline in boat-local space (bow = +Y, port = −X). */
export function getBoatHullLocalVertices(config: BoatConfig): Array<{ x: number; y: number }> {
  const halfLength = config.length * 0.5
  const halfBeam = config.beam * 0.5

  return [
    vec2(0, halfLength),
    vec2(-halfBeam * 0.9, halfLength * 0.62),
    vec2(-halfBeam, halfLength * 0.1),
    vec2(-halfBeam, -halfLength * 0.38),
    vec2(-halfBeam * 0.82, -halfLength * 0.9),
    vec2(0, -halfLength * 0.96),
    vec2(halfBeam * 0.82, -halfLength * 0.9),
    vec2(halfBeam, -halfLength * 0.38),
    vec2(halfBeam, halfLength * 0.1),
    vec2(halfBeam * 0.9, halfLength * 0.62),
  ]
}

/**
 * Half-beam (|x|) where the hull outline crosses station y (port and starboard equal).
 * Matches the tapered top-down sprite / collision outline.
 */
export function getHullHalfBeamAtY(config: BoatConfig, y: number): number {
  const hull = getBoatHullLocalVertices(config)
  let halfBeam = 0

  for (let i = 0; i < hull.length; i++) {
    const a = hull[i]
    const b = hull[(i + 1) % hull.length]
    const yMin = Math.min(a.y, b.y)
    const yMax = Math.max(a.y, b.y)
    if (y < yMin - 1e-6 || y > yMax + 1e-6) continue

    if (Math.abs(b.y - a.y) < 1e-8) {
      halfBeam = Math.max(halfBeam, Math.abs(a.x))
      continue
    }

    const t = (y - a.y) / (b.y - a.y)
    const x = a.x + t * (b.x - a.x)
    halfBeam = Math.max(halfBeam, Math.abs(x))
  }

  if (halfBeam < 1e-6) {
    return config.beam * 0.5
  }

  return halfBeam
}

/** Boat-local → world using Three.js `rotation.y` (matches rendered boat / cleats). */
export function boatLocalToWorldForDisplay(
  local: Vector2,
  boatPosition: Vector2,
  heading: number,
): Vector2 {
  const rotated = rotate(local, -heading)
  return { x: boatPosition.x + rotated.x, y: boatPosition.y + rotated.y }
}

/** Hull outline in world space, aligned with the rendered boat (not physics `rotate`). */
export function getBoatHullWorldVerticesForDisplay(
  config: BoatConfig,
  position: { x: number; y: number },
  heading: number,
): Array<{ x: number; y: number }> {
  return getBoatHullLocalVertices(config).map((local) =>
    boatLocalToWorldForDisplay(local, position, heading),
  )
}

export function getBoatHullWorldVertices(
  config: BoatConfig,
  position: { x: number; y: number },
  heading: number,
): Array<{ x: number; y: number }> {
  return getBoatHullLocalVertices(config).map((local) => {
    const rotated = rotate(local, heading)
    return { x: position.x + rotated.x, y: position.y + rotated.y }
  })
}

export function getObstacleLocalCorners(
  obstacle: StaticObstacle,
): Array<{ x: number; y: number }> {
  const halfW = obstacle.width * 0.5
  const halfH = obstacle.height * 0.5
  return [
    vec2(-halfW, -halfH),
    vec2(halfW, -halfH),
    vec2(halfW, halfH),
    vec2(-halfW, halfH),
  ].map((local) => {
    const rotated = rotate(local, obstacle.rotation)
    return {
      x: obstacle.position.x + rotated.x,
      y: obstacle.position.y + rotated.y,
    }
  })
}
