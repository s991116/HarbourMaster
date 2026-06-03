import { useRef } from 'react'
import { ControlsPanel } from './ControlsPanel'
import { ScenarioSelector } from './ScenarioSelector'
import { WindIndicator } from './WindIndicator'
import { harbourSidebarWidthClass } from './panelStyles'
import { useHarbourSidebarCollapse } from '../hooks/useHarbourSidebarCollapse'

type HarbourLandscapeSidebarProps = {
  cleatDebug: boolean
}

export function HarbourLandscapeSidebar({ cleatDebug }: HarbourLandscapeSidebarProps) {
  const asideRef = useRef<HTMLElement>(null)
  const { scenarioOpen, windOpen, onScenarioOpenChange, onWindOpenChange } =
    useHarbourSidebarCollapse(asideRef, true)

  const panelGap = 'gap-[clamp(0.25rem,0.7vw,0.5rem)]'

  return (
    <aside
      ref={asideRef}
      className={`z-10 flex h-full min-h-0 shrink-0 flex-col overflow-hidden p-[clamp(0.5rem,1vw,0.75rem)] text-[length:clamp(0.625rem,1.05vw,0.875rem)] ${harbourSidebarWidthClass}`}
    >
      <div
        data-sidebar-top
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto [overflow-anchor:none] ${panelGap}`}
      >
        <div className="w-full shrink-0" data-sidebar-slot="scenario">
          <ScenarioSelector
            cleatDebug={cleatDebug}
            layout="sidebar"
            open={scenarioOpen}
            onOpenChange={onScenarioOpenChange}
          />
        </div>
        <div className="w-full shrink-0" data-sidebar-slot="wind">
          <WindIndicator
            layout="sidebar"
            open={windOpen}
            onOpenChange={onWindOpenChange}
          />
        </div>
      </div>
      <div className={`w-full shrink-0 pt-[clamp(0.25rem,0.7vw,0.5rem)]`} data-sidebar-slot="controls">
        <ControlsPanel layout="sidebar" />
      </div>
    </aside>
  )
}
