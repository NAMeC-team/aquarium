import { createAction, Middleware } from "@reduxjs/toolkit"
import { ToolMessage } from "../types/message"
import { receiveData } from "../slices/crabeSlice"
import { Command } from "../types/command"

export const sendCommand = createAction<Command>("client/sendCommand")

export const clientMiddleware: Middleware = (store) => {
  const socket = new WebSocket("ws://localhost:10400")
  socket.onmessage = (event) => {
    const toolMsg = JSON.parse(event.data) as ToolMessage
    store.dispatch(receiveData(toolMsg))
  }
  return (next) => (action) => {
    if (sendCommand.match(action)) {
      socket.send(JSON.stringify(action.payload))
    }

    next(action)
  }
}
