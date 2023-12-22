import { useEffect, useState } from "react";
import { CHANNEL_LED_PIN_STATE, DEFAULT_LED_PIN_STATE } from "./utils/constant";
import { socket } from "./utils/socket";


export default function PowerButton() {
    const [ledState, setLedState] = useState(DEFAULT_LED_PIN_STATE)

    useEffect(() => {
        socket.on(CHANNEL_LED_PIN_STATE, setLedState);
    }, [])

    const onClick = () => {
        setLedState((curr) => {
            const newState = { ...curr, isOn: !curr.isOn }
            console.log('socket.on.' + CHANNEL_LED_PIN_STATE, newState)
            socket.emit(CHANNEL_LED_PIN_STATE, newState)

            return newState
        })
    }

    return (
        <button className={`background-${ledState.isOn ? 'on' : 'off'}`} onClick={onClick}>
            led is {ledState.isOn ? 'on' : 'off'}
        </button>
    )
}