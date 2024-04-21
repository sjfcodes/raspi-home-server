import { Thermometer } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './thermometer.detailsCard.css';

type Props = { thermometer: Thermometer | undefined };
export default function ThermometerDetailsCard({ thermometer }: Props) {
    if (!thermometer) return null;
    return (
        <div className="thermometer-details-card">
            <Snippet text={JSON.stringify({ thermometer }, null, 2)} />
        </div>
    );
}

