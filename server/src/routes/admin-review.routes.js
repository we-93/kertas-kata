import { Router } from 'express';
import {
  getReviewQueue,
  runAICheck,
  addInlineComment,
  makeReviewDecision,
  getPlatformOverview,
} from '../controllers/admin-review.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Seluruh endpoint admin review wajib login sebagai admin atau mentor
router.use(authenticate, requireRole('admin', 'mentor'));

router.get('/overview', getPlatformOverview);
router.get('/queue', getReviewQueue);
router.post('/:id/ai-check', runAICheck);
router.post('/:id/comment', addInlineComment);
router.post('/:id/decide', makeReviewDecision);

export default router;
