import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import reactLogo from './assets/react.svg';
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from './utils/constant';
import raspberryPiLogo from '/raspberry_pi.svg';
import viteLogo from '/vite.svg';

const socket = io();

function App() {
  const [ledState, setLedState] = useState(DEFAULT_LED_PIN_STATE)
  useEffect(() => {
    socket.on('connect', () => console.log('socket.on.connect'));
    socket.on(CHANNEL_LED_PIN_STATE, setLedState);
  }, [])

  const onClick = () => {
    setLedState((curr) => {
      const newState = { ...curr, isOn: !curr.isOn }
      console.log('socket.on.' + CHANNEL_LED_PIN_STATE, newState)
      socket.emit(CHANNEL_LED_PIN_STATE, newState)

      return newState
    })
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
      </div>
      <h1>Vite + React + Pi</h1>
      <div className={`card`}>
        <button className={ledState.isOn ? 'on' : ''} onClick={onClick}>
          led is {ledState.isOn ? 'on' : 'off'}
        </button>
      </div>
    </>
  )
}

export default App
