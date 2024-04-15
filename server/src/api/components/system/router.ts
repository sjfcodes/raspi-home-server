import { Router } from 'express';
import { readInfo, readTemperature } from './controller';
import { sseManager } from './store';

export function registerSystemRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix + '/temperature');
    router.get(prefix + '/temperature', readTemperature);

    router.get(prefix + '/information', readInfo);
}
