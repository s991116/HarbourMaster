import type { CSSProperties } from 'react'
import { useSimulatorStore } from '../store/simulatorStore'

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  cursor: 'pointer',
  backgroundColor: 'rgba(2, 6, 23, 0.35)',
  border: 'none',
  padding: 0,
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: '#f8fafc',
  textAlign: 'center',
  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
  pointerEvents: 'none',
}

const iconWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 88,
  height: 88,
  borderRadius: '50%',
  backgroundColor: 'rgba(15, 23, 42, 0.92)',
  border: '2px solid rgba(125, 211, 252, 0.45)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
}

type PauseOverlayProps = {
  /** Cover the scaled basin frame (default) or the full viewport. */
  scope?: 'viewport' | 'basin'
}

/** Shown after scenario load/reset until the user clicks or presses Enter. */
export function PauseOverlay({ scope = 'basin' }: PauseOverlayProps) {
  const running = useSimulatorStore((s) => s.running)
  const resume = useSimulatorStore((s) => s.resume)

  if (running) return null

  const scopedStyle: CSSProperties =
    scope === 'basin'
      ? { ...overlayStyle, position: 'absolute' }
      : overlayStyle

  return (
    <button
      type="button"
      aria-label="Start simulation"
      data-pause-overlay
      style={scopedStyle}
      onClick={() => resume()}
    >
      <h1 style={titleStyle}>Harbour Manoeuvre Trainer</h1>
      <div style={iconWrapStyle} aria-hidden>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="#e2e8f0" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="#e2e8f0" />
        </svg>
      </div>
    </button>
  )
}
