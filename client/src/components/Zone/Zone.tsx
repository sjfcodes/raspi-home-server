import { Zone as TZone } from '../../../../types/main';
import Remote from '../Remote/Remote';
import './zone.css';

type Props = { zone: TZone };
export default function Zone({ zone }: Props) {
    return (
        <div className="zone">
            <Remote zone={zone} />
        </div>
    );
}
