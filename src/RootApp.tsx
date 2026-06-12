import { useEffect, useState } from 'react'
import App from './App'
import { MapEditorApp } from './components/mapEditor/MapEditorApp'

function isEditorRoute(): boolean {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return hash === 'editor'
}

export function RootApp() {
  const [editor, setEditor] = useState(isEditorRoute)

  useEffect(() => {
    const sync = () => setEditor(isEditorRoute())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  if (editor) return <MapEditorApp />
  return <App />
}
