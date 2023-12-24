import { DigitalOutput } from "raspi-gpio";
import { Server } from "socket.io";
import { CHANNEL, HEATER_GPIO_DEFAULT_STATE } from "../../../constant/constant";
import { HeaterGpioState } from "../../../types/main";

export const heaterGpio = new DigitalOutput("GPIO4");
export let heaterGpioState = HEATER_GPIO_DEFAULT_STATE;

export const heaterGpioOff = () => {
    heaterGpio.write(0);
};

export const heaterGpioOn = () => {
    heaterGpio.write(1);
};

// user updates pin state
export const setHeaterGpioState = (newState: HeaterGpioState, io: Server) => {
    if (newState === undefined) {
        console.error(new Error('newState must be defined'))
        return;
    }

    (newState.isOn ? heaterGpioOn : heaterGpioOff)();
    heaterGpioState = newState;
    // send new state to all users (including sender)
    io.emit(CHANNEL.HEATER_GPIO_0, heaterGpioState);
    console.log("EMIT: ", CHANNEL.HEATER_GPIO_0, JSON.stringify(heaterGpioState));
};