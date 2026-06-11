import { create } from 'zustand'

export type WaterRippleSettings = {
  driftScale: number
  visualCapKnots: number
  rippleStrengthBase: number
  rippleStrengthScale: number
  sparkleMix: number
  smoothstepLow: number
  smoothstepHigh: number
  calmAmp1: number
  calmAmp2: number
  calmAmp3: number
  windyStreak1: number
  windyStreak2: number
  windyStreak3: number
  highlightR: number
  highlightG: number
  highlightB: number
  shadowR: number
  shadowG: number
  shadowB: number
}

export const DEFAULT_WATER_RIPPLE_SETTINGS: WaterRippleSettings = {
  driftScale: 0.097,
  visualCapKnots: 20,
  rippleStrengthBase: 0.016,
  rippleStrengthScale: 0.034,
  sparkleMix: 0.12,
  smoothstepLow: 0.22,
  smoothstepHigh: 0.78,
  calmAmp1: 0.12,
  calmAmp2: 0.08,
  calmAmp3: 0.2,
  windyStreak1: 0.3,
  windyStreak2: 0.22,
  windyStreak3: 0.16,
  highlightR: 0.42,
  highlightG: 0.62,
  highlightB: 0.68,
  shadowR: 0.16,
  shadowG: 0.38,
  shadowB: 0.46,
}

type WaterRippleSettingsStore = {
  settings: WaterRippleSettings
  updateSettings: (partial: Partial<WaterRippleSettings>) => void
  resetSettings: () => void
}

export const useWaterRippleSettingsStore = create<WaterRippleSettingsStore>((set) => ({
  settings: { ...DEFAULT_WATER_RIPPLE_SETTINGS },
  updateSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),
  resetSettings: () => set({ settings: { ...DEFAULT_WATER_RIPPLE_SETTINGS } }),
}))
