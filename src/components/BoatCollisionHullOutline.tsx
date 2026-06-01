import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three'
import {
  boatLocalToWorldForDisplay,
  getBoatHullLocalVertices,
} from '../physics/boatHullProfile'
import { useSimulatorStore } from '../store/simulatorStore'

const HULL_LINE_Y = 0.12

function writeWorldRing(
  geometry: BufferGeometry,
  world: Array<{ x: number; y: number }>,
  elevation: number,
): void {
  const array = new Float32Array(world.length * 3)
  for (let i = 0; i < world.length; i++) {
    array[i * 3] = world[i].x
    array[i * 3 + 1] = elevation
    array[i * 3 + 2] = world[i].y
  }
  geometry.setAttribute('position', new BufferAttribute(array, 3))
}

/** Collision hull polygon in world space (matches physics outline). */
export function BoatCollisionHullOutline() {
  const hullGeometry = useRef(new BufferGeometry())
  const showCollisionHull = useSimulatorStore((s) => s.showCollisionHull)
  const boatConfig = useSimulatorStore((s) => s.boatConfig)

  useFrame(() => {
    if (!showCollisionHull) return

    const { position, heading } = useSimulatorStore.getState().snapshot.boat
    const hullWorld = getBoatHullLocalVertices(boatConfig).map((local) =>
      boatLocalToWorldForDisplay(local, position, heading),
    )

    writeWorldRing(hullGeometry.current, hullWorld, HULL_LINE_Y)
  })

  if (!showCollisionHull) return null

  return (
    <lineLoop geometry={hullGeometry.current}>
      <lineBasicMaterial color="#22d3ee" />
    </lineLoop>
  )
}
