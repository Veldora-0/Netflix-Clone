import { Router } from 'express';
import {
  addToWatchlist,
  addWatchlistSchema,
  getWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlist.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// All watchlist routes require authentication
router.use(requireAuth);

router.get('/', getWatchlist);
router.post('/', validateBody(addWatchlistSchema), addToWatchlist);
router.delete('/:id', removeFromWatchlist);

export default router;
