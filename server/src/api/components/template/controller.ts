import { NextFunction, Request, Response } from 'express';
import { Item } from './model';
import { readAll } from './store';


export async function readItems(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const items: Item[] = await readAll();

        return res.json(items);
    } catch (err) {
        return next(err);
    }
}
