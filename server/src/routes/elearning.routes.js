import { Router } from 'express';
import {
  getModules,
  getModuleClassroom,
  submitQuiz,
  createModule,
  updateModule,
  deleteModule,
} from '../controllers/elearning.controller.js';
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Member / Public catalog
router.get('/modules', optionalAuth, getModules);
router.get('/modules/:id', optionalAuth, getModuleClassroom);
router.post('/modules/:id/quiz', authenticate, submitQuiz);

// Admin management
router.post('/modules', authenticate, requireRole('admin', 'mentor'), createModule);
router.put('/modules/:id', authenticate, requireRole('admin', 'mentor'), updateModule);
router.delete('/modules/:id', authenticate, requireRole('admin', 'mentor'), deleteModule);

export default router;
