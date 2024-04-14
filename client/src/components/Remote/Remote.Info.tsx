import { ReactNode, useState } from 'react';
import './remote.info.css';
import RemoteCard from './Remote.Card';

type Props = {
    className?: string;
    cover: string | ReactNode;
    children: ReactNode;
};
export default function RemoteInfo({ className = '', cover, children }: Props) {
    const [showData, setShowData] = useState(false);
    const classNames = ['remote-info', className];

    return (
        <RemoteCard
            className={classNames.join(' ')}
            onClick={(e) => {
                e.stopPropagation();
                setShowData((curr) => !curr);
            }}
        >
            {showData ? children : cover}
        </RemoteCard>
    );
}
