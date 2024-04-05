import { readFileSync } from "node:fs";
import { PiTemp } from "../../../../types/main";
import { log } from "../../utils/general";
import { server } from "../server";
import SseDataStream from "../../lib/SseDataStream";

const path = "/api/home/pi/temperature";
const stream = new SseDataStream(server, path, getPiTemp());

function getPiTemp() {
    const state = {
        tempC: 0,
        tempF: 0,
        message: "default",
        updatedAt: new Date().toLocaleTimeString(),
    } as PiTemp;

    const temp = Number(
        readFileSync("/sys/class/thermal/thermal_zone0/temp", {
            encoding: "utf8",
        })
    );

    state.message = "ok";
    state.updatedAt = new Date().toLocaleTimeString();
    if (isNaN(temp)) {
        state.message = "temp must be number";
    } else {
        const tempC = Math.trunc(temp / 1000);
        state.tempC = tempC;
        state.tempF = Math.trunc((tempC * 9) / 5 + 32);
    }

    return state;
}

export function initPiTemperature() {
    setInterval(() => stream.publish(getPiTemp()), 1000);
    log(path, "start");
}
