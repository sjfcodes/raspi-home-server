import { Item } from "./model";

const item = new Item(0);
const db = [item];

export async function readAll(): Promise<Item[]>{
    return db;
}
