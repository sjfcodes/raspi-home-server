import { HeaterPinVal, Remote } from '../../../../../types/main';
import './remote.info.cover.css';

type RemoteCoverProp = {
    tempF?: number;
    remote?: Remote;
    heaterPinVal?: HeaterPinVal;
};
export default function RemoteInfoCover({
    tempF,
    remote,
    heaterPinVal,
}: RemoteCoverProp) {
    let heaterStatus = 'offline';
    if (heaterPinVal === 0) heaterStatus = 'off';
    if (heaterPinVal === 1) heaterStatus = 'on';

    return (
        <div className="remote-info-cover-wrapper">
            <div className="item-card-half-x-half remote-info-cover">
                <div>
                    <b>{remote?.remoteId || '-'}</b>
                    <br />
                    <b>{tempF || '-'}°F</b>
                </div>
                <hr />
                <div className="cover-details">
                    <div>heater is: {heaterStatus}</div>
                    <div>target: {remote?.max || '-'}°F</div>
                </div>
            </div>
        </div>
    );
}
