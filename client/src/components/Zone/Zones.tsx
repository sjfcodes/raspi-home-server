import { useAtom } from 'jotai';
import Zone from './Zone';
import { zoneMapAtom } from '../../store/zoneMap.atom';

export default function Zones() {
    const [zoneMap] = useAtom(zoneMapAtom);
    if (!zoneMap) return null;
    const zones = Object.values(zoneMap);

    return zones.map((zone) => zone && <Zone key={zone?.zoneId} zone={zone} />);
}
