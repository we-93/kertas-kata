import { Router } from 'express';
import {
  saveDraft,
  submitForReview,
  getMyArticles,
  getArticleById,
  getPublicArticles,
  getArticleBySlug,
} from '../controllers/article.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Public routes
router.get('/public', getPublicArticles);
router.get('/public/read/:slug', getArticleBySlug);

// Member private routes
router.post('/save', authenticate, saveDraft);
router.post('/:id/submit', authenticate, submitForReview);
router.get('/my', authenticate, getMyArticles);
router.get('/my/:id', authenticate, getArticleById);

// Upload cover route
router.post('/upload-cover', authenticate, upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File gambar cover tidak ditemukan.' });
  }
  const fileUrl = `/uploads/covers/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Cover naskah berhasil diunggah.',
    data: { url: fileUrl },
  });
});

export default router;
