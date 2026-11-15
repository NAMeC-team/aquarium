import { create } from "zustand/react";
import { CrabeState } from "../types/state";

type CrabeStateFunctions = {
  setState: (state: CrabeState) => void;
}

export type CrabeStore = CrabeState & CrabeStateFunctions;

// double parenthesis is intended
// see https://zustand.docs.pmnd.rs/learn/guides/advanced-typescript
const useCrabeStore = create<CrabeStore>()((set) => ({
 setState: (state: CrabeState) => set(state),
} as CrabeStore))

export default useCrabeStore;