import { ControlsPanel } from './ControlsPanel'
import { ScenarioSelector } from './ScenarioSelector'
import { SettingsButton } from './SettingsButton'
import { WindIndicator } from './WindIndicator'
import { harbourPanelWidthClass, type HarbourPanelsOrientation } from './panelStyles'

type HarbourPanelsChromeProps = {
  cleatDebug: boolean
  orientation: HarbourPanelsOrientation
}

const portraitPanelSlotClass = `shrink-0 ${harbourPanelWidthClass}`
const landscapePanelSlotClass = 'w-full min-w-0 max-w-full shrink-0'
const panelGap = 'gap-[clamp(0.25rem,0.7vw,0.5rem)]'
const panelPadding = 'p-[clamp(0.5rem,1vw,0.75rem)]'
const panelText = 'text-[length:clamp(0.625rem,1.05vw,0.875rem)]'

export function HarbourPanelsChrome({
  cleatDebug,
  orientation,
}: HarbourPanelsChromeProps) {
  const panelSlotClass =
    orientation === 'landscape' ? landscapePanelSlotClass : portraitPanelSlotClass

  const menuButtons = (
    <>
      <div className={panelSlotClass} data-sidebar-slot="scenario">
        <ScenarioSelector cleatDebug={cleatDebug} />
      </div>
      <div className={panelSlotClass} data-sidebar-slot="settings">
        <SettingsButton />
      </div>
      <div className={panelSlotClass} data-sidebar-slot="wind">
        <WindIndicator />
      </div>
    </>
  )

  const controls = (
    <div className={panelSlotClass} data-sidebar-slot="controls">
      <ControlsPanel layout="sidebar" />
    </div>
  )

  if (orientation === 'landscape') {
    return (
      <aside
        className={`box-border z-10 flex h-full min-h-0 shrink-0 flex-col overflow-hidden ${panelPadding} ${panelText} ${harbourPanelWidthClass}`}
      >
        <div
          data-sidebar-top
          className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto [overflow-anchor:none] ${panelGap}`}
        >
          {menuButtons}
        </div>
        <div className={`w-full shrink-0 pt-[clamp(0.25rem,0.7vw,0.5rem)]`}>{controls}</div>
      </aside>
    )
  }

  return (
    <header
      className={`z-10 flex shrink-0 flex-row items-start overflow-x-auto bg-[#0b1f33] ${panelPadding} ${panelText} ${panelGap}`}
    >
      <div data-sidebar-top className={`flex min-w-0 flex-1 flex-col ${panelGap}`}>
        {menuButtons}
      </div>
      {controls}
    </header>
  )
}
