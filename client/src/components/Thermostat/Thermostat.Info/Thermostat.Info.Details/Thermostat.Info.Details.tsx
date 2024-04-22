import { Heater, Thermostat, Thermometer } from '../../../../../../types/main';
import './thermostat.info.details.css';
import ThermostatDetailsCard from '../../Thermostat.DetailsCard/Thermostat.DetailsCard';
import ThermometerDetailsCard from '../../../Thermometer/Thermometer.DetailsCard/Thermometer.DetailsCard';
import HeaterDetailsCard from '../../../Heater/Heater.DetailsCard/Heater.DetailsCard';

type Props = {
    thermostat: Thermostat | undefined;
    thermometer: Thermometer | undefined;
    heater: Heater | undefined;
};
export default function ThermostatInfoDetails({
    thermostat,
    thermometer,
    heater,
}: Props) {
    return (
        <div className="thermostat-info-details">
            <ThermostatDetailsCard thermostat={thermostat} />
            <ThermometerDetailsCard thermometer={thermometer} />
            <HeaterDetailsCard heater={heater} />
        </div>
    );
}
