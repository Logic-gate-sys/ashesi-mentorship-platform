'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (data: any) => Promise<void>;
  registerAlumni: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'mentor_app_token';
const USER_KEY = 'mentor_app_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveAuthData = useCallback((token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Login failed');
        }

        const data = await response.json();
        saveAuthData(data.token, data.user);
        router.push(data.user.role === 'STUDENT' ? '/student/dashboard' : '/alumni/dashboard');
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuthData, router]
  );

  const registerStudent = useCallback(
    async (data: any) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/register/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Registration failed');
        }

        const result = await response.json();
        saveAuthData(result.token, result.user);
        router.push('/student/dashboard');
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuthData, router]
  );

  const registerAlumni = useCallback(
    async (data: any) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/register/alumni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Registration failed');
        }

        const result = await response.json();
        saveAuthData(result.token, result.user);
        router.push('/alumni/dashboard');
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuthData, router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const updateProfile = useCallback(
    async (data: any) => {
      if (!token) throw new Error('Not authenticated');
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Update failed');
        }

        const result = await response.json();
        saveAuthData(token, result.user);
      } finally {
        setIsLoading(false);
      }
    },
    [token, saveAuthData]
  );

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      // Token might be invalid, logout
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    registerStudent,
    registerAlumni,
    logout,
    updateProfile,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
