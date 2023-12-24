import useHeaterGpioState from "./hooks/useHeaterGpioState";


export default function PowerButton() {
    const { heaterGpio, togglePin } = useHeaterGpioState();

    return (
        <>
            <div>
                <h2>GPIO Heater Status</h2>
                <textarea style={{ width: '300px' }} rows={3} value={JSON.stringify(heaterGpio, null, 4)} onChange={() => null} />
            </div>
            <button className={`background-${heaterGpio?.isOn ? 'on' : 'off'}`} onClick={() => togglePin()}>
                toggle {heaterGpio?.isOn ? 'off' : 'on'}
            </button>
        </>
    )
}