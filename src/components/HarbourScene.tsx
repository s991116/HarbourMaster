import { Canvas } from '@react-three/fiber'
import { BoatCollisionHullOutline } from './BoatCollisionHullOutline'
import { BoatMesh } from './BoatMesh'
import { CleatScreenPositionSync } from './CleatScreenPositionSync'
import { PierCleatScreenSync } from './PierCleatScreenSync'
import { CollisionHullScreenSync } from './CollisionHullScreenSync'
import { HarbourEnvironment } from './HarbourEnvironment'
import { MooringCleatDebugMarker3D } from './MooringCleatDebugMarker3D'
import { SimulationLoop } from './SimulationLoop'

type HarbourSceneProps = {
  cleatDebug?: boolean
}

export function HarbourScene({ cleatDebug = false }: HarbourSceneProps) {
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
      <BoatCollisionHullOutline />
      <CleatScreenPositionSync />
      <PierCleatScreenSync />
      <CollisionHullScreenSync />
      {cleatDebug ? <MooringCleatDebugMarker3D /> : null}
    </Canvas>
  )
}
