-- CreateTable
CREATE TABLE "_MenteeProfileToMentorProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenteeProfileToMentorProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MenteeProfileToMentorProfile_B_index" ON "_MenteeProfileToMentorProfile"("B");

-- AddForeignKey
ALTER TABLE "_MenteeProfileToMentorProfile" ADD CONSTRAINT "_MenteeProfileToMentorProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "MenteeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenteeProfileToMentorProfile" ADD CONSTRAINT "_MenteeProfileToMentorProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
