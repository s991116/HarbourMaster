import { useFrame } from '@react-three/fiber'
import {
  getBoatMooringCleats,
  mooringCleatWorldPosition,
} from '../physics/boatMooringCleats'
import { cleatMarkerDiameterPx, worldToScreenPixels } from '../harbour/basinDisplay'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
import { useCleatScreenStore } from '../store/cleatScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Projects cleat positions to viewport pixels each frame (inside Canvas). */
export function CleatScreenPositionSync() {
  const setMarkers = useCleatScreenStore((s) => s.setMarkers)
  const setMarkerDiameterPx = useCleatScreenStore((s) => s.setMarkerDiameterPx)

  useFrame((state) => {
    const metrics = useBasinDisplayStore.getState().metrics
    if (!metrics) return

    const { snapshot, boatConfig } = useSimulatorStore.getState()
    const { position, heading } = snapshot.boat
    const cleatList = getBoatMooringCleats(boatConfig)
    const rect = state.gl.domElement.getBoundingClientRect()

    setMarkerDiameterPx(cleatMarkerDiameterPx(metrics.pixelsPerWorldUnit))

    const markers = cleatList.map((cleat) => {
      const world = mooringCleatWorldPosition(cleat, position, heading)
      const screen = worldToScreenPixels(world, metrics, rect)
      return {
        id: cleat.id,
        x: screen.x,
        y: screen.y,
      }
    })

    setMarkers(markers)
  })

  return null
}
