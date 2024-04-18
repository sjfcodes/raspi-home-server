import { NextFunction, Request, Response } from 'express';
import { heaterStore, setHeaterById } from './store';

export function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    try {
        if (req.query.subscribe === 'true') {
            return heaterStore.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: heaterStore.getState(),
            });
        }
    } catch (err) {
        return next(err);
    }
}

export function writeItem(
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    try {
        setHeaterById(req.body);

        return res.status(200).json({
            message: 'success',
            data: {},
        });
    } catch (err) {
        return next(err);
    }
}
