import { GiComputerFan } from 'react-icons/gi';
import { Heater } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './heater.detailsCard.css';
import ZoneComponentCard from '../../ZoneComponentCard/ZoneComponentCard';

type Props = { heater: Heater | undefined };
export default function HeaterDetailsCard({ heater }: Props) {
    if (!heater) return null;
    const Header = (
        <>
            <div className="icon text-xlarge">
                <GiComputerFan />
            </div>
            <div>heater</div>
        </>
    );
    return (
        <ZoneComponentCard
            initialCardSize="item-card-100-x-25"
            toggledCardSize="item-card-100-x-75"
            Header={Header}
            ShowOnToggle={
                <div className="heater-details-card">
                    <Snippet text={JSON.stringify(heater, null, 2)} />
                </div>
            }
        />
    );
}
