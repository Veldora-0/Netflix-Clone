import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('demo@neonflix.com');
    setPassword('DemoPassword123!');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setFormError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-neon-card/90 border border-neon-border/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-accent to-neon-purple p-0.5 mx-auto shadow-neon-cyan">
            <div className="w-full h-full bg-neon-dark rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-neon-accent text-xl">N</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold font-display text-neon-text">
            Welcome to NEONFLIX
          </h1>
          <p className="text-xs text-neon-muted">
            Sign in to access your Watchlist and synchronized history.
          </p>
        </div>

        {/* Quick Demo Autofill Pill */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent text-xs font-semibold hover:bg-neon-accent/20 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Fill Demo Account (demo@neonflix.com)</span>
        </button>

        {/* Error Alert */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neon-muted block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neon-muted block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neon-muted hover:text-neon-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-neon-accent hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-cyan transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center pt-2 border-t border-neon-border/40 text-xs text-neon-muted">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-neon-accent font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
