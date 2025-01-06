import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TOOL_MESSAGE_PROTO_VER, ToolMessage } from "../types/message"
import { convertArrayToObject, parseWorld } from "../helpers/parser"
import { CrabeState } from "../types/state"
export const crabeSlice = createSlice({
  name: "crabe",
  initialState: {} as CrabeState,
  reducers: {
    receiveData(state, action: PayloadAction<ToolMessage>) {
      console.log(action.payload)
      if (action.payload.version !== TOOL_MESSAGE_PROTO_VER) {
        alert(
          `Protocol version mismatch !\n
          Viewer uses version ${TOOL_MESSAGE_PROTO_VER}, CRAbE uses ${action.payload.version}\n
          Subsequent code will most probably break, check new version at the CRAbE repository.`,
        )
      }
      return {
        version: action.payload.version,
        world: parseWorld(action.payload.world),
        annotations: convertArrayToObject(action.payload.data.annotations),
      }
    },
  },
})

export const { receiveData } = crabeSlice.actions

export default crabeSlice.reducer
