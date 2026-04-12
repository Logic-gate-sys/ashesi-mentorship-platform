'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthConfig, defaultAuthConfig } from './auth.config';
import { studentRegisterSchema, alumniRegisterSchema} from '../schemas/auth.schema';
import { updateStudentProfileSchema, updateAlumniProfileSchema } from '../schemas/user.schema';
import {z} from 'zod'; 

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'MENTEE' | 'MENTOR' | 'ADMIN';
  avatarUrl?: string;
}


// auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  //methods
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (data: z.infer<typeof alumniRegisterSchema>) => Promise<void>;
  registerAlumni: (data: z.infer<typeof studentRegisterSchema>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: z.infer< typeof updateStudentProfileSchema | typeof updateAlumniProfileSchema >) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export interface AuthProviderProps {
  children: React.ReactNode;
  config?: AuthConfig;
}

export function AuthProvider({ children, config = defaultAuthConfig }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isRefreshing = useRef(false);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  // Verify auth on mount by checking if refreshToken cookie exists
  useEffect(() => {
    if (isInitialized) return;
    fetchCurrentUser().finally(() => {
      setIsInitialized(true);
    });
  }, []);

  const getAccessToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(config.accessTokenStorageKey);
  }, [config]);

  const saveAuthData = useCallback((user: User, accessToken: string) => {
    setUser(user);
    // Store access token in sessionStorage (cleared on page close)
    // Store user info in sessionStorage (not the refreshToken - that's in httpOnly cookie)
    sessionStorage.setItem(config.userStorageKey, JSON.stringify(user));
    sessionStorage.setItem(config.accessTokenStorageKey, accessToken);
  }, [config]);

  const clearAuthData = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(config.userStorageKey);
    sessionStorage.removeItem(config.accessTokenStorageKey);
  }, [config]);



  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing.current && refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    isRefreshing.current = true;

    try {
      const res =await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Send refresh_token cookie
      });
      if(!res.ok){
        clearAuthData();
        // redirect to login
        router.push('/login');
        return null
      }
      const data = await res.json();
      const newAccessToken = data.accessToken ; 
      sessionStorage.setItem(config.accessTokenStorageKey, newAccessToken);
      isRefreshing.current = false;
      refreshPromiseRef.current = null;
      return newAccessToken ; 
    }catch(err){
        console.error('Token refresh error:', err);
        clearAuthData();
        router.push('/login');
        return null;
    }
    
  }, [clearAuthData, router, config]);





  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include', // Receive refreshToken cookie
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Login failed');
        }

        const data = await response.json();
        saveAuthData(data.user, data.accessToken);
        router.push(data.user.role === 'MENTEE'? '/mentees' : '/mentors');
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
          credentials: 'include', // Receive refreshToken cookie
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Registration failed');
        }

        const result = await response.json();
        saveAuthData(result.user, result.accessToken);
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
          credentials: 'include', // Receive refreshToken cookie
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.message || 'Registration failed');
        }

        const result = await response.json();
        saveAuthData(result.user, result.accessToken);
        router.push('/mentor');
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuthData, router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout endpoint to clear refresh token cookie on server
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      clearAuthData();
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, clearAuthData]);


  // cache this function result because it's expensive : use call back
  const fetchCurrentUser = useCallback(async () => {
    try {
      const accessToken = getAccessToken();
      // Call /api/auth/me with accessToken
      const response = await fetch('/api/auth/me', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: 'include', // Include refreshToken cookie for fallback
      });

      if (!response.ok) {
        // If 401, try to refresh token and retry
        if (response.status === 401 && accessToken) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry with new token
            const retryResponse = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              credentials: 'include',
            });
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setUser(data.user);
              sessionStorage.setItem(config.userStorageKey, JSON.stringify(data.user));
              return;
            }
          }
        }
        // Not authenticated or token refresh failed
        clearAuthData();
        return;
      }

      const data = await response.json();
      setUser(data.user);
      sessionStorage.setItem(config.userStorageKey, JSON.stringify(data.user));
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      clearAuthData();
    }
  }, [getAccessToken, refreshAccessToken, clearAuthData, config]);
  
  const updateProfile = useCallback(
    async (data: any) => {
      setIsLoading(true);
      try {
        const accessToken = getAccessToken();
        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // Try to refresh token if 401
          if (response.status === 401) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              const retryResponse = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newAccessToken}`,
                },
                credentials: 'include',
                body: JSON.stringify(data),
              });
              if (retryResponse.ok) {
                const result = await retryResponse.json();
                setUser(result.user);
                sessionStorage.setItem(config.userStorageKey, JSON.stringify(result.user));
                return;
              }
            }
          }
          const error = await response.json();
          throw new Error(error.errors?.message || 'Update failed');
        }

        const result = await response.json();
        setUser(result.user);
        sessionStorage.setItem(config.userStorageKey, JSON.stringify(result.user));
      } finally {
        setIsLoading(false);
      }
    },
    [getAccessToken, refreshAccessToken, config]
  );

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && !!getAccessToken(),
    login,
    registerStudent,
    registerAlumni,
    logout,
    updateProfile,
    fetchCurrentUser,
    getAccessToken,
    refreshAccessToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}




// custom auth context to be used 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
