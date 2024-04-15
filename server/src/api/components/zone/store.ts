import { ITEM_TYPE, REMOTE_ID, ZONE_ID } from '../../../config/globals';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager: SseManager<Item> = new SseManager({
    [ZONE_ID.HOME]: {
        zoneId: ZONE_ID.HOME,
        remoteId: REMOTE_ID.HOME,
        heaterId: 'd0fc8ad4',
        thermostatId: '9efc8ad4',
        zoneName: 'home',
        isActive: true,
        itemType: ITEM_TYPE.ZONE,
    },
    [ZONE_ID.OFFICE]: {
        zoneId: ZONE_ID.OFFICE,
        remoteId: REMOTE_ID.OFFICE,
        heaterId: '',
        thermostatId: 'abe342a8',
        zoneName: 'office',
        isActive: false,
        itemType: ITEM_TYPE.ZONE,
    },
});

export function getZones(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function getZoneById(zoneId: string): Item | undefined {
    const zones = getZones();
    return zones[zoneId];
}

export function setZone(item: Item): void {
    sseManager.setState(item.zoneId, item);
}
