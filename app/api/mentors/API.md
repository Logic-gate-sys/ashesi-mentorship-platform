# Mentor Dashboard API Documentation

## Overview

This is a modular, ABAC-protected REST API for the Mentor Dashboard. All endpoints require authentication via JWT token in the `Authorization` header or `access_token` cookie.

## Authentication

All endpoints require a valid JWT token. Include in request header:
```
Authorization: Bearer <token>
```

Or via cookie: `access_token=<token>`

## API Endpoints

### Dashboard
- **GET /api/mentors/dashboard** - Get complete dashboard overview with metrics, pending requests, active mentees, and upcoming sessions
  - Response: `{ mentor, metrics, pendingRequests, activeMentees, upcomingSessions }`

### Mentor Profile
- **GET /api/mentors/[id]** - Get mentor profile details
  - Response: MentorProfile with user data and availability

### Mentorship Requests
- **GET /api/mentors/requests** - List all requests with optional status filter
  - Query: `?status=PENDING|ACCEPTED|DECLINED|CANCELLED|EXPIRED`
  - Response: `{ requests[], count, filters }`

- **GET /api/mentors/requests/[id]** - Get single request details
  - Response: MentorshipRequest with mentee and mentor details

- **POST /api/mentors/requests/[id]** - Accept or decline a request
  - Query: `?action=accept|decline`
  - Response: Updated MentorshipRequest

### Sessions
- **GET /api/mentors/sessions** - List sessions with optional filters
  - Query: `?filter=upcoming|all` and `?status=SCHEDULED|COMPLETED|CANCELLED|RESCHEDULED|NO_SHOW`
  - Response: `{ sessions[], count, filters }`

- **POST /api/mentors/sessions** - Create a new session
  - Body: `{ requestId, menteeId, topic, scheduledAt, duration, type?, notes?, meetingUrl? }`
  - Response: Created Session

- **GET /api/mentors/sessions/[id]** - Get session details
  - Response: Session with mentee, mentor, request, and feedback

- **PATCH /api/mentors/sessions/[id]** - Update session (only editable fields)
  - Body: `{ topic?, scheduledAt?, duration?, notes?, meetingUrl? }`
  - Response: Updated Session

- **POST /api/mentors/sessions/[id]** - Complete or cancel session
  - Query: `?action=complete|cancel`
  - Body (for cancel): `{ reason?: string }`
  - Response: Updated Session

### Messages & Conversations
- **GET /api/mentors/messages** - List conversations
  - Query: `?limit=50&offset=0`
  - Response: `{ conversations[], count, pagination }`

- **GET /api/mentors/messages/[conversationId]** - Get conversation messages
  - Query: `?limit=50&offset=0`
  - Response: `{ conversation, messageCount }`

- **POST /api/mentors/messages/[conversationId]** - Send a message
  - Body: `{ receiverId, body, type?: TEXT|FILE|IMAGE, fileUrl?: string }`
  - Response: Created Message

### Availability
- **GET /api/mentors/availability** - List availability slots
  - Response: `{ availability[], count }`

- **POST /api/mentors/availability** - Add new availability slot
  - Body: `{ dayOfWeek: MONDAY|...|SUNDAY, startTime: "HH:mm", endTime: "HH:mm" }`
  - Response: Created Availability

- **PATCH /api/mentors/availability/[slotId]** - Update availability slot
  - Body: `{ dayOfWeek?, startTime?, endTime? }`
  - Response: Updated Availability

- **DELETE /api/mentors/availability/[slotId]** - Delete availability slot
  - Response: `{ success: true }`

### Feedback
- **GET /api/mentors/feedback** - Get all feedback received
  - Response: `{ feedback[], stats: { averageRating, totalFeedback }, count }`

- **GET /api/mentors/feedback/[sessionId]** - Get feedback for a specific session
  - Response: SessionFeedback with session details

- **POST /api/mentors/feedback/[sessionId]** - Create feedback for a session
  - Body: `{ rating: 1-5, comment?: string }`
  - Response: Created SessionFeedback

- **PATCH /api/mentors/feedback/[sessionId]** - Update feedback
  - Body: `{ rating?: 1-5, comment?: string }`
  - Response: Updated SessionFeedback

- **DELETE /api/mentors/feedback/[sessionId]** - Delete feedback
  - Response: `{ success: true }`

## Response Format

All responses follow a standard format:

```json
{
  "success": boolean,
  "data": {},
  "message": string,
  "timestamp": "2026-04-16T12:00:00Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden  
- `404` - Not Found
- `500` - Server Error

## Error Handling

Errors are returned with appropriate status codes and error messages in the response.

## Service Layer Architecture

The API is built on modular services:

- **mentorship-requests.service** - Request management (CRUD, accept/decline)
- **sessions.service** - Session management (CRUD, status changes)
- **messages.service** - Messaging and conversations
- **availability.service** - Mentor availability management
- **feedback.service** - Session feedback and ratings
- **metrics.service** - Dashboard metrics and aggregations

## Security

- All endpoints require JWT authentication
- ABAC (Attribute-Based Access Control) validates permissions
- Users can only access their own data (mentors access mentor data, mentees access mentee data)
- Role-based access: Only MENTOR role can access most endpoints

## Rate Limiting

Currently not implemented. To be added in future versions.

## Pagination

Endpoints that return lists support:
- `limit` - Number of results (default: 50)
- `offset` - Number of results to skip (default: 0)

## Time Format

All dates/times are in ISO 8601 format: `2026-04-16T12:00:00Z`

## Examples

### Get Dashboard Data
```bash
curl -H "Authorization: Bearer <token>" \
  https://mentorapp.com/api/mentors/dashboard
```

### Accept a Request
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  https://mentorapp.com/api/mentors/requests/req-123?action=accept
```

### Create Session
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "req-123",
    "menteeId": "profile-456",
    "topic": "Career Development",
    "scheduledAt": "2026-04-20T14:00:00Z",
    "duration": 60,
    "type": "VIRTUAL"
  }' \
  https://mentorapp.com/api/mentors/sessions
```

### Send Message
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "user-456",
    "body": "Great session today!",
    "type": "TEXT"
  }' \
  https://mentorapp.com/api/mentors/messages/conv-789
```
