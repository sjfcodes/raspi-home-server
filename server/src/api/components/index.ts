import { Router } from 'express';
import { registerThermostatRoutes } from './thermostat/router';
import { registerItemRoutes } from './_template/router';
import { registerHeaterRoutes } from './heater/router';
import { registerRemoteRoutes } from './remote/router';
import { registerZoneRoutes } from './zone/router';
import { registerSystemRoutes } from './system/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    registerItemRoutes(router, `${prefix}/item`);
    registerHeaterRoutes(router, `${prefix}/heater`);
    registerRemoteRoutes(router, `${prefix}/remote`);
    registerZoneRoutes(router, `${prefix}/zone`);
    registerSystemRoutes(router, `${prefix}/system`);

    // [TODO] update thermostats to use new route & PUT instead of POST
    registerThermostatRoutes(router, `${prefix}/thermostat`);
    registerThermostatRoutes(router, `/api/temperature`);
}
