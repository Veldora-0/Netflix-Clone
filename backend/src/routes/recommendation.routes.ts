import { Router } from 'express';
import {
  getMoodRecommendations,
  moodSchema,
} from '../controllers/recommendation.controller';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.post('/mood', validateBody(moodSchema), getMoodRecommendations);

export default router;
