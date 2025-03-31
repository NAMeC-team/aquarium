import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AquariumState } from "../types/state"
import { AllyInfo, Robot } from "../types/world"

const initialState: AquariumState = {
  clickedRobot: null,
};

export const aquariumSlice = createSlice({
  name: "aquarium",
  initialState: {} as AquariumState,
  reducers: {
    setClickedBot(state, action: PayloadAction<Robot<AllyInfo> | null>) {
      return {
        clickedRobot: action.payload,
      }
    },
  },
})

export const { setClickedBot } = aquariumSlice.actions

export default aquariumSlice.reducer
