import { TbTemperatureMinus } from 'react-icons/tb';
import { Thermometer } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './thermometer.detailsCard.css';
import ZoneComponentCard from '../../ZoneComponentCard/ZoneComponentCard';

type Props = { thermometer: Thermometer | undefined };
export default function ThermometerDetailsCard({ thermometer }: Props) {
    if (!thermometer) return null;
    const Header = (
        <>
            <div className="icon text-xlarge">
                <TbTemperatureMinus />
            </div>
            <div>thermometer</div>
        </>
    );
    return (
        <ZoneComponentCard
            initialCardSize="item-card-100-x-25"
            toggledCardSize="item-card-100-x-75"
            Header={Header}
            ShowOnToggle={
                <div className="thermometer-details-card">
                    <Snippet text={JSON.stringify(thermometer, null, 2)} />
                </div>
            }
        />
    );
}

