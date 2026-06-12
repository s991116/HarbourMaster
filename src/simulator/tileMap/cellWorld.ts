import type { TileMap } from './types'

export function cellWorldRect(
  map: TileMap,
  col: number,
  row: number,
): { minX: number; minY: number; maxX: number; maxY: number } {
  const ts = map.tileSize
  return {
    minX: map.origin.x + col * ts,
    minY: map.origin.y + row * ts,
    maxX: map.origin.x + (col + 1) * ts,
    maxY: map.origin.y + (row + 1) * ts,
  }
}

export function cellCenterWorld(
  map: TileMap,
  col: number,
  row: number,
): { x: number; y: number } {
  const rect = cellWorldRect(map, col, row)
  return {
    x: (rect.minX + rect.maxX) * 0.5,
    y: (rect.minY + rect.maxY) * 0.5,
  }
}

export function mergedRectWorld(
  map: TileMap,
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
): { centerX: number; centerY: number; width: number; height: number } {
  const ts = map.tileSize
  const minX = map.origin.x + colStart * ts
  const maxX = map.origin.x + (colEnd + 1) * ts
  const minY = map.origin.y + rowStart * ts
  const maxY = map.origin.y + (rowEnd + 1) * ts
  return {
    centerX: (minX + maxX) * 0.5,
    centerY: (minY + maxY) * 0.5,
    width: maxX - minX,
    height: maxY - minY,
  }
}
