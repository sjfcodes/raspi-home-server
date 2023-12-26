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
        <h1>
          <SocketStatus />
        </h1>
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
      {/* <hr />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Pi</h1> */}
    </>
  )
}

export default App
