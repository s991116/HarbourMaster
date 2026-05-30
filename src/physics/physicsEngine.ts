import type {
  BoatConfig,
  BoatState,
  HarbourBounds,
  PhysicsInput,
  PhysicsSnapshot,
  StaticObstacle,
  Wind,
} from './types'
import {
  getSpeedOverGround,
  getSpeedThroughWater,
  resolveCollisions,
} from './collisionModel'
import { computePropellerForces } from './propellerModel'
import { clampRudderAngle, computeRudderForces } from './rudderModel'
import { add, clamp, dot, fromAngle, scale, vec2 } from './vector2'
import { computeWaterDrag, computeAngularDamping } from './waterResistanceModel'
import { computeWindForces } from './windModel'

export class PhysicsEngine {
  private config: BoatConfig
  private state: BoatState
  private wind: Wind
  private obstacles: StaticObstacle[]
  private bounds: HarbourBounds
  private reverseTime = 0
  private lastReverse = false

  constructor(
    config: BoatConfig,
    initialState: BoatState,
    wind: Wind,
    obstacles: StaticObstacle[],
    bounds: HarbourBounds,
  ) {
    this.config = config
    this.state = { ...initialState, position: { ...initialState.position } }
    this.wind = wind
    this.obstacles = obstacles
    this.bounds = bounds
  }

  setConfig(config: BoatConfig): void {
    this.config = config
  }

  setWind(wind: Wind): void {
    this.wind = wind
  }

  setObstacles(obstacles: StaticObstacle[]): void {
    this.obstacles = obstacles
  }

  setBounds(bounds: HarbourBounds): void {
    this.bounds = bounds
  }

  reset(state: BoatState, wind: Wind): void {
    this.state = {
      ...state,
      position: { ...state.position },
      velocity: { ...state.velocity },
    }
    this.wind = wind
    this.reverseTime = 0
    this.lastReverse = false
  }

  getState(): BoatState {
    return {
      ...this.state,
      position: { ...this.state.position },
      velocity: { ...this.state.velocity },
    }
  }

  getSnapshot(): PhysicsSnapshot {
    const prop = computePropellerForces(this.config, this.state, this.reverseTime)
    return {
      boat: this.getState(),
      wind: this.wind,
      speedThroughWater: getSpeedThroughWater(this.state),
      speedOverGround: getSpeedOverGround(this.state),
      isInReverse: prop.isReverse,
      propWalkActive: prop.propWalkActive,
    }
  }

  step(input: PhysicsInput, dt: number): PhysicsSnapshot {
    this.state.throttle = clamp(input.throttle, -1, 1)
    this.state.rudderAngle = clampRudderAngle(input.rudderAngle)

    const isReverse = this.state.throttle < -0.02
    if (isReverse && !this.lastReverse) {
      this.reverseTime = 0
    } else if (isReverse) {
      this.reverseTime += dt
    } else {
      this.reverseTime = 0
    }
    this.lastReverse = isReverse

    const prop = computePropellerForces(this.config, this.state, this.reverseTime)
    const rudder = computeRudderForces(this.config, this.state)
    const wind = computeWindForces(this.config, this.state, this.wind)
    const drag = computeWaterDrag(this.config, this.state)

    const totalForce = add(
      add(add(vec2(prop.force.x, prop.force.y), vec2(rudder.force.x, rudder.force.y)), vec2(wind.force.x, wind.force.y)),
      vec2(drag.x, drag.y),
    )

    const totalTorque =
      prop.torque +
      rudder.torque +
      wind.torque +
      computeAngularDamping(this.config, this.state.angularVelocity)

    const mass = this.config.displacement
    const acceleration = scale(totalForce, 1 / mass)
    this.state.velocity = add(this.state.velocity, scale(acceleration, dt))

    const angularAcceleration = totalTorque / this.config.turningInertia
    this.state.angularVelocity += angularAcceleration * dt

    this.state.position = add(
      this.state.position,
      scale(this.state.velocity, dt),
    )
    this.state.heading += this.state.angularVelocity * dt

    const collision = resolveCollisions(
      this.config,
      this.state,
      this.obstacles,
      this.bounds,
    )

    this.state.position = collision.position
    this.state.velocity = collision.velocity
    this.state.angularVelocity = collision.angularVelocity

    return this.getSnapshot()
  }
}

export function createInitialBoatState(
  position = vec2(0, -20),
  heading = 0,
): BoatState {
  return {
    position,
    heading,
    velocity: vec2(),
    angularVelocity: 0,
    throttle: 0,
    rudderAngle: 0,
  }
}

export { getSpeedOverGround, getSpeedThroughWater, fromAngle, dot }
