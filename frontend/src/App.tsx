import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ChannelsPage } from './pages/ChannelsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MoodFinderPage } from './pages/MoodFinderPage';
import { MovieQuizPage } from './pages/MovieQuizPage';
import { MoviesPage } from './pages/MoviesPage';
import { MyListPage } from './pages/MyListPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { SeriesPage } from './pages/SeriesPage';
import { TitleDetailsPage } from './pages/TitleDetailsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WatchlistProvider>
            <PlayerProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/series" element={<SeriesPage />} />
                  <Route path="/channels" element={<ChannelsPage />} />
                  <Route path="/mood" element={<MoodFinderPage />} />
                  <Route path="/quiz" element={<MovieQuizPage />} />
                  <Route path="/my-list" element={<MyListPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/title/:id" element={<TitleDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </PlayerProvider>
          </WatchlistProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
