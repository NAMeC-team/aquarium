import type {
  Circle,
  Geometry,
  Goal,
  Line,
  Ball,
  Penalty,
  Point,
  Rectangle,
  Arc,
} from "../types/geometry"
import type { AllyInfo, EnemyInfo, Robot } from "../types/world"
import { TeamColor } from "../types/world"
import type { Annotation } from "../types/annotation"
import { AnnotationKind } from "../types/annotation"
import { RootState, store } from "../app/store"


function drawGoal(context: CanvasRenderingContext2D, goal: Goal) {
  let factor = goal.line.start[0] > 0 ? -1 : 1
  context.strokeRect(
    goal.line.start[0],
    goal.line.start[1],
    factor * goal.depth,
    factor * goal.width,
  )
}

function drawPenalty(context: CanvasRenderingContext2D, penalty: Penalty) {
  let factor = penalty.frontLine.start[0] > 0 ? -1 : 1
  context.strokeRect(
    penalty.frontLine.start[0],
    penalty.frontLine.start[1],
    - factor * penalty.depth,
    factor * penalty.width,
  )
}

export function drawFieldHorizontal(
  context: CanvasRenderingContext2D,
  geometry: Geometry,
  color: TeamColor,
) {
  context.lineWidth = 0.02
  context.fillStyle = "#4a9c40"
  context.fillRect(
    -geometry.field.length / 2 - geometry.boundaryWidth,
    -geometry.field.width / 2 - geometry.boundaryWidth,
    geometry.field.length + 2 * geometry.boundaryWidth,
    geometry.field.width + 2 * geometry.boundaryWidth,
  )

  // Draw regular field
  context.strokeRect(
    -geometry.field.length / 2,
    -geometry.field.width / 2,
    geometry.field.length,
    geometry.field.width,
  )

  // Draw line vertical
  context.beginPath()
  context.moveTo(0, geometry.field.width / 2)
  context.lineTo(0, -geometry.field.width / 2)
  context.stroke()
  context.closePath()

  // Draw center
  context.beginPath()
  context.arc(
    geometry.center.center[0],
    geometry.center.center[1],
    geometry.center.radius,
    0,
    2 * Math.PI,
    true,
  )
  context.stroke()
  context.closePath()

  // Goal
  context.strokeStyle = color === TeamColor.Blue ? "#19439e" : "#dbd81d"
  drawGoal(context, geometry.allyGoal)
  context.strokeStyle = color === TeamColor.Blue ? "#dbd81d" : "#19439e"
  drawGoal(context, geometry.enemyGoal)

  // Penalty
  context.strokeStyle = "#fff"
  drawPenalty(context, geometry.allyPenalty)
  drawPenalty(context, geometry.enemyPenalty)
}

function drawRobotShape(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  orientation: number,
) {
  context.beginPath()
  context.arc(x, y, 0.085, orientation + 0.75, orientation + Math.PI * 2 - 0.75)
  context.fill()
  context.closePath()
}

function drawText(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  id: number,
) {
  context.save()
  context.translate(x, y)

  context.fillStyle = "white"
  context.font = "10px sans-serif"
  context.scale(0.01, -0.01)
  if (id >= 10) {
    context.fillText(id.toString(), -0.085 * 70, 40 * 0.085)
  } else {
    context.fillText(id.toString(), -0.085 * 30, 40 * 0.085)
  }
  context.restore()
}

export function drawBall(context: CanvasRenderingContext2D, ball: Ball) {
  context.beginPath()
  context.strokeStyle = "#ff0000"
  context.fillStyle = "#ff0000"
  context.arc(ball.position[0], ball.position[1], 0.02, 0, 2 * Math.PI)
  context.stroke()
  context.fill()
  context.closePath()
  drawVelocity(context, ball.position[0], ball.position[1], [ball.velocity[0], ball.velocity[1]])
}

