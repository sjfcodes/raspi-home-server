import { Socket } from "socket.io";
import { io } from "./socketIo";

export const emitStateUpdate = (
  channel: string,
  state: any,
  socket?: Socket,
  includeHost = false
) => {
  if (socket) {
    if (includeHost) {
      socket.emit(channel, state);
    } else {
      socket.broadcast.emit(channel, state);
    }
  } else {
    io.emit(channel, state);
  }

  // console.log("EMIT: ", channel, JSON.stringify(state));
};
