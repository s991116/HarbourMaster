import { useEffect, useState } from 'react'
import { createPortal, useThree } from '@react-three/fiber'
import { DoubleSide } from 'three'
import { isMooringCleatDebugEnabled } from '../debug/mooringCleatDebug'

/**
 * Bright shapes parented to the camera (centre of the 3D view).
 * If this is missing but the HTML circle is visible, the Canvas/WebGL path is broken.
 */
export function MooringCleatDebugMarker3D() {
  const camera = useThree((state) => state.camera)
  const [enabled, setEnabled] = useState(isMooringCleatDebugEnabled)

  useEffect(() => {
    const sync = () => setEnabled(isMooringCleatDebugEnabled())
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  if (!enabled) return null

  return createPortal(
    <group>
      <mesh position={[0, 0, -30]} renderOrder={10000} frustumCulled={false}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          color="#00ff66"
          side={DoubleSide}
          toneMapped={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -29.5]} renderOrder={10001} frustumCulled={false}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial
          color="#ff00ff"
          side={DoubleSide}
          toneMapped={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>,
    camera,
  )
}
