import { ValidationError, ConflictError } from '@/app/_middleware'

/**
 * Business Logic Validators
 * These validators encapsulate domain-specific rules that should not be in routes
 */

export interface MentorshipRequestValidation {
  studentId: string
  alumniId: string
  goal: string
  message: string
}

/**
 * Validate mentorship request creation
 */
export function validateMentorshipRequest(
  data: MentorshipRequestValidation,
  existingRequestCount?: number
): void {
  // Check for required fields
  if (!data.goal || data.goal.trim().length === 0) {
    throw new ValidationError('Goal is required')
  }

  if (!data.message || data.message.trim().length === 0) {
    throw new ValidationError('Message is required')
  }

  // Check for duplicate requests
  if (existingRequestCount && existingRequestCount > 0) {
    throw new ConflictError('An active mentorship request already exists with this mentor')
  }
}

/**
 * Validate session data
 */
export interface SessionValidation {
  title: string
  description: string
  startTime: Date
  endTime: Date
  mentorId: string
  studentId: string
}

export function validateSessionData(data: SessionValidation): void {
  // Check for required fields
  if (!data.title || data.title.trim().length === 0) {
    throw new ValidationError('Session title is required')
  }

  if (!data.description || data.description.trim().length === 0) {
    throw new ValidationError('Session description is required')
  }

  // Check date validity
  if (data.startTime >= data.endTime) {
    throw new ValidationError('Session start time must be before end time')
  }

  // Check if session is in the future
  if (data.startTime < new Date()) {
    throw new ValidationError('Session must be scheduled for a future time')
  }

  // Check for reasonable duration (e.g., max 4 hours)
  const duration = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60)
  if (duration > 240) {
    throw new ValidationError('Session duration cannot exceed 4 hours')
  }
}

/**
 * Validate availability data
 */
export interface AvailabilityValidation {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export function validateAvailability(data: AvailabilityValidation): void {
  // Validate day of week (0-6)
  if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
    throw new ValidationError('Invalid day of week')
  }

  // Validate time format and order
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(data.startTime)) {
    throw new ValidationError('Invalid start time format. Use HH:MM')
  }

  if (!timeRegex.test(data.endTime)) {
    throw new ValidationError('Invalid end time format. Use HH:MM')
  }

  // Check that start time is before end time
  if (data.startTime >= data.endTime) {
    throw new ValidationError('Start time must be before end time')
  }
}

/**
 * Validate feedback rating
 */
export interface FeedbackValidation {
  rating: number
  comment: string
}

export function validateFeedback(data: FeedbackValidation): void {
  // Validate rating range (1-5)
  if (data.rating < 1 || data.rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5')
  }

  // Validate comment length
  if (data.comment.length === 0) {
    throw new ValidationError('Comment is required')
  }

  if (data.comment.length > 1000) {
    throw new ValidationError('Comment cannot exceed 1000 characters')
  }
}

/**
 * Validate user profile data
 */
export interface ProfileValidation {
  firstName: string
  lastName: string
  email: string
  bio?: string
  phone?: string
}

export function validateProfile(data: ProfileValidation): void {
  if (!data.firstName || data.firstName.trim().length === 0) {
    throw new ValidationError('First name is required')
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    throw new ValidationError('Last name is required')
  }

  if (!data.email || !data.email.includes('@')) {
    throw new ValidationError('Valid email is required')
  }

  if (data.bio && data.bio.length > 500) {
    throw new ValidationError('Bio cannot exceed 500 characters')
  }

  if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    throw new ValidationError('Invalid phone number format')
  }
}
