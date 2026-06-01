import { create } from 'zustand'

export type PierCleatScreenMarker = {
  id: string
  x: number
  y: number
}

type PierCleatScreenStore = {
  markers: PierCleatScreenMarker[]
  frame: number
  setMarkers: (markers: PierCleatScreenMarker[]) => void
}

export const usePierCleatScreenStore = create<PierCleatScreenStore>((set, get) => ({
  markers: [],
  frame: 0,
  setMarkers: (markers) =>
    set({
      markers,
      frame: get().frame + 1,
    }),
}))
