import { harbourIconButtonClass } from './panelStyles'
import { useBasinDisplayStore } from '../store/basinDisplayStore'

function NorthUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M9.5 9.5 12 6l2.5 3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="18.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="6"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        N
      </text>
    </svg>
  )
}

function HeadingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5 8.5 11h7L12 4.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 14.5c1.8-2.8 4.6-4.5 5.5-4.5s3.7 1.7 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 17.5h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Toggle between fixed north-up and heading-up (boat bow up) basin orientation. */
export function BasinViewModeToggle() {
  const viewMode = useBasinDisplayStore((s) => s.viewMode)
  const toggleViewMode = useBasinDisplayStore((s) => s.toggleViewMode)

  const isNorthUp = viewMode === 'north-up'
  const label = isNorthUp
    ? 'North up — switch to heading up'
    : 'Heading up — switch to north up'

  return (
    <button
      type="button"
      className={`${harbourIconButtonClass} bg-slate-950/70 backdrop-blur-sm`}
      aria-label={label}
      title={label}
      onClick={toggleViewMode}
    >
      {isNorthUp ? <NorthUpIcon /> : <HeadingUpIcon />}
    </button>
  )
}
