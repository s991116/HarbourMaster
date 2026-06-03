import { useEffect, useState } from 'react'

const LANDSCAPE_QUERY = '(orientation: landscape)'

export function useLandscapeLayout(): boolean {
  const [landscape, setLandscape] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(LANDSCAPE_QUERY).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(LANDSCAPE_QUERY)
    const sync = () => setLandscape(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  return landscape
}
