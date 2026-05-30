import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSimulatorStore } from '../store/simulatorStore'

export function SimulationLoop() {
  const tick = useSimulatorStore((s) => s.tick)
  const lastTime = useRef<number | null>(null)

  useFrame((state) => {
    const now = state.clock.elapsedTime
    if (lastTime.current === null) {
      lastTime.current = now
      return
    }
    const dt = Math.min(now - lastTime.current, 0.05)
    lastTime.current = now
    tick(dt)
  })

  return null
}
