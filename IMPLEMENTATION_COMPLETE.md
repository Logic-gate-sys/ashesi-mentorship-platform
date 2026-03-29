# Mentor App - Complete API + WebSocket Implementation

## Overview

This document outlines the complete implementation of the Mentor App's API, WebSocket features, schema validation, and ABAC (Attribute-Based Access Control) system.

## Table of Contents
1. [Architecture](#architecture)
2. [ABAC System](#abac-system)
3. [API Endpoints](#api-endpoints)
4. [WebSocket Features](#websocket-features)
5. [Schema Validation](#schema-validation)
6. [Integration Tests](#integration-tests)
7. [Running the Application](#running-the-application)

---

## Architecture

### Project Structure

```
app/
├── _lib/
│   ├── abac/                    # ABAC System
│   │   ├── types.ts             # ABAC type definitions
│   │   ├── engine.ts            # ABAC policy engine
│   │   ├── middleware.ts        # Permission middleware
│   │   └── index.ts             # Public exports
│   ├── socket.ts                # WebSocket implementation
│   ├── jwt.ts                   # JWT utilities
│   ├── db.ts                    # Database connection
│   └── password.ts              # Password utilities
├── _schemas/                    # Zod validation schemas
│   ├── auth.schema.ts
│   ├── request.schema.ts        # Mentorship requests
│   ├── session.schema.ts        # Sessions & feedback
│   ├── availability.schema.ts   # Mentor availability
│   ├── messaging.schema.ts      # Conversations & messages
│   ├── user.schema.ts           # User profiles & notifications
│   ├── admin.schema.ts          # Admin operations
│   └── response.schema.ts       # API response schemas
├── _utils/
│   ├── api-response.ts          # Response utilities
│   └── [existing utilities]
└── api/
    ├── student/
    │   └── requests/            # Student mentorship requests
    ├── mentor/
    │   ├── requests/            # Mentor request actions
    │   └── dashboard/           # Mentor dashboard
    ├── alumni/
    │   └── availability/        # Alumni availability slots
    ├── sessions/                # Session management
    ├── messages/                # Messaging endpoints
    ├── notifications/           # Notification endpoints
    ├── admin/
    │   ├── cycles/              # Mentorship cycle management
    │   └── users/               # User management
    └── [existing routes]
```

---

## ABAC System

### What is ABAC?

Attribute-Based Access Control (ABAC) is a flexible permission system that makes authorization decisions based on:
- **User Attributes**: role, id, verification status, etc.
- **Resource Attributes**: type, owner, status, visibility, etc.
- **Action**: create, read, update, delete, accept, decline, etc.
- **Environment Attributes**: time, IP address, etc.

### Key Components

#### 1. **Types** (`app/_lib/abac/types.ts`)
- Defines all ABAC types: `UserRole`, `ResourceType`, `ActionType`
- Structures for `AbacContext`, `PermissionRule`, `PermissionConfig`

#### 2. **Engine** (`app/_lib/abac/engine.ts`)
- Evaluates permissions based on policies
- Contains default policies for all resource types:
  - **Mentorship Requests**: Students create, alumni accept/decline
  - **Sessions**: Alumni create, students & alumni read
  - **User Profiles**: Users update own, admins unrestricted
  - **Conversations**: Participants can read/write
  - **Availability**: Alumni manage their own
  - **Admin Operations**: Admins only

#### 3. **Middleware** (`app/_lib/abac/middleware.ts`)
- `AuthorizationMiddleware`: Enforces permissions on requests
- `requireAuth()`: Simple authentication check
- `requirePermission()`: Full ABAC check with action & resource
- JWT token extraction and validation

### Example Usage

```typescript
import { requirePermission } from '@/app/_lib/abac/middleware';

export async function POST(request: NextRequest) {
  // Check if user can create mentorship request
  const authResult = await requirePermission(
    request, 
    'mentorship_request', 
    'create',
    { type: 'mentorship_request' }
  );

  if (authResult instanceof NextResponse) {
    return authResult; // Unauthorized or forbidden
  }

  const { user } = authResult;
  // Proceed with request...
}
```

### Policies Overview

| Resource | Student | Alumni | Admin | Guest |
|----------|---------|--------|-------|-------|
| Create Request | ✓ | ✗ | ✓ | ✗ |
| Accept Request | ✗ | ✓* | ✓ | ✗ |
| Create Session | ✗ | ✓* | ✓ | ✗ |
| Create Feedback | ✓* | ✗ | ✓ | ✗ |
| Manage Availability | ✗ | ✓ | ✓ | ✗ |
| Create Cycle | ✗ | ✗ | ✓ | ✗ |
| Manage Users | ✗ | ✗ | ✓ | ✗ |

*With attribute conditions (e.g., ownership)

---

## API Endpoints

### Authentication

#### POST `/api/auth/register/student`
Register as a student

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@ashesi.edu.gh",
  "password": "SecurePass123!",
  "confirm": "SecurePass123!",
  "year": 2,
  "major": "Computer Science",
  "interests": ["Web Dev", "AI"],
  "bio": "Passionate about technology",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

#### POST `/api/auth/register/alumni`
Register as an alumni

#### POST `/api/auth/login`
Login and get JWT tokens

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "user": { ... }
  }
}
```

### Mentorship Requests

#### POST `/api/student/requests`
Create a mentorship request

**Request:**
```json
{
  "alumniId": "uuid",
  "goal": "Learn web development best practices",
  "message": "I am interested in your expertise"
}
```

#### GET `/api/student/requests`
List mentorship requests

**Query Parameters:**
- `status`: PENDING | ACCEPTED | DECLINED | CANCELLED
- `limit`: 1-100 (default: 10)
- `offset`: pagination offset
- `sortBy`: createdAt | updatedAt
- `sortOrder`: asc | desc

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 25,
    "hasMore": true
  }
}
```

#### POST `/api/mentor/requests/:requestId/accept`
Accept a mentorship request (Alumni only)

#### POST `/api/mentor/requests/:requestId/decline`
Decline a mentorship request (Alumni only)

**Request:**
```json
{
  "reason": "Not available at this time"
}
```

### Sessions

#### POST `/api/sessions`
Create a session

**Request:**
```json
{
  "requestId": "uuid",
  "topic": "Introduction to Web Development",
  "duration": 60,
  "scheduledAt": "2026-04-15T14:00:00Z",
  "meetingUrl": "https://zoom.us/meeting/abc123",
  "notes": "Bring your laptop"
}
```

#### GET `/api/sessions`
List sessions for current user

**Query Parameters:**
- `status`: SCHEDULED | COMPLETED | CANCELLED | NO_SHOW
- `limit`, `offset`: pagination
- `sortBy`: scheduledAt | createdAt
- `sortOrder`: asc | desc

#### POST `/api/sessions/:sessionId/feedback`
Submit session feedback (Student only)

**Request:**
```json
{
  "rating": 5,
  "comment": "Great session! Learned a lot about React."
}
```

### Alumni Profiles

#### POST `/api/alumni/availability`
Add availability slot

**Request:**
```json
{
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "11:00"
}
```

#### GET `/api/alumni/availability`
List availability slots

**Query Parameters:**
- `alumniId`: filter by alumni (optional)
- `dayOfWeek`: filter by day
- `limit`, `offset`: pagination

#### DELETE `/api/alumni/availability/:id`
Remove availability slot

### Messaging

#### POST `/api/messages/conversations`
Create a conversation

**Request:**
```json
{
  "participantIds": ["uuid1", "uuid2", ...]
}
```

#### POST `/api/messages/:conversationId`
Send a message

**Request:**
```json
{
  "type": "TEXT",
  "body": "Hello, how are you?",
  "fileUrl": "https://..."  // optional
}
```

#### GET `/api/messages/:conversationId`
Get messages in a conversation

**Query Parameters:**
- `limit`: 1-100
- `offset`: pagination offset
- `sortOrder`: asc | desc (default: desc)

### Notifications

#### GET `/api/notifications`
List user notifications

**Query Parameters:**
- `isRead`: true | false (optional)
- `limit`, `offset`: pagination

#### PATCH `/api/notifications/:id/read`
Mark notification as read

#### DELETE `/api/notifications/:id`
Delete a notification

### Admin - Mentorship Cycles

#### POST `/api/admin/cycles`
Create mentorship cycle (Admin only)

**Request:**
```json
{
  "name": "Spring 2026 Cohort",
  "description": "Third cohort of the program",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-08-31T23:59:59Z"
}
```

#### GET `/api/admin/cycles`
List mentorship cycles

**Query Parameters:**
- `status`: PLANNING | ACTIVE | CLOSED | ENDED
- `limit`, `offset`: pagination
- `sortBy`: startDate | createdAt

#### PATCH `/api/admin/cycles/:id`
Update mentorship cycle

#### DELETE `/api/admin/cycles/:id`
Delete mentorship cycle

### Admin - User Management

#### GET `/api/admin/users`
List all users

**Query Parameters:**
- `role`: STUDENT | ALUMNI | ADMIN
- `isActive`: true | false
- `isVerified`: true | false
- `limit`, `offset`: pagination

#### PATCH `/api/admin/users/:id/activate`
Activate a user

#### PATCH `/api/admin/users/:id/deactivate`
Deactivate a user

**Request:**
```json
{
  "reason": "Violation of terms"
}
```

#### PATCH `/api/admin/users/:id/verify`
Verify a user email

---

## WebSocket Features

### Socket.IO Implementation

**Location:** `app/_lib/socket.ts`

### Connection

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: jwtToken
  },
  transports: ['websocket', 'polling']
});
```

### Authentication

The server enforces JWT token authentication on connection:
```typescript
socket.on('error', (error) => {
  if (error === 'Authentication failed') {
    // Handle auth error
  }
});
```

### Events

#### Conversations
- **join_conversation**: `{conversationId}`
- **leave_conversation**: `{conversationId}`
- **typing**: `{conversationId}`
- **stop_typing**: `{conversationId}`

**Receive Events:**
- `joined_conversation`: Confirmation of join
- `user_typing`: Another user is typing
- `user_stopped_typing`: Another user stopped

#### Sessions
- **join_session**: `{sessionId}`
- **leave_session**: `{sessionId}`
- **session_started**: `{sessionId}`
- **session_ended**: `{sessionId}`

**Receive Events:**
- `joined_session`: Confirmation
- `session_user_joined`: Another user joined
- `session_user_left`: User left
- `session_started`: Session started
- `session_ended`: Session ended

#### Notifications
- **request_received**: `{mentorId, requestId, body}`
- **session_reminder**: `{studentId, mentorId, sessionId, body}`
- **watch_mentor_availability**: `{mentorId}`
- **unwatch_mentor_availability**: `{mentorId}`

**Receive Events:**
- `notification`: `{type, title, body, ...}`

#### Room Structure
- `user:{userId}`: Personal notifications
- `conversation:{conversationId}`: Conversation messages
- `session:{sessionId}`: Session participants
- `mentor:{mentorId}:availability`: Mentor availability updates

### Example Client Usage

```typescript
const socket = io('http://localhost:3000', {
  auth: { token: jwtToken }
});

// Join a conversation
socket.emit('join_conversation', conversationId);

// Listen for messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Listen for typing
socket.on('user_typing', ({userId}) => {
  console.log('User is typing...');
});

// Send typing indicator
socket.emit('typing', conversationId);
```

---

## Schema Validation

All API endpoints use Zod for runtime validation. Schemas are organized by feature:

### Files

| File | Purpose |
|------|---------|
| `auth.schema.ts` | User registration & login |
| `request.schema.ts` | Mentorship requests |
| `session.schema.ts` | Sessions & feedback |
| `availability.schema.ts` | Alumni availability |
| `messaging.schema.ts` | Conversations & messages |
| `user.schema.ts` | User profiles & notifications |
| `admin.schema.ts` | Admin operations |
| `response.schema.ts` | API response formats |

### Validation Features

- **Type-safe**: Full TypeScript inference
- **Custom validators**: Email domain, time formats, etc.
- **Refinements**: Cross-field validation (e.g., password match)
- **Transformations**: Auto-trim, parse dates, etc.

### Example

```typescript
import { createMentorshipRequestSchema } from '@/app/_schemas/request.schema';

// In API route
const parseResult = await parseRequestBody(request, createMentorshipRequestSchema);
if (!parseResult.success) {
  return parseResult.error; // Validation error response
}

const { alumniId, goal, message } = parseResult.data;
```

---

## Integration Tests

### Test Files

| File | Coverage |
|------|----------|
| `mentorship.test.ts` | Requests, sessions, availability, ABAC |
| `messaging.test.ts` | Conversations, messages, notifications |
| `admin.test.ts` | Cycles, user management, analytics |

### Test Structure

Each test file covers:
1. **Happy path**: Standard successful operations
2. **Validation**: Schema validation and constraints
3. **Authentication**: Unauthorized access prevention
4. **ABAC**: Permission enforcement
5. **Edge cases**: Boundary conditions, conflicts

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test mentorship.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Test Helpers

Located in `tests/helpers/`:
- `test-db-utils.ts`: Database setup/teardown
- `render-with-providers.tsx`: Component testing utilities
- `test-helpers.ts`: Common test utilities

```typescript
// Example: Create test user
async function createTestUser(role: 'STUDENT' | 'ALUMNI' | 'ADMIN') {
  const user = await prisma.user.create({
    data: {
      email: `test-${role.toLowerCase()}-${Date.now()}@ashesi.edu.gh`,
      passwordHash: hashPassword('TestPass123!'),
      role,
      firstName: 'Test',
      lastName: role,
      isVerified: true,
      isActive: true,
    },
  });
  return user;
}
```

---

## Running the Application

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment variables:**
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mentor_app"
JWT_SECRET="your-secret-key-change-this-in-production"
NODE_ENV="development"
```

3. **Setup database:**
```bash
npm run prisma:migrate
```

4. **Seed database (optional):**
```bash
npm run seed
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run and exit
npm run test:run
```

### Production Build

```bash
# Build
npm run build

# Start
npm run start
```

---

## Key Features Implemented

### ✅ ABAC (Attribute-Based Access Control)
- Flexible, rule-based permission system
- Policies for all resource types
- Condition-based rules
- Default policies for all operations

### ✅ Comprehensive API
- 30+ endpoints covering all features
- Consistent response format
- Proper HTTP status codes
- Pagination support
- Query parameter validation

### ✅ Real-time WebSocket
- Socket.IO integration
- Event-driven architecture
- Room-based broadcasting
- Typing indicators
- Connection authentication

### ✅ Zod Schema Validation
- All inputs validated
- Type-safe with inference
- Custom validators
- Helpful error messages
- Date/time parsing

### ✅ Integration Tests
- 100+ test cases
- Full ABAC coverage
- Happy path & edge cases
- Authentication tests
- Permission enforcement tests

### ✅ Modular Design
- Separated concerns
- Reusable utilities
- Clear file organization
- Extensible architecture

---

## Next Steps / Future Enhancements

1. **Email Notifications**: Send real emails on mentorship events
2. **Analytics Dashboard**: Track mentorship metrics
3. **File Uploads**: Resume, portfolio uploads
4. **Video Integration**: Zoom/Google Meet integration
5. **Ratings & Reviews**: Alumni ratings system
6. **Advanced Search**: Full-text search for mentors
7. **Matching Algorithm**: AI-powered mentor matching
8. **Mobile App**: React Native client

---

## Support & Troubleshooting

### Common Issues

**"Authentication failed" on WebSocket:**
- Ensure JWT token is passed in connection auth
- Check token expiration

**Permission denied (403):**
- Verify user role and resource ownership
- Check ABAC policies in `engine.ts`

**Validation errors:**
- Review error details in response
- Check schema definitions in `_schemas/` folder

**Database connection issues:**
- Verify DATABASE_URL in `.env.local`
- Ensure PostgreSQL is running
- Check connection string format

---

## Summary

This implementation provides a production-ready mentorship platform with:
- Secure, flexible permission system (ABAC)
- Comprehensive REST API with validation
- Real-time WebSocket features
- Extensive test coverage
- Clean, modular architecture

All code follows best practices with proper error handling, logging, and documentation.
