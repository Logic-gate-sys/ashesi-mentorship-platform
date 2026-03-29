# ABAC Integration Completion Checklist

Track progress of integrating the permission system into all API routes.

## Core System ✅

- [x] Engine rewritten with PermissionBuilder
- [x] Middleware simplified with new functions
- [x] Types updated and cleaned
- [x] Permission utilities created
- [x] Documentation complete

## API Route Integration

### Students
- [x] POST/GET `/api/student/requests/route.ts` - ✅ COMPLETED
  - Uses `requirePermission()` for auth
  - Uses `buildPermissionFilter()` for list query
  - Status filters combined correctly

### Mentor/Requests
- [ ] POST/GET `/api/mentor/requests/route.ts` - If exists
  - Need: Add `buildPermissionFilter()` to GET
  - Note: The `[requestId]` route is separate below

- [ ] POST `/api/mentor/requests/[requestId]/route.ts` - Accept/Decline
  - Need: `requirePermission()` for 'accept'/'decline' actions
  - Check: Permission with `{ alumniId }` condition

### Sessions
- [x] POST/GET `/api/sessions/route.ts` - ✅ COMPLETED
  - Uses `requirePermission()` for auth
  - Uses `buildPermissionFilter()` for list query

- [ ] GET `/api/sessions/[sessionId]/route.ts` - Get single
  - Need: `requireAuth()` + permission check with context
  - Note: Use `permissions.can()` with `{ studentId, alumniId }`

- [ ] PATCH `/api/sessions/[sessionId]/route.ts` - Update
  - Need: `requirePermission()` for 'update'
  - Need: `pickPermittedFields()` for field filtering
  - Field restrictions: Alumni can update `notes`, `meetingUrl` only

- [ ] DELETE `/api/sessions/[sessionId]/route.ts` - Delete
  - Need: `requirePermission()` for 'delete'
  - Check: Only alumni who created can delete

### Session Feedback
- [ ] POST `/api/sessions/[sessionId]/feedback/route.ts` - Create
  - Need: Students can create feedback on their sessions
  - Check: Session exists and user is student

- [ ] GET `/api/sessions/[sessionId]/feedback/route.ts` - Get feedback
  - Need: Both student and alumni can view
  - No sensitive data, can be permissive

- [ ] PATCH `/api/sessions/[sessionId]/feedback/[feedbackId]/route.ts` - Update
  - Need: Only feedback creator can update
  - Check: `permissions.can()` with ownership

### Alumni Availability
- [ ] GET `/api/alumni/availability/route.ts` - List
  - Need: Publicly available if `isAvailable: true`
  - Alumni see their own availability
  - Admin sees all

- [ ] POST `/api/alumni/availability/route.ts` - Create
  - Need: `requirePermission()` for 'create'
  - Check: Alumni role required
  - Verify: Time format validation (HH:MM)

- [ ] PUT `/api/alumni/availability/[availabilityId]/route.ts` - Update
  - Need: `requirePermission()` for 'update'
  - Check: `{ alumniId }` condition

- [ ] DELETE `/api/alumni/availability/[availabilityId]/route.ts` - Delete
  - Need: `requirePermission()` for 'delete'
  - Check: `{ alumniId }` condition

### Messages & Conversations
- [ ] GET `/api/messages/route.ts` - List conversations
  - Need: `buildPermissionFilter()` for participant check
  - Filter: Only conversations user participates in

- [ ] POST `/api/messages/route.ts` - Create conversation
  - Need: `requirePermission()` for 'create'
  - Auto-add creator as participant

- [ ] POST `/api/messages/route.ts` (messages) - Send message
  - Need: `requirePermission()` for 'create'
  - Check: User is conversation participant

- [ ] GET `/api/messages/[conversationId]/route.ts` - Get messages
  - Need: `requirePermission()` for 'read'
  - Filter: Only messages in conversation user is in

- [ ] DELETE `/api/messages/[messageId]/route.ts` - Delete message
  - Need: `requirePermission()` for 'delete'
  - Check: Only message sender can delete

### Notifications
- [ ] GET `/api/notifications/route.ts` - List notifications
  - Need: `buildPermissionFilter()` with `{ userId }`
  - Filter: Only own notifications

- [ ] PATCH `/api/notifications/[notificationId]/route.ts` - Mark read
  - Need: `requirePermission()` for 'update'
  - Field: Can only update `isRead`
  - Check: `pickPermittedFields()`

- [ ] DELETE `/api/notifications/[notificationId]/route.ts` - Delete
  - Need: `requirePermission()` for 'delete'
  - Check: Only notification owner

### User Profiles
- [ ] GET `/api/profile/[userId]/route.ts` - Public profile view
  - Need: Allow all authenticated users
  - Hide: Private fields (email, etc.)

