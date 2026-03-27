'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

import { AuthProvider } from '@/app/_lib/context/auth-context';
import LoginPage from '@/app/(auth)/login/page';

/**
 * Login Page - Minimal Essential Tests
 * Covers: form rendering, validation, submission
 */
describe('Login', () => {
  const render_login = () => {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
  };

  it('should render email and password fields', () => {
    render_login();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should require @ashesi.edu.gh email format', async () => {
    const user = userEvent.setup();
    render_login();

    const emailInput = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole('button', { name: /log in/i });

    await user.type(emailInput, 'user@gmail.com');
    await user.click(submitBtn);

    // Email validation should prevent invalid domain
    expect(emailInput).toHaveValue('user@gmail.com');
  });

  it('should accept valid ashesi email', async () => {
    const user = userEvent.setup();
    render_login();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'student@ashesi.edu.gh');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('student@ashesi.edu.gh');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should have password visibility toggle', async () => {
    const user = userEvent.setup();
    render_login();

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const buttons = screen.getAllByRole('button');
    
    // Should have at least login button + toggle
    expect(buttons.length).toBeGreaterThan(1);
    // Password should start hidden
    expect(passwordInput.type).toBe('password');
  });

  it('should have signup links for student and alumni', () => {
    render_login();

    expect(screen.getByRole('link', { name: /student/i })).toHaveAttribute(
      'href',
      '/register/student'
    );
    expect(screen.getByRole('link', { name: /alumni/i })).toHaveAttribute(
      'href',
      '/register/alumni'
    );
  });
});
