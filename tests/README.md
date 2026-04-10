# Test Suite - TDD with Vitest

This test folder is structured for Test-Driven Development using **Vitest**, **React Testing Library**, and **Supertest**.

## Folder Structure

```
tests/
├── auth/              # Auth component tests - START HERE (21 minimal tests)
│   ├── login.test.tsx
│   ├── register.test.tsx
│   ├── context.test.ts
│   └── README.md
├── integration/       # API endpoint tests (supertest)
├── unit/             # Utility and schema tests
├── fixtures/         # Reusable test data
├── helpers/          # Test utilities and database helpers
├── setup/            # Global and per-test setup files
└── README.md
```

## Test Categories

### Unit Tests (`tests/unit/`)

- Test individual functions and utilities in isolation
- Mock external dependencies
- Fast execution
- Examples: validators, formatters, utility functions

**Pattern:** `*.test.ts`

```bash
npm run test -- tests/unit
```

### Integration Tests (`tests/integration/`)

- Test API endpoints and workflows
- Use real or mocked databases
- Test multiple components together
- Examples: API routes, database operations

**Pattern:** `*.test.ts`

```bash
npm run test -- tests/integration
```

### Auth Component Tests (`tests/auth/`) **21 Minimal Tests**

Test authentication pages and hooks with minimal essential coverage.

**Files:**

- `login.test.tsx` (5 tests) - Login form, validation, submission
- `register.test.tsx` (7 tests) - Student & Alumni registration flows
- `context.test.ts` (9 tests) - Auth state management, token persistence

See [tests/auth/README.md](auth/README.md) for detailed documentation.

```bash
npm run test:run -- tests/auth/
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test category
npm run test -- tests/unit

# Run tests matching a pattern
npm run test -- --grep "Auth"

# Run with coverage
npm run test -- --coverage
```

## Setup Files

- `setup/globalSetup.ts` - Runs once before all tests (database seeding, etc.)
- `setup/setup.ts` - Runs before each test file

## Test Fixtures and Helpers

### Fixtures (`tests/fixtures/`)

Prebuilt test data to reuse across tests:

- `user-fixtures.ts` - Mock user, profile, and relationship data
- `api-fixtures.ts` - Request payloads and API test data

### Database Utilities (`tests/helpers/test-db-utils.ts`)

- `clearDatabase()` - Clean all tables
- `createTestUser()` - Create test user
- `createTestStudent()` - Create student profile
- `createTestAlumni()` - Create alumni profile
- `disconnectDatabase()` - Cleanup Prisma connection

### UI Testing Utilities (`tests/helpers/render-with-providers.tsx`)

- `renderWithAuth()` - Render component with AuthProvider and optional initial auth state
- Re-exports all React Testing Library utilities for consistent imports

**Usage:**

```typescript
import { renderWithAuth, screen, waitFor } from '@/tests/helpers/render-with-providers';

// Render with no auth
renderWithAuth(<LoginPage />);

// Render with initial auth state
renderWithAuth(<Dashboard />, {
  initialAuth: {
    token: 'test-token',
    user: { id: '1', email: 'test@ashesi.edu.gh', role: 'STUDENT' }
  }
});
```

## Example Usage

### Unit Test

```typescript
import { describe, it, expect } from 'vitest';

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});
```

### Integration Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { clearDatabase, createTestUser } from '../../helpers/test-db-utils';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should register a new student', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', ... }),
    });
    expect(response.status).toBe(201);
  });
});
```

### UI Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth } from '../../helpers/render-with-providers';
import LoginPage from '@/app/(auth)/login/page';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@ashesi.edu.gh');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    
    // Assert submission behavior
  });
});
```

## Next Steps

1. **Install dependencies for UI testing** (if needed):

   ```bash
   npm install -D @testing-library/react @testing-library/jest-dom jsdom
   ```

2. **Update vitest.config.ts** if using React Testing Library:

   ```typescript
   import { defineConfig } from 'vitest/config'

   export default defineConfig({
     test: {
       environment: 'jsdom',
       // ... rest of config
     },
   })
   ```

3. **Start writing tests** using the templates in each test category directory

## TDD Workflow

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests passing
4. **Repeat**: For each feature

## Best Practices

### General

- One assertion per test (when possible)
- Descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies
- Isolate tests (no shared state)
- Use fixtures for data reuse
- Don't test implementation details
- Don't skip the Red phase
- Don't mix test categories (unit/integration/ui)
- Don't use `any` in tests

# # UI Testing Specific

- Query by accessible roles: `getByRole('button')`
- Query by labels: `getByLabelText(/password/i)`
- Use `userEvent` for user interactions (not `fireEvent`)
- Use `waitFor()` for async state updates
- Test user behavior, not component internals
- Test validation messages after user interaction
- Don't query by `testId` (test implementation)
- Don't mock React Router or Next.js (use realistic navigation)
- Don't test CSS styles (test functionality instead)
- Don't query by Component names

# uth UI Testing

- Always wrap auth components with `AuthProvider` in tests
- Use `renderWithAuth()` helper for consistency
- Mock fetch API for login/register endpoints
- Test form validation before submission
- Test error handling and display
- Test multi-step forms by completing each step separately

**Example:**

```typescript
import { renderWithAuth, screen, waitFor } from '@/tests/helpers/render-with-providers';
import userEvent from '@testing-library/user-event';

describe('LoginPage', () => {
  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithAuth(<LoginPage />);
    
    // Input invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    
    // Trigger blur to validate
    await user.tab();
    
    // Assert error message appears
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [TDD Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
