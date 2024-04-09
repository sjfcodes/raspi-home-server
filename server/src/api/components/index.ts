import { Router } from 'express';
import { userRouter } from './user/router';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/users`, userRouter);
}
