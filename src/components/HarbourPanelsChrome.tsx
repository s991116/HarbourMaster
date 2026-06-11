import type { ReactNode } from 'react'
import { ControlsPanel } from './ControlsPanel'
import { ScenarioSelector } from './ScenarioSelector'
import { SettingsButton } from './SettingsButton'
import { WindIndicator } from './WindIndicator'
import {
  harbourPanelWidthClass,
  type HarbourLayoutMode,
} from './panelStyles'

type HarbourPanelsChromeProps = {
  cleatDebug: boolean
  mode: HarbourLayoutMode
  children?: ReactNode
}

const portraitPanelSlotClass = `shrink-0 ${harbourPanelWidthClass}`
const landscapePanelSlotClass = 'w-full min-w-0 max-w-full shrink-0'
const panelGap = 'gap-[clamp(0.25rem,0.7vw,0.5rem)]'
const panelPadding = 'p-[clamp(0.5rem,1vw,0.75rem)]'
const panelText = 'text-[length:clamp(0.625rem,1.05vw,0.875rem)]'

export function HarbourPanelsChrome({
  cleatDebug,
  mode,
  children,
}: HarbourPanelsChromeProps) {
  const panelSlotClass =
    mode === 'landscape-sidebar' ? landscapePanelSlotClass : portraitPanelSlotClass

  const scenarioSettingsRow = (
    <div className={`flex w-full min-w-0 ${panelGap}`}>
      <div className="min-w-0 flex-1" data-sidebar-slot="scenario">
        <ScenarioSelector cleatDebug={cleatDebug} />
      </div>
      <div className="min-w-0 flex-1" data-sidebar-slot="settings">
        <SettingsButton />
      </div>
    </div>
  )

  const windPanel = (
    <div className={panelSlotClass} data-sidebar-slot="wind">
      <WindIndicator />
    </div>
  )

  const controlsPanel = (
    <div className={panelSlotClass} data-sidebar-slot="controls">
      <ControlsPanel layout="sidebar" />
    </div>
  )

  if (mode === 'landscape-compact') {
    return (
      <div className={`flex h-dvh max-h-dvh w-full flex-col overflow-hidden ${panelText}`}>
        <header
          className={`z-10 shrink-0 bg-[#0b1f33] ${panelPadding}`}
          data-harbour-chrome="compact-top"
        >
          {scenarioSettingsRow}
        </header>

        <div className="relative min-h-0 min-w-0 flex-1">{children}</div>

        <footer
          className={`z-10 flex shrink-0 items-end justify-between ${panelPadding} ${panelGap} bg-[#0b1f33]`}
          data-harbour-chrome="compact-bottom"
        >
          <div className={`shrink-0 ${harbourPanelWidthClass}`}>{controlsPanel}</div>
          <div className={`shrink-0 ${harbourPanelWidthClass}`}>{windPanel}</div>
        </footer>
      </div>
    )
  }

  const sidebarMenu = (
    <>
      <div className={panelSlotClass} data-sidebar-slot="scenario">
        <ScenarioSelector cleatDebug={cleatDebug} />
      </div>
      <div className={panelSlotClass} data-sidebar-slot="settings">
        <SettingsButton />
      </div>
      {windPanel}
    </>
  )

  if (mode === 'landscape-sidebar') {
    return (
      <aside
        className={`box-border z-10 flex h-full min-h-0 shrink-0 flex-col overflow-hidden ${panelPadding} ${panelText} ${harbourPanelWidthClass}`}
      >
        <div
          data-sidebar-top
          className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto [overflow-anchor:none] ${panelGap}`}
        >
          {sidebarMenu}
        </div>
        <div className={`w-full shrink-0 pt-[clamp(0.25rem,0.7vw,0.5rem)]`}>{controlsPanel}</div>
      </aside>
    )
  }

  return (
    <header
      className={`z-10 flex shrink-0 flex-row items-start overflow-x-auto bg-[#0b1f33] ${panelPadding} ${panelText} ${panelGap}`}
    >
      <div data-sidebar-top className={`flex min-w-0 flex-1 flex-col ${panelGap}`}>
        {sidebarMenu}
      </div>
      {controlsPanel}
    </header>
  )
}
