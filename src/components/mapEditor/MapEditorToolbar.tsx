import { harbourActionButtonClass, harbourIconButtonClass } from '../panelStyles'
import { useTileMapEditorStore, type EditorTool } from '../../store/tileMapEditorStore'
import { TERRAIN_COLORS, OBJECT_COLORS } from './tileColors'

const TERRAIN_TOOLS: Array<{ id: EditorTool; label: string }> = [
  { id: 'water', label: 'Water' },
  { id: 'quay', label: 'Quay' },
  { id: 'land', label: 'Land' },
]

const OBJECT_TOOLS: Array<{ id: EditorTool; label: string }> = [
  { id: 'pole', label: 'Pole' },
  { id: 'cleat', label: 'Cleat' },
]

function toolButtonClass(active: boolean) {
  return `${harbourIconButtonClass} min-h-11 min-w-11 px-2 text-[10px] uppercase tracking-wide ${
    active ? 'border-sky-400 bg-slate-800/80 text-sky-100' : ''
  }`
}

export function MapEditorToolbar() {
  const tool = useTileMapEditorStore((s) => s.tool)
  const setTool = useTileMapEditorStore((s) => s.setTool)
  const resetToEmptyBasin = useTileMapEditorStore((s) => s.resetToEmptyBasin)

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-slate-700 bg-[#0b1f33] p-3 sm:w-44 sm:border-b-0 sm:border-r">
      <div>
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-sky-300/70">
          Tools
        </div>
        <div className="flex flex-wrap gap-1.5 sm:flex-col">
          <button
            type="button"
            className={toolButtonClass(tool === 'pan')}
            onClick={() => setTool('pan')}
          >
            Pan
          </button>
          {TERRAIN_TOOLS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={toolButtonClass(tool === id)}
              onClick={() => setTool(id)}
            >
              <span
                className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle"
                style={{ backgroundColor: TERRAIN_COLORS[id as keyof typeof TERRAIN_COLORS] }}
                aria-hidden
              />
              {label}
            </button>
          ))}
          {OBJECT_TOOLS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={toolButtonClass(tool === id)}
              onClick={() => setTool(id)}
            >
              <span
                className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: OBJECT_COLORS[id as keyof typeof OBJECT_COLORS] }}
                aria-hidden
              />
              {label}
            </button>
          ))}
          <button
            type="button"
            className={toolButtonClass(tool === 'erase')}
            onClick={() => setTool('erase')}
          >
            Erase
          </button>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-slate-400">
        Scroll to zoom. Pan tool or Alt-drag to move. Paint by dragging.
      </p>

      <button type="button" className={harbourActionButtonClass} onClick={resetToEmptyBasin}>
        Reset to empty basin
      </button>
    </aside>
  )
}
