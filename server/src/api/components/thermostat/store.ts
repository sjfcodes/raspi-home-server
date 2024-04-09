import { THERMOSTAT } from "../../../../../constant/constant";
import { ThermostatMap } from "../../../../../types/main";
import { logger } from "../../../config/logger";
import { Thermostat } from "./model";

const map = {} as ThermostatMap;

export async function readAll(): Promise<ThermostatMap>{
    return map;
}

export async function writeOne(item:Thermostat): Promise<void> {
    if (item === undefined) {
        console.error(new Error('item must be defined'));
        return;
    }

    if (!item.chipId) {
        console.error(new Error('item.chipId must be defined'));
        return;
    }

    const maxLen = 60;
    const temp = Math.trunc(item.tempF);
    let tempFHistory = map[item.chipId]?.tempFHistory || [];
    if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
    else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

    const tempAverage =
        tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

    map[item.chipId] = {
        chipId: item.chipId,
        // @ts-ignore
        chipName: THERMOSTAT[item.chipId] || item.chipName,
        tempF: Math.trunc(tempAverage),
        calibrate: item.calibrate || 0,
        updatedAt: new Date().toLocaleTimeString(),
        tempFHistory,
    }
}
