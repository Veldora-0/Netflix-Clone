import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { api, ApiError } from '../api/client';
import { ErrorState } from '../components/common/ErrorState';
import {
  QuizQuestion,
  QuizSubmissionAnswer,
  QuizSubmissionResult,
} from '../types';

export const MovieQuizPage: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'submitting' | 'result'>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizSubmissionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getQuizQuestions();
      setQuestions(res.questions || []);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : 'Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setGameState('playing');
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setGameState('submitting');
    try {
      const payload: QuizSubmissionAnswer[] = questions.map((q) => ({
        questionId: q.id,
        optionId: selectedAnswers[q.id] || '',
      }));

      const res = await api.submitQuiz(payload);
      setQuizResult(res);
      setGameState('result');
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : 'Error submitting quiz answers');
      setGameState('playing');
    }
  };

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const currentAnswer = currentQ ? selectedAnswers[currentQ.id] : undefined;

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      {/* 1. INTRO STATE */}
      {gameState === 'intro' && (
        <div className="text-center space-y-8 py-10 bg-neon-card/60 p-8 md:p-12 rounded-3xl border border-neon-border/80 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-3xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple mx-auto flex items-center justify-center shadow-neon-purple">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Cinema Challenge</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display text-neon-text">
              The NEONFLIX Movie Quiz
            </h1>
            <p className="text-neon-muted text-sm md:text-base leading-relaxed">
              Test your knowledge across Oscar-winning milestones, cyberpunk classics, iconic directors, and legendary movie trivia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            <div className="p-4 rounded-xl bg-neon-surface border border-neon-border/60">
              <span className="text-xs text-neon-muted">Questions</span>
              <p className="text-base font-bold text-neon-text mt-0.5">{questions.length || 10} Rounds</p>
            </div>
            <div className="p-4 rounded-xl bg-neon-surface border border-neon-border/60">
              <span className="text-xs text-neon-muted">Scoring</span>
              <p className="text-base font-bold text-neon-accent mt-0.5">Server Verified</p>
            </div>
            <div className="p-4 rounded-xl bg-neon-surface border border-neon-border/60">
              <span className="text-xs text-neon-muted">Integrity</span>
              <p className="text-base font-bold text-neon-purple mt-0.5">Anti-Cheat Masked</p>
            </div>
          </div>

          {error && <ErrorState message={error} onRetry={fetchQuestions} />}

          <div>
            <button
              onClick={handleStart}
              disabled={loading || questions.length === 0}
              className="px-8 py-3.5 rounded-xl bg-neon-purple hover:brightness-110 text-neon-dark font-bold text-base shadow-neon-purple transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading Questions...' : 'Start Movie Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* 2. PLAYING / SUBMITTING STATE */}
      {(gameState === 'playing' || gameState === 'submitting') && currentQ && (
        <div className="space-y-6">
          {/* Header Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neon-muted">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progressPercent)}% Completed</span>
            </div>
            <div className="w-full bg-neon-surface h-2 rounded-full overflow-hidden border border-neon-border/60">
              <div
                className="bg-gradient-to-r from-neon-purple to-neon-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 md:p-10 rounded-3xl bg-neon-card border border-neon-border/80 shadow-2xl space-y-8 backdrop-blur-md">
            <div className="space-y-2">
              <span className="text-xs font-bold text-neon-purple tracking-wider uppercase">
                Round {currentIndex + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-display text-neon-text leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Multiple Choice Options Grid */}
            <div className="grid grid-cols-1 gap-3.5">
              {currentQ.options.map((opt) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-200 transform ${
                      isSelected
                        ? 'bg-neon-purple/20 border-neon-purple text-neon-text shadow-neon-purple scale-[1.01]'
                        : 'bg-neon-surface/60 hover:bg-neon-surface border-neon-border text-neon-muted hover:text-neon-text'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-neon-purple text-neon-dark font-extrabold'
                            : 'bg-neon-surface border border-neon-border text-neon-muted'
                        }`}
                      >
                        {opt.id.replace('opt-', '').toUpperCase()}
                      </div>
                      <span className="text-sm md:text-base">{opt.text}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-neon-purple bg-neon-purple' : 'border-neon-border'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-neon-dark" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Bottom */}
            <div className="flex items-center justify-between pt-4 border-t border-neon-border/60">
              <span className="text-xs text-neon-muted italic">
                {currentAnswer ? 'Answer selected. Ready to proceed.' : 'Please select an answer.'}
              </span>

              <button
                onClick={handleNext}
                disabled={!currentAnswer || gameState === 'submitting'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-cyan transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>
                  {gameState === 'submitting'
                    ? 'Submitting...'
                    : currentIndex === questions.length - 1
                    ? 'Submit Quiz'
                    : 'Next Question'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULT STATE (SERVER-SCORED) */}
      {gameState === 'result' && quizResult && (
        <div className="space-y-8 animate-fade-in">
          {/* Score Header Card */}
          <div className="text-center p-8 md:p-12 rounded-3xl bg-neon-card border border-neon-border shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-bold tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Official Result Calculated by Server</span>
            </div>

            <div>
              <div className="text-6xl md:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-neon-accent via-neon-purple to-neon-amber">
                {quizResult.score}%
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-neon-text mt-2">
                {quizResult.score >= 80
                  ? 'Master Cinephile! 🏆'
                  : quizResult.score >= 50
                  ? 'Film Enthusiast! 🎬'
                  : 'Casual Viewer 🍿'}
              </h2>
              <p className="text-neon-muted text-sm mt-1 max-w-md mx-auto">
                You correctly answered {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions.
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="p-3 rounded-xl bg-neon-surface border border-neon-border">
                <span className="text-[11px] text-neon-muted">Total</span>
                <p className="text-lg font-bold text-neon-text">{quizResult.totalQuestions}</p>
              </div>
              <div className="p-3 rounded-xl bg-neon-surface border border-neon-border">
                <span className="text-[11px] text-emerald-400">Correct</span>
                <p className="text-lg font-bold text-emerald-400">{quizResult.correctAnswers}</p>
              </div>
              <div className="p-3 rounded-xl bg-neon-surface border border-neon-border">
                <span className="text-[11px] text-rose-400">Incorrect</span>
                <p className="text-lg font-bold text-rose-400">{quizResult.incorrectAnswers}</p>
              </div>
            </div>

            <div>
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-neon-purple hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-purple transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restart Quiz Challenge</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-neon-text">
              Comprehensive Review & Trivia Insights
            </h3>

            <div className="space-y-4">
              {quizResult.results.map((item, idx) => (
                <div
                  key={item.questionId}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.isCorrect
                      ? 'bg-neon-card/90 border-emerald-500/30'
                      : 'bg-neon-card/90 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {item.isCorrect ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            Incorrect
                          </span>
                        )}
                        <span className="text-xs text-neon-muted font-medium">Question {idx + 1}</span>
                      </div>

                      <h4 className="font-bold text-neon-text text-sm md:text-base">
                        {item.question}
                      </h4>

                      {/* Explanation from backend */}
                      <div className="p-3 rounded-xl bg-neon-surface/60 border border-neon-border/60 text-xs text-neon-muted leading-relaxed">
                        <span className="font-semibold text-neon-accent">Trivia Fact: </span>
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
