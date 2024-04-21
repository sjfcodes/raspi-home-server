import { Router } from 'express';
import { readItem, readItems, writeItem } from './controller';
import { thermometerStore } from './store';

export function registerThermometerRoutes(router: Router, prefix: string) {
    thermometerStore.setPath(prefix + '/');
    // router.get(prefix + '/:id', readItem);
    router.get(prefix + '/', readItems);
    //  [TODO]: update esp32 to use PUT method
    router.post(prefix + '/', writeItem);
}

