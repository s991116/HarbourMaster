import { create } from 'zustand'
import type { BoatConfig, PhysicsInput, PhysicsSnapshot, Wind } from '../physics/types'
import {
  DEFAULT_MAX_RUDDER_ANGLE_DEG,
  MAX_RUDDER_STEP,
  MAX_THROTTLE_STEP,
  maxRudderAngleDegreesToRadians,
  rudderStepToAngle,
  snapMaxRudderAngleDegrees,
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
  showCollisionHull: boolean
  maxRudderAngleDegrees: number
  snapshot: PhysicsSnapshot
  controller: SimulatorController
  setShowCollisionHull: (show: boolean) => void
  setScenario: (id: ScenarioId) => void
  setRunning: (running: boolean) => void
  resume: () => void
  setThrottleStep: (step: number) => void
  setRudderStep: (step: number) => void
  adjustThrottleStep: (delta: number) => void
  adjustRudderStep: (delta: number) => void
  neutralControls: () => void
  setBoatConfig: (config: BoatConfig) => void
  updateBoatConfig: (partial: Partial<BoatConfig>) => void
  resetBoatConfig: () => void
  setMaxRudderAngleDegrees: (degrees: number) => void
  resetMaxRudderAngleDegrees: () => void
  setWind: (wind: Wind) => void
  setWindSpeedKnots: (knots: number) => void
  setWindDirectionDegrees: (degrees: number) => void
  resetScenario: () => void
  tick: (dt: number) => void
}

function stepsToInput(
  throttleStep: number,
  rudderStep: number,
  maxRudderAngleRad: number,
): PhysicsInput {
  return {
    throttle: throttleStepToValue(throttleStep),
    rudderAngle: rudderStepToAngle(rudderStep, maxRudderAngleRad),
  }
}

const initialScenario = getScenario('empty-basin')
const controller = new SimulatorController(initialScenario.id)

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  scenarioId: 'empty-basin',
  running: false,
  throttleStep: 0,
  rudderStep: 0,
  input: stepsToInput(0, 0, maxRudderAngleDegreesToRadians(DEFAULT_MAX_RUDDER_ANGLE_DEG)),
  boatConfig: { ...initialScenario.boatConfig },
  showCollisionHull: false,
  maxRudderAngleDegrees: DEFAULT_MAX_RUDDER_ANGLE_DEG,
  snapshot: controller.getSnapshot(),
  controller,

  setShowCollisionHull: (show) => {
    set({ showCollisionHull: show })
  },

  setScenario: (id) => {
    const scenario = getScenario(id)
    controller.loadScenario(id)
    controller.setBoatConfig(scenario.boatConfig)
    controller.stop()
    set({
      scenarioId: id,
      running: false,
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(
        0,
        0,
        maxRudderAngleDegreesToRadians(get().maxRudderAngleDegrees),
      ),
      boatConfig: { ...scenario.boatConfig },
      snapshot: controller.getSnapshot(),
    })
  },

  setRunning: (running) => {
    if (running) controller.start()
    else controller.stop()
    set({ running })
  },

  resume: () => {
    controller.start()
    set({ running: true })
  },

  setThrottleStep: (step) => {
    const throttleStep = Math.max(-MAX_THROTTLE_STEP, Math.min(MAX_THROTTLE_STEP, step))
    const { rudderStep, maxRudderAngleDegrees } = get()
    const maxRudderAngleRad = maxRudderAngleDegreesToRadians(maxRudderAngleDegrees)
    set({ throttleStep, input: stepsToInput(throttleStep, rudderStep, maxRudderAngleRad) })
  },

  setRudderStep: (step) => {
    const rudderStep = Math.max(-MAX_RUDDER_STEP, Math.min(MAX_RUDDER_STEP, step))
    const { throttleStep, maxRudderAngleDegrees } = get()
    const maxRudderAngleRad = maxRudderAngleDegreesToRadians(maxRudderAngleDegrees)
    set({ rudderStep, input: stepsToInput(throttleStep, rudderStep, maxRudderAngleRad) })
  },

  adjustThrottleStep: (delta) => {
    get().setThrottleStep(get().throttleStep + delta)
  },

  adjustRudderStep: (delta) => {
    get().setRudderStep(get().rudderStep + delta)
  },

  neutralControls: () => {
    const maxRudderAngleRad = maxRudderAngleDegreesToRadians(get().maxRudderAngleDegrees)
    set({
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(0, 0, maxRudderAngleRad),
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

  setMaxRudderAngleDegrees: (degrees) => {
    const maxRudderAngleDegrees = snapMaxRudderAngleDegrees(degrees)
    const maxRudderAngleRad = maxRudderAngleDegreesToRadians(maxRudderAngleDegrees)
    get().controller.setMaxRudderAngle(maxRudderAngleRad)
    const { throttleStep, rudderStep } = get()
    set({
      maxRudderAngleDegrees,
      input: stepsToInput(throttleStep, rudderStep, maxRudderAngleRad),
    })
  },

  resetMaxRudderAngleDegrees: () => {
    get().setMaxRudderAngleDegrees(DEFAULT_MAX_RUDDER_ANGLE_DEG)
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
    const { scenarioId, boatConfig } = get()
    controller.resetScenario(scenarioId)
    controller.setBoatConfig(boatConfig)
    controller.stop()
    const maxRudderAngleRad = maxRudderAngleDegreesToRadians(get().maxRudderAngleDegrees)
    set({
      throttleStep: 0,
      rudderStep: 0,
      input: stepsToInput(0, 0, maxRudderAngleRad),
      snapshot: controller.getSnapshot(),
      running: false,
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
