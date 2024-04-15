import {
    REMOTE_HOME_DEFAULT_STATE,
    REMOTE_OFFICE_DEFAULT_STATE,
} from '../../../../../constant/constant';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager: SseManager<ItemMap> = new SseManager({
    [REMOTE_HOME_DEFAULT_STATE.id]: REMOTE_HOME_DEFAULT_STATE,
    [REMOTE_OFFICE_DEFAULT_STATE.id]: REMOTE_OFFICE_DEFAULT_STATE,
});

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
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
    const target = state[item.id];

    // only set if not duplicate update
    if (target && (target.max !== item.max || target.min !== item.min)) {
        item.updatedAt = getDate();
        sseManager.setState(item.id, item);
    }
}
