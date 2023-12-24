import { useEffect, useState } from "react";
import { CHANNEL, HEATER_GPIO_DEFAULT_STATE } from "../../../constant/constant";
import { HeaterGpioState } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useHeaterGpioState() {
    const [heaterGpio, setHeaterGpio] = useState(HEATER_GPIO_DEFAULT_STATE)

    useEffect(() => {
        socket.on(CHANNEL.HEATER_GPIO_0, (newState: HeaterGpioState) => {
            console.log('in :', newState)
            setHeaterGpio(newState);
        });
    }, [])

    const togglePin = (forceOn = false) => {
        setHeaterGpio((curr) => {
            const newState: HeaterGpioState = { ...curr, isOn: forceOn || !curr?.isOn }
            console.log('out:', newState)
            socket.emit(CHANNEL.HEATER_GPIO_0, newState)
            return newState
        })
    }

    return { heaterGpio, togglePin }
}