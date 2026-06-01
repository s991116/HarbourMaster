import { useFrame } from '@react-three/fiber'
import { worldToScreenPixels } from '../physics/worldToScreen'
import { getScenario } from '../simulator/scenarios'
import { usePierCleatScreenStore } from '../store/pierCleatScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Projects fixed pier-cleat positions to viewport pixels each frame. */
export function PierCleatScreenSync() {
  const setMarkers = usePierCleatScreenStore((s) => s.setMarkers)
  const scenarioId = useSimulatorStore((s) => s.scenarioId)

  useFrame((state) => {
    const { pierCleats } = getScenario(scenarioId)
    const rect = state.gl.domElement.getBoundingClientRect()
    const { viewport } = state

    const markers = pierCleats.map((cleat) => {
      const screen = worldToScreenPixels(cleat.position, viewport, rect)
      return { id: cleat.id, x: screen.x, y: screen.y }
    })

    setMarkers(markers)
  })

  return null
}
