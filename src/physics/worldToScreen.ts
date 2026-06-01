import type { Vector2 } from './vector2'

/** R3F viewport (world units visible across canvas). */
export type ScreenViewport = {
  width: number
  height: number
}

/**
 * Map physics world X/Y (Three.js X/Z) to viewport pixel coordinates.
 * Tuned for the harbour orthographic camera (Y-up, view down −Y, up −Z).
 */
export function worldToScreenPixels(
  world: Vector2,
  viewport: ScreenViewport,
  canvasRect: DOMRect,
): { x: number; y: number } {
  const x = canvasRect.left + canvasRect.width * (0.5 + world.x / viewport.width)
  const y = canvasRect.top + canvasRect.height * (0.5 + world.y / viewport.height)
  return { x, y }
}
