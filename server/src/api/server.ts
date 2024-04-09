import express from 'express';
import { initRestRoutes } from './routes';

const app: express.Application = express();
initRestRoutes(app);

export { app };
