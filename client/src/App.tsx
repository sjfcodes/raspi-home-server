import "./App.css";
import Block from "./components/Block";
import LogStream from "./components/LogStream";
import Logos from "./components/Logos";
import PiTemp from "./components/PiTemp";
import QrCode from "./components/QrCode";
import CurrentTemp from "./components/LivingRoom/CurrentTemp";
import TargetTemp from "./components/LivingRoom/TargetTemp";
import Thermostats from "./components/Thermostats";
import { APP_MAX_WIDTH } from "./utils/constants";
import HeaterState from "./components/LivingRoom/HeaterState";

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
      <Logos />
      <Block />

      <HeaterState />
      <Block />

      {/* <TargetTemp />
      <Block /> */}

      {/* <LogStream />
      <Block /> */}

      <div style={{ maxWidth: APP_MAX_WIDTH, overflow: "scroll" }}>
        <Thermostats />
      </div>

      <PiTemp />
      <Block />

      <QrCode value={location.href} />
      <Block />
    </div>
  );
}

export default App;
