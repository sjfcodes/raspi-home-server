import { NextFunction, Request, Response } from 'express';
import { heaterStore, setHeaterById } from './store';
import { Heater } from '../../../../../types/main';

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
        const heater = req.body as Heater;
        setHeaterById(heater.chipId, heater);

        return res.status(200).json({
            message: 'success',
            data: {},
        });
    } catch (err) {
        return next(err);
    }
}
