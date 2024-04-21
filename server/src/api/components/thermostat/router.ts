import { Router } from 'express';
import { readItems, writeItem } from './controller';
import { thermostatStore } from './store';

export function registerThermostatRoutes(router: Router, prefix: string) {
    thermostatStore.setPath(prefix);
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    router.put(prefix + '/', writeItem);
}
