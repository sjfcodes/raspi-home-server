import { Router } from 'express';
import { readItems } from './controller';

const itemRouter = Router();
itemRouter.get('/', readItems);

export { itemRouter };
