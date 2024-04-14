import { SytemTemperature } from '../../../../types/main';
import useSystemTemperature from '../../hooks/useSystemTemperature';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';

export default function SystemTemperatureMap() {
    const [piTemp] = useSystemTemperature();

    const pi = piTemp['system'] as SytemTemperature;

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
