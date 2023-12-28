import "./App.css";
import SocketStatus from "./SocketStatus";
import Esp32TempClients from "./components/Esp32TempClients";
import HeaterState from "./components/HeaterState";
import LogStream from "./components/LogStream";
import OverrideButtons from "./components/OverrideButtons";
import PiTemp from "./components/PiTemp";
import RoomTemp from "./components/RoomTemp";
import raspberryPiLogo from "/raspberry_pi.svg";

function App() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="https://react.dev" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <h2>
          <SocketStatus />
        </h2>
      </div>
      <hr />
      <div>
        <HeaterState />
        <Esp32TempClients />
        <RoomTemp />
        <OverrideButtons />
        <PiTemp />
        <LogStream />
      </div>
    </>
  );
}

export default App;
