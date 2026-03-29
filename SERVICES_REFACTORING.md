# Service Layer Refactoring Guide

## Overview
Database interactions have been extracted from API routes into dedicated service classes. This provides:
- **Separation of Concerns**: API routes handle HTTP, services handle database
- **Reusability**: Services can be used across multiple API routes
- **Testability**: Services can be unit tested independently
- **Maintainability**: Database logic centralized in one place
- **Type Safety**: Consistent return types across services

## Created Services

### 1. **MentorshipRequestService** (`app/_services/mentorship-request.service.ts`)
Manages all mentorship request operations.

**Key Methods:**
- `listRequests(filter, options)` - List with filtering and pagination
- `getRequestById(id)` - Fetch single request
- `createRequest(studentId, data)` - Create new request
- `acceptRequest(id)` - Accept request
- `declineRequest(id)` - Decline request
- `getRequestDetails(id)` - Full request with includes

**Usage in API:**
```typescript
const { requests, total } = await MentorshipRequestService.listRequests(filter, {
  status,
  limit,
  offset,
})
```

---

### 2. **SessionService** (`app/_services/session.service.ts`)
Handles mentoring session operations.

**Key Methods:**
- `createSession(alumniId, requestId, data)` - Create new session
- `getSessionById(id)` - Fetch with full includes
- `listSessions(filter, options)` - List with pagination
- `updateSession(id, data)` - Update session details
- `getUpcomingSessions(alumniId, limit)` - Get next N sessions
- `getCompletedSessions(alumniId, limit, offset)` - Paginated past sessions
- `countActiveSessions(alumniId)` - Count for capacity
- `completeSession(id)` - Mark as completed

**Usage in API:**
```typescript
const session = await SessionService.createSession(alumniId, requestId, {
  topic,
  notes,
  scheduledAt,
  duration,
  meetingUrl,
})
```

---

### 3. **AvailabilityService** (`app/_services/availability.service.ts`)
Manages alumni availability schedules.

**Key Methods:**
- `createAvailability(alumniId, data)` - Create with duplicate check
- `getAvailabilityById(id)` - Fetch location specific
- `listAvailability(filter, options)` - List with filtering
- `getAlumniAvailability(alumniId)` - All slots for alumni
- `updateAvailability(id, data)` - Update slot
- `deleteAvailability(id)` - Remove slot
- `getAvailableAlumni(dayOfWeek, time)` - Find available alumni
- `deleteAlumniAvailability(alumniId)` - Bulk delete

**Usage in API:**
```typescript
const slot = await AvailabilityService.createAvailability(alumniId, {
  dayOfWeek,
  startTime,
  endTime,
})
```

---

### 4. **MessageService** (`app/_services/message.service.ts`)
Handles conversations and messaging.

**Key Methods:**
- `createConversation(participantIds, title)` - Create new conversation
- `getConversationById(id)` - Fetch with messages and participants
- `listConversations(userId, options)` - User's conversations paginated
- `sendMessage(conversationId, senderId, content)` - Create message
- `getMessages(conversationId, options)` - Messages in conversation
- `deleteMessage(id)` - Remove message
- `getOrCreateConversation(userIds)` - Get existing or create new

**Usage in API:**
```typescript
const conversation = await MessageService.getOrCreateConversation([userId1, userId2])
const message = await MessageService.sendMessage(conversationId, userId, content)
```

---

### 5. **NotificationService** (`app/_services/notification.service.ts`)
Manages user notifications.

**Key Methods:**
- `createNotification(userId, data)` - Create single notification
- `getNotificationById(id)` - Fetch notification
- `getUnreadNotifications(userId)` - Get unread only
- `listNotifications(userId, options)` - All notifications paginated
- `markAsRead(id)` - Mark single as read
- `markAllAsRead(userId)` - Mark user's all as read
- `deleteNotification(id)` - Remove notification
- `createBulkNotifications(userIds, data)` - Create for multiple users
- `getUnreadCount(userId)` - Count unread

**Usage in API:**
```typescript
await NotificationService.createNotification(userId, {
  type: 'SESSION_SCHEDULED',
  title: 'Session Scheduled',
  message: 'Your session is scheduled...',
  relatedId: sessionId,
  relatedType: 'SESSION',
})
```

---

### 6. **ProfileService** (`app/_services/profile.service.ts`)
Manages user profiles (Student & Alumni).

**Key Methods:**
- `getUserProfile(userId)` - Get user with both profile types
- `getOrCreateStudentProfile(userId)` - Ensure student profile exists
- `getOrCreateAlumniProfile(userId)` - Ensure alumni profile exists
- `updateStudentProfile(userId, data)` - Update student fields
- `updateAlumniProfile(userId, data)` - Update alumni fields
- `updateUserProfile(userId, data)` - Update common user fields
- `getStudentById(studentId)` - Fetch student with user
- `getAlumniById(alumniId)` - Fetch alumni with user
- `listAlumni(options)` - Available alumni paginated
- `searchAlumniBySkills(skill)` - Find by skill

