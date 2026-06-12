import type { KeelType } from './types'

/**
 * Keel-type modifiers applied on top of `BoatConfig` drag coefficients.
 * Long keels resist sideslip and swing more than fin keels.
 */
export type KeelHydrodynamics = {
  swayDragMultiplier: number
  swingDampingMultiplier: number
}

const KEEL_HYDRODYNAMICS: Record<KeelType, KeelHydrodynamics> = {
  'long-keel': {
    swayDragMultiplier: 1.45,
    swingDampingMultiplier: 1.25,
  },
  'fin-keel': {
    swayDragMultiplier: 1.0,
    swingDampingMultiplier: 1.0,
  },
}

export function getKeelHydrodynamics(keelType: KeelType): KeelHydrodynamics {
  return KEEL_HYDRODYNAMICS[keelType]
}
