import { Ref, useEffect, useRef, useState } from "react"
import "./Scoreboard.css"
import { useSelector } from "react-redux"
import { RootState } from "../app/store"
import { World } from "../types/world";

export function Scoreboard() {
  const scoreboardRef: Ref<HTMLDivElement> = useRef(null)
  let world = useSelector((state: RootState) => state.crabe.world)

  let [nameTeamAlly, setNameTeamAlly] = useState("/!\\")
  let [nameTeamEnemy, setNameTeamEnemy] = useState("/!\\")
  let [scoreAlly, setScoreAlly] = useState(-1)
  let [scoreEnemy, setScoreEnemy] = useState(-1)
  let [minutes, setMinutes] = useState(-1)
  let [seconds, setSeconds] = useState(-1)

  useEffect(() => {
    if (!world) return

    setMinutes(Math.floor(world.data.stageInfo.time_left_secs / 60))
    setSeconds(world.data.stageInfo.time_left_secs % 60)

    if (world.data.ally.info !== null) {
      setNameTeamAlly(world.data.ally.info.name)
      setScoreAlly(world.data.ally.info.score)
    }

    if (world.data.enemy.info !== null) {
      setNameTeamEnemy(world.data.enemy.info.name)
      setScoreEnemy(world.data.enemy.info.score)
    }
  }, [world])

  function getAllyColorClass(world: World) {
    if (!world) return "yellow";
    else return world.data.ally.color.toString()
  }

  function getEnemyColorClass(world: World) {
    if (!world) return "blue";
    else return world.data.enemy.color.toString()
  }

  return (
    <div ref={scoreboardRef} className="mainScore">
      <div className="containerScore">
        <div className={"Team " + getAllyColorClass(world)}>
          <h3 className="nameTeam">{nameTeamAlly}</h3>
          <h3 className="scoreTeam">{scoreAlly}</h3>
        </div>
        <div className="time">
          <h3 id="time">
            {minutes} : {seconds}
          </h3>
        </div>
        <div className={"Team " + getEnemyColorClass(world)}>
          <h3 className="scoreTeam">{scoreEnemy}</h3>
          <h3 className="nameTeam">{nameTeamEnemy}</h3>
        </div>
      </div>
    </div>
  )
}
