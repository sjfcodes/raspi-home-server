import { SseManager } from '../sse';
import { Item } from './model';

export const sseManager = new SseManager({} as Record<string, Item>);


export async function setManager(path:string) {
    return sseManager;
}

export async function getManager() {
    return sseManager;
}

export async function readAll(): Promise<Record<string, Item>> {
    return sseManager.getState();
}

export async function writeOne(item: Item): Promise<Item | void> {
    const state = sseManager.getState();
    const newItem: Item = { id: item.id };

    state[item.id.toString()] = newItem;
    sseManager.setState(state);
}
