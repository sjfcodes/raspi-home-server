import { NextFunction, Request, Response } from 'express';
import { thermostatStore, setThermostatById } from './store';
import { Thermostat } from '../../../../../types/main';

export async function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        if (req.query.subscribe === 'true') {
            return thermostatStore.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: thermostatStore.getState(),
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
            return thermostatStore.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: thermostatStore.getState(),
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
        const thermostat = req.body as Thermostat;
        setThermostatById(thermostat.thermostatId, thermostat);

        return res.status(200).json({
            message: 'success',
        });
    } catch (err) {
        return next(err);
    }
}
