import { create } from 'zustand'
import type { MooringCleatId } from '../physics/boatMooringCleats'

export type CleatScreenMarker = {
  id: MooringCleatId
  /** Viewport pixels for `position: fixed`. */
  x: number
  y: number
}

type CleatScreenStore = {
  markers: CleatScreenMarker[]
  markerDiameterPx: number
  frame: number
  setMarkers: (markers: CleatScreenMarker[]) => void
  setMarkerDiameterPx: (diameterPx: number) => void
}

export const useCleatScreenStore = create<CleatScreenStore>((set, get) => ({
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
