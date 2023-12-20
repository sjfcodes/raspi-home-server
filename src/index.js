import express from 'express';
import { createServer } from 'node:http';
import { DigitalOutput } from 'raspi-gpio';
import { Server } from 'socket.io';
import { startClientServer } from './utilities/client-server.js';
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from './utilities/constant.js';
import { ipAddress } from './utilities/ipAddress.js';


const app = express();
const server = createServer(app);
const io = new Server(server);
const gpio4 = new DigitalOutput('GPIO4');

const { PORT = 3000 } = process.env;
let ledPinState = DEFAULT_LED_PIN_STATE;

// user disconnect
const onDisconnect = () => {
  console.log('socket.on.disconnect');
}

// user connect
const onConnect = (socket) => {
  console.log('io.on.connection');
  // send current state to user
  socket.emit(CHANNEL_LED_PIN_STATE, ledPinState)
  // listen for events from user
  socket.on(CHANNEL_LED_PIN_STATE, onUpdatePinState)
  socket.on('disconnect', onDisconnect);
}

// user updates pin state
const onUpdatePinState = (newLedState) => {
  gpio4.write(newLedState.isOn ? 1 : 0);
  ledPinState.isOn = newLedState.isOn
  // send new state to all users (including sender)
  io.emit(CHANNEL_LED_PIN_STATE, ledPinState);
  console.log('ledPinState:', ledPinState);
}

io.on('connection', onConnect);

server.listen(PORT, () => {
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
  startClientServer();
});
