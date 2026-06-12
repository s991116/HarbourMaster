import type { Scenario, ScenarioId } from '../scenarios'
import { bakeTileMapScenario, parseTileMapJson } from './bakeScenario'
import { EMPTY_BASIN_TILE_MAP, EMPTY_BASIN_TILE_META } from './maps/emptyBasin'
import type { TileMap, TileMapScenarioMeta } from './types'
import { cloneTileMap } from './bakeScenario'

const TILE_SOURCE_BY_ID: Partial<Record<ScenarioId, TileMap>> = {
  'empty-basin': EMPTY_BASIN_TILE_MAP,
}

const TILE_META_BY_ID: Partial<Record<ScenarioId, TileMapScenarioMeta>> = {
  'empty-basin': EMPTY_BASIN_TILE_META,
}

const SESSION_OVERRIDE_KEY = 'harbourmaster:tilemap-override:empty-basin'

const bakedCache = new Map<ScenarioId, Scenario>()
const overrides = new Map<ScenarioId, TileMap>()

function loadSessionOverrides(): void {
  if (typeof sessionStorage === 'undefined') return
  const raw = sessionStorage.getItem(SESSION_OVERRIDE_KEY)
  if (!raw) return
  try {
    overrides.set('empty-basin', parseTileMapJson(raw))
  } catch {
    sessionStorage.removeItem(SESSION_OVERRIDE_KEY)
  }
}

loadSessionOverrides()

function bakeForId(id: ScenarioId): Scenario | null {
  const override = overrides.get(id)
  const source = override ?? TILE_SOURCE_BY_ID[id]
  const meta = TILE_META_BY_ID[id]
  if (!source || !meta) return null

  if (!override) {
    const cached = bakedCache.get(id)
    if (cached) return cached
  }

  const scenario = bakeTileMapScenario(cloneTileMap(source), meta)
  if (!override) {
    bakedCache.set(id, scenario)
  }
  return scenario
}

export function isTileBackedScenario(id: ScenarioId): boolean {
  return id in TILE_SOURCE_BY_ID || overrides.has(id)
}

export function getBakedTileScenario(id: ScenarioId): Scenario | null {
  return bakeForId(id)
}

/** Session override (e.g. from map editor Play). */
export function registerTileMapOverride(id: ScenarioId, map: TileMap): Scenario {
  const cloned = cloneTileMap(map)
  overrides.set(id, cloned)
  bakedCache.delete(id)
  if (id === 'empty-basin' && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(SESSION_OVERRIDE_KEY, JSON.stringify(cloned))
  }
  return bakeForId(id)!
}

export function clearTileMapOverride(id: ScenarioId): void {
  overrides.delete(id)
  bakedCache.delete(id)
}

export function getTileMapSource(id: ScenarioId): TileMap | null {
  const override = overrides.get(id)
  if (override) return cloneTileMap(override)
  const source = TILE_SOURCE_BY_ID[id]
  return source ? cloneTileMap(source) : null
}
