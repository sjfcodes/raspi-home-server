import useThermostatMap from "../hooks/useThermostatMap";
import Block from "./Block";
import Thermostat from "./Thermostat";

export default function Thermostats({ hideIds = [] }: { hideIds?: string[] }) {
  const [thermostatMap] = useThermostatMap();

  const sorted = Object.values(thermostatMap)
    .filter((tstat) => !hideIds.includes(tstat.chipId))
    .sort((a, b) => (a.chipName > b.chipName ? 1 : -1));

  return sorted.map((thermostat) => (
    <div key={thermostat.chipId}>
      <Thermostat key={thermostat.chipId} thermostat={thermostat} />
      <Block />
    </div>
  ));
}
