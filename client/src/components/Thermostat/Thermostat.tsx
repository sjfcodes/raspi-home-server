import ThermostatInfo from './Thermostat.Info/Thermostat.Info';
import { Zone } from '../../../../types/main';
import HeaterOverride from './HeaterOverride/HeaterOverride';
import ThermostatTemperatureButtons from './Thermostat.TemperatureButtons/Thermostat.TemperatureButtons';
import './thermostat.css';

type Props = { zone: Zone };
export default function Thermostat({ zone }: Props) {
    if (!zone) return null;
    return (
        <div className="thermostat">
            <ThermostatInfo zone={zone} />
            <ThermostatTemperatureButtons zone={zone} />
            <HeaterOverride zone={zone} />
        </div>
    );
}
