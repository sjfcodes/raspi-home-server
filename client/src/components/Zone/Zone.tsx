import { Zone as TZone } from '../../../../types/main';
import Thermostat from '../Thermostat/Thermostat';
import './zone.css';

type Props = { zone: TZone };
export default function Zone({ zone }: Props) {
    return (
        <div className="zone">
            <Thermostat zone={zone} />
        </div>
    );
}
