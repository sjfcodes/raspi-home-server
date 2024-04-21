import { HEATER_ID, ITEM_TYPE, REMOTE_ID, THERMOMETER_ID, ZONE_ID } from '../../../config/globals';
import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const zoneStore: SseManager<Item> = new SseManager({
    [ZONE_ID.HOME]: {
        zoneId: ZONE_ID.HOME,
        remoteId: REMOTE_ID.HOME,
        heaterId: HEATER_ID.HOME,
        thermometerId: THERMOMETER_ID.HOME,
        zoneName: 'home',
        isActive: true,
        itemType: ITEM_TYPE.ZONE,
    },
    [ZONE_ID.OFFICE]: {
        zoneId: ZONE_ID.OFFICE,
        remoteId: REMOTE_ID.OFFICE,
        heaterId: '',
        thermometerId: THERMOMETER_ID.OFFICE,
        zoneName: 'office',
        isActive: false,
        itemType: ITEM_TYPE.ZONE,
    },
});

export function getZones(): ItemMap {
    return zoneStore.getState() as ItemMap;
}

export function getZoneById(zoneId: string): Item | undefined {
    const zones = getZones();
    return zones[zoneId];
}

export function setZone(item: Item): void {
    zoneStore.setState(item.zoneId, item);
}
