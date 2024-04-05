import useThermostatSse from "../hooks/useThermostatSse";
import Thermostat from "./Thermostat";

export default function Thermostats({ hideIds = [] }: { hideIds?: string[] }) {
  const [thermostatMap] = useThermostatSse();

  const sorted = Object.values(thermostatMap)
    .filter((tstat) => !hideIds.includes(tstat.chipId))
    .sort((a, b) => (a.chipName > b.chipName ? 1 : -1));

  return sorted.map((thermostat) => (
    <Thermostat key={thermostat.chipId} thermostat={thermostat} />
  ));
}
