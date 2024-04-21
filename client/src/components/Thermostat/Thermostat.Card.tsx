import { ReactNode } from 'react';

type Props = {
    className?: string;
    children: ReactNode;
    onClick: (e: any) => void;
};
export default function ThermostatCard({
    className = '',
    onClick,
    children,
}: Props) {
    const classNames = ['thermostat-card', className];
    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            {children}
        </div>
    );
}
