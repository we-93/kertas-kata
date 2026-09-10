import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import articleRoutes from './article.routes.js';
import adminReviewRoutes from './admin-review.routes.js';
import elearningRoutes from './elearning.routes.js';
import libraryRoutes from './library.routes.js';
import communityRoutes from './community.routes.js';
import printRoutes from './print.routes.js';
import certificateRoutes from './certificate.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/articles', articleRoutes);
router.use('/admin/reviews', adminReviewRoutes);
router.use('/elearning', elearningRoutes);
router.use('/library', libraryRoutes);
router.use('/community', communityRoutes);
router.use('/print', printRoutes);
router.use('/certificates', certificateRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    platform: 'KERTAS KATA Kabupaten Tangerang API',
    timestamp: new Date().toISOString(),
  });
});

export default router;
