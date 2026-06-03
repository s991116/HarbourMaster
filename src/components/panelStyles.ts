export type HarbourPanelLayout = 'overlay' | 'sidebar'

/** Scenario panel width (reference size for all harbour UI panels). */
export const harbourPanelWidthClass = 'w-[min(100%,16.94rem)] sm:w-[16.94rem]'

/** Outer harbour UI panels (scenario menu, wind, controls). */
export const harbourPanelClass =
  'rounded-lg border border-sky-400/30 bg-slate-950/10 p-2'

/** Inset controls matching the Settings block (selects, inputs, nested details). */
export const harbourInsetClass =
  'rounded border border-slate-700 bg-slate-900/50 text-white'

export const harbourSelectClass = `${harbourInsetClass} w-full min-h-11 px-2 py-2 text-xs`

export const harbourInputClass = `${harbourInsetClass} w-full min-h-11 px-2 py-2 text-sm`

export const harbourDetailsClass = `group rounded-lg border border-slate-700 bg-slate-900/50`

export const harbourSummaryClass =
  'cursor-pointer list-none min-h-11 px-3 py-2 marker:content-none [&::-webkit-details-marker]:hidden active:bg-slate-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400'

export const harbourIconButtonClass =
  'inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-900/50 text-sky-300/90 transition active:border-slate-500 active:bg-slate-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400'

export const harbourActionButtonClass =
  `${harbourInsetClass} min-h-11 w-full px-3 py-2 text-xs transition active:border-slate-500 active:bg-slate-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`

export const harbourScrollPanelClass = 'touch-pan-y overscroll-y-contain'
