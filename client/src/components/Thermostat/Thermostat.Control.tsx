import { CSSProperties, ReactNode } from 'react';
import './thermostat.control.css';

type Props = {
    style?: CSSProperties;
    children: ReactNode;
    onClick?: () => void;
    className: string;
};
export default function ThermostatControl({
    className = '',
    children,
    onClick = () => null,
}: Props) {
    const classNames = ['thermostat-control', className];
    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            {children}
        </div>
    );
}
