import type { BoatConfig, StaticObstacle } from './types'
import { rotate, vec2 } from './vector2'

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
