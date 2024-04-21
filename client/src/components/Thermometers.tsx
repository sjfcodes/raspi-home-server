import { useAtom } from 'jotai';
import Block from './Block';
import Thermometer from './Thermometer';
import { thermometerMapAtom } from '../store/thermometerMap.atom';

export default function ThermometerMap() {
    const [thermometerMap] = useAtom(thermometerMapAtom);

    const sorted = Object.values(thermometerMap).sort((a, b) => 
        a.chipName > b.chipName ? 1 : -1
    );

    return sorted.map((thermometer) =>
        thermometer ? (
            <div key={thermometer.chipId}>
                <Thermometer
                    key={thermometer.chipId}
                    thermometer={thermometer}
                />
                <Block />
            </div>
        ) : null
    );
}
