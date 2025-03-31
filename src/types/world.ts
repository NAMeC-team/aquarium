import type { Ball, Geometry } from "./geometry"

export type AllyInfo = {}

export type EnemyInfo = {}

export type Location = [number, number]

// uses template string pattern index signature
// available from typescript >= 4.4
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#symbol-template-signatures
export type GameState = {
  [key: string]: Object | string
}

export type Pose = {
  position: Location
  orientation: number
}

export type RobotVelocity = {
  linear: [number, number]
  angular: number
}

export type Robot<T> = {
  id: number
  pose: Pose
  hasBall: boolean
  velocity: RobotVelocity
  robotInfo: T
}

export enum TeamColor {
  Blue = "blue",
  Yellow = "yellow",
}

export type TeamInfo = {
  ball_placement_failures: number
  ball_placement_failures_reached: boolean
  bot_substitution_allowed: boolean
  bot_substitution_intent: boolean
  can_place_ball: boolean
  foul_counter: number
  goalkeeper: number
  max_allowed_bots: number
  name: string
  red_cards: number
  score: number
  timeout_time: number
  timeouts: number
  yellow_card_times: number[] // sorted from smallest to biggest
  yellow_cards: number
}

export type Team = {
  color: TeamColor
  info: TeamInfo
}

export type StageInfo = {
  stage: string
  time_left_secs: number
}

export type GameData = {
  ally: Team
  enemy: Team
  positiveHalf: string
  refOrders: RefereeOrders
  stageInfo: StageInfo
}

export type RefereeOrders = {
  designatedPosition: Location | null
  event: string | null
  minDistFromBall: number | null
  speedLimit: number
  state: GameState
}

export type World = {
  data: GameData
  geometry: Geometry
  alliesBot: Record<number, Robot<AllyInfo>>
  enemiesBot: Record<number, Robot<EnemyInfo>>
  ball: Ball | null
  teamColor: TeamColor
}
