import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const TOP_SECTION_SELECTOR = '[data-sidebar-top]'

/**
 * Min height (px) of the scrollable area above Controls before Scenario and Wind
 * may both stay open at the same time. Below this, opening one closes the other.
 */
export const MIN_TOP_SECTION_HEIGHT_BOTH_OPEN_PX = 520

export function canOpenScenarioAndWindTogether(aside: HTMLElement): boolean {
  const top = aside.querySelector<HTMLElement>(TOP_SECTION_SELECTOR)
  const height = top?.clientHeight ?? aside.clientHeight
  if (height < 1) return true
  return height >= MIN_TOP_SECTION_HEIGHT_BOTH_OPEN_PX
}

type ExclusivePanel = 'scenario' | 'wind'

export function useHarbourSidebarCollapse(
  asideRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [scenarioOpen, setScenarioOpen] = useState(false)
  const [windOpen, setWindOpen] = useState(true)
  const scenarioOpenRef = useRef(scenarioOpen)
  const windOpenRef = useRef(windOpen)
  const lastOpenedRef = useRef<ExclusivePanel>('wind')

  scenarioOpenRef.current = scenarioOpen
  windOpenRef.current = windOpen

  const resolveBothOpenConflict = (aside: HTMLElement) => {
    if (!scenarioOpenRef.current || !windOpenRef.current) return
    if (canOpenScenarioAndWindTogether(aside)) return

    if (lastOpenedRef.current === 'scenario') {
      setWindOpen(false)
    } else {
      setScenarioOpen(false)
    }
  }

  const applyHeightRule = (aside: HTMLElement) => {
    if (aside.clientHeight < 1) return
    resolveBothOpenConflict(aside)
  }

  const openScenario = (open: boolean) => {
    if (open) {
      lastOpenedRef.current = 'scenario'
      const aside = asideRef.current
      if (aside && !canOpenScenarioAndWindTogether(aside)) {
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
      const aside = asideRef.current
      if (aside && !canOpenScenarioAndWindTogether(aside)) {
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

    const aside = asideRef.current
    if (!aside || aside.clientHeight < 1) return

    if (canOpenScenarioAndWindTogether(aside)) {
      setScenarioOpen(true)
      setWindOpen(true)
      return
    }

    setScenarioOpen(false)
    setWindOpen(true)
    lastOpenedRef.current = 'wind'
  }, [asideRef, enabled])

  useEffect(() => {
    if (!enabled) return

    const aside = asideRef.current
    if (!aside) return

    let frame = 0

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        applyHeightRule(aside)
        requestAnimationFrame(() => applyHeightRule(aside))
      })
    }

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(aside)
    const top = aside.querySelector(TOP_SECTION_SELECTOR)
    if (top) observer.observe(top)
    window.addEventListener('resize', scheduleMeasure)
    scheduleMeasure()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [asideRef, enabled])

  return {
    scenarioOpen,
    windOpen,
    onScenarioOpenChange: openScenario,
    onWindOpenChange: openWind,
  }
}
