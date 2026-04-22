import { prisma } from "#utils-types/utils/db";
import {
  getUserPermissions,
  type UserPermissions,
  buildPermissionFilter,
  type Resources,
} from "./engine";

/**
 * Get user with full data needed for permissions
 */
export async function getUserForPermissions(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      menteeProfile: true,
      mentorProfile: true,
    },
  });
}

/**
 * Get permissions for a user and cache them
 */
export async function getAndCacheUserPermissions(userId: string) {
  return getUserPermissions(userId);
}

/**
 * Build a Prisma where clause for list/read operations
 * Automatically filters by what user can access
 */
export function buildListFilter<Res extends keyof Resources>(
  permissions: UserPermissions,
  resource: Res,
  action: Res extends 'mentorship_request' | 'session' | 'availability' | 'conversation' | 'message' | 'notification'
    ? 'list' | 'read'
    : 'read',
) {
  return buildPermissionFilter(permissions, resource, action as any);
}

/**
 * Attach permission filters to different resource types
 */
export const permissionFilters = {
  /**
   * Get mentorship request filter based on user role
   * - Students see their own requests
   * - Alumni see requests sent to them
   * - Admins see all
   */
  mentorshipRequest: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "mentorship_request", "list");
  },

  /**
   * Get session filter based on permissions
   * Students see their sessions, alumni see theirs, admins see all
   */
  session: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "session", "list");
  },

  /**
   * Get availability filter - users can only see/manage their own
   */
  availability: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "availability", "list");
  },

  /**
   * Get conversation filter - users only see conversations they're in
   */
  conversation: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "conversation", "list");
  },

  /**
   * Get message filter - users see messages in conversations they're in
   */
  message: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "message", "read");
  },

  /**
   * Get notification filter - users only see their own notifications
   */
  notification: (permissions: UserPermissions) => {
    return buildPermissionFilter(permissions, "notification", "read");
  },
};

/**
 * Example of how to use in a route:
 * 
 * async function GET(request: NextRequest) {
 *   const user = await extractUser(request)
 *   const permissions = await getAndCacheUserPermissions(user.id)
 *   
 *   // Apply permission filter to query
 *   const sessions = await prisma.session.findMany({
 *     where: buildPermissionFilter(permissions, 'session', 'list'),
 *     include: { student: true, alumni: true }
 *   })
 *   
 *   return successResponse(sessions)
 * }
 */
