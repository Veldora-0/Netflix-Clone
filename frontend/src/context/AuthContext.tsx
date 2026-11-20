import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Rehydrate auth state on page load
    try {
      const storedToken = localStorage.getItem('neonflix_token');
      const storedUser = localStorage.getItem('neonflix_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('neonflix_token');
      localStorage.removeItem('neonflix_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('neonflix_token', res.token);
      localStorage.setItem('neonflix_user', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.name}!`, 'success');
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'Login failed. Please check credentials.';
      showToast(message, 'error');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const res = await api.register(name, email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('neonflix_token', res.token);
      localStorage.setItem('neonflix_user', JSON.stringify(res.user));
      showToast(`Welcome to NEONFLIX, ${res.user.name}!`, 'success');
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'Registration failed.';
      showToast(message, 'error');
      throw err;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('neonflix_token');
    localStorage.removeItem('neonflix_user');
    showToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
