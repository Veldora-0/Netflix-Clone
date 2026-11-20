import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import historyRoutes from './history.routes';
import movieRoutes from './movie.routes';
import quizRoutes from './quiz.routes';
import recommendationRoutes from './recommendation.routes';
import watchlistRoutes from './watchlist.routes';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/movies', movieRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/watchlist', watchlistRoutes);
apiRouter.use('/history', historyRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/quiz', quizRoutes);

export default apiRouter;
