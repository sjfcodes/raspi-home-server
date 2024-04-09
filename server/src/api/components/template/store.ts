import { SseManager } from '../../../services/sse';
import { Item } from './model';

const manager = new SseManager('/api/v1/item', {} as Record<string, Item>);

export async function getManager() {
    return manager;
}

export async function readAll(): Promise<Record<string, Item>> {
    return manager.getState();
}

export async function writeOne(item: Item): Promise<Item | void> {
    const state = manager.getState();
    const newItem: Item = { id: item.id };

    state[item.id.toString()] = newItem;
    manager.setState(state);
}
