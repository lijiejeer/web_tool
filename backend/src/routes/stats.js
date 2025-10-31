import express from 'express';
import { getStats, getLoginLogs } from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getStats);
router.get('/logs', authenticateToken, getLoginLogs);

export default router;
