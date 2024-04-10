import { NextFunction, Request, Response } from 'express';
import { getPiCpuInfo, getPiTemp, sseManager } from './store';

export async function readInfo(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const data = await getPiCpuInfo();
        return res.status(200).json({
            message: 'success',
            data,
        });
    } catch (err) {
        return next(err);
    }
}

export async function readTemperature(
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
