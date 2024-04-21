import { CSSProperties, ReactNode } from 'react';
import ThermostatCard from './Thermostat.Card';
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
        <ThermostatCard className={classNames.join(' ')} onClick={onClick}>
            {children}
        </ThermostatCard>
    );
}
