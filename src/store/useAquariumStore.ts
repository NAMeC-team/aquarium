import { create } from "zustand"
import { AquariumState } from "../types/state";
import { AllyInfo, Robot } from "../types/world";

type AquariumStateFunctions = {
  setClickedRobot: (state: Robot<AllyInfo> | null) => void,
}

export type AquariumStore = AquariumState & AquariumStateFunctions;

const useAquariumStore = create<AquariumStore>()((set) => ({
  setClickedRobot: (robot) => set({ clickedRobot: robot }),
} as AquariumStore))

export default useAquariumStore;