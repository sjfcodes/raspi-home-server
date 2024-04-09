import { Router } from 'express';
import { thermostatRouter } from './thermostat/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
	// [TODO] update thermostats to use new route
	// router.use(`${prefix}/thermostat`, thermostatRouter);
	router.use(`/api/temperature`, thermostatRouter);
}
