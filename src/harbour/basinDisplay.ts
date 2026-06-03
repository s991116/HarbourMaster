import type { HarbourBounds } from '../physics/types'
import type { Vector2 } from '../physics/vector2'

/** Generic basin uses physics world units; display scale maps them to pixels. */
export const BASIN_VIEW_FIT_MARGIN = 0.92

/** Cleat marker diameter in world units (scales with basin display). */
export const CLEAT_MARKER_WORLD_DIAMETER = 1.4

export type BasinDisplayMetrics = {
  bounds: HarbourBounds
  pixelsPerWorldUnit: number
  canvasWidth: number
  canvasHeight: number
}

export function basinViewAspectRatio(bounds: HarbourBounds): number {
  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY
  if (height <= 0) return 1
  return width / height
}

export function basinWorldSize(bounds: HarbourBounds): { width: number; height: number } {
  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  }
}

/** Pixels per world unit when the full basin bounds are fitted to the canvas. */
export function pixelsPerWorldUnitForFit(
  canvasWidth: number,
  canvasHeight: number,
  bounds: HarbourBounds,
  margin = BASIN_VIEW_FIT_MARGIN,
): number {
  const { width, height } = basinWorldSize(bounds)
  if (width <= 0 || height <= 0 || canvasWidth <= 0 || canvasHeight <= 0) return 1
  return Math.min((canvasWidth * margin) / width, (canvasHeight * margin) / height)
}

/** Orthographic zoom so generic basin bounds fill the canvas (R3F convention). */
export function orthographicZoomForBounds(
  canvasWidth: number,
  canvasHeight: number,
  bounds: HarbourBounds,
  margin = BASIN_VIEW_FIT_MARGIN,
): number {
  const { width, height } = basinWorldSize(bounds)
  if (width <= 0 || height <= 0 || canvasWidth <= 0 || canvasHeight <= 0) return 1
  return Math.min(canvasWidth / width, canvasHeight / height) * margin
}

export function buildBasinDisplayMetrics(
  canvasWidth: number,
  canvasHeight: number,
  bounds: HarbourBounds,
  margin = BASIN_VIEW_FIT_MARGIN,
): BasinDisplayMetrics {
  return {
    bounds,
    canvasWidth,
    canvasHeight,
    pixelsPerWorldUnit: pixelsPerWorldUnitForFit(canvasWidth, canvasHeight, bounds, margin),
  }
}

/** Map physics world X/Y to viewport pixels using basin display scale. */
export function worldToScreenPixels(
  world: Vector2,
  metrics: BasinDisplayMetrics,
  canvasRect: DOMRect,
): { x: number; y: number } {
  const centerX = (metrics.bounds.minX + metrics.bounds.maxX) * 0.5
  const centerY = (metrics.bounds.minY + metrics.bounds.maxY) * 0.5
  const px = metrics.pixelsPerWorldUnit
  return {
    x: canvasRect.left + canvasRect.width * 0.5 + (world.x - centerX) * px,
    y: canvasRect.top + canvasRect.height * 0.5 + (world.y - centerY) * px,
  }
}

export function cleatMarkerDiameterPx(pixelsPerWorldUnit: number): number {
  return Math.max(4, CLEAT_MARKER_WORLD_DIAMETER * pixelsPerWorldUnit)
}

/** Largest axis-aligned size with the given aspect ratio that fits the container. */
export function fitBasinViewportSize(
  containerWidth: number,
  containerHeight: number,
  aspect: number,
  scale = BASIN_VIEW_FIT_MARGIN,
): { width: number; height: number } {
  if (containerWidth <= 0 || containerHeight <= 0 || aspect <= 0) {
    return { width: 0, height: 0 }
  }

  let width: number
  let height: number

  if (containerWidth / containerHeight > aspect) {
    height = containerHeight
    width = height * aspect
  } else {
    width = containerWidth
    height = width / aspect
  }

  return {
    width: Math.floor(width * scale),
    height: Math.floor(height * scale),
  }
}

/** Cap container height to the visible viewport (avoids basin taller than the window). */
export function visibleContainerSize(rect: DOMRect): { width: number; height: number } {
  const visualHeight = window.visualViewport?.height ?? window.innerHeight
  const top = Math.max(0, rect.top)
  const maxHeight = Math.max(0, visualHeight - top)
  return {
    width: rect.width,
    height: Math.min(rect.height, maxHeight),
  }
}
