import { Router } from 'express';
import { registerThermostatRoutes } from './thermostat/router';
import { registerItemRoutes } from './template/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    registerItemRoutes(router, `${prefix}/item`);
    registerItemRoutes(router, `${prefix}/room`);

    // [TODO] update thermostats to use new route
    registerThermostatRoutes(router, `${prefix}/thermostat`);
    registerThermostatRoutes(router, `/api/temperature`);
}

/**
 * --- GLOSSARY ---
 * CONTROLLER: manager of a zone's min/max temperature and any component overrides.
 * THERMOSTAT: reports of zone's temperature.
 * HEATER    : manager of a heater's on/off state.
 * ZONE      : group of one heater, termostat, & controller.
 * 
 * [NEXT]
 * --- ROUTES ----
 * HEATER 
 *     PATH: /heater
 *     GET : read heaters
 *     
 *     PATH: /heater/:id
 *     GET : read one heater
 *  
 *     NOTE: is websocket connection to write heater state change
 *     [TODO]: convert heater chip to use
 *             GET : read sse status stream
 *             POST: write heater state
 *
 * CONTROLLER
 *     PATH: /controller
 *     POST: write min, max, override to store
 *     GET : read controllers
 *
 *     PATH: /controller/:id
 *     GET : read one controller
 *
 * THERMOSTAT
 *     PATH: /thermostat
 *     POST: write temperature to store
 *     GET : read thermostats
 *
 *     PATH: /thermostat/:id
 *     GET : read one thermostat
 *
 * ZONE
 *     PATH: /zone
 *     POST: write zone to store
 *     GET : read zones
 *
 *     PATH: /zone/:id
 *     GET : read one zone
 *
 * SYSTEM
 *     PATH: /system
 *     GET: read system status
 * 
 */