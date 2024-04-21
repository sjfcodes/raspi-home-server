import { Heater, Thermostat, Thermometer } from '../../../../../../types/main';
import HeaterDetailsCard from '../../../Heater/Heater.DetailsCard/Heater.DetailsCard';
import ThermometerDetailsCard from '../../../Thermometer/Thermometer.DetailsCard/Thermometer.DetailsCard';
import ThermostatDetailsCard from '../../Thermostat.DetailsCard/Thermostat.DetailsCard';
import './thermostat.info.details.css';

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
            <ThermometerDetailsCard thermometer={thermometer} />
            <HeaterDetailsCard heater={heater} />
            <ThermostatDetailsCard thermostat={thermostat} />
        </div>
    );
}
