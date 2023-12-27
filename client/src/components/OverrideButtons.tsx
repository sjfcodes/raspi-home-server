import useHeaterGpioState from "../hooks/useHeaterGpioState";
import Card from "./Card";

const restTimes = [.1, 15, 30, 60];

export default function OverrideButtons() {
    const { heaterGpio, setRestUntil } = useHeaterGpioState();

    const controlButtons =
        heaterGpio.manualOverride ? (
            <button
                className={`background-${heaterGpio?.isOn ? "on" : "off"}`}
                onClick={() => setRestUntil(null)}
            >
                cancel override
            </button>
        ) : (
            <>
                {restTimes.map((time) => (
                    <button
                        key={time}
                        className={`background-${heaterGpio?.isOn ? "on" : "off"}`}
                        onClick={() => setRestUntil(time)}
                        style={{ margin: '.5rem' }}
                    >
                        {time} {`minute${time > 1 ? 's' : ''}`}
                    </button>
                ))}
            </>
        );

    return (
        <Card label="Override (in minutes)" content={<div style={{ maxWidth: '375px', display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }} >{controlButtons}</div>} showContent={false} />
    );
}
