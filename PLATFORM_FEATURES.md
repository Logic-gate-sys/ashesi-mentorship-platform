# Ashesi Mentorship Platform - Feature Documentation

A comprehensive mentorship platform connecting Ashesi University students with alumni mentors. Built with Next.js, React, PostgreSQL (Prisma), and ABAC-based permission system.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Student Features](#student-features)
3. [Alumni/Mentor Features](#alumnimentor-features)
4. [Admin Features](#admin-features)
5. [Shared Features](#shared-features)
6. [Data Models](#data-models)

---

## Platform Overview

### Architecture

- **Authentication**: JWT-based with 15-minute access tokens (sessionStorage) and 7-day refresh tokens (httpOnly cookies)
- **Authorization**: ABAC (Attribute-Based Access Control) with role-based permissions
- **Roles**: STUDENT, ALUMNI, ADMIN
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Next.js 16+ with React client components, custom Maroon theme (#923D41, #7B1427)

### Key Principles

- Multiple one-way mentorship relationships (1 student can request multiple alumni)
- Time-bound mentorship cycles (3-6 months)
- Session-based interactions between mentors and students
- Feedback and rating system for quality assurance
- Real-time messaging between participants

---

## Student Features

### 1. Registration & Authentication

**Endpoint**: `POST /api/auth/register/student`

Students register with:

- Personal information (First name, Last name, Email)
- Academic profile (Major, Year: 1-4)
- Interests/Specializations (multiple tags, e.g., "Fintech", "Machine Learning")
- Bio and LinkedIn profile link (optional)
- Password with strong requirements:
  - Minimum 8 characters
  - Uppercase, lowercase, number, special character
- **Email Validation**: Must use `@ashesi.edu.gh` domain

**UI**: 6-step registration form with password strength indicator

### 2. Mentorship Request System

**Endpoints**:

- `POST /api/student/requests` — Create mentorship request
- `GET /api/student/requests` — View submitted requests
- `GET /api/student/requests/{requestId}` — View specific request

**Features**:

- Search and browse available mentors (alumni directory)
- Filter mentors by:
  - Industry (Technology, Finance, Consulting, Healthcare, Education, Engineering, Other)
  - Major/Skills
  - Availability status
  - Company/Job title
- Submit mentorship request with:
  - **Goal**: Primary mentorship objective (min 20 chars, max 500 chars)
  - **Message**: Optional personal note (max 1000 chars)
- Request lifecycle: PENDING → ACCEPTED → Sessions | DECLINED | CANCELLED
- Prevent duplicate pending requests (max 1 pending request per alumni)
- Check mentor's current availability status before requesting

### 3. Session Management

**Endpoints**:

- `GET /api/sessions` — List sessions
- View scheduled sessions with alumni
- Provide feedback on completed sessions

**Features**:

- View all sessions status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- Session details:
  - Topic and meeting notes
  - Scheduled date/time and duration
  - Meeting URL (for virtual sessions)
  - Mentor information
- Rate each completed session (1-5 stars)
- Optional session feedback/comments

### 4. Messaging & Conversations

**Endpoints**:

- `POST /api/messages` — Create conversation
- `POST /api/messages/{conversationId}` — Send message

**Features**:

- Direct messaging with mentors
- Message types: TEXT, FILE, SYSTEM
- File attachments support
- Last read timestamp tracking
- Conversation participants

### 5. Dashboard

**Dashboard Features**:

- Overview of mentorship status
- Pending requests summary
- Upcoming sessions calendar
- Active mentor relationships
- Messages/Conversations sidebar

### 6. Profile Management

**Endpoint**: `PATCH /api/auth/profile`

**Editable Fields**:

- First name, Last name
- Bio
- LinkedIn profile
- Interests/Specializations
- Avatar URL

---

## Alumni/Mentor Features

### 1. Registration & Authentication

**Endpoint**: `POST /api/auth/register/alumni`

Alumni register with:

- Personal information (First name, Last name, Email)
- Academic background (Graduation year, Major)
- Professional information:
  - Company name
  - Job title
  - Industry (Technology, Finance, Consulting, Healthcare, Education, Engineering, Other)
- Professional profile:
  - Bio/About yourself
  - LinkedIn profile link (optional)
  - Array of skills (e.g., "React", "System Design", "AWS")
- Password with strong requirements (same as students)
- Availability toggle (to enable/disable new mentorship requests)

**UI**: 3-step registration form with validation

### 2. Availability Management

**Endpoints**:

- `POST /api/alumni/availability` — Create availability slot
- `GET /api/alumni/availability` — List availability
- `PATCH /api/alumni/availability/{slotId}` — Update slot
- `DELETE /api/alumni/availability/{slotId}` — Remove slot

**Features**:

- Set weekly availability slots
- Define:
  - Day of week (Monday-Sunday)
  - Start time (24-hour format, e.g., "09:00")
  - End time (e.g., "11:00")
- Unique constraint: Only one slot per (day, startTime) pair
- Toggle overall availability status (isAvailable flag)
- Students can see availability before requesting

### 3. Mentorship Request Management

**Endpoints**:

- `GET /api/mentor/requests` — List incoming requests
- `POST /api/mentor/requests/{requestId}/accept` — Accept request
- `POST /api/mentor/requests/{requestId}/decline` — Decline request

**Features**:

- View all incoming mentorship requests
- Filter by status: PENDING (default), ACCEPTED, DECLINED, CANCELLED
- Request details show:
  - Student name and email
  - Student major/year
  - Stated mentorship goal
  - Student's message/context
  - Request creation date
- Accept/Decline requests with one-click actions
- Automatically prevent new requests when full (capacity management)
- Request timestamp and update tracking

### 4. Session Creation & Management

**Endpoints**:

- `POST /api/sessions` — Create session (after accepting request)
- `GET /api/sessions` — List sessions
- `PATCH /api/sessions/{sessionId}` — Update session
- `DELETE /api/sessions/{sessionId}` — Cancel session
- `POST /api/sessions/{sessionId}/complete` — Mark session complete

**Features**:

- Schedule mentoring sessions from accepted requests
- Session details:
  - Session topic (required)
  - Optional notes
  - Scheduled date/time
  - Duration (minutes)
  - Optional meeting URL (Zoom, Teams, etc.)
- Session lifecycle: SCHEDULED → COMPLETED | CANCELLED | NO_SHOW
- Prevent scheduling before request acceptance
- Only mentors can create sessions for their accepted requests

### 5. Session Feedback

**Features**:

- After session: Students/mentors can rate (1-5 stars)
- Optional session feedback comments
- Feedback stored per session (one feedback per session)
- Used for mentor rating aggregation

### 6. Mentor Dashboard & Metrics

**Endpoints**:

- `GET /api/mentor/dashboard` — Full dashboard data
- `GET /api/mentor/metrics` — Metrics summary
- `GET /api/mentor/capacity` — Current mentee capacity

**Dashboard Displays**:

- **Pending Requests**: New mentorship requests awaiting action
  - Student name and mentorship goal
  - Quick action buttons (Accept/Decline)
- **Active Mentees**: List of students in accepted mentorships
  - Student names, emails, mentorship goals
  - Quick access to schedule sessions
- **Upcoming Sessions**: Calendar of scheduled sessions
  - Student names, session topics
  - Date, time, duration
  - Meeting URL (if available)

**Metrics Tracked**:

- **Active Mentees**: Count of accepted mentorship relationships
- **Total Sessions Conducted**: All-time sessions
- **Total Hours Mentored**: Sum of all session durations
- **Average Rating**: Aggregated feedback score across all sessions

### 7. Mentee Management

**Features**:

- View detailed mentee profiles
- Track mentee progress through session history
- Access mentee academic/professional information
- Manage relationship status per mentee

### 8. Profile Management

**Endpoint**: `PATCH /api/auth/profile`

**Editable Fields**:

- First name, Last name
- Bio
- LinkedIn profile
- Skills array
- Company, Job title, Industry
- Availability status toggle
- Avatar URL

---

## Admin Features

### 1. Mentorship Cycle Management

**Endpoints**:

- `POST /api/admin/cycles` — Create cycle
- `GET /api/cycles` — List cycles
- `GET /api/cycles/{cycleId}` — View cycle details

**Features**:

- **Create mentorship cycles** (time-bound cohorts)
  - Cycle name and description
  - Start and end dates
  - Automatic duration calculation (3-6 months required)
  - Status tracking: planning → active → closed → ended
- **Manage cycle timeline**
  - Define application periods
  - Control when students can request mentors
  - Set feedback deadlines
- **Scope periods**: Sessions and requests tied to cycles
- **Broadcast notifications**: Alert all alumni when cycle starts

### 2. Permission Management

**System Properties**:

- Full access to all resources (mentorship requests, sessions, feedback, messages)
- Can read/update/delete any user data
- Can manage user profiles and roles
- Can view system-wide metrics
- Cannot modify user passwords (security boundary)

### 3. Analytics & Reporting

**Available Data**:

- System-wide mentorship statistics
- Alumni performance metrics
- Student satisfaction ratings
- Request/Session completion rates
- Engagement tracking

### 4. User Management

**Admin Capabilities**:

- View all users (Students, Alumni, other Admins)
- View complete user profiles
- Disable/enable user accounts
- Manage user roles and permissions
- View user activity logs

---

## Shared Features

### 1. Authentication & Token Management

**Endpoints**:

- `POST /api/auth/login` — User login
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Logout (clear session)
- `POST /api/auth/validate-token` — Validate token validity
- `GET /api/auth/me` — Get current user info

**Session Management**:

- Access token stored in sessionStorage (cleared on page close)
- Refresh token in httpOnly cookie (browser-managed, secure)
- Automatic token refresh on 401 response
- Concurrent refresh prevention
- Single refresh promise shared across requests

### 2. Notifications

**Notification Types**:

- REQUEST_RECEIVED: New mentorship request arrived
- REQUEST_ACCEPTED: Your mentorship request was accepted
- REQUEST_DECLINED: Your mentorship request was declined
- SESSION_REMINDER: Upcoming session reminder
- SESSION_COMPLETED: Session feedback request
- MESSAGE_NEW: New message received
- PROFILE_UPDATE: Related profile changed

**Features**:

- Real-time notification dispatch
- Read/unread status tracking
- Deep links to relevant resources
- Notification center with filtering

### 3. Messaging System

**Features**:

- One-to-one conversations
- Typing indicators (optional enhancement)
- File attachment support
- Message timestamps
- Read receipts
- User can view message history

### 4. Search & Discovery

**Alumni/Mentor Discovery**:

- Search by name
- Filter by:
  - Industry
  - Major
  - Skills
  - Availability
  - Company
- View full mentor profiles with:
  - Professional background
  - Skills and expertise
  - Availability slots
  - Average rating
  - Number of mentees

### 5. Profile Management

**All Users Can**:

- Edit personal information (name, bio, LinkedIn)
- Upload/update avatar
- Manage contact information
- View their profile as others see it

**Alumni Additional**:

- Manage professional information (company, title, industry)
- Update skills list
- Toggle availability status

**Students Additional**:

- Update academic major
- Update year level
- Manage interests/specializations

### 6. Legal & Compliance

**Registration Flow**:

- Terms of Service review and acceptance
- Privacy Policy review and acceptance
- Manual checkbox interaction (user explicitly accepts)
- Session storage tracking for document reviews
- Simple back navigation to registration form

---

## Data Models

### User

- **id**: UUID primary key
- **email**: Unique, required
- **passwordHash**: Bcrypt hashed password
- **role**: STUDENT | ALUMNI | ADMIN
- **firstName, lastName**: Required strings
- **avatarUrl**: Optional profile image
- **isVerified**: Boolean (default: false)
- **isActive**: Boolean (default: true)
- **createdAt, updatedAt**: Timestamps

**Relations**:

- One StudentProfile OR One AlumniProfile (polymorphic)
- Many Messages (sent messages)
- Many Conversations (as participant)
- Many Notifications

### StudentProfile

- **id**: UUID primary key
- **userId**: Foreign key to User
- **yearGroup**: Int (1-4)
- **major**: String
- **bio, linkedin**: Optional strings
- **interests**: String array (tags)

**Relations**:

- One User
- Many MentorshipRequests
- Many Sessions

### AlumniProfile

- **id**: UUID primary key
- **userId**: Foreign key to User
- **graduationYear**: Int
- **major**: String
- **company, jobTitle**: Required strings
- **industry**: Enum (Technology, Finance, etc.)
- **bio, linkedin**: Optional strings
- **skills**: String array
- **isAvailable**: Boolean (default: true)

**Relations**:

- One User
- Many MentorshipRequests (received)
- Many Sessions (hosted)
- Many Availability slots

### MentorshipRequest

- **id**: UUID primary key
- **studentId**: Foreign key to StudentProfile
- **alumniId**: Foreign key to AlumniProfile
- **status**: RequestStatus (PENDING | ACCEPTED | DECLINED | CANCELLED)
- **goal**: String (20-500 chars, required)
- **message**: Optional string (max 1000 chars)
- **createdAt, updatedAt, resolvedAt**: Timestamps

**Constraints**:

- Unique: (studentId, alumniId, status) — max 1 pending request per pair
- Index on: studentId, alumniId, status

### Session

- **id**: UUID primary key
- **requestId**: Foreign key to MentorshipRequest
- **studentId, alumniId**: Foreign keys (denormalized for queries)
- **status**: SessionStatus (SCHEDULED | COMPLETED | CANCELLED | NO_SHOW)
- **topic**: String (required)
- **notes**: Optional string
- **scheduledAt**: DateTime
- **duration**: Int (minutes)
- **meetingUrl**: Optional URL
- **createdAt, updatedAt**: Timestamps

**Relations**:

- One MentorshipRequest
- One SessionFeedback (optional)

### SessionFeedback

- **id**: UUID primary key
- **sessionId**: Foreign key to Session (unique)
- **rating**: Int (1-5)
- **comment**: Optional string
- **createdAt**: Timestamp

### Availability

- **id**: UUID primary key
- **alumniId**: Foreign key to AlumniProfile
- **dayOfWeek**: Enum (Monday-Sunday)
- **startTime**: String (24-hour, e.g., "09:00")
- **endTime**: String (24-hour, e.g., "11:00")

**Constraints**:

- Unique: (alumniId, dayOfWeek, startTime)

### Conversation

- **id**: UUID primary key
- **createdAt, updatedAt**: Timestamps

**Relations**:

- Many ConversationParticipants
- Many Messages

### ConversationParticipant

- **id**: UUID primary key
- **conversationId**: Foreign key to Conversation
- **userId**: Foreign key to User
- **lastReadAt**: Optional timestamp

**Constraint**: Unique (conversationId, userId)

### Message

- **id**: UUID primary key
- **conversationId**: Foreign key to Conversation
- **senderId**: Foreign key to User
- **type**: MessageType (TEXT | FILE | SYSTEM)
- **body**: String (content)
- **fileUrl**: Optional attachment URL
- **createdAt**: Timestamp

### Notification

- **id**: UUID primary key
- **userId**: Foreign key to User
- **type**: String (REQUEST_RECEIVED, REQUEST_ACCEPTED, etc.)
- **title**: String
- **body**: String
- **link**: Optional deep link
- **isRead**: Boolean (default: false)
- **createdAt**: Timestamp

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation completed successfully",
  "statusCode": 200
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": [ /* validation errors */ ],
  "statusCode": 400
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Permission boundaries

### STUDENT

- Create: Mentorship requests
- Read: Own profiles, All alumni profiles, Own requests, Own sessions, Messages
- Update: Own profile
- List: Requests (own), Sessions (own), Conversations (own)

### ALUMNI

- Create: Mentorship requests, Sessions, Availability, Messages
- Read: Own profile, Own requests, Own sessions, All student profiles, Messages
- Update: Own profile, Availability, Sessions (draft), Sessions (schedule/cancel)
- List: Requests (own), Sessions (own), Conversations (own), Availability (own)
- Actions: Accept/Decline requests

### ADMIN

- Create: Mentorship cycles, Notifications
- Read: Any user, Any resource
- Update: Any user profile, User status
- Delete: Any violating content
- List: All resources with filters
- View: System analytics

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16+, React, Tailwind CSS, react-hook-form |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication** | JWT (access + refresh tokens) |
| **Authorization** | ABAC permission engine |
| **Validation** | Zod schemas |
| **Testing** | Vitest, React Testing Library |
| **Styling** | Tailwind CSS, Shadcn/ui components |

---

## Key Design Patterns

### 1. Service Layer Pattern

- `MentorshipRequestService` - Request logic
- `SessionService` - Session scheduling
- `ProfileService` - Profile management
- `MessageService` - Messaging
- `AvailabilityService` - Availability slots
- `NotificationService` - Notifications

### 2. ABAC Permission Engine

- Role-based defaults (STUDENT, ALUMNI, ADMIN)
- Resource-scoped permissions (own vs. all)
- Field-level restrictions (pick permitted fields)
- Automatic permission filtering on queries

### 3. Error Handling

- Structured exception responses
- Validation error details
- Resource not found (404)
- Permission denied (403)
- Internal server errors (500)

---

## Future Enhancements

- Video/Audio call integration
- Session rescheduling
- Bulk mentorship cycles
- Alumni alumni mentoring (advanced)
- Performance analytics dashboard
- Integration with Ashesi systems (SSO, email)
- Mobile app version
