import { Router } from 'express';
import { readItems, readItem, writeItem } from './controller';
import { sseManager } from './store';

export function registerItemRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
}
