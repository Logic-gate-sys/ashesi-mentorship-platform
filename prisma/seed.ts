import 'dotenv/config';
import crypto from 'crypto';
import { prisma } from '../app/_utils_and_types/db';

// Use the same password hashing as the app
const ITERATIONS = 10000;
const DIGEST = 'sha256';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, 64, DIGEST)
    .toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.sessionFeedback.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.mentorshipRequest.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.alumniProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Hash password for all demo users
  const hashedPassword = hashPassword('Password123!');

  // ==================== STUDENTS ====================
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'kwame.mensah@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Kwame',
        lastName: 'Mensah',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 3,
            major: 'Computer Science',
            bio: 'Passionate about fintech and blockchain technologies',
            linkedin: 'linkedin.com/in/kwame-mensah',
            interests: ['Fintech', 'Blockchain', 'Backend Development'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'ama.delali@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Ama',
        lastName: 'Delali',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 2,
            major: 'Business Administration',
            bio: 'Interested in management consulting and product management',
            linkedin: 'linkedin.com/in/ama-delali',
            interests: ['Consulting', 'Product Management', 'Leadership'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'tetteh.agbor@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Tetteh',
        lastName: 'Agbor',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 4,
            major: 'Information Systems',
            bio: 'Data science enthusiast with focus on healthcare analytics',
            linkedin: 'linkedin.com/in/tetteh-agbor',
            interests: ['Data Science', 'Healthcare IT', 'Python'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'ibrahim.alhassan@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Ibrahim',
        lastName: 'Alhassan',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 1,
            major: 'Computer Science',
            bio: 'Aspiring software engineer interested in mobile development',
            linkedin: 'linkedin.com/in/ibrahim-alhassan',
            interests: ['Mobile Development', 'React Native', 'UX Design'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'nana.acheampong@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Nana',
        lastName: 'Acheampong',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 3,
            major: 'Business Administration',
            bio: 'Interested in international business and entrepreneurship',
            linkedin: 'linkedin.com/in/nana-acheampong',
            interests: ['Entrepreneurship', 'International Trade', 'Startups'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'afia.korkor@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Afia',
        lastName: 'Korkor',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 2,
            major: 'Computer Science',
            bio: 'Focused on cloud computing and DevOps engineering',
            linkedin: 'linkedin.com/in/afia-korkor',
            interests: ['Cloud Computing', 'DevOps', 'AWS'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'abena.amoah@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Abena',
        lastName: 'Amoah',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 4,
            major: 'Information Systems',
            bio: 'Cybersecurity enthusiast and ethical hacker',
            linkedin: 'linkedin.com/in/abena-amoah',
            interests: ['Cybersecurity', 'Network Administration', 'Linux'],
          },
        },
      },
      include: { studentProfile: true },
    }),
    prisma.user.create({
      data: {
        email: 'kojo.ojekuu@ashesi.edu.gh',
        passwordHash: hashedPassword,
        firstName: 'Kojo',
        lastName: 'Ojekuu',
        role: 'STUDENT',
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            yearGroup: 1,
            major: 'Business Administration',
            bio: 'Aspiring entrepreneur with passion for social innovation',
            linkedin: 'linkedin.com/in/kojo-ojekuu',
            interests: ['Entrepreneurship', 'Social Impact', 'Finance'],
          },
        },
      },
      include: { studentProfile: true },
    }),
  ]);

  console.log(`Created ${students.length} students`);

  // ==================== ALUMNI/MENTORS ====================
  const alumni = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ama.mensah@gmail.com',
        passwordHash: hashedPassword,
        firstName: 'Ama',
        lastName: 'Mensah',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2020,
            major: 'Computer Science',
            company: 'Google',
            jobTitle: 'Senior Software Engineer',
            industry: 'TECHNOLOGY',
            bio: 'Full-stack engineer with 4+ years experience in fintech and payments',
            linkedin: 'linkedin.com/in/ama-mensah',
            skills: ['React', 'Node.js', 'Python', 'System Design', 'AWS'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'MONDAY', startTime: '18:00', endTime: '20:00' },
                { dayOfWeek: 'WEDNESDAY', startTime: '17:00', endTime: '19:00' },
                { dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '13:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
    prisma.user.create({
      data: {
        email: 'michael.asante@outlook.com',
        passwordHash: hashedPassword,
        firstName: 'Michael',
        lastName: 'Asante',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2019,
            major: 'Business Administration',
            company: 'McKinsey & Company',
            jobTitle: 'Associate Principal - Strategy',
            industry: 'CONSULTING',
            bio: 'Strategy consultant helping companies transform their operations',
            linkedin: 'linkedin.com/in/michael-asante',
            skills: ['Strategic Planning', 'Business Analysis', 'Leadership', 'PowerPoint'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'TUESDAY', startTime: '19:00', endTime: '20:00' },
                { dayOfWeek: 'THURSDAY', startTime: '18:00', endTime: '19:30' },
                { dayOfWeek: 'SUNDAY', startTime: '15:00', endTime: '17:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
    prisma.user.create({
      data: {
        email: 'dr.delali.owusu@gmail.com',
        passwordHash: hashedPassword,
        firstName: 'Dr. Delali',
        lastName: 'Owusu',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2018,
            major: 'Information Systems',
            company: 'IBM Research Africa',
            jobTitle: 'Data Scientist & ML Engineer',
            industry: 'TECHNOLOGY',
            bio: 'AI/ML researcher focused on African-centered solutions',
            linkedin: 'linkedin.com/in/delali-owusu-phd',
            skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science', 'Research'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'MONDAY', startTime: '19:00', endTime: '20:30' },
                { dayOfWeek: 'FRIDAY', startTime: '16:00', endTime: '18:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
    prisma.user.create({
      data: {
        email: 'ibrahim.boateng@barclays.com',
        passwordHash: hashedPassword,
        firstName: 'Ibrahim',
        lastName: 'Boateng',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2021,
            major: 'Business Administration',
            company: 'Barclays Bank',
            jobTitle: 'Investment Banking Associate',
            industry: 'FINANCE',
            bio: 'Investment banker specializing in M&A for African companies',
            linkedin: 'linkedin.com/in/ibrahim-boateng',
            skills: ['Financial Modeling', 'Valuation', 'Excel', 'Pitch Decks', 'Networking'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'WEDNESDAY', startTime: '18:00', endTime: '19:00' },
                { dayOfWeek: 'SATURDAY', startTime: '14:00', endTime: '16:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
    prisma.user.create({
      data: {
        email: 'esther.tetteh@techwomen.co',
        passwordHash: hashedPassword,
        firstName: 'Esther',
        lastName: 'Tetteh',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2020,
            major: 'Computer Science',
            company: 'Techstars',
            jobTitle: 'Product Manager - EdTech',
            industry: 'TECHNOLOGY',
            bio: 'PM building products for African education transformation',
            linkedin: 'linkedin.com/in/esther-tetteh',
            skills: ['Product Management', 'User Research', 'Analytics', 'Agile', 'Figma'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'TUESDAY', startTime: '17:00', endTime: '18:30' },
                { dayOfWeek: 'THURSDAY', startTime: '19:00', endTime: '20:00' },
                { dayOfWeek: 'SUNDAY', startTime: '16:00', endTime: '18:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
    prisma.user.create({
      data: {
        email: 'david.korkor@deloitte.com',
        passwordHash: hashedPassword,
        firstName: 'David',
        lastName: 'Korkor',
        role: 'ALUMNI',
        isVerified: true,
        isActive: true,
        alumniProfile: {
          create: {
            graduationYear: 2019,
            major: 'Information Systems',
            company: 'Deloitte',
            jobTitle: 'Management Consulting Senior Analyst',
            industry: 'CONSULTING',
            bio: 'Digital transformation consultant helping enterprises modernize',
            linkedin: 'linkedin.com/in/david-korkor',
            skills: ['Consulting', 'Digital Transformation', 'ERP Systems', 'Change Management'],
            isAvailable: true,
            availability: {
              create: [
                { dayOfWeek: 'MONDAY', startTime: '18:00', endTime: '19:30' },
                { dayOfWeek: 'SATURDAY', startTime: '11:00', endTime: '13:00' },
              ],
            },
          },
        },
      },
      include: { alumniProfile: { include: { availability: true } } },
    }),
  ]);

  console.log(`Created ${alumni.length} alumni mentors`);

  // ==================== MENTORSHIP REQUESTS ====================
  const requests = await Promise.all([
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[0].studentProfile!.id,
        alumniId: alumni[0].alumniProfile!.id,
        status: 'ACCEPTED',
        goal: 'I want to break into fintech and learn about building scalable payment systems. I have a strong CS foundation but need guidance on industry best practices and navigating the job market.',
        message: 'Hi Ama, I admire your work at Google on fintech solutions. Would love to learn from your experience.',
        resolvedAt: new Date('2024-03-01'),
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[1].studentProfile!.id,
        alumniId: alumni[1].alumniProfile!.id,
        status: 'ACCEPTED',
        goal: 'Preparing for PM interviews at big tech companies. Need help understanding product thinking and case study frameworks.',
        message: 'Michael, I am very interested in consulting and product roles. Can you guide me through the interview process?',
        resolvedAt: new Date('2024-03-05'),
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[2].studentProfile!.id,
        alumniId: alumni[2].alumniProfile!.id,
        status: 'ACCEPTED',
        goal: 'Building a portfolio in machine learning and data science. Want to understand how to transition from academics to industry AI applications.',
        message: 'Dr. Delali, I have been following your research papers. Would like your guidance on pursuing ML in healthcare.',
        resolvedAt: new Date('2024-03-08'),
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[3].studentProfile!.id,
        alumniId: alumni[0].alumniProfile!.id,
        status: 'ACCEPTED',
        goal: 'Learning full-stack development and understanding what it takes to land an internship in a top tech company.',
        message: 'Ama, I am excited about your journey at Google. I want to build strong fundamentals in web development.',
        resolvedAt: new Date('2024-03-10'),
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[4].studentProfile!.id,
        alumniId: alumni[3].alumniProfile!.id,
        status: 'ACCEPTED',
        goal: 'Understanding international business and how to launch startups in emerging markets like West Africa.',
        message: 'Ibrahim, I want to understand finance and entrepreneurship. Your investment banking background is inspiring.',
        resolvedAt: new Date('2024-03-12'),
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[5].studentProfile!.id,
        alumniId: alumni[4].alumniProfile!.id,
        status: 'PENDING',
        goal: 'Learning cloud computing and DevOps best practices to become a platform engineer in a tech company.',
        message: 'Esther, I am interested in your PM perspective on building developer tools and platforms.',
      },
    }),
    prisma.mentorshipRequest.create({
      data: {
        studentId: students[6].studentProfile!.id,
        alumniId: alumni[2].alumniProfile!.id,
        status: 'PENDING',
        goal: 'Cybersecurity fundamentals and career path in security engineering and ethical hacking.',
        message: 'Dr. Delali, I want to specialize in cybersecurity. Can you advise on certifications and skill building?',
      },
    }),
  ]);

  console.log(`Created ${requests.length} mentorship requests`);

  // ==================== SESSIONS ====================
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        requestId: requests[0].id,
        studentId: students[0].studentProfile!.id,
        alumniId: alumni[0].alumniProfile!.id,
        status: 'COMPLETED',
        topic: 'Career paths in fintech and system design',
        notes: 'Discussed blockchain fundamentals, scalability challenges, Ama shared her journey at Google',
        scheduledAt: new Date('2024-03-15T18:00:00'),
        duration: 60,
        meetingUrl: 'https://meet.google.com/xyz',
        feedback: {
          create: {
            rating: 5,
            comment: 'Excellent session! Ama provided deeper insights into payment systems architecture and how Google scales their fintech platforms.',
          },
        },
      },
    }),
    prisma.session.create({
      data: {
        requestId: requests[1].id,
        studentId: students[1].studentProfile!.id,
        alumniId: alumni[1].alumniProfile!.id,
        status: 'COMPLETED',
        topic: 'PM interview preparation and case frameworks',
        notes: 'Practiced with a real consulting case study. Michael reviewed problem solving approach and communication.',
        scheduledAt: new Date('2024-03-18T19:00:00'),
        duration: 90,
        meetingUrl: 'https://meet.google.com/abc',
        feedback: {
          create: {
            rating: 5,
            comment: 'Michael was incredibly thorough and gave me confidence for upcoming interviews. His case study walkthroughs were invaluable.',
          },
        },
      },
    }),
    prisma.session.create({
      data: {
        requestId: requests[2].id,
        studentId: students[2].studentProfile!.id,
        alumniId: alumni[2].alumniProfile!.id,
        status: 'COMPLETED',
        topic: 'ML portfolio projects and industry applications',
        notes: 'Reviewed portfolio ideas, discussed ethical AI, recommend starting with Kaggle competitions',
        scheduledAt: new Date('2024-03-20T19:00:00'),
        duration: 75,
        meetingUrl: 'https://meet.google.com/def',
        feedback: {
          create: {
            rating: 5,
            comment: 'Dr. Delali provided exceptional guidance on establishing myself in ML. Her research perspective is invaluable for building credibility.',
          },
        },
      },
    }),
    prisma.session.create({
      data: {
        requestId: requests[3].id,
        studentId: students[3].studentProfile!.id,
        alumniId: alumni[0].alumniProfile!.id,
        status: 'SCHEDULED',
        topic: 'Building mobile apps with React Native',
        notes: 'Session scheduled for hands-on guidance on mobile development',
        scheduledAt: new Date('2024-04-05T18:00:00'),
        duration: 60,
        meetingUrl: 'https://meet.google.com/ghi',
      },
    }),
    prisma.session.create({
      data: {
        requestId: requests[4].id,
        studentId: students[4].studentProfile!.id,
        alumniId: alumni[3].alumniProfile!.id,
        status: 'SCHEDULED',
        topic: 'International business and startup financing',
        notes: 'Will discuss venture funding and market entry strategies for African startups',
        scheduledAt: new Date('2024-04-08T18:00:00'),
        duration: 60,
        meetingUrl: 'https://meet.google.com/jkl',
      },
    }),
  ]);

  console.log(`Created ${sessions.length} sessions`);

  // ==================== ADMIN USER ====================
  await prisma.user.create({
    data: {
      email: 'admin@ashesi.edu.gh',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('Created admin user');
  console.log('✅ Seed completed successfully!');
  console.log(`
  📊 Summary:
  - ${students.length} Students created
  - ${alumni.length} Alumni/Mentors created
  - ${requests.length} Mentorship Requests created
  - ${sessions.length} Sessions created
  - 1 Admin user created
  
  🔐 All demo users password: Password123!
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
