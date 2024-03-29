import { Server, Socket } from "socket.io";
import { server } from "../server";
import { CHANNEL } from "../../../../constant/constant";
import { clientMapState, setEsp32Client } from "../esp32/temperature";
import { RoomTempState, Thermostat } from "../../../../types/main";
import { roomTempState, setRoomTempState } from "../room/temperature";
import { getLogs } from "../logs/logger";

export const io = new Server(server);

// on socket client connection
const onConnect = (socket: Socket) => {
  console.log("Socket client connected.");

  socket.emit(CHANNEL.THERMOSTAT_MAP, clientMapState);
  socket.on(CHANNEL.THERMOSTAT_MAP, (newState: Thermostat) =>
    setEsp32Client(newState)
  );

  socket.emit(CHANNEL.TARGET_TEMP, roomTempState);
  socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) =>
    setRoomTempState(newState)
  );

  socket.emit(CHANNEL.LOG_STREAM, getLogs(10000).reverse());

  socket.on("disconnect", () => console.log("Socket client disconnected."));
};

io.on("connection", onConnect);
