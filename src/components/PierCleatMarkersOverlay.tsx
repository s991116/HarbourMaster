import type { CSSProperties } from 'react'
import { CLEAT_MARKER_SIZE_PX } from '../controls/cleatMarkerSize'
import { usePierCleatScreenStore } from '../store/pierCleatScreenStore'

const half = CLEAT_MARKER_SIZE_PX / 2

const dotStyle: CSSProperties = {
  position: 'fixed',
  width: CLEAT_MARKER_SIZE_PX,
  height: CLEAT_MARKER_SIZE_PX,
  marginLeft: -half,
  marginTop: -half,
  borderRadius: '50%',
  backgroundColor: '#f59e0b',
  border: '1px solid #000000',
  boxShadow: '0 0 12px rgba(245, 158, 11, 0.9)',
  pointerEvents: 'none',
  zIndex: 1,
}

/** Quay/pier cleat dots (fixed world positions, below UI panels). */
export function PierCleatMarkersOverlay() {
  const markers = usePierCleatScreenStore((s) => s.markers)
  const frame = usePierCleatScreenStore((s) => s.frame)

  if (markers.length === 0) return null

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
