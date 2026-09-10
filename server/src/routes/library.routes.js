import { Router } from 'express';
import {
  getEbooks,
  getEbookById,
  buyPremiumEbook,
  createEbook,
} from '../controllers/library.controller.js';
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/ebooks', optionalAuth, getEbooks);
router.get('/ebooks/:id', optionalAuth, getEbookById);
router.post('/ebooks/:id/buy', authenticate, buyPremiumEbook);

// Admin routes
router.post('/ebooks', authenticate, requireRole('admin'), createEbook);

// Upload PDF / Ebook file
router.post('/upload-file', authenticate, requireRole('admin'), upload.single('ebook'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File e-book tidak ditemukan.' });
  }
  res.status(200).json({
    success: true,
    data: { url: `/uploads/ebooks/${req.file.filename}`, size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` },
  });
});

export default router;
