import { Router } from 'express';
import { registerThermometerRoutes } from './thermometer/router';
import { registerItemRoutes } from './_template/router';
import { registerHeaterRoutes } from './heater/router';
import { registerThermostatRoutes } from './thermostat/router';
import { registerZoneRoutes } from './zone/router';
import { registerSystemRoutes } from './system/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    registerItemRoutes(router, `${prefix}/item`);
    registerHeaterRoutes(router, `${prefix}/heater`);
    registerThermostatRoutes(router, `${prefix}/thermostat`);
    registerZoneRoutes(router, `${prefix}/zone`);
    registerSystemRoutes(router, `${prefix}/system`);

    // [TODO] update thermometers to use new route & PUT instead of POST
    registerThermometerRoutes(router, `${prefix}/thermometer`);
    registerThermometerRoutes(router, `/api/temperature`);
}
