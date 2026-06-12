import {
  formatRudderStep,
  formatThrottleStep,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
} from '../controls/controlSteps'
import type { ControlsChrome } from './panelStyles'
import { harbourPanelClass, harbourPanelWidthClass } from './panelStyles'
import { TouchSlider } from './TouchSlider'
import { useSimulatorStore } from '../store/simulatorStore'

type ControlSectionProps = {
  compact?: boolean
  className?: string
  chrome?: ControlsChrome
}

function isDesktopSidebarChrome(chrome?: ControlsChrome): boolean {
  return chrome === 'desktop-sidebar'
}

export function EngineControl({
  compact = false,
  className = '',
  chrome,
}: ControlSectionProps) {
  const throttleStep = useSimulatorStore((s) => s.throttleStep)
  const setThrottleStep = useSimulatorStore((s) => s.setThrottleStep)
  const desktop = isDesktopSidebarChrome(chrome)

  return (
    <TouchSlider
      label="Engine"
      value={throttleStep}
      min={-MAX_THROTTLE_STEP}
      max={MAX_THROTTLE_STEP}
      step={1}
      onChange={setThrottleStep}
      formatValue={formatThrottleStep}
      orientation="vertical"
      minLabel={desktop ? undefined : 'Astern'}
      maxLabel={desktop ? undefined : 'Forward'}
      showValue={!desktop}
      compact={compact}
      className={className}
    />
  )
}

export function RudderControl({
  compact = false,
  className = '',
  chrome,
}: ControlSectionProps) {
  const rudderStep = useSimulatorStore((s) => s.rudderStep)
  const setRudderStep = useSimulatorStore((s) => s.setRudderStep)
  const desktop = isDesktopSidebarChrome(chrome)

  return (
    <TouchSlider
      label="Rudder"
      value={rudderStep}
      min={-MAX_RUDDER_STEP}
      max={MAX_RUDDER_STEP}
      step={1}
      onChange={setRudderStep}
      formatValue={formatRudderStep}
      orientation="horizontal"
      minLabel="Port"
      midLabel={desktop ? undefined : 'Amidships'}
      maxLabel="Stbd"
      showValue={!desktop}
      labelAlign={desktop ? 'center' : 'split'}
      compact={compact}
      className={className}
    />
  )
}

type ControlsPanelProps = {
  chrome?: ControlsChrome
}

function panelFrameClass(chrome: ControlsChrome): string {
  if (chrome === 'overlay') {
    return `absolute bottom-3 right-3 z-10 sm:right-10 ${harbourPanelWidthClass} ${harbourPanelClass}`
  }
  if (chrome === 'desktop-sidebar') {
    return `${harbourPanelClass} w-full`
  }
  return `${harbourPanelClass} flex h-full min-h-0 w-full flex-col`
}

export function ControlsPanel({ chrome = 'desktop-sidebar' }: ControlsPanelProps) {
  const isPanel = chrome !== 'overlay'

  if (chrome === 'portrait-engine') {
    return (
      <div className={panelFrameClass(chrome)} data-sidebar-panel>
        <div className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
          Engine
        </div>
        <div className="mt-1 flex min-h-0 flex-1 flex-col">
          <EngineControl compact className="flex min-h-0 flex-1 flex-col" />
        </div>
      </div>
    )
  }

  if (chrome === 'portrait-rudder') {
    return (
      <div className={panelFrameClass(chrome)} data-sidebar-panel>
        <div className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
          Rudder
        </div>
        <div className="mt-1 flex min-h-0 flex-1 flex-col justify-end">
          <RudderControl compact />
        </div>
      </div>
    )
  }

  if (chrome === 'overlay') {
    return (
      <div className={panelFrameClass(chrome)}>
        <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
          Controls
        </div>
        <div className="mt-2 space-y-2.5">
          <EngineControl />
          <RudderControl />
        </div>
      </div>
    )
  }

  return (
    <div className={panelFrameClass(chrome)} {...(isPanel ? { 'data-sidebar-panel': true } : {})}>
      <div className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-sky-300/70">
        Controls
      </div>
      <div className="mt-1 flex min-w-0 flex-row items-end gap-1.5">
        <div className="min-w-0 flex-1">
          <RudderControl compact chrome="desktop-sidebar" />
        </div>
        <div className="flex h-36 w-11 shrink-0 flex-col">
          <EngineControl
            compact
            chrome="desktop-sidebar"
            className="flex h-full min-h-0 flex-col"
          />
        </div>
      </div>
    </div>
  )
}
