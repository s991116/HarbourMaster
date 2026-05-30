import { HarbourScene } from './components/HarbourScene'
import { ControlsPanel } from './components/ControlsPanel'
import { HUD } from './components/HUD'
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
      <HUD />
      <ControlsPanel />
    </div>
  )
}

export default App
