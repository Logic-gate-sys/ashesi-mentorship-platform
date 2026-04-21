/**
 * GET /api/mentors/feedback/[sessionId]
 * Get feedback for a specific session
 * 
 * POST /api/mentors/feedback/[sessionId]
 * Create feedback for a session
 * 
 * PATCH /api/mentors/feedback/[sessionId]
 * Update feedback
 * 
 * DELETE /api/mentors/feedback/[sessionId]
 * Delete feedback
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/app/_utils_and_types/utils/api-response';
import { extractUserFromRequest } from '@/app/ _libs_and_schemas/middlewares/auth.middleware';
import {
  getSessionFeedback,
  createSessionFeedback,
  updateSessionFeedback,
  deleteSessionFeedback,
} from '@/app/api/services/feedback.service';

/**
 * GET - Get feedback for a session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const feedback = await getSessionFeedback(params.sessionId);

    if (!feedback) {
      return errorResponse('Feedback not found', 404);
    }

    return successResponse(feedback, 'Feedback retrieved successfully');
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch feedback',
      500
    );
  }
}

/**
 * POST - Create feedback for a session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating) {
      return errorResponse('Missing required field: rating', 400);
    }

    const feedback = await createSessionFeedback({
      sessionId: params.sessionId,
      rating: parseInt(rating, 10),
      comment,
    });

    return successResponse(feedback, 'Feedback created successfully', 201);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create feedback',
      500
    );
  }
}

/**
 * PATCH - Update feedback
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { rating, comment } = body;

    const feedback = await updateSessionFeedback(params.sessionId, {
      rating: rating ? parseInt(rating, 10) : undefined,
      comment,
    });

    return successResponse(feedback, 'Feedback updated successfully');
  } catch (error) {
    console.error('Error updating feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update feedback',
      500
    );
  }
}

/**
 * DELETE - Delete feedback
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    await deleteSessionFeedback(params.sessionId);

    return successResponse(null, 'Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to delete feedback',
      500
    );
  }
}
