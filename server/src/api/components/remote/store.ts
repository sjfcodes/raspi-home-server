import { ITEM_TYPE, REMOTE_ID, ZONE_ID } from '../../../config/globals';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { onRemoteUpdate } from '../zone/actions';
import { Item, ItemMap } from './model';

export const sseManager = new SseManager({
    [ZONE_ID.HOME]: {
        remoteId: REMOTE_ID.HOME,
        zoneId: ZONE_ID.HOME,
        unit: 'F',
        max: 66,
        min: 66,
        updatedAt: new Date().toISOString(),
        itemType: ITEM_TYPE.REMOTE,
    },
    [ZONE_ID.OFFICE.toString()]: {
        remoteId: REMOTE_ID.OFFICE,
        zoneId: ZONE_ID.OFFICE,
        unit: 'F',
        max: 66,
        min: 66,
        updatedAt: new Date().toISOString(),
        itemType: ITEM_TYPE.REMOTE,
    },
} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState();
}

export function readOne(id: string): Item | undefined {
    const items = readAll();
    return items[id];
}

export function writeOne(item: Item): Item | undefined {
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
    const target = state[item.remoteId];

    // only set if not duplicate update
    if (target && (target.max !== item.max || target.min !== item.min)) {
        item.updatedAt = getDate();
        item.itemType = ITEM_TYPE.REMOTE;
        sseManager.setState(item.remoteId, item);
        onRemoteUpdate(item.zoneId);
        return item;
    }
}
