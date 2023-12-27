import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";

import { Server, Socket } from "socket.io";
import { CHANNEL } from "../../constant/constant";
import { Esp32Client, HeaterGpioState } from "../../types/main";
import { setEsp32Client } from "./esp32/temperature";
import {
  heaterGpio,
  heaterGpioState,
  setHeaterGpioOff,
  setHeaterGpioOn,
  setHeaterGpioState
} from "./gpio/heater";
import { emitPiTemp } from "./pi/temperature";
import { ipAddress } from "./utils/ipAddress";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const server = createServer(app);
const io = new Server(server);

const { PORT = 3000 } = process.env;

const shouldTurnOn = true;

/**
 * loop
 * if manual override until date, apply ovverride until date
 * else if room temp less then target temp, turn heater on
 * else if room temp greater then target temp, turn heater off
 */
setInterval(() => {
  if (heaterGpioState.isOn) {
    // if heater on
    //     if room temp greater than target temp, turn heater off
    if (!shouldTurnOn) {
      setHeaterGpioOff(io);
    }

  } else {
    // if heater off
    //     if room temp less than target temp, turn heater on
    if (shouldTurnOn) {
      setHeaterGpioOn(io);
    }
  }

}, 1000)

// user disconnect
const onDisconnect = () => {
  console.log("socket.on.disconnect");
};

// user connect
const onConnect = (socket: Socket) => {
  console.log("io.on.connection");
  // send current state to user
  socket.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);

  // listen for events from user
  socket.on(CHANNEL.HEATER_GPIO_0, (newState: HeaterGpioState) =>
    setHeaterGpioState(newState, undefined, socket)
  );

  socket.on(CHANNEL.ESP32_TEMP_CLIENT_MAP, (newState: Esp32Client) =>
    setEsp32Client(newState, undefined, socket)
  );
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
  setInterval(() => emitPiTemp(io), 1000)
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, () => {
    setHeaterGpioOff(io);
    heaterGpio.destroy();
    process.exit();
  })
);
