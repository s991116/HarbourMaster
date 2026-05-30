import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useSimulatorStore } from '../store/simulatorStore'
import { getScenario } from '../simulator/scenarios'

export function BoatMesh() {
  const groupRef = useRef<Group>(null)
  const snapshot = useSimulatorStore((s) => s.snapshot)
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const config = useMemo(
    () => getScenario(scenarioId).boatConfig,
    [scenarioId],
  )

  useFrame(() => {
    if (!groupRef.current) return
    const { position, heading } = snapshot.boat
    groupRef.current.position.set(position.x, 0.3, position.y)
    groupRef.current.rotation.set(0, heading, 0)
  })

  const length = config.length
  const beam = config.beam

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[beam, 0.25, length]} />
        <meshStandardMaterial color="#f4f7fb" />
      </mesh>
      <mesh position={[0, 0.35, -length * 0.42]}>
        <boxGeometry args={[beam * 0.85, 0.35, length * 0.18]} />
        <meshStandardMaterial color="#d9e2ec" />
      </mesh>
      <mesh position={[0, 0.05, -length * 0.48]}>
        <boxGeometry args={[0.12, 0.12, 0.35]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[beam * 0.35, 0.05, -length * 0.46]} rotation={[0, snapshot.boat.rudderAngle, 0]}>
        <boxGeometry args={[0.06, 0.18, 0.28]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  )
}
