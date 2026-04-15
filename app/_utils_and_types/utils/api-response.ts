import { NextResponse, NextRequest } from 'next/server';
import { ZodError, z } from 'zod';

/**
 * API Response Utilities
 * Standardized response format for all API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  timestamp: string;
}

/**
 * Success Response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Success Response with Pagination
 */
export function paginatedResponse<T>(
  data: T[],
  limit: number,
  offset: number,
  total: number,
  status: number = 200
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Error Response
 */
export interface ErrorResponseOptions {
  status?: number;
  details?: Record<string, string>;
}

export function errorResponse(
  error: string,
  options: ErrorResponseOptions = {}
): NextResponse<ApiResponse> {
  const { status = 500, details } = options;

  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };

  if (details && Object.keys(details).length > 0) {
    response.message = JSON.stringify(details);
  }

  return NextResponse.json(response, { status });
}

/**
 * Validation Error Response
 */
export function validationErrorResponse(
  zodError: ZodError
): NextResponse<ApiResponse> {
  const details: Record<string, string> = {};

  zodError.issues.forEach((issue) => {
    const path = issue.path.join('.');
    details[path] = issue.message;
  });

  return errorResponse('Validation failed', {
    status: 400,
    details,
  });
}

/**
 * Not Found Response
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, { status: 404 });
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse(message, { status: 401 });
}

/**
 * Forbidden Response
 */
export function forbiddenResponse(
  message: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse(message, { status: 403 });
}

/**
 * Conflict Response
 */
export function conflictResponse(
  message: string = 'Conflict'
): NextResponse<ApiResponse> {
  return errorResponse(message, { status: 409 });
}

/**
 * Server Error Response
 */
export function serverErrorResponse(
  error: Error,
  message: string = 'Internal server error'
): NextResponse<ApiResponse> {
  console.error(message, error);
  return errorResponse(message, { status: 500 });
}

/**
 * Safely parse and validate request body
 */
export async function parseRequestBody<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: validationErrorResponse(result.error),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    return {
      success: false,
      error: errorResponse('Invalid JSON in request body', { status: 400 }),
    };
  }
}

/**
 * Safely parse query parameters
 */
export function parseQueryParams<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: NextResponse } {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, any> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const result = schema.safeParse(params);

    if (!result.success) {
      return {
        success: false,
        error: validationErrorResponse(result.error),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    return {
      success: false,
      error: errorResponse('Invalid query parameters', { status: 400 }),
    };
  }
}
