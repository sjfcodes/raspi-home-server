import { useAtom } from 'jotai';
import { thermostatMapAtom } from '../../store/thermostatMap.atom';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';

export default function ThermostatState() {
    const [state] = useAtom(thermostatMapAtom);

    return (
        <Card
            label={`Thermostat State`}
            content={
                <div style={{ width: '100%', overflow: 'scroll' }}>
                    <Snippet text={JSON.stringify(state, null, 2)} />
                </div>
            }
        />
    );
}
