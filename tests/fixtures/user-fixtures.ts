/**
 * User Test Fixtures
 * Reusable test data for user-related tests
 */

export const mockStudent = {
  id: 'student-1',
  email: 'student@example.com',
  name: 'John Doe',
  role: 'STUDENT',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockAlumni = {
  id: 'alumni-1',
  email: 'alumni@example.com',
  name: 'Jane Smith',
  role: 'ALUMNI',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockStudentProfile = {
  id: 'profile-1',
  userId: 'student-1',
  year: 2,
  major: 'Computer Science',
  bio: 'Aspiring software engineer',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockAlumniProfile = {
  id: 'profile-2',
  userId: 'alumni-1',
  graduationYear: 2020,
  company: 'Tech Corp',
  position: 'Senior Engineer',
  bio: 'Helping students enter tech',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockMentorshipRequest = {
  id: 'request-1',
  studentId: 'student-1',
  alumniId: 'alumni-1',
  topic: 'Career guidance',
  message: 'I need help with my career path',
  status: 'PENDING',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockSession = {
  id: 'session-1',
  participantAId: 'student-1',
  participantBId: 'alumni-1',
  startTime: new Date('2024-01-01T10:00:00'),
  endTime: new Date('2024-01-01T11:00:00'),
  topic: 'Career planning',
  notes: 'Discussed career path',
  status: 'COMPLETED',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockConversation = {
  id: 'conv-1',
  participantAId: 'student-1',
  participantBId: 'alumni-1',
  lastMessage: 'See you next week!',
  lastMessageAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

export const mockMessage = {
  id: 'msg-1',
  conversationId: 'conv-1',
  senderId: 'student-1',
  content: 'Hello!',
  createdAt: new Date('2024-01-15'),
};
