import { User } from "./model";

const user = new User(0, 'email', 'first', 'last');
const db = [user];

export async function readAll(): Promise<User[]>{
    return db;
}
