import { json, NextFunction, Request, Response, Router } from 'express';
import compression from 'compression';
import cors from 'cors';
// import helmet from 'helmet';

import { handleError } from '../../services/utility';
import { env } from '../../config/globals';
import { logger } from '../../config/logger';
import { config } from '../../config/config';

export function routeLogger(req: Request, _res: Response, next: NextFunction) {
    if (config.log.includeMethods.includes(req.method)) {
        const info = [];
        info.push(req.method, req.path);
        if (config.log.includeData) {
            const data =
                typeof req.body === 'object'
                    ? JSON.stringify(req.body)
                    : req.body;
            info.push(data);
        }
        logger.info(info.join(' '));
    }
    next();
}

export function registerMiddleware(router: Router): void {
    // router.use(helmet());

    if (env.NODE_ENV === 'production') {
        // [TODO] configure cors?
        router.use(cors());
    } else {
        router.use(cors());
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
