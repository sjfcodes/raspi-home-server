import { useAtom } from 'jotai';
import {
    remoteMapAtom,
    remoteControlDown,
    remoteControlUp,
} from '../../store/remoteMap.atom';
import { heaterMapAtom } from '../../store/heaterMap.atom';
import RemoteControl from './Remote.Control';
import RemoteInfo from './Remote.Info';
import './remote.css';
import Snippet from '../Snippet/Snippet';
import { thermostatMapAtom } from '../../store/thermostatMap.atom';
import { HeaterPinVal, Remote as TRemote, Zone } from '../../../../types/main';
import HeaterOverride from './HeaterOverride/HeaterOverride';

type Props = { zone: Zone };
export default function Remote({ zone }: Props) {
    const [thermostatMap] = useAtom(thermostatMapAtom);
    const [heaterMap] = useAtom(heaterMapAtom);
    const [remoteMap] = useAtom(remoteMapAtom);

    if (!zone) return null;
    const thermostat = thermostatMap?.[zone.thermostatId];
    const heater = heaterMap?.[zone.heaterId];
    const remote = remoteMap?.[zone.remoteId];

    return (
        <div className="remote">
            <RemoteInfo
                className="remote-card-full"
                cover={
                    <RemoteCover
                        tempF={thermostat?.tempF}
                        remote={remote}
                        heaterPinVal={heater?.heaterPinVal}
                    />
                }
            >
                <div style={{ position: 'absolute', top: '0px' }}>
                    <Snippet
                        text={JSON.stringify(
                            { remote, thermostat, heater },
                            null,
                            2
                        )}
                    />
                </div>
            </RemoteInfo>

            {zone.heaterId && <HeaterOverride remoteId={zone.remoteId} />}

            <RemoteControl
                className="remote-control-cooler remote-card-half"
                onClick={() => remoteControlDown(zone.remoteId)}
            >
                cooler
            </RemoteControl>
            <RemoteControl
                className="remote-control-warmer remote-card-half"
                onClick={() => remoteControlUp(zone.remoteId)}
            >
                warmer
            </RemoteControl>
        </div>
    );
}

type RemoteCoverProp = {
    tempF?: number;
    remote?: TRemote;
    heaterPinVal?: HeaterPinVal;
};
function RemoteCover({ tempF, remote, heaterPinVal }: RemoteCoverProp) {
    let heaterStatus = 'offline';
    if (heaterPinVal === 0) heaterStatus = 'off';
    if (heaterPinVal === 1) heaterStatus = 'on';

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <b>{tempF || '-'}℉</b>
                <br />
                <b>{remote?.remoteId || '-'}</b>
            </div>
            <hr />
            <ul style={{ fontSize: '1rem' }}>
                <li>
                    <div>heater is: {heaterStatus}</div>
                </li>
                <li>
                    <div>target(℉): {remote?.max}</div>
                </li>
            </ul>
        </div>
    );
}
