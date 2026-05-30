import type { BoatConfig } from './types'

export const LONG_KEEL_BOAT: BoatConfig = {
  length: 11,
  beam: 3.6,
  displacement: 9500,
  keelType: 'long-keel',
  rudderArea: 0.45,
  enginePower: 12000,
  propellerRotation: 'clockwise',
  windageArea: 18,
  turningInertia: 28000,
  dragForward: 180,
  dragSideways: 4200,
}

export const FIN_KEEL_BOAT: BoatConfig = {
  length: 10,
  beam: 3.4,
  displacement: 6500,
  keelType: 'fin-keel',
  rudderArea: 0.55,
  enginePower: 14000,
  propellerRotation: 'clockwise',
  windageArea: 16,
  turningInertia: 14000,
  dragForward: 150,
  dragSideways: 2400,
}
