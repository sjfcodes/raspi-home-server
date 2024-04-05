import { PRIMARY_THERMOSTAT } from "../../../../constant/constant";
import { log } from "../../utils/general";
import { writeLog } from "../logs/logger";
import { roomTemperatureStream } from "../room/temperature";
import { homeHeaterStream, turnHeaterOff, turnHeaterOn } from "./heater";
import { thermostatMapStream } from "./thermostat";

const checkHeaterStatus = (forceOn = false) => {
    const tStats = thermostatMapStream.getState();
    const heater = homeHeaterStream.getState();
    const rTemp = roomTemperatureStream.getState();

    const currTemp =
        tStats?.[PRIMARY_THERMOSTAT]?.tempF +
        tStats?.[PRIMARY_THERMOSTAT]?.calibrate;
    writeLog(`current temp is ${currTemp}`);

    // if heater off & current temp below min
    const shouldTurnOn = heater.heaterPinVal === 0 && currTemp < rTemp.min;
    // if heater on & current temp above max
    const shouldTurnOff = heater.heaterPinVal === 1 && currTemp > rTemp.max;

    if (forceOn || shouldTurnOn) {
        turnHeaterOn();
    } else if (shouldTurnOff) {
        turnHeaterOff();
    }

    log("homeCron", "status", {
        forceOn,
        currTemp,
        shouldTurnOn,
        shouldTurnOff,
    });
};

setInterval(checkHeaterStatus, 1000);

export function initHomeCron() {
    log("homeCron", "start");
}
