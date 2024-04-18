import { Router } from 'express';
import { readItems, readItem, writeItem } from './controller';
import { zoneStore } from './store';

export function registerZoneRoutes(router: Router, prefix: string) {
    zoneStore.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    router.put(prefix + '/', writeItem);
}
