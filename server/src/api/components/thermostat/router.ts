import { Router } from 'express';
import { readItems, writeItem } from './controller';
import { sseManager } from './store';

export function registerThermostatRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix + '/');
    router.get(prefix + '/', readItems);
    router.post(prefix + '/', writeItem);
}

