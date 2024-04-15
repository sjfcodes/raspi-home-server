import { ITEM_TYPE, THERMOSTAT_ID } from '../../../config/globals';
import { writeThermostatLog } from '../../../services/pi';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function readOne(id: string): Item | undefined {
    const items = readAll();
    return items[id];
}

/**
 * [NOTE]
 *      To slow thermostats form quick temperature swings,
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

    const maxCacheLength = 60;
    const temp = Math.trunc(item.tempF);
    let cache = historyCache[item.chipId] || [];
    if (cache.length < maxCacheLength) cache.unshift(temp);
    else cache = [temp, ...cache.slice(0, maxCacheLength - 1)];

    const averageTemperature = Math.trunc(
        cache.reduce((acc, curr) => acc + curr, 0) / cache.length
    );

    const thermostat: Item = {
        ...item,
        tempF: averageTemperature,
        updatedAt: getDate(),
        itemType: ITEM_TYPE.THERMOSTAT,
    };

    sseManager.setState(item.chipId, thermostat);

    if (item.chipId === THERMOSTAT_ID.HOME) {
        writeThermostatLog(thermostat);
    }
}
