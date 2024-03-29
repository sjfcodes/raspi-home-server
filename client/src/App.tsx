import { PRIMARY_THERMOSTAT } from "../../constant/constant";
import "./App.css";
import LogStream from "./components/LogStream";
// import OverrideButtons from "./components/OverrideButtons";
import Logos from "./components/Logos";
import TargetTemp from "./components/TargetTemp";
import Thermostat from "./components/Thermostat";
import Thermostats from "./components/Thermostats";
import useThermostats from "./hooks/useThermostats";

const Footer = () => {
  return (
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
  );
};

function App() {
  const { thermostatMap } = useThermostats();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "calc(100vh - 100px)",
        margin: "0 auto",
        overflow: "scroll",
      }}
    >
      <Logos />
      <br />
      <Thermostat thermostat={thermostatMap[PRIMARY_THERMOSTAT]} />
      <LogStream />
      <TargetTemp />
      <br />
      <br />
      <br />
      <br />
      <Thermostats hideIds={[PRIMARY_THERMOSTAT]} />
      {/* <OverrideButtons /> */}
      {/* <PiTemp /> */}
      <Footer />
    </div>
  );
}

export default App;
