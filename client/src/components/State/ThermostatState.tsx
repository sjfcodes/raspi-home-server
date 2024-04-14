import useThermostat from '../../hooks/useThermostat';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';

export default function ThermostatState() {
    const [state] = useThermostat();

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
