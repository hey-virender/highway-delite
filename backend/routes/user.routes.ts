import { RequestHandler, Router } from 'express';
import {
  createUser,
  getUser,
  loginUser,
  logoutUser,
  getProfile
} from '../controllers/user.controller';
import { verifyClerkSession } from '../middleware/verifyClerkSession';

const router = Router();

// Public routes
router.post('/create', createUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);
router.post('/logout', logoutUser as RequestHandler);

// Protected routes (require authentication)
router.get('/profile', verifyClerkSession as RequestHandler, getProfile as RequestHandler);
router.get('/:user_id', verifyClerkSession as RequestHandler, getUser as RequestHandler);

export default router;