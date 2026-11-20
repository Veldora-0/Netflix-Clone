import { Router } from 'express';
import {
  getHistory,
  upsertHistory,
  upsertHistorySchema,
} from '../controllers/history.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// All history routes require authentication
router.use(requireAuth);

router.get('/', getHistory);
router.post('/', validateBody(upsertHistorySchema), upsertHistory);

export default router;
