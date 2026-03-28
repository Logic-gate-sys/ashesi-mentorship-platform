import { NextRequest, NextResponse } from 'next/server';

interface CreateCycleBody {
  name: string;
  description: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}

interface MentorshipCycle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'closed' | 'ended';
  createdAt: string;
  durationMonths: number;
}

/**
 * POST /api/admin/cycles
 * 
 * Admin creates a new mentorship cycle (3-6 months)
 * 
 * Body:
 * {
 *   name: string
 *   description: string
 *   startDate: ISO 8601 date
 *   endDate: ISO 8601 date
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   data: MentorshipCycle
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCycleBody;
    const { name, description, startDate, endDate } = body;

    // Validate required fields
    if (!name || !description || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields (name, description, startDate, endDate) are required',
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date range
    if (start >= end) {
      return NextResponse.json(
        {
          success: false,
          error: 'Start date must be before end date',
        },
        { status: 400 }
      );
    }

    // Calculate duration in months
    const durationMonths = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    // Validate duration is between 3-6 months
    if (durationMonths < 3 || durationMonths > 6) {
      return NextResponse.json(
        {
          success: false,
          error: `Cycle duration must be between 3-6 months. Your cycle is ${durationMonths} months.`,
        },
        { status: 400 }
      );
    }

    // TODO: In production, save to database
    // For now, return mock data
    const cycle: MentorshipCycle = {
      id: `cycle_${Date.now()}`,
      name,
      description,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: 'planning',
      createdAt: new Date().toISOString(),
      durationMonths,
    };

    // Send notifications to all alumni
    // In production, query database for all alumni emails
    const allAlumni = [
      { id: 'mentor_001', email: 'mentor1@ashesi.edu.gh', name: 'Dr. Kwame Asante' },
      { id: 'mentor_002', email: 'mentor2@ashesi.edu.gh', name: 'Ama Boakye' },
      { id: 'mentor_003', email: 'mentor3@ashesi.edu.gh', name: 'Kofi Mensah' },
    ];

    // Send emails asynchronously (don't wait for completion)
    (async () => {
      try {
        const { sendBulkCycleInvitations } = await import('@/app/_services/email/emailHelpers');
        const emailResults = await sendBulkCycleInvitations(allAlumni, {
          id: cycle.id,
          name: cycle.name,
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          durationMonths: cycle.durationMonths,
        });

        console.log(`Cycle invitation emails sent: ${emailResults.successful} successful, ${emailResults.failed} failed`);
        if (emailResults.errors.length > 0) {
          console.error('Email errors:', emailResults.errors);
        }
      } catch (emailError) {
        console.error('Failed to send cycle invitation emails:', emailError);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        data: cycle,
        message: `Cycle created. Invitation emails queued to ${allAlumni.length} alumni.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating mentorship cycle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create mentorship cycle',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/cycles
 * 
 * List all mentorship cycles
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Query database for all cycles
    // For now, return mock data
    const cycles: MentorshipCycle[] = [
      {
        id: 'cycle_001',
        name: 'Spring 2026 Cohort',
        description: 'First mentorship cycle of 2026',
        startDate: new Date('2026-03-01').toISOString(),
        endDate: new Date('2026-08-31').toISOString(),
        status: 'planning',
        createdAt: new Date('2026-02-15').toISOString(),
        durationMonths: 6,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: cycles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentorship cycles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentorship cycles',
      },
      { status: 500 }
    );
  }
}
