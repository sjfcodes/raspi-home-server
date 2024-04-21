import { useAtom } from 'jotai';
import OldCard from '../Old.Card';
import Snippet from '../Snippet/Snippet';
import { systemInformationAtom } from '../../store/systemInformation.atom';

export default function SystemInfo() {
    const [piTemp] = useAtom(systemInformationAtom);

    return (
        <OldCard
            label={`Pi System Info`}
            content={<Snippet text={JSON.stringify(piTemp, null, 2)} />}
        />
    );
}
