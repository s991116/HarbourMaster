import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const TOP_SECTION_SELECTOR = '[data-sidebar-top]'

export type HarbourPanelsOrientation = 'landscape' | 'portrait'

/**
 * Min height (px) of the scrollable area above Controls (landscape) before Scenario
 * and Wind may both stay open. Below this, opening one closes the other.
 */
export const MIN_TOP_SECTION_HEIGHT_BOTH_OPEN_PX = 520

export function canOpenScenarioAndWindTogether(
  container: HTMLElement,
  orientation: HarbourPanelsOrientation,
): boolean {
  if (orientation === 'portrait') return false

  const top = container.querySelector<HTMLElement>(TOP_SECTION_SELECTOR)
  const height = top?.clientHeight ?? container.clientHeight
  if (height < 1) return true
  return height >= MIN_TOP_SECTION_HEIGHT_BOTH_OPEN_PX
}

type ExclusivePanel = 'scenario' | 'wind'

export function useHarbourSidebarCollapse(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  orientation: HarbourPanelsOrientation,
) {
  const [scenarioOpen, setScenarioOpen] = useState(false)
  const [windOpen, setWindOpen] = useState(true)
  const scenarioOpenRef = useRef(scenarioOpen)
  const windOpenRef = useRef(windOpen)
  const lastOpenedRef = useRef<ExclusivePanel>('wind')

  scenarioOpenRef.current = scenarioOpen
  windOpenRef.current = windOpen

  const resolveBothOpenConflict = () => {
    if (!scenarioOpenRef.current || !windOpenRef.current) return

    if (lastOpenedRef.current === 'scenario') {
      setWindOpen(false)
    } else {
      setScenarioOpen(false)
    }
  }

  const applyLayoutRule = (container: HTMLElement) => {
    if (orientation === 'portrait') {
      resolveBothOpenConflict()
      return
    }

    if (container.clientHeight < 1) return
    if (canOpenScenarioAndWindTogether(container, orientation)) return
    resolveBothOpenConflict()
  }

  const openScenario = (open: boolean) => {
    if (open) {
      lastOpenedRef.current = 'scenario'
      const container = containerRef.current
      if (
        orientation === 'portrait' ||
        (container && !canOpenScenarioAndWindTogether(container, orientation))
      ) {
        setWindOpen(false)
      }
      setScenarioOpen(true)
      return
    }
    setScenarioOpen(false)
  }

  const openWind = (open: boolean) => {
    if (open) {
      lastOpenedRef.current = 'wind'
      const container = containerRef.current
      if (
        orientation === 'portrait' ||
        (container && !canOpenScenarioAndWindTogether(container, orientation))
      ) {
        setScenarioOpen(false)
      }
      setWindOpen(true)
      return
    }
    setWindOpen(false)
  }

  useLayoutEffect(() => {
    if (!enabled) {
      setScenarioOpen(true)
      setWindOpen(true)
      return
    }

    const container = containerRef.current
    if (!container) return

    if (orientation === 'portrait') {
      setScenarioOpen(false)
      setWindOpen(true)
      lastOpenedRef.current = 'wind'
      return
    }

    if (container.clientHeight < 1) return

    if (canOpenScenarioAndWindTogether(container, orientation)) {
      setScenarioOpen(true)
      setWindOpen(true)
      return
    }

    setScenarioOpen(false)
    setWindOpen(true)
    lastOpenedRef.current = 'wind'
  }, [containerRef, enabled, orientation])

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    let frame = 0

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        applyLayoutRule(container)
        requestAnimationFrame(() => applyLayoutRule(container))
      })
    }

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(container)
    const top = container.querySelector(TOP_SECTION_SELECTOR)
    if (top) observer.observe(top)
    window.addEventListener('resize', scheduleMeasure)
    scheduleMeasure()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [containerRef, enabled, orientation])

  return {
    scenarioOpen,
    windOpen,
    onScenarioOpenChange: openScenario,
    onWindOpenChange: openWind,
  }
}
