import { useRef } from 'react'
import { harbourActionButtonClass } from '../panelStyles'
import { cloneTileMap, parseTileMapJson, serializeTileMap } from '../../simulator/tileMap/bakeScenario'
import { registerTileMapOverride } from '../../simulator/tileMap/registry'
import { useTileMapEditorStore } from '../../store/tileMapEditorStore'
import { MapEditorToolbar } from './MapEditorToolbar'
import { TileMapCanvas } from './TileMapCanvas'

export function MapEditorApp() {
  const tileMap = useTileMapEditorStore((s) => s.tileMap)
  const setTileMap = useTileMapEditorStore((s) => s.setTileMap)
  const importRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const json = serializeTileMap(tileMap)
    try {
      await navigator.clipboard.writeText(json)
    } catch {
      // fallback: download
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'harbour-tilemap.json'
      anchor.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const map = parseTileMapJson(String(reader.result))
        setTileMap(cloneTileMap(map))
      } catch (error) {
        console.error(error)
        window.alert('Invalid tile map JSON')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handlePlay = () => {
    registerTileMapOverride('empty-basin', tileMap)
    window.location.hash = ''
    window.location.reload()
  }

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-[#0b1f33] text-slate-100">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-700 px-3 py-2">
        <h1 className="text-sm font-semibold text-sky-100">Map editor</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={harbourActionButtonClass} onClick={handleExport}>
            Export JSON
          </button>
          <button
            type="button"
            className={harbourActionButtonClass}
            onClick={() => importRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button type="button" className={harbourActionButtonClass} onClick={handlePlay}>
            Play map
          </button>
          <a
            href="#"
            className={`${harbourActionButtonClass} inline-flex items-center justify-center text-center`}
          >
            Back to Simulator
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <MapEditorToolbar />
        <TileMapCanvas />
      </div>
    </div>
  )
}
