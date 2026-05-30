import { useEffect } from 'react'
import { useSimulatorStore } from '../store/simulatorStore'

const THROTTLE_STEP = 0.08
const RUDDER_STEP = 0.04

export function useKeyboardControls(): void {
  const adjustThrottle = useSimulatorStore((s) => s.adjustThrottle)
  const adjustRudder = useSimulatorStore((s) => s.adjustRudder)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)

  useEffect(() => {
    const pressed = new Set<string>()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      pressed.add(event.key.toLowerCase())

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          adjustThrottle(THROTTLE_STEP)
          break
        case 'ArrowDown':
          event.preventDefault()
          adjustThrottle(-THROTTLE_STEP)
          break
        case 'ArrowLeft':
          event.preventDefault()
          adjustRudder(-RUDDER_STEP)
          break
        case 'ArrowRight':
          event.preventDefault()
          adjustRudder(RUDDER_STEP)
          break
        case ' ':
          event.preventDefault()
          neutralControls()
          break
        case 'r':
        case 'R':
          resetScenario()
          break
        default:
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      pressed.delete(event.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [adjustThrottle, adjustRudder, neutralControls, resetScenario])
}
