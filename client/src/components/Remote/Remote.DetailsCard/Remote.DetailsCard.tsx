import { MouseEventHandler, useState } from 'react';
import { FaArrowDownUpAcrossLine } from 'react-icons/fa6';
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
        <Snippet text={JSON.stringify({ remote }, null, 2)} />
    ) : (
        <div className="remote-details-cover text-medium">
            <div className="icon text-xlarge" >
                <FaArrowDownUpAcrossLine />
            </div>
            <div>remote</div>
        </div>
    );

    return (
        <div
            className="item-card-full-x-quarter remote-details-card"
            onClick={onClick}
        >
            {content}
        </div>
    );
}
