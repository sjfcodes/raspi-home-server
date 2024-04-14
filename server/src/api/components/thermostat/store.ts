import { THERMOSTAT } from '../../../../../constant/constant';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function writeOne(item: Item): Item | void {
    if (item === undefined) {
        console.error(new Error('item must be defined'));
        return;
    }

    if (!item.chipId) {
        console.error(new Error('item.chipId must be defined'));
        return;
    }

    const state = sseManager.getState() as ItemMap;
    const maxLen = 60;
    const temp = Math.trunc(item.tempF);
    let tempFHistory = state[item.chipId]?.tempFHistory || [];
    if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
    else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

    const tempAverage =
        tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

    const thermostat: Item = {
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
