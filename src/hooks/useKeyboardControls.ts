import { useEffect } from 'react'
import { useSimulatorStore } from '../store/simulatorStore'

export function useKeyboardControls(): void {
  const adjustThrottleStep = useSimulatorStore((s) => s.adjustThrottleStep)
  const adjustRudderStep = useSimulatorStore((s) => s.adjustRudderStep)
  const neutralControls = useSimulatorStore((s) => s.neutralControls)
  const resetScenario = useSimulatorStore((s) => s.resetScenario)
  const resume = useSimulatorStore((s) => s.resume)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return

      const { running } = useSimulatorStore.getState()

      if (!running && event.key === 'Enter') {
        event.preventDefault()
        resume()
        return
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          adjustThrottleStep(1)
          break
        case 'ArrowDown':
          event.preventDefault()
          adjustThrottleStep(-1)
          break
        case 'ArrowLeft':
          event.preventDefault()
          adjustRudderStep(-1)
          break
        case 'ArrowRight':
          event.preventDefault()
          adjustRudderStep(1)
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

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [adjustThrottleStep, adjustRudderStep, neutralControls, resetScenario, resume])
}
