import { ITEM_TYPE, THERMOSTAT_ID } from '../../../config/globals';
import { writeThermostatLog } from '../../../services/pi';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { onThermostatUpdate } from '../zone/actions';
import { Item, ItemMap } from './model';

export const thermostatStore = new SseManager({} as ItemMap);

export function getThermostats(): ItemMap {
    return thermostatStore.getState() as ItemMap;
}

export function getThermostatById(id: string): Item | undefined {
    const items = getThermostats();
    return items[id];
}

/**
 * [NOTE]
 *      To slow thermostats form quick temperature swings,
 *      track temperatures for last minute and calculate
 *      average to set as the current temperatuer.
 */
const historyCache = {} as Record<string, number[]>;
export function setThermostat(candidate: Item): Item | void {
    if (candidate === undefined) {
        console.error(new Error('candidate must be defined'));
        return;
    }

    if (!candidate.chipId) {
        console.error(new Error('candidate.chipId must be defined'));
        return;
    }

    const maxCacheLength = 60;
    const temp = Math.trunc(candidate.tempF);
    let cache = historyCache[candidate.chipId] || [];
    if (cache.length < maxCacheLength) cache.unshift(temp);
    else cache = [temp, ...cache.slice(0, maxCacheLength - 1)];

    const averageTemperature = Math.trunc(
        cache.reduce((acc, curr) => acc + curr, 0) / cache.length
    );

    const nextState: Item = {
        ...candidate,
        tempF: averageTemperature,
        updatedAt: getDate(),
        itemType: ITEM_TYPE.THERMOSTAT,
    };

    thermostatStore.setState(nextState.chipId, nextState);
    onThermostatUpdate(nextState);

    if (nextState.chipId === THERMOSTAT_ID.HOME) {
        writeThermostatLog(nextState);
    }
}
