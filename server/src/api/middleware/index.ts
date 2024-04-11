import { json, NextFunction, Request, Response, Router } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import { handleError } from '../../services/utility';
import { env } from '../../config/globals';
import { logger } from '../../config/logger';

export function routeLogger(req: Request, _res: Response, next: NextFunction) {
    logger.info(
        `${req.method}: ${req.path} ${
            typeof req.body === 'object' ? JSON.stringify(req.body) : req.body
        }`
    );
    next();
}

export function registerMiddleware(router: Router): void {
    router.options('/*', function (_req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Methods',
            'GET,PUT,POST,DELETE,OPTIONS'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, Content-Length, X-Requested-With'
        );
        res.send(200);
    });
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
