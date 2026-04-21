import { Industry, RequestStatus, SessionStatus, CycleStatus, MeetingType } from './generated/prisma/client';
import { Role } from './generated/prisma/enums';
import { prisma } from '@/app/_utils_and_types/utils/db';
import { hashPassword } from '@/app/_utils_and_types/utils/password';

async function main() {
  const passwordHash = hashPassword('password123');

  // These are your existing IDs for Scott
  const scottUserId = '25f8136c-fea9-4ce2-8d69-89a02228ee71';
  const scottProfileId = 'f78781d7-94ef-4ec1-9f30-c370cccf63e0';

  // 1. Create a Mentorship Cycle (Required for Requests)
  const currentCycle = await prisma.mentorshipCycle.upsert({
    where: { id: 'active-cycle-2026' },
    update: {},
    create: {
      id: 'active-cycle-2026',
      name: "Fall 2026 Cohort",
      status: CycleStatus.ACTIVE,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-31'),
    }
  });

  console.log('--- Seeding Activities for Scott Moss ---');

  // 2. Data for 10 New Mentees
  const mentees = [
    { first: 'Ama', last: 'Serwaa', major: 'CS' }, { first: 'Kojo', last: 'Annan', major: 'BA' },
    { first: 'Ekow', last: 'Mensah', major: 'CS' }, { first: 'Abena', last: 'Osei', major: 'MIS' },
    { first: 'Kwesi', last: 'Appiah', major: 'Eng' }, { first: 'Nana', last: 'Yeboah', major: 'CS' },
    { first: 'Araba', last: 'Turkson', major: 'BA' }, { first: 'Kofi', last: 'Danquah', major: 'CS' },
    { first: 'Baaba', last: 'Enchill', major: 'MIS' }, { first: 'Jojo', last: 'Lartey', major: 'CS' }
  ];

  for (let i = 0; i < mentees.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `${mentees[i].first.toLowerCase()}${i}@ashesi.edu.gh`,
        firstName: mentees[i].first,
        lastName: mentees[i].last,
        passwordHash,
        role: Role.MENTEE,
        menteeProfile: {
          create: {
            yearGroup: 2027,
            major: mentees[i].major,
            bio: "Excited to learn from a Netflix engineer!"
          }
        }
      },
      include: { menteeProfile: true }
    });

    const mProfileId = user.menteeProfile!.id;

    // --- LINKING TO SCOTT ---

    // A. 2 CURRENT MENTEES (Active status)
    if (i < 2) {
      const request = await prisma.mentorshipRequest.create({
        data: {
          status: RequestStatus.ACCEPTED,
          menteeId: mProfileId,
          mentorId: scottProfileId,
          cycleId: currentCycle.id,
          goal: "Building a scalable backend with Node.js"
        }
      });

      // Actual many-to-many connection in DB
      await prisma.mentorProfile.update({
        where: { id: scottProfileId },
        data: { mentees: { connect: { id: mProfileId } } }
      });

      // Create a Scheduled Session
      await prisma.session.create({
        data: {
          status: SessionStatus.SCHEDULED,
          requestId: request.id,
          menteeId: mProfileId,
          mentorId: scottProfileId,
          topic: "Middleware and Auth in Next.js",
          scheduledAt: new Date('2026-04-25T14:00:00Z'),
          duration: 60,
          meetingUrl: "https://meet.google.com/abc-defg-hij"
        }
      });
    }

    // B. 3 COMPLETED SESSIONS (For your Feedback counts)
    else if (i < 5) {
      const request = await prisma.mentorshipRequest.create({
        data: {
          status: RequestStatus.ACCEPTED,
          menteeId: mProfileId,
          mentorId: scottProfileId,
          cycleId: currentCycle.id,
          goal: "Career Prep"
        }
      });

      await prisma.session.create({
        data: {
          status: SessionStatus.COMPLETED,
          requestId: request.id,
          menteeId: mProfileId,
          mentorId: scottProfileId,
          topic: "Past Project Review",
          scheduledAt: new Date('2026-03-10T10:00:00Z'),
          duration: 45,
          feedback: {
            create: { rating: 5, comment: "Scott gave amazing system design advice!" }
          }
        }
      });
    }

    // C. 2 PENDING REQUESTS (To test your Notification/Request tabs)
    else if (i < 7) {
      await prisma.mentorshipRequest.create({
        data: {
          status: RequestStatus.PENDING,
          menteeId: mProfileId,
          mentorId: scottProfileId,
          cycleId: currentCycle.id,
          goal: "I want to learn about Account Abstraction",
          message: "Hi Scott, I'm a huge fan of your work on TypeScript."
        }
      });
    }

      // D. MESSAGES (Direct messages to Scott)
    if (i === 0) {
      await prisma.message.create({
        data: {
          senderId: user.id,
          receiverId: scottUserId,
          body: "Hey Scott, I'm having issues with my Prisma seed file, can you help?",
          type: 'TEXT',
          viewed: false
        }
      });
      await prisma.message.create({
        data: {
          senderId: scottUserId,
          receiverId: user.id,
          body: "Of course! Send me the file and I'll take a look.",
          type: 'TEXT',
          viewed: true
        }
      });
    }
    if (i === 1) {
      await prisma.message.create({
        data: {
          senderId: user.id,
          receiverId: scottUserId,
          body: "Thanks for the session last week! Really helpful for my project.",
          type: 'TEXT',
          viewed: false
        }
      });
    }
  }

  // 3. Create Availability Slots for Scott
  const availabilityData = [
    { dayOfWeek: 'MONDAY', startTime: '14:00', endTime: '17:00' },
    { dayOfWeek: 'WEDNESDAY', startTime: '10:00', endTime: '12:00' },
    { dayOfWeek: 'FRIDAY', startTime: '15:00', endTime: '18:00' }
  ];

  for (const slot of availabilityData) {
    await prisma.availability.upsert({
      where: {
        mentorId_dayOfWeek_startTime: {
          mentorId: scottProfileId,
          dayOfWeek: slot.dayOfWeek as any,
          startTime: slot.startTime
        }
      },
      update: {},
      create: {
        mentorId: scottProfileId,
        dayOfWeek: slot.dayOfWeek as any,
        startTime: slot.startTime,
        endTime: slot.endTime
      }
    });
  }

  // 4. Create Notifications
  const scottUser = await prisma.user.findUnique({ where: { id: scottUserId } });
  if (scottUser) {
    await prisma.notification.create({
      data: {
        userId: scottUserId,
        type: 'REQUEST_UPDATE',
        title: 'New Mentorship Request',
        body: 'Baaba Enchill sent you a mentorship request',
        path: '/mentors/requests',
        isRead: false
      }
    });
    await prisma.notification.create({
      data: {
        userId: scottUserId,
        type: 'NEW_MESSAGE',
        title: 'New Message from Ama',
        body: 'Ama Serwaa sent you a message',
        path: '/mentors/messages',
        isRead: false
      }
    });
    await prisma.notification.create({
      data: {
        userId: scottUserId,
        type: 'SESSION_REMINDER',
        title: 'Upcoming Session',
        body: 'You have a session with Kojo Annan in 2 hours',
        path: '/mentors/meetings',
        isRead: true
      }
    });
  }

  console.log('✅ Seeding finished: Scott now has:');
  console.log('   - 2 Active Mentees (with sessions)');
  console.log('   - 3 Completed Sessions (with feedback)');
  console.log('   - 2 Pending Requests');
  console.log('   - Messages from multiple mentees');
  console.log('   - 3 Availability Slots');
  console.log('   - 3 Notifications');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });