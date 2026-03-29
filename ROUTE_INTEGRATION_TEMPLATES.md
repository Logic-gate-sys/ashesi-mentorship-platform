# Route Integration Templates

Use these templates when updating remaining API routes to apply permission filters.

## Template 1: Simple List Route

Use for endpoints that list resources based on user permissions.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requirePermission } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter } from '@/app/_lib/abac/engine'
import { listXxxQuerySchema } from '@/app/_schemas/xxx.schema'
import { 
  paginatedResponse, 
  serverErrorResponse, 
  parseQueryParams 
} from '@/app/_utils/api-response'

/**
 * GET /api/xxx
 * List xxx for authenticated user (filtered by permissions)
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Auth + Permission check
    const authResult = await requirePermission(request, 'resource_name', 'list')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Step 2: Parse and validate query params
    const queryResult = parseQueryParams(request, listXxxQuerySchema)
    if (!queryResult.success) {
      return queryResult.error
    }

    const { limit, offset, sortBy, sortOrder, ...filters } = queryResult.data

    // Step 3: Build permission filter
    const permissionFilter = buildPermissionFilter(permissions, 'resource_name', 'list')

    // Step 4: Merge filters
    const whereClause = {
      ...permissionFilter,
      ...filters, // Other filters like status, date range, etc.
    }

    // Step 5: Execute query
    const [total, items] = await Promise.all([
      prisma.resourceName.count({ where: whereClause }),
      prisma.resourceName.findMany({
        where: whereClause,
        include: { /* relations */ },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
    ])

    return paginatedResponse(items, limit, offset, total)
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to fetch items')
  }
}
```

## Template 2: Create Route

Use for POST endpoints that create new resources.

```typescript
export async function POST(request: NextRequest) {
  try {
    // Step 1: Auth + Permission check
    const authResult = await requirePermission(request, 'resource_name', 'create')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Step 2: Parse and validate request body
    const parseResult = await parseRequestBody(request, createXxxSchema)
    if (!parseResult.success) {
      return parseResult.error
    }

    const { field1, field2 } = parseResult.data

    // Step 3: Business logic - verify related data, check constraints, etc.
    const relatedItem = await prisma.relatedModel.findUnique({
      where: { id: field1 }
    })

    if (!relatedItem) {
      return notFoundResponse('RelatedModel')
    }

    // Step 4: Create resource
    const item = await prisma.resourceName.create({
      data: {
        field1,
        field2,
        // Add userId, studentId, alumniId, etc. as needed
      },
      include: { /* relations */ }
    })

    // Step 5: Create notifications if needed
    // await prisma.notification.create({ ... })

    return successResponse(item, 'Created successfully', 201)
  } catch (error) {
    return serverErrorResponse(error as Error, 'Failed to create item')
  }
}
```

## Template 3: Get Single Resource + Update Route

Use for endpoints that get, update, or delete a single resource.

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    // Step 1: Auth check
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Step 2: Load resource
    const item = await prisma.resourceName.findUnique({
      where: { id: params.resourceId },
      include: { /* relations */ }
    })

    if (!item) {
      return notFoundResponse('Resource')
    }

    // Step 3: For auth purposes, get permissions
    const permissions = await getUserPermissions(user.id)

    // Step 4: Check if user can view this specific resource
    const canView = permissions.can(
      'resource_name',
      'read',
      {
        studentId: item.studentId,
        alumniId: item.alumniId,
        // Other conditions that identify ownership/access
      }
    )

    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    return successResponse(item)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    // Step 1: Auth + Permission check
    const authResult = await requirePermission(request, 'resource_name', 'update')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Step 2: Load resource
    const item = await prisma.resourceName.findUnique({
      where: { id: params.resourceId }
    })

    if (!item) {
      return notFoundResponse('Resource')
    }

    // Step 3: Check permission with resource context
    const canUpdate = permissions.can(
      'resource_name',
      'update',
      {
        studentId: item.studentId,
        alumniId: item.alumniId,
        // Conditions for this specific resource
      }
    )

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Step 4: Parse update data
    const parseResult = await parseRequestBody(request, updateXxxSchema)
    if (!parseResult.success) {
      return parseResult.error
    }

    // Step 5: Filter to only permitted fields
    const updateData = permissions.pickPermittedFields(
      'resource_name',
      'update',
      parseResult.data,
      {
        studentId: item.studentId,
        alumniId: item.alumniId,
      }
    )

    // Step 6: Update resource with filtered data
    const updated = await prisma.resourceName.update({
      where: { id: params.resourceId },
      data: updateData,
      include: { /* relations */ }
    })

    return successResponse(updated, 'Updated successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    // Step 1: Auth + Permission check
    const authResult = await requirePermission(request, 'resource_name', 'delete')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Step 2: Load resource
    const item = await prisma.resourceName.findUnique({
      where: { id: params.resourceId }
    })

    if (!item) {
      return notFoundResponse('Resource')
    }

    // Step 3: Check delete permission
    const canDelete = permissions.can(
      'resource_name',
      'delete',
      {
        studentId: item.studentId,
        alumniId: item.alumniId,
      }
    )

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Step 4: Delete resource
    await prisma.resourceName.delete({
      where: { id: params.resourceId }
    })

    return successResponse(null, 'Deleted successfully')
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

## Template 4: Conversations/Messages Route

For routes with many-to-many relationships (conversations have multiple participants).

```typescript
export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'conversation', 'list')

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user, permissions } = authResult

    // Get permission filter - returns only conversations user participates in
    const permissionFilter = buildPermissionFilter(permissions, 'conversation', 'list')

    // Find conversations where user is a participant
    const [total, conversations] = await Promise.all([
      prisma.conversation.count({
        where: {
          ...permissionFilter,
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
      }),
      prisma.conversation.findMany({
        where: {
          ...permissionFilter,
          participants: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          participants: {
            include: { user: true },
          },
          messages: {
            take: 5, // Recent messages
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
    ])

    return paginatedResponse(conversations, limit, offset, total)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

## Template 5: Admin-Only Route

For endpoints that only admins should access.

```typescript
import { getUserPermissions } from '@/app/_lib/abac/engine'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Basic auth
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Step 2: Check if admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      )
    }

    // Step 3: Get full permissions
    const permissions = await getUserPermissions(user.id)

    // Step 4: Check admin action
    const canPerform = permissions.can('admin_resource', 'perform_action')

    if (!canPerform) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Step 5: Perform action
    // ...

    return successResponse(result)
  } catch (error) {
    return serverErrorResponse(error as Error)
  }
}
```

## Common Patterns

### Get User's Profile ID
```typescript
const studentProfile = await prisma.studentProfile.findUnique({
  where: { userId: user.id }
})

const alumniProfile = await prisma.alumniProfile.findUnique({
  where: { userId: user.id }
})

// Use in permission checks:
const canAccess = permissions.can('resource', 'read', {
  studentId: studentProfile?.id,
  alumniId: alumniProfile?.id,
})
```

### Check Multiple Conditions
```typescript
const canUpdate = 
  permissions.can('session', 'update', { 
    alumniId: session.alumniId,
    status: session.status
  })
```

### Combine Multiple Filters
```typescript
const whereClause = {
  ...permissionFilter,
  status: 'SCHEDULED',
  scheduledAt: {
    gte: new Date(),
    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  }
}
```

### Parallel Queries for Performance
```typescript
const [total, items, related] = await Promise.all([
  prisma.resource.count({ where }),
  prisma.resource.findMany({ where, include, orderBy, take, skip }),
  prisma.relatedModel.findMany({ /* ... */ }),
])
```

## Imports Checklist

Every route file needs:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/db'
import { requirePermission, requireAuth } from '@/app/_lib/abac/middleware'
import { buildPermissionFilter, getUserPermissions } from '@/app/_lib/abac/engine'
import { createXxxSchema, updateXxxSchema, listXxxQuerySchema } from '@/app/_schemas/xxx.schema'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  notFoundResponse,
  serverErrorResponse,
  parseRequestBody,
  parseQueryParams,
} from '@/app/_utils/api-response'
```
