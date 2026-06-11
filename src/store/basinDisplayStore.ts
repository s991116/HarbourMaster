import { create } from 'zustand'
import type { BasinDisplayMetrics, BasinViewMode } from '../harbour/basinDisplay'

type BasinDisplayStore = {
  metrics: BasinDisplayMetrics | null
  viewMode: BasinViewMode
  setMetrics: (metrics: BasinDisplayMetrics) => void
  setViewMode: (mode: BasinViewMode) => void
  toggleViewMode: () => void
}

export const useBasinDisplayStore = create<BasinDisplayStore>((set) => ({
  metrics: null,
  viewMode: 'north-up',
  setMetrics: (metrics) => set({ metrics }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'north-up' ? 'heading-up' : 'north-up',
    })),
}))