function drawCircle(context: CanvasRenderingContext2D, circle: Circle) {
  context.beginPath()
  context.arc(circle.center[0], circle.center[1], circle.radius, 0, 2 * Math.PI)
  context.stroke()
  context.closePath()
}

export function drawLine(context: CanvasRenderingContext2D, line: Line) {
  context.beginPath()
  context.moveTo(line.start[0], line.start[1])
  context.lineTo(line.end[0], line.end[1])
  context.stroke()
  context.closePath()
}

export function drawPoint(context: CanvasRenderingContext2D, point: Point) {
  context.beginPath()
  context.arc(point[0], point[1], 0.02, 0, 2 * Math.PI)
  context.stroke()
  context.closePath()
}

export function drawRect(context: CanvasRenderingContext2D, rect: Rectangle) {
  context.beginPath()
  context.rect(rect.position[0], rect.position[1], rect.width, rect.height)
  context.stroke()
  context.closePath()
}

export function drawArc(context: CanvasRenderingContext2D, arc: Arc) {
  context.beginPath()
  console.log(arc.center[0], arc.center[1], arc.radius, arc.start, arc.end)
  context.arc(arc.center[0], arc.center[1], arc.radius, arc.start, arc.end)
  context.stroke()
  context.closePath()
}

export function drawAnnotation(
  context: CanvasRenderingContext2D,
  annotation: Annotation,
) {
  context.strokeStyle = "orange"
  switch (annotation.kind) {
    case AnnotationKind.Rectangle:
      drawRect(context, annotation.content)
      break
    case AnnotationKind.Line:
      drawLine(context, annotation.content)
      break
    case AnnotationKind.Point:
      drawPoint(context, annotation.content)
      break
    case AnnotationKind.Circle:
      drawCircle(context, annotation.content)
      break
    case AnnotationKind.Arc:
      drawArc(context, annotation.content)
      break
  }
}

function drawVelocity(context: CanvasRenderingContext2D, x: number, y: number, velocity: [number, number]) {
  context.beginPath()
  context.strokeStyle = "#ffaaaa"
  context.lineWidth = 0.01
  context.moveTo(x, y)
  context.lineTo(x + velocity[0], y + velocity[1])
  context.stroke()
  context.closePath()
  context.strokeStyle = "#fff"
}

export function drawBot(
  context: CanvasRenderingContext2D,
  allies: Record<number, Robot<AllyInfo>>,
  enemies: Record<number, Robot<EnemyInfo>>,
  color: TeamColor,
) {

  for (const enemy of Object.values(enemies)) {
    context.fillStyle = color === TeamColor.Blue ? "#afb830" : "#18749e"
    drawRobotShape(
      context,
      enemy.pose.position[0],
      enemy.pose.position[1],
      enemy.pose.orientation,
    )
    
    drawText(context, enemy.pose.position[0], enemy.pose.position[1], enemy.id)
    drawVelocity(context, enemy.pose.position[0], enemy.pose.position[1], enemy.velocity.linear)
  }

  for (const ally of Object.values(allies)) {
    context.fillStyle = color === TeamColor.Blue ? "#18749e" : "#afb830"
    drawRobotShape(
      context,
      ally.pose.position[0],
      ally.pose.position[1],
      ally.pose.orientation,
    )
    const state: RootState = store.getState();
    const clickedRobot = state.aquarium.clickedRobot;
    if (clickedRobot && clickedRobot.id === ally.id) {
      context.lineWidth = 0.03
      context.beginPath()
      context.strokeStyle = "white"
      context.arc(
        ally.pose.position[0],
        ally.pose.position[1],
        0.085,
        0,
        2 * Math.PI,
        true,
      )
      context.stroke()
      context.closePath()
    }
    drawText(context, ally.pose.position[0], ally.pose.position[1], ally.id)
    drawVelocity(context, ally.pose.position[0], ally.pose.position[1], ally.velocity.linear)
  }

  context.strokeStyle = "#fff"
}