import type {MentorshipRequest,Session,SessionFeedback,Availability,Conversation,Message,
  Notification,
  User,
  StudentProfile,
  AlumniProfile,
} from "@/prisma/generated/prisma/client"
import { prisma } from "@/app/_utils/db"

//caches in memory for a short period of time
const PERMISSIONS_CACHE = new Map<string, ReturnType<PermissionBuilder["build"]>>()

export async function getUserPermissions(userOrId: Pick<User, "id"> | string) {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId.id
  
  if (PERMISSIONS_CACHE.has(userId)) {
    return PERMISSIONS_CACHE.get(userId)!
  }

  const permissions = await getUserPermissionsInternal(userId)
  PERMISSIONS_CACHE.set(userId, permissions);

  // return the permission
  return permissions
}

export function clearPermissionsCache(userId?: string) {
  if (userId) {
    PERMISSIONS_CACHE.delete(userId)
  } else {
    PERMISSIONS_CACHE.clear()
  }
}

async function getUserPermissionsInternal(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      alumniProfile: true,
    },
  })
// build permissions for user 
const builder = new PermissionBuilder()
  if (user == null) {
    return builder.build()
  }

  switch (user.role) {
    case "ADMIN":
      addAdminPermissions(builder)
      break
    case "STUDENT":
      addStudentPermissions(builder, user)
      break
    case "ALUMNI":
      addAlumniPermissions(builder, user)
      break

    default:
      throw new Error(`Unhandled role: ${user.role satisfies never}`)
  }

  return builder.build()
}

function addAdminPermissions(builder: PermissionBuilder) {
  builder
    .allow("mentorship_request", "create")
    .allow("mentorship_request", "read")
    .allow("mentorship_request", "update")
    .allow("mentorship_request", "delete")
    .allow("mentorship_request", "list")
    .allow("mentorship_request", "accept")
    .allow("mentorship_request", "decline")
    .allow("session", "create")
    .allow("session", "read")
    .allow("session", "update")
    .allow("session", "delete")
    .allow("session", "list")
    .allow("session_feedback", "create")
    .allow("session_feedback", "read")
    .allow("session_feedback", "update")
    .allow("session_feedback", "delete")
    .allow("availability", "create")
    .allow("availability", "read")
    .allow("availability", "update")
    .allow("availability", "delete")
    .allow("availability", "list")
    .allow("conversation", "create")
    .allow("conversation", "read")
    .allow("conversation", "list")
    .allow("message", "create")
    .allow("message", "read")
    .allow("message", "delete")
    .allow("notification", "read")
    .allow("notification", "update")
    .allow("user", "read")
    .allow("user", "update")
    .allow("user_profile", "read")
    .allow("user_profile", "update")
}

function addStudentPermissions(
  builder: PermissionBuilder,
  user: User & { studentProfile: StudentProfile | null; alumniProfile: AlumniProfile | null },
) {
  builder.allow("mentorship_request", "create")

  if (user.studentProfile) {
    builder
      .allow("mentorship_request", "read", { studentId: user.studentProfile.id })
      .allow("mentorship_request", "list", { studentId: user.studentProfile.id })
      .allow("session", "create", { studentId: user.studentProfile.id })
      .allow("session", "read", { studentId: user.studentProfile.id })
      .allow("session", "list", { studentId: user.studentProfile.id })
      .allow("session_feedback", "create", { sessionId: user.studentProfile.id })
      .allow("session_feedback", "read", { sessionId: user.studentProfile.id })
  }

  builder
    .allow("conversation", "create")
    .allow("conversation", "read", { participantId: user.id })
    .allow("conversation", "list", { participantId: user.id })
    .allow("message", "create")
    .allow("message", "read", { senderId: user.id })
    .allow("notification", "read", { userId: user.id })
    .allow("notification", "update", { userId: user.id }, ["isRead"])
    .allow("user_profile", "read", { userId: user.id })
    .allow("user_profile", "update", { userId: user.id }, [ "bio", "linkedin" ])
}

function addAlumniPermissions(
  builder: PermissionBuilder,
  user: User & { studentProfile: StudentProfile | null; alumniProfile: AlumniProfile | null },
) {
  if (user.alumniProfile) {
    builder
      .allow("mentorship_request", "read", { alumniId: user.alumniProfile.id })
      .allow("mentorship_request", "list", { alumniId: user.alumniProfile.id })
      .allow("mentorship_request", "accept", { alumniId: user.alumniProfile.id })
      .allow("mentorship_request", "decline", { alumniId: user.alumniProfile.id })
      .allow("session", "create", { alumniId: user.alumniProfile.id })
      .allow("session", "read", { alumniId: user.alumniProfile.id })
      .allow("session", "update", { alumniId: user.alumniProfile.id }, ["notes", "meetingUrl"])
      .allow("session", "list", { alumniId: user.alumniProfile.id })
      .allow("session_feedback", "create", { sessionId: user.alumniProfile.id })
      .allow("session_feedback", "read", { sessionId: user.alumniProfile.id })
      .allow("availability", "create", { alumniId: user.alumniProfile.id })
      .allow("availability", "read", { alumniId: user.alumniProfile.id })
      .allow("availability", "update", { alumniId: user.alumniProfile.id })
      .allow("availability", "delete", { alumniId: user.alumniProfile.id })
      .allow("availability", "list", { alumniId: user.alumniProfile.id })
  }

  builder
    .allow("conversation", "create")
    .allow("conversation", "read", { participantId: user.id })
    .allow("conversation", "list", { participantId: user.id })
    .allow("message", "create", { senderId: user.id })
    .allow("message", "read", {})
    .allow("notification", "read", { userId: user.id })
    .allow("notification", "update", { userId: user.id }, ["isRead"])
    .allow("user_profile", "read", { userId: user.id })
    .allow("user_profile", "update", { userId: user.id }, ["bio", "linkedin"])
}

