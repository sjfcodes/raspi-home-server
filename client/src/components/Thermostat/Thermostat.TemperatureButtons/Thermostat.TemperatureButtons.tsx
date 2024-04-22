import { useAtom } from 'jotai';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Zone } from '../../../../../types/main';
import { heaterMapAtom } from '../../../store/heaterMap.atom';
import ThermostatControl from '../Thermostat.Control';
import { thermostatControlDown, thermostatControlUp } from '../../../store/thermostatMap.atom';
import './thermostat.temperatureButtons.css'

type Props = { zone: Zone };
export default function ThermostatTemperatureButtons({ zone }: Props) {
    const [heaterMap] = useAtom(heaterMapAtom);
    const heater = heaterMap?.[zone.heaterId];

    if (!heater) return null;
    const iconSize = 50;

    return (
        <div className="item-card-100-x-25 thermostat-temperature-buttons">
            <ThermostatControl
                className="item-card-50-x-25 thermostat-control-cooler text-large"
                onClick={() => thermostatControlDown(zone.thermostatId)}
            >
                <IoIosArrowDown size={iconSize} />
            </ThermostatControl>
            <ThermostatControl
                className="item-card-50-x-25 thermostat-control-warmer text-large"
                onClick={() => thermostatControlUp(zone.thermostatId)}
            >
                <IoIosArrowUp size={iconSize} />
            </ThermostatControl>
        </div>
    );
}
