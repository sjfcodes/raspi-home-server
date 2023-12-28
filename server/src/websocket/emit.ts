import { Server, Socket } from "socket.io";

export const emitStateUpdate = (
  channel: string,
  state: any,
  io?: Server,
  socket?: Socket,
  includeHost = false
) => {
  if (!io && !socket) {
    throw new Error('"io" or "socket" must be defined');
  }

  if (socket) {
    if (includeHost) {
      socket.emit(channel, state);
    } else {
      socket.broadcast.emit(channel, state);
    }
  } else if (io) {
    io.emit(channel, state);
  }

  console.log("EMIT: ", channel, JSON.stringify(state));
};
