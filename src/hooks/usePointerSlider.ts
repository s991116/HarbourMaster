import { useCallback, useRef } from 'react'
import { clamp } from '../physics/vector2'

type UsePointerSliderOptions = {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  orientation: 'horizontal' | 'vertical'
}

function snapToStep(raw: number, min: number, max: number, step: number): number {
  const stepped = Math.round((raw - min) / step) * step + min
  return clamp(stepped, min, max)
}

export function usePointerSlider({
  min,
  max,
  step,
  value,
  onChange,
  orientation,
}: UsePointerSliderOptions) {
  const trackRef = useRef<HTMLDivElement>(null)

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current
      if (!track) return value

      const rect = track.getBoundingClientRect()
      const ratio =
        orientation === 'horizontal'
          ? (clientX - rect.left) / rect.width
          : 1 - (clientY - rect.top) / rect.height

      const raw = min + clamp(ratio, 0, 1) * (max - min)
      return snapToStep(raw, min, max, step)
    },
    [max, min, orientation, step, value],
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

  const ratio = max === min ? 0 : (value - min) / (max - min)

  return {
    trackRef,
    ratio,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel: handlePointerUp,
  }
}
