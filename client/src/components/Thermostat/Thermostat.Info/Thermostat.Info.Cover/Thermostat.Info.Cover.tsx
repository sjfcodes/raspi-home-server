import { HeaterPinVal, Thermostat } from '../../../../../../types/main';
import './thermostat.info.cover.css';

type ThermostatCoverProp = {
    tempF?: number;
    thermostat?: Thermostat;
    heaterPinVal?: HeaterPinVal;
};
export default function ThermostatInfoCover({
    tempF,
    thermostat,
    heaterPinVal,
}: ThermostatCoverProp) {
    let heaterStatus = 'offline';
    if (heaterPinVal === 0) heaterStatus = 'off';
    if (heaterPinVal === 1) heaterStatus = 'on';

    return (
        <div className="thermostat-info-cover-wrapper">
            <div className="item-card-100-x-50 thermostat-info-cover">
                <div className="text-xlarge">
                    <div>
                        <b>{thermostat?.thermostatId || '-'}</b>
                    </div>
                    <b> is {tempF || '-'}°F</b>
                </div>
                <hr />
                <div className="cover-details text-normal">
                    <div>Target temperature is {thermostat?.max || '-'}°F</div>
                    <div>and heater is {heaterStatus}.</div>
                </div>
            </div>
        </div>
    );
}
