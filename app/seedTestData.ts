// Load environment variables
import 'dotenv/config';

import { prisma } from '../app/_utils/db'; // adjust if needed
import {
  cleanupAllData,
  createStudentProfileDirect,
  createAlumniProfileDirect,
  createMentorshipRequestDirect,
  createSessionDirect,
  createNotificationDirect,
} from '../tests/helpers/database.helpers';

async function seed() {
  try {
    console.log('--- Starting Seed Process ---');

    console.log('Step 1: Cleaning up all existing data...');
    await cleanupAllData();

    console.log('Step 2: Creating User records (Base Identities)...');
    
    const studentUser = await prisma.user.create({
      data: {
        id: 'student-user-id',
        email: 'student@ashesi.edu.gh',
        name: 'Test Student',
        role: 'STUDENT',
        isActive: true,
      },
    });

    const alumniUser = await prisma.user.create({
      data: {
        id: 'alumni-user-id',
        email: 'alumni@ashesi.edu.gh',
        name: 'Test Alumni',
        role: 'ALUMNI',
        isActive: true,
      },
    });

    console.log('Step 3: Creating Student Profile...');
    const studentProfile = await createStudentProfileDirect(studentUser.id, {
      yearGroup: 2,
      major: 'Computer Science',
      interests: ['Web Dev', 'AI'],
    });

    console.log('Step 4: Creating Alumni Profile...');
    const alumniProfile = await createAlumniProfileDirect(alumniUser.id, {
      graduationYear: 2020,
      major: 'Computer Science',
      company: 'Tech Corp',
      jobTitle: 'Software Engineer',
      industry: 'TECHNOLOGY',
      bio: 'I love mentoring students!',
    });

    console.log('Step 5: Creating Mentorship Request...');
    const request = await createMentorshipRequestDirect(
      studentUser.id,
      alumniUser.id,
      {
        goal: 'Learn web development and system design best practices',
        status: 'ACCEPTED',
      }
    );

    console.log('Step 6: Creating Mentorship Session...');
    const session = await createSessionDirect(request.id, 'Intro to Web Development');

    console.log('Step 7: Creating Notification...');
    const notification = await createNotificationDirect(studentUser.id, 'MENTORSHIP_REQUEST');

    console.log('✅ Seed complete!');
    console.log({
      student: studentProfile,
      alumni: alumniProfile,
      request,
      session,
      notification,
    });

  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed();