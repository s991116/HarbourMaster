import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BASIN_VIEW_FIT_MARGIN,
  basinViewAspectRatio,
  fitBasinViewportSize,
  visibleContainerSize,
} from '../harbour/basinDisplay'
import { getScenario } from '../simulator/scenarios'
import { useSimulatorStore } from '../store/simulatorStore'
import { BasinViewModeToggle } from './BasinViewModeToggle'
import { HarbourScene } from './HarbourScene'

type BasinViewportProps = {
  cleatDebug?: boolean
  children?: ReactNode
}

/**
 * Sizes the harbour canvas to the scenario basin aspect ratio and scales it to
 * fill as much of the available area as possible (letterboxed, centered).
 */
export function BasinViewport({ cleatDebug = false, children }: BasinViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scenarioId = useSimulatorStore((s) => s.scenarioId)
  const aspect = basinViewAspectRatio(getScenario(scenarioId).bounds)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const rect = container.getBoundingClientRect()
      const { width, height } = visibleContainerSize(rect)
      setSize(fitBasinViewportSize(width, height, aspect, BASIN_VIEW_FIT_MARGIN))
    }

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    const onViewportChange = () => measure()
    window.addEventListener('resize', onViewportChange)
    window.visualViewport?.addEventListener('resize', onViewportChange)
    measure()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onViewportChange)
      window.visualViewport?.removeEventListener('resize', onViewportChange)
    }
  }, [aspect])

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full min-h-0 min-w-0 items-center justify-center bg-[#0b1f33]"
    >
      <div
        data-basin-viewport
        className="relative shrink-0 overflow-hidden"
        style={{
          width: size.width > 0 ? size.width : undefined,
          height: size.height > 0 ? size.height : undefined,
        }}
      >
        <HarbourScene cleatDebug={cleatDebug} />
        <div className="pointer-events-none absolute right-2 top-2 z-10">
          <div className="pointer-events-auto">
            <BasinViewModeToggle />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
