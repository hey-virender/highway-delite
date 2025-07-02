import { RequestHandler, Router } from 'express';
import { createUser, getUser } from '../controllers/user.controller';

const router = Router();

router.post('/create', createUser as RequestHandler);
router.get('/:user_id', getUser as RequestHandler);

export default router;