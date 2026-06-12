import type { ObjectMarkerKind, TerrainTile } from '../../simulator/tileMap/types'

export const TERRAIN_COLORS: Record<TerrainTile, string> = {
  water: '#1a4d5c',
  quay: '#64748b',
  land: '#3d4f3d',
}

export const OBJECT_COLORS: Record<ObjectMarkerKind, string> = {
  pole: '#475569',
  cleat: '#f97316',
  'parked-boat': '#94a3b8',
}
