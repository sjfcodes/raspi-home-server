import useThermostats from "../hooks/useThermostats";
import Thermostat from "./Thermostat";

export default function Thermostats() {
  const { thermostatMap } = useThermostats();

  const sorted = Object.values(thermostatMap).sort((a, b) =>
    a.chipName < b.chipName ? 1 : -1
  );

  return sorted.map((thermostat) => (
    <Thermostat key={thermostat.chipId} thermostat={thermostat} />
  ));
}
