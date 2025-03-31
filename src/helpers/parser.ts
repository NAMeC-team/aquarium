import { ToolDataMessage, WorldMessage } from "../types/message"
import { World } from "../types/world"
import { Annotation } from "../types/annotation"

export const convertArrayToObject = <T>(array: [number | string, T][]) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[0]]: item[1],
    }
  }, initialValue)
}

export function parseWorld(msg: WorldMessage): World {
  return {
    ...msg,
    alliesBot: convertArrayToObject(msg.alliesBot),
    enemiesBot: convertArrayToObject(msg.enemiesBot),
  }
}
