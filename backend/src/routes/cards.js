import express from 'express';
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  searchCards,
  parseWebsite
} from '../controllers/cardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCards);
router.get('/search', searchCards);
router.get('/:id', getCard);
router.post('/parse', parseWebsite);
router.post('/', authenticateToken, createCard);
router.put('/:id', authenticateToken, updateCard);
router.delete('/:id', authenticateToken, deleteCard);

export default router;
