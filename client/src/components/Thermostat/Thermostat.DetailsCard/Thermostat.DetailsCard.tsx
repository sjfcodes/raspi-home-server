import { MouseEventHandler, useState } from 'react';
import { FaArrowDownUpAcrossLine } from 'react-icons/fa6';
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
                <FaArrowDownUpAcrossLine />
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
