import { useEffect, useState } from 'react'
import type { HarbourLayoutMode } from '../components/panelStyles'

const LANDSCAPE_QUERY = '(orientation: landscape)'
/** Phone-style landscape: limited vertical space. */
const COMPACT_LANDSCAPE_QUERY = '(orientation: landscape) and (max-height: 520px)'
/** Phone-style portrait: narrow width. */
const COMPACT_PORTRAIT_QUERY = '(orientation: portrait) and (max-width: 520px)'

function resolveLayoutMode(): HarbourLayoutMode {
  if (typeof window === 'undefined') return 'portrait'
  if (window.matchMedia(COMPACT_PORTRAIT_QUERY).matches) return 'landscape-compact'
  if (!window.matchMedia(LANDSCAPE_QUERY).matches) return 'portrait'
  if (window.matchMedia(COMPACT_LANDSCAPE_QUERY).matches) return 'landscape-compact'
  return 'landscape-sidebar'
}

export function useHarbourLayoutMode(): HarbourLayoutMode {
  const [mode, setMode] = useState<HarbourLayoutMode>(resolveLayoutMode)

  useEffect(() => {
    const landscape = window.matchMedia(LANDSCAPE_QUERY)
    const compactLandscape = window.matchMedia(COMPACT_LANDSCAPE_QUERY)
    const compactPortrait = window.matchMedia(COMPACT_PORTRAIT_QUERY)

    const sync = () => setMode(resolveLayoutMode())

    landscape.addEventListener('change', sync)
    compactLandscape.addEventListener('change', sync)
    compactPortrait.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    sync()

    return () => {
      landscape.removeEventListener('change', sync)
      compactLandscape.removeEventListener('change', sync)
      compactPortrait.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return mode
}
