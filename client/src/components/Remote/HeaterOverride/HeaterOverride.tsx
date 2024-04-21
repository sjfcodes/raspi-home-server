import { useAtom } from 'jotai';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { HeaterOverrideStatus } from '../../../../../types/main';
import {
    remoteControlSetHeaterOverride,
    remoteMapAtom,
} from '../../../store/remoteMap.atom';
import RemoteControl from '../Remote.Control';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { formatDate } from '../../../utils/date';

const off = 'off';
const on = 'on';
const { FORCE_OFF, FORCE_ON } = HEATER_OVERRIDE_STATUS;
type Props = { remoteId: string };
export default function HeaterOverride({ remoteId }: Props) {
    const [remoteMap] = useAtom(remoteMapAtom);
    const remote = remoteMap[remoteId];
    const [selectedStatus, setSelectedStatus] = useState(off);
    const [expireInMinutes, setExpireInMinutes] = useState(10);

    useEffect(() => {
        if (!remote) return;
        const status = remote.heaterOverride?.status;
        if (status === FORCE_OFF) setSelectedStatus(off);
        if (status === FORCE_ON) setSelectedStatus(on);
    }, [remote?.heaterOverride?.status]);

    if (!remote) return null;

    function setHeaterOverride() {
        const expireAtMilliseconds = Date.now() + expireInMinutes * 60 * 1000;
        const expireAt = new Date(expireAtMilliseconds).toISOString();
        const status = selectedStatus === off ? FORCE_OFF : FORCE_ON;
        const heaterOverride: HeaterOverrideStatus = { expireAt, status };
        remoteControlSetHeaterOverride(remoteId, heaterOverride);
    }

    function clearHeaterOverride() {
        remoteControlSetHeaterOverride(remoteId, {} as HeaterOverrideStatus);
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
                <select onChange={onSelectStatus} value={selectedStatus}>
                    <option value={off}>off</option>
                    <option value={on}>on</option>
                </select>
                for
                <select onChange={onChangeExpireAt} value={expireInMinutes}>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                    <option value={60}>60</option>
                    <option value={0.1}>.1</option>
                </select>
                minute{expireInMinutes > 1 ? 's' : ''}
            </div>
            <button id="set-override" onClick={setHeaterOverride}>
                apply
            </button>
        </>
    );

    const whenActive = (
        <>
            <div>
                Heater is {selectedStatus} until{' '}
                {formatDate(remote.heaterOverride?.expireAt as string)}
            </div>
            <button id="set-override" onClick={clearHeaterOverride}>
                clear
            </button>
        </>
    );

    return (
        <RemoteControl className="remote-control-heater-override remote-card-full-x-half">
            {remote.heaterOverride?.expireAt ? whenActive : whenCleared}
        </RemoteControl>
    );
}
