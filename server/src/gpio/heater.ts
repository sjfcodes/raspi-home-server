import { DigitalOutput } from "raspi-gpio";
import { Server, Socket } from "socket.io";
import { CHANNEL, HEATER_GPIO_DEFAULT_STATE, HEATER_OVERRIDE } from "../../../constant/constant";
import { HeaterGpioState, HeaterManualOverride } from "../../../types/main";

export const heaterGpio = new DigitalOutput("GPIO4");
export let heaterGpioState = HEATER_GPIO_DEFAULT_STATE;

export const setHeaterGpioOff = (io?: Server, socket?: Socket) => {
    if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.ON) {
        setHeaterGpioOn(io, socket)
        return;
    }

    heaterGpio.write(0);
    heaterGpioState.isOn = false;
    emitStateUpdate(io, socket);
};

export const setHeaterGpioOn = (io?: Server, socket?: Socket) => {
    if (heaterGpioState.manualOverride?.status === HEATER_OVERRIDE.OFF) {
        setHeaterGpioOff(io, socket)
        return;
    }

    heaterGpio.write(1);
    heaterGpioState.isOn = true;
    emitStateUpdate(io, socket);
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
            emitStateUpdate(io, socket, true)
        }, remaining)
    }


    // apply to global state
    heaterGpioState.manualOverride = override;
    emitStateUpdate(io, socket)
}

const emitStateUpdate = (io?: Server, socket?: Socket, includeHost = false) => {
    if (!io && !socket) {
        throw new Error('"io" or "socket" must be defined');
    } else if (socket) {
        if (includeHost) {
            socket.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
        } else {
            socket.broadcast.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
        }
    } else if (io) {
        io.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
    }
    console.log("EMIT: ", CHANNEL.HEATER_GPIO_0, JSON.stringify(heaterGpioState));
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
        emitStateUpdate(io, socket)
    }
};