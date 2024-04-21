import { useAtom } from 'jotai';
import OldCard from '../Old.Card';
import Snippet from '../Snippet/Snippet';
import { thermostatMapAtom } from '../../store/thermostatMap.atom';

export default function ThermostatMap() {
    const [thermostatState] = useAtom(thermostatMapAtom);

    return (
        <OldCard
            label={`Thermostat State`}
            content={
                <div style={{ width: '100%', overflow: 'scroll' }}>
                    <Snippet text={JSON.stringify(thermostatState, null, 2)} />
                </div>
            }
        />
    );
}
