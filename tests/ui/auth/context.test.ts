import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/app/ _libs_and_schemas/context/auth-context';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

/**
 * Auth Context Hook - Minimal Essential Tests
 * Covers: initialization, login, logout, token persistence
 */
describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should restore user and token from localStorage on mount', () => {
    const tokenData = 'test-token-123';
    const userData = { id: '1', email: 'test@ashesi.edu.gh', role: 'STUDENT' };

    localStorage.setItem('mentor_app_token', tokenData);
    localStorage.setItem('mentor_app_user', JSON.stringify(userData));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.token).toBe(tokenData);
    expect(result.current.user?.email).toBe(userData.email);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set user and token on successful login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'login-token',
        user: { id: '1', email: 'student@ashesi.edu.gh', role: 'STUDENT' },
      }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('student@ashesi.edu.gh', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('student@ashesi.edu.gh');
    expect(result.current.token).toBe('login-token');
  });

  it('should clear user and token on logout', async () => {
    // Set initial auth state
    localStorage.setItem('mentor_app_token', 'test-token');
    localStorage.setItem('mentor_app_user', JSON.stringify({
      id: '1',
      email: 'test@ashesi.edu.gh',
      role: 'STUDENT',
    }));

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.token).not.toBeNull();
    });

    // Logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should persist token and user to localStorage on login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'persisted-token',
        user: { id: '2', email: 'alumni@ashesi.edu.gh', role: 'ALUMNI' },
      }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('alumni@ashesi.edu.gh', 'password123');
    });

    const savedToken = localStorage.getItem('mentor_app_token');
    const savedUser = localStorage.getItem('mentor_app_user');

    expect(savedToken).toBe('persisted-token');
    expect(JSON.parse(savedUser!).email).toBe('alumni@ashesi.edu.gh');
  });

  it('should handle login failure gracefully', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      try {
        await result.current.login('wrong@ashesi.edu.gh', 'wrongpass');
      } catch (error) {
        // Error expected
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should register student and set authentication', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'student-token',
        user: { id: '3', email: 'newstudent@ashesi.edu.gh', role: 'STUDENT' },
      }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.registerStudent({
        firstName: 'John',
        lastName: 'Doe',
        email: 'newstudent@ashesi.edu.gh',
        year: 2,
        major: 'Computer Science',
        password: 'SecurePass123!',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('STUDENT');
  });

  it('should register alumni and set authentication', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'alumni-token',
        user: { id: '4', email: 'newalumni@ashesi.edu.gh', role: 'ALUMNI' },
      }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.registerAlumni({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'newalumni@ashesi.edu.gh',
        graduationYear: 2020,
        company: 'Tech Corp',
        jobTitle: 'Software Engineer',
        industry: 'TECHNOLOGY',
        password: 'SecurePass123!',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('ALUMNI');
  });

  it('should update user profile with token', async () => {
    // Set initial auth state
    localStorage.setItem('mentor_app_token', 'test-token');
    localStorage.setItem('mentor_app_user', JSON.stringify({
      id: '1',
      email: 'test@ashesi.edu.gh',
      role: 'STUDENT',
      firstName: 'John',
    }));

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        firstName: 'Jonathan',
        lastName: 'Doe',
      }),
    } as Response);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.token).not.toBeNull();
    });

    await act(async () => {
      await result.current.updateProfile({
        firstName: 'Jonathan',
      });
    });

    // Verify fetch was called with correct token
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/profile'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });
});
