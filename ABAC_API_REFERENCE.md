# Permission System API Reference

Quick reference for all exported functions and types from the ABAC system.

## Engine Exports (`app/_lib/abac/engine.ts`)

### Functions

#### `getUserPermissions(userId: string): Promise<UserPermissions>`
Gets the user's permission object, cached in memory.

```typescript
const permissions = await getUserPermissions(user.id)
```

#### `clearPermissionsCache(userId?: string): void`
Clears the permission cache. Pass userId to clear single user, omit to clear all.

```typescript
// Clear specific user's cache
clearPermissionsCache(user.id)

// Clear all caches
clearPermissionsCache()
```

#### `buildPermissionFilter<Res extends keyof Resources>(permissions, resource, action)`
Creates a Prisma-compatible WHERE clause for filtering queries.

```typescript
const filter = buildPermissionFilter(permissions, 'session', 'list')

// Use in query
const sessions = await prisma.session.findMany({
  where: filter
})
```

**Returns:**
- Student working with sessions: `{ studentId: "user-123-student-id" }`
- Alumni working with sessions: `{ alumniId: "user-456-alumni-id" }`
- Admin: `{}` (no filter - accesses all)

#### `hasPermission(permissions, resource, action, data?, field?): boolean`
Checks if user has permission for an action.

```typescript
// Check basic permission
const canCreate = hasPermission(permissions, 'session', 'create')

// Check with context (requires data conditions)
const canUpdateSession = hasPermission(
  permissions,
  'session',
  'update',
  { alumniId: session.alumniId }
)

// Check field permission
const canUpdateNotes = hasPermission(
  permissions,
  'session',
  'update',
  { alumniId: session.alumniId },
  'notes'
)
```

#### `getPermittedFields(permissions, resource, action, newData, data?): Partial<Data>`
Filters update data to only include fields user can modify.

```typescript
const updateInput = {
  notes: "Updated notes",
  email: "new@email.com",
  password: "newpassword"
}

// Alumni can only update notes, not email/password
const filtered = getPermittedFields(
  permissions,
  'user_profile',
  'update',
  updateInput,
  { userId: user.id }
)

// Result: { notes: "Updated notes" }
```

### Types

#### `UserPermissions`
Return type of `build()` method. Has methods: `can()`, `pickPermittedFields()`, `getPrismaWhere()`

```typescript
const permissions: UserPermissions = await getUserPermissions(userId)
```

#### `Resources` (type)
Object mapping resource types to their conditions and data shapes.

```typescript
type Resources = {
  mentorship_request: {
    action: "create" | "read" | "update" | "delete" | "list" | "accept" | "decline"
    condition: { studentId?: string; alumniId?: string; status?: string }
    data: MentorshipRequest
  }
  session: {
    action: "create" | "read" | "update" | "delete" | "list"
    condition: { studentId?: string; alumniId?: string; status?: string }
    data: Session
  }
  // ... 7 more resources
}
```

## Middleware Exports (`app/_lib/abac/middleware.ts`)

### Functions

#### `extractUserFromRequest(request: NextRequest): Promise<User | null>`
Extracts and validates user from JWT token.

```typescript
const user = await extractUserFromRequest(request)
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Returns user with profiles:**
```typescript
{
  id: "uuid",
  email: "student@email.com",
  role: "STUDENT",
  firstName: "John",
  lastName: "Doe",
  isVerified: true,
  isActive: true,
  studentProfile: { id: "...", userId: "...", ... } | null,
  alumniProfile: { id: "...", userId: "...", ... } | null,
  // ... other fields
}
```

#### `checkPermission<Res>(userId, resource, action, data?): Promise<boolean>`
Standalone permission check without HTTP middleware.

```typescript
const hasAccess = await checkPermission(
  userId,
  'session',
  'update',
  { alumniId: session.alumniId }
)

if (!hasAccess) {
  // Deny access
}
```

#### `requirePermission<Res>(request, resource, action, data?)`
Complete auth + permission check. **Primary function for routes.**

```typescript
const authResult = await requirePermission(
  request,
  'session',
  'list'
)

if (authResult instanceof NextResponse) {
  return authResult // 401 or 403
}

const { user, permissions } = authResult
```

**Returns:**
- `{ user, permissions }` if authorized
- `NextResponse` with 401 if not authenticated
- `NextResponse` with 403 if not authorized

#### `requireAuth(request: NextRequest)`
Auth check only, no permission verification.

```typescript
const authResult = await requireAuth(request)

if (authResult instanceof NextResponse) {
  return authResult // 401
}

const { user } = authResult
```

## Types Exports (`app/_lib/abac/types.ts`)

### Interfaces

#### `UserAttributes`
```typescript
interface UserAttributes {
  id: string
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN'
  email: string
  isVerified: boolean
  isActive: boolean
}
```

#### `ResourceAttributes`
```typescript
interface ResourceAttributes {
  type: ResourceType
  ownerId?: string
  studentId?: string
  alumniId?: string
  participantId?: string
  creatorId?: string
  userId?: string
  status?: string
  isLocked?: boolean
  isAvailable?: boolean
  [key: string]: any
}
```

#### `AbacContext`
```typescript
interface AbacContext {
  user: UserAttributes
  resource?: ResourceAttributes
  action: ActionType
  environment?: {
    timestamp?: Date
    ipAddress?: string
    method?: string
    [key: string]: any
  }
}
```

#### `PermissionDecision`
```typescript
interface PermissionDecision {
  allowed: boolean
  reason?: string
  resourceFilter?: any
}
```

### Types

#### `UserRole`
```typescript
type UserRole = 'STUDENT' | 'ALUMNI' | 'ADMIN'
```

#### `ResourceType`
```typescript
type ResourceType =
  | 'mentorship_request'
  | 'session'
  | 'session_feedback'
  | 'availability'
  | 'conversation'
  | 'message'
  | 'notification'
  | 'user'
  | 'user_profile'
