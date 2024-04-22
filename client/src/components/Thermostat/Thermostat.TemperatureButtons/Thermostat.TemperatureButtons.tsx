import { useAtom } from 'jotai';
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

    return (
        <div className="item-card-100-x-25 thermostat-temperature-buttons">
            <ThermostatControl
                className="item-card-50-x-25 thermostat-control-cooler"
                onClick={() => thermostatControlDown(zone.thermostatId)}
            >
                cooler
            </ThermostatControl>
            <ThermostatControl
                className="item-card-50-x-25 thermostat-control-warmer"
                onClick={() => thermostatControlUp(zone.thermostatId)}
            >
                warmer
            </ThermostatControl>
        </div>
    );
}
