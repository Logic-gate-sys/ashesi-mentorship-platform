# Integration Test Refactoring Guide

## Purpose
This guide helps ensure all integration tests follow best practices:
- ✅ NO direct database calls in test files
- ✅ All data setup through factory functions
- ✅ All API requests through helper functions
- ✅ Clean separation of concerns

---

## Quick Start: Refactoring a Test File

### Step 1: Replace Imports
```typescript
// ❌ OLD
import request from 'supertest';
import { prisma } from '@/app/_utils/db';

// ✅ NEW
import { authenticatedPost, authenticatedGet, publicPost } from '../helpers/api.helpers';
import { createTestUser, createStudentWithProfile } from '../helpers/factories';
import { generateTestToken } from '../helpers/token.helpers';
```

### Step 2: Remove Helper Functions from Test File
Move all these to factories.ts:
- `createTestUser()` 
- `createStudentProfile()`
- `createAlumniProfile()`
- `getToken()` → becomes `generateTestToken()`
- `createStudentWithProfile()`

### Step 3: Replace beforeAll/afterAll
```typescript
// ❌ OLD
beforeAll(async () => {
  const user = await createTestUser('STUDENT');
  token = await getToken(user.id, 'STUDENT');
});

afterAll(async () => {
  await prisma.user.deleteMany(); // ❌ NO!
});

// ✅ NEW
beforeAll(async () => {
  user = await createTestUser('STUDENT');
  token = await generateTestToken(user.id, 'STUDENT', user.email);
});
// NO afterAll - cleanup happens automatically in setup.ts
```

### Step 4: Replace API Requests
```typescript
// ❌ OLD
const response = await request(BASE_URL)
  .post('/api/auth/login')
  .send({ email, password });

// ✅ NEW
const response = await publicPost('/api/auth/login', { email, password });
```

### Step 5: Add Factory Calls Where Needed
```typescript
// ❌ OLD - Direct DB call in test
const studentUser = await prisma.user.create({
  data: { email: 'test@ashesi.edu.gh', ... }
});

// ✅ NEW
const studentUser = await createTestUser('STUDENT');
```

---

## Available Helper Functions

### `api.helpers.ts`
```typescript
publicPost(endpoint: string, body?: any)        // Unauthenticated POST
publicGet(endpoint: string)                     // Unauthenticated GET
authenticatedPost(endpoint: string, token: string, body?: any)
authenticatedGet(endpoint: string, token: string)
authenticatedPatch(endpoint: string, token: string, body?: any)
authenticatedDelete(endpoint: string, token: string)
```

### `factories.ts`
```typescript
createTestUser(role, overrides?)                          // Create user by role
createStudentWithProfile(userOverrides?, profileOverrides?)
createAlumniWithProfile(userOverrides?, profileOverrides?)
createStudentProfile(userId, overrides?)
createAlumniProfile(userId, overrides?)
createMentorshipCycle(overrides?)
```

### `token.helpers.ts`
```typescript
generateTestToken(userId, role, email, firstName, lastName, expiresIn?)
generateTestTokens(users: Array<{id, role, email, firstName, lastName}>)
```

---

## Common Patterns

### Pattern 1: Create User and Test API
```typescript
it('should do something', async () => {
  const user = await createTestUser('STUDENT');
  const token = await generateTestToken(user.id, 'STUDENT', user.email);
  
  const response = await authenticatedGet('/api/some-endpoint', token);
  expect(response.status).toBe(200);
});
```

### Pattern 2: Create Student with Profile
```typescript
const { user, profile } = await createStudentWithProfile(
  { firstName: 'John' },
  { yearGroup: 3 }
);
const token = await generateTestToken(user.id, 'STUDENT', user.email);
```

### Pattern 3: Test Multiple Roles
```typescript
const studentUser = await createTestUser('STUDENT');
const alumniUser = await createTestUser('ALUMNI');
const adminUser = await createTestUser('ADMIN');

const studentToken = await generateTestToken(studentUser.id, 'STUDENT', studentUser.email);
const alumniToken = await generateTestToken(alumniUser.id, 'ALUMNI', alumniUser.email);
const adminToken = await generateTestToken(adminUser.id, 'ADMIN', adminUser.email);
```

### Pattern 4: Test Permission Denial
```typescript
it('should deny non-admin access', async () => {
  const studentUser = await createTestUser('STUDENT');
  const studentToken = await generateTestToken(studentUser.id, 'STUDENT', studentUser.email);
  
  const response = await authenticatedGet('/api/admin/users', studentToken);
  expect(response.status).toBe(403);
});
```

---

## What NOT to Do

❌ Do NOT use `prisma` in test files - that's implementation detail
❌ Do NOT create manual `request(BASE_URL).post()` - use api.helpers
❌ Do NOT call `deleteMany()` in afterAll - it's automatic
❌ Do NOT mix database setup and API testing
❌ Do NOT test the database directly - test the API

---

## Files Already Refactored
- [x] auth.test.ts
- [x] admin.test.ts

## Files Needing Refactoring
- [ ] mentorship.test.ts
- [ ] mentor-capacity.test.ts
- [ ] mentorship-cycle.test.ts
- [ ] mentor-dashboard-api.test.ts
- [ ] messaging.test.ts
- [ ] email-notification.test.ts
- [ ] mentor-dashboard.test.tsx

---

## Cleanup
Database cleanup happens automatically:
- `setup.ts` has `afterEach` that calls cleanup
- All tables deleted in proper FK order
- No manual cleanup needed

Example from setup.ts:
```typescript
afterEach(async () => {
  await cleanupDatabase(); // ← This runs after EVERY test
});
```

---

## Running Tests

**Option 1: Run against running backend**
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Run tests
npm run test
```

**Option 2: Skip backend (unit tests only)**
```bash
npm run test tests/unit
```

---

## Benefits of This Pattern

| Before | After |
|--------|-------|
| Tests coupled to DB schema | Tests coupled to API contract |
| Hard to maintain | Easy to maintain |
| Slow (DB operations) | Fast (API patterns) |
| Brittle (DB changes break tests) | Flexible (API is contract) |
| Database logic in tests | Clean test files |
| Duplicate factories | Reusable factories |

