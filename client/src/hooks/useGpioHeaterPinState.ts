import { useEffect, useState } from "react";
import { CHANNEL, GPIO_HEATER_DEFAULT_STATE } from "../../../constant/constant";
import { GpioHeaterPinState } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useGpioHeaterPinState() {
    const [gpioHeater, setGpioHeater] = useState(GPIO_HEATER_DEFAULT_STATE)

    useEffect(() => {
        socket.on(CHANNEL.GPIO_HEATER_0, (newState: GpioHeaterPinState) => {
            console.log('in :', newState)
            setGpioHeater(newState);
        });
    }, [])

    const togglePin = (forceOn = false) => {
        setGpioHeater((curr) => {
            const newState: GpioHeaterPinState = { ...curr, isOn: forceOn || !curr?.isOn }
            console.log('out:', newState)
            socket.emit(CHANNEL.GPIO_HEATER_0, newState)
            return newState
        })
    }

    return { gpioHeater, togglePin }
}