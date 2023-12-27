import { DigitalOutput } from "raspi-gpio";
import { Server, Socket } from "socket.io";
import { CHANNEL, HEATER_GPIO_DEFAULT_STATE, HEATER_OVERRIDE } from "../../../constant/constant";
import { HeaterGpioState, HeaterManualOverride } from "../../../types/main";
import { emitStateUpdate } from "../websocket/emit";

export const heaterGpio = new DigitalOutput("GPIO4");
export let heaterGpioState = HEATER_GPIO_DEFAULT_STATE;

export const setHeaterGpioOff = (io?: Server, socket?: Socket) => {
    if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.ON) {
        setHeaterGpioOn(io, socket)
        return;
    }

    heaterGpio.write(0);
    heaterGpioState.isOn = false;
    emitStateUpdate(CHANNEL.HEATER_GPIO_0, heaterGpioState, io, socket);
};

export const setHeaterGpioOn = (io?: Server, socket?: Socket) => {
    if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.OFF) {
        setHeaterGpioOff(io, socket)
        return;
    }

    heaterGpio.write(1);
    heaterGpioState.isOn = true;
    emitStateUpdate(CHANNEL.HEATER_GPIO_0, heaterGpioState, io, socket);
};

let timeout: NodeJS.Timeout;
export const setHeaterManualOverride = (override: HeaterManualOverride | null, io?: Server, socket?: Socket) => {
    if (override?.expireAt) {
        const ms = new Date(override?.expireAt).getTime();
        const remaining = ms - Date.now()
        // if new override has expired, do not set
        if (remaining < 0) {
            return;
        }

        if (override.status === HEATER_OVERRIDE.OFF) {
            setHeaterGpioOff(io, socket)
        } else if (override.status === HEATER_OVERRIDE.ON) {
            setHeaterGpioOn(io, socket)
        }

        // if override has not expired
        // clear previous override
        clearTimeout(timeout)
        // set new override
        timeout = setTimeout(() => {
            // when override expires, clear override & emit update
            heaterGpioState.manualOverride = null;
            emitStateUpdate(CHANNEL.HEATER_GPIO_0, heaterGpioState, io, socket, true)
        }, remaining)
    }


    // apply to global state
    heaterGpioState.manualOverride = override;
    emitStateUpdate(CHANNEL.HEATER_GPIO_0, heaterGpioState, io, socket)
}

// user updates pin state
export const setHeaterGpioState = (newState: HeaterGpioState, io?: Server, socket?: Socket) => {
    if (newState === undefined) {
        console.error(new Error('newState must be defined'))
        return;
    }

    heaterGpioState = newState;

    if (newState.manualOverride) {
        setHeaterManualOverride(newState.manualOverride, io, socket)
    } else {
        emitStateUpdate(CHANNEL.HEATER_GPIO_0, heaterGpioState, io, socket)
    }
};