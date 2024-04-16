import { Request, Response, Router } from 'express';
import { registerApiRoutes } from './components';
import { registerErrorHandler, registerMiddleware } from './middleware';

export function initRestRoutes(router: Router): void {
    const prefix: string = '/api/v1';

    router.get(prefix + '/healthcheck', (_req: Request, res: Response) =>
        res.send({ mesage: 'alive' })
    );
    registerMiddleware(router);
    registerApiRoutes(router, prefix);
    registerErrorHandler(router);
}