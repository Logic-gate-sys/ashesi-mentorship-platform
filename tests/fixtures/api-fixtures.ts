/**
 * API Test Fixtures
 * Reusable test data and payloads for API tests
 */

export const createStudentPayload = {
  email: 'newstudent@example.com',
  password: 'SecurePass123!',
  name: 'New Student',
  year: 2,
  major: 'Computer Science',
};

export const createAlumniPayload = {
  email: 'newalumni@example.com',
  password: 'SecurePass123!',
  name: 'New Alumni',
  graduationYear: 2020,
  company: 'Tech Corp',
  position: 'Software Engineer',
};

export const createMentorshipRequestPayload = {
  topic: 'Career guidance',
  message: 'I need help with my career path',
};

export const scheduleSessionPayload = {
  alumniId: 'alumni-1',
  startTime: new Date('2024-02-01T10:00:00').toISOString(),
  endTime: new Date('2024-02-01T11:00:00').toISOString(),
  topic: 'Career planning',
};

export const sendMessagePayload = {
  conversationId: 'conv-1',
  content: 'Hello, how are you doing?',
};

export const loginPayload = {
  email: 'student@example.com',
  password: 'SecurePass123!',
};

export const invalidLoginPayload = {
  email: 'student@example.com',
  password: 'WrongPassword',
};

export const invalidEmailPayload = {
  email: 'not-an-email',
  password: 'SecurePass123!',
  name: 'Test User',
};
