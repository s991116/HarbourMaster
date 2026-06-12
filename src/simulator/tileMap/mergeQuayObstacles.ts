import type { StaticObstacle } from '../../physics/types'
import { vec2 } from '../../physics/vector2'
import { mergeTerrainRects } from './mergeTerrainRects'
import type { TileMap } from './types'

const QUAY_RESTITUTION = 0.08

/** Merge quay terrain cells into axis-aligned StaticObstacle rectangles. */
export function mergeQuayObstacles(map: TileMap): StaticObstacle[] {
  return mergeTerrainRects(map, 'quay').map((rect, index) => ({
    id: `quay-tile-${index}`,
    type: 'quay' as const,
    position: vec2(rect.centerX, rect.centerY),
    width: rect.width,
    height: rect.height,
    rotation: 0,
    restitution: QUAY_RESTITUTION,
  }))
}
