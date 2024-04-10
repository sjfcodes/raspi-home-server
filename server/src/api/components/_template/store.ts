import { SseManager } from '../sse';
import { Item } from './model';

export const sseManager = new SseManager({} as Record<string, Item>);

export function readAll(): Record<string, Item> {
    return sseManager.getState() as Record<string, Item>;
}

export function writeOne(item: Item): void {
    sseManager.setState(item.id, item);
}
