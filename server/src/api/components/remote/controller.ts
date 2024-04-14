import { NextFunction, Request, Response } from 'express';
import { sseManager, writeOne } from './store';

export async function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        if (req.query.subscribe === 'true') {
            return sseManager.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: sseManager.getState(),
            });
        }
    } catch (err) {
        return next(err);
    }
}

export async function readItem(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        if (req.query.subscribe === 'true') {
            return sseManager.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: sseManager.getState(),
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
        writeOne(req.body);

        return res.status(200).json({
            message: 'success',
        });
    } catch (err) {
        return next(err);
    }
}
