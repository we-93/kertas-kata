import { Router } from 'express';
import {
  getMyCertificates,
  verifyCertificate,
  generateCertificate,
} from '../controllers/certificate.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/my', authenticate, getMyCertificates);
router.get('/verify/:certNumber', verifyCertificate);
router.post('/generate', authenticate, requireRole('admin'), generateCertificate);

export default router;
