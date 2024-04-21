import RemoteInfo from './Remote.Info/Remote.Info';
import './remote.css';
import { Zone } from '../../../../types/main';
import HeaterOverride from './HeaterOverride/HeaterOverride';
import RemoteTemperatureButtons from './Remote.TemperatureButtons/Remote.TemperatureButtons';

type Props = { zone: Zone };
export default function Remote({ zone }: Props) {
    if (!zone) return null;
    return (
        <div className="remote">
            <RemoteInfo zone={zone} />
            <RemoteTemperatureButtons zone={zone} />
            <HeaterOverride zone={zone} />
        </div>
    );
}
