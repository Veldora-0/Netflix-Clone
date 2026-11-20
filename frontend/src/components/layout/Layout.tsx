import React from 'react';
import { Outlet } from 'react-router-dom';
import { MiniPlayer } from '../player/MiniPlayer';
import { VideoPlayerModal } from '../player/VideoPlayerModal';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neon-dark text-neon-text flex flex-col justify-between selection:bg-neon-accent selection:text-neon-dark">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />

      {/* Global Media Players */}
      <VideoPlayerModal />
      <MiniPlayer />
    </div>
  );
};
