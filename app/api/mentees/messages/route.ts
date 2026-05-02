import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '#utils-types/utils/api-response';
import { extractUserFromRequest } from '#libs-schemas/middlewares/auth.middleware';
import { getUserConversations, getOrCreateConversation } from '#services/messages.service';
import {
  CacheTTL,
  buildCacheKey,
  getFromTTLCache,
  invalidateCacheByTags,
  setTTLCache,
} from '#libs-schemas/caches/cacheEngine';

export async function GET(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const cacheKey = buildCacheKey('mentee-conversations', user.id, limit, offset);
    const cached = getFromTTLCache<{
      conversations: Awaited<ReturnType<typeof getUserConversations>>;
      count: number;
      pagination: { limit: number; offset: number };
    }>(cacheKey);
    if (cached) {
      return successResponse(cached, 'Conversations retrieved successfully');
    }

    const conversations = await getUserConversations(user.id, limit, offset);

    const responseData = {
      conversations,
      count: conversations.length,
      pagination: { limit, offset },
    };

    setTTLCache(cacheKey, responseData, {
      ttl: CacheTTL.SHORT,
      tags: [`user:${user.id}`, 'mentee:messages', `conversations:${user.id}`],
    });

    return successResponse(
      responseData,
      'Conversations retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to fetch conversations',
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await extractUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const participantId = body?.participantId as string | undefined;

    if (!participantId) {
      return errorResponse('participantId is required', { status: 400 });
    }

    const conversation = await getOrCreateConversation(user.id, participantId);

    invalidateCacheByTags([
      `user:${user.id}`,
      `user:${participantId}`,
      `conversations:${user.id}`,
      `conversations:${participantId}`,
      'mentee:messages',
      'mentor:messages',
    ]);

    return successResponse({ conversation }, 'Conversation ready');
  } catch (error) {
    console.error('Error creating conversation:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create conversation',
      { status: 500 }
    );
  }
}