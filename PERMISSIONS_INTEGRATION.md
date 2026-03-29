# Permission System Integration Guide

This guide explains how to integrate the ABAC (Attribute-Based Access Control) permission system throughout the API routes and database layer to ensure users are only exposed to data they're authorized to access.

## Architecture

The permission system has three layers:

1. **Engine** (`app/_lib/abac/engine.ts`): Defines permissions based on user roles and attributes
2. **Middleware** (`app/_lib/abac/middleware.ts`): Provides helpers to extract user and check permissions
3. **Routes** (`app/api/**`): Apply permission filters to database queries

## Quick Start

### 1. Import Requirements

For any API route that needs permission-based filtering:

```typescript
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
```

### 2. Pattern for POST/CREATE Endpoints

```typescript
export async function POST(request: NextRequest) {
  try {
    // Check authentication & authorization
    const authResult = await requirePermission(request, 'session', 'create')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Continue with business logic
    const session = await prisma.session.create({
      data: { /* ... */ }
    })

    return successResponse(session, 'Created successfully', 201)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

### 3. Pattern for GET/LIST Endpoints

```typescript
export async function GET(request: NextRequest) {
  try {
    // Check authentication & authorization
    const authResult = await requirePermission(request, 'session', 'list')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Parse query params
    const queryResult = parseQueryParams(request, listSessionsQuerySchema)
    if (!queryResult.success) {
      return queryResult.error
    }

    const { status, limit, offset } = queryResult.data

    // **KEY: Apply permission filter to database query**
    const permissionFilter = buildPermissionFilter(permissions, 'session', 'list')

    // Combine with other filters
    const whereClause = {
      ...permissionFilter,
      ...(status && { status })
    }

    // Get total and items
    const total = await prisma.session.count({ where: whereClause })
    const items = await prisma.session.findMany({
      where: whereClause,
      include: { /* relations */ },
      take: limit,
      skip: offset
    })

    return paginatedResponse(items, limit, offset, total)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

### 4. Pattern for PATCH/UPDATE Endpoints

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const authResult = await requirePermission(request, 'session', 'update')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Get the resource
    const session = await prisma.session.findUnique({
      where: { id: params.sessionId }
    })

    if (!session) {
      return notFoundResponse('Session')
    }

    // **KEY: Check permission with resource data context**
    const hasPermission = permissions.can(
      'session',
      'update',
      { alumniId: session.alumniId }
    )

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // **KEY: Filter fields based on permissions**
    const updateData = permissions.pickPermittedFields(
      'session',
      'update',
      parseResult.data,
      { alumniId: session.alumniId }
    )

    const updated = await prisma.session.update({
      where: { id: params.sessionId },
      data: updateData
    })

    return successResponse(updated)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

### 5. Pattern for DELETE Endpoints

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const authResult = await requirePermission(request, 'session', 'delete')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Get the resource
    const session = await prisma.session.findUnique({
      where: { id: params.sessionId }
    })

    if (!session) {
      return notFoundResponse('Session')
    }

    // Check permission with resource context
    const hasPermission = permissions.can(
      'session',
      'delete',
      { alumniId: session.alumniId }
    )

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.session.delete({
      where: { id: params.sessionId }
    })

    return successResponse(null, 'Deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

## Key Concepts

### `requirePermission(request, resource, action)`

- Extracts the user from JWT in Authorization header
- Gets the user's permissions from the ABAC engine
- Checks if the user has permission for the resource/action
- Returns `{ user, permissions }` or `NextResponse` with 401/403

### `buildPermissionFilter(permissions, resource, action)`

- Builds a Prisma-compatible `where` clause based on user permissions
- Ensures database queries only return authorized resources
- Handles OR conditions (e.g., user can see own items OR all items if admin)

### `permissions.can(resource, action, data?, field?)`

- Check if permission is allowed
- `data` parameter provides context (e.g., ownership check)
- `field` parameter checks field-level access

### `permissions.pickPermittedFields(resource, action, newData, data?)`

- Filters object to only include fields the user can update
- Prevents users from updating restricted fields
- Example: Students can only update certain profile fields, admins can update all

## Resource Types

The system supports these resources:

- `mentorship_request` - Mentorship requests between students and alumni
- `session` - One-on-one sessions
- `session_feedback` - Feedback on completed sessions
- `availability` - Alumni availability slots
- `conversation` - Direct message conversations
- `message` - Individual messages
- `notification` - User notifications
- `user` - User account data
- `user_profile` - Student/Alumni profile data

## Common Actions

- `create` - Create new resource
- `read` - View single resource
- `update` - Modify resource
- `delete` - Remove resource
- `list` - View multiple resources with filters
- Custom actions: `accept`, `decline` (for requests)

## Permission Rules by Role

### ADMIN
- Full access to all resources and actions
- Can create, read, update, delete any resource
- No restrictions on any fields

### STUDENT
- Create mentorship requests → `permission_filter: {}`
- View own requests → `permission_filter: { studentId: studentProfile.id }`
- Attend own sessions → `permission_filter: { studentId: studentProfile.id }`
- Participate in conversations → `permission_filter: { participantId: userId }`
- Update limited profile fields (bio, linkedin, interests)

### ALUMNI
- View requests received → `permission_filter: { alumniId: alumniProfile.id }`
- Accept/decline requests → `permission_filter: { alumniId: alumniProfile.id }`
- Host own sessions → `permission_filter: { alumniId: alumniProfile.id }`
- Create/update availability → `permission_filter: { alumniId: alumniProfile.id }`
- Participate in conversations → `permission_filter: { participantId: userId }`
- Update limited profile fields (bio, linkedin, skills, isAvailable)

## Examples

### Example 1: Alumni Listing Their Sessions

```typescript
// GET /api/alumni/sessions
const authResult = await requirePermission(request, 'session', 'list')
const { permissions } = authResult

// Returns only this alumni's sessions
const filter = buildPermissionFilter(permissions, 'session', 'list')
// Generates: { alumniId: "alumni-123" }

const sessions = await prisma.session.findMany({ where: filter })
```

### Example 2: Student Creating Session (Not Allowed)

```typescript
// POST /api/sessions (by student trying to create)
const authResult = await requirePermission(request, 'session', 'create')
// Returns 403 Forbidden - students can't create sessions
```

### Example 3: Updating with Field Restrictions

```typescript
// PATCH /api/user/profile (by student)
const authResult = await requirePermission(request, 'user_profile', 'update')
const { permissions } = authResult

// Input data: { bio, linkedin, interests, interests, email, passwordHash }
const updatedData = permissions.pickPermittedFields(
  'user_profile',
  'update',
  inputData,
  { userId: "student-123" }
)
// Returns only: { bio, linkedin, interests }
// Filters out: email, passwordHash
```

## Checklist for API Routes

When creating or updating an API route:

- [ ] Import `requirePermission` and `buildPermissionFilter`
- [ ] Call `requirePermission()` early in the handler
- [ ] Check if result is `NextResponse` and return it
- [ ] Destructure `{ user, permissions }` from authResult
- [ ] For GET/LIST: Use `buildPermissionFilter()` in database query
- [ ] For POST: Capture permissions (may be needed for notifications)
- [ ] For PATCH/DELETE: Check `permissions.can()` with resource context
- [ ] For PATCH: Use `pickPermittedFields()` to filter updates
- [ ] Return appropriate status codes (201 for create, 403 for forbidden)

## Database Layer Security

All list/read operations **must** apply the permission filter:

```typescript
// ❌ WRONG - exposes all data
const sessions = await prisma.session.findMany()

// ✅ RIGHT - filters by permissions
const filter = buildPermissionFilter(permissions, 'session', 'list')
const sessions = await prisma.session.findMany({ where: filter })
```

This ensures:
1. Database queries are explicit about access control
2. No data leaks if authorization middleware is bypassed
3. Permissions are enforced at the data layer
4. Easy to audit which resources each user can access

## Testing Permission Filters

In integration tests, verify:

1. Users can only see their own data
2. Unauthorized actions return 403
3. Permission filters correctly exclude restricted resources
4. Field restrictions prevent bulk updates
5. Admin override works correctly

Example test:

```typescript
describe('Session List Permissions', () => {
  it('student sees only their sessions', async () => {
    const studentSessions = await api.get('/api/sessions')
      .set('Authorization', `Bearer ${studentToken}`)

    expect(studentSessions.body.data).toHaveLength(2)
    expect(studentSessions.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ studentId: student.id })
      ])
    )
  })

  it('alumni sees only their hosted sessions', async () => {
    const alumniSessions = await api.get('/api/sessions')
      .set('Authorization', `Bearer ${alumniToken}`)

    expect(alumniSessions.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ alumniId: alumni.id })
      ])
    )
  })

  it('admin sees all sessions', async () => {
    const adminSessions = await api.get('/api/sessions')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(adminSessions.body.data).toHaveLength(4) // all sessions
  })
})
```

## Migration Path

If you have existing routes without permission filters:

1. Add `buildPermissionFilter()` to GET endpoints first
2. Add permission checks to POST/PATCH endpoints
3. Run tests to verify data isolation
4. Add field-level filtering to sensitive PATCH endpoints
5. Update integration tests to verify permission enforcement

## Need Help?

- Check engine.ts for permission definitions
- Look at updated routes (student/requests, sessions) for examples
- Review permissions-utils.ts for helper functions
- Add permission checks systematically, one route at a time
