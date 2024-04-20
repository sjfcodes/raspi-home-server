import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { ITEM_TYPE, REMOTE_ID, ZONE_ID } from '../../../config/globals';
import { logger } from '../../../services/logger';
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

export function setRemoteById(id: string, payload: Item): void {
    if (!id) {
        logger.error('"id" must be defined');
        return;
    }
    if (!payload) {
        logger.error('payload must be defined');
        return;
    }
    if (payload?.min && typeof payload?.min !== 'number') {
        logger.error(`remote.min must be type number.`);
        return;
    }
    if (payload?.max && typeof payload?.max !== 'number') {
        logger.error(`remote.max must be type number.`);
        return;
    }

    if (payload.min && payload.max && payload.min > payload.max) {
        logger.error(`remote.min & remote.max pair out of range.`);
        return;
    }
    if(payload.heaterOverride) {
        if (payload.heaterOverride.status && !Object.values(HEATER_OVERRIDE_STATUS).includes(payload.heaterOverride.status)) {
            logger.error('remote.heaterOverride.status is invalid')
        }
    }

    const prevState = remoteStore.getState()[id];
    if (!prevState) {
        logger.error('"prevState" must be defined');
    }

    // Only update if payload contains relevant changes
    if (prevState) {
        const nextState = {
            ...prevState,
            ...payload,
            updatedAt: getDate(),
        };
        // payload.itemType = ITEM_TYPE.REMOTE;
        remoteStore.setState(nextState.remoteId, nextState);
        onRemoteUpdate(nextState.zoneId);
    }
}
