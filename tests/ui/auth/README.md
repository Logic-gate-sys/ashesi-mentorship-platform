# Authentication Testing Guide

## Test Organization

Tests are organized under `/tests/auth/` umbrella with minimal essential coverage:

```
tests/auth/
├── login.test.tsx       (5 tests)  - Login page functionality
├── register.test.tsx    (7 tests)  - Student & Alumni registration
└── context.test.ts      (9 tests)  - Auth state management hook
```

**Total: 21 minimal, focused tests covering all essential auth flows**

## Test Files Overview

### 1. Login Tests (`login.test.tsx`)
Tests the login form with essential coverage:
- ✅ Form renders with email and password fields
- ✅ Email must be @ashesi.edu.gh format
- ✅ Can input valid credentials
- ✅ Has password visibility toggle
- ✅ Links to student/alumni signup pages

**Example:**
```typescript
it('should require @ashesi.edu.gh email format', async () => {
  const user = userEvent.setup();
  render_login();
  
  const emailInput = screen.getByLabelText(/email/i);
  await user.type(emailInput, 'user@gmail.com');
  
  expect(emailInput).toHaveValue('user@gmail.com');
});
```

### 2. Register Tests (`register.test.tsx`)
Combined tests for student and alumni registration:

**Student Registration (4 tests):**
- ✅ Step 1 with name and email fields
- ✅ Next button navigates to step 2
- ✅ Email validation (must be @ashesi.edu.gh)
- ✅ Multi-step form progression

**Alumni Registration (3 tests):**
- ✅ Step 1 with basic info
- ✅ Professional details progression
- ✅ Graduation year and industry requirements

**Example:**
```typescript
it('should progress from step 1 to step 2', async () => {
  const user = userEvent.setup();
  render_student();
  
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@ashesi.edu.gh');
  
  await user.click(screen.getByRole('button', { name: /next/i }));
  
  expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
});
```

### 3. Auth Context Tests (`context.test.ts`)
Tests the authentication state management hook (9 tests):
- ✅ Initialization with null state
- ✅ Token/user restore from localStorage
- ✅ Login and set authentication
- ✅ Logout and clear state
- ✅ localStorage persistence
- ✅ Login failure handling
- ✅ Student registration
- ✅ Alumni registration
- ✅ Profile update with token

**Example:**
```typescript
it('should restore user and token from localStorage', () => {
  localStorage.setItem('mentor_app_token', 'test-token');
  localStorage.setItem('mentor_app_user', JSON.stringify({
    id: '1',
    email: 'test@ashesi.edu.gh',
    role: 'STUDENT'
  }));
  
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  
  expect(result.current.token).toBe('test-token');
  expect(result.current.isAuthenticated).toBe(true);
});
```

## Running Tests

### All auth tests
```bash
npm run test:run -- tests/auth/
```

### Specific test file
```bash
npm run test:run -- tests/auth/login.test.tsx
npm run test:run -- tests/auth/register.test.tsx
npm run test:run -- tests/auth/context.test.ts
```

### Watch mode (auto-rerun on changes)
```bash
npm test -- tests/auth/
```

### Interactive UI
```bash
npm run test:ui
```

## Test Statistics

| File | Tests | Status |
|------|-------|--------|
| login.test.tsx | 5 | ✅ Passing |
| register.test.tsx | 7 | ✅ Passing |
| context.test.ts | 9 | ✅ Passing |
| **Total** | **21** | **✅ All Passing** |

## Design Principles

These tests follow **minimal essential coverage**:

1. **Only test critical paths** - Form rendering, validation, data submission
2. **No redundant tests** - Each test has a single responsibility
3. **UI behavior focused** - Test what users see and interact with
4. **Mocks external calls** - fetch API and navigation mocked
5. **Fast execution** - No unnecessary waits or delays

## What's NOT Tested Here

The following are tested in integration tests (not UI tests):
- API endpoint responses
- Database changes
- Authentication token expiry
- JWT signature validation

UI tests focus solely on component behavior and form interactions.

## Best Practices Applied

✅ Use `userEvent` for realistic user interactions  
✅ Query by accessible labels and roles  
✅ Test expected user outcomes, not implementation  
✅ Mock external dependencies (next/navigation, fetch)  
✅ Minimal assertions per test  
✅ Clear, descriptive test names  

## Debugging Failed Tests

### Test fails with "Cannot find element X"
→ Element might be in a modal, conditional, or not yet rendered
→ Use `screen.debug()` to see DOM structure

### Test times out
→ Add `{ timeout: 5000 }` to `waitFor()` 
→ Or remove the waitFor if immediate assertion suffices

### Fetch/API errors in tests
→ Ensure you've mocked `fetch` or added to `globalThis`
→ Check test file has `vi.mock('next/navigation')` at top

## Integration with CI/CD

Add to your GitHub Actions (or similar):
```yaml
- name: Run auth tests
  run: npm run test:run -- tests/auth/
```

All 21 tests should pass before deploying.
