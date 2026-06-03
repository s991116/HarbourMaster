import { create } from 'zustand'

export type CollisionHullScreenRing = {
  /** Viewport pixels for an SVG `polygon` (hull outline, cleats excluded). */
  points: Array<{ x: number; y: number }>
  visible: boolean
  strokeWidth: number
}

type CollisionHullScreenStore = {
  hullRing: CollisionHullScreenRing | null
  setHullRing: (hull: CollisionHullScreenRing | null) => void
}

export const useCollisionHullScreenStore = create<CollisionHullScreenStore>((set) => ({
  hullRing: null,
  setHullRing: (hullRing) => set({ hullRing }),
}))
