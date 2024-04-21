import { MouseEventHandler, useState } from 'react';
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
        <Snippet className="text-small" text={JSON.stringify({ heater }, null, 2)} />
    ) : (
        'heater'
    );

    return (
        <div
            className="item-card-half-x-half heater-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
