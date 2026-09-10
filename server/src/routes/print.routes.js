import { Router } from 'express';
import {
  calculatePrintCost,
  submitPrintOrder,
  getMyPrintOrders,
  getAllPrintOrders,
  updateOrderStatus,
} from '../controllers/print.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/calculate', calculatePrintCost);
router.post('/order', authenticate, submitPrintOrder);
router.get('/my-orders', authenticate, getMyPrintOrders);

// Admin routes
router.get('/orders', authenticate, requireRole('admin'), getAllPrintOrders);
router.patch('/orders/:id/status', authenticate, requireRole('admin'), updateOrderStatus);

// Upload naskah PDF
router.post('/upload-manuscript', authenticate, upload.single('manuscript'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File naskah tidak ditemukan.' });
  }
  res.status(200).json({
    success: true,
    data: { url: `/uploads/manuscripts/${req.file.filename}` },
  });
});

export default router;
