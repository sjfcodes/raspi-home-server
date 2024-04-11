import "./App.css";
import Block from "./components/Block";
import PiLogs from "./components/PiLogs";
import Logos from "./components/Logos";
import SystemTemperatureState from "./components/State/SystemTemperatureState";
import QrCode from "./components/QrCode";
import HomeTemperatureTarget from "./components/State/HomeTemperatureTarget";
import Thermostats from "./components/Thermostats";
import { APP_MAX_WIDTH } from "./utils/constants";
import HeaterState from "./components/State/HeaterState";
import RemoteState from "./components/State/RemoteState";

function App() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: APP_MAX_WIDTH,
        // height: "calc(100vh - 100px)",
        height: "100vh",
        margin: "0 auto",
        overflowY: "scroll",
        overflowX: "hidden",
        paddingBottom: "1rem",
      }}
    >
      <Block />
      <Logos />
      <Block />

      <HeaterState />
      <Block />

      <RemoteState />
      <Block />

      <HomeTemperatureTarget />
      <Block />

      {/* <PiLogs />
      <Block /> */}

      <div style={{ maxWidth: APP_MAX_WIDTH, overflow: "scroll" }}>
        <Thermostats />
      </div>

      <SystemTemperatureState />
      <Block />

      <QrCode value={location.href} />
      <Block />
    </div>
  );
}

export default App;
