import useSystemInfo from '../../hooks/useSystemInfo';
import Card from '../Card';
import Snippet from '../Snippet/Snippet';

export default function SystemInfo() {
    const [piTemp] = useSystemInfo();

    return (
        <Card
            label={`Pi System Info`}
            content={<Snippet text={JSON.stringify(piTemp, null, 2)} />}
        />
    );
}
