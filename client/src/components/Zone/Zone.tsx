import { Zone as TZone } from '../../../../types/main';
import Remote from '../Remote/Remote';

type Props = { zone: TZone };
export default function Zone({ zone }: Props) {
    return (
        <Remote
            remoteId={zone.remoteId}
            heaterId={zone.heaterId}
            thermostatId={zone.thermostatId}
        />
    );
}
