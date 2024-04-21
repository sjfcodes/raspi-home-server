import { useState } from 'react';
import './remote.info.css';
import RemoteCard from '../Remote.Card';
import { Zone } from '../../../../../types/main';
import { useAtom } from 'jotai';
import { thermostatMapAtom } from '../../../store/thermostatMap.atom';
import { remoteMapAtom } from '../../../store/remoteMap.atom';
import { heaterMapAtom } from '../../../store/heaterMap.atom';
import RemoteInfoCover from './Remote.Info.Cover/Remote.Info.Cover';
import RemoteInfoDetails from './Remote.Info.Details/Remote.Info.Details';

type Props = { zone: Zone };
export default function RemoteInfo({ zone }: Props) {
    const [thermostatMap] = useAtom(thermostatMapAtom);
    const [remoteMap] = useAtom(remoteMapAtom);
    const [heaterMap] = useAtom(heaterMapAtom);

    const [showCover, setShowCover] = useState(!true);

    if (!zone) return null;
    const thermostat = thermostatMap?.[zone.thermostatId];
    const remote = remoteMap?.[zone.remoteId];
    const heater = heaterMap?.[zone.heaterId];

    return (
        <RemoteCard
            className="item-card-full remote-info"
            onClick={(e) => {
                e.stopPropagation();
                setShowCover((curr) => !curr);
            }}
        >
            {showCover ? (
                <RemoteInfoCover
                    tempF={thermostat?.tempF}
                    remote={remote}
                    heaterPinVal={heater?.heaterPinVal}
                />
            ) : (
                <RemoteInfoDetails remote={remote} thermostat={thermostat} />
            )}
        </RemoteCard>
    );
}
