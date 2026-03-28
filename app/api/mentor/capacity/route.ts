import { NextRequest, NextResponse } from 'next/server';

interface ActiveMentee {
  id: string;
  name: string;
  status: 'active';
}

const MENTOR_CAPACITY = {
  MAX: 3,
  RECOMMENDED_MAX: 2,
  RECOMMENDED_MIN: 1,
};

/**
 * GET /api/mentor/capacity
 * 
 * Get mentor's current mentoring capacity status
 * 
 * Response:
 * {
 *   success: boolean
 *   data: {
 *     activeMentees: number
 *     maxCapacity: number
 *     recommendedCapacity: { min: number, max: number }
 *     canAcceptMore: boolean
 *     capacityStatus: 'ideal' | 'good' | 'full' | 'over_capacity'
 *     message: string
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: In production, extract mentorId from JWT token and query database
    const activeMentees = 2; // Mock data - should query actual active mentees

    const canAcceptMore = activeMentees < MENTOR_CAPACITY.MAX;
    
    let capacityStatus: 'ideal' | 'good' | 'full' | 'over_capacity';
    if (activeMentees >= MENTOR_CAPACITY.MAX) {
      capacityStatus = 'full';
    } else if (activeMentees > MENTOR_CAPACITY.RECOMMENDED_MAX) {
      capacityStatus = 'good';
    } else {
      capacityStatus = 'ideal';
    }

    const messages = {
      ideal: 'You have room to take on more mentees. Recommended capacity.',
      good: 'You are at a manageable level. Can accept 1 more mentee.',
      full: 'You have reached maximum capacity (3 students).',
      over_capacity: 'You are mentoring more than recommended.',
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          activeMentees,
          maxCapacity: MENTOR_CAPACITY.MAX,
          recommendedCapacity: {
            min: MENTOR_CAPACITY.RECOMMENDED_MIN,
            max: MENTOR_CAPACITY.RECOMMENDED_MAX,
          },
          canAcceptMore,
          capacityStatus,
          message: messages[capacityStatus],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentor capacity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentor capacity',
      },
      { status: 500 }
    );
  }
}
