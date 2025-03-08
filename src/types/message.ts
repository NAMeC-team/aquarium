import type { Command } from "./command"
import { AllyInfo, EnemyInfo, GameData, Robot, TeamColor } from "./world"
import { Ball, Geometry } from "./geometry"
import { Annotation } from "./annotation"

export type WorldMessage = {
  data: GameData
  geometry: Geometry
  alliesBot: [number, Robot<AllyInfo>][]
  enemiesBot: [number, Robot<EnemyInfo>][]
  ball: Ball | null
  teamColor: TeamColor
}

export const TOOL_MESSAGE_PROTO_VER: number = 2
export type ToolMessage = {
  version: number
  world: WorldMessage
  data: ToolDataMessage
}

export type ToolDataMessage = {
  annotations: [[string, Annotation]]
  commandData: Record<number, CommandData>
}

export type Vector3 = [number, number, number]

export type CommandData = {
  orderName: string
  cmdError: Vector3  // represents last output given
  target: Vector3
  cmdTimeMs: number
}

export enum ToolRequestType {
  Commands = "commands",
}

export type CommandRequest = {
  requestType: ToolRequestType.Commands
  payload: [number, Command][]
}

export type ToolRequest = CommandRequest
