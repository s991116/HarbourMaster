import { useFrame } from '@react-three/fiber'
import {
  getBoatMooringCleats,
  mooringCleatWorldPosition,
} from '../physics/boatMooringCleats'
import { worldToScreenPixels } from '../physics/worldToScreen'
import { useCleatScreenStore } from '../store/cleatScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Projects cleat positions to viewport pixels each frame (inside Canvas). */
export function CleatScreenPositionSync() {
  const setMarkers = useCleatScreenStore((s) => s.setMarkers)

  useFrame((state) => {
    const { snapshot, boatConfig } = useSimulatorStore.getState()
    const { position, heading } = snapshot.boat
    const cleatList = getBoatMooringCleats(boatConfig)
    const rect = state.gl.domElement.getBoundingClientRect()
    const { viewport } = state

    const markers = cleatList.map((cleat) => {
      const world = mooringCleatWorldPosition(cleat, position, heading)
      const screen = worldToScreenPixels(world, viewport, rect)
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
