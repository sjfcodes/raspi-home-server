import { useAtom } from 'jotai';
import { Zone } from '../../../../../types/main';
import { heaterMapAtom } from '../../../store/heaterMap.atom';
import RemoteControl from '../Remote.Control';
import { remoteControlDown, remoteControlUp } from '../../../store/remoteMap.atom';
import './remote.temperatureButtons.css'

type Props = { zone: Zone };
export default function RemoteTemperatureButtons({ zone }: Props) {
    const [heaterMap] = useAtom(heaterMapAtom);
    const heater = heaterMap?.[zone.heaterId];
    if (!heater) return null;

    return (
        <div className="remote-card-full-x-quarter remote-temperature-buttons">
            <RemoteControl
                className="remote-control-cooler remote-card-half-x-quarter"
                onClick={() => remoteControlDown(zone.remoteId)}
            >
                cooler
            </RemoteControl>
            <RemoteControl
                className="remote-control-warmer remote-card-half-x-quarter"
                onClick={() => remoteControlUp(zone.remoteId)}
            >
                warmer
            </RemoteControl>
        </div>
    );
}
