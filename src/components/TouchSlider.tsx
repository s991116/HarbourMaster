import { usePointerSlider } from '../hooks/usePointerSlider'

type TouchSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  orientation?: 'horizontal' | 'vertical'
  minLabel?: string
  midLabel?: string
  maxLabel?: string
  className?: string
  compact?: boolean
  showLabel?: boolean
}

export function TouchSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  orientation = 'horizontal',
  minLabel,
  midLabel,
  maxLabel,
  className = '',
  compact = false,
  showLabel = true,
}: TouchSliderProps) {
  const {
    trackRef,
    ratio,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = usePointerSlider({ min, max, step, value, onChange, orientation })

  const displayValue = formatValue ? formatValue(value) : String(value)
  const isVertical = orientation === 'vertical'

  const trackClass = isVertical
    ? `relative w-11 min-w-11 flex-1 touch-none select-none ${compact ? 'min-h-24' : 'min-h-32'}`
    : `relative h-11 w-full touch-none select-none ${compact ? '' : ''}`

  const railClass = isVertical
    ? 'absolute inset-x-3 inset-y-1 rounded-full bg-slate-800/80'
    : 'absolute inset-x-1 inset-y-3 rounded-full bg-slate-800/80'

  const thumbStyle = isVertical
    ? {
        bottom: `calc(${ratio * 100}% - 12px)`,
        left: '50%',
        transform: 'translateX(-50%)',
      }
    : {
        left: `${ratio * 100}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }

  return (
    <div className={`bg-transparent ${className}`}>
      {!isVertical && showLabel ? (
        <div className="mb-1 flex justify-between text-[10px] text-slate-300">
          <span>{label}</span>
          <span className="tabular-nums text-slate-400">{displayValue}</span>
        </div>
      ) : null}

      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className={trackClass}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={railClass} />
        <div
          className="absolute h-6 w-6 rounded-full border-2 border-sky-300 bg-sky-400/90 shadow-md"
          style={thumbStyle}
          aria-hidden
        />
      </div>

      {!isVertical && (minLabel || midLabel || maxLabel) ? (
        <div className="mt-1 flex justify-between text-[9px] text-slate-500">
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}

      {isVertical ? (
        <div className="mt-1 text-center text-[9px] leading-tight text-slate-400">
          <div>{displayValue}</div>
          {minLabel && maxLabel ? (
            <div className="mt-1 flex flex-col gap-6 text-slate-500">
              <span>{maxLabel}</span>
              <span>{minLabel}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
