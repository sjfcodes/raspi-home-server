import "./App.css";
import SocketStatus from "./SocketStatus";
import HeaterState from "./components/HeaterState";
import LogStream from "./components/LogStream";
// import OverrideButtons from "./components/OverrideButtons";
import raspberryPiLogo from "./assets/raspberry_pi.svg";
import raspberryPiLogo from "./assets/";
import PiTemp from "./components/PiTemp";
import TargetTemp from "./components/TargetTemp";
import Thermostats from "./components/Thermostats";

function App() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="https://react.dev" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <h2>
          <SocketStatus />
        </h2>
      </div>
      <hr />
      <div>
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
