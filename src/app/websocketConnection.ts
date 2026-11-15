import { TOOL_MESSAGE_PROTO_VER, ToolMessage } from "../types/message";
import useCrabeStore from "../store/useCrabeStore";
import { convertArrayToObject, parseWorld } from "../helpers/parser";

let alertedOnce = false;

export function startWebsocketConnection() {
  const setCrabeState = useCrabeStore((state) => state.setState)
  const socket = new WebSocket("ws://localhost:10400")
  socket.onmessage = (event) => {
    const toolMsg = JSON.parse(event.data) as ToolMessage

    // check custom protocol version matches
    if (!alertedOnce && toolMsg.version !== TOOL_MESSAGE_PROTO_VER) {
      alert(
        `Protocol version mismatch !\n
          Viewer uses version ${TOOL_MESSAGE_PROTO_VER}, CRAbE uses ${toolMsg.version}\n
          Subsequent code will most probably break, check new version at the CRAbE repository.`,
      )
      alertedOnce = true
    }

    setCrabeState({
      world: parseWorld(toolMsg.world),
      annotations: convertArrayToObject(toolMsg.data.annotations),
    })
  }
}