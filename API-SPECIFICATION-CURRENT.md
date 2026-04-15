# API Specification - Mentor App

## Overview & Storyline

The Mentor App API facilitates a **mentorship matching and management platform** that connects university alumni (mentors) with students seeking professional guidance. The system operates in **mentorship cycles** - discrete time periods where alumni set availability, students request mentors based on specific goals, and matched pairs collaborate through scheduled sessions and messaging.

### The Complete User Journey

1. **Registration & Authentication**: Users create accounts (either as Students or Alumni) and authenticate
2. **Profile Setup**: Alumni define their expertise and availability; Students complete their profiles
3. **Cycle Management**: Admins create mentorship cycles with defined timelines
4. **Matching Phase**: 
   - Alumni mark themselves available during a cycle
   - Students browse available mentors and submit requests
   - Alumni review and accept/decline requests
5. **Active Mentorship**: 
   - Matched pairs create session schedules
   - Both parties use messaging for communication
   - Sessions are tracked and rated
6. **Cycle Completion**: 
   - Cycle ends, all mentorships paused
   - Feedback and ratings submitted
   - Alumni receive performance summaries
   - System prepares for next cycle

---

## Authentication & User Management

### POST `/api/auth/login`

**Purpose**: Authenticate user and receive JWT tokens for session management

**Input**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT|ALUMNI|ADMIN"
    }
  }
}
```

**Why**: Essential for every feature - establishes user identity and permissions

---

### POST `/api/auth/register/student`

**Purpose**: Register a new student account

**Input**:
```json
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "student-uuid",
    "email": "student@university.edu",
    "role": "STUDENT"
  }
}
```

**Why**: Entry point for students to join the platform

---

### POST `/api/auth/register/alumni`

**Purpose**: Register a new alumni/mentor account

**Input**:
```json
{
  "email": "alumni@example.com",
  "password": "securePassword123",
  "firstName": "Robert",
  "lastName": "Johnson",
  "graduationYear": 2020,
  "company": "Tech Corp",
  "jobTitle": "Senior Engineer"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "alumni-uuid",
    "email": "alumni@example.com",
    "role": "ALUMNI"
  }
}
```

**Why**: Creates mentor profiles with professional context

---

### POST `/api/auth/validate-token`

**Purpose**: Verify if JWT token is still valid

**Input**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Output** (200):
```json
{
  "success": true,
  "data": { "valid": true },
  "message": "Token is valid"
}
```

**Why**: Client-side token validation before API calls to prevent unnecessary requests

---

### POST `/api/auth/refresh`

**Purpose**: Refresh expired access token using refresh token

**Input**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Output** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Why**: Maintains sessions without forced re-authentication

---

### POST `/api/auth/logout`

**Purpose**: Invalidate current session

**Input**:
```json
{}
```

**Output** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Why**: Secure session termination, clears client-side tokens

---

### GET `/api/auth/me`

**Purpose**: Get current authenticated user's details

**Input**: None (Auth header: `Authorization: Bearer <token>`)

**Output** (200):
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ALUMNI",
    "createdAt": "2025-10-15T10:30:00Z"
  }
}
```

**Why**: Core endpoint for any page that needs current user context

---

### GET/POST `/api/auth/profile`

**Purpose**: Retrieve or update authenticated user's profile

**GET Output** (200):
```json
{
  "success": true,
  "data": {
    "id": "profile-uuid",
    "userId": "user-uuid",
    "bio": "Senior software engineer with 5 years experience",
    "expertise": ["JavaScript", "React", "Node.js"],
    "company": "Tech Corp",
    "isAvailable": true
  }
}
```

**POST Input**:
```json
{
  "bio": "Updated bio text",
  "expertise": ["Python", "Data Science"],
  "company": "New Company Inc"
}
```

**POST Output** (200):
```json
{
  "success": true,
  "data": { "id": "profile-uuid", ... },
  "message": "Profile updated successfully"
}
```

**Why**: Allows users to customize their public profile and mentor expertise

---

## Mentorship Cycles

### GET `/api/cycles`

