import { Router } from 'express';
import { readItems, writeItem } from './controller';

const thermostatRouter = Router();
thermostatRouter.get('/', readItems);
thermostatRouter.post('/', writeItem);

export { thermostatRouter };
