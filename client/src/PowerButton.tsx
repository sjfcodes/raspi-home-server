import useGpioHeaterPinState from "./hooks/useGpioHeaterPinState";


export default function PowerButton() {
    const { gpioHeater, togglePin } = useGpioHeaterPinState();

    return (
        <>
            <div>
                <h2>GPIO Heater Status</h2>
                <textarea style={{ width: '300px' }} rows={3} value={JSON.stringify(gpioHeater, null, 4)} onChange={() => null} />
            </div>
            <button className={`background-${gpioHeater?.isOn ? 'on' : 'off'}`} onClick={() => togglePin()}>
                toggle {gpioHeater?.isOn ? 'off' : 'on'}
            </button>
        </>
    )
}