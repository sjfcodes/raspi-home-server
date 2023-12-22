import io from 'socket.io-client';
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from './utilities/constant.js';

const socket = io();
const buttonState = document.querySelector('.button-state');
const toggleLedBtn = document.getElementById('toggle-led');
let ledPinState = DEFAULT_LED_PIN_STATE;

socket.on('connect', () => {
  console.log('socket.on.connect');
});

socket.on(CHANNEL_LED_PIN_STATE, (newLedState) => {
  console.log(CHANNEL_LED_PIN_STATE, newLedState)
  ledPinState = newLedState;
  buttonState.textContent = newLedState.isOn ? 'on' : 'off';
});

toggleLedBtn.addEventListener('click', () => {
  ledPinState.isOn = !ledPinState.isOn
  socket.emit(CHANNEL_LED_PIN_STATE, ledPinState)
})

// socket.on('pot', (value, raw) => {
//   console.log(value, raw);
//   potState.textContent = value;
//   document.body.style.backgroundColor = `rgb(${value}, ${value}, ${value})`;
// });
