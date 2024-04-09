import { NextFunction, Request, Response } from 'express';
import { User } from './model';
import { readAll } from './store';


export async function readUsers(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const users: User[] = await readAll();

        return res.json(users);
    } catch (err) {
        return next(err);
    }
}
