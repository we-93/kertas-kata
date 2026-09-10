import { Router } from 'express';
import { getPlatformStats } from '../controllers/stats.controller.js';

const router = Router();

// Endpoint publik statistik platform
router.get('/overview', getPlatformStats);

export default router;
