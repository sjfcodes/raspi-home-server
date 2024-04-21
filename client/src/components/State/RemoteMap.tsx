import { useAtom } from 'jotai';
import OldCard from '../Old.Card';
import Snippet from '../Snippet/Snippet';
import { remoteMapAtom } from '../../store/remoteMap.atom';

export default function RemoteMap() {
    const [remoteState] = useAtom(remoteMapAtom);

    return (
        <OldCard
            label={`Remote State`}
            content={
                <div style={{ width: '100%', overflow: 'scroll' }}>
                    <Snippet text={JSON.stringify(remoteState, null, 2)} />
                </div>
            }
        />
    );
}