**Purpose**: Get current active or upcoming mentorship cycle (public endpoint)

**Input**: None

**Output** (200):
```json
{
  "success": true,
  "data": {
    "id": "cycle-uuid",
    "name": "Spring 2026 Mentorship",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-03-31T23:59:59Z",
    "status": "active",
    "description": "Q1 mentorship matching and pairing"
  }
}
```

**Why**: 
- Displays cycle timeline for both users
- Indicates when matching phase is open
- Non-authenticated endpoint for public visibility

---

### POST `/api/cycles` (Admin)

**Purpose**: Create a new mentorship cycle

**Input**:
```json
{
  "name": "Summer 2026 Mentorship",
  "startDate": "2026-06-01T00:00:00Z",
  "endDate": "2026-08-31T23:59:59Z",
  "availabilityWindowStart": "2026-05-01T00:00:00Z",
  "availabilityWindowEnd": "2026-05-31T23:59:59Z"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": { "id": "cycle-uuid", ... },
  "message": "Cycle created successfully"
}
```

**Why**: Defines time boundaries for all matching and mentorship activities in a period

---

### POST `/api/cycles` (End Cycle - Admin)

**Purpose**: Manually end a mentorship cycle - archives all mentorships, sends notifications

**Input**:
```json
{
  "cycleId": "cycle-uuid"
}
```

**Output** (200):
```json
{
  "success": true,
  "data": {
    "cycleId": "cycle-uuid",
    "status": "ended",
    "message": "Mentorship cycle ended. Notification emails queued to alumni...",
    "archivedMentorships": 47,
    "completedSessions": 182,
    "averageRating": 4.7,
    "emailsSent": 45
  }
}
```

**Why**: 
- Clean transition between cycles
- Preserves mentorship history
- Notifies mentors of completion with stats
- Resets for next cycle

---

## 👥 Alumni/Mentor Functionality

### POST `/api/alumni/availability`

**Purpose**: Define when alumni are available for mentoring during a cycle

**Input**:
```json
{
  "dayOfWeek": 1,
  "startTime": "14:00",
  "endTime": "17:00",
  "cycleId": "cycle-uuid"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "availability-uuid",
    "dayOfWeek": 1,
    "startTime": "14:00",
    "endTime": "17:00",
    "cycleId": "cycle-uuid"
  }
}
```

**Why**: 
- Allows mentors to define recurring availability slots
- Used for schedule recommendations to students
- Enables system to suggest optimal session times

---

### GET `/api/alumni/availability`

**Purpose**: List all availability slots with optional filtering

**Query Parameters**:
- `alumniId` (optional): Filter by specific alumni
- `dayOfWeek` (optional): Filter by day (0=Sunday, 6=Saturday)
- `limit` (optional, default=20): Results per page
- `offset` (optional, default=0): Pagination offset

**Output** (200):
```json
{
  "success": true,
  "data": [
    { "id": "avail-uuid-1", "dayOfWeek": 1, "startTime": "14:00", "endTime": "17:00" },
    { "id": "avail-uuid-2", "dayOfWeek": 3, "startTime": "18:00", "endTime": "20:00" }
  ],
  "pagination": {
    "total": 12,
    "limit": 20,
    "offset": 0
  }
}
```

**Why**: 
- Students use this to find mentors with matching availability
- Shows visible time slots for mentor matching

---

### GET `/api/alumni/cycles/[cycleId]/availability`

**Purpose**: Get availability specific to a cycle with filtering

**Output** (200):
```json
{
  "success": true,
  "data": [
    { "id": "avail-uuid", "dayOfWeek": 2, "startTime": "15:00", "endTime": "18:00", "cycleId": "cycle-uuid" }
  ]
}
```

**Why**: 
- Isolates cycle-specific availability
- Prevents showing slots from old cycles
- Supports multi-cycle mentor tracking

---

### GET `/api/mentor/dashboard`

**Purpose**: Get comprehensive mentor/alumni dashboard with pending requests, mentees, and upcoming sessions

