import { useEffect, useState } from 'react'
import type { HarbourLayoutMode } from '../components/panelStyles'

const LANDSCAPE_QUERY = '(orientation: landscape)'
/** Phone-style landscape: limited vertical space. */
const COMPACT_LANDSCAPE_QUERY = '(orientation: landscape) and (max-height: 520px)'

function resolveLayoutMode(): HarbourLayoutMode {
  if (typeof window === 'undefined') return 'portrait'
  if (!window.matchMedia(LANDSCAPE_QUERY).matches) return 'portrait'
  if (window.matchMedia(COMPACT_LANDSCAPE_QUERY).matches) return 'landscape-compact'
  return 'landscape-sidebar'
}

export function useHarbourLayoutMode(): HarbourLayoutMode {
  const [mode, setMode] = useState<HarbourLayoutMode>(resolveLayoutMode)

  useEffect(() => {
    const landscape = window.matchMedia(LANDSCAPE_QUERY)
    const compact = window.matchMedia(COMPACT_LANDSCAPE_QUERY)

    const sync = () => setMode(resolveLayoutMode())

    landscape.addEventListener('change', sync)
    compact.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    sync()

    return () => {
      landscape.removeEventListener('change', sync)
      compact.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return mode
}
