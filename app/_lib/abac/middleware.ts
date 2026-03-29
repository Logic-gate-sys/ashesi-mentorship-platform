import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/app/_utils/jwt'
import { prisma } from '@/app/_utils/db'
import { getUserPermissions, type Resources } from './engine'

// Helper type to extract the 'can' method from UserPermissions
type PermissionChecker = Awaited<ReturnType<typeof getUserPermissions>>


export async function extractUserFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    } else {
      token = request.cookies.get('access_token')?.value || null
    }

    if (!token) {
      return null
    }

    const payload = await verifyJWT(token)
    if (!payload || typeof payload.id !== 'string') {
      return null
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    return user
  } catch {
    return null
  }
}

/**
 * Check if user has permission for a resource action
 */
export async function checkPermission<Res extends keyof Resources>(
  userId: string,
  resource: Res,
  action: Resources[Res]['action'],
  data?: Resources[Res]['condition'],
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId)
    // Safe cast: the generic constraints guarantee action matches resource
    const can = (permissions as PermissionChecker).can
    return can(resource, action as string as Resources[Res]['action'], data)
  } catch {
    return false
  }
}

/**
 * Require authentication and permission for an action
 * Used in API routes for authorization
 * 
 * Usage:
 * const authResult = await requirePermission(request, 'mentorship_request', 'create')
 * if (authResult instanceof NextResponse) return authResult
 * const { user, permissions } = authResult
 */
export async function requirePermission<Res extends keyof Resources>(
  request: NextRequest,
  resource: Res,
  action: Resources[Res]['action'],
  data?: Resources[Res]['condition'],
) {
  // Extract and validate user
  const user = await extractUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Get user permissions
  const permissions = await getUserPermissions(user.id)

  // Check permission
  const can = (permissions as PermissionChecker).can
  const allowed = can(resource, action as string as Resources[Res]['action'], data)

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    )
  }

  return { user, permissions }
}

/**
 * Require just authentication (no resource permission check)
 * Used for basic auth on endpoints that don't restrict by resource
 */
export async function requireAuth(request: NextRequest) {
  const user = await extractUserFromRequest(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return { user }
}
