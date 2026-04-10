# UI Testing Implementation Guide

## Current Status

### Fully Passing

1. **Login Component Tests** (17/17 passing)
   - [tests/ui/login.test.tsx](tests/ui/login.test.tsx)
   - All rendering, validation, interaction, accessibility, and error handling tests working
   - Uses React Testing Library with jsdom environment
   - Demonstrates proper pattern for testing auth components

### Partial Success (53/69 Total Tests Passing)

1. **Student Registration Tests** (12/17 passing)
   - [tests/ui/register-student.test.tsx](tests/ui/register-student.test.tsx)
   - Multi-step form rendering and step progression working
   - Some validation tests need adjustment

2. **Alumni Registration Tests** (14/18 passing)
   - [tests/ui/register-alumni.test.tsx](tests/ui/register-alumni.test.tsx)
   - Professional details validation mostly working
   - Industry dropdown tests need refinement

3. **Auth Context Hook Tests** (14/17 passing)
   - [tests/ui/auth-context.test.ts](tests/ui/auth-context.test.ts)
   - State management, login, logout, localStorage tests mostly working
   - Some API mocking scenarios need adjustment

## Architecture & Setup

### Configuration Files Updated

#### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],  // JSX support
  resolve: {
    tsconfigPaths: true
  },
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['**/node_modules/**, **/.git/**'],
    globals: true,
    testTimeout: 10_000,
    globalSetup: ['./tests/setup/globalSetup.ts'],
    setupFiles: ['./tests/setup/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom',  // For React component testing
    pool: 'threads',
  },
});
```

#### package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest --run"
  }
}
```

### Test Environment Setup

#### Imports Required in Test Files

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';  // Extended matchers
import userEvent from '@testing-library/user-event';

// Mock Next.js navigation before importing auth components
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
```

## Test Pattern Examples

### Component Testing (React Testing Library)

```typescript
describe('LoginPage Component', () => {
  it('should render login form with all required fields', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should fill form and submit', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><LoginPage /></AuthProvider>);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'student@ashesi.edu.gh');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('student@ashesi.edu.gh');
  });
});
```

### Hook Testing

```typescript
describe('useAuth Hook', () => {
  it('should initialize with null user and token', () => {
    // Clear localStorage
    localStorage.clear();

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user and token on successful login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'test-token',
        user: { id: '1', email: 'test@ashesi.edu.gh', role: 'STUDENT' }
      })
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@ashesi.edu.gh', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@ashesi.edu.gh');
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests once
npm run test:run

# Run specific test file
npm run test:run -- tests/ui/login.test.tsx

# Run with interactive UI
npm run test:ui

# Watch mode (default with 'test' script)
npm test

# Run with coverage (when configured)
npm run test:run -- --coverage
```

### Expected Output

```
✓ tests/ui/login.test.tsx (17 tests)
✓ tests/ui/register-student.test.tsx (17 tests)
✓ tests/ui/register-alumni.test.tsx (18 tests)
✓ tests/ui/auth-context.test.ts (17 tests)

Test Files  4 passed (4)
Tests       69 passed (69)
```

## Helper Utilities

### renderWithAuth Helper

Located in [tests/helpers/render-with-providers.tsx](tests/helpers/render-with-providers.tsx)

```typescript
import { renderWithAuth } from '@/tests/helpers/render-with-providers';

// Use in tests
const auth = {
  token: 'test-token',
  user: { 
    id: '1', 
    email: 'test@ashesi.edu.gh', 
    role: 'STUDENT',
    firstName: 'John',
    lastName: 'Doe'
  }
};

render(<LoginPage />, {
  initialAuth: auth
});
```

## Best Practices Applied

1. **Query Selection**
   - Prefer `getByRole('button', { name: /text/i })`
   - Use `getByLabelText(/label/i)` for form inputs
   - Avoid querying by testId or component name

2. **User Interactions**
   - Use `userEvent` for realistic user behavior
   - Don't use `fireEvent` (except for special cases)

3. **Async Operations**
   -Use `await waitFor()` for async state updates
   -Use `act()` when updating hook state
   -Don't skip async updates

4. **Accessibility**
   -Test with labels and semantic HTML
   -Verify keyboard navigation
   -Don't ignore ARIA roles

## Debugging Failed Tests

### Common Issues & Solutions

1. **"Cannot find element with text X/Y/Z"**
   - Check: Element might be inside hidden popup or conditionally rendered
   - Solution: Check for element visibility with `screen.getByRole()` instead

2. **"Invalid Chai property: toBeInTheDocument"**
   - Check: Missing `import '@testing-library/jest-dom'`
   - Solution: Add import at top of test file

3. **"Expected app router to be mounted"**
   - Check: Component uses `useRouter()` from next/navigation
   - Solution: Add `vi.mock('next/navigation', ...)` before importing components

4. **Tests timeout with waitFor()**
   - Check: State update might not be triggering
   - Solution: Verify form validation mode is `'onBlur'` or `'onTouched'`, not `'onSubmit'`

## Next Steps to Complete

1. **Fix remaining validation tests** (16 failing)
   - Align with login.test.tsx pattern (test behavior, not implementation)
   - Simplify overly-specific assertions

2. **Add integration test coverage**
   - Create `tests/integration/` test walkthroughs
   - Test API calls with real database

3. **Add unit tests**
   - Test utility functions (jwt.ts, password.ts, schemas)
   - Test context hook directly with mocked fetch

4. **Setup coverage reporting**
   - Install @vitest/coverage-v8
   - Add coverage thresholds to CI/CD

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [jsdom Documentation](https://github.com/jsdom/jsdom)