**Output** (200):
```json
{
  "success": true,
  "data": {
    "pendingRequests": [
      {
        "id": "request-uuid",
        "studentName": "Jane Smith",
        "goal": "Learn web development",
        "message": "I want to build my first React app",
        "status": "PENDING"
      }
    ],
    "activeMentees": [
      {
        "id": "request-uuid",
        "studentId": "student-uuid",
        "studentName": "Alex Chen",
        "studentEmail": "alex@university.edu",
        "goal": "Advance Python skills",
        "status": "active"
      }
    ],
    "upcomingSessions": [
      {
        "sessionId": "session-uuid",
        "menteeId": "student-uuid",
        "menteeName": "Alex Chen",
        "scheduledAt": "2026-02-15T15:00:00Z",
        "duration": 60,
        "status": "SCHEDULED"
      }
    ],
    "metrics": {
      "totalMentees": 3,
      "activeSessions": 2,
      "averageRating": 4.8
    }
  }
}
```

**Why**: 
- Single dashboard showing all mentor responsibilities
- Aggregates data from multiple services
- Key landing page for alumni users

---

### GET `/api/mentor/metrics`

**Purpose**: Get performance metrics for a mentor's mentorship activities

**Output** (200):
```json
{
  "success": true,
  "data": {
    "totalMentorships": 15,
    "activeMentorships": 3,
    "completedMentorships": 12,
    "totalSessions": 45,
    "averageSessionDuration": 52,
    "averageRating": 4.7,
    "studentSatisfaction": 94,
    "responseTime": "2 hours",
    "completionRate": 98
  }
}
```

**Why**: 
- Helps mentors track impact and performance
- Builds accountability and gamification
- Used for recognition/leaderboards

---

### GET `/api/mentor/capacity`

**Purpose**: Get mentor's current mentorship capacity and headroom

**Output** (200):
```json
{
  "success": true,
  "data": {
    "maxCapacity": 5,
    "currentMentees": 3,
    "availableSlots": 2,
    "percentFull": 60,
    "canAcceptMore": true
  }
}
```

**Why**: 
- Limits mentor overload
- Controls quality of mentorship
- Informs UI on availability to accept new requests

---

### GET `/api/mentor/requests`

**Purpose**: List all mentorship requests with pagination and status filtering (permission-based)

**Query Parameters**:
- `status` (optional, default=PENDING): PENDING, ACCEPTED, DECLINED, COMPLETED
- `limit` (optional, default=20)
- `offset` (optional, default=0)

**Output** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "request-uuid",
      "studentId": "student-uuid",
      "studentName": "Jane Smith",
      "goal": "Land a job in tech",
      "message": "Would love guidance on interviews",
      "status": "PENDING",
      "createdAt": "2026-02-10T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

**Why**: 
- Mentors review incoming requests
- Filter by status to organize workflow
- Supports pagination for large request lists

---

### POST `/api/mentor/requests`

**Purpose**: Accept a mentorship request from a student

**Input**:
```json
{
  "requestId": "request-uuid"
}
```

**Output** (200):
```json
{
  "success": true,
  "data": {
    "id": "request-uuid",
    "status": "ACCEPTED",
    "studentId": "student-uuid",
    "message": "You have accepted this mentorship request"
  }
}
```

**Why**: 
- Core matching mechanism
- Creates mentorship relationship
- Triggers notification to student

---

### PUT/DELETE `/api/mentor/requests/[requestId]`

**Purpose**: Decline or manage specific mentorship requests

**DELETE Input**: None

**DELETE Output** (200):
```json
{
  "success": true,
  "message": "Mentorship request declined"
}
```

**Why**: 
- Mentors can decline unsuitable requests
- Notifies student of rejection
- Frees request for other mentors

---

## 🎓 Student Functionality

### POST `/api/student/requests`

**Purpose**: Create a new mentorship request to a specific mentor

