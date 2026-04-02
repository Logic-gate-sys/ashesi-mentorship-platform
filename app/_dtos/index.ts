/**
 * DTOs (Data Transfer Objects)
 * Handle transformation of database models to API response format
 * Eliminates duplication of mapping logic across routes
 */

// Mentorship Request DTO
export interface MentorshipRequestDTO {
  id: string
  status: string  studentName: string
  studentEmail: string
  studentMajor: string
  goal: string
  message: string
  createdAt: string
  updatedAt: string
}

export function toMentorshipRequestDTO(request: any): MentorshipRequestDTO {
  return {
    id: request.id,
    status: request.status,
    studentName: `${request.student.user.firstName} ${request.student.user.lastName}`,
    studentEmail: request.student.user.email,
    studentMajor: request.student.major,
    goal: request.goal,
    message: request.message,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  }
}

// Session DTO
export interface SessionDTO {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  mentorName: string
  studentName: string
  status: string
  createdAt: string
  updatedAt: string
}

export function toSessionDTO(session: any): SessionDTO {
  return {
    id: session.id,
    title: session.title,
    description: session.description,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    mentorName: `${session.mentor.user.firstName} ${session.mentor.user.lastName}`,
    studentName: `${session.student.user.firstName} ${session.student.user.lastName}`,
    status: session.status,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  }
}

// User Profile DTO
export interface UserProfileDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export function toUserProfileDTO(user: any): UserProfileDTO {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }
}

// Alumni Profile DTO
export interface AlumniProfileDTO {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  bio: string | null
  yearsOfExperience: number
  skills: string[]
  company: string | null
  createdAt: string
  updatedAt: string
}

export function toAlumniProfileDTO(alumni: any): AlumniProfileDTO {
  return {
    id: alumni.id,
    userId: alumni.userId,
    firstName: alumni.user.firstName,
    lastName: alumni.user.lastName,
    email: alumni.user.email,
    bio: alumni.bio,
    yearsOfExperience: alumni.yearsOfExperience,
    skills: alumni.skills || [],
    company: alumni.company,
    createdAt: alumni.createdAt.toISOString(),
    updatedAt: alumni.updatedAt.toISOString(),
  }
}

// Student Profile DTO
export interface StudentProfileDTO {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  major: string
  grad Year: number | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export function toStudentProfileDTO(student: any): StudentProfileDTO {
  return {
    id: student.id,
    userId: student.userId,
    firstName: student.user.firstName,
    lastName: student.user.lastName,
    email: student.user.email,
    major: student.major,
    gradYear: student.gradYear,
    bio: student.bio,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  }
}

// Availability DTO
export interface AvailabilityDTO {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  alumniName: string
  createdAt: string
  updatedAt: string
}

export function toAvailabilityDTO(availability: any): AvailabilityDTO {
  return {
    id: availability.id,
    dayOfWeek: availability.dayOfWeek,
    startTime: availability.startTime,
    endTime: availability.endTime,
    alumniName: `${availability.alumni.user.firstName} ${availability.alumni.user.lastName}`,
    createdAt: availability.createdAt.toISOString(),
    updatedAt: availability.updatedAt.toISOString(),
  }
}

// Message DTO
export interface MessageDTO {
  id: string
  conversationId: string
  senderName: string
  content: string
  createdAt: string
}

export function toMessageDTO(message: any): MessageDTO {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderName: `${message.sender.firstName} ${message.sender.lastName}`,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  }
}

// Feedback DTO
export interface FeedbackDTO {
  id: string
  sessionId: string
  rating: number
  comment: string
  givenBy: string
  createdAt: string
}

export function toFeedbackDTO(feedback: any): FeedbackDTO {
  return {
    id: feedback.id,
    sessionId: feedback.sessionId,
    rating: feedback.rating,
    comment: feedback.comment,
    givenBy: `${feedback.givenBy.firstName} ${feedback.givenBy.lastName}`,
    createdAt: feedback.createdAt.toISOString(),
  }
}