```

#### `ActionType`
```typescript
type ActionType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'accept'
  | 'decline'
```

#### `AuthResult<T>`
```typescript
type AuthResult<T = any> = 
  | { user: T; permissions: any }
  | NextResponse
```

## Permissions Utilities (`app/_lib/abac/permissions-utils.ts`)

### Functions

#### `getUserForPermissions(userId: string)`
Load user with profiles for permission evaluation.

```typescript
const user = await getUserForPermissions(userId)
```

#### `getAndCacheUserPermissions(userId: string)`
Get permissions with caching.

```typescript
const permissions = await getAndCacheUserPermissions(userId)
```

### Objects

#### `permissionFilters`
Pre-built filter builders for common resources.

```typescript
// Example usage (rarely needed - use buildPermissionFilter instead)
const filter = permissionFilters.session(permissions)
```

## Usage Patterns

### Pattern 1: List with Permissions
```typescript
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'

export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'list')
  if (authResult instanceof NextResponse) return authResult

  const { user, permissions } = authResult

  const filter = buildPermissionFilter(permissions, 'session', 'list')
  const sessions = await prisma.session.findMany({ where: filter })

  return paginatedResponse(sessions, limit, offset, total)
}
```

### Pattern 2: Create with Auth
```typescript
import { requirePermission } from '@/app/_lib/abac/middleware'

export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'create')
  if (authResult instanceof NextResponse) return authResult

  const { user, permissions } = authResult

  // Create resource
  const session = await prisma.session.create({ data: {...} })

  return successResponse(session, 'Created', 201)
}
```

### Pattern 3: Update with Field Filtering
```typescript
import { requirePermission } from '@/app/_lib/abac/middleware'

export async function PATCH(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'update')
  if (authResult instanceof NextResponse) return authResult

  const { user, permissions } = authResult

  const session = await prisma.session.findUnique({ 
    where: { id: sessionId } 
  })

  // Check permission with context
  if (!permissions.can('session', 'update', { alumniId: session.alumniId })) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Filter allowed fields
  const updateData = permissions.pickPermittedFields(
    'session',
    'update',
    inputData,
    { alumniId: session.alumniId }
  )

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: updateData
  })

  return successResponse(updated)
}
```

### Pattern 4: Delete with Permission
```typescript
import { requirePermission } from '@/app/_lib/abac/middleware'

export async function DELETE(request: NextRequest) {
  const authResult = await requirePermission(request, 'session', 'delete')
  if (authResult instanceof NextResponse) return authResult

  const { user, permissions } = authResult

  const session = await prisma.session.findUnique({
    where: { id: sessionId }
  })

  if (!permissions.can('session', 'delete', { alumniId: session.alumniId })) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  await prisma.session.delete({ where: { id: sessionId } })

  return successResponse(null, 'Deleted')
}
```

## Quick Lookup

| Need | Import from | Function |
|------|------------|----------|
| Get permissions | engine | `getUserPermissions()` |
| Build list filter | engine | `buildPermissionFilter()` |
| Check permission | engine | `hasPermission()` |
| Filter fields | engine | `getPermittedFields()` |
| Auth + permission | middleware | `requirePermission()` |
| Just auth | middleware | `requireAuth()` |
| Extract user | middleware | `extractUserFromRequest()` |
| Check permission async | middleware | `checkPermission()` |
| Clear cache | engine | `clearPermissionsCache()` |

## Status Codes

| Code | Scenario | Usage |
|------|----------|-------|
| 200 | List/Get success | Read operations |
| 201 | Create success | POST that creates |
| 204 | Delete success | DELETE (no body) |
| 400 | Bad input | Invalid schema |
| 401 | Not authenticated | No JWT/invalid JWT |
| 403 | Authenticated but not authorized | Permission denied |
| 404 | Resource not found | ID doesn't exist |
| 409 | Conflict | Business logic (duplicate, constraint violated) |
| 500 | Server error | Unexpected exception |

## Examples

### List student's mentorship requests
```typescript
const filter = buildPermissionFilter(permissions, 'mentorship_request', 'list')
// For student: { studentId: "student-uuid" }

const requests = await prisma.mentorshipRequest.findMany({ where: filter })
```

### Check if alumni can accept request
```typescript
const can = permissions.can(
  'mentorship_request',
  'accept',
  { alumniId: alumni.id }
)
```

### Filter allowed profile update fields
```typescript
const allowed = getPermittedFields(
  permissions,
  'user_profile',
  'update',
  { bio, linkedin, email, password },
  { userId: user.id }
)
// Student gets: { bio, linkedin }
// Alumni gets: { bio, linkedin, skills }
// Admin gets: { bio, linkedin, email, password, skills } (all)
```
