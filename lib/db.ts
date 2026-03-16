import { PrismaClient } from '../prisma/generated/prisma/client'
import { env } from '../env'
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = env.DATABASE_URL; 
const adapter = new PrismaPg({ connectionString });
//client 
const prisma = new PrismaClient({adapter});

export  { prisma };