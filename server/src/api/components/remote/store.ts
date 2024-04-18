import { ITEM_TYPE, REMOTE_ID, ZONE_ID } from '../../../config/globals';
import { getDate } from '../../../services/utility';
import { SseManager } from '../sse';
import { onRemoteUpdate } from '../zone/actions';
import { Item, ItemMap } from './model';

export const remoteStore = new SseManager({
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

export function getRemotes(): ItemMap {
    return remoteStore.getState();
}

export function getRemoteById(id: string): Item | undefined {
    const items = getRemotes();
    return items[id];
}

export function setRemote(candidate: Item): void {
    if (candidate === undefined) {
        throw new Error('candidate must be defined');
    }

    // if either is not number
    if (
        typeof candidate?.max !== 'number' ||
        typeof candidate?.min !== 'number'
    ) {
        throw new Error(`unexpected state: ${JSON.stringify(candidate)}`);
    }

    // if out of range
    if (candidate.max < candidate.min) {
        throw new Error('max must be >= min');
    }

    const prevState = remoteStore.getState()[candidate.remoteId];

    // Only update if candidate contains relevant changes
    if (
        prevState &&
        (prevState.max !== candidate.max || prevState.min !== candidate.min)
    ) {
        const nextState = {
            ...prevState,
            ...candidate,
            updatedAt: getDate(),
        };
        // candidate.itemType = ITEM_TYPE.REMOTE;
        remoteStore.setState(nextState.remoteId, nextState);
        onRemoteUpdate(nextState.zoneId);
    }
}
