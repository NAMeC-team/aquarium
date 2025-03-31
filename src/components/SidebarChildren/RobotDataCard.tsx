import React from "react"
import "./RobotData.css"
import { TeamColor } from "../../types/world"

interface RobotDataProps {
  id: number
  teamColor: TeamColor
  positionX: number
  positionY: number
  angVelo: number
  linVeloX: number
  linVeloY: number
  orientation: number
  hasBall: boolean
}

function color_pattern(top_left: string, top_right: string, bottom_left: string, bottom_right: string) {
  return {
    "top_left": top_left,
    "top_right": top_right,
    "bottom_left": bottom_left,
    "bottom_right": bottom_right
  }
}

const PINK = "#FF00FF"
const GREEN = "#00FF00"
const GRAY = "#808080"
const VISION_PATTERN_COLOR = [
  color_pattern(PINK, PINK, GREEN, PINK),
  color_pattern(GREEN, PINK, GREEN, PINK),
  color_pattern(GREEN, GREEN, GREEN, PINK),
  color_pattern(PINK, GREEN, GREEN, PINK),
  color_pattern(PINK, PINK, PINK, GREEN),
  color_pattern(GREEN, PINK, PINK, GREEN),
  color_pattern(GREEN, GREEN, PINK, GREEN),
  color_pattern(PINK, GREEN, PINK, GREEN),
  color_pattern(GREEN, GREEN, GREEN, GREEN),
  color_pattern(PINK, PINK, PINK, PINK),
  color_pattern(PINK, PINK, GREEN, GREEN),
  color_pattern(GREEN, GREEN, PINK, PINK),
  color_pattern(GREEN, PINK, GREEN, GREEN),
  color_pattern(GREEN, PINK, PINK, PINK),
  color_pattern(PINK, GREEN, GREEN, GREEN),
  color_pattern(PINK, GREEN, PINK, PINK),
  color_pattern(GRAY, GRAY, GRAY, GRAY),
]

/// grabbed from https://robocup-ssl.github.io/ssl-rules/sslrules.html#_vision_pattern
const BOT_RADIUS = 85;
const CENTER_RADIUS = 25;
const SMALL_RADIUS = 20;
const OFFSET_Y_TOP = 35;
const OFFSET_X_TOP = 54.772;
const OFFSET_Y_BOTTOM = 54.772;
const OFFSET_X_BOTTOM = 35;
const CENTER_TO_FRONT = 55;

function grabSVG(props: RobotDataProps) {
  const display_radius = 45;
  const scale = display_radius / BOT_RADIUS;
  const px = display_radius;
  const py = display_radius;

  const deg_rotation = (-props.orientation + Math.PI / 2) * 180 / Math.PI;
  const rotation_transformation = `rotate(${deg_rotation} 0 0)`;
  const viewBox = `0 0 ${display_radius * 2} ${display_radius * 2}`;
  const vision_pattern = VISION_PATTERN_COLOR[props.id % VISION_PATTERN_COLOR.length];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width={display_radius*2} height={display_radius*2} transform={rotation_transformation}>
      <linearGradient id="botshape" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stop-opacity="1" stop-color="black"/>
          <stop offset="83%" stop-opacity="1" stop-color="black"/>
          <stop offset="83%" stop-opacity="0" stop-color="black"/>
          <stop offset="100%" stop-opacity="0" stop-color="black"/>
      </linearGradient>
      <circle cx={px} cy={py} r={BOT_RADIUS * scale} fill="url(#botshape)"/>
      <circle cx={px} cy={py} r={CENTER_RADIUS * scale} fill={props.teamColor == TeamColor.Blue ? "blue" : "yellow"}/>
      <circle cx={px - OFFSET_X_BOTTOM*scale} cy={py + OFFSET_Y_BOTTOM*scale} r={SMALL_RADIUS * scale} fill={vision_pattern.bottom_left}/>
      <circle cx={px + OFFSET_X_BOTTOM*scale} cy={py + OFFSET_Y_BOTTOM*scale} r={SMALL_RADIUS * scale} fill={vision_pattern.bottom_right}/>
      <circle cx={px - OFFSET_X_TOP*scale} cy={py - OFFSET_Y_TOP*scale} r={SMALL_RADIUS * scale} fill={vision_pattern.top_left}/>
      <circle cx={px + OFFSET_X_TOP*scale} cy={py - OFFSET_Y_TOP*scale} r={SMALL_RADIUS * scale} fill={vision_pattern.top_right}/>
      <rect x={px - 15} y={py - 3 - CENTER_TO_FRONT*scale} width={30} height={6} fill={ props.hasBall ? "red" : "gray"}/>
      <text x={px} y={py+2} text-anchor="middle" dominant-baseline="middle" fill="black" font-size="20" transform={`rotate(${-deg_rotation}, ${px}, ${py})`}>{props.id}</text>
    </svg>)
}

const RobotDataCard: React.FC<RobotDataProps> = (props) => {
  return (
    <div className="mainRobot">
      {grabSVG(props)}
      {/* <img id="imgRobot" src={imgBase} alt="robot" /> */}
      <div className="infos">
        <p className="info position">
          Position : {props.positionX.toFixed(2)} ,{props.positionY.toFixed(2)}
        </p>
        <p className="info linVelo">
          linear velocity : {props.linVeloX.toFixed(2)} ,
          {props.linVeloY.toFixed(2)}
        </p>
        <p className="info linVelo">
          angular velocity : {props.angVelo.toFixed(2)}
        </p>
        <p className="info orientation">
          Orientation : {props.orientation.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default RobotDataCard
