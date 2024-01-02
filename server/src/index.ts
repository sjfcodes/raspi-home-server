import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";

import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../constant/constant";
import { HeaterGpioState, RoomTempState, Thermostat } from "../../types/main";
import { clientMapState, setEsp32Client } from "./esp32/temperature";
import {
  checkHeaterStatus,
  heaterGpio,
  heaterGpioState,
  setHeaterGpioOff,
  setHeaterGpioState,
} from "./gpio/heater";
import { getLogs } from "./logs/logger";
import { setPiTemp } from "./pi/temperature";
import { roomTempState, setRoomTempState } from "./room/temperature";
import { ipAddress } from "./utils/ipAddress";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const server = createServer(app);
const io = new Server(server);

const { PORT = 3000 } = process.env;
const LOOP_MS = 1000;

// on socket client connection
const onConnect = (socket: Socket) => {
  console.log("Socket client connected.");

  socket.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
  socket.on(CHANNEL.HEATER_GPIO_0, (newState: HeaterGpioState) =>
    setHeaterGpioState(newState, io)
  );

  socket.emit(CHANNEL.THERMOSTAT_MAP, clientMapState);
  socket.on(CHANNEL.THERMOSTAT_MAP, (newState: Thermostat) =>
    setEsp32Client(newState, io)
  );

  socket.emit(CHANNEL.TARGET_TEMP, roomTempState);
  socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) =>
    setRoomTempState(newState, io)
  );

  socket.emit(CHANNEL.LOG_STREAM, getLogs(100).reverse());

  socket.on("disconnect", () => console.log("Socket client disconnected."));
};

io.on("connection", onConnect);

app.post("/api/temperature", (req, res) => {
  if (req.body) setEsp32Client(req.body, io);
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

server.listen(PORT, () => {
  setInterval(() => checkHeaterStatus(io, roomTempState), LOOP_MS);
  setInterval(() => setPiTemp(io), LOOP_MS);
  console.log(`Running server at http://${ipAddress}:${PORT}.`);
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, () => {
    setHeaterGpioOff(io);
    heaterGpio.destroy();
    process.exit();
  })
);
