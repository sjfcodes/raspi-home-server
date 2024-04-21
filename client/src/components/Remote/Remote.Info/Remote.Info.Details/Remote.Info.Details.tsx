import { Heater, Remote, Thermometer } from '../../../../../../types/main';
import HeaterDetailsCard from '../../../Heater/Heater.DetailsCard/Heater.DetailsCard';
import ThermometerDetailsCard from '../../../Thermometer/Thermometer.DetailsCard/Thermometer.DetailsCard';
import RemoteDetailsCard from '../../Remote.DetailsCard/Remote.DetailsCard';
import './remote.info.details.css';

type Props = {
    remote: Remote | undefined;
    thermometer: Thermometer | undefined;
    heater: Heater | undefined;
};
export default function RemoteInfoDetails({
    remote,
    thermometer,
    heater,
}: Props) {
    return (
        <div className="remote-info-details">
            <ThermometerDetailsCard thermometer={thermometer} />
            <HeaterDetailsCard heater={heater} />
            <RemoteDetailsCard remote={remote} />
        </div>
    );
}
