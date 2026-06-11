import type { ReactNode } from 'react'
import { useHarbourPopup } from '../hooks/useHarbourPopup'
import { HarbourPopupWindow } from './HarbourPopupWindow'
import { harbourActionButtonClass } from './panelStyles'

type HarbourPopupButtonProps = {
  label: string
  windowTitle: string
  titleId: string
  className?: string
  children: ReactNode
}

export function HarbourPopupButton({
  label,
  windowTitle,
  titleId,
  className = '',
  children,
}: HarbourPopupButtonProps) {
  const { open, openPopup, closePopup } = useHarbourPopup()

  return (
    <>
      <button
        type="button"
        className={`${harbourActionButtonClass} ${className}`.trim()}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={openPopup}
      >
        {label}
      </button>
      <HarbourPopupWindow
        open={open}
        title={windowTitle}
        titleId={titleId}
        onClose={closePopup}
      >
        {children}
      </HarbourPopupWindow>
    </>
  )
}
