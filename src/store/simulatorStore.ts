import { create } from 'zustand'
import type { BoatConfig, PhysicsInput, PhysicsSnapshot, Wind } from '../physics/types'
import {
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
  rudderStepToAngle,
  throttleStepToValue,
  windDirectionDegreesToRadians,
  windSpeedKnotsToMs,
} from '../controls/controlSteps'
import { SimulatorController } from '../simulator/controller'
import { getScenario, SCENARIOS, type ScenarioId } from '../simulator/scenarios'

type SimulatorStore = {
  scenarioId: ScenarioId
  running: boolean
  throttleStep: number
  rudderStep: number
  input: PhysicsInput
  boatConfig: BoatConfig
  snapshot: PhysicsSnapshot
  controller: SimulatorController
  setScenario: (id: ScenarioId) => void
  setRunning: (running: boolean) => void
  setThrottleStep: (step: number) => void
  setRudderStep: (step: number) => void
  adjustThrottleStep: (delta: number) => void
  adjustRudderStep: (delta: number) => void
  neutralControls: () => void
  setBoatConfig: (config: BoatConfig) => void
  updateBoatConfig: (partial: Partial<BoatConfig>) => void
  resetBoatConfig: () => void
  setWind: (wind: Wind) => void
  setWindSpeedKnots: (knots: number) => void
  setWindDirectionDegrees: (degrees: number) => void
  resetScenario: () => void
  tick: (dt: number) => void
}

function stepsToInput(throttleStep: number, rudderStep: number): PhysicsInput {
  return {
    throttle: throttleStepToValue(throttleStep),
    rudderAngle: rudderStepToAngle(rudderStep),
  }
}

const initialScenario = getScenario('empty-basin')
const controller = new SimulatorController(initialScenario.id)
controller.start()

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  scenarioId: 'empty-basin',
  running: true,
  throttleStep: 0,
  rudderStep: 0,
  input: stepsToInput(0, 0),
  boatConfig: { ...initialScenario.boatConfig },
  snapshot: controller.getSnapshot(),
  controller,

  setScenario: (id) => {
    const scenario = getScenario(id)
    controller.loadScenario(id)
    controller.setBoatConfig(scenario.boatConfig)
    controller.start()
    set({
      scenarioId: id,
      running: true,
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(0, 0),
      boatConfig: { ...scenario.boatConfig },
      snapshot: controller.getSnapshot(),
    })
  },

  setRunning: (running) => {
    if (running) controller.start()
    else controller.stop()
    set({ running })
  },

  setThrottleStep: (step) => {
    const throttleStep = Math.max(-MAX_THROTTLE_STEP, Math.min(MAX_THROTTLE_STEP, step))
    const { rudderStep } = get()
    set({ throttleStep, input: stepsToInput(throttleStep, rudderStep) })
  },

  setRudderStep: (step) => {
    const rudderStep = Math.max(-MAX_RUDDER_STEP, Math.min(MAX_RUDDER_STEP, step))
    const { throttleStep } = get()
    set({ rudderStep, input: stepsToInput(throttleStep, rudderStep) })
  },

  adjustThrottleStep: (delta) => {
    get().setThrottleStep(get().throttleStep + delta)
  },

  adjustRudderStep: (delta) => {
    get().setRudderStep(get().rudderStep + delta)
  },

  neutralControls: () => {
    set({
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(0, 0),
    })
  },

  setBoatConfig: (config) => {
    get().controller.setBoatConfig(config)
    set({ boatConfig: { ...config } })
  },

  updateBoatConfig: (partial) => {
    const next = { ...get().boatConfig, ...partial }
    get().controller.setBoatConfig(next)
    set({ boatConfig: next })
  },

  resetBoatConfig: () => {
    const scenario = getScenario(get().scenarioId)
    get().setBoatConfig({ ...scenario.boatConfig })
  },

  setWind: (wind) => {
    get().controller.setWind(wind)
    set({ snapshot: { ...get().snapshot, wind: { ...wind } } })
  },

  setWindSpeedKnots: (knots) => {
    const speed = windSpeedKnotsToMs(knots)
    const { snapshot } = get()
    get().setWind({ ...snapshot.wind, speed })
  },

  setWindDirectionDegrees: (degrees) => {
    const direction = windDirectionDegreesToRadians(degrees)
    const { snapshot } = get()
    get().setWind({ ...snapshot.wind, direction })
  },

  resetScenario: () => {
    const { scenarioId } = get()
    const scenario = getScenario(scenarioId)
    controller.resetScenario(scenarioId)
    controller.setBoatConfig(scenario.boatConfig)
    controller.start()
    set({
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(0, 0),
      boatConfig: { ...scenario.boatConfig },
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
