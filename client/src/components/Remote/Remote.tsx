import { RefObject, useRef } from 'react';
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

type Props = {
    remoteId: string;
    heaterId: string;
};
export default function Remote({ remoteId, heaterId }: Props) {
    const [remoteMap] = useAtom(remoteMapAtom);
    const [heaterMap] = useAtom(heaterMapAtom);

    const heater = heaterMap?.[heaterId];
    if (!heater) return null;

    const remote = remoteMap?.[remoteId];
    if (!remote) return null;

    const isTempAvailable = typeof remote?.min === 'number';
    const displayTemp = isTempAvailable ? remote.max?.toString() : '-';

    return (
        <div className="remote">
            <RemoteInfo
                className="remote-card-full"
                cover={
                    <div style={{ textAlign: 'center' }}>
                        <b>{displayTemp}</b>
                        <br />
                        <b>{remote.id}</b>
                    </div>
                }
            >
                <Snippet text={JSON.stringify({ heater, remote }, null, 2)} />
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
