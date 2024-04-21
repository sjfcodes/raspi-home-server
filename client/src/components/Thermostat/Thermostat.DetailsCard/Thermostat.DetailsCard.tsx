import { MouseEventHandler, useState } from 'react';
import { RiTimer2Line } from "react-icons/ri";
import { Thermostat } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './thermostat.detailsCard.css';

type Props = { thermostat: Thermostat | undefined };
export default function ThermostatDetailsCard({ thermostat }: Props) {
    const [showJson, setShowJson] = useState(false);

    if (!thermostat) return null;

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setShowJson((curr) => !curr);
    };

    const content = showJson ? (
        <Snippet text={JSON.stringify({ thermostat }, null, 2)} />
    ) : (
        <div className="thermostat-details-cover text-medium">
            <div className="icon text-xlarge" >
                <RiTimer2Line />
            </div>
            <div>thermostat</div>
        </div>
    );

    return (
        <div
            className="item-card-full-x-quarter thermostat-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
