import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";
import { DigitalOutput } from "raspi-gpio";
import { Server, Socket } from "socket.io";
import { CHANNEL, GPIO_HEATER_DEFAULT_STATE } from "../../constant/constant";
import { Esp32Client, Esp32ClientMap, GpioHeaterPinState } from "../../types/main";
import { ipAddress } from "./utils/ipAddress";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const server = createServer(app);
const io = new Server(server);
const gpio4 = new DigitalOutput("GPIO4");

const { PORT = 3000 } = process.env;
let gpioHeaterPinState = GPIO_HEATER_DEFAULT_STATE;
const clientMap: Esp32ClientMap = {};

const turnOff = (pin: DigitalOutput) => {
  pin.write(0);
};

const turnOn = (pin: DigitalOutput) => {
  pin.write(1);
};

// user disconnect
const onDisconnect = () => {
  console.log("socket.on.disconnect");
};

// user updates pin state
const setGpioHeaterPinState = (newState: GpioHeaterPinState) => {
  if (newState === undefined) {
    console.error(new Error('newState must be defined'))
    return;
  }

  (newState.isOn ? turnOn : turnOff)(gpio4);
  gpioHeaterPinState = newState;
  // send new state to all users (including sender)
  io.emit(CHANNEL.GPIO_HEATER_0, gpioHeaterPinState);
  console.log("EMIT: ", CHANNEL.GPIO_HEATER_0, JSON.stringify(gpioHeaterPinState));
};

const setEsp32Client = (client: Esp32Client, socket?: Socket) => {
  if (client === undefined) {
    console.error(new Error('client must be defined'))
    return;
  }

  if (!client.chipId) {
    console.error(new Error('client.chipId must be defined'))
    return;
  }

  clientMap[client.chipId as string] = {
    chipId: client?.chipId,
    chipName: client?.chipName,
    tempF: client?.tempF || 0,
    updatedAt: new Date().toLocaleTimeString()
  }

  if (socket) {
    socket.broadcast.emit(CHANNEL.ESP32_TEMP_CLIENT_MAP, clientMap);
  } else {
    // send new state to all users (including sender)
    io.emit(CHANNEL.ESP32_TEMP_CLIENT_MAP, clientMap);
  }

  console.log("EMIT: ", CHANNEL.GPIO_HEATER_0, JSON.stringify(clientMap));
}

// user connect
const onConnect = (socket: Socket) => {
  console.log("io.on.connection");
  // send current state to user
  socket.emit(CHANNEL.GPIO_HEATER_0, gpioHeaterPinState);

  // broadcast update to other users if needed
  // socket.broadcast.emit(CHANNEL.GPIO_HEATER_0, gpioHeaterPinState);
  
  // listen for events from user
  socket.on(CHANNEL.GPIO_HEATER_0, setGpioHeaterPinState);
  socket.on(CHANNEL.ESP32_TEMP_CLIENT_MAP, (newState: Esp32Client) => setEsp32Client(newState, socket));
  socket.on("disconnect", onDisconnect);
};

io.on("connection", onConnect);

app.get("/", (req, res) => {
  console.log('GET ', new Date().toISOString() + ": ", JSON.stringify(req.query));
  gpioHeaterPinState.isOn = !gpioHeaterPinState.isOn;
  setGpioHeaterPinState(gpioHeaterPinState);
  res.status(200).send({ ...req.query, serverName: "raspi-home-server" });
});

app.post("/api/temperature", (req, res) => {
  console.log('POST ', new Date().toISOString() + ": ", req.body);
  if (req.body) setEsp32Client(req.body)
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

server.listen(PORT, () => {
  turnOff(gpio4);
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, () => {
    turnOff(gpio4);
    gpio4.destroy();
    process.exit();
  })
);
