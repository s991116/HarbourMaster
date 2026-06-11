import type { ReactNode } from 'react'
import { harbourIconButtonClass, harbourScrollPanelClass } from './panelStyles'

type HarbourPopupWindowProps = {
  open: boolean
  title: string
  titleId: string
  onClose: () => void
  children: ReactNode
}

/** Modal dialog shell shared by Scenario, Wind, and Settings popups. */
export function HarbourPopupWindow({
  open,
  title,
  titleId,
  onClose,
  children,
}: HarbourPopupWindowProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(90dvh,40rem)] w-full max-w-md flex-col overflow-hidden rounded-lg border border-sky-400/30 bg-[#0b1f33] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-700 px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-sky-100">
            {title}
          </h2>
          <button
            type="button"
            className={harbourIconButtonClass}
            aria-label={`Close ${title.toLowerCase()}`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-4 py-4 ${harbourScrollPanelClass}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