// all resources in our permission policies
type Resources = {
  mentorship_request: {
    action: "create" | "read" | "update" | "delete" | "list" | "accept" | "decline"
    condition: Pick<MentorshipRequest,"alumniId" | "studentId" |"createdAt" |"status">
    data: MentorshipRequest
  }
  session: {
    action: "create" | "read" | "update" | "delete" | "list"
    condition: Pick<Session, "studentId"|"alumniId"|"status"| "requestId">
    data: Session
  }
  session_feedback: {
    action: "create" | "read" | "update" | "delete"
    condition: Pick<SessionFeedback, "sessionId">
    data: SessionFeedback
  }
  availability: {
    action: "create" | "read" | "update" | "delete" | "list"
    condition: Pick<Availability, "alumniId"| "dayOfWeek">
    data: Availability
  }
  conversation: {
    action: "create" | "read" | "list"
    // condition: Pick<Conversation,"createdAt"|"updatedAt">
    condition: Partial<{createdAt: string, updatedAt: string, participantId: string}>
    data: Conversation
  }
  message: {
    action: "create" | "read" | "delete"
    condition: Pick<Message, "senderId"|"conversationId">
    data: Message
  }
  notification: {
    action: "read" | "update"
    condition: Pick<Notification, "userId">
    data: Notification
  }
  user: {
    action: "read" | "update"
    condition: Pick<User, "id"|"role">
    data: User
  }
  user_profile: {
    action: "read" | "update"
    condition: Pick<StudentProfile, "userId"| "yearGroup">
    data: StudentProfile | AlumniProfile
  }
}

type Permission<Res extends keyof Resources> = {
  action: Resources[Res]["action"]
  condition?: Partial<Resources[Res]["condition"]> //some or none
  fields?: (keyof Resources[Res]["data"])[]
}

type PermissionStore = {
  [Res in keyof Resources]: Permission<Res>[]
}




class PermissionBuilder {
    #permissions: PermissionStore = {
    mentorship_request: [],
    session: [],
    session_feedback: [],
    availability: [],
    conversation: [],
    message: [],
    notification: [],
    user: [],
    user_profile: [],
  }

  //allow for adding permissions for what user is able to do
  allow<Res extends keyof Resources>(
    resource: Res,
    action: Permission<Res>["action"],
    condition?: Permission<Res>["condition"],
    fields?: Permission<Res>["fields"],
  ) {
    this.#permissions[resource].push({ action, condition, fields })
    return this
  }

  build() {
    const permissions = this.#permissions

    return {
      can<Res extends keyof Resources>(
        resource: Res,
        action: Resources[Res]["action"],
        data?: Resources[Res]["condition"],
        field?: keyof Resources[Res]["data"],
      ) {
        return permissions[resource].some(perm => {
          if (perm.action !== action) return false

          const validData =
            perm.condition == null ||
            data == null ||
            Object.entries(perm.condition).every(([key, value]) => {
              return data[key as keyof typeof perm.condition] === value
            })

          if (!validData) return false

          const validField =
            perm.fields == null || field == null || perm.fields.includes(field)

          return validField
        })
      },

      pickPermittedFields<Res extends keyof Resources>(
        resource: Res,
        action: Resources[Res]["action"],
        newData: Partial<Resources[Res]["data"]>,
        data?: Resources[Res]["condition"],
      ): Partial<Resources[Res]["data"]> {
        const perms = permissions[resource].filter(perm => {
          if (perm.action !== action) return false

          const validData =
            perm.condition == null ||
            data == null ||
            Object.entries(perm.condition).every(([key, value]) => {
              return data[key as keyof typeof perm.condition] === value
            })

          return validData
        });

        if (perms.length === 0) return {}

        const unrestricted = perms.filter(perm => perm.fields == null)
        if (unrestricted.length > 0) return newData

        const permitted = perms.flatMap(perm => perm.fields ?? [])
        if (permitted == null) return newData

        const result: Partial<Resources[Res]["data"]> = {}
        for (const field of permitted) {
          result[field] = newData[field]
        }

        return result
      },

      getPrismaWhere<Res extends keyof Resources>(
        resource: Res,
        action: Resources[Res]["action"],
      ) {
        const conditions = permissions[resource]
          .filter(perm => perm.action === action)
          .map(perm => perm.condition)

        if (conditions.length === 0) return {}

        if (conditions.some(cond => cond == null)) return {}

        if (conditions.length === 1 && conditions[0]) {
          return conditions[0]
        }

        return {
          OR: conditions.filter(cond => cond != null),
        }
      },
    }
  }
}

// Export types for external use
export type UserPermissions = ReturnType<PermissionBuilder["build"]>
export type { Resources }

export function buildPermissionFilter<Res extends keyof Resources>(
  permissions: UserPermissions,
  resource: Res,
  action: Resources[Res]["action"],
) {
  return permissions.getPrismaWhere(resource, action)
}

export function hasPermission<Res extends keyof Resources>(
  permissions: UserPermissions,
  resource: Res,
  action: Resources[Res]["action"],
  data?: Resources[Res]["condition"],
  field?: keyof Resources[Res]["data"],
): boolean {
  return permissions.can(resource, action, data, field)
}

export function getPermittedFields<Res extends keyof Resources>(
  permissions: UserPermissions,
  resource: Res,
  action: Resources[Res]["action"],
  newData: Partial<Resources[Res]["data"]>,
  data?: Resources[Res]["condition"],
): Partial<Resources[Res]["data"]> {
  return permissions.pickPermittedFields(resource, action, newData, data)
}
