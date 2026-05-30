import type { Vector2 } from './vector2'

export type KeelType = 'long-keel' | 'fin-keel'
export type PropellerRotation = 'clockwise' | 'counter-clockwise'

export type BoatConfig = {
  length: number
  beam: number
  displacement: number
  keelType: KeelType
  rudderArea: number
  enginePower: number
  propellerRotation: PropellerRotation
  windageArea: number
  turningInertia: number
  dragForward: number
  dragSideways: number
}

export type BoatState = {
  position: Vector2
  heading: number
  velocity: Vector2
  angularVelocity: number
  throttle: number
  rudderAngle: number
}

export type Wind = {
  speed: number
  direction: number
}

export type StaticObstacle = {
  id: string
  type: 'quay' | 'pole' | 'boat'
  position: Vector2
  width: number
  height: number
  rotation: number
  restitution: number
}

export type HarbourBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type PhysicsInput = {
  throttle: number
  rudderAngle: number
}

export type PhysicsSnapshot = {
  boat: BoatState
  wind: Wind
  speedThroughWater: number
  speedOverGround: number
  isInReverse: boolean
  propWalkActive: boolean
}
