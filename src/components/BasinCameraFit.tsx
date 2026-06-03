import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import type { OrthographicCamera } from 'three'
import {
  buildBasinDisplayMetrics,
  orthographicZoomForBounds,
} from '../harbour/basinDisplay'
import { getScenario } from '../simulator/scenarios'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Fits orthographic camera to scenario bounds and publishes display scale for overlays. */
export function BasinCameraFit() {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const setMetrics = useBasinDisplayStore((s) => s.setMetrics)
  const bounds = useMemo(() => getScenario(scenarioId).bounds, [scenarioId])

  useFrame((state) => {
    const camera = state.camera as OrthographicCamera
    const { width, height } = state.size
    const zoom = orthographicZoomForBounds(width, height, bounds, 1)

    if (Math.abs(camera.zoom - zoom) > 1e-4) {
      camera.zoom = zoom
      camera.updateProjectionMatrix()
    }

    setMetrics(buildBasinDisplayMetrics(width, height, bounds, 1))
  })

  return null
}
