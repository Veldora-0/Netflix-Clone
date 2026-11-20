import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setFormError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-neon-card/90 border border-neon-border/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-accent p-0.5 mx-auto shadow-neon-purple">
            <div className="w-full h-full bg-neon-dark rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-neon-purple text-xl">N</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold font-display text-neon-text">
            Create an Account
          </h1>
          <p className="text-xs text-neon-muted">
            Join NEONFLIX for personalized movie discovery and history.
          </p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neon-muted block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-purple transition-colors"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-purple transition-colors"
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
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-purple transition-colors"
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neon-muted block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neon-surface border border-neon-border text-neon-text text-sm placeholder:text-neon-muted/60 focus:outline-none focus:border-neon-purple transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-neon-purple hover:brightness-110 text-neon-dark font-bold text-sm shadow-neon-purple transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Registering...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center pt-2 border-t border-neon-border/40 text-xs text-neon-muted">
          <span>Already have an account? </span>
          <Link to="/login" className="text-neon-purple font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
