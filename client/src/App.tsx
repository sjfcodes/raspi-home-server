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
    <>
      <Logos />
      <br />
      <br />
      <div>
        <TargetTemp />
        <Thermostat thermostat={thermostatMap[PRIMARY_THERMOSTAT]} />
        <HeaterState chipId={HEATER_CAB.HOME} />
        <LogStream />

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100px",
            bottom: "100px",
          }}
        >
          <Thermostats hideIds={[PRIMARY_THERMOSTAT]} />
          {/* <OverrideButtons /> */}
          <PiTemp />
        </div>
        <div
          style={{
            borderTop: "1px solid orange",
            position: "absolute",
            width: "100%",
            height: "100px",
            bottom: "0",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => location.reload()}
        >
          {location.href}
        </div>
      </div>
    </>
  );
}

export default App;
