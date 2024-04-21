import { Heater, Remote, Thermostat } from '../../../../../../types/main';
import HeaterDetailsCard from '../../../Heater/Heater.DetailsCard/Heater.DetailsCard';
import ThermostatDetailsCard from '../../../Thermostat/Thermostat.DetailsCard/Thermostat.DetailsCard';
import RemoteDetailsCard from '../../Remote.DetailsCard/Remote.DetailsCard';
import './remote.info.details.css';

type Props = {
    remote: Remote | undefined;
    thermostat: Thermostat | undefined;
    heater: Heater | undefined;
};
export default function RemoteInfoDetails({
    remote,
    thermostat,
    heater,
}: Props) {
    return (
        <div className="remote-info-details">
            <RemoteDetailsCard remote={remote} />
            <ThermostatDetailsCard thermostat={thermostat} />
            <HeaterDetailsCard heater={heater} />
        </div>
    );
}
