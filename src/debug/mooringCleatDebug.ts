function readCleatDebugParam(params: URLSearchParams): boolean | null {
  if (!params.has('cleatDebug')) return null
  const value = params.get('cleatDebug')
  if (value === null || value === '' || value === '1' || value === 'true') return true
  return value !== '0' && value !== 'false'
}

function readFromLocalStorage(): boolean {
  try {
    return window.localStorage.getItem('hm-cleat-debug') === '1'
  } catch {
    return false
  }
}

/** Read `cleatDebug` from `?cleatDebug=1`, hash query, localStorage, or dev mode. */
export function isMooringCleatDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false

  if (readFromLocalStorage()) return true

  const fromSearch = readCleatDebugParam(new URLSearchParams(window.location.search))
  if (fromSearch !== null) return fromSearch

  const hash = window.location.hash
  if (hash.includes('?')) {
    const fromHash = readCleatDebugParam(
      new URLSearchParams(hash.slice(hash.indexOf('?'))),
    )
    if (fromHash !== null) return fromHash
  }

  return false
}
