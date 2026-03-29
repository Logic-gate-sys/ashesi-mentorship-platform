# Mentor App - Developer Quick Reference

## Common Patterns

### 1. Creating a Protected API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/_utils/db';
import { requirePermission } from '@/app/_lib/abac/middleware';
import { 
  successResponse, 
  parseRequestBody,
  validationErrorResponse 
} from '@/app/_utils/api-response';
import { myResourceSchema } from '@/app/_schemas/my.schema';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication & Authorization
    const authResult = await requirePermission(
      request, 
      'my_resource', 
      'create',
      { type: 'my_resource' }
    );

    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized/Forbidden
    }

    const { user } = authResult;

    // 2. Parse & Validate Input
    const parseResult = await parseRequestBody(request, myResourceSchema);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const data = parseResult.data;

    // 3. Business Logic
    const resource = await prisma.myResource.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    // 4. Response
    return successResponse(resource, 'Created successfully', 201);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create resource');
  }
}
```

### 2. Creating a Zod Schema

```typescript
import { z } from 'zod';

export const createMyResourceSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform((val) => val?.trim() || null),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags'),
});

export type CreateMyResourceInput = z.infer<typeof createMyResourceSchema>;

// For list queries
export const listMyResourcesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListMyResourcesQuery = z.infer<typeof listMyResourcesQuerySchema>;
```

### 3. List with Pagination

```typescript
import { parseQueryParams, paginatedResponse } from '@/app/_utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Parse query
    const queryResult = parseQueryParams(request, listMyResourcesQuerySchema);
    if (!queryResult.success) {
      return queryResult.error;
    }

    const { limit, offset, sortBy, sortOrder } = queryResult.data;

    // Build where clause
    let where: any = { userId: user.id };

    // Get total
    const total = await prisma.myResource.count({ where });

    // Get items
    const items = await prisma.myResource.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
    });

    return paginatedResponse(items, limit, offset, total);
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch resources');
  }
}
```

### 4. Emitting Socket Events

```typescript
import { 
  broadcastToConversation, 
  notifyUser,
  broadcastToSession 
} from '@/app/_lib/socket';

// Notify a user (personal notification)
await notifyUser(userId, {
  type: 'REQUEST_RECEIVED',
  title: 'New Mentorship Request',
  body: 'You received a new request',
  requestId: request.id,
});

// Broadcast to conversation
broadcastToConversation(conversationId, 'new_message', {
  id: message.id,
  body: message.body,
  senderId: message.senderId,
});

// Broadcast to session
broadcastToSession(sessionId, 'session_started', {
  sessionId,
  timestamp: new Date().toISOString(),
});
```

### 5. Handling ABAC Conditions

```typescript
// Check ownership
const isOwner = resource.userId === user.id;

// Check student/alumni relationship
const isStudent = studentProfile.userId === user.id;
const isAlumni = alumniProfile.userId === user.id;

// Custom resource attributes for ABAC
const resource = {
  type: 'mentorship_request',
  studentId: request.studentId,
  alumniId: request.alumniId,
  status: request.status,
};

const authResult = await requirePermission(
  request,
  'mentorship_request',
  'accept',
  resource // ABAC will check conditions
);
```

---

## Testing Patterns

### Basic Test Structure

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '@/app/_utils/db';

const BASE_URL = 'http://localhost:3000';

describe('My Feature', () => {
  let user: any;
  let token: string;

  beforeAll(async () => {
    // Setup: create test data
    user = await createTestUser('STUDENT');
    token = await getToken(user.id);
  });

  afterAll(async () => {
    // Cleanup: delete test data
    await prisma.user.deleteMany();
  });

  describe('POST /api/my-endpoint', () => {
    it('should succeed with valid input', async () => {
      const response = await request(BASE_URL)
        .post('/api/my-endpoint')
        .set('Authorization', `Bearer ${token}`)
        .send({
          field: 'value',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should validate input', async () => {
      const response = await request(BASE_URL)
        .post('/api/my-endpoint')
        .set('Authorization', `Bearer ${token}`)
        .send({
          field: '', // Invalid
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(BASE_URL)
        .post('/api/my-endpoint')
        .send({ field: 'value' });

      expect(response.status).toBe(401);
    });

    it('should enforce permissions', async () => {
      const otherUser = await createTestUser('ALUMNI');
      const otherToken = await getToken(otherUser.id);

      const response = await request(BASE_URL)
        .post('/api/my-endpoint')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ field: 'value' });

      expect(response.status).toBe(403);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });
});
```

