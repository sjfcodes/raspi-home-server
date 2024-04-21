import { HeaterPinVal, Remote } from '../../../../../../types/main';
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
            <div className="item-card-full-x-half remote-info-cover">
                <div className="text-xlarge">
                    <div>
                        <b>{remote?.remoteId || '-'}</b>
                    </div>
                    <b> is {tempF || '-'}°F</b>
                </div>
                <hr />
                <div className="cover-details text-normal">
                    <div>Target temperature is {remote?.max || '-'}°F</div>
                    <div>and heater is {heaterStatus}.</div>
                </div>
            </div>
        </div>
    );
}
