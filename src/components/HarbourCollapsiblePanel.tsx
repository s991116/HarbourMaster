import type { MouseEvent, ReactNode } from 'react'
import type { HarbourPanelLayout } from './panelStyles'
import {
  harbourPanelClass,
  harbourScrollPanelClass,
  harbourSummaryClass,
} from './panelStyles'

type HarbourCollapsiblePanelProps = {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  layout: HarbourPanelLayout
  /** Mark panel for sidebar overlap measurement. */
  sidebarPanel?: boolean
  children: ReactNode
}

export function HarbourCollapsiblePanel({
  title,
  open,
  onOpenChange,
  layout,
  sidebarPanel = false,
  children,
}: HarbourCollapsiblePanelProps) {
  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    onOpenChange(!open)
  }

  return (
    <details
      {...(sidebarPanel ? { 'data-sidebar-panel': true } : {})}
      data-layout={layout}
      open={open}
      className={`${harbourPanelClass} w-full`}
    >
      <summary
        onClick={handleSummaryClick}
        className={`${harbourSummaryClass} flex w-full list-none items-center gap-2 [&::-webkit-details-marker]:hidden`}
      >
        <span
          className="text-[10px] uppercase tracking-[0.12em] text-sky-300/80"
          aria-hidden
        >
          {open ? '▼' : '▶'}
        </span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-sky-300/80">
          {title}
        </span>
      </summary>
      {open ? (
        <div className={`flex flex-col pt-1 ${harbourScrollPanelClass}`}>{children}</div>
      ) : null}
    </details>
  )
}
