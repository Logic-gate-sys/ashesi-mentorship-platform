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
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#/libs_schemas/middlewares/auth.middleware';
import {
  getSessionFeedback,
  createSessionFeedback,
  updateSessionFeedback,
  deleteSessionFeedback,
} from '#services/feedback.service';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#/libs_schemas/caches/cacheEngine';

/**
 * GET - Get feedback for a session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;

    const cacheKey = buildCacheKey('session-feedback', sessionId);
    const cached = getFromTTLCache<Awaited<ReturnType<typeof getSessionFeedback>>>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Feedback retrieved successfully');
    }

    const feedback = await getSessionFeedback(sessionId);

    if (!feedback) {
      return errorResponse('Feedback not found', { status: 404 });
    }

    setTTLCache(cacheKey, feedback, {
      ttl: CacheTTL.SHORT,
      tags: [`session:${sessionId}`, `user:${user.id}`, 'mentor:feedback', 'mentee:feedback'],
    });

    return successResponse(feedback, 'Feedback retrieved successfully');
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch feedback',
      { status: 500 }
    );
  }
}

/**
 * POST - Create feedback for a session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating) {
      return errorResponse('Missing required field: rating', { status: 400 });
    }

    const feedback = await createSessionFeedback({
      sessionId,
      rating: parseInt(rating, 10),
      comment,
    });

    invalidateCacheByTags([
      `session:${sessionId}`,
      `user:${user.id}`,
      'mentor:feedback',
      'mentee:feedback',
      'mentor:dashboard',
      'mentee:dashboard',
    ]);

    return successResponse(feedback, 'Feedback created successfully', 201);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create feedback',
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update feedback
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;

    const body = await request.json();
    const { rating, comment } = body;

    const feedback = await updateSessionFeedback(sessionId, {
      rating: rating ? parseInt(rating, 10) : undefined,
      comment,
    });

    invalidateCacheByTags([
      `session:${sessionId}`,
      `user:${user.id}`,
      'mentor:feedback',
      'mentee:feedback',
      'mentor:dashboard',
      'mentee:dashboard',
    ]);

    return successResponse(feedback, 'Feedback updated successfully');
  } catch (error) {
    console.error('Error updating feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to update feedback',
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete feedback
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;

    await deleteSessionFeedback(sessionId);

    invalidateCacheByTags([
      `session:${sessionId}`,
      `user:${user.id}`,
      'mentor:feedback',
      'mentee:feedback',
      'mentor:dashboard',
      'mentee:dashboard',
    ]);

    return successResponse(null, 'Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to delete feedback',
      { status: 500 }
    );
  }
}
