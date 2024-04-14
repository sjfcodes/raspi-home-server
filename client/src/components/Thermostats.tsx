import useThermostat from '../hooks/useThermostat';
import Block from './Block';
import Thermostat from './Thermostat';

export default function ThermostatMap({
    hideIds = [],
}: {
    hideIds?: string[];
}) {
    const [thermostatMap] = useThermostat();

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
