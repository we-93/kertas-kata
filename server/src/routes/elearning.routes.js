import { Router } from 'express';
import {
  getModules,
  getModuleClassroom,
  submitQuiz,
  createModule,
} from '../controllers/elearning.controller.js';
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Member / Public catalog
router.get('/modules', optionalAuth, getModules);
router.get('/modules/:id', optionalAuth, getModuleClassroom);
router.post('/modules/:id/quiz', authenticate, submitQuiz);

// Admin management
router.post('/modules', authenticate, requireRole('admin', 'mentor'), createModule);

export default router;
