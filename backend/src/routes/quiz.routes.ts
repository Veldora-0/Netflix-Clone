import { Router } from 'express';
import {
  getQuizQuestions,
  quizSubmissionSchema,
  submitQuiz,
} from '../controllers/quiz.controller';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.get('/questions', getQuizQuestions);
router.post('/submit', validateBody(quizSubmissionSchema), submitQuiz);

export default router;
