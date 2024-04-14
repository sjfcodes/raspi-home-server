import { REMOTE_HOME_DEFAULT_STATE, REMOTE_OFFICE_DEFAULT_STATE } from '../../../../../constant/constant';
import { logger } from '../../../config/logger';
import { SseManager } from '../sse';
import { Item } from './model';

export const sseManager = new SseManager({
    [REMOTE_HOME_DEFAULT_STATE.id]: REMOTE_HOME_DEFAULT_STATE,
    [REMOTE_OFFICE_DEFAULT_STATE.id]: REMOTE_OFFICE_DEFAULT_STATE,
} as Record<string, Item>);

export function readAll(): Record<string, Item> {
    return sseManager.getState() as Record<string, Item>;
}

export function writeOne(item: Item): void {
    if (item === undefined) {
        throw new Error('item must be defined');
    }

    // if either is not number
    if (typeof item?.max !== 'number' || typeof item?.min !== 'number') {
        throw new Error(`unexpected state: ${JSON.stringify(item)}`);
    }

    // if out of range
    if (item.max < item.min) {
        throw new Error('max must be >= min');
    }

    const state = sseManager.getState();
    // only set if not duplicate update
    if (state[item.id]?.max !== item.max || state[item.id]?.min !== item.min) {
        sseManager.setState(item.id, item);
    }
}
