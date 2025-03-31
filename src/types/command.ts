export type Command = {
  forwardVelocity: number
  leftVelocity: number
  angularVelocity: number
  charge: boolean
  kick: Kick | null
  dribbler: number
}

export function defaultCommand(): Command {
  return {
    forwardVelocity: 0,
    leftVelocity: 0,
    angularVelocity: 0,
    charge: false,
    kick: null,
    dribbler: 0,
  }
}

export enum KickType {
  StraightKick = "straightKick",
  ChipKick = "chipKick",
}

export type Kick = {
  kickType: KickType
  power: number
}
