import io from 'socket.io-client';

const buttonState = document.querySelector('.button-state');
const potState = document.querySelector('.pot-state');

// Add in client-side socket.io code here.

const socket = io();
socket.on('connect', () => {
  console.log('socket.on.connect');
});

socket.on('button-down', (message) => {
  console.log(message);
  buttonState.textContent = message;
});
socket.on('button-up', (message) => {
  console.log(message);
  buttonState.textContent = message;
});
socket.on('pot', (value, raw) => {
  console.log(value, raw);
  potState.textContent = value;
  document.body.style.backgroundColor = `rgb(${value}, ${value}, ${value})`;
});
