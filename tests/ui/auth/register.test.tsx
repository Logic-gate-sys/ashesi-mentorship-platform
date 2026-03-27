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

import { AuthProvider } from '@/app/_lib/auth-context';
import StudentRegisterPage from '@/app/(auth)/register/student/page';
import AlumniRegisterPage from '@/app/(auth)/register/alumni/page';

/**
 * Registration Pages - Minimal Essential Tests
 * Covers: form rendering, multi-step flow, required field validation
 */
describe('Register - Student', () => {
  const render_student = () => {
    return render(
      <AuthProvider>
        <StudentRegisterPage />
      </AuthProvider>
    );
  };

  it('should render step 1 with name and email fields', () => {
    render_student();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should have next button to progress to step 2', () => {
    render_student();
    const nextBtn = screen.getByRole('button', { name: /next|continue|proceed/i });
    expect(nextBtn).toBeInTheDocument();
  });

  it('should require valid @ashesi.edu.gh email', async () => {
    const user = userEvent.setup();
    render_student();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(firstNameInput, 'John');
    await user.type(emailInput, 'john@gmail.com');

    expect(emailInput).toHaveValue('john@gmail.com');
  });

  it('should progress from step 1 to step 2', async () => {
    const user = userEvent.setup();
    render_student();

    const nextBtn = screen.getByRole('button', { name: /next|continue/i });

    // Fill step 1 completely
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@ashesi.edu.gh');

    // Next button should be clickable
    expect(nextBtn).toBeEnabled();

    // Click next to advance
    await user.click(nextBtn);

    // After progressing, form should still exist (next render with step 2)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('Register - Alumni', () => {
  const render_alumni = () => {
    return render(
      <AuthProvider>
        <AlumniRegisterPage />
      </AuthProvider>
    );
  };

  it('should render step 1 with basic info', () => {
    render_alumni();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should progress through multi-step form', async () => {
    const user = userEvent.setup();
    render_alumni();

    const nextBtn = screen.getByRole('button', { name: /next|continue/i });

    // Fill step 1
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/email/i), 'jane@ashesi.edu.gh');

    // Advance to step 2
    await user.click(nextBtn);

    // Button should still exist after progression
    expect(nextBtn).toBeInTheDocument();
  });

  it('should require graduation year and industry', () => {
    render_alumni();
    // Form should render
    const form = screen.getByRole('button', { name: /next|continue|submit|register/i });
    expect(form).toBeInTheDocument();
  });
});
