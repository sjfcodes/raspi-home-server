import { THERMOSTAT } from '../../../../../constant/constant';
import { ThermostatMap } from '../../../../../types/main';
import { SseManager } from '../sse';
import { Thermostat } from './model';

export const sseManager = new SseManager({} as ThermostatMap);

export function getManager() {
    return sseManager;
}

export function readAll(): ThermostatMap {
    return sseManager.getState() as ThermostatMap;
}

export function writeOne(item: Thermostat): Thermostat | void {
    if (item === undefined) {
        console.error(new Error('item must be defined'));
        return;
    }
    
    if (!item.chipId) {
        console.error(new Error('item.chipId must be defined'));
        return;
    }
    
    const state = sseManager.getState() as Record<string, Thermostat>;
    const maxLen = 60;
    const temp = Math.trunc(item.tempF);
    let tempFHistory = state[item.chipId]?.tempFHistory || [];
    if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
    else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

    const tempAverage =
        tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

    const thermostat: Thermostat = {
        chipId: item.chipId,
        // @ts-ignore
        chipName: THERMOSTAT[item.chipId] || item.chipName,
        tempF: Math.trunc(tempAverage),
        calibrate: item.calibrate || 0,
        updatedAt: new Date().toLocaleTimeString(),
        tempFHistory,
    };

    sseManager.setState(item.chipId, thermostat);
}
