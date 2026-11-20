import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neon-border/60 bg-neon-dark/80 pt-12 pb-16 px-4 md:px-8 text-xs text-neon-muted mt-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-neon-accent to-neon-purple p-0.5">
                <div className="w-full h-full bg-neon-dark rounded-[4px] flex items-center justify-center">
                  <span className="font-display font-black text-neon-accent text-xs">N</span>
                </div>
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-neon-text">
                NEON<span className="text-neon-accent">FLIX</span>
              </span>
            </div>
            <p className="text-neon-muted leading-relaxed max-w-xs">
              A modern entertainment discovery and streaming platform built with midnight-cinema aesthetics, mood matching, and interactive trivia.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-display font-bold text-neon-text text-sm mb-3">Discovery</h5>
            <ul className="space-y-2">
              <li><Link to="/movies" className="hover:text-neon-accent transition-colors">Movie Catalogue</Link></li>
              <li><Link to="/series" className="hover:text-neon-accent transition-colors">Series & TV Shows</Link></li>
              <li><Link to="/channels" className="hover:text-neon-accent transition-colors">Channels & Hubs</Link></li>
              <li><Link to="/search" className="hover:text-neon-accent transition-colors">Title Search</Link></li>
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h5 className="font-display font-bold text-neon-text text-sm mb-3">Signature Features</h5>
            <ul className="space-y-2">
              <li><Link to="/mood" className="text-neon-accent hover:underline">Smart Mood Finder</Link></li>
              <li><Link to="/quiz" className="hover:text-neon-purple transition-colors">Movie Quiz Challenge</Link></li>
              <li><Link to="/my-list" className="hover:text-neon-accent transition-colors">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Media Attribution & Technical Disclaimers */}
          <div className="space-y-2">
            <h5 className="font-display font-bold text-neon-text text-sm mb-3">Open Media Attribution</h5>
            <p className="leading-relaxed">
              Video playback streams utilize freely licensed open films produced by the Blender Foundation (Creative Commons CC-BY 3.0), including <em>Tears of Steel</em>, <em>Big Buck Bunny</em>, and <em>Sintel</em>.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-neon-accent">
              <span className="w-2 h-2 rounded-full bg-neon-accent animate-pulse" />
              <span>Backend REST API: v1.0.0-mvp Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neon-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 NEONFLIX. Developed for College Lab / Applied AI Portfolio.</p>
          <div className="flex items-center gap-4">
            <span className="text-neon-muted">React + Vite + TypeScript + Tailwind</span>
            <span>•</span>
            <span className="text-neon-muted">Node.js Express REST Backend</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
