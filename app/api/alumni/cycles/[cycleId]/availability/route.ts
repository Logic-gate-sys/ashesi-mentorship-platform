import { NextRequest, NextResponse } from 'next/server';

interface AlumniCycleAvailability {
  cycleId: string;
  alumniId: string;
  isAvailable: boolean;
  availableSince: string;
  maxMentees: number;
}

/**
 * GET /api/alumni/cycles/:cycleId/availability
 * 
 * Get an alumni's availability status for a specific cycle
 */
interface RouteParams {
  params: Promise<{ cycleId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { cycleId } = await context.params;
    // TODO: In production, extract alumniId from JWT token
    const alumniId = 'alumni_123';

    // TODO: Query database
    const availability: AlumniCycleAvailability = {
      cycleId,
      alumniId,
      isAvailable: false, // Mock data
      availableSince: new Date().toISOString(),
      maxMentees: 2, // Default recommended capacity
    };

    return NextResponse.json(
      {
        success: true,
        data: availability,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching alumni availability:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch availability status',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/alumni/cycles/:cycleId/availability
 * 
 * Toggle alumni availability for a mentorship cycle
 * Alumni can set themselves as available/unavailable for the cycle
 */
interface UpdateAvailabilityBody {
  isAvailable: boolean;
  maxMentees?: number; // 1, 2, or 3 (respects capacity constraint)
}

interface RouteParams {
  params: Promise<{ cycleId: string }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { cycleId } = await context.params;
    const body = (await request.json()) as UpdateAvailabilityBody;
    const { isAvailable, maxMentees = 2 } = body;

    // TODO: In production, extract alumniId from JWT token
    const alumniId = 'alumni_123';

    // Validate max mentees
    if (maxMentees < 1 || maxMentees > 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Max mentees must be between 1-3',
        },
        { status: 400 }
      );
    }

    // TODO: Update database
    // Set availability for this cycle and make profile visible in student searches
    // If setting to unavailable, hide from searches

    const updated: AlumniCycleAvailability = {
      cycleId,
      alumniId,
      isAvailable,
      availableSince: isAvailable ? new Date().toISOString() : '',
      maxMentees: isAvailable ? maxMentees : 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: updated,
        message: isAvailable
          ? `You're now visible in student searches for up to ${maxMentees} mentee${maxMentees > 1 ? 's' : ''}`
          : 'Your profile is hidden from student searches for this cycle',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating alumni availability:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update availability',
      },
      { status: 500 }
    );
  }
}
