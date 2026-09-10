import { Router } from 'express';
import { updateProfile, changePassword, getAllMembers, updateMemberStatus } from '../controllers/user.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Member profile
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

// Admin member management
router.get('/members', authenticate, requireRole('admin', 'mentor'), getAllMembers);
router.patch('/members/:id/status', authenticate, requireRole('admin'), updateMemberStatus);

export default router;