- [ ] GET `/api/user/profile/route.ts` - Own profile
  - Need: `requireAuth()`
  - Return: Own full profile

- [ ] PATCH `/api/user/profile/route.ts` - Update own profile
  - Need: `requirePermission()` for 'update'
  - Field restrictions: `pickPermittedFields()`
  - Student can update: bio, linkedin, interests
  - Alumni can update: bio, linkedin, skills, isAvailable
  - Admin can update: All fields

### Admin Routes (if separate)
- [ ] POST `/api/admin/cycles/route.ts` - Create cycle
  - Need: Check `user.role === 'ADMIN'`
  - Or: `requirePermission()` for 'create' on 'mentorship_cycle'

- [ ] GET `/api/admin/cycles/route.ts` - List cycles
  - Need: Admin only check
  - List only visible to admin

- [ ] PATCH `/api/admin/cycles/[cycleId]/route.ts` - Update cycle
  - Need: Admin only
  - Field: Status updates

- [ ] DELETE `/api/admin/cycles/[cycleId]/route.ts` - Delete cycle
  - Need: Admin only

- [ ] POST `/api/admin/users/[userId]/route.ts` - Manage users
  - Need: Admin only
  - Actions: Activate, deactivate, verify, etc.

- [ ] GET `/api/admin/analytics/route.ts` - Analytics
  - Need: Admin only
  - Return: System-wide statistics

### Other Routes
- [ ] Any other routes in `/api/**`

## Integration Steps per Route

When updating each route:

1. [ ] Add imports: `buildPermissionFilter`, `requirePermission`
2. [ ] Add `requirePermission()` or `requireAuth()` early in handler
3. [ ] Check if result is `NextResponse` and return it
4. [ ] For GET: Use `buildPermissionFilter()` in database query
5. [ ] For PATCH: Use `pickPermittedFields()` to filter updates
6. [ ] For DELETE: Check `permissions.can()` with context
7. [ ] Verify correct status codes (201 for create, etc.)
8. [ ] Test permission enforcement (unit or integration test)

## Testing Each Route

For each route, add tests verifying:

- [x] Student can access own data
- [x] Student cannot access other students' data
- [x] Alumni can access their data
- [x] Alumni cannot access other alumni's data
- [x] Admin can access all data
- [x] Unauthorized requests return 401
- [x] Forbidden requests return 403
- [x] Field restrictions prevent unauthorized updates

## Documentation Locations

- **Quick start**: `PERMISSIONS_INTEGRATION.md`
- **API reference**: `ABAC_API_REFERENCE.md`
- **Route templates**: `ROUTE_INTEGRATION_TEMPLATES.md`
- **Summary**: `ABAC_INTEGRATION_SUMMARY.md`

## Priority Order

### High Priority (Already Updated)
1. ✅ Student requests (POST/GET)
2. ✅ Sessions (POST/GET)

### Medium Priority (Should be done next)
3. [ ] Single session GET
4. [ ] Session PATCH/DELETE
5. [ ] Mentor requests endpoints
6. [ ] Availability endpoints
7. [ ] Conversations and messages

### Lower Priority (Can follow after medium)
8. [ ] User profiles
9. [ ] Notifications
10. [ ] Admin routes

## Progress Summary

**Completed**: 2 route pairs (student requests, sessions list)
**Remaining**: ~18+ routes

**Estimated effort**: 30 min per route once pattern is understood

## Common Issues & Solutions

### Issue: Route not in standard structure
**Solution**: Check if route is `/api/[...slug]/route.ts` or separate POST/GET files

### Issue: Unclear permission rules
**Solution**: Check `engine.ts` `addXxxPermissions()` functions for the role

### Issue: Complex queries with relations
**Solution**: See template 4 in `ROUTE_INTEGRATION_TEMPLATES.md` for many-to-many patterns

### Issue: Permission filter returns empty
**Solution**: 
- Check user has necessary profile (studentProfile, alumniProfile)
- Verify role is set correctly
- Check permissions are granted for that role in engine

### Issue: Tests failing after integration
**Solution**:
- Verify `buildPermissionFilter()` generates correct WHERE clause
- Check user has right profile loaded
- Test with actual user role (not role name typo)

## Questions?

Refer to the documentation:
1. **"How do I..."** → `ABAC_API_REFERENCE.md`
2. **"How do I update a route?"** → `ROUTE_INTEGRATION_TEMPLATES.md`
3. **"How does this work?"** → `ABAC_INTEGRATION_SUMMARY.md`
4. **"I'm integrating, show me everything"** → `PERMISSIONS_INTEGRATION.md`
