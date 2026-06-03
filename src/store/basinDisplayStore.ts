import { create } from 'zustand'
import type { BasinDisplayMetrics } from '../harbour/basinDisplay'

type BasinDisplayStore = {
  metrics: BasinDisplayMetrics | null
  setMetrics: (metrics: BasinDisplayMetrics) => void
}

export const useBasinDisplayStore = create<BasinDisplayStore>((set) => ({
  metrics: null,
  setMetrics: (metrics) => set({ metrics }),
}))
