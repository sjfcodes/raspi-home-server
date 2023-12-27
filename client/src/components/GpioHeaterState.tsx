import useHeaterGpioState from "../hooks/useHeaterGpioState";
import Card from "./Card";

export default function GpioHeaterState() {
    const { heaterGpio } = useHeaterGpioState();
    return (
        <Card label={`Heater is: ${heaterGpio.isOn ? 'on' : 'off'}`} showContent={false} content={<textarea
            rows={7}
            value={JSON.stringify(heaterGpio, null, 4)}
            onChange={() => null}
        />} />

    );
}