---

## Common HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 400 | Validation error, bad request |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (no permission) |
| 404 | Not found |
| 409 | Conflict (duplicate, state error) |
| 500 | Server error |

---

## ABAC Resource Types

```
'mentorship_request'
'session'
'session_feedback'
'availability'
'user_profile'
'conversation'
'message'
'notification'
'mentorship_cycle'
'user'
```

---

## ABAC Action Types

```
'create'      // POST /endpoint
'read'        // GET /endpoint/:id
'list'        // GET /endpoint
'update'      // PATCH /endpoint/:id
'delete'      // DELETE /endpoint/:id
'accept'      // Custom action (accept request, etc.)
'decline'     // Custom action
'own_data'    // Personal data access
'admin_only'  // Admin-only operations
```

---

## Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "{\"field\": \"Error message\"}", // Optional
  "timestamp": "2026-03-29T10:30:45.123Z"
}
```

---

## Success Response Format

```json
{
  "success": true,
  "data": { /* resource */ },
  "message": "Optional success message",
  "timestamp": "2026-03-29T10:30:45.123Z"
}
```

---

## Paginated Response Format

```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 25,
    "hasMore": true
  },
  "timestamp": "2026-03-29T10:30:45.123Z"
}
```

---

## WebSocket Events Reference

### Client → Server
- `join_conversation`, `leave_conversation`
- `typing`, `stop_typing`
- `join_session`, `leave_session`
- `session_started`, `session_ended`
- `request_received`, `session_reminder`
- `watch_mentor_availability`, `unwatch_mentor_availability`

### Server → Client
- `joined_conversation`, `user_typing`, `user_stopped_typing`
- `joined_session`, `session_user_joined`, `session_user_left`
- `session_started`, `session_ended`
- `notification` (all types)

---

## Useful Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test mentorship.test.ts

# Watch mode (auto-run on change)
npm test -- --watch

# Coverage report
npm test -- --coverage

# UI test runner
npm run test:ui

# Run and exit (CI mode)
npm run test:run

# Database migration
npm run prisma:migrate -- --name "add_field"

# Database seed
npm run seed

# Generate Prisma client
npm run prisma:generate

# Format code
npm run lint -- --fix
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/_lib/abac/` | ABAC system |
| `app/_lib/socket.ts` | WebSocket setup |
| `app/_schemas/` | Zod validation schemas |
| `app/_utils/api-response.ts` | Response utilities |
| `app/api/` | All API endpoints |
| `tests/integration/` | Integration tests |
| `prisma/schema.prisma` | Database schema |

---

## Debugging Tips

1. **Check ABAC policies**: Look in `app/_lib/abac/engine.ts`
2. **Validate schema**: Check relevant file in `app/_schemas/`
3. **Test with curl**: Quick endpoint testing without UI
4. **Check logs**: Always look at console output
5. **Database verify**: Use Prisma Studio: `npm run prisma:studio`
6. **Token issues**: Verify JWT_SECRET and token expiration

---

## Production Checklist

- [ ] Change JWT_SECRET to secure value
- [ ] Set DATABASE_URL to production database
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Set up error logging/monitoring
- [ ] Enable database backups
- [ ] Test all endpoints
- [ ] Run full test suite
- [ ] Setup CI/CD pipeline
