import { Router } from 'express';
import { readUsers } from './controller';

const userRouter = Router();
userRouter.get('/', readUsers);

export { userRouter };
