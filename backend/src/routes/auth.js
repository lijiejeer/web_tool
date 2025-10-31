import express from 'express';
import { login, getProfile, updatePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/password', authenticateToken, updatePassword);

export default router;
