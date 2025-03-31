import React, { useEffect, useState } from "react"
import RobotDataCard from "./SidebarChildren/RobotDataCard"
import "./Sidebar.css"
import { useSelector } from "react-redux"
import { RootState } from "../app/store"
import { AllyInfo, Robot } from "../types/world"
import VelocityErrorStats from "./SidebarChildren/VelocityErrorStats";

enum EdisplayMode {
  Robot,
  Stats,
  CRAbE,
}

export function Sidebar() {
  let world = useSelector((state: RootState) => state.crabe.world)
  const [displayMode, setDisplayMode] = useState(EdisplayMode.Robot)
  const [allyInfos, setAllyInfos] = useState(
    {} as Record<number, Robot<AllyInfo>>,
  )

  let cmdTargets = useSelector((state: RootState) => state.crabe.commandTargets)

  function displayContent() {
    switch (displayMode) {
      case EdisplayMode.Robot:
        return (
          <div>
            {Object.values(allyInfos).map((allyInfo) => (
              <RobotDataCard
                key={allyInfo.id}
                teamColor={world.teamColor}
                id={allyInfo.id}
                positionX={allyInfo.pose.position[0]}
                positionY={allyInfo.pose.position[1]}
                angVelo={allyInfo.velocity.angular}
                hasBall={allyInfo.hasBall}
                linVeloX={allyInfo.velocity.linear[0]}
                linVeloY={allyInfo.velocity.linear[1]}
                orientation={allyInfo.pose.orientation}
              />
            ))}
          </div>
        )
      case EdisplayMode.Stats:
        return Object.entries(cmdTargets).map(([s_id, _]) => {
          return <VelocityErrorStats robotId={parseInt(s_id)} />
        })
      case EdisplayMode.CRAbE:
        return <div>CRAbE</div>
      default:
        return null
    }
  }
  useEffect(() => {
    if (world == null) return
    setAllyInfos(world.alliesBot)
  }, [world])

  return (
    <div>
      <button onClick={() => setDisplayMode(EdisplayMode.Robot)}>Robots</button>
      <button onClick={() => setDisplayMode(EdisplayMode.Stats)}>Stats</button>
      <button onClick={() => setDisplayMode(EdisplayMode.CRAbE)}>CRAbE</button>
      {displayContent()}
    </div>
  )
}
