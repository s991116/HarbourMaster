import { useEffect, useState } from 'react'
import { harbourInputClass } from './panelStyles'

type ParameterTextFieldProps = {
  label: string
  value: string
  onCommit: (value: string) => void
}

/** Single-line text editor that commits on blur or Enter. */
export function ParameterTextField({ label, value, onCommit }: ParameterTextFieldProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = () => {
    if (draft !== value) onCommit(draft)
  }

  return (
    <label className="block text-xs text-slate-300">
      {label}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
            event.currentTarget.blur()
          }
        }}
        className={`mt-1 ${harbourInputClass} font-mono text-xs`}
        spellCheck={false}
      />
    </label>
  )
}
