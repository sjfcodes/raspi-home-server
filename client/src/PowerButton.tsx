import useHeaterGpioState from "./hooks/useHeaterGpioState";

const restTimes = [.1, 15, 30, 60];

export default function PowerButton() {
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
            restTimes.map((time) => (
                <button
                    key={time}
                    className={`background-${heaterGpio?.isOn ? "on" : "off"}`}
                    onClick={() => setRestUntil(time)}
                    style={{ margin: '.5rem' }}
                >
                    {time} {`minute${time > 1 ? 's' : ''}`}
                </button>
            ))
        );

    return (
        <>
            <div>
                <h2>GPIO Heater Status</h2>
                <textarea
                    rows={7}
                    value={JSON.stringify(heaterGpio, null, 4)}
                    onChange={() => null}
                />
            </div>
            <h2>Set override (minutes)</h2>
            {controlButtons}
        </>
    );
}
