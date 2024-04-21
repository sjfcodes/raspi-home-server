import { MouseEventHandler, useState } from 'react';
import { Thermometer } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './thermometer.detailsCard.css';

type Props = { thermometer: Thermometer | undefined };
export default function ThermometerDetailsCard({ thermometer }: Props) {
    const [showJson, setShowJson] = useState(false);

    if (!thermometer) return null;

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setShowJson((curr) => !curr);
    };

    const content = showJson ? (
        <Snippet text={JSON.stringify({ thermometer }, null, 2)} />
    ) : (
        'thermometer'
    );

    return (
        <div
            className="item-card-full-x-quarter thermometer-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
