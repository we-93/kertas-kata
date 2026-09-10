import { Router } from 'express';
import { googleAuth, login, register, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/google', googleAuth);
router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getMe);

export default router;
