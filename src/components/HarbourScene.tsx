import { Canvas } from '@react-three/fiber'
import { BoatMesh } from './BoatMesh'
import { HarbourEnvironment } from './HarbourEnvironment'
import { SimulationLoop } from './SimulationLoop'

export function HarbourScene() {
  return (
    <Canvas
      orthographic
      camera={{
        zoom: 9,
        position: [0, 100, 0],
        up: [0, 0, -1],
        near: 0.1,
        far: 500,
      }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#0b1f33']} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[30, 50, 20]} intensity={0.8} />
      <SimulationLoop />
      <HarbourEnvironment />
      <BoatMesh />
    </Canvas>
  )
}
