import { TbTemperatureMinus } from 'react-icons/tb';
import { GiComputerFan } from 'react-icons/gi';
import { RiTimer2Line } from 'react-icons/ri';
import { Heater, Thermostat, Thermometer } from '../../../../../../types/main';
import ZoneComponentCard from '../../../ZoneComponentCard/ZoneComponentCard';
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
            <ZoneComponentCard
                initialCardSize='item-card-100-x-25'
                toggledCardSize='item-card-100-x-100'
                ShowOnToggle={<ThermostatDetailsCard thermostat={thermostat} />}
                componentName="thermostat"
                Icon={RiTimer2Line}
            />
            <ZoneComponentCard
                initialCardSize='item-card-100-x-25'
                toggledCardSize='item-card-100-x-100'
                ShowOnToggle={<ThermometerDetailsCard thermometer={thermometer} />}
                componentName="thermometer"
                Icon={TbTemperatureMinus}
            />
            <ZoneComponentCard
                initialCardSize='item-card-100-x-25'
                toggledCardSize='item-card-100-x-100'
                ShowOnToggle={<HeaterDetailsCard heater={heater} />}
                componentName="heater"
                Icon={GiComputerFan}
            />
        </div>
    );
}
