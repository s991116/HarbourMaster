import { vec2 } from '../../../physics/vector2'
import { FIN_KEEL_BOAT } from '../../../physics/boatPresets'
import {
  createEmptyTerrain,
  fillWorldRectWithTerrain,
} from '../bakeScenario'
import type { TileMap, TileMapScenarioMeta } from '../types'
import { DEFAULT_TILE_SIZE } from '../types'

const BOUNDS = {
  minX: -55,
  maxX: 55,
  minY: -55,
  maxY: 55,
}

const EDGE_THICKNESS = 6
const SIDE_INSET = 0
const VERTICAL_INSET = 5

function buildEmptyBasinTerrain(): TileMap['layers']['terrain'] {
  const width = BOUNDS.maxX - BOUNDS.minX
  const height = BOUNDS.maxY - BOUNDS.minY
  const map: TileMap = {
    tileSize: DEFAULT_TILE_SIZE,
    origin: { x: BOUNDS.minX, y: BOUNDS.minY },
    width,
    height,
    bounds: BOUNDS,
    layers: {
      terrain: createEmptyTerrain(width, height, 'water'),
      objects: [],
    },
  }

  const innerMinX = BOUNDS.minX + SIDE_INSET
  const innerMaxX = BOUNDS.maxX - SIDE_INSET
  const innerMinY = BOUNDS.minY + VERTICAL_INSET
  const innerMaxY = BOUNDS.maxY - VERTICAL_INSET
  const innerDepth = innerMaxY - innerMinY

  fillWorldRectWithTerrain(
    map,
    innerMinX,
    innerMaxY - EDGE_THICKNESS,
    innerMaxX,
    innerMaxY,
    'quay',
  )
  fillWorldRectWithTerrain(
    map,
    innerMinX,
    innerMinY,
    innerMaxX,
    innerMinY + EDGE_THICKNESS,
    'quay',
  )
  fillWorldRectWithTerrain(
    map,
    innerMaxX - EDGE_THICKNESS,
    innerMinY + EDGE_THICKNESS,
    innerMaxX,
    innerMinY + EDGE_THICKNESS + (innerDepth - EDGE_THICKNESS * 2),
    'quay',
  )
  fillWorldRectWithTerrain(
    map,
    innerMinX,
    innerMinY + EDGE_THICKNESS,
    innerMinX + EDGE_THICKNESS,
    innerMinY + EDGE_THICKNESS + (innerDepth - EDGE_THICKNESS * 2),
    'quay',
  )

  return map.layers.terrain
}

export const EMPTY_BASIN_TILE_MAP: TileMap = {
  tileSize: DEFAULT_TILE_SIZE,
  origin: { x: BOUNDS.minX, y: BOUNDS.minY },
  width: BOUNDS.maxX - BOUNDS.minX,
  height: BOUNDS.maxY - BOUNDS.minY,
  bounds: BOUNDS,
  layers: {
    terrain: buildEmptyBasinTerrain(),
    objects: [],
  },
}

export const EMPTY_BASIN_TILE_META: TileMapScenarioMeta = {
  id: 'empty-basin',
  name: 'Empty basin',
  description: 'Open basin enclosed by a uniform perimeter edge.',
  objective: 'Learn speed, inertia, and prop walk in astern gear.',
  boatConfig: FIN_KEEL_BOAT,
  initialState: {
    position: vec2(0, -30),
    heading: 0,
    velocity: vec2(),
    angularVelocity: 0,
    throttle: 0,
    rudderAngle: 0,
  },
  wind: { speed: 0, direction: Math.PI * 0.75 },
}
