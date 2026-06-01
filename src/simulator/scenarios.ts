import type {
  BoatConfig,
  BoatState,
  HarbourBounds,
  StaticObstacle,
  Wind,
} from '../physics/types'
import { vec2 } from '../physics/vector2'
import { FIN_KEEL_BOAT, LONG_KEEL_BOAT } from '../physics/boatPresets'

export type ScenarioId =
  | 'empty-basin'
  | 'berthing'
  | 'departure-crosswind'
  | 'narrow-berth'

/** Fixed mooring point on a quay/pier (world physics x/y). */
export type PierMooringCleat = {
  id: string
  position: { x: number; y: number }
}

export type Scenario = {
  id: ScenarioId
  name: string
  description: string
  objective: string
  boatConfig: BoatConfig
  initialState: BoatState
  wind: Wind
  obstacles: StaticObstacle[]
  bounds: HarbourBounds
  /** Quay cleats for mooring-line UX (optional per scenario). */
  pierCleats: PierMooringCleat[]
}

const DEFAULT_BOUNDS: HarbourBounds = {
  minX: -55,
  maxX: 55,
  minY: -55,
  maxY: 55,
}

function quay(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
): StaticObstacle {
  return {
    id,
    type: 'quay',
    position: vec2(x, y),
    width,
    height,
    rotation,
    restitution: 0.08,
  }
}

function pole(id: string, x: number, y: number, diameter = 0.6): StaticObstacle {
  return {
    id,
    type: 'pole',
    position: vec2(x, y),
    width: diameter,
    height: diameter,
    rotation: 0,
    restitution: 0.05,
  }
}

function parkedBoat(
  id: string,
  x: number,
  y: number,
  length: number,
  beam: number,
  rotation: number,
): StaticObstacle {
  return {
    id,
    type: 'boat',
    position: vec2(x, y),
    width: beam,
    height: length,
    rotation,
    restitution: 0.12,
  }
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'empty-basin',
    name: 'Empty basin',
    description: 'Open basin with no obstacles.',
    objective: 'Learn speed, inertia, and prop walk in astern gear.',
    boatConfig: FIN_KEEL_BOAT,
    initialState: {
      position: vec2(0, -30),
      heading: 0,
      velocity: vec2(),
      angularVelocity: 0,
      throttle: 0,
      rudderAngle: 0,
    },
    wind: { speed: 2, direction: Math.PI * 0.75 },
    obstacles: [],
    bounds: DEFAULT_BOUNDS,
    pierCleats: [],
  },
  {
    id: 'berthing',
    name: 'Berthing alongside',
    description: 'Come alongside the starboard quay with a light following wind.',
    objective: 'Use speed and rudder for a smooth alongside landing without bumps.',
    boatConfig: LONG_KEEL_BOAT,
    initialState: {
      position: vec2(-8, -35),
      heading: Math.PI * 0.08,
      velocity: vec2(0.3, 1.2),
      angularVelocity: 0,
      throttle: 0,
      rudderAngle: 0,
    },
    wind: { speed: 3.5, direction: Math.PI * 0.55 },
    obstacles: [
      quay('north-quay', 0, 42, 110, 3),
      quay('south-quay', 0, -42, 110, 3),
      quay('starboard-quay', 52, 0, 3, 82),
      quay('port-quay', -52, 0, 3, 82),
      quay('berth-quay', 18, 8, 60, 2.5),
    ],
    bounds: DEFAULT_BOUNDS,
    pierCleats: [],
  },
  {
    id: 'departure-crosswind',
    name: 'Departure in crosswind',
    description: 'Cast off from the quay in strong crosswind.',
    objective: 'Compensate for wind and prop walk when leaving the berth.',
    boatConfig: FIN_KEEL_BOAT,
    initialState: {
      // Alongside berth quay (runs E–W at y≈8): length parallel to quay, port side to wall
      position: vec2(18, 4.9),
      heading: Math.PI / 2,
      velocity: vec2(),
      angularVelocity: 0,
      throttle: 0,
      rudderAngle: 0,
    },
    wind: { speed: 7, direction: Math.PI * 0.5 },
    obstacles: [
      quay('north-quay', 0, 42, 110, 3),
      quay('south-quay', 0, -42, 110, 3),
      quay('starboard-quay', 52, 0, 3, 82),
      quay('port-quay', -52, 0, 3, 82),
      quay('berth-quay', 18, 8, 60, 2.5),
    ],
    bounds: DEFAULT_BOUNDS,
    // Along south edge of berth-quay (y≈6.85), facing the boat
    pierCleats: [
      { id: 'pier-1', position: vec2(-4, 6.85) },
      { id: 'pier-2', position: vec2(4, 6.85) },
      { id: 'pier-3', position: vec2(12, 6.85) },
      { id: 'pier-4', position: vec2(20, 6.85) },
      { id: 'pier-5', position: vec2(28, 6.85) },
      { id: 'pier-6', position: vec2(36, 6.85) },
      { id: 'pier-7', position: vec2(44, 6.85) },
    ],
  },
  {
    id: 'narrow-berth',
    name: 'Narrow berth',
    description: 'Manoeuvring between two boats in crosswind.',
    objective: 'Maintain control in a tight space without collision.',
    boatConfig: LONG_KEEL_BOAT,
    initialState: {
      position: vec2(0, -28),
      heading: 0,
      velocity: vec2(0, 0.8),
      angularVelocity: 0,
      throttle: 0.15,
      rudderAngle: 0,
    },
    wind: { speed: 5, direction: Math.PI * 0.45 },
    obstacles: [
      quay('north-quay', 0, 42, 110, 3),
      quay('south-quay', 0, -42, 110, 3),
      quay('starboard-quay', 52, 0, 3, 82),
      quay('port-quay', -52, 0, 3, 82),
      parkedBoat('boat-port', -6, 12, 10, 3.2, 0),
      parkedBoat('boat-starboard', 6, 12, 10, 3.2, 0),
      pole('pile-a', -10, 22),
      pole('pile-b', 10, 22),
    ],
    bounds: DEFAULT_BOUNDS,
    pierCleats: [],
  },
]

export function getScenario(id: ScenarioId): Scenario {
  const scenario = SCENARIOS.find((s) => s.id === id)
  if (!scenario) {
    throw new Error(`Unknown scenario: ${id}`)
  }
  return scenario
}
