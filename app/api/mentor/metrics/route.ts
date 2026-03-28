import { NextRequest, NextResponse } from 'next/server';

interface MetricItem {
  value: string | number;
  label: string;
}

/**
 * GET /api/mentor/metrics
 * 
 * Fetches mentor impact metrics (mentees, sessions, hours, rating)
 * 
 * Query params:
 * - mentorId: string (optional, defaults to current user)
 * 
 * Response:
 * {
 *   success: boolean
 *   data: MetricItem[]
 *   error?: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: In production, extract mentorId from JWT token
    const searchParams = request.nextUrl.searchParams;
    const mentorId = searchParams.get('mentorId') || 'current-user';

    // TODO: Replace with actual database query
    // For now, return mock data
    const metrics: MetricItem[] = [
      {
        value: '8',
        label: 'Active Mentees',
      },
      {
        value: '32',
        label: 'Sessions',
      },
      {
        value: '24h',
        label: 'Hours/Month',
      },
      {
        value: '4.8',
        label: 'Rating',
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentor metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch mentor metrics',
      },
      { status: 500 }
    );
  }
}
