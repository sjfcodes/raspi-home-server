import { Router } from 'express';
import { readItems } from './controller';
import { heaterStore } from './store';

export function registerHeaterRoutes(router: Router, prefix: string) {
    heaterStore.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
}
