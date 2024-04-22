import { useAtom } from 'jotai';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { HeaterOverrideStatus, Zone } from '../../../../../types/main';
import {
    thermostatControlSetHeaterOverride,
    thermostatMapAtom,
} from '../../../store/thermostatMap.atom';
import ThermostatControl from '../Thermostat.Control';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { formatDate } from '../../../utils/date';

const off = 'off';
const on = 'on';
const options = [15, 30, 45, 60, .1]
const { FORCE_OFF, FORCE_ON } = HEATER_OVERRIDE_STATUS;
type Props = { zone: Zone };
export default function HeaterOverride({ zone }: Props) {
    const thermostatId = zone.thermostatId;
    const heaterId = zone.heaterId;

    const [thermostatMap] = useAtom(thermostatMapAtom);
    const thermostat = thermostatMap[thermostatId];
    const [selectedStatus, setSelectedStatus] = useState(off);
    const [expireInMinutes, setExpireInMinutes] = useState(options[0]);

    useEffect(() => {
        if (!thermostat) return;
        const status = thermostat.heaterOverride?.status;
        if (status === FORCE_OFF) setSelectedStatus(off);
        if (status === FORCE_ON) setSelectedStatus(on);
    }, [thermostat?.heaterOverride?.status]);

    if (!heaterId || !thermostat) return null;

    function setHeaterOverride() {
        const expireAtMilliseconds = Date.now() + expireInMinutes * 60 * 1000;
        const expireAt = new Date(expireAtMilliseconds).toISOString();
        const status = selectedStatus === off ? FORCE_OFF : FORCE_ON;
        const heaterOverride: HeaterOverrideStatus = { expireAt, status };
        thermostatControlSetHeaterOverride(thermostatId, heaterOverride);
    }

    function clearHeaterOverride() {
        thermostatControlSetHeaterOverride(thermostatId, {} as HeaterOverrideStatus);
    }

    const onSelectStatus: ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.stopPropagation();
        setSelectedStatus(e.target.value);
    };

    const onChangeExpireAt: ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.stopPropagation();
        setExpireInMinutes(Number(e.target.value));
    };

    const whenCleared = (
        <>
            <div className="configure-override">
                Turn
                <select className="text-medium" onChange={onSelectStatus} value={selectedStatus}>
                    <option value={off}>off</option>
                    <option value={on}>on</option>
                </select>
                for
                <select className="text-medium" onChange={onChangeExpireAt} value={expireInMinutes}>
                    {options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                minute{expireInMinutes > 1 ? 's' : ''}
            </div>
            <button id="set-override" onClick={setHeaterOverride}>
                start
            </button>
        </>
    );

    const whenActive = thermostat.heaterOverride?.expireAt ? (
        <>
            <div>
                Heater {selectedStatus} until{' '}
                {formatDate(thermostat.heaterOverride?.expireAt as string)}{' '}
                (<DateCountDown endAtDate={thermostat.heaterOverride.expireAt} />)
            </div>
            <button id="set-override" onClick={clearHeaterOverride}>
                stop
            </button>
        </>
    ) : null;

    return (
        <ThermostatControl className="thermostat-control-heater-override item-card-100-x-33 text-normal">
            {thermostat.heaterOverride?.expireAt ? whenActive : whenCleared}
        </ThermostatControl>
    );
}

type _Props = { className?: string; endAtDate: string };
function DateCountDown({ className = '', endAtDate }: _Props) {
    const [endTimeMill, setEndTimeMill] = useState(
        new Date(endAtDate).getTime() - Date.now() + 1000
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (endTimeMill <= 1000) {
                clearTimeout(timeout);
                return;
            }
            setEndTimeMill(new Date(endAtDate).getTime() - Date.now());
        }, 900);

        return () =>    clearTimeout(timeout);
    }, [endTimeMill]);

    const [,mm,last] = new Date(endTimeMill).toLocaleTimeString().split(':');
    const [ss] = last.split(' ')

    return (
        <span className={className}>
            {`${mm}:${ss}`}
        </span>
    );
}
