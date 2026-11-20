import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Film,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile & profile menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Series', path: '/series' },
    { label: 'Channels', path: '/channels' },
    { label: 'Mood Finder', path: '/mood', highlight: true },
    { label: 'Quiz', path: '/quiz' },
    { label: 'My List', path: '/my-list' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neon-dark/90 backdrop-blur-md border-b border-neon-border/60 shadow-lg py-3'
          : 'bg-gradient-to-b from-neon-dark/90 via-neon-dark/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Custom NEONFLIX Brand Glyph */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-accent via-neon-purple to-neon-dark p-0.5 shadow-neon-cyan">
              <div className="w-full h-full bg-neon-dark rounded-[6px] flex items-center justify-center">
                <span className="font-display font-black text-neon-accent text-lg tracking-tighter">N</span>
              </div>
            </div>
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-wider text-neon-text">
              NEON<span className="text-neon-accent">FLIX</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-neon-accent bg-neon-surface/80 border border-neon-accent/30 shadow-sm'
                      : link.highlight
                      ? 'text-neon-accent hover:text-neon-accent hover:bg-neon-surface/40'
                      : 'text-neon-muted hover:text-neon-text hover:bg-neon-surface/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Auth & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <Link
            to="/search"
            className="w-10 h-10 rounded-xl bg-neon-surface/60 hover:bg-neon-surface text-neon-muted hover:text-neon-accent border border-neon-border/60 flex items-center justify-center transition-all"
            title="Search Catalogue (/)"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* User Account / Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-surface/80 hover:bg-neon-surface text-neon-text border border-neon-border/80 transition-all text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-accent text-neon-dark flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neon-surface/95 border border-neon-border shadow-2xl p-2 backdrop-blur-xl z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-neon-border/60 mb-1">
                    <p className="text-xs font-semibold text-neon-text truncate">{user.name}</p>
                    <p className="text-[11px] text-neon-muted truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/my-list"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neon-text hover:bg-neon-card transition-colors"
                  >
                    <Film className="w-4 h-4 text-neon-accent" />
                    <span>My Watchlist</span>
                  </Link>
                  <Link
                    to="/mood"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neon-text hover:bg-neon-card transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-neon-purple" />
                    <span>Mood Finder</span>
                  </Link>
                  <Link
                    to="/quiz"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neon-text hover:bg-neon-card transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-neon-amber" />
                    <span>Movie Quiz</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-colors mt-1 border-t border-neon-border/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neon-surface hover:bg-neon-surface-hover text-neon-text border border-neon-accent/50 text-xs font-bold shadow-sm hover:shadow-neon-cyan transition-all"
            >
              <User className="w-4 h-4 text-neon-accent" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 rounded-xl bg-neon-surface text-neon-text border border-neon-border/60 flex items-center justify-center"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-neon-border bg-neon-dark/95 backdrop-blur-2xl px-6 py-4 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'text-neon-accent bg-neon-surface/80 border border-neon-accent/30'
                  : 'text-neon-muted hover:text-neon-text hover:bg-neon-surface/40'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
