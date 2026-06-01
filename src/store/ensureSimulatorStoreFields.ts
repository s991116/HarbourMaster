import { useSimulatorStore } from './simulatorStore'

/** Re-apply store fields after Vite HMR left an old Zustand store instance. */
export function ensureSimulatorStoreFields(): void {
  const state = useSimulatorStore.getState()
  const patch: Record<string, unknown> = {}

  if (typeof state.showCollisionHull !== 'boolean') {
    patch.showCollisionHull = false
  }
  if (typeof state.setShowCollisionHull !== 'function') {
    patch.setShowCollisionHull = (show: boolean) => {
      useSimulatorStore.setState({ showCollisionHull: show })
    }
  }

  if (Object.keys(patch).length > 0) {
    useSimulatorStore.setState(patch)
  }
}
