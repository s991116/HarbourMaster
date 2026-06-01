import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CleatDebugCentreMarker } from './CleatDebugCentreMarker'
import { isMooringCleatDebugEnabled } from '../debug/mooringCleatDebug'

/** Optional centre-screen debug marker — only with `?cleatDebug=1`. */
export function MooringCleatDebugOverlay() {
  const [ready, setReady] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setReady(true)
    const sync = () => setEnabled(isMooringCleatDebugEnabled())
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

  if (!ready || !enabled) return null

  return createPortal(<CleatDebugCentreMarker layer="react-portal" />, document.body)
}
