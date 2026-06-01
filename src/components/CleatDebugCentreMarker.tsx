import type { CSSProperties } from 'react'

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483645,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  fontFamily: 'system-ui, sans-serif',
}

const circleStyle: CSSProperties = {
  width: 120,
  height: 120,
  borderRadius: '50%',
  backgroundColor: '#ff2222',
  border: '6px solid #ffffff',
  boxShadow: '0 0 28px rgba(255, 34, 34, 0.95)',
}

const labelStyle: CSSProperties = {
  marginTop: 16,
  padding: '10px 14px',
  maxWidth: 340,
  borderRadius: 8,
  backgroundColor: 'rgba(2, 6, 23, 0.94)',
  border: '1px solid rgba(251, 191, 36, 0.7)',
  color: '#fde68a',
  fontSize: 12,
  lineHeight: 1.45,
  textAlign: 'center',
}

/** Centre-screen debug UI (inline styles only). */
export function CleatDebugCentreMarker({ layer }: { layer: 'react-app' | 'react-portal' }) {
  return (
    <div data-cleat-debug-layer={layer} style={overlayStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={circleStyle} />
        <div style={labelStyle}>
          <strong style={{ display: 'block', marginBottom: 6, color: '#fcd34d' }}>
            React debug ({layer})
          </strong>
          Konsol: localStorage.setItem(&apos;hm-cleat-debug&apos;, &apos;1&apos;)
        </div>
      </div>
    </div>
  )
}