**Usage in API:**
```typescript
const alumniProfile = await ProfileService.getOrCreateAlumniProfile(userId)
await ProfileService.updateAlumniProfile(userId, {
  company,
  jobTitle,
  skills,
  bio,
})
```

---

### 7. **SessionFeedbackService** (`app/_services/feedback.service.ts`)
Handles session feedback and ratings.

**Key Methods:**
- `createFeedback(sessionId, data)` - Create or update feedback
- `getFeedbackBySessionId(sessionId)` - Get feedback for session
- `updateFeedback(id, data)` - Update feedback details
- `deleteFeedback(id)` - Remove feedback
- `getAverageRating(alumniId)` - Calculate average rating
- `getAlumniFeedback(alumniId, options)` - All feedback received

**Usage in API:**
```typescript
const feedback = await SessionFeedbackService.createFeedback(sessionId, {
  rating: 5,
  feedback: 'Great session!',
  topics: 'Web Development',
})
```

---

## API Route Refactoring Pattern

### Before (Direct Database Access)
```typescript
// In API route
const alumniProfile = await prisma.alumniProfile.findUnique({
  where: { userId: user.id },
})

const session = await prisma.session.create({
  data: { requestId, alumniId, topic, notes, ... },
  include: { request: true, alumni: true }
})
```

### After (Using Service)
```typescript
// In API route
import { SessionService, ProfileService } from '@/app/_services'

const alumniProfile = await ProfileService.getOrCreateAlumniProfile(user.id)
const session = await SessionService.createSession(alumniId, requestId, {
  topic, notes, scheduledAt, duration, meetingUrl
})
```

---

## Routes to Be Refactored

### Priority 1 (Core Features)
- [ ] `/api/mentor/requests/[requestId]/route.ts` - Use `MentorshipRequestService`
- [ ] `/api/student/requests/route.ts` - Use `MentorshipRequestService`
- [ ] `/api/messages/[conversationId]/route.ts` - Use `MessageService`
- [ ] `/api/sessions/[sessionId]/route.ts` - Use `SessionService`

### Priority 2 (Secondary Features)
- [ ] `/api/mentor/dashboard/route.ts` - Use `SessionService`, `ProfileService`
- [ ] `/api/mentor/metrics/route.ts` - Use `SessionService`, `SessionFeedbackService`
- [ ] `/api/mentor/capacity/route.ts` - Use `SessionService`
- [ ] `/api/cycles/*` - Create `CycleService`
- [ ] `/api/auth/*` - Create `AuthService` if complex logic exists

### Priority 3 (Admin/Utility)
- [ ] `/api/admin/*` - Use appropriate services
- [ ] `/api/notifications/*` - Use `NotificationService`

---

## Best Practices

### 1. Import Only Needed Services
```typescript
import { SessionService, ProfileService } from '@/app/_services'
// Instead of: import * from '@/app/_services'
```

### 2. Error Handling
Services throw errors - let API routes handle and format responses:
```typescript
try {
  const session = await SessionService.createSession(...)
} catch (error) {
  return serverErrorResponse(error as Error, 'Failed to create session')
}
```

### 3. Transactions
For complex operations, consider adding transaction support to services:
```typescript
// Example for future enhancement
await prisma.$transaction(async (tx) => {
  const request = await tx.mentorshipRequest.update(...)
  const notification = await tx.notification.create(...)
})
```

### 4. Caching
For read-heavy operations, consider adding caching:
```typescript
static cache = new Map<string, any>()
static async getAlumniAvailability(alumniId: string) {
  const cacheKey = `alumni:${alumniId}:availability`
  if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)
  // ... fetch from DB
  this.cache.set(cacheKey, data)
  return data
}
```

---

## Service Testing Example

```typescript
// tests/unit/services/session.service.test.ts
import { describe, it, expect } from 'vitest'
import { SessionService } from '@/app/_services'

describe('SessionService', () => {
  it('should create a session', async () => {
    const session = await SessionService.createSession(
      'alumni-id',
      'request-id',
      { topic: 'Test', scheduledAt: '2024-04-01', duration: 60 }
    )
    expect(session.id).toBeDefined()
    expect(session.topic).toBe('Test')
  })

  it('should list sessions with pagination', async () => {
    const { sessions, total } = await SessionService.listSessions(
      { alumniId: 'alumni-id' },
      { limit: 10, offset: 0 }
    )
    expect(Array.isArray(sessions)).toBe(true)
    expect(typeof total).toBe('number')
  })
})
```

---

## Migration Checklist

When refactoring each API route:

- [ ] Identify all `prisma.*` calls
- [ ] Check if those operations exist in a service
- [ ] Replace direct prisma calls with service methods
- [ ] Ensure return types match expectations
- [ ] Test the refactored route
- [ ] Update imports at top of file
- [ ] Remove unused imports (like `prisma`)
- [ ] Add JSDoc comments for complex service usage

