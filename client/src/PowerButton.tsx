import { useEffect, useState } from "react";
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from "./utils/constant";
import { socket } from "./utils/socket";


export default function PowerButton() {
    const [pinState, setPinState] = useState(DEFAULT_LED_PIN_STATE)

    useEffect(() => {
        socket.on(CHANNEL_LED_PIN_STATE, setPinState);
    }, [])

    const onClick = () => {
        setPinState((curr) => {
            const newState = { ...curr, isOn: !curr.isOn }                  
            socket.emit(CHANNEL_LED_PIN_STATE, newState)

            return newState
        })
    }

    return (
        <>
            <h2>Temp: {pinState.tempF}</h2>
            <button className={`background-${pinState.isOn ? 'on' : 'off'}`} onClick={onClick}>
                led is {pinState.isOn ? 'on' : 'off'}
            </button>
        </>
    )
}