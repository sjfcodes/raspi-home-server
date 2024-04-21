import { Remote, Thermostat } from '../../../../../../types/main';
import ThermostatDetailsCard from '../../../Thermostat/Thermostat.DetailsCard/Thermostat.DetailsCard';
import RemoteDetailsCard from '../../Remote.DetailsCard/Remote.DetailsCard';
import './remote.info.details.css'

type Props = { remote: Remote | undefined; thermostat: Thermostat | undefined };
export default function RemoteInfoDetails({ remote, thermostat }: Props) {
    return (
        <div className="remote-info-details">
            <RemoteDetailsCard remote={remote} />
            <ThermostatDetailsCard thermostat={thermostat} />
        </div>
    );
}
