import { getPublicQuizQuestions, quizQuestions } from '../data/quiz';
import {
  QuizQuestionPublic,
  QuizResultDetail,
  QuizSubmissionAnswer,
  QuizSubmissionResult,
} from '../types';

export class QuizService {
  public getQuestions(): QuizQuestionPublic[] {
    return getPublicQuizQuestions();
  }

  public submitQuiz(answers: QuizSubmissionAnswer[]): QuizSubmissionResult {
    // Build lookup for fast and safe access
    const questionMap = new Map(quizQuestions.map((q) => [q.id, q]));
    let correctCount = 0;
    const results: QuizResultDetail[] = [];

    for (const item of answers) {
      const question = questionMap.get(item.questionId);
      if (!question) {
        // Unknown question submitted
        results.push({
          questionId: item.questionId,
          question: 'Unknown Question',
          submittedOptionId: item.optionId,
          correctOptionId: 'N/A',
          isCorrect: false,
          explanation: 'This question ID does not exist in the active quiz question bank.',
        });
        continue;
      }

      const isCorrect = item.optionId === question.correctOptionId;
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: question.id,
        question: question.question,
        submittedOptionId: item.optionId,
        correctOptionId: question.correctOptionId,
        isCorrect,
        explanation: question.explanation,
      });
    }

    const totalQuestions = answers.length;
    const incorrectAnswers = totalQuestions - correctCount;
    const rawScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const score = Math.round(rawScore * 10) / 10; // Round to 1 decimal place

    return {
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers,
      score,
      results,
    };
  }
}

export const quizService = new QuizService();
