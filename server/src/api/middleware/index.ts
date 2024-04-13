import { json, NextFunction, Request, Response, Router } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import { handleError } from '../../services/utility';
import { env } from '../../config/globals';
import { logger } from '../../config/logger';
import { config } from '../../../config';

export function routeLogger(req: Request, _res: Response, next: NextFunction) {
    const data =
        typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    const info = [req.method, req.path];
    if (config.log.showData) info.push(data);
    logger.info(info.join(' '));
    next();
}

export function registerMiddleware(router: Router): void {
    // router.use(helmet());

    if (env.NODE_ENV === 'development') {
        router.use(cors({ origin: '*' }));
    } else {
        // [TODO] use raspberry pi ip & port globals
        router.use(cors({ origin: ['http://192.168.68.142:5173/'] }));
    }

    router.use(json());
    router.use(compression());
    router.use(routeLogger);
}

export function registerErrorHandler(router: Router): Response | void {
    router.use(
        (err: Error, _req: Request, res: Response, next: NextFunction) => {
            handleError(err);

            return res.status(500).json({
                error: err.message || err,
                status: 500,
            });
        }
    );
}
