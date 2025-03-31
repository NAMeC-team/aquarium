import { Ref, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState, store } from "../app/store"
import { drawAnnotation, drawBall, drawBot, drawFieldHorizontal } from "../field/field"
import { Field } from "../types/geometry"
import { setClickedBot } from "../slices/aquariumSlice"

export function FieldView() {
  const world = useSelector((state: RootState) => state.crabe.world)
  const annotation = useSelector((state: RootState) => state.crabe.annotations)

  const canvasRef: Ref<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)

  function clickHandler(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) {
    const field = world.geometry.field
    const rect_canvas = canvas.getBoundingClientRect()
    const x_clicked = (event.clientX - (rect_canvas.left)) - canvas.offsetWidth / 2
    const y_clicked = (event.clientY - (rect_canvas.top)) - canvas.offsetHeight / 2
    const scale_factor = (canvas.width / field.length + canvas.height / field.width) / 2.1
    const field_clicked_x = x_clicked / scale_factor
    const field_clicked_y = -y_clicked / scale_factor

    // check for each ally if the click is on it
    for (const bot of Object.values(world.alliesBot)) {
      if (Math.abs(bot.pose.position[0] - field_clicked_x) < world.geometry.robotRadius 
          && Math.abs(bot.pose.position[1] - field_clicked_y) < world.geometry.robotRadius) {
        store.dispatch(setClickedBot(bot))
        return
      }
    }
    store.dispatch(setClickedBot(null))
  } 

  function initCanvas(context: CanvasRenderingContext2D, field: Field, horizontal : boolean) {

    if (horizontal)
    {
      const ratio = field.width / field.length
      let parent = context.canvas.parentElement
      context.canvas.width = parent != null ? parent.clientWidth : context.canvas.offsetWidth
      context.canvas.height = context.canvas.width * ratio
      if (parent != null && context.canvas.height > parent.clientHeight) {
        context.canvas.height = parent.clientHeight
        context.canvas.width = context.canvas.height / ratio
      }
      clearCanvas(context)

      let x = context.canvas.width / field.length
      let y = context.canvas.height / field.width
      let scale_factor = (x + y) / 2.1
      context.translate(context.canvas.width / 2, context.canvas.height / 2)
      context.scale(scale_factor, -scale_factor)
    }
  }

  function clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  }

  useEffect(() => {
    if (world == null) return
    const canvas = canvasRef.current
    if (canvas == null) return
    const context = canvas.getContext("2d")
    if (context == null) return
    initCanvas(context, world.geometry.field, true)
    context.strokeStyle = "#fff"
    context.lineWidth = 0.03
    drawFieldHorizontal(context, world.geometry, world.teamColor)
    drawBot(context, world.alliesBot, world.enemiesBot, world.teamColor)
    if (world.ball !== null) drawBall(context, world.ball)
  }, [world])

  useEffect(() => {
    if (annotation == null) return
    const canvas = canvasRef.current
    if (canvas == null) return
    const context = canvas.getContext("2d")
    if (context == null) return
    context.strokeStyle = "#fff"
    context.lineWidth = 0.03
    for (const key in annotation) {
      drawAnnotation(context, annotation[key])
    }
  }, [annotation])
  return <canvas ref={canvasRef} 
                onClick={(event) => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    clickHandler(canvas, event);
                  }
                }}></canvas>
}
