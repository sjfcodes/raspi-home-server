import { SseManager } from '../sse';
import { Item } from './model';

export const sseManager: SseManager<Item> = new SseManager({
    home: {
        id: 'home',
        zoneName: 'home',
        remoteId: 'home',
        heaterId: 'd0fc8ad4',
        thermostatId: '9efc8ad4',
        isActive: true,
    },
    office: {
        id: 'office',
        zoneName: 'office',
        remoteId: 'office',
        heaterId: '',
        thermostatId: 'abe342a8',
        isActive: false,
    },
});

export function readAll(): Record<string, Item> {
    return sseManager.getState() as Record<string, Item>;
}

export function writeOne(item: Item): void {
    sseManager.setState(item.id, item);
}
