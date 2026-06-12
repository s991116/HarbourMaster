import { create } from 'zustand'
import { cloneTileMap } from '../simulator/tileMap/bakeScenario'
import { EMPTY_BASIN_TILE_MAP } from '../simulator/tileMap/maps/emptyBasin'
import type { ObjectMarkerKind, TerrainTile, TileMap } from '../simulator/tileMap/types'

export type EditorTool =
  | 'pan'
  | 'water'
  | 'quay'
  | 'land'
  | 'pole'
  | 'cleat'
  | 'erase'

type TileMapEditorStore = {
  tileMap: TileMap
  tool: EditorTool
  zoom: number
  panX: number
  panY: number
  setTool: (tool: EditorTool) => void
  setView: (zoom: number, panX: number, panY: number) => void
  setTileMap: (map: TileMap) => void
  paintTerrain: (col: number, row: number) => void
  paintObject: (col: number, row: number) => void
  eraseCell: (col: number, row: number) => void
  resetToEmptyBasin: () => void
}

function defaultView() {
  return { zoom: 4, panX: 80, panY: 80 }
}

export const useTileMapEditorStore = create<TileMapEditorStore>((set, get) => ({
  tileMap: cloneTileMap(EMPTY_BASIN_TILE_MAP),
  tool: 'quay',
  ...defaultView(),

  setTool: (tool) => set({ tool }),

  setView: (zoom, panX, panY) => set({ zoom, panX, panY }),

  setTileMap: (map) => set({ tileMap: cloneTileMap(map) }),

  paintTerrain: (col, row) => {
    const { tileMap, tool } = get()
    if (tool !== 'water' && tool !== 'quay' && tool !== 'land') return
    if (row < 0 || col < 0 || row >= tileMap.height || col >= tileMap.width) return

    const terrain = tileMap.layers.terrain.map((r, ri) =>
      r.map((cell, ci) => (ri === row && ci === col ? (tool as TerrainTile) : cell)),
    )
    const objects = tileMap.layers.objects.filter((o) => !(o.col === col && o.row === row))

    set({
      tileMap: {
        ...tileMap,
        layers: { terrain, objects },
      },
    })
  },

  paintObject: (col, row) => {
    const { tileMap, tool } = get()
    if (tool !== 'pole' && tool !== 'cleat') return
    if (row < 0 || col < 0 || row >= tileMap.height || col >= tileMap.width) return

    const kind = tool as ObjectMarkerKind
    const objects = tileMap.layers.objects.filter((o) => !(o.col === col && o.row === row))
    objects.push({ col, row, kind })

    set({
      tileMap: {
        ...tileMap,
        layers: { ...tileMap.layers, objects },
      },
    })
  },

  eraseCell: (col, row) => {
    const { tileMap } = get()
    if (row < 0 || col < 0 || row >= tileMap.height || col >= tileMap.width) return

    const terrain = tileMap.layers.terrain.map((r, ri) =>
      r.map((cell, ci) => (ri === row && ci === col ? 'water' : cell)),
    )
    const objects = tileMap.layers.objects.filter((o) => !(o.col === col && o.row === row))

    set({
      tileMap: {
        ...tileMap,
        layers: { terrain, objects },
      },
    })
  },

  resetToEmptyBasin: () =>
    set({
      tileMap: cloneTileMap(EMPTY_BASIN_TILE_MAP),
      ...defaultView(),
    }),
}))
