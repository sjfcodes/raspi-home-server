import useHeaterGpioState from "../hooks/useHeaterGpioState";
import Card from "./Card";

export default function GpioHeaterState() {
    const { heaterGpio } = useHeaterGpioState();
    return (
        <Card label={`GPIO Heater State: ${heaterGpio.isOn ? 'on' : 'off'}`} content={<textarea
            rows={7}
            value={JSON.stringify(heaterGpio, null, 4)}
            onChange={() => null}
        />} />

    );
}
