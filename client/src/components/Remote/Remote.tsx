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
import { HeaterPinVal } from '../../../../types/main';

type Props = {
    remoteId: string;
    heaterId: string;
    thermostatId: string;
};
export default function Remote({ remoteId, heaterId, thermostatId }: Props) {
    const [thermostatMap] = useAtom(thermostatMapAtom);
    const [heaterMap] = useAtom(heaterMapAtom);
    const [remoteMap] = useAtom(remoteMapAtom);

    const thermostat = thermostatMap?.[thermostatId];
    const heater = heaterMap?.[heaterId];
    const remote = remoteMap?.[remoteId];

    return (
        <div className="remote">
            <RemoteInfo
                className="remote-card-full"
                cover={
                    <RemoteCover
                        tempF={thermostat?.tempF}
                        remoteId={remote?.id}
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

            <RemoteControl
                className="remote-control-cooler remote-card-half"
                onClick={() => remoteControlDown(remoteId)}
            >
                cooler
            </RemoteControl>
            <RemoteControl
                className="remote-control-warmer remote-card-half"
                onClick={() => remoteControlUp(remoteId)}
            >
                warmer
            </RemoteControl>
        </div>
    );
}

type RemoteCoverProp = {
    tempF?: number;
    remoteId?: string;
    heaterPinVal?: HeaterPinVal;
};
function RemoteCover({ tempF, remoteId, heaterPinVal }: RemoteCoverProp) {
    let heaterStatus = 'offline';
    if (heaterPinVal === 0) heaterStatus = 'off';
    if (heaterPinVal === 1) heaterStatus = 'on';

    return (
        <div style={{ textAlign: 'center' }}>
            <b>{tempF || '-'}</b>
            <br />
            <b>{remoteId || '-'}</b>
            <hr />
            <div style={{ fontSize: '1rem' }}>heater is: {heaterStatus}</div>
        </div>
    );
}
