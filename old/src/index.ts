import express from 'express';
import { createServer } from 'node:http';
// import { DigitalOutput } from 'raspi-gpio';
import { Server } from 'socket.io';
import { startClientServer } from './utilities/client-server.js';
import {
  CHANNEL_LED_PIN_STATE,
  DEFAULT_LED_PIN_STATE,
} from './utilities/constant.js';
import { ipAddress } from './utilities/ipAddress.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
// const gpio4 = new DigitalOutput('GPIO4');

const { PORT = 3000 } = process.env;
let ledPinState = DEFAULT_LED_PIN_STATE;

const turnOff = (pin) => {
  pin.write(0);
};

const turnOn = (pin) => {
  pin.write(1);
};

// user disconnect
const onDisconnect = () => {
  console.log('socket.on.disconnect');
};

// user connect
const onConnect = (socket) => {
  console.log('io.on.connection');
  // send current state to user
  socket.emit(CHANNEL_LED_PIN_STATE, ledPinState);
  // listen for events from user
  socket.on(CHANNEL_LED_PIN_STATE, onUpdatePinState);
  socket.on('disconnect', onDisconnect);
};

// user updates pin state
const onUpdatePinState = (newLedState) => {
  // (newLedState.isOn ? turnOn : turnOff)(gpio4);
  ledPinState.isOn = newLedState.isOn;
  // send new state to all users (including sender)
  io.emit(CHANNEL_LED_PIN_STATE, ledPinState);
  console.log(CHANNEL_LED_PIN_STATE, ledPinState);
};

io.on('connection', onConnect);
server.listen(PORT, () => {
  // turnOff(gpio4);
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
  startClientServer();
});

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, () => {
    // turnOff(gpio4);
    // gpio4.destroy();
    process.exit();
  }),
);
