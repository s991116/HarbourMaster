import { useFrame } from '@react-three/fiber'
import {
  boatLocalToWorldForDisplay,
  getBoatHullLocalVertices,
} from '../physics/boatHullProfile'
import { worldToScreenPixels } from '../physics/worldToScreen'
import { useCollisionHullScreenStore } from '../store/collisionHullScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Projects the collision hull polygon to screen pixels. */
export function CollisionHullScreenSync() {
  const setHullRing = useCollisionHullScreenStore((s) => s.setHullRing)
  const showCollisionHull = useSimulatorStore((s) => s.showCollisionHull)
  const boatConfig = useSimulatorStore((s) => s.boatConfig)

  useFrame((state) => {
    if (!showCollisionHull) {
      setHullRing(null)
      return
    }

    const { snapshot } = useSimulatorStore.getState()
    const { position, heading } = snapshot.boat
    const rect = state.gl.domElement.getBoundingClientRect()
    const { viewport } = state

    const points = getBoatHullLocalVertices(boatConfig).map((local) => {
      const world = boatLocalToWorldForDisplay(local, position, heading)
      return worldToScreenPixels(world, viewport, rect)
    })

    setHullRing({ points, visible: true })
  })

  return null
}
