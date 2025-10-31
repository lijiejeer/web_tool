import express from 'express';
import {
  getFriendlinks,
  getFriendlink,
  createFriendlink,
  updateFriendlink,
  deleteFriendlink
} from '../controllers/friendlinkController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFriendlinks);
router.get('/:id', getFriendlink);
router.post('/', authenticateToken, createFriendlink);
router.put('/:id', authenticateToken, updateFriendlink);
router.delete('/:id', authenticateToken, deleteFriendlink);

export default router;
