import { useAtom } from 'jotai';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';
import { systemTemperatureAtom } from '../../store/systemTemperature.atom';

export default function SystemTemperatureMap() {
    const [piTemp] = useAtom(systemTemperatureAtom);

    const pi = piTemp?.system;
    if (!pi) return null;

    // 85℃ (185℉) max rasbperry pi temp
    const percentage = (pi.tempF / 185) * 100;
    const json = JSON.stringify(piTemp, null, 2);

    return (
        <Card
            label={`Pi Temp: ${pi.tempF ? pi.tempF + '℉' : '-'} (${
                isNaN(percentage) ? '-' : Math.trunc(percentage) + '%'
            })`}
            content={<Snippet text={json} />}
        />
    );
}
