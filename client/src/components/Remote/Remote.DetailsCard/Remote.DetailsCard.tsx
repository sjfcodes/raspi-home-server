import { MouseEventHandler, useState } from 'react';
import { Remote } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './remote.detailsCard.css';

type Props = { remote: Remote | undefined };
export default function RemoteDetailsCard({ remote }: Props) {
    const [showJson, setShowJson] = useState(false);

    if (!remote) return null;

    const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setShowJson((curr) => !curr);
    };

    const content = showJson ? (
        <Snippet className="text-small" text={JSON.stringify({ remote }, null, 2)} />
    ) : (
        'remote'
    );

    return (
        <div
            className="item-card-half-x-half remote-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
