import { Thermostat } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './thermostat.detailsCard.css';

type Props = { thermostat: Thermostat | undefined };
export default function ThermostatDetailsCard({ thermostat }: Props) {
    if (!thermostat) return null;
    return (
        <div className="thermostat-details-card">
            <Snippet text={JSON.stringify(thermostat , null, 2)} />
        </div>
    );
}
