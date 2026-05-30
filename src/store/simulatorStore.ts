import { create } from 'zustand'
import type { PhysicsInput, PhysicsSnapshot } from '../physics/types'
import { SimulatorController } from '../simulator/controller'
import { getScenario, SCENARIOS, type ScenarioId } from '../simulator/scenarios'

type SimulatorStore = {
  scenarioId: ScenarioId
  running: boolean
  input: PhysicsInput
  snapshot: PhysicsSnapshot
  controller: SimulatorController
  setScenario: (id: ScenarioId) => void
  setRunning: (running: boolean) => void
  setThrottle: (throttle: number) => void
  setRudder: (rudderAngle: number) => void
  adjustThrottle: (delta: number) => void
  adjustRudder: (delta: number) => void
  neutralControls: () => void
  resetScenario: () => void
  tick: (dt: number) => void
}

const initialScenario = getScenario('empty-basin')
const controller = new SimulatorController(initialScenario.id)

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  scenarioId: 'empty-basin',
  running: true,
  input: { throttle: 0, rudderAngle: 0 },
  snapshot: controller.getSnapshot(),
  controller,

  setScenario: (id) => {
    controller.loadScenario(id)
    controller.start()
    set({
      scenarioId: id,
      running: true,
      input: { throttle: 0, rudderAngle: 0 },
      snapshot: controller.getSnapshot(),
    })
  },

  setRunning: (running) => {
    if (running) controller.start()
    else controller.stop()
    set({ running })
  },

  setThrottle: (throttle) => {
    set((state) => ({
      input: { ...state.input, throttle: Math.max(-1, Math.min(1, throttle)) },
    }))
  },

  setRudder: (rudderAngle) => {
    set((state) => ({
      input: {
        ...state.input,
        rudderAngle: Math.max(-0.52, Math.min(0.52, rudderAngle)),
      },
    }))
  },

  adjustThrottle: (delta) => {
    const { input } = get()
    get().setThrottle(input.throttle + delta)
  },

  adjustRudder: (delta) => {
    const { input } = get()
    get().setRudder(input.rudderAngle + delta)
  },

  neutralControls: () => {
    set({ input: { throttle: 0, rudderAngle: 0 } })
  },

  resetScenario: () => {
    const { scenarioId } = get()
    controller.resetScenario(scenarioId)
    set({
      input: { throttle: 0, rudderAngle: 0 },
      snapshot: controller.getSnapshot(),
      running: true,
    })
  },

  tick: (dt) => {
    const { controller, input, running } = get()
    if (!running) return
    const snapshot = controller.tick(dt, input)
    set({ snapshot })
  },
}))

export { SCENARIOS }
