import {prisma} from '#utils-types/utils/db'; 
import { hashPassword } from '#utils-types/utils/password';



export async function clearDatabase() {
  try {
    // Order tables from least to most dependent
    await prisma.message.deleteMany();
    await prisma.sessionFeedback.deleteMany();
    await prisma.session.deleteMany();
    await prisma.mentorshipRequest.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.menteeProfile.deleteMany();
    await prisma.mentorProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}


export async function createTestStudent(override = {}) {
  const rawPass = 'odkROEOWKFOKWORI'
  const hashedPassword = override!==null? hashPassword(override?.password): hashPassword(rawPass)
  const user =  prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      passwordHash:hashedPassword , // dummy hash for tests
      role: 'STUDENT',
      ...override,
      studentProfile:{
      create: {
        yearGroup: 1,
        major: 'Computer Science',
          }
      }
    },
    select: {
      id: true,
      email:true,
      firstName: true,
      lastName: true,
      role:true,
    }
  });

  return {user, rawPassword: rawPass}
}


export async function createTestAlumni(override = {}) {
  const rawPass = 'odkROEOWKFOKWORI'
  const hashedPassword = override!==null? hashPassword(override?.password): hashPassword(rawPass)
  const user = prisma.user.create({
    data: {
      email: `test-${Date.now()}@ashesi.edu.gh`,
      firstName: 'Alumi',
      lastName: 'alumi',
      passwordHash: hashedPassword, // dummy hash for tests
      role: 'ALUMNI',
      ...override,
      alumniProfile: {
        create: {
          graduationYear: 2017,
          major:'Computer Science',
          company:'google',
          jobTitle:"Senior Software Engineer",
          industry:'TECHNOLOGY',
          bio:"Iam a cool guy",
          linkedin:"https;//mulinnkd",
          skills:['sikkd','dkdls','kdlso']
        }
      }
    },
    select: {
      id: true,
      email:true,
      firstName: true,
      lastName: true,
      role:true,
    }
  });

  return {user, rawPassword: rawPass}
}

export async function  createTestAdmin( override = {}){
  const rawPass = 'odkROEOWKFOKWORI'
  const hashedPassword = override!==null? hashPassword(override?.password): hashPassword(rawPass)
const user =  prisma.user.create({
    data: {
      email: `test-${Date.now()}@ashesi.edu.gh`,
      firstName: 'Test',
      lastName: 'User',
      passwordHash: hashedPassword, // dummy hash for tests
      role: 'ADMIN',
      ...override,
    },
    select: {
      id: true,
      email:true,
      firstName: true,
      lastName: true,
      role:true,
    }
  });

  return {user, rawPassword: rawPass}
}


