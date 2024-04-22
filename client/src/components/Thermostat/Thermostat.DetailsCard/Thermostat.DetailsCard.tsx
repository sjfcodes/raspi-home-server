import { RiTimer2Line } from 'react-icons/ri';
import { Thermostat } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import ZoneComponentCard from '../../ZoneComponentCard/ZoneComponentCard';
import './thermostat.detailsCard.css';

type Props = { thermostat: Thermostat | undefined };
export default function ThermostatDetailsCard({ thermostat }: Props) {
    if (!thermostat) return null;
    const Header = (
        <>
            <div className="icon text-xlarge">
                <RiTimer2Line />
            </div>
            <div>thermostat</div>
        </>
    );
    return (
        <ZoneComponentCard
            initialCardSize="item-card-100-x-25"
            toggledCardSize="item-card-100-x-75"
            Header={Header}
            ShowOnToggle={
                <div className="thermostat-details-card">
                    <Snippet text={JSON.stringify(thermostat, null, 2)} />
                </div>
            }
        />
    );
}
