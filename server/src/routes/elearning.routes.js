import { Router } from 'express';
import {
  getModules,
  getModuleClassroom,
  submitQuiz,
  createModule,
  updateModule,
  deleteModule,
  createQuiz,
  deleteQuiz
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

// Admin Quiz Management
router.post('/modules/:id/quizzes', authenticate, requireRole('admin', 'mentor'), createQuiz);
router.delete('/quizzes/:quizId', authenticate, requireRole('admin', 'mentor'), deleteQuiz);

export default router;
