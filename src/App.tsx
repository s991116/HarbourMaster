import { HarbourScene } from './components/HarbourScene'
import { ControlsPanel } from './components/ControlsPanel'
import { ScenarioSelector } from './components/ScenarioSelector'
import { WindIndicator } from './components/WindIndicator'
import { useKeyboardControls } from './hooks/useKeyboardControls'

function App() {
  useKeyboardControls()

  return (
    <div className="relative h-full w-full">
      <HarbourScene />
      <ScenarioSelector />
      <WindIndicator />
      <ControlsPanel />
    </div>
  )
}

export default App
