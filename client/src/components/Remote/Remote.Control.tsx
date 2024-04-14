import { CSSProperties, ReactNode } from 'react';
import RemoteCard from './Remote.Card';
import './remote.control.css';

type Props = {
    style?: CSSProperties;
    children: ReactNode;
    onClick: () => void;
    className: string;
};
export default function RemoteControl({
    className = '',
    children,
    onClick,
}: Props) {
    const classNames = ['remote-control', className];
    return (
        <RemoteCard className={classNames.join(' ')} onClick={onClick}>
            {children}
        </RemoteCard>
    );
}
