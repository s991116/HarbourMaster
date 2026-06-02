import { useEffect, useState } from 'react'
import { BoatMooringCleatMarkersOverlay } from './components/BoatMooringCleatMarkersOverlay'
import { PauseOverlay } from './components/PauseOverlay'
import { PierCleatMarkersOverlay } from './components/PierCleatMarkersOverlay'
import { CollisionHullScreenOverlay } from './components/CollisionHullScreenOverlay'
import { HarbourScene } from './components/HarbourScene'
import { ControlsPanel } from './components/ControlsPanel'
import { MobileControlOverlay } from './components/MobileControlOverlay'
import { MooringCleatDebugOverlay } from './components/MooringCleatDebugOverlay'
import { ScenarioSelector } from './components/ScenarioSelector'
import { WindIndicator } from './components/WindIndicator'
import { isMooringCleatDebugEnabled } from './debug/mooringCleatDebug'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { useTouchPrimary } from './hooks/useTouchPrimary'

function App() {
  useKeyboardControls()
  const touchPrimary = useTouchPrimary()
  const [cleatDebug, setCleatDebug] = useState(false)

  useEffect(() => {
    const sync = () => setCleatDebug(isMooringCleatDebugEnabled())
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <HarbourScene cleatDebug={cleatDebug} />
      <BoatMooringCleatMarkersOverlay />
      <PierCleatMarkersOverlay />
      <CollisionHullScreenOverlay />
      <PauseOverlay />
      <ScenarioSelector cleatDebug={cleatDebug} />
      <WindIndicator />
      {touchPrimary ? <MobileControlOverlay /> : <ControlsPanel />}
      <MooringCleatDebugOverlay />
    </div>
  )
}

export default App
