import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";

import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../constant/constant";
import { HeaterGpioState, RoomTempState, Thermostat } from "../../types/main";
import { clientMapState, setEsp32Client } from "./esp32/temperature";
import {
  heaterGpio,
  heaterGpioState,
  setHeaterGpioOff,
  setHeaterGpioOn,
  setHeaterGpioState,
} from "./gpio/heater";
import { getLogs, writeLog } from "./logs/logger";
import { setPiTemp } from "./pi/temperature";
import { roomTempState, setRoomTempState } from "./room/temperature";
import { ipAddress } from "./utils/ipAddress";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const server = createServer(app);
const io = new Server(server);

const { PORT = 3000 } = process.env;
const LOOP_MS = 10000;
let primaryThermostat = "9efc8ad4"; // THERMOSTAT.LIVING_ROOM_0

// check heater status changes every x seconds
setInterval(() => {
  const curTemp =
    clientMapState?.[primaryThermostat]?.tempF +
    clientMapState?.[primaryThermostat]?.calibrate;
  writeLog(`current temp is ${curTemp}`, io);

  // if current temp is below min
  const shouldTurnOn = curTemp <= roomTempState.min;
  const shouldTurnOff = curTemp > roomTempState.max;

  if (shouldTurnOn) {
    setHeaterGpioOn(io);
  } else if (shouldTurnOff) {
    setHeaterGpioOff(io);
  }
}, LOOP_MS);

// user disconnect
const onDisconnect = () => {
  console.log("socket.on.disconnect");
};

// user connect
const onConnect = (socket: Socket) => {
  console.log("io.on.connection");

  socket.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
  socket.on(CHANNEL.HEATER_GPIO_0, (newState: HeaterGpioState) =>
    setHeaterGpioState(newState, undefined, socket)
  );

  socket.emit(CHANNEL.THERMOSTAT_MAP, clientMapState);
  socket.on(CHANNEL.THERMOSTAT_MAP, (newState: Thermostat) =>
    setEsp32Client(newState, undefined, socket)
  );

  socket.emit(CHANNEL.TARGET_TEMP, roomTempState);
  socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) =>
    setRoomTempState(newState, undefined, socket)
  );

  socket.emit(CHANNEL.LOG_STREAM, getLogs(100).reverse());

  socket.on("disconnect", onDisconnect);
};

io.on("connection", onConnect);

app.post("/api/temperature", (req, res) => {
  console.log("POST: ", req.body);
  if (req.body) setEsp32Client(req.body, io);
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

server.listen(PORT, () => {
  // setHeaterGpioOff(io);
  setInterval(() => setPiTemp(io), LOOP_MS);
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, () => {
    setHeaterGpioOff(io);
    heaterGpio.destroy();
    process.exit();
  })
);
