import { NextFunction, Request, Response } from 'express';
import { getManager, writeOne } from './store';
import { SSE_HEADERS } from '../../../../../constant/constant';
import { generateUuid } from '../../../services/utility';

export async function readItems(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const manager = await getManager();
        const data = manager.getState();

        if (req.query.subscribe === 'true') {
            const clientId = generateUuid()
            res.writeHead(200, SSE_HEADERS);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            res.flush(); // required for sse with compression https://expressjs.com/en/resources/middleware/compression.html#:~:text=add%20all%20routes-,Server%2DSent%20Events,-Because%20of%20the
            manager.subscribe({ id: clientId, res });
            req.on('close', () => manager.unsubscribe(clientId));
        } else {
            return res.status(200).json({ message: 'success', data });
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
