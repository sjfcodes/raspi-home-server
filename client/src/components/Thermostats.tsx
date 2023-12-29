import useThermostats from "../hooks/useThermostats";
import Thermostat from "./Thermostat";

export default function Thermostats() {
  const { thermostatMap } = useThermostats();

  return Object.values(thermostatMap).map((thermostat) => (
    <Thermostat key={thermostat.chipId} thermostat={thermostat} />
  ));
}
