import type { CSSProperties } from 'react'
import { CLEAT_MARKER_SIZE_PX } from '../controls/cleatMarkerSize'
import { useCleatScreenStore } from '../store/cleatScreenStore'

/** Cleat dots above the canvas, below UI panels. */
export function BoatMooringCleatMarkersOverlay() {
  const markers = useCleatScreenStore((s) => s.markers)
  const frame = useCleatScreenStore((s) => s.frame)

  const half = CLEAT_MARKER_SIZE_PX / 2
  const border = 1

  const dotStyle: CSSProperties = {
    position: 'fixed',
    width: CLEAT_MARKER_SIZE_PX,
    height: CLEAT_MARKER_SIZE_PX,
    marginLeft: -half,
    marginTop: -half,
    borderRadius: '50%',
    backgroundColor: '#ff2222',
    border: `${border}px solid #000000`,
    boxShadow: '0 0 14px rgba(255, 34, 34, 0.95)',
    pointerEvents: 'none',
    zIndex: 1,
  }

  return (
    <div aria-hidden data-mooring-cleat-overlay data-frame={frame}>
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
