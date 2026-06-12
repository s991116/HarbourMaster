import { mergedRectWorld } from './cellWorld'
import type { TerrainTile, TileMap } from './types'

export type MergedTileRect = {
  centerX: number
  centerY: number
  width: number
  height: number
}

type TileRun = {
  colStart: number
  colEnd: number
  rowStart: number
  rowEnd: number
}

/** Merge adjacent terrain cells of one type into axis-aligned rectangles. */
export function mergeTerrainRects(map: TileMap, tile: TerrainTile): MergedTileRect[] {
  const { terrain } = map.layers
  const height = terrain.length
  if (height === 0) return []
  const width = terrain[0].length

  const runs: TileRun[] = []

  for (let row = 0; row < height; row++) {
    let col = 0
    while (col < width) {
      while (col < width && terrain[row][col] !== tile) col++
      if (col >= width) break
      const colStart = col
      while (col < width && terrain[row][col] === tile) col++
      runs.push({ colStart, colEnd: col - 1, rowStart: row, rowEnd: row })
    }
  }

  const merged: TileRun[] = []
  const used = new Array(runs.length).fill(false)

  for (let i = 0; i < runs.length; i++) {
    if (used[i]) continue
    let block = { ...runs[i] }
    used[i] = true

    let extended = true
    while (extended) {
      extended = false
      for (let j = i + 1; j < runs.length; j++) {
        if (used[j]) continue
        const run = runs[j]
        if (
          run.colStart === block.colStart &&
          run.colEnd === block.colEnd &&
          run.rowStart === block.rowEnd + 1
        ) {
          block.rowEnd = run.rowEnd
          used[j] = true
          extended = true
        }
      }
    }

    merged.push(block)
  }

  return merged.map((block) =>
    mergedRectWorld(map, block.colStart, block.colEnd, block.rowStart, block.rowEnd),
  )
}
