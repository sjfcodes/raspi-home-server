import { Router } from 'express';
import { registerThermostatRoutes } from './thermostat/router';
import { registerItemRoutes } from './_template/router';
import { registerHeaterRoutes } from './heater/router';
import { registerRemoteRoutes } from './remote/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    registerItemRoutes(router, `${prefix}/item`);
    registerHeaterRoutes(router, `${prefix}/heater`);
    registerRemoteRoutes(router, `${prefix}/remote`);

    // [TODO] update thermostats to use new route
    registerThermostatRoutes(router, `${prefix}/thermostat`);
    registerThermostatRoutes(router, `/api/temperature`);
}

/**
 * --- GLOSSARY ---
 * REMOTE    : manager of a zone's min/max temperature and any component overrides.
 * THERMOSTAT: reports of zone's temperature.
 * HEATER    : manager of a heater's on/off state.
 * ZONE      : group of one heater, termostat, & controller.
 * 
 * 
 * 
 * --- ROUTES ----
 * HEATER 
 *     [NOTE]: uses websocket to write heater state changes
 *     PATH: /heater
 *     GET : read heaters
 *     
 *     [TODO] PATH: /heater/:id
 *            GET : read one heater
 *  
 *     [TODO]: convert heater chip to use
 *             GET  : read sse status stream
 *             PATCH: write heater state
*
 * [NEXT]
 * REMOTE
 *     PATH: /remote
 *     PUT: write min, max, override to store
 *     GET : read controllers
 *
 *     [TODO] PATH: /remote/:id
 *            GET : read one remote
 *
 * THERMOSTAT
 *     PATH: /thermostat
 *     PUT: write temperature to store
 *     GET : read thermostats
 *
 *     [TODO] PATH: /thermostat/:id
 *            GET : read one thermostat
 *
 * ZONE
 *     PATH: /zone
 *     PUT: write zone to store
 *     GET : read zones
 *
 *     [TODO] PATH: /zone/:id
 *            GET : read one zone
 *
 * SYSTEM
 *     PATH: /system
 *     GET: read system status
 * 
 */