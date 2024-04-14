import useThermostat from '../../hooks/useThermostat';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';

export default function HomeCurrentTemp({
    thermostatId,
}: {
    thermostatId: string;
}) {
    const [thermostatMap] = useThermostat();

    const thermostat = thermostatMap[thermostatId];
    if (!thermostat) return null;

    const curTemp = thermostat?.tempF + thermostat?.calibrate;

    const label = (
        <div style={{ fontSize: '1.5rem', width: '100%', textAlign: 'center' }}>
            {`${thermostat.chipName}:  ${isNaN(curTemp) ? '-' : curTemp + '℉'}`}
        </div>
    );

    return (
        <Card
            label={label}
            content={
                <>
                    <div style={{ width: '100%', overflowX: 'scroll' }}>
                        <Snippet text={JSON.stringify(thermostat, null, 2)} />
                    </div>
                </>
            }
        />
    );
}
