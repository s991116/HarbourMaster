import { clamp } from '../physics/vector2'

export const MAX_THROTTLE_STEP = 4
export const MAX_RUDDER_STEP = 5
export const MAX_RUDDER_ANGLE = 0.52

export function throttleStepToValue(step: number): number {
  const clamped = clamp(step, -MAX_THROTTLE_STEP, MAX_THROTTLE_STEP)
  return clamped / MAX_THROTTLE_STEP
}

export function rudderStepToAngle(step: number): number {
  const clamped = clamp(step, -MAX_RUDDER_STEP, MAX_RUDDER_STEP)
  return (clamped / MAX_RUDDER_STEP) * MAX_RUDDER_ANGLE
}

export function formatThrottleStep(step: number): string {
  if (step === 0) return 'Neutral'
  if (step > 0) return `Forward ${step}`
  return `Astern ${Math.abs(step)}`
}

export function formatRudderStep(step: number): string {
  if (step === 0) return 'Amidships'
  if (step > 0) return `Stbd ${step}`
  return `Port ${Math.abs(step)}`
}

export const WIND_DIRECTION_STEP = 10

export function snapWindDirectionDegrees(degrees: number): number {
  const normalized = ((degrees % 360) + 360) % 360
  return (Math.round(normalized / WIND_DIRECTION_STEP) * WIND_DIRECTION_STEP) % 360
}

export function windDirectionRadiansToDegrees(direction: number): number {
  return snapWindDirectionDegrees((direction * 180) / Math.PI)
}

export function windDirectionDegreesToRadians(degrees: number): number {
  return (snapWindDirectionDegrees(degrees) * Math.PI) / 180
}

export const KNOTS_TO_MS = 1.94384
export const MAX_WIND_SPEED_KNOTS = 40

export function snapWindSpeedKnots(knots: number): number {
  return Math.max(0, Math.min(MAX_WIND_SPEED_KNOTS, Math.round(knots)))
}

export function windSpeedMsToKnots(speedMs: number): number {
  return snapWindSpeedKnots(speedMs * KNOTS_TO_MS)
}

export function windSpeedKnotsToMs(knots: number): number {
  return snapWindSpeedKnots(knots) / KNOTS_TO_MS
}
