import './App.css';
import SocketStatus from './SocketStatus';
import Esp32TempClients from './components/Esp32TempClients';
import GpioHeaterState from './components/GpioHeaterState';
import OverrideButtons from './components/OverrideButtons';
import PiTemp from './components/PiTemp';
import RoomTemp from './components/RoomTemp';
import raspberryPiLogo from '/raspberry_pi.svg';

function App() {
  return (
    <>
      <div style={{ display: 'flex' }} >
        <a href="https://react.dev" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <h2>
          <SocketStatus />
        </h2>
      </div>
      <div>
        <Esp32TempClients />
        <RoomTemp />
        <GpioHeaterState />
        <OverrideButtons />
        <PiTemp />
      </div>
    </>
  )
}

export default App
