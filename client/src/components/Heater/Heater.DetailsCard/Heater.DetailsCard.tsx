import { Heater } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './heater.detailsCard.css';

type Props = { heater: Heater | undefined };
export default function HeaterDetailsCard({ heater }: Props) {
    if (!heater) return null;
    return (
        <div className="heater-details-card">
            <Snippet text={JSON.stringify({ heater }, null, 2)} />
        </div>
    );
}
