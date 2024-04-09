import { NextFunction, Request, Response } from 'express';
import { readAll, writeOne } from './store';

export async function readItems(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const items = await readAll();

        return res.status(200).json({ message: 'success', data: items });
    } catch (err) {
        return next(err);
    }
}

export async function writeItem(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        await writeOne(req.body);

        return res
            .status(200)
            .json({
                message: 'success',
                data: { serverName: 'raspi-home-server' },
            });
    } catch (err) {
        return next(err);
    }
}
