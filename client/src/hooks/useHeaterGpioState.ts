import { useEffect, useState } from "react";
import { CHANNEL, HEATER_GPIO_DEFAULT_STATE, HEATER_OVERRIDE } from "../../../constant/constant";
import { HeaterGpioState, HeaterManualOverride } from "../../../types/main";
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

    const setRestUntil = (mins: number | null) => {
        let manualOverride: HeaterManualOverride | null = null;
        if (typeof mins === 'number' && mins > 0) {

            manualOverride = {
                status: HEATER_OVERRIDE.OFF,
                expireAt: new Date(((60 * mins) * 1000) + Date.now()).toISOString()
            }
        }

        setHeaterGpio((curr) => {
            const newState: HeaterGpioState = { ...curr, manualOverride }
            console.log('out:', newState)
            socket.emit(CHANNEL.HEATER_GPIO_0, newState)
            return newState
        })
    }

    return { heaterGpio, togglePin, setRestUntil }
}