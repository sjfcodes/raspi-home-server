import { THERMOSTAT } from '../../../../../constant/constant';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}
/**
 * [NOTE]
 *      To slow thermostats form hasty temperature swings,
 *      track temperatures for last minute and calculate
 *      average to set as the current temperatuer.
 */
const historyCache = {} as Record<string, number[]>;
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
    let cache = historyCache[item.chipId] || [];
    if (cache.length < maxLen) cache.unshift(temp);
    else cache = [temp, ...cache.slice(0, maxLen - 1)];

    const tempAverage =
        cache.reduce((acc, curr) => acc + curr, 0) / cache.length;

    const thermostat: Item = {
        chipId: item.chipId,
        // @ts-ignore
        chipName: THERMOSTAT[item.chipId] || item.chipName,
        tempF: Math.trunc(tempAverage),
        calibrate: item.calibrate || 0,
        updatedAt: new Date().toLocaleTimeString(),
    };

    sseManager.setState(item.chipId, thermostat);
}
