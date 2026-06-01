import type { BoatConfig } from './types'
import { boatLocalToWorldForDisplay, getHullHalfBeamAtY } from './boatHullProfile'
import type { Vector2 } from './vector2'

/** Along-hull station for a deck cleat (boat-local: bow = +Y, port = −X). */
export type MooringCleatStation = 'bow' | 'mid' | 'stern'

export type MooringCleatSide = 'port' | 'starboard'

export type MooringCleatId =
  | 'port-bow'
  | 'port-mid'
  | 'port-stern'
  | 'starboard-bow'
  | 'starboard-mid'
  | 'starboard-stern'

export type MooringCleat = {
  id: MooringCleatId
  side: MooringCleatSide
  station: MooringCleatStation
  /** Position in boat-local physics space (bow +Y, port −X). */
  local: Vector2
}

/** Bow/stern along hull (fraction of half-length from amidships). */
const BOW_STERN_ALONG_HULL = 0.8
/** Bow cleats slightly further inboard — narrow deck on the sprite toward the stem. */
const BOW_CLEAT_INSET = 0.88
const MID_STERN_CLEAT_INSET = 0.94

export function getBoatMooringCleats(config: BoatConfig): MooringCleat[] {
  const halfLength = config.length * 0.5
  const along = halfLength * BOW_STERN_ALONG_HULL

  const stations: Array<{ station: MooringCleatStation; y: number }> = [
    { station: 'bow', y: along },
    { station: 'mid', y: 0 },
    { station: 'stern', y: -along },
  ]

  const cleats: MooringCleat[] = []

  for (const { station, y } of stations) {
    const halfBeamAtY = getHullHalfBeamAtY(config, y)
    const inset = station === 'bow' ? BOW_CLEAT_INSET : MID_STERN_CLEAT_INSET
    const outboard = halfBeamAtY * inset

    cleats.push({
      id: `port-${station}`,
      side: 'port',
      station,
      local: { x: -outboard, y },
    })
    cleats.push({
      id: `starboard-${station}`,
      side: 'starboard',
      station,
      local: { x: outboard, y },
    })
  }

  return cleats
}

/** World-space position for a cleat (aligned with the rendered boat). */
export function mooringCleatWorldPosition(
  cleat: MooringCleat,
  boatPosition: Vector2,
  heading: number,
): Vector2 {
  return boatLocalToWorldForDisplay(cleat.local, boatPosition, heading)
}
