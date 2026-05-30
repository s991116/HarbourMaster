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
