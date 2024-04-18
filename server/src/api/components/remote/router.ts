import { Router } from 'express';
import { readItems, writeItem } from './controller';
import { remoteStore } from './store';

export function registerRemoteRoutes(router: Router, prefix: string) {
    remoteStore.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    router.put(prefix + '/', writeItem);
}
