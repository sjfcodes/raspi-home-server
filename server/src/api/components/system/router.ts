import { Router } from 'express';
import { readInfo, readTemperature } from './controller';
import { systemStore } from './store';

export function registerSystemRoutes(router: Router, prefix: string) {
    systemStore.setPath(prefix + '/temperature');
    router.get(prefix + '/temperature', readTemperature);

    router.get(prefix + '/information', readInfo);
}
