import { NextRequest, NextResponse } from 'next/server';

interface MentorshipCycleStatus {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'closed' | 'ended';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  progressPercent: number;
  totalMentors: number;
  activeMentorships: number;
  message: string;
}

/**
 * GET /api/cycles/current
 * 
 * Get the current active mentorship cycle
 * Used by both mentors and students to see cycle timeline
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Query database for current active cycle
    const now = new Date();
    const startDate = new Date('2026-03-01');
    const endDate = new Date('2026-08-31');

    const isActive = now >= startDate && now <= endDate;
    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const progressPercent = Math.round(
      ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100
    );

    const cycle: MentorshipCycleStatus = {
      id: 'cycle_001',
      name: 'Spring 2026 Cohort',
      status: isActive ? 'active' : 'planning',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      totalMentors: 45, // Mock data
      activeMentorships: 38, // Mock data
      message: isActive
        ? `Active cycle: ${daysRemaining} days remaining`
        : `Upcoming cycle starts on ${startDate.toLocaleDateString()}`,
    };

    return NextResponse.json(
      {
        success: true,
        data: cycle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching cycle status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cycle status',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cycles/end
 * 
 * Admin endpoint to manually end a cycle
 * Automatically:
 * 1. Dissolves all mentorship groups (pauses, not deletes)
 * 2. Archives mentorship history
 * 3. Marks cycle as 'ended'
 * 4. Notifies students and alumni
 * 
 * TODO: This should also be called automatically by a scheduled job
 * when endDate is reached
 */
interface EndCycleBody {
  cycleId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EndCycleBody;
    const { cycleId } = body;

    if (!cycleId) {
      return NextResponse.json(
        {
          success: false,
          error: 'cycleId is required',
        },
        { status: 400 }
      );
    }

    // Mock data for the cycle being ended
    const cycle = { name: 'Spring 2026 Cohort' };
    
    // Mock mentors who participated (in production, query from database)
    const mentorsWithStats = [
      {
        id: 'mentor_001',
        email: 'mentor1@ashesi.edu.gh',
        name: 'Dr. Kwame Asante',
        menteesCount: 3,
        sessionsCount: 12,
        averageRating: 4.8,
      },
      {
        id: 'mentor_002',
        email: 'mentor2@ashesi.edu.gh',
        name: 'Ama Boakye',
        menteesCount: 2,
        sessionsCount: 8,
        averageRating: 4.7,
      },
      {
        id: 'mentor_003',
        email: 'mentor3@ashesi.edu.gh',
        name: 'Kofi Mensah',
        menteesCount: 3,
        sessionsCount: 11,
        averageRating: 4.9,
      },
    ];

    // Send cycle ended emails asynchronously
    (async () => {
      try {
        const { sendBulkCycleEndedEmails } = await import('@/app/_services/email/emailHelpers');
        
        const stats: Record<string, any> = {};
        mentorsWithStats.forEach((mentor) => {
          stats[mentor.id] = {
            menteesCount: mentor.menteesCount,
            sessionsCount: mentor.sessionsCount,
            averageRating: mentor.averageRating,
          };
        });

        const mentorData = mentorsWithStats.map((m) => ({
          id: m.id,
          email: m.email,
          name: m.name,
        }));

        const emailResults = await sendBulkCycleEndedEmails(mentorData, cycle, stats);

        console.log(`Cycle ended emails sent: ${emailResults.successful} successful, ${emailResults.failed} failed`);
        if (emailResults.errors.length > 0) {
          console.error('Email errors:', emailResults.errors);
        }
      } catch (emailError) {
        console.error('Failed to send cycle ended emails:', emailError);
      }
    })();

    // TODO: In production, also implement:
    // 1. Query all mentorships for this cycle from database
    // 2. Set mentorships status to 'paused' (not deleted)
    // 3. Archive mentorship data for analytics
    // 4. Update cycle status to 'ended'
    // 5. Send notifications to students: "Your mentorship has ended. Rate your mentor."
    // 6. Reset all alumni availability flags for next cycle

    return NextResponse.json(
      {
        success: true,
        data: {
          cycleId,
          status: 'ended',
          message: 'Mentorship cycle ended. Notification emails queued to mentors. All mentorships have been paused. Alumni and students can now sign up for the next cycle.',
          archivedMentorships: 38, // Mock data
          completedSessions: 145, // Mock data
          averageRating: 4.8, // Mock data
          emailsSent: mentorsWithStats.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error ending mentorship cycle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to end mentorship cycle',
      },
      { status: 500 }
    );
  }
}
