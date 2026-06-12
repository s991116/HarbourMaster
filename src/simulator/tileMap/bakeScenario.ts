import type { HarbourBounds, StaticObstacle } from '../../physics/types'
import { vec2 } from '../../physics/vector2'
import type { PierMooringCleat, Scenario } from '../scenarios'
import { cellCenterWorld } from './cellWorld'
import { mergeQuayObstacles } from './mergeQuayObstacles'
import { mergeTerrainRects } from './mergeTerrainRects'
import type { ObjectMarker, TileMap, TileMapScenarioMeta } from './types'

const POLE_DIAMETER = 0.6
const PARKED_BOAT_LENGTH = 10
const PARKED_BOAT_BEAM = 3.2

function boundsFromGrid(map: TileMap): HarbourBounds {
  if (map.bounds) return map.bounds
  const ts = map.tileSize
  return {
    minX: map.origin.x,
    minY: map.origin.y,
    maxX: map.origin.x + map.width * ts,
    maxY: map.origin.y + map.height * ts,
  }
}

function bakeObjectMarkers(map: TileMap): {
  obstacles: StaticObstacle[]
  pierCleats: PierMooringCleat[]
} {
  const obstacles: StaticObstacle[] = []
  const pierCleats: PierMooringCleat[] = []

  for (const [index, marker] of map.layers.objects.entries()) {
    const center = cellCenterWorld(map, marker.col, marker.row)
    const id = marker.id ?? `obj-${marker.kind}-${index}`

    if (marker.kind === 'pole') {
      obstacles.push({
        id,
        type: 'pole',
        position: vec2(center.x, center.y),
        width: POLE_DIAMETER,
        height: POLE_DIAMETER,
        rotation: 0,
        restitution: 0.05,
      })
      continue
    }

    if (marker.kind === 'cleat') {
      pierCleats.push({ id, position: { x: center.x, y: center.y } })
      continue
    }

    if (marker.kind === 'parked-boat') {
      const rotation = ((marker.rotation ?? 0) * Math.PI) / 180
      obstacles.push({
        id,
        type: 'boat',
        position: vec2(center.x, center.y),
        width: PARKED_BOAT_BEAM,
        height: PARKED_BOAT_LENGTH,
        rotation,
        restitution: 0.12,
      })
    }
  }

  return { obstacles, pierCleats }
}

/** Convert a tile map + metadata into a runtime Scenario. */
export function bakeTileMapScenario(
  tileMap: TileMap,
  meta: TileMapScenarioMeta,
): Scenario {
  const quayObstacles = mergeQuayObstacles(tileMap)
  const { obstacles: objectObstacles, pierCleats } = bakeObjectMarkers(tileMap)
  const landPatches = mergeTerrainRects(tileMap, 'land').map((rect, index) => ({
    id: `land-tile-${index}`,
    position: { x: rect.centerX, y: rect.centerY },
    width: rect.width,
    height: rect.height,
  }))

  return {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    objective: meta.objective,
    boatConfig: meta.boatConfig,
    initialState: meta.initialState,
    wind: meta.wind,
    bounds: boundsFromGrid(tileMap),
    obstacles: [...quayObstacles, ...objectObstacles],
    pierCleats,
    landPatches,
  }
}

export function createEmptyTerrain(
  width: number,
  height: number,
  fill: TileMap['layers']['terrain'][0][0] = 'water',
): TileMap['layers']['terrain'] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill))
}

export function fillWorldRectWithTerrain(
  map: TileMap,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  tile: TileMap['layers']['terrain'][0][0],
): void {
  const ts = map.tileSize
  const colStart = Math.max(0, Math.floor((minX - map.origin.x) / ts))
  const colEnd = Math.min(map.width - 1, Math.ceil((maxX - map.origin.x) / ts) - 1)
  const rowStart = Math.max(0, Math.floor((minY - map.origin.y) / ts))
  const rowEnd = Math.min(map.height - 1, Math.ceil((maxY - map.origin.y) / ts) - 1)

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      map.layers.terrain[row][col] = tile
    }
  }
}

export function cloneTileMap(map: TileMap): TileMap {
  return {
    ...map,
    origin: { ...map.origin },
    bounds: map.bounds ? { ...map.bounds } : undefined,
    layers: {
      terrain: map.layers.terrain.map((row) => [...row]),
      objects: map.layers.objects.map((o) => ({ ...o })),
    },
  }
}

export function parseTileMapJson(json: string): TileMap {
  const data = JSON.parse(json) as TileMap
  if (!data.layers?.terrain || !Array.isArray(data.layers.terrain)) {
    throw new Error('Invalid tile map: missing terrain layer')
  }
  return data
}

export function serializeTileMap(map: TileMap): string {
  return JSON.stringify(map, null, 2)
}

export type { ObjectMarker }
