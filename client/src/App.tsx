import "./App.css";
import Block from "./components/Block";
import PiLogs from "./components/PiLogs";
import Logos from "./components/Logos";
import PiTemp from "./components/PiTemp";
import QrCode from "./components/QrCode";
import HomeTemperatureTarget from "./components/Home/HomeTemperatureTarget";
import Thermostats from "./components/Thermostats";
import { APP_MAX_WIDTH } from "./utils/constants";
import HomeHeaterState from "./components/Home/HomeHeaterState";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: APP_MAX_WIDTH,
          height: "100%",
          margin: "0 auto",
          overflowX: "hidden",
          paddingBottom: "1rem",
        }}
      >
        <Block />
        <Logos />
        <Block />

        <HomeHeaterState />
        <Block />

        <HomeTemperatureTarget />
        <Block />

        {/* <PiLogs />
      <Block /> */}

        <div style={{ maxWidth: APP_MAX_WIDTH, overflow: "scroll" }}>
          <Thermostats />
        </div>

        <PiTemp />
        <Block />

        <QrCode value={location.href} />
        <Block />
      </div>
    </div>
  );
}

export default App;
