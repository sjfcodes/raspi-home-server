import { useAtom } from 'jotai';
import OldCard from '../Old.Card';
import Snippet from '../Snippet/Snippet';
import { heaterMapAtom } from '../../store/heaterMap.atom';

export default function HeaterMap() {
    const [heaterMap] = useAtom(heaterMapAtom);
    console.log({ heaterMap });
    return (
        <OldCard
            label={`Heater State`}
            content={
                <div style={{ width: '100%', overflow: 'scroll' }}>
                    <Snippet text={JSON.stringify(heaterMap, null, 2)} />
                </div>
            }
        />
    );
}
