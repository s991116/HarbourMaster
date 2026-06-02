import { useEffect, useState } from 'react'

const TOUCH_PRIMARY_QUERY = '(pointer: coarse)'

export function useTouchPrimary(): boolean {
  const [touchPrimary, setTouchPrimary] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(TOUCH_PRIMARY_QUERY).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(TOUCH_PRIMARY_QUERY)
    const sync = () => setTouchPrimary(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  return touchPrimary
}
