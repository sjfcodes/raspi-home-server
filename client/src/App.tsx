import "./App.css";
import SocketStatus from "./SocketStatus";
import HeaterState from "./components/HeaterState";
import LogStream from "./components/LogStream";
// import OverrideButtons from "./components/OverrideButtons";
import Logos from "./components/Logos";
import PiTemp from "./components/PiTemp";
import TargetTemp from "./components/TargetTemp";
import Thermostats from "./components/Thermostats";

function App() {
  return (
    <>
      <Logos />
      <hr />
      <div>
        <h2>
          Server: <SocketStatus />
        </h2>
        <br />
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
