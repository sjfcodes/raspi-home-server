import useThermostats from "../hooks/useThermostats";
import Thermostat from "./Thermostat";

export default function Thermostats({ hideIds = [] }: { hideIds?: string[] }) {
  const { thermostatMap } = useThermostats();

  const sorted = Object.values(thermostatMap)
    .filter((tstat) => !hideIds.includes(tstat.chipId))
    .sort((a, b) => (a.chipName > b.chipName ? 1 : -1));

  return sorted.map((thermostat) => (
    <Thermostat key={thermostat.chipId} thermostat={thermostat} />
  ));
}
