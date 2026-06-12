import { PhysicsEngine } from '../physics/physicsEngine'
import type { BoatConfig, PhysicsInput, PhysicsSnapshot, Wind } from '../physics/types'
import { getScenario, type ScenarioId } from './scenarios'

export class SimulatorController {
  private engine: PhysicsEngine
  private running = false
  private accumulator = 0
  private readonly fixedDt = 1 / 60

  constructor(scenarioId: ScenarioId) {
    const scenario = getScenario(scenarioId)
    this.engine = new PhysicsEngine(
      scenario.boatConfig,
      scenario.initialState,
      scenario.wind,
      scenario.obstacles,
      scenario.bounds,
    )
  }

  loadScenario(scenarioId: ScenarioId): void {
    const scenario = getScenario(scenarioId)
    this.engine.setConfig(scenario.boatConfig)
    this.engine.setObstacles(scenario.obstacles)
    this.engine.setBounds(scenario.bounds)
    this.engine.setWind(scenario.wind)
    this.engine.reset(scenario.initialState, scenario.wind)
    this.accumulator = 0
  }

  start(): void {
    this.running = true
  }

  stop(): void {
    this.running = false
  }

  resetScenario(scenarioId: ScenarioId): void {
    this.loadScenario(scenarioId)
  }

  setInput(input: PhysicsInput): PhysicsSnapshot {
    return this.engine.step(input, this.fixedDt)
  }

  tick(frameDt: number, input: PhysicsInput): PhysicsSnapshot {
    if (!this.running) {
      return this.engine.getSnapshot()
    }

    this.accumulator += frameDt
    let snapshot = this.engine.getSnapshot()

    while (this.accumulator >= this.fixedDt) {
      snapshot = this.engine.step(input, this.fixedDt)
      this.accumulator -= this.fixedDt
    }

    return snapshot
  }

  getSnapshot(): PhysicsSnapshot {
    return this.engine.getSnapshot()
  }

  setBoatConfig(config: BoatConfig): void {
    this.engine.setConfig(config)
  }

  setWind(wind: Wind): void {
    this.engine.setWind(wind)
  }

  setMaxRudderAngle(maxAngleRad: number): void {
    this.engine.setMaxRudderAngle(maxAngleRad)
  }
}
