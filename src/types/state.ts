import { AllyInfo, Robot, World } from "./world"
import { Annotation } from "./annotation"
import { CommandData } from "./message";

/**
 * Represents a global state store for data received from CRAbE
 */
export interface CrabeState {
  world: World,
  annotations: Record<string, Annotation>
  commandData: Record<number, CommandData>
}

export type AquariumState = {
  clickedRobot: Robot<AllyInfo> | null
}
