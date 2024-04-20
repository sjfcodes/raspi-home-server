import { ITEM_TYPE, THERMOSTAT_ID } from '../../../config/globals';
import { logger } from '../../../services/logger';
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
        logger.error(new Error('setThermostat: "candidate" must be defined'));
        return;
    }

    if (!candidate.chipId) {
        logger.error(new Error('setThermostat: "chipId" must be defined'));
        return;
    }

    if (typeof candidate.tempF !== 'number') {
        logger.error(new Error('setThermostat: unexpected type for: "tempF"'));
        return;
    }

    const maxCacheLength = 60;
    const temp = Math.trunc(candidate.tempF);

    // get 
    let history = historyCache[candidate.chipId] || [];

    // if history has max items, remove first item.
    if (history.length >= maxCacheLength) {
        history.shift();
    }

    // add last item
    history.push(temp);

    const averageTemperature = Math.trunc(
        history.reduce((acc, curr) => acc + curr, 0) / history.length
    );

    const nextState: Item = {
        ...candidate,
        tempF: averageTemperature,
        updatedAt: getDate(),
        itemType: ITEM_TYPE.THERMOSTAT,
    };
    
    thermostatStore.setState(nextState.chipId, nextState);
    onThermostatUpdate(nextState);
    historyCache[candidate.chipId] = history;

    if (nextState.chipId === THERMOSTAT_ID.HOME) {
        writeThermostatLog(nextState);
    }
}
