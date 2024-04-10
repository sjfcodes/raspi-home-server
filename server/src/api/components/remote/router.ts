import { Router } from 'express';
import { readItems, readItem, writeItem } from './controller';
import { sseManager } from './store';

export function registerRemoteRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    router.put(prefix + '/', writeItem);
}
