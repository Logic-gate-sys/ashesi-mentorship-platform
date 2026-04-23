import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '#/libs_schemas/context/auth-context';

/**
 * Custom render function that includes common providers
 * Use this instead of RTL's render for auth-related components
 * 
 * IMPORTANT: Your test file must mock next/navigation before importing this helper:
 * 
 * vi.mock('next/navigation', () => ({
 *   useRouter: () => ({
 *     push: vi.fn(),
 *     replace: vi.fn(),
 *     prefetch: vi.fn(),
 *     back: vi.fn(),
 *   }),
 *   usePathname: () => '/',
 *   useSearchParams: () => new URLSearchParams(),
 * }));
 */

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuth?: {
    token: string;
    user: any;
  };
}

export function renderWithAuth(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { initialAuth, ...renderOptions } = options || {};

  // Set up localStorage with initial auth data if provided
  if (initialAuth) {
    localStorage.setItem('mentor_app_token', initialAuth.token);
    localStorage.setItem('mentor_app_user', JSON.stringify(initialAuth.user));
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
