import { useEffect, useState } from "react";
import { CHANNEL_LED_PIN_STATE, DEFAULT_APP_STATE } from "./utils/constant";
import { socket } from "./utils/socket";


export default function PowerButton() {
    const [appState, setAppState] = useState(DEFAULT_APP_STATE)

    useEffect(() => {
        socket.on(CHANNEL_LED_PIN_STATE, (state) => {
            // console.log(state)
            setAppState(state)
        });
    }, [])

    const onClick = () => {
        setAppState((curr) => {
            const newState = { ...curr, ledPinState: { isOn: !curr.ledPinState?.isOn } }
            // console.log(newState)
            socket.emit(CHANNEL_LED_PIN_STATE, newState)

            return newState
        })
    }

    return (
        <>
            <div>
                <textarea style={{ width: '300px' }} rows={12} value={JSON.stringify(appState, null, 2)} onChange={() => null} />
            </div>
            <button className={`background-${appState?.ledPinState?.isOn ? 'on' : 'off'}`} onClick={onClick}>
                led is {appState?.ledPinState?.isOn ? 'on' : 'off'}
            </button>
        </>
    )
}