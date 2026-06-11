import { useEffect, useState } from 'react'

/** Open/close state for harbour popup dialogs, with Escape to close. */
export function useHarbourPopup(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return {
    open,
    openPopup: () => setOpen(true),
    closePopup: () => setOpen(false),
  }
}
