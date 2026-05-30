export type Vector2 = {
  x: number
  y: number
}

export const vec2 = (x = 0, y = 0): Vector2 => ({ x, y })

export const add = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

export const sub = (a: Vector2, b: Vector2): Vector2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
})

export const scale = (v: Vector2, s: number): Vector2 => ({
  x: v.x * s,
  y: v.y * s,
})

export const length = (v: Vector2): number => Math.hypot(v.x, v.y)

export const normalize = (v: Vector2): Vector2 => {
  const len = length(v)
  if (len < 1e-8) return vec2()
  return scale(v, 1 / len)
}

export const dot = (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y

export const rotate = (v: Vector2, angle: number): Vector2 => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  }
}

export const fromAngle = (angle: number): Vector2 => ({
  x: Math.sin(angle),
  y: Math.cos(angle),
})

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
