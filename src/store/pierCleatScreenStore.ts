import { create } from 'zustand'

export type PierCleatScreenMarker = {
  id: string
  x: number
  y: number
}

type PierCleatScreenStore = {
  markers: PierCleatScreenMarker[]
  markerDiameterPx: number
  frame: number
  setMarkers: (markers: PierCleatScreenMarker[]) => void
  setMarkerDiameterPx: (diameterPx: number) => void
}

export const usePierCleatScreenStore = create<PierCleatScreenStore>((set, get) => ({
  markers: [],
  markerDiameterPx: 8,
  frame: 0,
  setMarkers: (markers) =>
    set({
      markers,
      frame: get().frame + 1,
    }),
  setMarkerDiameterPx: (markerDiameterPx) => set({ markerDiameterPx }),
}))
