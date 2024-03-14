import { HEATER_CAB, PRIMARY_THERMOSTAT } from "../../constant/constant";
import "./App.css";
import HeaterState from "./components/HeaterState";
import LogStream from "./components/LogStream";
// import OverrideButtons from "./components/OverrideButtons";
import Logos from "./components/Logos";
import PiTemp from "./components/PiTemp";
import TargetTemp from "./components/TargetTemp";
import Thermostat from "./components/Thermostat";
import Thermostats from "./components/Thermostats";
import useThermostats from "./hooks/useThermostats";

function App() {
  const { thermostatMap } = useThermostats();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "calc(100vh - 100px)",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <Logos />
      <br />
      <br />
      <div>
        <Thermostat thermostat={thermostatMap[PRIMARY_THERMOSTAT]} />

        <TargetTemp />
        <div
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        ></div>
        <LogStream />

        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "100px",
            bottom: "100px",
          }}
        >
          <Thermostats hideIds={[PRIMARY_THERMOSTAT]} />
          {/* <OverrideButtons /> */}
          <PiTemp />
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid orange",
          position: "absolute",
          width: "100%",
          height: "100px",
          bottom: "0",
          left: "0",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => location.reload()}
      >
        {location.href}
      </div>
    </div>
  );
}

export default App;
