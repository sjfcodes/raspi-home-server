import { useAtom } from 'jotai';
import { thermometerMapAtom } from '../../store/thermometerMap.atom';
import OldCard from '../Old.Card';
import Snippet from '../Snippet/Snippet';

export default function ThermometerState() {
    const [state] = useAtom(thermometerMapAtom);

    return (
        <OldCard
            label={`Thermometer State`}
            content={
                <div style={{ width: '100%', overflow: 'scroll' }}>
                    <Snippet text={JSON.stringify(state, null, 2)} />
                </div>
            }
        />
    );
}
