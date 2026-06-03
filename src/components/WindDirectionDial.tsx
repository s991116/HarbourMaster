import { useCallback, useRef } from 'react'
import { snapWindDirectionDegrees } from '../controls/controlSteps'

type WindDirectionDialProps = {
  degrees: number
  onChange: (degrees: number) => void
}

function degreesFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  fallback: number,
): number {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = clientX - cx
  const dy = clientY - cy
  if (dx === 0 && dy === 0) return fallback

  const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI
  const normalized = angleDeg < 0 ? angleDeg + 360 : angleDeg
  return snapWindDirectionDegrees(normalized)
}

export function WindDirectionDial({ degrees, onChange }: WindDirectionDialProps) {
  const dialRef = useRef<HTMLDivElement>(null)

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const dial = dialRef.current
      if (!dial) return degrees
      return degreesFromPointer(clientX, clientY, dial.getBoundingClientRect(), degrees)
    },
    [degrees],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    onChange(valueFromPointer(event.clientX, event.clientY))
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    onChange(valueFromPointer(event.clientX, event.clientY))
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const markerRad = (degrees * Math.PI) / 180
  const markerLeft = `calc(50% + ${Math.sin(markerRad) * 50}% - 6px)`
  const markerTop = `calc(50% - ${Math.cos(markerRad) * 50}% - 6px)`

  return (
    <div
      ref={dialRef}
      role="slider"
      aria-label="Wind direction"
      aria-valuemin={0}
      aria-valuemax={350}
      aria-valuenow={degrees}
      aria-valuetext={`${degrees} degrees`}
      className="relative h-11 w-11 shrink-0 touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="absolute inset-1 flex items-center justify-center rounded-full border border-sky-400/35 bg-transparent"
        style={{ transform: `rotate(${degrees}deg)` }}
        aria-hidden
      >
        <div className="h-0 w-0 border-x-[5px] border-b-[12px] border-x-transparent border-b-sky-300" />
      </div>

      <div
        className="absolute z-10 h-3 w-3 rounded-full border-2 border-sky-200 bg-sky-400 shadow-md"
        style={{ left: markerLeft, top: markerTop }}
        aria-hidden
      />
    </div>
  )
}
