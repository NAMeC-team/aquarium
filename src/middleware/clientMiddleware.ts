import { createAction, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { ToolMessage } from "../types/message"
import { receiveData } from "../slices/crabeSlice"
import { Command } from "../types/command"

// restart WS connection if not opened or closed during this time period
const REFRESH_CONNECTION_RATE = 2 * 1000

export const sendCommand = createAction<Command>("client/sendCommand")

function setupWebsocket(url: string, store: MiddlewareAPI<any>): WebSocket {
  function configWebSocket(socket: WebSocket) {
    socket.onmessage = (event) => {
      // parse the received data into a ToolMessage, and dispatch
      // it to the global Redux store
      const toolMsg = JSON.parse(event.data) as ToolMessage
      store.dispatch(receiveData(toolMsg))
    }
    // restart connection if it dies
    socket.onclose = (ev) => {
      setTimeout(() => {
        socket = new WebSocket(url)
        configWebSocket(socket)
      }, REFRESH_CONNECTION_RATE)
    }
  }

  let s = new WebSocket(url)
  configWebSocket(s)
  return s
}

export const clientMiddleware: Middleware = (store) => {
  let socket = setupWebsocket("ws://localhost:10400", store)
  return (next) => (action) => {
    if (sendCommand.match(action)) {
      socket.send(JSON.stringify(action.payload))
    }

    next(action)
  }
}