**Input**:
```json
{
  "alumniId": "alumni-uuid",
  "goal": "Transition into machine learning",
  "message": "I have 2 years Python experience and want to learn ML fundamentals"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "request-uuid",
    "studentId": "student-uuid",
    "alumniId": "alumni-uuid",
    "goal": "Transition into machine learning",
    "message": "I have 2 years Python experience...",
    "status": "PENDING",
    "createdAt": "2026-02-12T14:20:00Z"
  },
  "message": "Mentorship request created successfully"
}
```

**Why**: 
- Entry point for students to find mentors
- Initiates matching process
- Core feature of platform

---

### GET `/api/student/requests`

**Purpose**: View all mentorship requests submitted by the student

**Output** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "request-uuid-1",
      "mentorName": "Robert Johnson",
      "goal": "Learn React",
      "status": "ACCEPTED",
      "createdAt": "2026-02-10T10:30:00Z",
      "acceptedAt": "2026-02-11T15:45:00Z"
    },
    {
      "id": "request-uuid-2",
      "mentorName": "Sarah Williams",
      "goal": "Career advice",
      "status": "PENDING",
      "createdAt": "2026-02-12T14:20:00Z"
    }
  ]
}
```

**Why**: 
- Students track outgoing requests
- See mentor responses
- Understand mentorship status

---

## 💬 Messaging & Communication

### POST `/api/messages`

**Purpose**: Create a new conversation or get existing one with participant(s)

**Input**:
```json
{
  "participantIds": ["user-uuid-1", "user-uuid-2"]
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "conversation-uuid",
    "participants": [
      { "id": "user-uuid-1", "name": "John Doe" },
      { "id": "user-uuid-2", "name": "Jane Smith" }
    ],
    "createdAt": "2026-02-12T16:00:00Z",
    "lastMessage": null
  },
  "message": "Conversation created successfully"
}
```

**Why**: 
- Enables one-on-one communication between mentor and mentee
- Returns existing conversation if already exists
- Foundation for real-time messaging

---

### GET `/api/messages`

**Purpose**: List all conversations for authenticated user

**Output** (200):
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conversation-uuid-1",
        "participantName": "Robert Johnson",
        "lastMessage": "Great progress this week!",
        "lastMessageTime": "2026-02-15T14:30:00Z",
        "unreadCount": 2
      },
      {
        "id": "conversation-uuid-2",
        "participantName": "Sarah Williams",
        "lastMessage": "When are you free next week?",
        "lastMessageTime": "2026-02-14T10:15:00Z",
        "unreadCount": 0
      }
    ],
    "total": 3
  }
}
```

**Why**: 
- Inbox for users to manage conversations
- Shows unread counts and preview
- Essential for asynchronous communication

---

## 📅 Sessions Management

### GET `/api/sessions`

**Purpose**: List all sessions (scheduled, completed) for authenticated user

**Query Parameters**:
- `status` (optional): SCHEDULED, COMPLETED, CANCELLED
- `limit`, `offset` (pagination)

