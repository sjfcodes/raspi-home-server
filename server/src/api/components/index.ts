import { Router } from 'express';
import { registerThermostatRoutes } from './thermostat/router';
import { registerItemRoutes } from './template/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    registerItemRoutes(router, `${prefix}/item`);
    // [TODO] update thermostats to use new route
    registerThermostatRoutes(router, `${prefix}/thermostat`);
    registerThermostatRoutes(router, `/api/temperature`);
}
