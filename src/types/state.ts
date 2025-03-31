import { AllyInfo, Robot, World } from "./world"
import { Annotation } from "./annotation"
import { Vector3 } from "./message";

/**
 * Represents a global state store for data received from CRAbE
 */
export interface CrabeState {
  world: World,
  annotations: Record<string, Annotation>
  commandTargets: Record<number, Vector3>
}

export type AquariumState = {
  clickedRobot: Robot<AllyInfo> | null
}
