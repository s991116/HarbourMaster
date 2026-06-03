import type { CSSProperties } from 'react'
import { usePierCleatScreenStore } from '../store/pierCleatScreenStore'

/** Quay/pier cleat dots (fixed world positions, below UI panels). */
export function PierCleatMarkersOverlay() {
  const markers = usePierCleatScreenStore((s) => s.markers)
  const markerDiameterPx = usePierCleatScreenStore((s) => s.markerDiameterPx)
  const frame = usePierCleatScreenStore((s) => s.frame)

  if (markers.length === 0) return null

  const half = markerDiameterPx / 2
  const border = Math.max(1, markerDiameterPx * 0.12)

  const dotStyle: CSSProperties = {
    position: 'fixed',
    width: markerDiameterPx,
    height: markerDiameterPx,
    marginLeft: -half,
    marginTop: -half,
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
    border: `${border}px solid #000000`,
    boxShadow: '0 0 12px rgba(245, 158, 11, 0.9)',
    pointerEvents: 'none',
    zIndex: 1,
  }

  return (
    <div aria-hidden data-pier-cleat-overlay data-frame={frame}>
      {markers.map((marker) => (
        <div
          key={marker.id}
          style={{
            ...dotStyle,
            left: marker.x,
            top: marker.y,
          }}
          title={marker.id}
        />
      ))}
    </div>
  )
}
