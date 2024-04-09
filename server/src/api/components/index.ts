import { Router } from 'express';
import { userRouter } from './user/router';
import { thermostatRouter } from './thermostat/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/users`, userRouter);
	// [TODO] update thermostats to use new route
	// router.use(`${prefix}/thermostat`, thermostatRouter);
	router.use(`/api/temperature`, thermostatRouter);
}
