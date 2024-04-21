import { MouseEventHandler, useState } from 'react';
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
        <Snippet className="text-small" text={JSON.stringify({ thermostat }, null, 2)} />
    ) : (
        'thermostat'
    );

    return (
        <div
            className="item-card-half-x-half thermostat-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
