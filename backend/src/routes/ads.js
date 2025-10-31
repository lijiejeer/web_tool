import express from 'express';
import {
  getAds,
  getAd,
  createAd,
  updateAd,
  deleteAd
} from '../controllers/adController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAds);
router.get('/:id', getAd);
router.post('/', authenticateToken, createAd);
router.put('/:id', authenticateToken, updateAd);
router.delete('/:id', authenticateToken, deleteAd);

export default router;
