import type { BoatConfig, BoatState, HarbourBounds, Wind } from '../../physics/types'
import type { ScenarioId } from '../scenarios'

/** Default cell size in world metres. */
export const DEFAULT_TILE_SIZE = 1

/** Collision-relevant ground cells. */
export type TerrainTile = 'water' | 'quay' | 'land'

export type ObjectMarkerKind = 'pole' | 'cleat' | 'parked-boat'

export type ObjectMarker = {
  col: number
  row: number
  kind: ObjectMarkerKind
  /** Degrees; used for parked-boat. */
  rotation?: number
  id?: string
}

export type TileMapLayers = {
  terrain: TerrainTile[][]
  objects: ObjectMarker[]
}

/** Authoring format for harbour layouts. */
export type TileMap = {
  tileSize: number
  origin: { x: number; y: number }
  width: number
  height: number
  bounds?: HarbourBounds
  layers: TileMapLayers
}

/** Scenario fields not derived from the grid. */
export type TileMapScenarioMeta = {
  id: ScenarioId
  name: string
  description: string
  objective: string
  boatConfig: BoatConfig
  initialState: BoatState
  wind: Wind
}

export type BakedTileScenario = TileMapScenarioMeta & {
  tileMap: TileMap
}
