import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";
import { DigitalOutput } from 'raspi-gpio';
import { Server, Socket } from "socket.io";
import { PinState } from "../../types/main";
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from "./utils/constant";
import { ipAddress } from "./utils/ipAddress";

const app = express();
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

const server = createServer(app);
const io = new Server(server);
const gpio4 = new DigitalOutput('GPIO4');

const { PORT = 3000 } = process.env;
let ledPinState = DEFAULT_LED_PIN_STATE;

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

// user connect
const onConnect = (socket: Socket) => {
  console.log("io.on.connection");
  // send current state to user
  socket.emit(CHANNEL_LED_PIN_STATE, ledPinState);
  // listen for events from user
  socket.on(CHANNEL_LED_PIN_STATE, onUpdatePinState);
  socket.on("disconnect", onDisconnect);
};

// user updates pin state
const onUpdatePinState = (newPinState: PinState) => {
  (newPinState.isOn ? turnOn : turnOff)(gpio4);
  ledPinState = newPinState;
  // send new state to all users (including sender)
  io.emit(CHANNEL_LED_PIN_STATE, ledPinState);
  console.log(CHANNEL_LED_PIN_STATE, ledPinState);
};

io.on("connection", onConnect);

app.get("/", (req, res) => {
  onUpdatePinState({ isOn: !ledPinState.isOn })
  console.log(new Date().toISOString() + ': ', JSON.stringify(req.query))
  res.status(200).send({ ...req.query, serverName: "raspi-home-server" })
});

app.post("/api/temperature", (req, res) => {
  onUpdatePinState({ isOn: !ledPinState.isOn, tempF: req.body.tempF })
  console.log(new Date().toISOString() + ': ', req.body)
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" })
});

app.put("/", (_, res) => res.status(200).send("PUT:raspi-home-server"));
app.patch("/", (_, res) => res.status(200).send("PATCH:raspi-home-server"));
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
