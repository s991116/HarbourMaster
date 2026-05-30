import { Suspense, useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type { Group } from 'three'
import { SRGBColorSpace } from 'three'
import boatTopUrl from '../assets/boat-top.svg'
import { useSimulatorStore } from '../store/simulatorStore'

useTexture.preload(boatTopUrl)

function BoatModel() {
  const groupRef = useRef<Group>(null)
  const snapshot = useSimulatorStore((s) => s.snapshot)
  const boatConfig = useSimulatorStore((s) => s.boatConfig)
  const texture = useTexture(boatTopUrl)

  const { length, beam } = boatConfig

  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.center.set(0.5, 0.5)
    // SVG length axis is horizontal; plane length runs along world +Z
    texture.rotation = Math.PI / 2
    texture.anisotropy = 8
  }, [texture])

  useFrame(() => {
    if (!groupRef.current) return
    const { position, heading } = snapshot.boat
    groupRef.current.position.set(position.x, 0.08, position.y)
    groupRef.current.rotation.set(0, heading, 0)
  })

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, -1, 1]}>
        <planeGeometry args={[beam, length]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          alphaTest={0.01}
        />
      </mesh>
    </group>
  )
}

export function BoatMesh() {
  return (
    <Suspense fallback={null}>
      <BoatModel />
    </Suspense>
  )
}
