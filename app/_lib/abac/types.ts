/**
 * ABAC (Attribute-Based Access Control) Type Definitions
 * 
 * Flexible permission system based on attributes of:
 * - User (role, id, isVerified, isActive, etc.)
 * - Resource (type, owner, status, etc.)  
 * - Action (create, read, update, delete, list, accept, decline, etc.)
 * - Environment (time, IP, etc.)
 */

import type { Role } from '@/prisma/generated/prisma/client'
import type { NextResponse } from 'next/server'

// User-related types
export type UserRole = Role // 'STUDENT' | 'ALUMNI' | 'ADMIN'

export interface UserAttributes {
  id: string
  role: UserRole
  email: string
  isVerified: boolean
  isActive: boolean
}

// Resource types match our Prisma models
export type ResourceType =
  | 'mentorship_request'
  | 'session'
  | 'session_feedback'
  | 'availability'
  | 'conversation'
  | 'message'
  | 'notification'
  | 'user'
  | 'user_profile'

// Action types for each resource
export type ActionType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'accept'
  | 'decline'

// Resource-specific condition attributes
export interface ResourceAttributes {
  type: ResourceType
  ownerId?: string
  studentId?: string
  alumniId?: string
  participantId?: string
  creatorId?: string
  userId?: string
  status?: string
  isLocked?: boolean
  isAvailable?: boolean
  [key: string]: unknown
}

// ABAC Context - information needed for permission evaluation
export interface AbacContext {
  user: UserAttributes
  resource?: ResourceAttributes
  action: ActionType
  environment?: {
    timestamp?: Date
    ipAddress?: string
    method?: string
    [key: string]: unknown
  }
}

// Permission Decision
export interface PermissionDecision {
  allowed: boolean
  reason?: string
  resourceFilter?: unknown // Prisma where clause for list operations
}

// Helper types for route handlers
export type AuthResult<T = unknown> =
  | { user: T; permissions: unknown }
  | NextResponse
