import { Router } from 'express';
import { readItems } from './controller';
import { sseManager } from './store';

export function registerItemRoutes(router: Router, prefix: string) {
    sseManager.setPath(prefix);
    router.get(prefix + '/', readItems);
    router.get(prefix + '/test', readItems);
}
