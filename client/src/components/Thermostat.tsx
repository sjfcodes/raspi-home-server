import { Thermostat as _Thermostat } from '../../../types/main';
import OldCard from './Old.Card';
import Snippet from './Snippet/Snippet';

export default function Thermostat({
    thermostat,
}: {
    thermostat: _Thermostat;
}) {
    if (!thermostat) return null;

    const curTemp = thermostat?.tempF + thermostat?.calibrate;
    const copy = structuredClone(thermostat);

    return (
        <OldCard
            label={`${copy.chipName}:  ${isNaN(curTemp) ? '-' : curTemp + '℉'}`}
            content={<Snippet text={JSON.stringify(copy, null, 2)} />}
        />
    );
}
