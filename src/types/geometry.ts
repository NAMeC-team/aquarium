export type Rectangle = {
  width: number
  height: number
  position: [number, number]
}

export type Point = [number, number]

export type Line = {
  start: [number, number]
  end: [number, number]
}

export type Ball = {
  position: [number, number, number]
  velocity: [number, number, number]
}

export type Circle = {
  center: [number, number]
  radius: number
}

export type Arc = {
  center: [number, number]
  radius: number
  start: number
  end: number
}

export type Goal = {
  depth: number
  width: number
  line: Line
}

export type Penalty = {
  depth: number
  width: number
  frontLine: Line
}

export type Field = {
  width: number
  length: number
}

export type Geometry = {
  boundaryWidth: number
  field: Field
  center: Circle
  allyGoal: Goal
  enemyGoal: Goal
  allyPenalty: Penalty
  enemyPenalty: Penalty
  robotRadius: number
  ballRadius: number
}