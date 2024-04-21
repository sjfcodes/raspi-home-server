import { ITEM_TYPE, THERMOMETER_ID } from '../../../config/globals';
import { logger } from '../../../services/logger';
import { writeThermometerLog } from '../../../services/pi';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { onThermometerUpdate } from '../zone/actions';
import { Item, ItemMap } from './model';

export const thermometerStore = new SseManager({} as ItemMap);

export function getThermometers(): ItemMap {
    return thermometerStore.getState() as ItemMap;
}

export function getThermometerById(id: string): Item | undefined {
    const items = getThermometers();
    return items[id];
}

/**
 * [NOTE]
 *      To slow thermometers form quick temperature swings,
 *      track temperatures for last minute and calculate
 *      average to set as the current temperatuer.
 */
const historyCache = {} as Record<string, number[]>;
export function setThermometer(candidate: Item): Item | void {
    if (candidate === undefined) {
        logger.error(new Error('setThermometer: "candidate" must be defined'));
        return;
    }

    if (!candidate.chipId) {
        logger.error(new Error('setThermometer: "chipId" must be defined'));
        return;
    }

    if (typeof candidate.tempF !== 'number') {
        logger.error(new Error('setThermometer: unexpected type for: "tempF"'));
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
        itemType: ITEM_TYPE.THERMOMETER,
    };
    
    thermometerStore.setState(nextState.chipId, nextState);
    onThermometerUpdate(nextState);
    historyCache[candidate.chipId] = history;

    if (nextState.chipId === THERMOMETER_ID.HOME) {
        writeThermometerLog(nextState);
    }
}
