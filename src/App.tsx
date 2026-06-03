import { useEffect, useState } from 'react'
import { BoatMooringCleatMarkersOverlay } from './components/BoatMooringCleatMarkersOverlay'
import { PauseOverlay } from './components/PauseOverlay'
import { PierCleatMarkersOverlay } from './components/PierCleatMarkersOverlay'
import { CollisionHullScreenOverlay } from './components/CollisionHullScreenOverlay'
import { BasinViewport } from './components/BasinViewport'
import { HarbourPanelsChrome } from './components/HarbourPanelsChrome'
import { MooringCleatDebugOverlay } from './components/MooringCleatDebugOverlay'
import { isMooringCleatDebugEnabled } from './debug/mooringCleatDebug'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { useLandscapeLayout } from './hooks/useLandscapeLayout'

function App() {
  useKeyboardControls()
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

  const basin = (
    <div className="relative min-h-0 min-w-0 flex-1">
      <BasinViewport cleatDebug={cleatDebug}>
        <BoatMooringCleatMarkersOverlay />
        <PierCleatMarkersOverlay />
        <CollisionHullScreenOverlay />
        <PauseOverlay scope="basin" />
        <MooringCleatDebugOverlay />
      </BasinViewport>
    </div>
  )

  if (landscape) {
    return (
      <div className="flex h-dvh max-h-dvh w-full flex-row overflow-hidden">
        <HarbourPanelsChrome cleatDebug={cleatDebug} orientation="landscape" />
        {basin}
      </div>
    )
  }

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden">
      <HarbourPanelsChrome cleatDebug={cleatDebug} orientation="portrait" />
      {basin}
    </div>
  )
}

export default App
