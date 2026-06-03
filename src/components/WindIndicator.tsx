import { useState } from 'react'
import {
  MAX_WIND_SPEED_KNOTS,
  windDirectionRadiansToDegrees,
  windSpeedMsToKnots,
} from '../controls/controlSteps'
import type { HarbourPanelLayout } from './panelStyles'
import { harbourPanelWidthClass } from './panelStyles'
import { HarbourCollapsiblePanel } from './HarbourCollapsiblePanel'
import { TouchSlider } from './TouchSlider'
import { WindDirectionDial } from './WindDirectionDial'
import { useSimulatorStore } from '../store/simulatorStore'

type WindIndicatorProps = {
  layout?: HarbourPanelLayout
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WindIndicator({
  layout = 'overlay',
  open: controlledOpen,
  onOpenChange,
}: WindIndicatorProps) {
  const [overlayOpen, setOverlayOpen] = useState(true)
  const open = controlledOpen ?? overlayOpen
  const setOpen = onOpenChange ?? setOverlayOpen
  const isSidebar = layout === 'sidebar'

  const wind = useSimulatorStore((s) => s.snapshot.wind)
  const setWindSpeedKnots = useSimulatorStore((s) => s.setWindSpeedKnots)
  const setWindDirectionDegrees = useSimulatorStore((s) => s.setWindDirectionDegrees)

  const speedKnots = windSpeedMsToKnots(wind.speed)
  const directionDegrees = windDirectionRadiansToDegrees(wind.direction)

  const body = (
    <div
      className={
        isSidebar
          ? 'flex flex-col items-center gap-1'
          : 'mt-0.5 flex items-end gap-6'
      }
    >
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <div className="text-sm font-semibold tabular-nums text-white">
          {directionDegrees}°
        </div>
        <WindDirectionDial
          degrees={directionDegrees}
          onChange={setWindDirectionDegrees}
        />
      </div>

      <div
        className={
          isSidebar
            ? 'flex w-full flex-col gap-0.5'
            : 'flex min-w-0 flex-1 flex-col gap-0.5'
        }
      >
        <div className="text-sm font-semibold tabular-nums text-white">
          {speedKnots} kt
        </div>
        <TouchSlider
          label="Wind speed"
          showLabel={false}
          value={speedKnots}
          min={0}
          max={MAX_WIND_SPEED_KNOTS}
          step={1}
          onChange={setWindSpeedKnots}
          formatValue={(value) => `${value} kt`}
          compact={isSidebar}
        />
      </div>
    </div>
  )

  const panel = (
    <HarbourCollapsiblePanel
      title="Wind"
      open={open}
      onOpenChange={setOpen}
      layout={layout}
      sidebarPanel={isSidebar}
    >
      {body}
    </HarbourCollapsiblePanel>
  )

  if (isSidebar) {
    return panel
  }

  return (
    <div
      className={`absolute right-3 top-3 z-10 sm:right-10 ${harbourPanelWidthClass}`}
    >
      {panel}
    </div>
  )
}
