import express from 'express';
import { createServer } from 'node:http';
import _gpio from 'rpi-gpio';
import { Server } from 'socket.io';
import { startClientServer } from './utilities/client-server.js';
import { CHANNEL_LED_PIN_STATE } from './utilities/constant.js';
import { ipAddress } from './utilities/ipAddress.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const { PORT = 3000 } = process.env;

const gpiop = _gpio.promise
const ledPinPos = 7;
let ledPinState = { isOn: false }

try {
  await gpiop.setup(ledPinPos, gpiop.DIR_OUT)
} catch (error) {
  console.error(error)
}

io.on('connection', (socket) => {
  // when user connects
  console.log('io.on.connection');
  // send current state to user
  socket.emit(CHANNEL_LED_PIN_STATE, ledPinState)

  // when user sends new state
  socket.on(CHANNEL_LED_PIN_STATE, (newLedState) => {
    console.log({ newLedState });
    try {
      gpiop.write(ledPinPos, newLedState.isOn);
      // send new state to all users (including sender)
      io.emit(CHANNEL_LED_PIN_STATE, newLedState);
      ledPinState.isOn = newLedState.isOn
    } catch (error) {
      console.error(error)
    }
  })

  // when user disconnects
  socket.on('disconnect', () => {
    console.log('socket.on.disconnect');
  });
});

// Add in server-side socket.io code here.

server.listen(PORT, () => {
  console.log(`Server running at http://${ipAddress}:${PORT}.`);
  startClientServer();
});
