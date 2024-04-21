import { Remote } from '../../../../../types/main';
import Snippet from '../../Snippet/Snippet';
import './remote.detailsCard.css'

type Props = { remote: Remote | undefined };
export default function RemoteDetailsCard({ remote }: Props) {
    return (
        <div className="remote-card-half-x-half remote-details-card">
            <Snippet text={JSON.stringify({ remote }, null, 2)} />
        </div>
    );
}
