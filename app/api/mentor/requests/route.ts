import { NextRequest, NextResponse } from 'next/server';

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  program: string;
  initials: string;
  status: 'pending';
  lastInteraction: string;
}

/**
 * GET /api/mentor/requests
 * 
 * Fetches pending mentorship requests for the mentor
 * 
 * Query params:
 * - mentorId: string (optional, defaults to current user)
 * - status: 'pending' | 'accepted' | 'declined' (optional, defaults to 'pending')
 * - limit: number (optional, defaults to 10)
 * 
 * Response:
 * {
 *   success: boolean
 *   data: PendingRequest[]
 *   total: number
 *   error?: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: In production, extract mentorId from JWT token
    const searchParams = request.nextUrl.searchParams;
    const mentorId = searchParams.get('mentorId') || 'current-user';
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // TODO: Replace with actual database query
    // For now, return mock data
    const requests: PendingRequest[] = [
      {
        id: '1',
        name: 'Ama Asante',
        role: 'Computer Science Student',
        program: 'BSc Computer Science',
        initials: 'AA',
        status: 'pending',
        lastInteraction: '2 days ago',
      },
      {
        id: '2',
        name: 'Kwame Osei',
        role: 'Business Student',
        program: 'BSc Business Administration',
        initials: 'KO',
        status: 'pending',
        lastInteraction: '1 week ago',
      },
      {
        id: '3',
        name: 'Nada Mensah',
        role: 'Engineering Student',
        program: 'BSc Engineering',
        initials: 'NM',
        status: 'pending',
        lastInteraction: '3 days ago',
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: requests.slice(0, limit),
        total: requests.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentor requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentor requests',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mentor/requests
 * 
 * Accept a mentorship request
 * 
 * Constraints:
 * - Maximum 3 active mentees
 * - Recommended: 1-2 mentees for 3-6 months
 */
interface AcceptRequestBody {
  requestId: string;
}

const MENTOR_MAX_CAPACITY = 3;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AcceptRequestBody;
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error: 'requestId is required',
        },
        { status: 400 }
      );
    }

    // TODO: In production, extract mentorId from JWT token
    // TODO: Query database to get current active mentees count
    const currentActiveMentees = 2; // Mock data

    // Check if mentor has reached max capacity
    if (currentActiveMentees >= MENTOR_MAX_CAPACITY) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot accept request: You have reached your maximum mentoring capacity (${MENTOR_MAX_CAPACITY} students). Please complete or end a mentorship to accept new students.`,
          code: 'CAPACITY_EXCEEDED',
          data: {
            currentMentees: currentActiveMentees,
            maxCapacity: MENTOR_MAX_CAPACITY,
          },
        },
        { status: 403 }
      );
    }

    // TODO: Update database to move request from pending to active mentoree
    
    // Mock student and mentor data (in production, query from database)
    const student = {
      id: 'student_001',
      email: 'ama.asante@ashesi.edu.gh',
      name: 'Ama Asante',
    };

    const mentor = {
      userId: 'mentor_current',
      email: 'mentor@ashesi.edu.gh',
      name: 'Dr. Kwame Asante',
      title: 'Senior Software Engineer at Google',
      bio: 'Passionate about mentoring young tech talents with 10+ years of industry experience.',
      rating: 4.8,
    };

    // Send student paired email asynchronously
    (async () => {
      try {
        const { sendStudentPairedEmail } = await import('@/app/_services/email/emailHelpers');
        const result = await sendStudentPairedEmail(
          { userId: student.id, email: student.email, name: student.name },
          mentor,
          requestId
        );

        if (!result.success) {
          console.error('Failed to send student paired email:', result.error);
        }
      } catch (emailError) {
        console.error('Error sending student paired email:', emailError);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: requestId,
          status: 'accepted',
          message: `Mentorship accepted! Confirmation email sent to ${student.email}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error accepting mentor request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to accept mentor request',
      },
      { status: 500 }
    );
  }
}
