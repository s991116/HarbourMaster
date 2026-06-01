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
  frame: number
  setMarkers: (markers: CleatScreenMarker[]) => void
}

export const useCleatScreenStore = create<CleatScreenStore>((set, get) => ({
  markers: [],
  frame: 0,
  setMarkers: (markers) =>
    set({
      markers,
      frame: get().frame + 1,
    }),
}))
