import { SseManager } from '../sse';
import { Item, ItemMap } from './model';

export const sseManager = new SseManager({} as ItemMap);

export function readAll(): ItemMap {
    return sseManager.getState() as ItemMap;
}

export function writeOne(item: Item): void {
    sseManager.setState(item.id, item);
}
