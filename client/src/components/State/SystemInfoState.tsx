import { useAtom } from 'jotai';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';
import { systemInformationAtom } from '../../store/systemInformation.atom';

export default function SystemInfo() {
    const [piTemp] = useAtom(systemInformationAtom);

    return (
        <Card
            label={`Pi System Info`}
            content={<Snippet text={JSON.stringify(piTemp, null, 2)} />}
        />
    );
}