**Output** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "session-uuid-1",
      "mentorName": "Robert Johnson",
      "menteeName": "Jane Smith",
      "scheduledAt": "2026-02-18T15:00:00Z",
      "duration": 60,
      "status": "SCHEDULED",
      "topic": "React Hooks Deep Dive",
      "notes": null
    },
    {
      "id": "session-uuid-2",
      "mentorName": "Robert Johnson",
      "menteeName": "Jane Smith",
      "scheduledAt": "2026-02-11T15:00:00Z",
      "duration": 60,
      "status": "COMPLETED",
      "rating": 5,
      "feedback": "Excellent guidance on state management"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 20,
    "offset": 0
  }
}
```

**Why**: 
- Central view of all mentorship activities
- Tracks which sessions need attention
- Enables session history and feedback

---

### POST `/api/sessions`

**Purpose**: Create/schedule a new session

**Input**:
```json
{
  "mentorshipRequestId": "request-uuid",
  "scheduledAt": "2026-02-20T14:00:00Z",
  "duration": 60,
  "topic": "JavaScript Closures",
  "notes": "Focus on practical examples"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "session-uuid",
    "mentorshipRequestId": "request-uuid",
    "scheduledAt": "2026-02-20T14:00:00Z",
    "duration": 60,
    "status": "SCHEDULED",
    "createdAt": "2026-02-15T10:00:00Z"
  }
}
```

**Why**: 
- Turns accepted requests into actual meetings
- Enables scheduling and calendar integration
- Provides structure to mentorship

---

### PUT `/api/sessions/[sessionId]`

**Purpose**: Mark session as completed and optionally add feedback

**Input**:
```json
{
  "status": "COMPLETED",
  "rating": 5,
  "feedback": "Excellent session, learned a lot about async/await"
}
```

**Output** (200):
```json
{
  "success": true,
  "data": {
    "id": "session-uuid",
    "status": "COMPLETED",
    "rating": 5,
    "feedback": "Excellent session...",
    "completedAt": "2026-02-20T15:15:00Z"
  }
}
```

**Why**: 
- Records session completion
- Captures feedback for quality assurance
- Updates mentor ratings and metrics

---

## 👨‍⚖️ Admin Functionality

### POST `/api/admin/cycles`

**Purpose**: Admin-only endpoint to create and manage mentorship cycles

**Input**:
```json
{
  "name": "Fall 2026 Mentorship Program",
  "startDate": "2026-09-01T00:00:00Z",
  "endDate": "2026-11-30T23:59:59Z",
  "description": "Q3-Q4 mentorship matching"
}
```

**Output** (201):
```json
{
  "success": true,
  "data": {
    "id": "cycle-uuid",
    "name": "Fall 2026 Mentorship Program",
    "status": "created",
    "mentorsInvited": 0,
    "studentsEnrolled": 0
  }
}
```

**Why**: 
- Only admins can create/end cycles
- Controls overall program flow
- Prevents unauthorized cycle manipulation

---

## 🔒 Permission & Authorization System (ABAC)

All endpoints are protected by **Attribute-Based Access Control (ABAC)**:

- **Students** can:
  - Create mentorship requests
  - View accepted mentors
  - Message mentors
  - Schedule and complete sessions
  - Rate mentors

- **Alumni/Mentors** can:
  - Set availability
  - View incoming requests
  - Accept/decline requests
  - View their mentees
  - Message mentees
  - Mark sessions complete
  - View metrics

- **Admins** can:
  - Create cycles
  - End cycles
  - View all requests and mentorships
  - Send notifications
  - Manage users and permissions

---

## ⚠️ Current Deficiencies & Known Issues

### 1. **Real-Time Messaging**

- **Current State**: POST/GET only, polling required
- **Impact**: Messaging feels laggy; no real-time notifications
- **Fix Needed**: WebSocket integration for live messaging

### 2. **Bulk Actions Missing**

- **Current State**: No bulk accept/decline of requests
- **Impact**: Mentors with many requests must handle individually
- **Fix Needed**: Add batch operations for request management

### 3. **Search & Discovery**

- **Current State**: No endpoint to search available mentors by skills/expertise
- **Impact**: Students can't easily discover mentors matching their needs
- **Fix Needed**: Add `/api/mentor/search` with skill filtering

### 4. **Notifications Missing Detail**

- **Current State**: Simple notification creation; no notification retrieval endpoints
- **Impact**: Users can't see notification history
- **Fix Needed**: Add `/api/notifications` GET endpoint with filters

### 5. **No Email Verification**

- **Current State**: Registration doesn't require email confirmation
- **Impact**: Invalid/spam emails can be registered
- **Fix Needed**: Add email verification flow post-registration

### 6. **Limited Filtering on Sessions**

- **Current State**: Basic status filtering only
- **Impact**: Hard to find specific sessions by date range, mentor, mentee
- **Fix Needed**: Add advanced filtering (date range, participant filters)

### 7. **No Availability Conflict Detection**

- **Current State**: Alumni can schedule sessions outside availability windows
- **Impact**: Availability slots become meaningless
- **Fix Needed**: Add validation to prevent out-of-availability bookings

### 8. **No Mentorship Pause/Resume**

- **Current State**: Only accept/decline; no pause mid-mentorship
- **Impact**: Mentors can't temporarily step back if overloaded
- **Fix Needed**: Add pause/resume status for mentorships

### 9. **Rate Limiting Missing**

- **Current State**: No rate limiting on request creation
- **Impact**: Students could spam requests to mentors
- **Fix Needed**: Implement rate limiting per user/IP

### 10. **Limited Cycle Transition Logic**

- **Current State**: Manual cycle end; no automated archival windows
- **Impact**: Data management relies entirely on manual admin action
- **Fix Needed**: Add scheduled cycle transitions

### 11. **No File Upload Support**

- **Current State**: No resume/document uploads
- **Impact**: Profile building is text-only
- **Fix Needed**: Add S3/cloud storage integration for profiles

### 12. **No Soft Delete**

- **Current State**: Deleted records are permanently removed
- **Impact**: Data loss risk; can't recover deleted conversations
- **Fix Needed**: Implement soft deletes with restore capability

### 13. **Missing Availability Window Enforcement**

- **Current State**: Availability slots don't restrict to cycle availability window
- **Impact**: Availability from previous cycle visible during current cycle
- **Fix Needed**: Filter availability by current active cycle

### 14. **No Mentor Recommendation Engine**

- **Current State**: Students manually browse mentors
- **Impact**: No intelligent matching based on skill gaps
- **Fix Needed**: Add ML-based mentor recommendations

### 15. **Incomplete Error Responses**

- **Current State**: Some endpoints return minimal error context
- **Impact**: Client debugging is difficult
- **Fix Needed**: Standardize detailed error codes and messages

---

## 📊 System Architecture Summary

```
┌─────────────────┐
│   Client Apps   │
└────────┬────────┘
         │ HTTP/REST
