import { NextFunction, Request, Response } from 'express';
import { getManager, writeOne } from './store';
import { generateUuid } from '../../../services/utility';

export async function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const manager = await getManager();

        if (req.query.subscribe === 'true') {
            return manager.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: manager.getState(),
            });
        }
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

        return res.status(200).json({
            message: 'success',
            data: { serverName: 'raspi-home-server' },
        });
    } catch (err) {
        return next(err);
    }
}
