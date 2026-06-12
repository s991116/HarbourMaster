import { useEffect, useState } from 'react'
import type { HarbourLayoutMode } from '../components/panelStyles'

const LANDSCAPE_QUERY = '(orientation: landscape)'

function resolveLayoutMode(): HarbourLayoutMode {
  if (typeof window === 'undefined') return 'landscape-compact'
  if (window.matchMedia(LANDSCAPE_QUERY).matches) return 'landscape-sidebar'
  return 'landscape-compact'
}

export function useHarbourLayoutMode(): HarbourLayoutMode {
  const [mode, setMode] = useState<HarbourLayoutMode>(resolveLayoutMode)

  useEffect(() => {
    const landscape = window.matchMedia(LANDSCAPE_QUERY)

    const sync = () => setMode(resolveLayoutMode())

    landscape.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    sync()

    return () => {
      landscape.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return mode
}
