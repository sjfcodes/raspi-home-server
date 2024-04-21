import { MouseEventHandler, useState } from 'react';
import { GiComputerFan } from "react-icons/gi";
import { Heater } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './heater.detailsCard.css';

type Props = { heater: Heater | undefined };
export default function HeaterDetailsCard({ heater }: Props) {
    const [showJson, setShowJson] = useState(false);

    if (!heater) return null;

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setShowJson((curr) => !curr);
    };

    const content = showJson ? (
        <Snippet text={JSON.stringify({ heater }, null, 2)} />
    ) : (
        <div className="heater-details-cover text-medium">
            <div className="icon text-xlarge" >
            <GiComputerFan />
            </div>
            <div>heater</div>
        </div>
    );

    return (
        <div
            className="item-card-full-x-quarter heater-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
