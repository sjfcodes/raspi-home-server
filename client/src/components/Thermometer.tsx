import { Thermometer as _Thermometer } from '../../../types/main';
import OldCard from './Old.Card';
import Snippet from './Snippet/Snippet';

export default function Thermometer({
    thermometer,
}: {
    thermometer: _Thermometer;
}) {
    if (!thermometer) return null;

    const curTemp = thermometer?.tempF;
    const copy = structuredClone(thermometer);

    return (
        <OldCard
            label={`${copy.chipName}:  ${isNaN(curTemp) ? '-' : curTemp + '℉'}`}
            content={<Snippet text={JSON.stringify(copy, null, 2)} />}
        />
    );
}
