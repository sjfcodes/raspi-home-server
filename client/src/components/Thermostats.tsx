import { useAtom } from 'jotai';
import Block from './Block';
import Thermostat from './Thermostat';
import { thermostatMapAtom } from '../store/thermostatMap.atom';

export default function ThermostatMap({
    hideIds = [],
}: {
    hideIds?: string[];
}) {
    const [thermostatMap] = useAtom(thermostatMapAtom);

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
