import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    // Client will remove token from storage
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error);
    return NextResponse.json(
      { errors: { message: 'Logout failed' } },
      { status: 500 }
    );
  }
}
