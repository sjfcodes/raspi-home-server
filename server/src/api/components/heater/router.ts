import { Router } from 'express';
import { readItems } from './controller';
import { sseManager } from './store';

export function registerHeaterRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
}
