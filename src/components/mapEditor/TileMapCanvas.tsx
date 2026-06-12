import { useCallback, useEffect, useRef } from 'react'
import type { TileMap } from '../../simulator/tileMap/types'
import { useTileMapEditorStore, type EditorTool } from '../../store/tileMapEditorStore'
import { OBJECT_COLORS, TERRAIN_COLORS } from './tileColors'

const MIN_ZOOM = 1
const MAX_ZOOM = 24

function applyToolAt(
  tool: EditorTool,
  col: number,
  row: number,
  paintTerrain: (c: number, r: number) => void,
  paintObject: (c: number, r: number) => void,
  eraseCell: (c: number, r: number) => void,
) {
  if (tool === 'pan') return
  if (tool === 'erase') {
    eraseCell(col, row)
    return
  }
  if (tool === 'pole' || tool === 'cleat') {
    paintObject(col, row)
    return
  }
  paintTerrain(col, row)
}

export function TileMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const panDragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const paintDragRef = useRef(false)

  const tileMap = useTileMapEditorStore((s) => s.tileMap)
  const tool = useTileMapEditorStore((s) => s.tool)
  const zoom = useTileMapEditorStore((s) => s.zoom)
  const panX = useTileMapEditorStore((s) => s.panX)
  const panY = useTileMapEditorStore((s) => s.panY)
  const setView = useTileMapEditorStore((s) => s.setView)
  const paintTerrain = useTileMapEditorStore((s) => s.paintTerrain)
  const paintObject = useTileMapEditorStore((s) => s.paintObject)
  const eraseCell = useTileMapEditorStore((s) => s.eraseCell)

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, map: TileMap, pxPerTile: number, offsetX: number, offsetY: number) => {
      const { width, height } = map
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = '#0b1f33'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const tile = map.layers.terrain[row][col]
          ctx.fillStyle = TERRAIN_COLORS[tile]
          ctx.fillRect(
            offsetX + col * pxPerTile,
            offsetY + (height - 1 - row) * pxPerTile,
            pxPerTile,
            pxPerTile,
          )
        }
      }

      ctx.strokeStyle = 'rgba(125, 211, 252, 0.12)'
      ctx.lineWidth = 1
      for (let col = 0; col <= width; col++) {
        const x = offsetX + col * pxPerTile
        ctx.beginPath()
        ctx.moveTo(x, offsetY)
        ctx.lineTo(x, offsetY + height * pxPerTile)
        ctx.stroke()
      }
      for (let row = 0; row <= height; row++) {
        const y = offsetY + row * pxPerTile
        ctx.beginPath()
        ctx.moveTo(offsetX, y)
        ctx.lineTo(offsetX + width * pxPerTile, y)
        ctx.stroke()
      }

      for (const obj of map.layers.objects) {
        const cx = offsetX + (obj.col + 0.5) * pxPerTile
        const cy = offsetY + (height - 1 - obj.row + 0.5) * pxPerTile
        const radius = Math.max(3, pxPerTile * 0.28)
        ctx.fillStyle = OBJECT_COLORS[obj.kind]
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [],
  )

  const screenToCell = useCallback(
    (clientX: number, clientY: number, map: TileMap, pxPerTile: number, offsetX: number, offsetY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const col = Math.floor((x - offsetX) / pxPerTile)
      const row = map.height - 1 - Math.floor((y - offsetY) / pxPerTile)
      if (col < 0 || row < 0 || col >= map.width || row >= map.height) return null
      return { col, row }
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, tileMap, zoom, panX, panY)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    draw(ctx, tileMap, zoom, panX, panY)

    return () => observer.disconnect()
  }, [tileMap, zoom, panX, panY, draw])

  const onWheel = (event: React.WheelEvent) => {
    event.preventDefault()
    const factor = event.deltaY > 0 ? 0.9 : 1.1
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor))
    setView(nextZoom, panX, panY)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    const isPan = tool === 'pan' || event.button === 1 || event.altKey
    if (isPan) {
      panDragRef.current = { x: event.clientX, y: event.clientY, panX, panY }
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    paintDragRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    const cell = screenToCell(event.clientX, event.clientY, tileMap, zoom, panX, panY)
    if (cell) {
      applyToolAt(tool, cell.col, cell.row, paintTerrain, paintObject, eraseCell)
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (panDragRef.current) {
      const dx = event.clientX - panDragRef.current.x
      const dy = event.clientY - panDragRef.current.y
      setView(zoom, panDragRef.current.panX + dx, panDragRef.current.panY + dy)
      return
    }

    if (!paintDragRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    const cell = screenToCell(event.clientX, event.clientY, tileMap, zoom, panX, panY)
    if (cell) {
      applyToolAt(tool, cell.col, cell.row, paintTerrain, paintObject, eraseCell)
    }
  }

  const onPointerUp = (event: React.PointerEvent) => {
    panDragRef.current = null
    paintDragRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-0 min-w-0 flex-1 touch-none">
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-crosshair"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Tile map canvas"
      />
    </div>
  )
}
