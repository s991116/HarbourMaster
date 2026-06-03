import { useEffect, useState } from 'react'
import { BoatMooringCleatMarkersOverlay } from './components/BoatMooringCleatMarkersOverlay'
import { PauseOverlay } from './components/PauseOverlay'
import { PierCleatMarkersOverlay } from './components/PierCleatMarkersOverlay'
import { CollisionHullScreenOverlay } from './components/CollisionHullScreenOverlay'
import { HarbourScene } from './components/HarbourScene'
import { ControlsPanel } from './components/ControlsPanel'
import { MobileControlOverlay } from './components/MobileControlOverlay'
import { MooringCleatDebugOverlay } from './components/MooringCleatDebugOverlay'
import { HarbourLandscapeSidebar } from './components/HarbourLandscapeSidebar'
import { ScenarioSelector } from './components/ScenarioSelector'
import { WindIndicator } from './components/WindIndicator'
import { isMooringCleatDebugEnabled } from './debug/mooringCleatDebug'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { useLandscapeLayout } from './hooks/useLandscapeLayout'
import { useTouchPrimary } from './hooks/useTouchPrimary'

function App() {
  useKeyboardControls()
  const touchPrimary = useTouchPrimary()
  const landscape = useLandscapeLayout()
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

  const basinClass = landscape
    ? 'relative min-h-0 min-w-0 flex-1'
    : 'relative h-full w-full'

  const basin = (
    <div className={basinClass}>
      <HarbourScene cleatDebug={cleatDebug} />
      <BoatMooringCleatMarkersOverlay />
      <PierCleatMarkersOverlay />
      <CollisionHullScreenOverlay />
      <PauseOverlay scope={landscape ? 'basin' : 'viewport'} />
      <MooringCleatDebugOverlay />
    </div>
  )

  if (landscape) {
    return (
      <div className="flex h-full w-full flex-row">
        <HarbourLandscapeSidebar cleatDebug={cleatDebug} />
        {basin}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {basin}
      <ScenarioSelector cleatDebug={cleatDebug} />
      <WindIndicator />
      {touchPrimary ? <MobileControlOverlay /> : <ControlsPanel />}
    </div>
  )
}

export default App
