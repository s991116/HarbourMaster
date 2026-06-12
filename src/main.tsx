import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RootApp } from './RootApp.tsx'
import { ensureSimulatorStoreFields } from './store/ensureSimulatorStoreFields'

ensureSimulatorStoreFields()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
