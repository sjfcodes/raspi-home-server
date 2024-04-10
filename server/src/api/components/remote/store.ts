import { ROOM_TEMP_DEFAULT_STATE } from '../../../../../constant/constant';
import { logger } from '../../../config/logger';
import { SseManager } from '../sse';
import { Item } from './model';

export const sseManager = new SseManager({
    [ROOM_TEMP_DEFAULT_STATE.id]: ROOM_TEMP_DEFAULT_STATE,
} as Record<string, Item>);

export function readAll(): Record<string, Item> {
    return sseManager.getState() as Record<string, Item>;
}

export function writeOne(item: Item): void {
    if (item === undefined) {
        logger.error('item must be defined');
        return;
    }

    // if either is not number
    if (typeof item.max !== 'number' || typeof item.min !== 'number') {
        logger.error(`unexpected state: ${JSON.stringify(item)}`);
        return;
    }

    // if out of range
    if (item.max < item.min) {
        logger.error('max must be >= min');
        return;
    }

    const state = sseManager.getState();
    // skip duplicate update
    if (state[item.id].max === item.max && state[item.id].min === item.min) {
        return;
    }
    sseManager.setState(item.id, item);
}