┌────────▼──────────────────────────┐
│   Next.js API Routes              │
├──────────────────────────────────┤
│  ├─ /auth (5 endpoints)          │
│  ├─ /cycles (2 endpoints)        │
│  ├─ /mentor (4+ endpoints)       │
│  ├─ /alumni (2+ endpoints)       │
│  ├─ /student (2+ endpoints)      │
│  ├─ /messages (2 endpoints)      │
│  ├─ /sessions (3+ endpoints)     │
│  └─ /admin (1+ endpoints)        │
└────────┬──────────────────────────┘
         │
┌────────▼──────────────────────────┐
│   Service Layer                   │
├──────────────────────────────────┤
│  ├─ AuthService                  │
│  ├─ CycleService                 │
│  ├─ MentorshipRequestService     │
│  ├─ AvailabilityService          │
│  ├─ SessionService               │
│  ├─ MessageService               │
│  ├─ NotificationService          │
│  └─ ProfileService               │
└────────┬──────────────────────────┘
         │
┌────────▼──────────────────────────┐
│   Prisma ORM                      │
│   (Database Layer)                │
└──────────────────────────────────┘
         │
┌────────▼──────────────────────────┐
│   PostgreSQL Database             │
└──────────────────────────────────┘
```

---

## 🧪 Testing the API

### Quick Test Flow (Using cURL or Postman)

```bash
# 1. Register student
curl -X POST http://localhost:3000/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{"email":"student@uni.edu","password":"pass123","firstName":"John","lastName":"Doe"}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@uni.edu","password":"pass123"}'

# 3. Get current cycle
curl http://localhost:3000/api/cycles

# 4. View available mentors
curl http://localhost:3000/api/alumni/availability

# 5. Create mentorship request
curl -X POST http://localhost:3000/api/student/requests \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"alumniId":"<ALUMNI_UUID>","goal":"Learn React","message":"I am interested..."}'
```

---

## 📝 Notes for Future Development

1. **Documentation**: Keep API docs in sync when adding new endpoints
2. **Testing**: Ensure all new endpoints have corresponding unit/integration tests
3. **Versioning**: Consider API versioning strategy if breaking changes occur
4. **Rate Limiting**: Implement across all public endpoints before production
5. **Caching**: Add Redis caching for frequently accessed data (cycles, availability)
6. **Monitoring**: Set up error tracking and performance monitoring
7. **Security**: Regular security audits, especially around ABAC permission checks
