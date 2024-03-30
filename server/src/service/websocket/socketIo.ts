import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../../../constant/constant";
import { clientMapState, setEsp32Client } from "../esp32/temperature";
import { getLogs } from "../logs/logger";
import { roomTempState, setRoomTempState } from "../room/temperature";
import { server } from "../server";

export const io = new Server(server);

// on socket client connection
const onConnect = (socket: Socket) => {
  console.log(`[${socket.id}]:`, "socket.io client connected");

  socket.emit(CHANNEL.THERMOSTAT_MAP, clientMapState);
  socket.on(CHANNEL.THERMOSTAT_MAP, setEsp32Client);

  socket.emit(CHANNEL.TARGET_TEMP, roomTempState);
  socket.on(CHANNEL.TARGET_TEMP, setRoomTempState);

  socket.emit(CHANNEL.LOG_STREAM, getLogs(10000).reverse());

  socket.on("disconnect", () => console.log("Socket client disconnected."));
};

io.on("connection", onConnect);
