import { ReactNode } from 'react';

type Props = {
    className?: string;
    children: ReactNode;
    onClick: (e: any) => void;
};
export default function RemoteCard({
    className = '',
    onClick,
    children,
}: Props) {
    const classNames = ['remote-card', className];
    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            {children}
        </div>
    );
}
