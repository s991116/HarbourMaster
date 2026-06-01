import type { CSSProperties } from 'react'
import { useCollisionHullScreenStore } from '../store/collisionHullScreenStore'
import { useSimulatorStore } from '../store/simulatorStore'

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 1,
}

/** Screen-space collision hull outline (same polygon as physics). */
export function CollisionHullScreenOverlay() {
  const hullRing = useCollisionHullScreenStore((s) => s.hullRing)
  const showCollisionHull = useSimulatorStore((s) => s.showCollisionHull)

  if (!showCollisionHull || !hullRing?.visible) return null

  const points = hullRing.points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg aria-hidden data-collision-hull-overlay style={overlayStyle}>
      <polygon
        points={points}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={2}
      />
    </svg>
  )
}
