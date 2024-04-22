import { useState } from 'react';
import { Zone } from '../../../../../types/main';
import { useAtom } from 'jotai';
import { thermometerMapAtom } from '../../../store/thermometerMap.atom';
import { thermostatMapAtom } from '../../../store/thermostatMap.atom';
import { heaterMapAtom } from '../../../store/heaterMap.atom';
import ThermostatInfoCover from './Thermostat.Info.Cover/Thermostat.Info.Cover';
import ThermostatInfoDetails from './Thermostat.Info.Details/Thermostat.Info.Details';
import './thermostat.info.css';

type Props = { zone: Zone };
export default function ThermostatInfo({ zone }: Props) {
    const [thermometerMap] = useAtom(thermometerMapAtom);
    const [thermostatMap] = useAtom(thermostatMapAtom);
    const [heaterMap] = useAtom(heaterMapAtom);

    const [showCover, setShowCover] = useState(true);

    if (!zone) return null;
    const thermometer = thermometerMap?.[zone.thermometerId];
    const thermostat = thermostatMap?.[zone.thermostatId];
    const heater = heaterMap?.[zone.heaterId];

    return (
        <div
            className="item-card-100-x-100 thermostat-info"
            onClick={(e) => {
                e.stopPropagation();
                setShowCover((curr) => !curr);
            }}
        >
            {showCover ? (
                <ThermostatInfoCover
                    tempF={thermometer?.tempF}
                    thermostat={thermostat}
                    heaterPinVal={heater?.heaterPinVal}
                />
            ) : (
                <ThermostatInfoDetails
                    thermostat={thermostat}
                    thermometer={thermometer}
                    heater={heater}
                />
            )}
        </div>
    );
}
