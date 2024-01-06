import "./App.css";
import SocketStatus from "./SocketStatus";
import HeaterState from "./components/HeaterState";
import LogStream from "./components/LogStream";
// import OverrideButtons from "./components/OverrideButtons";
import reactLogo from './assets/react.svg';
import espressifLogo from "./assets/espressif.svg";
import raspberryPiLogo from "./assets/raspberry_pi.svg";
import PiTemp from "./components/PiTemp";
import TargetTemp from "./components/TargetTemp";
import Thermostats from "./components/Thermostats";

function App() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="https://www.raspberrypi.com/" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <a href="https://www.espressif.com/en/products/socs/esp32" target="_blank">
          <img src={espressifLogo} className="logo" alt="Espressif logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo" alt="React logo" />
        </a>
      </div>
      <hr />
      <div>
        <h2>Server:{' '}
          <SocketStatus />
        </h2>
        <br/>
        <Thermostats />
        <TargetTemp />
        <HeaterState />
        {/* <OverrideButtons /> */}
        <PiTemp />
        <LogStream />
      </div>
    </>
  );
}

export default App;
