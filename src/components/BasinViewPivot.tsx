import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import { useBasinDisplayStore } from '../store/basinDisplayStore'
import { useSimulatorStore } from '../store/simulatorStore'

/** Rotates and recentres the scene so the boat bow points up in heading-up mode. */
export function BasinViewPivot({ children }: { children: ReactNode }) {
  const pivotRef = useRef<Group>(null)
  const offsetRef = useRef<Group>(null)

  useFrame(() => {
    const pivot = pivotRef.current
    const offset = offsetRef.current
    if (!pivot || !offset) return

    const viewMode = useBasinDisplayStore.getState().viewMode
    if (viewMode === 'north-up') {
      pivot.position.set(0, 0, 0)
      pivot.rotation.set(0, 0, 0)
      offset.position.set(0, 0, 0)
      return
    }

    const { position, heading } = useSimulatorStore.getState().snapshot.boat
    pivot.position.set(position.x, 0, position.y)
    pivot.rotation.set(0, Math.PI - heading, 0)
    offset.position.set(-position.x, 0, -position.y)
  })

  return (
    <group ref={pivotRef}>
      <group ref={offsetRef}>{children}</group>
    </group>
  )
}
