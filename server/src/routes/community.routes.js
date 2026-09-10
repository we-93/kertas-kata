import { Router } from 'express';
import {
  getThreads,
  getThreadById,
  createThread,
  replyThread,
} from '../controllers/community.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/threads', optionalAuth, getThreads);
router.get('/threads/:id', optionalAuth, getThreadById);
router.post('/threads', authenticate, createThread);
router.post('/threads/:id/replies', authenticate, replyThread);

export default router;
