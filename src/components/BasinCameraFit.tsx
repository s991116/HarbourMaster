import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import type { OrthographicCamera } from 'three'
import {
  basinViewTransform,
  buildBasinDisplayMetrics,
  orthographicZoomForBounds,
} from '../harbour/basinDisplay'
import { getScenario } from '../simulator/scenarios'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
import { useSimulatorStore } from '../store/simulatorStore'

const CAMERA_HEIGHT = 100

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

    const { viewMode } = useBasinDisplayStore.getState()
    const { position } = useSimulatorStore.getState().snapshot.boat
    const { viewCenter } = basinViewTransform(viewMode, bounds, position)

    camera.up.set(0, 0, -1)
    camera.position.set(viewCenter.x, CAMERA_HEIGHT, viewCenter.y)
    camera.lookAt(viewCenter.x, 0, viewCenter.y)
    camera.updateMatrixWorld()

    setMetrics(buildBasinDisplayMetrics(width, height, bounds, viewCenter, viewMode, 1))
  })

  return null
}
