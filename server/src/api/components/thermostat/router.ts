import { Router } from 'express';
import { readItem, readItems, writeItem } from './controller';
import { thermostatStore } from './store';

export function registerThermostatRoutes(router: Router, prefix: string) {
    thermostatStore.setPath(prefix + '/');
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    //  [TODO]: update esp32 to use PUT method
    router.post(prefix + '/', writeItem);
}

