import { NextFunction, Request, Response } from 'express';
import { remoteStore, setRemoteById } from './store';
import { Remote } from '../../../../../types/main';

export async function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        if (req.query.subscribe === 'true') {
            return remoteStore.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: remoteStore.getState(),
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
            return remoteStore.subscribe(req, res);
        } else {
            return res.status(200).json({
                message: 'success',
                data: remoteStore.getState(),
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
        const remote = req.body as Remote;
        setRemoteById(remote.remoteId, remote);

        return res.status(200).json({
            message: 'success',
        });
    } catch (err) {
        return next(err);
    }
}
