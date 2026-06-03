import { useFrame } from '@react-three/fiber'
import { cleatMarkerDiameterPx, worldToScreenPixels } from '../harbour/basinDisplay'
import { getScenario } from '../simulator/scenarios'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
import { usePierCleatScreenStore } from '../store/pierCleatScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Projects fixed pier-cleat positions to viewport pixels each frame. */
export function PierCleatScreenSync() {
  const setMarkers = usePierCleatScreenStore((s) => s.setMarkers)
  const setMarkerDiameterPx = usePierCleatScreenStore((s) => s.setMarkerDiameterPx)
  const scenarioId = useSimulatorStore((s) => s.scenarioId)

  useFrame((state) => {
    const metrics = useBasinDisplayStore.getState().metrics
    if (!metrics) return

    const { pierCleats } = getScenario(scenarioId)
    const rect = state.gl.domElement.getBoundingClientRect()

    setMarkerDiameterPx(cleatMarkerDiameterPx(metrics.pixelsPerWorldUnit))

    const markers = pierCleats.map((cleat) => {
      const screen = worldToScreenPixels(cleat.position, metrics, rect)
      return { id: cleat.id, x: screen.x, y: screen.y }
    })

    setMarkers(markers)
  })

  return null
}
