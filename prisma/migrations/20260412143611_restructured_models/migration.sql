/*
  Warnings:

  - The values [SYSTEM] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - The values [STUDENT,ALUMNI] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `alumniId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `alumniId` on the `MentorshipRequest` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `MentorshipRequest` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `alumniId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `AlumniProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConversationParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mentorId,dayOfWeek,startTime]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[menteeId,mentorId,cycleId]` on the table `MentorshipRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mentorId` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `MentorshipRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menteeId` to the `MentorshipRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentorId` to the `MentorshipRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `menteeId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentorId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_MESSAGE', 'REQUEST_UPDATE', 'SESSION_REMINDER', 'SYSTEM_ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('PLANNING', 'REGISTRATION_OPEN', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('VIRTUAL', 'IN_PERSON');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Industry" ADD VALUE 'ART_AND_DESIGN';
ALTER TYPE "Industry" ADD VALUE 'MANUFACTURING';

-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('TEXT', 'FILE', 'IMAGE');
ALTER TABLE "public"."Message" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Message" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "public"."MessageType_old";
ALTER TABLE "Message" ALTER COLUMN "type" SET DEFAULT 'TEXT';
COMMIT;

-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'EXPIRED';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('MENTOR', 'MENTEE', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SessionStatus" ADD VALUE 'RESCHEDULED';

-- DropForeignKey
ALTER TABLE "AlumniProfile" DROP CONSTRAINT "AlumniProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_alumniId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipRequest" DROP CONSTRAINT "MentorshipRequest_alumniId_fkey";

-- DropForeignKey
ALTER TABLE "MentorshipRequest" DROP CONSTRAINT "MentorshipRequest_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_alumniId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropIndex
DROP INDEX "Availability_alumniId_dayOfWeek_startTime_key";

-- DropIndex
DROP INDEX "Availability_alumniId_idx";

-- DropIndex
DROP INDEX "MentorshipRequest_alumniId_idx";

-- DropIndex
DROP INDEX "MentorshipRequest_status_idx";

-- DropIndex
DROP INDEX "MentorshipRequest_studentId_alumniId_status_key";

-- DropIndex
DROP INDEX "MentorshipRequest_studentId_idx";

-- DropIndex
DROP INDEX "Message_conversationId_createdAt_idx";

-- DropIndex
DROP INDEX "Notification_createdAt_idx";

-- DropIndex
DROP INDEX "Session_alumniId_idx";

-- DropIndex
DROP INDEX "Session_status_idx";

-- DropIndex
DROP INDEX "Session_studentId_idx";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "alumniId",
ADD COLUMN     "mentorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MentorshipRequest" DROP COLUMN "alumniId",
DROP COLUMN "studentId",
ADD COLUMN     "cycleId" TEXT NOT NULL,
ADD COLUMN     "menteeId" TEXT NOT NULL,
ADD COLUMN     "mentorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "conversationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "link",
ADD COLUMN     "path" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "alumniId",
DROP COLUMN "studentId",
ADD COLUMN     "menteeId" TEXT NOT NULL,
ADD COLUMN     "mentorId" TEXT NOT NULL,
ADD COLUMN     "type" "MeetingType" NOT NULL DEFAULT 'VIRTUAL';

-- DropTable
DROP TABLE "AlumniProfile";

-- DropTable
DROP TABLE "ConversationParticipant";

-- DropTable
DROP TABLE "StudentProfile";

-- CreateTable
CREATE TABLE "MenteeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "yearGroup" INTEGER NOT NULL,
    "major" TEXT NOT NULL,
    "bio" TEXT,
    "linkedin" TEXT,
    "interests" TEXT[],

    CONSTRAINT "MenteeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "major" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "industry" "Industry" NOT NULL,
    "bio" TEXT,
    "linkedin" TEXT,
    "skills" TEXT[],
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxMentees" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipCycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CycleStatus" NOT NULL DEFAULT 'PLANNING',
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationOpenDate" TIMESTAMP(3),
    "registrationCloseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorshipCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenteeProfile_userId_key" ON "MenteeProfile"("userId");

-- CreateIndex
CREATE INDEX "MenteeProfile_major_idx" ON "MenteeProfile"("major");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE INDEX "MentorProfile_industry_idx" ON "MentorProfile"("industry");

-- CreateIndex
CREATE INDEX "MentorProfile_isAvailable_idx" ON "MentorProfile"("isAvailable");

-- CreateIndex
CREATE INDEX "MentorshipCycle_status_id_idx" ON "MentorshipCycle"("status", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_mentorId_dayOfWeek_startTime_key" ON "Availability"("mentorId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE INDEX "MentorshipRequest_menteeId_idx" ON "MentorshipRequest"("menteeId");

-- CreateIndex
CREATE INDEX "MentorshipRequest_mentorId_idx" ON "MentorshipRequest"("mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipRequest_menteeId_mentorId_cycleId_key" ON "MentorshipRequest"("menteeId", "mentorId", "cycleId");

-- CreateIndex
CREATE INDEX "Session_menteeId_idx" ON "Session"("menteeId");

-- CreateIndex
CREATE INDEX "Session_mentorId_idx" ON "Session"("mentorId");

-- AddForeignKey
ALTER TABLE "MenteeProfile" ADD CONSTRAINT "MenteeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "MenteeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipRequest" ADD CONSTRAINT "MentorshipRequest_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "MentorshipCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "MenteeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
