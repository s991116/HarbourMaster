import { useMemo } from 'react'
import type { StaticObstacle } from '../physics/types'
import { getScenario } from '../simulator/scenarios'
import { useSimulatorStore } from '../store/simulatorStore'

function ObstacleMesh({ obstacle }: { obstacle: StaticObstacle }) {
  const color =
    obstacle.type === 'quay'
      ? '#64748b'
      : obstacle.type === 'pole'
        ? '#475569'
        : '#94a3b8'

  if (obstacle.type === 'pole') {
    return (
      <mesh
        position={[obstacle.position.x, 0.5, obstacle.position.y]}
        rotation={[0, obstacle.rotation, 0]}
      >
        <cylinderGeometry args={[obstacle.width * 0.5, obstacle.width * 0.5, 1, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }

  return (
    <mesh
      position={[obstacle.position.x, 0.2, obstacle.position.y]}
      rotation={[0, obstacle.rotation, 0]}
    >
      <boxGeometry args={[obstacle.width, 0.4, obstacle.height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function HarbourEnvironment() {
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const scenario = useMemo(() => getScenario(scenarioId), [scenarioId])
  const { bounds, obstacles } = scenario

  const width = bounds.maxX - bounds.minX
  const depth = bounds.maxY - bounds.minY
  const centerX = (bounds.minX + bounds.maxX) * 0.5
  const centerZ = (bounds.minY + bounds.maxY) * 0.5

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, centerZ]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#1e5f74" />
      </mesh>

      <lineLoop position={[centerX, 0.02, centerZ]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                bounds.minX - centerX,
                0,
                bounds.minY - centerZ,
                bounds.maxX - centerX,
                0,
                bounds.minY - centerZ,
                bounds.maxX - centerX,
                0,
                bounds.maxY - centerZ,
                bounds.minX - centerX,
                0,
                bounds.maxY - centerZ,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7dd3fc" />
      </lineLoop>

      {obstacles.map((obstacle) => (
        <ObstacleMesh key={obstacle.id} obstacle={obstacle} />
      ))}
    </group>
  )
}
