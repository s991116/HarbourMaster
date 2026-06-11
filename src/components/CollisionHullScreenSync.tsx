import { useFrame } from '@react-three/fiber'
import {
  boatLocalToWorldForDisplay,
  getBoatHullLocalVertices,
} from '../physics/boatHullProfile'
import { worldToScreenPixels } from '../harbour/basinDisplay'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
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

    const metrics = useBasinDisplayStore.getState().metrics
    if (!metrics) {
      setHullRing(null)
      return
    }

    const { snapshot } = useSimulatorStore.getState()
    const { position, heading } = snapshot.boat
    const rect = state.gl.domElement.getBoundingClientRect()

    const points = getBoatHullLocalVertices(boatConfig).map((local) => {
      const world = boatLocalToWorldForDisplay(local, position, heading)
      return worldToScreenPixels(world, metrics, rect, position, heading)
    })

    setHullRing({
      points,
      visible: true,
      strokeWidth: Math.max(1, metrics.pixelsPerWorldUnit * 0.55),
    })
  })

  return null
}
