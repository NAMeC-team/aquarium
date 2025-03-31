import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/store"
import "./GameStateBanner.css"

type StateInfo = {
  mainState: string
  subState: string
}

export function GameStateBanner() {
  const [stateInfo, setStateInfo] = useState<StateInfo>({
    mainState: "error",
    subState: "no state",
  })

  const world = useSelector((state: RootState) => state.crabe.world)

  function toUppercaseWithSpaces(wholeWord: string): string {
    return wholeWord?.match(/([A-Z]|[a-z])[a-z]+/g)
      ?.map((word: string, idx: number): string => {
        if (idx === 0) return word[0].toUpperCase() + word.slice(1, word.length)
        else return word
      })
      ?.reduce((word, acc) => word + " " + acc)
      || ""
  }

  function flattenState(rawSubState: string | Object): string {
    if (rawSubState instanceof Object) {
      return Object.keys(rawSubState).toString() + " " + Object.values(rawSubState).toString()
    } else return rawSubState
  }

  useEffect(() => {
    if (world == null) return
    else {
      const state = world.data.refOrders.state
      const rawMainState = Object.keys(state)[0]
      const rawSubState = Object.values(state)[0]
      const filteredState = flattenState(rawSubState)

      setStateInfo({
        mainState: toUppercaseWithSpaces(rawMainState),
        subState: toUppercaseWithSpaces(filteredState),
      } as StateInfo)
    }
  }, [world])

  return (
    <div className="gameStateBanner">
      <h2>
        {stateInfo.mainState} : {stateInfo.subState}
      </h2>
    </div>
  )
}
