import { PRIMARY_THERMOSTAT } from "../../../../constant/constant";
import { log } from "../../utils/general";
import { writeLog } from "../logs/logger";
import { roomTempState } from "../room/temperature";
import { heaterState, turnHeaterOff, turnHeaterOn } from "./heater";
import { clientMapState } from "./thermostat";

const checkHeaterStatus = (forceOn = false) => {
    const curTemp =
        clientMapState?.[PRIMARY_THERMOSTAT]?.tempF +
        clientMapState?.[PRIMARY_THERMOSTAT]?.calibrate;
    writeLog(`current temp is ${curTemp}`);

    // if heater off & current temp below min
    const shouldTurnOn =
        heaterState.heaterPinVal === 0 && curTemp < roomTempState.min;
    // if heater on & current temp above max
    const shouldTurnOff =
        heaterState.heaterPinVal === 1 && curTemp > roomTempState.max;

    log("homeCron", "status", { forceOn, shouldTurnOn, shouldTurnOff });
    if (forceOn || shouldTurnOn) {
        turnHeaterOn();
    } else if (shouldTurnOff) {
        turnHeaterOff();
    }
};

setInterval(checkHeaterStatus, 1000);

export function initHomeCron() {
    log("homeCron", "start");
}
