import './App.css';
import Esp32TempClients from './Esp32TempClients';
import PiTemp from './PiTemp';
import PowerButton from './PowerButton';
import SocketStatus from './SocketStatus';
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
      <div className="card">
        <PiTemp />
      </div >
      <div className="card">
        <Esp32TempClients />
      </div >
      <div className="card">
        <PowerButton />
      </div >
    </>
  )
}

export default App
