import { PrismaClient } from '@/prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {env} from '@/env'; 

const connectionString = env.DATABASE_URL; 
const adapter = new PrismaPg({ connectionString });
//client 
const prisma = new PrismaClient({adapter});

export  { prisma };